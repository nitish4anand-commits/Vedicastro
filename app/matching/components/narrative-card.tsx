'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface NarrativeCardProps {
  headline: string
  body: string
}

export default function NarrativeCard({ headline, body }: NarrativeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white/60 to-gray-100/60 dark:from-gray-900/60 dark:to-gray-800/60 rounded-2xl p-5 md:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-500 dark:text-purple-400" />
        </div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed">
          {headline}
        </h3>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg pl-0 md:pl-14">
        {body}
      </p>
    </motion.div>
  )
}
