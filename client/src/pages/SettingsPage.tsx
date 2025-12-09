import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Key, Globe, Wallet, Cpu, CheckCircle, AlertCircle, ExternalLink, Eye, EyeOff, Loader2 } from 'lucide-react'
import './SettingsPage.css'

interface ConfigStatus {
  openRouterApiKey: boolean
  rpcUrl: boolean
  solanaPrivateKey: boolean
  isFullyConfigured: boolean
  model?: string
}

interface OpenRouterModel {
  id: string
  name: string
}

interface ModelsResponse {
  data?: OpenRouterModel[]
  error?: string
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [openRouterApiKey, setOpenRouterApiKey] = useState('')
  const [rpcUrl, setRpcUrl] = useState('')
  const [solanaPrivateKey, setSolanaPrivateKey] = useState('')
  const [model, setModel] = useState('openai/gpt-4o')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const { data: config, isLoading } = useQuery<ConfigStatus>({
    queryKey: ['config'],
    queryFn: async () => {
      const res = await fetch('/api/config')
      return res.json()
    },
  })

  const { data: modelsData, isLoading: modelsLoading, refetch: refetchModels } = useQuery<ModelsResponse>({
    queryKey: ['models'],
    queryFn: async () => {
      const res = await fetch('/api/models')
      if (!res.ok) {
        const error = await res.json()
        return { error: error.error || 'Failed to fetch models' }
      }
      return res.json()
    },
    enabled: !!config?.openRouterApiKey,
  })

  const availableModels = modelsData?.data 
    ? [...modelsData.data].sort((a, b) => a.name.localeCompare(b.name))
    : []

  useEffect(() => {
    if (config?.model) {
      setModel(config.model)
    }
  }, [config])

  const saveMutation = useMutation({
    mutationFn: async (data: { openRouterApiKey?: string; rpcUrl?: string; solanaPrivateKey?: string; model?: string }) => {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['config'] })
      queryClient.invalidateQueries({ queryKey: ['status'] })
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        if (openRouterApiKey) {
          refetchModels()
        }
        setOpenRouterApiKey('')
        setRpcUrl('')
        setSolanaPrivateKey('')
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' })
      }
      setTimeout(() => setMessage(null), 5000)
    },
    onError: (error: any) => {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' })
      setTimeout(() => setMessage(null), 5000)
    },
  })

  const handleSave = () => {
    const data: any = { model }
    if (openRouterApiKey) data.openRouterApiKey = openRouterApiKey
    if (rpcUrl) data.rpcUrl = rpcUrl
    if (solanaPrivateKey) data.solanaPrivateKey = solanaPrivateKey
    saveMutation.mutate(data)
  }

  const ConfigStatusItem = ({ configured, label }: { configured: boolean; label: string }) => (
    <div className={`config-status-item ${configured ? 'configured' : 'not-configured'}`}>
      {configured ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span>{label}</span>
    </div>
  )

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your Solana Agent and AI model preferences</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="settings-grid">
        <div className="card config-status-card">
          <div className="card-header">
            <div className="icon"><Settings size={20} /></div>
            <h3>Configuration Status</h3>
          </div>
          {isLoading ? (
            <div className="loading-text">Loading...</div>
          ) : (
            <div className="config-status-list">
              <ConfigStatusItem configured={config?.openRouterApiKey || false} label="OpenRouter API Key" />
              <ConfigStatusItem configured={config?.rpcUrl || false} label="RPC URL" />
              <ConfigStatusItem configured={config?.solanaPrivateKey || false} label="Solana Private Key" />
              <div className="config-model-info">
                <Cpu size={16} />
                <span>Model: {config?.model || 'openai/gpt-4o'}</span>
              </div>
            </div>
          )}
          <div className={`overall-status ${config?.isFullyConfigured ? 'ready' : 'incomplete'}`}>
            {config?.isFullyConfigured ? (
              <>
                <CheckCircle size={18} />
                <span>Agent Ready</span>
              </>
            ) : (
              <>
                <AlertCircle size={18} />
                <span>Configuration Incomplete</span>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon"><Cpu size={20} /></div>
            <h3>AI Model</h3>
          </div>
          <div className="input-group">
            <label>Select Model</label>
            {!config?.openRouterApiKey ? (
              <div className="models-message">
                <AlertCircle size={16} />
                <span>Enter your OpenRouter API key first to load available models</span>
              </div>
            ) : modelsLoading ? (
              <div className="models-loading">
                <Loader2 size={16} className="spin" />
                <span>Loading models...</span>
              </div>
            ) : modelsData?.error ? (
              <div className="models-error">
                <AlertCircle size={16} />
                <span>{modelsData.error}</span>
              </div>
            ) : (
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
            <span className="input-hint">Choose the AI model for chat interactions</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon"><Key size={20} /></div>
            <h3>OpenRouter API Key</h3>
          </div>
          <div className="input-group">
            <label>API Key {config?.openRouterApiKey && <span className="set-badge">Set</span>}</label>
            <div className="password-input-wrapper">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                placeholder={config?.openRouterApiKey ? '••••••••••••••••' : 'Enter your OpenRouter API key'}
              />
              <button 
                type="button" 
                className="toggle-visibility"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <a 
              href="https://openrouter.ai/keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              Get an API key at openrouter.ai <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon"><Globe size={20} /></div>
            <h3>RPC URL</h3>
          </div>
          <div className="input-group">
            <label>Solana RPC Endpoint {config?.rpcUrl && <span className="set-badge">Set</span>}</label>
            <input
              type="text"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder={config?.rpcUrl ? '••••••••••••••••' : 'https://api.mainnet-beta.solana.com'}
            />
            <span className="input-hint">Use a reliable RPC provider for best performance</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="icon"><Wallet size={20} /></div>
            <h3>Solana Private Key</h3>
          </div>
          <div className="input-group">
            <label>Private Key (Base58) {config?.solanaPrivateKey && <span className="set-badge">Set</span>}</label>
            <div className="password-input-wrapper">
              <input
                type={showPrivateKey ? 'text' : 'password'}
                value={solanaPrivateKey}
                onChange={(e) => setSolanaPrivateKey(e.target.value)}
                placeholder={config?.solanaPrivateKey ? '••••••••••••••••' : 'Enter your wallet private key'}
              />
              <button 
                type="button" 
                className="toggle-visibility"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className="input-hint warning">⚠️ Never share your private key. This is stored in server memory only.</span>
          </div>
        </div>
      </div>

      <div className="save-section">
        <button 
          className="btn btn-primary btn-save"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
