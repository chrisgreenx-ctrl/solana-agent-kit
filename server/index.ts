import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import NFTPlugin from "@solana-agent-kit/plugin-nft";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import {
  KeypairWallet,
  SolanaAgentKit,
  createVercelAITools,
} from "solana-agent-kit";
import { randomUUID } from "node:crypto";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type Message } from "ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

interface RuntimeConfig {
  openRouterApiKey: string | null;
  rpcUrl: string | null;
  solanaPrivateKey: string | null;
  model: string | null;
}

let runtimeConfig: RuntimeConfig = {
  openRouterApiKey: null,
  rpcUrl: null,
  solanaPrivateKey: null,
  model: null,
};

let agent: SolanaAgentKit | null = null;

function getEffectiveConfig() {
  return {
    openRouterApiKey: runtimeConfig.openRouterApiKey || process.env.OPENROUTER_API_KEY || null,
    rpcUrl: runtimeConfig.rpcUrl || process.env.RPC_URL || null,
    solanaPrivateKey: runtimeConfig.solanaPrivateKey || process.env.SOLANA_PRIVATE_KEY || null,
  };
}

function initializeAgent(): SolanaAgentKit | null {
  const config = getEffectiveConfig();
  
  if (!config.openRouterApiKey || !config.rpcUrl || !config.solanaPrivateKey) {
    const missing = [];
    if (!config.openRouterApiKey) missing.push("OpenRouter API Key");
    if (!config.rpcUrl) missing.push("RPC URL");
    if (!config.solanaPrivateKey) missing.push("Solana Private Key");
    console.warn("Missing config:", missing.join(", "));
    return null;
  }

  try {
    const keyPair = Keypair.fromSecretKey(
      bs58.decode(config.solanaPrivateKey)
    );
    const wallet = new KeypairWallet(keyPair, config.rpcUrl);

    return new SolanaAgentKit(wallet, config.rpcUrl, {
      OPENAI_API_KEY: config.openRouterApiKey,
    })
      .use(TokenPlugin)
      .use(NFTPlugin);
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    return null;
  }
}

agent = initializeAgent();

app.get("/api/models", async (req, res) => {
  const config = getEffectiveConfig();
  const apiKey = config.openRouterApiKey;
  
  if (!apiKey) {
    return res.status(400).json({ error: "OpenRouter API key not configured" });
  }
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/config", (req, res) => {
  const config = getEffectiveConfig();
  res.json({
    openRouterApiKey: !!config.openRouterApiKey,
    rpcUrl: !!config.rpcUrl,
    solanaPrivateKey: !!config.solanaPrivateKey,
    isFullyConfigured: !!(config.openRouterApiKey && config.rpcUrl && config.solanaPrivateKey),
    model: runtimeConfig.model || 'openai/gpt-4o',
  });
});

app.post("/api/config", (req, res) => {
  const { openRouterApiKey, rpcUrl, solanaPrivateKey, model } = req.body;
  
  if (openRouterApiKey !== undefined) {
    runtimeConfig.openRouterApiKey = openRouterApiKey || null;
  }
  if (rpcUrl !== undefined) {
    runtimeConfig.rpcUrl = rpcUrl || null;
  }
  if (solanaPrivateKey !== undefined) {
    runtimeConfig.solanaPrivateKey = solanaPrivateKey || null;
  }
  if (model !== undefined) {
    runtimeConfig.model = model;
  }
  
  agent = initializeAgent();
  
  const config = getEffectiveConfig();
  res.json({
    success: true,
    openRouterApiKey: !!config.openRouterApiKey,
    rpcUrl: !!config.rpcUrl,
    solanaPrivateKey: !!config.solanaPrivateKey,
    isFullyConfigured: !!(config.openRouterApiKey && config.rpcUrl && config.solanaPrivateKey),
    agentInitialized: agent !== null,
  });
});

app.get("/api/status", (req, res) => {
  const isConfigured = agent !== null;
  res.json({
    configured: isConfigured,
    walletAddress: isConfigured ? agent!.wallet.publicKey.toString() : null,
    availableActions: isConfigured ? agent!.actions.map((a) => ({
      name: a.name,
      description: a.description,
    })) : [],
  });
});

app.get("/api/wallet", async (req, res) => {
  if (!agent) {
    return res.status(503).json({ error: "Agent not configured" });
  }

  try {
    const publicKey = agent.wallet.publicKey.toString();
    const connection = agent.connection;
    const balance = await connection.getBalance(agent.wallet.publicKey);
    
    res.json({
      address: publicKey,
      balance: balance / 1e9,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/actions", (req, res) => {
  if (!agent) {
    return res.status(503).json({ error: "Agent not configured" });
  }

  const actions = agent.actions.map((action) => ({
    name: action.name,
    description: action.description,
    similes: action.similes,
  }));

  res.json({ actions });
});

const chatSessions: Map<string, Message[]> = new Map();

app.post("/api/chat", async (req, res) => {
  if (!agent) {
    return res.status(503).json({ error: "Agent not configured" });
  }

  const { message, sessionId = randomUUID() } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const config = getEffectiveConfig();
  if (!config.openRouterApiKey) {
    return res.status(503).json({ error: "OpenRouter API key not configured" });
  }

  try {
    const tools = createVercelAITools(agent, agent.actions);
    const openrouter = createOpenAI({
      apiKey: config.openRouterApiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    let messages = chatSessions.get(sessionId) || [];
    messages.push({
      content: message,
      id: randomUUID(),
      role: "user",
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Session-Id", sessionId);

    const modelId = runtimeConfig.model || 'openai/gpt-4o';
    const response = streamText({
      model: openrouter(modelId),
      tools,
      messages,
      system: `You are a helpful Solana blockchain assistant powered by the Solana Agent Kit. You can interact with the Solana blockchain using your available tools.

Available capabilities:
- Token Operations: Check balances, transfer tokens, swap tokens via Jupiter, fetch prices
- NFT Operations: Deploy collections, mint NFTs, list for sale on Tensor, search assets by creator
- Trading: Use TRADE action for Jupiter swaps between tokens
- Wallet Management: Get addresses, request faucet funds, check network TPS

When a user asks about blockchain operations, use the appropriate tools. Be concise and helpful.
If you encounter errors, explain them clearly and suggest alternatives.
Always confirm transaction details before executing them.`,
      maxSteps: 10,
    });

    let fullResponse = "";
    for await (const textPart of response.textStream) {
      fullResponse += textPart;
      res.write(`data: ${JSON.stringify({ text: textPart })}\n\n`);
    }

    messages.push({
      content: fullResponse,
      id: randomUUID(),
      role: "assistant",
    });
    chatSessions.set(sessionId, messages);

    res.write(`data: ${JSON.stringify({ done: true, sessionId })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Chat error:", error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

const ACTION_NAME_MAP: Record<string, string> = {
  'SEND_TRANSFER': 'TRANSFER',
  'JUPITER_SWAP': 'TRADE',
  'FETCH_PRICE': 'FETCH_PRICE',
  'DEPLOY_COLLECTION': 'DEPLOY_COLLECTION',
  'MINT_NFT': 'MINT_NFT',
  'LIST_NFT_FOR_SALE': 'LIST_NFT_FOR_SALE',
  'GET_ASSETS_BY_CREATOR': 'GET_ASSETS_BY_CREATOR',
  'FETCH_TOKEN_DETAILED_REPORT': 'FETCH_PRICE',
  'FETCH_PYTH_PRICE': 'FETCH_PRICE',
  'REQUEST_FAUCET_FUNDS': 'REQUEST_FUNDS',
  'GET_TPS': 'GET_TPS',
};

app.post("/api/execute-action", async (req, res) => {
  if (!agent) {
    return res.status(503).json({ error: "Agent not configured" });
  }

  const { actionName, params } = req.body;

  if (!actionName) {
    return res.status(400).json({ error: "Action name is required" });
  }

  try {
    const mappedName = ACTION_NAME_MAP[actionName] || actionName;
    
    const action = agent.actions.find((a) => 
      a.name === mappedName || 
      a.name.toLowerCase() === mappedName.toLowerCase() ||
      a.name === actionName ||
      a.name.toLowerCase() === actionName.toLowerCase()
    );
    
    if (!action) {
      const availableActions = agent.actions.map(a => a.name).join(', ');
      return res.status(404).json({ 
        error: `Action '${actionName}' (mapped to '${mappedName}') not found. Available: ${availableActions.slice(0, 500)}...`
      });
    }

    const result = await action.handler(agent, params || {});
    res.json({ success: true, result });
  } catch (error: any) {
    console.error("Action error:", error);
    res.status(500).json({ error: error.message });
  }
});

const isProduction = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT || (isProduction ? 5000 : 3001));

if (isProduction) {
  const clientDistPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDistPath));
  
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? "production" : "development"}`);
  console.log(`Agent configured: ${agent !== null}`);
  if (agent) {
    console.log(`Wallet: ${agent.wallet.publicKey.toString()}`);
    console.log(`Available actions: ${agent.actions.length}`);
  }
});
