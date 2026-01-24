"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const messages = [
  "Calculating planetary positions...",
  "Analyzing birth chart...",
  "Computing Dashas...",
  "Identifying Yogas...",
  "Checking Doshas...",
  "Generating predictions...",
  "Almost ready...",
]

export default function ProcessingPage() {
  const [messageIndex, setMessageIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)

    const redirectTimer = setTimeout(() => {
      router.push("/kundli/dashboard")
    }, 6000)

    return () => {
      clearInterval(messageInterval)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container">
        <div className="max-w-lg mx-auto text-center">
          {/* Animated Zodiac Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="relative mx-auto h-48 w-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-purple-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-4 border-blue-500/30"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-4 border-pink-500/30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="h-16 w-16 text-purple-500" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {messages[messageIndex]}
            </h2>
            <div className="flex justify-center">
              <div className="h-1 w-48 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>

          <p className="mt-8 text-muted-foreground">
            Please wait while we prepare your personalized Kundli...
          </p>
        </div>
      </div>
    </div>
  )
}
