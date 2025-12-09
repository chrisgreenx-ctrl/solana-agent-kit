import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { 
  Shield, Activity, Droplets, Zap, AlertTriangle, 
  CheckCircle, Loader2, Search, FileText
} from 'lucide-react'
import './ToolsPage.css'

interface ToolsPageProps {
  status: any
}

export default function ToolsPage({ status }: ToolsPageProps) {
  const [activeTab, setActiveTab] = useState<'security' | 'oracle' | 'faucet' | 'actions'>('security')
  
  const [securityToken, setSecurityToken] = useState('')
  const [oracleToken, setOracleToken] = useState('SOL')

  const { data: actions } = useQuery({
    queryKey: ['actions'],
    queryFn: async () => {
      const res = await fetch('/api/actions')
      return res.json()
    },
    enabled: status?.configured,
  })

  const executeMutation = useMutation({
    mutationFn: async ({ actionName, params }: { actionName: string; params: any }) => {
      const res = await fetch('/api/execute-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionName, params }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    },
  })

  const handleSecurityCheck = () => {
    executeMutation.mutate({
      actionName: 'FETCH_PRICE',
      params: { tokenId: securityToken },
    })
  }

  const handleOraclePrice = () => {
    executeMutation.mutate({
      actionName: 'FETCH_PRICE',
      params: { tokenId: oracleToken },
    })
  }

  const handleFaucet = () => {
    executeMutation.mutate({
      actionName: 'REQUEST_FAUCET_FUNDS',
      params: {},
    })
  }

  const handleGetTPS = () => {
    executeMutation.mutate({
      actionName: 'GET_TPS',
      params: {},
    })
  }

  if (!status?.configured) {
    return (
      <div className="tools-page">
        <div className="page-header">
          <h1>Tools & Utilities</h1>
          <p>Security checks, oracles, and network tools</p>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle size={24} />
          <div>
            <h4>Configuration Required</h4>
            <p>Please configure your environment variables to use the tools.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tools-page">
      <div className="page-header">
        <h1>Tools & Utilities</h1>
        <p>Price lookups, network tools, and available actions</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={18} /> Price Lookup
        </button>
        <button 
          className={`tab ${activeTab === 'oracle' ? 'active' : ''}`}
          onClick={() => setActiveTab('oracle')}
        >
          <Activity size={18} /> Token Prices
        </button>
        <button 
          className={`tab ${activeTab === 'faucet' ? 'active' : ''}`}
          onClick={() => setActiveTab('faucet')}
        >
          <Droplets size={18} /> Faucet/TPS
        </button>
        <button 
          className={`tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <FileText size={18} /> All Actions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'security' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Shield size={20} /></div>
              <h3>Token Price Lookup</h3>
            </div>
            <p className="card-description">
              Look up token price data. Use the AI Chat for detailed security analysis.
            </p>
            <div className="form">
              <div className="input-group">
                <label>Token Mint Address</label>
                <input
                  type="text"
                  value={securityToken}
                  onChange={(e) => setSecurityToken(e.target.value)}
                  placeholder="Token mint address"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSecurityCheck}
                disabled={!securityToken || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Search size={18} />}
                Check Security
              </button>
            </div>
          </div>
        )}

        {activeTab === 'oracle' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Activity size={20} /></div>
              <h3>Token Price Feed</h3>
            </div>
            <p className="card-description">
              Get real-time token price data from Jupiter.
            </p>
            <div className="form">
              <div className="input-group">
                <label>Token Symbol</label>
                <input
                  type="text"
                  value={oracleToken}
                  onChange={(e) => setOracleToken(e.target.value)}
                  placeholder="SOL, BTC, ETH..."
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleOraclePrice}
                disabled={!oracleToken || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Activity size={18} />}
                Get Price
              </button>
            </div>
          </div>
        )}

        {activeTab === 'faucet' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Droplets size={20} /></div>
              <h3>Network Tools</h3>
            </div>
            <div className="tools-grid">
              <div className="tool-item">
                <h4>Request Faucet Funds</h4>
                <p>Get test SOL for devnet/testnet development.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={handleFaucet}
                  disabled={executeMutation.isPending}
                >
                  {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Droplets size={18} />}
                  Request Funds
                </button>
              </div>
              <div className="tool-item">
                <h4>Check Network TPS</h4>
                <p>Get current transactions per second on Solana.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={handleGetTPS}
                  disabled={executeMutation.isPending}
                >
                  {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Zap size={18} />}
                  Get TPS
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><FileText size={20} /></div>
              <h3>All Available Actions</h3>
            </div>
            <p className="card-description">
              Complete list of all actions available through the Solana Agent Kit.
            </p>
            <div className="actions-grid">
              {actions?.actions?.map((action: any, idx: number) => (
                <div key={idx} className="action-card">
                  <h4>{action.name}</h4>
                  <p>{action.description?.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {executeMutation.isSuccess && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            <div>
              <h4>Success!</h4>
              <pre>{JSON.stringify(executeMutation.data?.result, null, 2)}</pre>
            </div>
          </div>
        )}

        {executeMutation.isError && (
          <div className="alert alert-error">
            <AlertTriangle size={20} />
            <div>
              <h4>Error</h4>
              <p>{executeMutation.error?.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
