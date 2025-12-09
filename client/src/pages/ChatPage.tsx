import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertTriangle } from 'lucide-react'
import './ChatPage.css'

interface ChatPageProps {
  status: any
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage({ status }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.text) {
                  assistantMessage.content += data.text
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
                    )
                  )
                }
                if (data.sessionId) {
                  setSessionId(data.sessionId)
                }
                if (data.error) {
                  assistantMessage.content = `Error: ${data.error}`
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m
                    )
                  )
                }
              } catch (e) {
              }
            }
          }
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${error.message}`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!status?.configured) {
    return (
      <div className="chat-page">
        <div className="page-header">
          <h1>AI Chat</h1>
          <p>Chat with your Solana Agent</p>
        </div>
        <div className="alert alert-warning">
          <AlertTriangle size={24} />
          <div>
            <h4>Configuration Required</h4>
            <p>Please configure your environment variables to use the AI Chat feature.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      <div className="page-header">
        <h1>AI Chat</h1>
        <p>Chat with your Solana Agent to execute blockchain operations</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <Bot size={48} />
              <h3>Welcome to Solana Agent Chat</h3>
              <p>Ask me anything about Solana operations:</p>
              <div className="suggestions">
                <button onClick={() => setInput("What's my SOL balance?")}>
                  What's my SOL balance?
                </button>
                <button onClick={() => setInput("Show me my wallet address")}>
                  Show my wallet address
                </button>
                <button onClick={() => setInput("What can you help me with?")}>
                  What can you help me with?
                </button>
                <button onClick={() => setInput("Get the current price of SOL")}>
                  Get SOL price
                </button>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className="message-content">
                <pre>{message.content}</pre>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about token transfers, NFT minting, prices..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()} className="send-btn">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
