"use client"

import dynamic from "next/dynamic"
import { AnimatePresence } from "framer-motion"
import { useChatStore } from "./chat-store"

// Dynamic imports to avoid SSR issues
const ChatWidget = dynamic(() => import("./chat-widget"), { ssr: false })
const ChatWindow = dynamic(() => import("./chat-window"), { ssr: false })

export default function Chatbot() {
  const { isOpen } = useChatStore()

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
