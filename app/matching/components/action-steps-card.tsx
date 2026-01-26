'use client'

import { motion } from 'framer-motion'
import { CheckSquare, ArrowRight } from 'lucide-react'

interface ActionStepsCardProps {
  steps: string[]
}

export default function ActionStepsCard({ steps }: ActionStepsCardProps) {
  if (!steps || steps.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-5 md:p-8"
    >
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-white">Recommended Next Steps</h3>
          <p className="text-xs md:text-sm text-indigo-300/70 mt-0.5">
            Actionable guidance to strengthen your relationship
          </p>
        </div>
      </div>

      <div className="space-y-2 md:space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-start gap-3 p-3 md:p-4 rounded-xl bg-gray-900/40 border border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-900/60 transition-all"
          >
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5 border border-indigo-500/30">
              <span className="text-[10px] md:text-xs font-bold text-indigo-400">{i + 1}</span>
            </div>
            <p className="flex-1 text-gray-300 text-xs md:text-sm leading-relaxed">
              {step}
            </p>
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
