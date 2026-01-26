"use client"

import { motion } from "framer-motion"
import { Heart, Phone, MessageCircle, ExternalLink } from "lucide-react"
import { CRISIS_RESOURCES } from "./chat-types"

export default function CrisisSupportCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm"
    >
      <div className="bg-gradient-to-br from-rose-900/80 to-pink-900/80
                     backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30
                     shadow-xl shadow-pink-500/10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-pink-500/30 
                         flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-300" />
          </div>
          <div>
            <h3 className="text-white font-medium">You&apos;re Not Alone</h3>
            <p className="text-pink-200/70 text-sm">Support is available 24/7</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-pink-100/90 text-sm mb-5 leading-relaxed">
          I sense you may be going through a difficult time. Please know that 
          reaching out for help is a sign of strength. Here are some resources 
          that can provide immediate support:
        </p>

        {/* Resources */}
        <div className="space-y-3">
          {CRISIS_RESOURCES.map((resource) => (
            <div
              key={resource.name}
              className="bg-white/10 rounded-xl p-4 hover:bg-white/15 
                        transition-colors border border-white/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white font-medium text-sm">{resource.name}</h4>
                  <p className="text-pink-200/60 text-xs mt-0.5">{resource.description}</p>
                </div>
                <span className="text-xs text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full">
                  {resource.available}
                </span>
              </div>
              
              <div className="flex gap-2 mt-3">
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-pink-600/50 hover:bg-pink-600/70 text-white text-xs
                             transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {resource.phone}
                  </a>
                )}
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                             bg-white/10 hover:bg-white/20 text-white text-xs
                             transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional support */}
        <div className="mt-5 pt-4 border-t border-pink-500/20">
          <p className="text-pink-200/80 text-xs text-center">
            Would you like to talk? I&apos;m here to listen without judgment.
          </p>
          <div className="flex justify-center mt-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full
                             bg-gradient-to-r from-pink-600 to-rose-600
                             text-white text-sm font-medium
                             hover:shadow-lg hover:shadow-pink-500/30
                             transition-all duration-200">
              <MessageCircle className="w-4 h-4" />
              Continue chatting with me
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
