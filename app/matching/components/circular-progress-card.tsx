'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Koota {
  koota?: string
  name?: string
  score?: number
  scored?: number
  maxScore?: number
  maxPoints?: number
}

interface CircularProgressCardProps {
  score: number
  total: number
  kootas: Koota[]
}

export default function CircularProgressCard({ score, total, kootas }: CircularProgressCardProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const percentage = (score / total) * 100
  const circumference = 2 * Math.PI * 80 // radius = 80
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50"
    >
      <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">Score Breakdown</h4>

      <div className="relative w-full max-w-[200px] md:max-w-[240px] mx-auto mb-4 md:mb-6">
        {/* Main circular progress */}
        <svg className="w-full h-auto transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="14"
          />

          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {score}
          </motion.span>
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            out of {total}
          </span>
        </div>
      </div>

      {/* Koota segments legend */}
      <div className="grid grid-cols-2 gap-1.5 md:gap-2">
        {kootas.map((koota, i) => {
          const name = koota.koota || koota.name || 'Unknown'
          const kootaScore = koota.scored ?? koota.score ?? 0
          const kootaMax = koota.maxPoints ?? koota.maxScore ?? 1
          const kootaPercentage = (kootaScore / kootaMax) * 100
          const color = getSegmentColor(kootaPercentage)
          
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.05 }}
              onMouseEnter={() => setHoveredSegment(name)}
              onMouseLeave={() => setHoveredSegment(null)}
              className={`
                flex items-center gap-2 p-1.5 md:p-2 rounded-lg transition-all cursor-pointer
                ${hoveredSegment === name ? 'bg-gray-100 dark:bg-gray-800 scale-105' : 'bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-800/50'}
              `}
            >
              <div 
                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] md:text-xs text-gray-700 dark:text-gray-300 truncate">{name}</div>
                <div className="text-[10px] md:text-xs font-semibold" style={{ color }}>
                  {kootaScore}/{kootaMax}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function getSegmentColor(percentage: number): string {
  if (percentage >= 90) return '#10B981' // green
  if (percentage >= 60) return '#3B82F6' // blue
  if (percentage >= 30) return '#F59E0B' // yellow/amber
  return '#EF4444' // red
}
