'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from "framer-motion";

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
        "Hi there! I'm your Olympic Weightlifting AI assistant. I can help with technique, programming, competitions, and gear recommendations. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
          "I'm having trouble connecting. Please check the service and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Chat cleared. Ready to help with your training!",
        timestamp: new Date(),
      },
    ])
    setRecommendations({})
  }

  return (
    <>
     {/* Chat Button */}
{!isOpen && (
  <motion.button
    onClick={() => setIsOpen(true)}
    className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-transparent"
    aria-label="Open chat"
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <motion.img
      src="/robot.png"
      alt="LiftBot"
      className="w-20 h-20 object-contain select-none pointer-events-none"
      animate={{
        y: [0, -6, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.button>
)}


    

{/* Chat Window */} {isOpen && ( <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[480px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200"> {/* Header */} <div className="bg-blue-600 px-3 py-2.5 flex items-center justify-between"> <div className="flex items-center gap-2"> <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1"> <img src="/robot.png" alt="LiftBot" className="w-full h-full object-contain" /> </div> <div> <h3 className="font-semibold text-white text-sm">LiftBot</h3> <p className="text-xs text-blue-100">AI Assistant</p> </div> </div> <div className="flex items-center gap-0.5"> <button onClick={clearChat} className="p-1.5 hover:bg-white/20 rounded transition text-white" title="Clear chat" > <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> </svg> </button> <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded transition text-white" > <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> </svg> </button> </div> </div>



          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mr-2 flex-shrink-0 shadow-sm p-1">
                    <img 
                      src="/robot.png" 
                      alt="LiftBot" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-400'
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
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center mr-2 shadow-sm p-1">
                  <img 
                    src="/robot.png" 
                    alt="LiftBot" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.products && recommendations.products.length > 0 && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-xs mb-2 text-gray-700 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Recommended Gear
                </h4>
                <div className="space-y-1.5">
                  {recommendations.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition text-xs"
                    >
                      <span className="text-gray-900">{product.name}</span>
                      <span className="font-semibold text-blue-600">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.events && recommendations.events.length > 0 && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-xs mb-2 text-gray-700 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming Events
                </h4>
                <div className="space-y-1.5">
                  {recommendations.events.map((event) => (
                    <div
                      key={event.id}
                      className="p-2 hover:bg-gray-50 rounded transition"
                    >
                      <p className="text-xs font-medium text-gray-900">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.athletes && recommendations.athletes.length > 0 && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-xs mb-2 text-gray-700 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Featured Athletes
                </h4>
                <div className="space-y-1.5">
                  {recommendations.athletes.map((athlete) => (
                    <div
                      key={athlete.id}
                      className="p-2 hover:bg-gray-50 rounded transition"
                    >
                      <p className="text-xs font-medium text-gray-900">{athlete.name}</p>
                      <p className="text-xs text-gray-500">{athlete.sport}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-100 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}