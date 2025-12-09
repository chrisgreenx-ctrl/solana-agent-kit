import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { 
  Image, Plus, Upload, Tag, AlertTriangle, 
  CheckCircle, Loader2, Palette, ShoppingBag
} from 'lucide-react'
import './NFTsPage.css'

interface NFTsPageProps {
  status: any
}

export default function NFTsPage({ status }: NFTsPageProps) {
  const [activeTab, setActiveTab] = useState<'collection' | 'mint' | 'list' | 'search'>('collection')
  
  const [collectionName, setCollectionName] = useState('')
  const [collectionUri, setCollectionUri] = useState('')
  const [collectionSymbol, setCollectionSymbol] = useState('')
  
  const [mintCollection, setMintCollection] = useState('')
  const [mintName, setMintName] = useState('')
  const [mintUri, setMintUri] = useState('')
  
  const [listNftAddress, setListNftAddress] = useState('')
  const [listPrice, setListPrice] = useState('')
  
  const [searchCreator, setSearchCreator] = useState('')

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

  const handleDeployCollection = () => {
    executeMutation.mutate({
      actionName: 'DEPLOY_COLLECTION',
      params: {
        name: collectionName,
        uri: collectionUri,
        symbol: collectionSymbol,
      },
    })
  }

  const handleMintNFT = () => {
    executeMutation.mutate({
      actionName: 'MINT_NFT',
      params: {
        collectionMint: mintCollection,
        name: mintName,
        uri: mintUri,
      },
    })
  }

  const handleListNFT = () => {
    executeMutation.mutate({
      actionName: 'LIST_NFT_FOR_SALE',
      params: {
        nftMint: listNftAddress,
        price: parseFloat(listPrice),
      },
    })
  }

  const handleSearchAssets = () => {
    executeMutation.mutate({
      actionName: 'GET_ASSETS_BY_CREATOR',
      params: {
        creatorAddress: searchCreator,
      },
    })
  }

  if (!status?.configured) {
    return (
      <div className="nfts-page">
        <div className="page-header">
          <h1>NFT Operations</h1>
          <p>Create, manage, and trade NFTs</p>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle size={24} />
          <div>
            <h4>Configuration Required</h4>
            <p>Please configure your environment variables to use NFT operations.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nfts-page">
      <div className="page-header">
        <h1>NFT Operations</h1>
        <p>Create, manage, and trade NFTs using Metaplex</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          <Palette size={18} /> Collection
        </button>
        <button 
          className={`tab ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          <Plus size={18} /> Mint
        </button>
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <ShoppingBag size={18} /> List
        </button>
        <button 
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Image size={18} /> Search
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'collection' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Palette size={20} /></div>
              <h3>Deploy NFT Collection</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>Collection Name</label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="My Awesome Collection"
                />
              </div>
              <div className="input-group">
                <label>Symbol</label>
                <input
                  type="text"
                  value={collectionSymbol}
                  onChange={(e) => setCollectionSymbol(e.target.value)}
                  placeholder="MAC"
                />
              </div>
              <div className="input-group">
                <label>Metadata URI</label>
                <input
                  type="text"
                  value={collectionUri}
                  onChange={(e) => setCollectionUri(e.target.value)}
                  placeholder="https://arweave.net/..."
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleDeployCollection}
                disabled={!collectionName || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Upload size={18} />}
                Deploy Collection
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mint' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Plus size={20} /></div>
              <h3>Mint NFT to Collection</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>Collection Mint Address</label>
                <input
                  type="text"
                  value={mintCollection}
                  onChange={(e) => setMintCollection(e.target.value)}
                  placeholder="Collection mint address"
                />
              </div>
              <div className="input-group">
                <label>NFT Name</label>
                <input
                  type="text"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  placeholder="NFT #1"
                />
              </div>
              <div className="input-group">
                <label>Metadata URI</label>
                <input
                  type="text"
                  value={mintUri}
                  onChange={(e) => setMintUri(e.target.value)}
                  placeholder="https://arweave.net/..."
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleMintNFT}
                disabled={!mintCollection || !mintName || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Plus size={18} />}
                Mint NFT
              </button>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Tag size={20} /></div>
              <h3>List NFT for Sale (Tensor)</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>NFT Mint Address</label>
                <input
                  type="text"
                  value={listNftAddress}
                  onChange={(e) => setListNftAddress(e.target.value)}
                  placeholder="NFT mint address"
                />
              </div>
              <div className="input-group">
                <label>Price (SOL)</label>
                <input
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleListNFT}
                disabled={!listNftAddress || !listPrice || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <ShoppingBag size={18} />}
                List for Sale
              </button>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="card">
            <div className="card-header">
              <div className="icon"><Image size={20} /></div>
              <h3>Search NFTs by Creator</h3>
            </div>
            <div className="form">
              <div className="input-group">
                <label>Creator Address</label>
                <input
                  type="text"
                  value={searchCreator}
                  onChange={(e) => setSearchCreator(e.target.value)}
                  placeholder="Creator wallet address"
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSearchAssets}
                disabled={!searchCreator || executeMutation.isPending}
              >
                {executeMutation.isPending ? <Loader2 size={18} className="spinning" /> : <Image size={18} />}
                Search Assets
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
