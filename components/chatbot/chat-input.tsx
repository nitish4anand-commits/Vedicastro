"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Paperclip, Image as ImageIcon, Smile, MicOff, X } from "lucide-react"
import { useChatStore } from "./chat-store"
import { ChatMessage } from "./chat-types"

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("")
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const { messages, addMessage, setTyping, isRecording, setRecording } = useChatStore()

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
      status: 'sent'
    }
    
    addMessage(userMessage)
    setInputValue("")
    
    // Resize textarea back
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    
    // Call API
    try {
      setTyping(true)
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
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
      console.error('Failed to send message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. 🙏",
        timestamp: new Date()
      }
      addMessage(errorMessage)
    } finally {
      setTyping(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const toggleVoiceRecording = () => {
    setIsVoiceRecording(!isVoiceRecording)
    setRecording(!isRecording)
    
    if (!isVoiceRecording) {
      // Start recording simulation
      // In real implementation, use Web Speech API or a speech-to-text service
      console.log('Starting voice recording...')
    } else {
      // Stop recording
      console.log('Stopping voice recording...')
      // Simulate transcription
      setTimeout(() => {
        setInputValue("What does my chart say about my career?")
        setRecording(false)
        setIsVoiceRecording(false)
      }, 500)
    }
  }

  return (
    <div className="border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-sm p-4">
      {/* Voice Recording Overlay */}
      <AnimatePresence>
        {isVoiceRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm
                      flex flex-col items-center justify-center gap-4 z-50"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-pink-500
                            flex items-center justify-center animate-pulse">
                <Mic className="w-10 h-10 text-white" />
              </div>
              {/* Recording waves */}
              <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-ping" />
            </div>
            <p className="text-white text-lg">Listening...</p>
            <p className="text-gray-400 text-sm">Speak your question</p>
            <button
              onClick={toggleVoiceRecording}
              className="mt-4 px-6 py-2 rounded-full bg-gray-800 text-white
                       hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 mb-2 flex gap-2"
          >
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-3 rounded-full bg-purple-600 hover:bg-purple-500
                        text-white shadow-lg transition-colors"
              title="Upload Image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAttachMenu(false)}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500
                        text-white shadow-lg transition-colors"
              title="Upload File"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        {/* Attach Button */}
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          className="p-2 rounded-full text-gray-400 hover:text-purple-400
                    hover:bg-purple-500/10 transition-all"
          title="Attach"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input Area */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask Jyoti anything..."
            rows={1}
            className="w-full px-4 py-3 pr-12 rounded-2xl
                      bg-gray-800/60 border border-purple-500/20
                      text-white placeholder-gray-400
                      focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30
                      resize-none transition-all duration-200
                      text-sm"
            style={{ maxHeight: '120px' }}
          />
          
          {/* Emoji Button */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2
                      text-gray-400 hover:text-purple-400 transition-colors"
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Voice / Send Button */}
        {inputValue.trim() ? (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={handleSend}
            className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-pink-600
                      text-white shadow-lg hover:shadow-purple-500/30
                      transition-all duration-200 hover:scale-105"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        ) : (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-full transition-all duration-200 hover:scale-105
                       ${isVoiceRecording 
                         ? 'bg-red-500 text-white' 
                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            title={isVoiceRecording ? "Stop recording" : "Voice message"}
          >
            {isVoiceRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>
        )}
      </div>

      {/* Powered by text */}
      <p className="text-center text-xs text-gray-500 mt-2">
        Powered by cosmic wisdom ✨
      </p>
    </div>
  )
}
