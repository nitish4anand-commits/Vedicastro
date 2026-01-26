'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quickActions?: Array<{ id: string; label: string; action: string }>
  hasAstroInsight?: boolean
}

interface MessageBubbleProps {
  message: Message
  onQuickAction?: (action: string) => void
}

export default function MessageBubble({ message, onQuickAction }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br 
                        from-purple-400 to-pink-400
                        flex items-center justify-center flex-shrink-0 mt-1
                        shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
        {/* Message Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${isUser 
              ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-md' 
              : 'bg-gray-800/80 text-gray-100 rounded-bl-md border border-gray-700/50'
            }
            ${message.hasAstroInsight ? 'ring-1 ring-purple-500/30' : ''}
          `}
        >
          {/* Content with Markdown support */}
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-invert'}`}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-purple-300">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-200">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-900/50 px-1.5 py-0.5 rounded text-purple-300 text-xs">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-purple-500 pl-3 italic text-gray-300 my-2">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <h1 className="text-lg font-bold text-white mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold text-white mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-purple-300 mb-1">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Astro insight indicator */}
          {message.hasAstroInsight && !isUser && (
            <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center gap-1 text-xs text-purple-400">
              <Sparkles className="w-3 h-3" />
              <span>Personalized insight</span>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        {message.quickActions && message.quickActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            {message.quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onQuickAction?.(action.action)}
                className="px-3 py-1.5 text-xs rounded-full
                          bg-gray-800 hover:bg-gray-700
                          text-gray-300 hover:text-white
                          border border-gray-700 hover:border-purple-500/50
                          transition-all duration-200"
              >
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
        
        {/* Timestamp */}
        <p className={`text-[10px] text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
      
      {/* User Avatar placeholder */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br 
                        from-indigo-500 to-purple-600
                        flex items-center justify-center flex-shrink-0 mt-1
                        shadow-lg shadow-indigo-500/20">
          <span className="text-white text-xs font-medium">You</span>
        </div>
      )}
    </motion.div>
  )
}
