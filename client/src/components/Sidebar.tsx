import { MessageSquare, Wallet, Image, Wrench, LayoutDashboard, Zap } from 'lucide-react'
import './Sidebar.css'

type Page = 'dashboard' | 'chat' | 'tokens' | 'nfts' | 'tools'

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
  isConfigured?: boolean
}

const menuItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chat' as Page, label: 'AI Chat', icon: MessageSquare },
  { id: 'tokens' as Page, label: 'Tokens', icon: Wallet },
  { id: 'nfts' as Page, label: 'NFTs', icon: Image },
  { id: 'tools' as Page, label: 'Tools', icon: Wrench },
]

export default function Sidebar({ currentPage, onPageChange, isConfigured }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Zap size={28} />
          <span>Solana Agent</span>
        </div>
        <div className={`status-indicator ${isConfigured ? 'online' : 'offline'}`}>
          <span className="dot"></span>
          {isConfigured ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onPageChange(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="powered-by">
          Powered by Solana Agent Kit
        </div>
      </div>
    </aside>
  )
}
