"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Sparkles } from "lucide-react"
import { useChatStore } from "./chat-store"

// Pre-generated deterministic particle positions
const PARTICLES = [
  { id: 0, top: "25%", left: "30%", delay: 0 },
  { id: 1, top: "40%", left: "55%", delay: 0.3 },
  { id: 2, top: "60%", left: "35%", delay: 0.6 },
  { id: 3, top: "35%", left: "65%", delay: 0.9 },
  { id: 4, top: "55%", left: "50%", delay: 1.2 },
]

export default function ChatWidget() {
  const { isOpen, toggleChat, unreadCount } = useChatStore()

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-purple-500 blur-xl opacity-40 animate-pulse" />
          
          {/* Main button */}
          <motion.button
            onClick={toggleChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-full
                      bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600
                      shadow-lg shadow-purple-500/30
                      flex items-center justify-center
                      overflow-hidden group"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600
                           opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating particles */}
            {PARTICLES.map((particle) => (
              <motion.div
                key={particle.id}
                animate={{
                  y: [-5, 5, -5],
                  x: [-2, 2, -2],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: particle.delay
                }}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{ top: particle.top, left: particle.left }}
              />
            ))}
            
            {/* Icon */}
            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            {/* Unread badge */}
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full
                          bg-red-500 border-2 border-white
                          flex items-center justify-center
                          text-white text-xs font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2
                      whitespace-nowrap hidden lg:block"
          >
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg
                           shadow-lg border border-purple-500/20
                           text-sm relative">
              <span className="text-purple-300">✨</span> Chat with Jyoti
              
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full
                            border-8 border-transparent border-l-gray-900" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
