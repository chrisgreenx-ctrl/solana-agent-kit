const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface ConfigStatus {
  openRouterApiKey: boolean;
  rpcUrl: boolean;
  solanaPrivateKey: boolean;
  isFullyConfigured: boolean;
  model: string;
}

interface AgentStatus {
  configured: boolean;
  walletAddress: string | null;
  availableActions: Array<{ name: string; description: string }>;
}

interface WalletInfo {
  address: string;
  balance: number;
}

interface Action {
  name: string;
  description: string;
  similes?: string[];
}

export const api = {
  async getStatus(): Promise<AgentStatus> {
    const res = await fetch(`${API_URL}/api/status`);
    return res.json();
  },

  async getConfig(): Promise<ConfigStatus> {
    const res = await fetch(`${API_URL}/api/config`);
    return res.json();
  },

  async updateConfig(config: Partial<{
    openRouterApiKey: string;
    rpcUrl: string;
    solanaPrivateKey: string;
    model: string;
  }>) {
    const res = await fetch(`${API_URL}/api/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  async getWallet(): Promise<WalletInfo> {
    const res = await fetch(`${API_URL}/api/wallet`);
    return res.json();
  },

  async getActions(): Promise<{ actions: Action[] }> {
    const res = await fetch(`${API_URL}/api/actions`);
    return res.json();
  },

  async getModels(): Promise<any> {
    const res = await fetch(`${API_URL}/api/models`);
    return res.json();
  },

  async executeAction(actionName: string, params: any) {
    const res = await fetch(`${API_URL}/api/execute-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionName, params }),
    });
    return res.json();
  },

  async *streamChat(message: string, sessionId?: string): AsyncGenerator<string, void, unknown> {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) yield data.text;
            if (data.error) throw new Error(data.error);
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  },
};
