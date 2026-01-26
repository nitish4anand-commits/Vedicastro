'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'

interface Strength {
  koota: string
  why: string
}

interface Challenge {
  koota: string
  why: string
  howToAddress: string
}

interface StrengthsChallengesGridProps {
  strengths: Strength[]
  challenges: Challenge[]
}

export default function StrengthsChallengesGrid({
  strengths,
  challenges
}: StrengthsChallengesGridProps) {
  if (strengths.length === 0 && challenges.length === 0) return null

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-green-200">Your Strengths</h3>
          </div>
          
          <ul className="space-y-3">
            {strengths.map((strength, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-green-950/30 rounded-lg p-3 border border-green-500/20"
              >
                <div className="font-medium text-green-300 text-sm md:text-base mb-1">{strength.koota}</div>
                <div className="text-xs md:text-sm text-green-100/90">{strength.why}</div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border border-orange-500/30 rounded-xl p-4 md:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-orange-200">Areas to Address</h3>
          </div>
          
          <ul className="space-y-4">
            {challenges.map((challenge, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-orange-950/30 rounded-lg p-3 border border-orange-500/20"
              >
                <div className="font-medium text-orange-300 text-sm md:text-base mb-1">{challenge.koota}</div>
                <div className="text-xs md:text-sm text-orange-100/90 mb-2">{challenge.why}</div>
                <div className="flex items-start gap-2 text-xs text-orange-200 bg-orange-900/20 rounded p-2">
                  <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{challenge.howToAddress}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
