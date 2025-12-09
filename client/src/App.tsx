import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import TokensPage from './pages/TokensPage'
import NFTsPage from './pages/NFTsPage'
import ToolsPage from './pages/ToolsPage'
import './App.css'

type Page = 'dashboard' | 'chat' | 'tokens' | 'nfts' | 'tools'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  
  const { data: status, isLoading } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await fetch('/api/status')
      return res.json()
    },
    refetchInterval: 30000,
  })

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard status={status} />
      case 'chat':
        return <ChatPage status={status} />
      case 'tokens':
        return <TokensPage status={status} />
      case 'nfts':
        return <NFTsPage status={status} />
      case 'tools':
        return <ToolsPage status={status} />
      default:
        return <Dashboard status={status} />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        isConfigured={status?.configured}
      />
      <main className="main-content">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Connecting to Solana Agent...</p>
          </div>
        ) : (
          renderPage()
        )}
      </main>
    </div>
  )
}

export default App
