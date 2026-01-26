'use client'

import { motion } from 'framer-motion'
import { Heart, User } from 'lucide-react'

interface HeroScoreCardProps {
  score: number
  total: number
  percent: number
  verdict: string
  maleName: string
  femaleName: string
  maleSign: string
  femaleSign: string
  maleNakshatra: string
  femaleNakshatra: string
}

export default function HeroScoreCard({
  score,
  total,
  percent,
  verdict,
  maleName,
  femaleName,
  maleSign,
  femaleSign,
  maleNakshatra,
  femaleNakshatra
}: HeroScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-purple-900/60 p-6 md:p-8 border border-purple-500/30 shadow-2xl"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse" />
      
      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${10 + (i * 7)}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        {/* Partner Names with Icons */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-400/50 shadow-lg shadow-blue-500/20">
              <User className="w-7 h-7 md:w-8 md:h-8 text-blue-300" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-white truncate max-w-[120px]">{maleName}</h3>
            <p className="text-xs md:text-sm text-blue-300">{maleNakshatra}</p>
            <p className="text-xs text-gray-400">{maleSign}</p>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Heart className="w-10 h-10 md:w-12 md:h-12 text-pink-400 fill-pink-400/50" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-pink-400/30" />
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-400/50 shadow-lg shadow-pink-500/20">
              <User className="w-7 h-7 md:w-8 md:h-8 text-pink-300" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-white truncate max-w-[120px]">{femaleName}</h3>
            <p className="text-xs md:text-sm text-pink-300">{femaleNakshatra}</p>
            <p className="text-xs text-gray-400">{femaleSign}</p>
          </motion.div>
        </div>

        {/* Score Display with Animation */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
            className="inline-block"
          >
            <div className="relative">
              <span className="text-6xl md:text-8xl font-bold text-white">
                {score}
              </span>
              <span className="text-3xl md:text-5xl text-purple-300 ml-1">/{total}</span>
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-purple-500/10 blur-2xl rounded-full -z-10" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-2xl md:text-4xl text-purple-200 mb-4 mt-2">
              {percent}% Compatible
            </div>
            
            <VerdictBadge type={verdict} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function VerdictBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    'excellent': 'bg-green-500/20 text-green-200 border-green-400/50 shadow-green-500/20',
    'very-good': 'bg-blue-500/20 text-blue-200 border-blue-400/50 shadow-blue-500/20',
    'good': 'bg-purple-500/20 text-purple-200 border-purple-400/50 shadow-purple-500/20',
    'average': 'bg-yellow-500/20 text-yellow-200 border-yellow-400/50 shadow-yellow-500/20',
    'needs-attention': 'bg-orange-500/20 text-orange-200 border-orange-400/50 shadow-orange-500/20',
    'poor': 'bg-red-500/20 text-red-200 border-red-400/50 shadow-red-500/20'
  }
  
  const labels: Record<string, string> = {
    'excellent': 'Excellent Match',
    'very-good': 'Very Good Match',
    'good': 'Good Match',
    'average': 'Average Match',
    'needs-attention': 'Needs Attention',
    'poor': 'Below Average'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      className={`inline-block px-5 md:px-6 py-2 rounded-full border-2 text-sm md:text-lg font-semibold shadow-lg ${styles[type] || styles.average}`}
    >
      {labels[type] || 'Match Assessment'}
    </motion.div>
  )
}
