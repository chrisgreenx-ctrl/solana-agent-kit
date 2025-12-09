# Solana Agent Kit GUI

A complete web-based GUI suite that leverages all functionality from the Solana Agent Kit v2.

## Overview

This project provides a modern React-based web interface for interacting with the Solana blockchain through the Solana Agent Kit. It includes an AI-powered chat interface and dedicated panels for token and NFT operations.

## Architecture

### Frontend (React + Vite)
- **Location**: `client/`
- **Port**: 5000
- **Tech Stack**: React 19, TypeScript, TanStack Query, Lucide Icons

### Backend (Express + Solana Agent Kit)
- **Location**: `server/`
- **Port**: 3001
- **Tech Stack**: Express, Solana Agent Kit v2, OpenAI

## Features

### Token Operations (Token Plugin)
- Get wallet balance
- Transfer SOL/tokens
- Swap tokens via Jupiter
- Fetch token prices
- Token security analysis (Rugcheck)
- Pyth oracle price feeds
- Request faucet funds
- Get network TPS

### NFT Operations (NFT Plugin)
- Deploy NFT collections
- Mint NFTs to collections
- List NFTs for sale (Tensor)
- Search assets by creator
- Get assets by authority

### AI Chat
- Natural language blockchain operations
- Streaming responses
- Session persistence
- All toolkit actions available

## Environment Variables Required

```
OPENAI_API_KEY=your_openai_key
RPC_URL=your_solana_rpc_url
SOLANA_PRIVATE_KEY=your_base58_encoded_private_key
```

## Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Sidebar.tsx
│   │   │   └── Sidebar.css
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── TokensPage.tsx
│   │   │   ├── NFTsPage.tsx
│   │   │   └── ToolsPage.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
├── server/
│   └── index.ts           # Express API server
├── package.json           # Root package config
└── replit.md             # This file
```

## API Endpoints

- `GET /api/status` - Check agent configuration status
- `GET /api/wallet` - Get wallet address and balance
- `GET /api/actions` - List all available actions
- `POST /api/chat` - AI chat with streaming responses
- `POST /api/execute-action` - Execute specific action directly

## Running the Project

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5000) concurrently.

## User Preferences

- Dark theme with purple/green accent colors (Solana branding)
- Responsive design for all screen sizes
- Minimal loading states with spinners
