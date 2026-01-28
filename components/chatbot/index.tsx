"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence } from "framer-motion"
import { useChatStore } from "./chat-store"

// Dynamic imports to avoid SSR issues
const ChatWidget = dynamic(() => import("./chat-widget"), { ssr: false })
const ChatWindow = dynamic(() => import("./chat-window"), { ssr: false })

export default function Chatbot() {
  const [mounted, setMounted] = useState(false)
  const { isOpen } = useChatStore()

  // Only render after hydration to avoid mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Floating Widget Button */}
      <ChatWidget />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && <ChatWindow />}
      </AnimatePresence>
    </>
  )
}
