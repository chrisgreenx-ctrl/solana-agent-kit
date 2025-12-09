import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { 
  Send, RefreshCw, ArrowRightLeft, TrendingUp, 
  AlertTriangle, CheckCircle, Loader2, DollarSign, Wallet 
} from 'lucide-react'
import './TokensPage.css'

interface TokensPageProps {
  status: any
}

export default function TokensPage({ status }: TokensPageProps) {
  const [activeTab, setActiveTab] = useState<'transfer' | 'swap' | 'balance' | 'price'>('balance')
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [swapFrom, setSwapFrom] = useState('SOL')
  const [swapTo, setSwapTo] = useState('USDC')
  const [swapAmount, setSwapAmount] = useState('')
  const [priceToken, setPriceToken] = useState('SOL')

  const { data: wallet, refetch: refetchWallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await fetch('/api/wallet')
      if (!res.ok) return null
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

  const handleTransfer = () => {
    executeMutation.mutate({
      actionName: 'SEND_TRANSFER',
      params: { to: transferTo, amount: parseFloat(transferAmount) },
    })
  }

  const handleSwap = () => {
    executeMutation.mutate({
      actionName: 'JUPITER_SWAP',
      params: {
        inputMint: swapFrom === 'SOL' ? undefined : swapFrom,
        outputMint: swapTo,
        amount: parseFloat(swapAmount),
      },
    })
  }

  const handleFetchPrice = () => {
    executeMutation.mutate({
      actionName: 'FETCH_PRICE',
      params: { tokenId: priceToken },
    })
  }

  if (!status?.configured) {
    return (
      <div className="tokens-page">
        <div className="page-header">
          <h1>Token Operations</h1>
          <p>Transfer, swap, and manage your tokens</p>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle size={24} />
          <div>
            <h4>Configuration Required</h4>
            <p>Please configure your environment variables to use token operations.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tokens-page">
      <div className="page-header">
        <h1>Token Operations</h1>
        <p>Transfer, swap, and manage your tokens</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'balance' ? 'active' : ''}`}
          onClick={() => setActiveTab('balance')}
        >
          <Wallet size={18} /> Balance
        </button>
        <button 
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          <Send size={18} /> Transfer
        </button>
        <button 
          className={`tab ${activeTab === 'swap' ? 'active' : ''}`}
          onClick={() => setActiveTab('swap')}
        >
          <ArrowRightLeft size={18} /> Swap
        </button>
        <button 
          className={`tab ${activeTab === 'price' ? 'active' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          <TrendingUp size={18} /> Price
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'balance' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Wallet size={20} /></div>
              <h3>Wallet Balance</h3>
              <button className="btn btn-secondary" onClick={() => refetchWallet()}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            <div className="balance-display">
              <div className="balance-item main">
                <span className="token-name">SOL</span>
                <span className="token-balance">{wallet?.balance?.toFixed(6) || '0'}</span>
              </div>
            </div>
            <p className="balance-note">
              Use the AI Chat for detailed token balances or execute GET_TOKEN_BALANCE action.
            </p>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Send size={20} /></div>
              <h3>Transfer SOL</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Enter Solana wallet address"
                />
              </div>
              <div className="input-group">
                <label>Amount (SOL)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.001"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleTransfer}
                disabled={!transferTo || !transferAmount || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
                Transfer
              </button>
            </div>
          </div>
        )}

        {activeTab === 'swap' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><ArrowRightLeft size={20} /></div>
              <h3>Swap Tokens (Jupiter)</h3>
            </div>
            <div className="form">
              <div className="swap-inputs">
                <div className="input-group">
                  <label>From</label>
                  <select value={swapFrom} onChange={(e) => setSwapFrom(e.target.value)}>
                    <option value="SOL">SOL</option>
                    <option value="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">USDC</option>
                    <option value="Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB">USDT</option>
                  </select>
                </div>
                <div className="swap-arrow">
                  <ArrowRightLeft size={20} />
                </div>
                <div className="input-group">
                  <label>To</label>
                  <select value={swapTo} onChange={(e) => setSwapTo(e.target.value)}>
                    <option value="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v">USDC</option>
                    <option value="SOL">SOL</option>
                    <option value="Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB">USDT</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.001"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSwap}
                disabled={!swapAmount || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <ArrowRightLeft size={18} />}
                Swap
              </button>
            </div>
          </div>
        )}

        {activeTab === 'price' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><DollarSign size={20} /></div>
              <h3>Token Prices</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>Token Symbol or Address</label>
                <input
                  type="text"
                  value={priceToken}
                  onChange={(e) => setPriceToken(e.target.value)}
                  placeholder="SOL, BONK, or mint address"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleFetchPrice}
                disabled={!priceToken || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <TrendingUp size={18} />}
                Get Price
              </button>
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
