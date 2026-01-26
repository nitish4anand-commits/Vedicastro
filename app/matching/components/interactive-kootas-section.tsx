'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react'

interface KootaExplanation {
  meaning: string
  impact: string
  scoreReason: string
  improvementTips?: string[]
}

interface Koota {
  koota: string
  score?: number
  scored?: number
  maxPoints?: number
  maxScore?: number
  description?: string
  status?: string
  combination?: string
  explanation?: KootaExplanation
}

interface InteractiveKootasSectionProps {
  kootas: Koota[]
  onExpand?: (kootaName: string) => void
}

export default function InteractiveKootasSection({
  kootas,
  onExpand
}: InteractiveKootasSectionProps) {
  const [expandedKoota, setExpandedKoota] = useState<string | null>(null)

  const handleToggle = (kootaName: string) => {
    const newExpanded = expandedKoota === kootaName ? null : kootaName
    setExpandedKoota(newExpanded)
    
    if (newExpanded && onExpand) {
      onExpand(kootaName)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-white">Ashtakoot Analysis</h3>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Click on each koota to learn more about its meaning and impact
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {kootas.map((koota, index) => (
          <KootaCard
            key={koota.koota}
            koota={koota}
            isExpanded={expandedKoota === koota.koota}
            onToggle={() => handleToggle(koota.koota)}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

interface KootaCardProps {
  koota: Koota
  isExpanded: boolean
  onToggle: () => void
  index: number
}

function KootaCard({ koota, isExpanded, onToggle, index }: KootaCardProps) {
  const score = koota.scored ?? koota.score ?? 0
  const maxScore = koota.maxPoints ?? koota.maxScore ?? 1
  const scorePercentage = (score / maxScore) * 100
  const status = getKootaStatus(scorePercentage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`
        group rounded-xl border transition-all duration-300
        ${isExpanded 
          ? 'bg-gray-800/80 border-purple-500/50 shadow-lg shadow-purple-500/10' 
          : 'bg-gray-800/40 border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-800/60'
        }
      `}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-3 md:p-4 flex items-center justify-between text-left"
        aria-expanded={isExpanded}
        aria-label={`${koota.koota} koota details`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StatusIcon status={status} />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm md:text-base mb-0.5">
              {koota.koota}
            </h4>
            <p className="text-xs text-gray-400 group-hover:text-purple-300 transition-colors hidden sm:block">
              {isExpanded ? 'Click to collapse' : 'Click to learn more'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 ml-2">
          <ScoreDisplay score={score} maxScore={maxScore} status={status} />
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3 md:px-4 pb-4 pt-2 space-y-4 border-t border-gray-700/50">
              {/* What it measures */}
              {koota.explanation?.meaning && (
                <div>
                  <h5 className="text-xs md:text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <div className="w-1 h-3 md:h-4 bg-purple-500 rounded" />
                    What it measures
                  </h5>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed pl-3">
                    {koota.explanation.meaning}
                  </p>
                </div>
              )}

              {/* Score Reason */}
              {koota.explanation?.scoreReason && (
                <div>
                  <h5 className="text-xs md:text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                    <div className="w-1 h-3 md:h-4 bg-blue-500 rounded" />
                    Why this score
                  </h5>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed pl-3">
                    {koota.explanation.scoreReason}
                  </p>
                </div>
              )}

              {/* What this means */}
              {koota.explanation?.impact && (
                <div>
                  <h5 className="text-xs md:text-sm font-semibold text-green-300 mb-2 flex items-center gap-2">
                    <div className="w-1 h-3 md:h-4 bg-green-500 rounded" />
                    What this means for you
                  </h5>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed pl-3">
                    {koota.explanation.impact}
                  </p>
                </div>
              )}

              {/* Improvement Tips */}
              {koota.explanation?.improvementTips && koota.explanation.improvementTips.length > 0 && (
                <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-3 md:p-4 border border-amber-500/20">
                  <h5 className="text-xs md:text-sm font-semibold text-amber-300 mb-2 md:mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    Practical guidance
                  </h5>
                  <ul className="space-y-1.5 md:space-y-2">
                    {koota.explanation.improvementTips.map((tip, i) => (
                      <li key={i} className="text-xs md:text-sm text-gray-300 flex gap-2 items-start">
                        <span className="text-amber-400 flex-shrink-0 mt-0.5">•</span>
                        <span className="flex-1">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Fallback if no explanation */}
              {!koota.explanation && koota.description && (
                <div>
                  <h5 className="text-xs md:text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <div className="w-1 h-3 md:h-4 bg-purple-500 rounded" />
                    Description
                  </h5>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed pl-3">
                    {koota.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StatusIcon({ status }: { status: 'excellent' | 'good' | 'average' | 'poor' }) {
  const icons = {
    excellent: <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />,
    good: <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />,
    average: <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />,
    poor: <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
  }
  
  return (
    <div className="flex-shrink-0">
      {icons[status]}
    </div>
  )
}

function ScoreDisplay({ score, maxScore, status }: { score: number; maxScore: number; status: string }) {
  const colors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    average: 'text-yellow-400',
    poor: 'text-red-400'
  }
  
  return (
    <div className="text-right">
      <div className={`text-base md:text-xl font-bold ${colors[status as keyof typeof colors]}`}>
        {score}
        <span className="text-gray-500 text-sm md:text-lg">/{maxScore}</span>
      </div>
      <div className="text-[10px] md:text-xs text-gray-500">
        {Math.round((score / maxScore) * 100)}%
      </div>
    </div>
  )
}

function getKootaStatus(percentage: number): 'excellent' | 'good' | 'average' | 'poor' {
  if (percentage >= 90) return 'excellent'
  if (percentage >= 60) return 'good'
  if (percentage >= 30) return 'average'
  return 'poor'
}
