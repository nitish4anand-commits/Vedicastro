'use client'

import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

interface Koota {
  koota?: string
  name?: string
  score?: number
  scored?: number
  maxScore?: number
  maxPoints?: number
}

interface RadarChartCardProps {
  kootas: Koota[]
}

export default function RadarChartCard({ kootas }: RadarChartCardProps) {
  const data = kootas.map(k => {
    const name = k.koota || k.name || 'Unknown'
    const score = k.scored ?? k.score ?? 0
    const maxScore = k.maxPoints ?? k.maxScore ?? 1
    
    return {
      koota: name.length > 10 ? name.substring(0, 8) + '...' : name,
      score: Math.round((score / maxScore) * 100),
      fullMark: 100
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white/60 dark:bg-gray-900/60 rounded-2xl p-4 md:p-6 border border-gray-200/50 dark:border-gray-700/50"
    >
      <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">Compatibility Radar</h4>
      
      <div className="w-full h-[250px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid className="stroke-gray-300 dark:stroke-gray-600" strokeOpacity={0.5} />
            <PolarAngleAxis 
              dataKey="koota" 
              tick={{ fill: 'currentColor', fontSize: 10 }}
              className="text-gray-600 dark:text-gray-400"
              tickLine={false}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'currentColor', fontSize: 9 }}
              className="text-gray-500 dark:text-gray-500"
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#A855F7"
              strokeWidth={2}
              fill="url(#radarGradient)"
              fillOpacity={0.6}
            />
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
        Larger area indicates stronger overall compatibility
      </p>
    </motion.div>
  )
}
