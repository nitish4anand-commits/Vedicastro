'use client'

import { AlertCircle, Info } from 'lucide-react'
import { motion } from 'framer-motion'

interface DataQualityBannerProps {
  isApproximate: boolean
  confidenceLevel: 'high' | 'medium' | 'low'
  limitations: string[]
}

export default function DataQualityBanner({
  isApproximate,
  confidenceLevel,
  limitations
}: DataQualityBannerProps) {
  if (!isApproximate || limitations.length === 0) return null

  const colorScheme = {
    low: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      text: 'text-red-200',
      title: 'text-red-300',
      badge: 'bg-red-500/20 text-red-300'
    },
    medium: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      text: 'text-amber-100',
      title: 'text-amber-200',
      badge: 'bg-amber-500/20 text-amber-300'
    },
    high: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      text: 'text-blue-100',
      title: 'text-blue-200',
      badge: 'bg-blue-500/20 text-blue-300'
    }
  }

  const colors = colorScheme[confidenceLevel]

  const confidenceLabels = {
    high: 'High Confidence',
    medium: 'Moderate Confidence',
    low: 'Lower Confidence'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colors.bg} border ${colors.border} rounded-xl p-4 md:p-5`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${colors.title} mb-2 flex flex-wrap items-center gap-2`}>
            Results are approximate 
            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
              {confidenceLabels[confidenceLevel]}
            </span>
          </h4>
          <ul className={`text-sm ${colors.text} space-y-1.5`}>
            {limitations.map((limitation, i) => (
              <li key={i} className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
          <p className={`text-xs ${colors.text} mt-3 opacity-80`}>
            For highest accuracy, obtain exact birth times from birth certificates and verify timezone information.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
