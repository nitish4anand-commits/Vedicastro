"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start gap-2"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400
                     flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      
      {/* Typing bubble */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-3xl rounded-tl-md
                     px-5 py-4 border border-purple-500/20">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity,
              delay: 0
            }}
            className="w-2 h-2 rounded-full bg-purple-400"
          />
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity,
              delay: 0.2
            }}
            className="w-2 h-2 rounded-full bg-purple-400"
          />
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity,
              delay: 0.4
            }}
            className="w-2 h-2 rounded-full bg-purple-400"
          />
        </div>
      </div>
      
      {/* "Jyoti is thinking" text */}
      <span className="text-xs text-purple-300 self-end mb-1 italic">
        thinking...
      </span>
    </motion.div>
  )
}
