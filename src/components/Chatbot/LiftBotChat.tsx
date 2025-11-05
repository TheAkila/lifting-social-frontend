'use client'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Recommendation {
  products?: Array<{ id: string; name: string; price: number }>
  events?: Array<{ id: string; name: string; date: string }>
  athletes?: Array<{ id: string; name: string; sport: string }>
}

export default function OlympicWeightliftingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hey lifter! 🤖 I'm LiftBot — your Olympic Weightlifting AI coach! 🏋️ I can help you with technique tips, programming ideas, event updates, and even recommend gear. What would you like to work on today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        conversationHistory,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content:
          "⚠️ Sorry, I'm having trouble connecting right now. Please make sure the AI service is running and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Chat cleared! 🚀 LiftBot is ready to guide your next Olympic weightlifting session!",
        timestamp: new Date(),
      },
    ])
    setRecommendations({})
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-700 to-slate-800 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-900/50 transform hover:scale-110 transition-all duration-300 group border-2 border-blue-800 flex items-center justify-center"
          aria-label="Open chat"
        >
          <img
            src="/robot.png"
            alt="LiftBot"
            className="w-9 h-9 animate-bounce"
          />
          <span className="absolute -top-1 -right-1 bg-green-400 w-3 h-3 rounded-full animate-pulse border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-4 border-slate-900">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-5 flex items-center justify-between border-b-4 border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-blue-800">
                <img
                  src="/robot.png"
                  alt="LiftBot avatar"
                  className="w-10 h-10 animate-[float_3s_ease-in-out_infinite]"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">LiftBot</h3>
                <p className="text-xs opacity-90 font-medium">
                  Olympic Weightlifting AI Coach
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
                title="Clear chat"
              >
                🧹
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110"
              >
                ❌
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-900 to-slate-800 text-white border-2 border-blue-800'
                      : 'bg-white text-gray-900 border-2 border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user'
                        ? 'text-blue-200'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-blue-900 rounded-full animate-bounce"></div>
                    <div
                      className="w-2.5 h-2.5 bg-blue-900 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2.5 h-2.5 bg-blue-900 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.products && recommendations.products.length > 0 && (
              <div className="bg-white border-2 border-blue-900 rounded-xl p-4 shadow-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  🏋️ Recommended Equipment
                </h4>
                <div className="space-y-2">
                  {recommendations.products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-gradient-to-r from-slate-50 to-blue-50 p-3 rounded-lg border border-slate-200 hover:border-blue-900 transition-colors"
                    >
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-blue-900 font-bold">${product.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.events && recommendations.events.length > 0 && (
              <div className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  🏆 Upcoming Competitions
                </h4>
                <div className="space-y-2">
                  {recommendations.events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gradient-to-r from-slate-50 to-gray-100 p-3 rounded-lg border border-slate-200 hover:border-slate-900 transition-colors"
                    >
                      <p className="font-semibold text-gray-900">
                        {event.name}
                      </p>
                      <p className="text-slate-700 font-medium text-sm">
                        {event.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.athletes &&
              recommendations.athletes.length > 0 && (
                <div className="bg-white border-2 border-blue-900 rounded-xl p-4 shadow-lg">
                  <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    🥇 Featured Athletes
                  </h4>
                  <div className="space-y-2">
                    {recommendations.athletes.map((athlete) => (
                      <div
                        key={athlete.id}
                        className="bg-gradient-to-r from-blue-50 to-slate-50 p-3 rounded-lg border border-blue-200 hover:border-blue-900 transition-colors"
                      >
                        <p className="font-semibold text-gray-900">
                          {athlete.name}
                        </p>
                        <p className="text-blue-900 font-medium text-sm">
                          {athlete.sport}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-900 border-t-4 border-blue-800">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask LiftBot anything about your training..."
                className="flex-1 resize-none border-2 border-slate-700 bg-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-500"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl px-5 py-2 hover:shadow-xl hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 self-end border-2 border-blue-700 font-semibold"
              >
                🚀
              </button>
            </div>
            <p className="text-xs text-blue-200 mt-2 font-medium">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  )
}
