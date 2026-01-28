'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Heart, Sparkles } from 'lucide-react'

interface Dosha {
  name: string
  severity: 'high' | 'medium' | 'low'
  impact: string
  remedy: string
  practicalAdvice: string
}

interface DoshasSectionProps {
  doshas: Dosha[] | string[]
}

// Parse simple string doshas into structured objects
function parseDoshas(rawDoshas: Dosha[] | string[]): Dosha[] {
  if (!rawDoshas || rawDoshas.length === 0) return []
  
  // If already structured, return as-is
  if (typeof rawDoshas[0] === 'object') {
    return rawDoshas as Dosha[]
  }
  
  // Parse string doshas
  return (rawDoshas as string[]).map(dosha => {
    const doshaStr = dosha.toLowerCase()
    
    if (doshaStr.includes('nadi')) {
      return {
        name: 'Nadi Dosha',
        severity: 'high' as const,
        impact: 'Same Nadi suggests similar health constitutions, which traditional texts consider challenging for genetic diversity and progeny.',
        remedy: 'Traditional remedies include Nadi Dosha Shanti puja, charitable acts, and fasting on auspicious days.',
        practicalAdvice: 'Modern couples can address this through comprehensive genetic counseling, pre-conception health optimization, and regular medical check-ups.'
      }
    }
    
    if (doshaStr.includes('bhakoot')) {
      return {
        name: 'Bhakoot Dosha',
        severity: 'medium' as const,
        impact: 'Bhakoot Dosha can indicate challenges in aligned prosperity, health, or long-term goal compatibility between partners.',
        remedy: 'Traditional texts recommend performing puja and charitable acts to mitigate Bhakoot Dosha effects.',
        practicalAdvice: 'Create explicit agreements about financial management, career priorities, and long-term life goals.'
      }
    }
    
    if (doshaStr.includes('gana')) {
      return {
        name: 'Gana Dosha',
        severity: 'medium' as const,
        impact: 'Different Ganas suggest contrasting temperaments that may manifest during conflicts or high-stress situations.',
        remedy: 'Traditional remedies include performing Gana Dosha Shanti rituals and charitable works.',
        practicalAdvice: 'Establish clear communication rules for disagreements. Practice active listening.'
      }
    }
    
    // Default parsing for unknown doshas
    const name = dosha.split(' - ')[0] || dosha.split(':')[0] || 'Dosha Detected'
    return {
      name,
      severity: 'medium' as const,
      impact: dosha,
      remedy: 'Consult with a Vedic astrologer for specific remedies.',
      practicalAdvice: 'Focus on open communication and mutual understanding in affected areas.'
    }
  })
}

export default function DoshasSection({ doshas }: DoshasSectionProps) {
  const parsedDoshas = parseDoshas(doshas)
  
  if (!parsedDoshas || parsedDoshas.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-red-100/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-400/30 dark:border-red-500/30 rounded-2xl p-5 md:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-semibold text-red-800 dark:text-red-200">Doshas Detected</h3>
          <p className="text-xs md:text-sm text-red-600/70 dark:text-red-300/70 mt-0.5">
            Traditional concerns with remedies and practical guidance
          </p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-5">
        {parsedDoshas.map((dosha, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 dark:bg-gray-900/60 rounded-xl p-4 md:p-5 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-start gap-3 mb-3 md:mb-4">
              <SeverityBadge severity={dosha.severity} />
              <h4 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg flex-1">{dosha.name}</h4>
            </div>

            <div className="space-y-3 md:space-y-4 text-sm">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs md:text-sm">{dosha.impact}</p>

              <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-purple-100/50 dark:bg-purple-900/20 rounded-lg p-3 md:p-4 border border-purple-400/20 dark:border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-purple-700 dark:text-purple-300 text-xs md:text-sm">Traditional Remedy</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] md:text-xs leading-relaxed">{dosha.remedy}</p>
                </div>

                <div className="bg-blue-100/50 dark:bg-blue-900/20 rounded-lg p-3 md:p-4 border border-blue-400/20 dark:border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300 text-xs md:text-sm">Practical Approach</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[11px] md:text-xs leading-relaxed">{dosha.practicalAdvice}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    high: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40',
    medium: 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/40',
    low: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/40'
  }

  return (
    <span className={`text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full border font-medium ${styles[severity as keyof typeof styles] || styles.medium}`}>
      {severity}
    </span>
  )
}
