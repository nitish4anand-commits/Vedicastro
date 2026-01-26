"use client"

import { useEffect, useRef, useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, ThumbsUp, ThumbsDown, Check, CheckCheck, ArrowRight } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useChatStore } from "./chat-store"
import { ChatMessage } from "./chat-types"
import TypingIndicator from "./typing-indicator"
import MeditationCard from "./meditation-card"
import CrisisSupportCard from "./crisis-support-card"

export default function ChatMessages() {
  const { messages, isTyping, showSuggestions, suggestions, addMessage } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate random star positions only once
  const stars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`
    }))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleSuggestionClick = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      status: 'sent'
    }
    addMessage(userMessage)
    
    // Trigger chat API
    try {
      useChatStore.getState().setTyping(true)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.slice(-10)
        })
      })
      
      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        quickActions: data.quickActions,
        hasAstroInsight: data.hasAstroInsight,
        messageType: data.messageType || 'text'
      }
      addMessage(botMessage)
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      useChatStore.getState().setTyping(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {/* Starfield background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle opacity-40"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Welcome message if no messages */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full
                         bg-gradient-to-br from-purple-400 to-pink-400
                         flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Namaste! I&apos;m Jyoti ✨
          </h3>
          <p className="text-purple-200 text-sm max-w-xs mx-auto mb-6">
            Your cosmic companion for astrology insights, emotional support, and life guidance.
          </p>
          
          {/* Suggestions */}
          {showSuggestions && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="px-4 py-2 rounded-full text-sm
                            bg-purple-500/20 hover:bg-purple-500/30
                            text-purple-200 border border-purple-400/30
                            transition-all duration-200 hover:scale-105"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        message.role === 'user' ? (
          <UserMessage key={message.id} message={message} formatTime={formatTime} />
        ) : (
          <BotMessage key={message.id} message={message} formatTime={formatTime} />
        )
      ))}

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}

function UserMessage({ message, formatTime }: { message: ChatMessage; formatTime: (date: Date) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-end relative z-10"
    >
      <div className="max-w-[80%]">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600
                       rounded-3xl rounded-tr-md px-4 py-3 shadow-lg">
          <p className="text-white text-sm leading-relaxed">
            {message.content}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 mt-1 px-2">
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          {message.status === 'sent' && <Check className="w-3 h-3 text-gray-400" />}
          {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-400" />}
        </div>
      </div>
    </motion.div>
  )
}

function BotMessage({ message, formatTime }: { message: ChatMessage; formatTime: (date: Date) => string }) {
  // Handle special message types
  if (message.messageType === 'meditation') {
    return <MeditationCard />
  }
  
  if (message.messageType === 'crisis-support') {
    return <CrisisSupportCard />
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex justify-start gap-2 relative z-10"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400
                     flex items-center justify-center flex-shrink-0 mt-1">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      
      <div className="max-w-[80%]">
        <div className="bg-gray-800/60 backdrop-blur-sm
                       rounded-3xl rounded-tl-md px-4 py-3
                       border border-purple-500/20 shadow-lg">
          
          {/* Message content with markdown support */}
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }: { children?: React.ReactNode }) => (
                  <p className="text-gray-100 leading-relaxed mb-2 last:mb-0 text-sm">
                    {children}
                  </p>
                ),
                strong: ({ children }: { children?: React.ReactNode }) => (
                  <strong className="text-purple-300 font-semibold">{children}</strong>
                ),
                em: ({ children }: { children?: React.ReactNode }) => (
                  <em className="text-purple-200">{children}</em>
                ),
                ul: ({ children }: { children?: React.ReactNode }) => (
                  <ul className="list-disc list-inside space-y-1 my-2 text-sm">{children}</ul>
                ),
                ol: ({ children }: { children?: React.ReactNode }) => (
                  <ol className="list-decimal list-inside space-y-1 my-2 text-sm">{children}</ol>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Quick action buttons if present */}
          {message.quickActions && message.quickActions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.quickActions.map((action) => (
                <button
                  key={action.id}
                  className="px-3 py-1.5 rounded-full text-xs
                            bg-purple-500/20 hover:bg-purple-500/30
                            text-purple-200 border border-purple-400/30
                            transition-all duration-200 hover:scale-105"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Astrological insight badge if present */}
          {message.hasAstroInsight && (
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span>Astrological insight included</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 px-2">
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
          </span>
          
          {/* Helpful/Not helpful buttons */}
          <div className="flex gap-1 ml-2">
            <button 
              className="text-gray-400 hover:text-green-400 transition-colors"
              title="Helpful"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button 
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Not helpful"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
