import { useQuery } from '@tanstack/react-query'
import { Wallet, Activity, Coins, Image, AlertTriangle, CheckCircle } from 'lucide-react'
import './Dashboard.css'

interface DashboardProps {
  status: any
}

export default function Dashboard({ status }: DashboardProps) {
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await fetch('/api/wallet')
      if (!res.ok) return null
      return res.json()
    },
    enabled: status?.configured,
    refetchInterval: 30000,
  })

  if (!status?.configured) {
    return (
      <div className="dashboard">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Overview of your Solana Agent Kit</p>
        </div>
        
        <div className="alert alert-warning">
          <AlertTriangle size={24} />
          <div>
            <h4>Configuration Required</h4>
            <p>Please set the following environment variables to enable the Solana Agent:</p>
            <ul>
              <li><code>OPENAI_API_KEY</code> - Your OpenAI API key</li>
              <li><code>RPC_URL</code> - Solana RPC endpoint URL</li>
              <li><code>SOLANA_PRIVATE_KEY</code> - Your wallet private key (base58 encoded)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your Solana Agent Kit</p>
      </div>

      <div className="grid grid-4 stats-grid">
        <div className="stat-card">
          <div className="stat-icon wallet">
            <Wallet size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Wallet Balance</span>
            <span className="stat-value">{wallet?.balance?.toFixed(4) || '0'} SOL</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon activity">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Status</span>
            <span className="stat-value status-active">
              <CheckCircle size={16} /> Active
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon tokens">
            <Coins size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Token Actions</span>
            <span className="stat-value">
              {status?.availableActions?.filter((a: any) => 
                a.name.includes('token') || a.name.includes('transfer') || a.name.includes('swap')
              ).length || 0}
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon nfts">
            <Image size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">NFT Actions</span>
            <span className="stat-value">
              {status?.availableActions?.filter((a: any) => 
                a.name.includes('nft') || a.name.includes('collection') || a.name.includes('mint')
              ).length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div className="icon"><Wallet size={20} /></div>
            <h3>Wallet Info</h3>
          </div>
          <div className="wallet-info">
            <div className="info-row">
              <span className="label">Address</span>
              <span className="value address">{wallet?.address || status?.walletAddress}</span>
            </div>
            <div className="info-row">
              <span className="label">Network</span>
              <span className="value">Mainnet</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon"><Activity size={20} /></div>
            <h3>Available Actions</h3>
          </div>
          <div className="actions-list">
            {status?.availableActions?.slice(0, 8).map((action: any, idx: number) => (
              <div key={idx} className="action-item">
                <span className="action-name">{action.name}</span>
              </div>
            ))}
            {status?.availableActions?.length > 8 && (
              <div className="more-actions">
                +{status.availableActions.length - 8} more actions available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card quick-actions">
        <div className="card-header">
          <h3>Quick Start</h3>
        </div>
        <p className="quick-intro">
          The Solana Agent Kit provides powerful blockchain operations through natural language. 
          Use the AI Chat to interact with your wallet, or explore the Token and NFT panels for direct actions.
        </p>
        <div className="features-grid">
          <div className="feature">
            <h4>Token Operations</h4>
            <p>Transfer SOL, swap tokens, check balances, stake with Jupiter</p>
          </div>
          <div className="feature">
            <h4>NFT Management</h4>
            <p>Deploy collections, mint NFTs, list on marketplaces</p>
          </div>
          <div className="feature">
            <h4>DeFi Tools</h4>
            <p>Price feeds, security checks, cross-chain swaps</p>
          </div>
          <div className="feature">
            <h4>AI Powered</h4>
            <p>Chat naturally to execute complex blockchain operations</p>
          </div>
        </div>
      </div>
    </div>
  )
}
