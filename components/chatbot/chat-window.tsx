"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, Mic, MoreVertical } from "lucide-react"
import { useChatStore } from "./chat-store"
import ChatMessages from "./chat-messages"
import ChatInput from "./chat-input"

export default function ChatWindow() {
  const { isOpen, closeChat, isTyping } = useChatStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-50
                     w-[calc(100vw-3rem)] max-w-[420px]
                     h-[calc(100vh-8rem)] max-h-[600px]
                     md:w-[420px] md:h-[600px]
                     rounded-3xl overflow-hidden
                     bg-gradient-to-b from-gray-900 to-indigo-950
                     border border-purple-500/30
                     shadow-2xl shadow-purple-500/20
                     flex flex-col"
        >
          {/* Header */}
          <header className="h-16 bg-gradient-to-r from-purple-900/50 to-indigo-900/50
                            backdrop-blur-xl border-b border-purple-500/20
                            px-4 flex items-center justify-between flex-shrink-0">
            {/* Left: Avatar + Name + Status */}
            <div className="flex items-center gap-3">
              {/* Animated Avatar */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-400
                               flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 w-3 h-3 
                                bg-green-400 rounded-full border-2 border-gray-900
                                animate-pulse" />
              </div>
              
              {/* Name and typing indicator */}
              <div>
                <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Jyoti ✨
                </h3>
                <p className="text-xs text-purple-300">
                  {isTyping ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-pulse">typing</span>
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 bg-purple-300 rounded-full animate-bounce" 
                              style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-purple-300 rounded-full animate-bounce"
                              style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-purple-300 rounded-full animate-bounce"
                              style={{ animationDelay: '300ms' }} />
                      </span>
                    </span>
                  ) : (
                    'Your cosmic companion'
                  )}
                </p>
              </div>
            </div>
            
            {/* Right: Action buttons */}
            <div className="flex items-center gap-2">
              {/* Voice call button */}
              <button 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                          flex items-center justify-center transition-colors"
                title="Voice chat"
              >
                <Mic className="w-4 h-4 text-white" />
              </button>
              
              {/* Menu button */}
              <button 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                          flex items-center justify-center transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-white" />
              </button>
              
              {/* Close button */}
              <button 
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20
                          flex items-center justify-center transition-colors"
                onClick={closeChat}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </header>

          {/* Messages Area */}
          <ChatMessages />

          {/* Input Area */}
          <ChatInput />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
