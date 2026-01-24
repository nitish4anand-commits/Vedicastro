"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashaPeriod {
  planet: string
  startDate: string
  endDate: string
  years: number
  isCurrent?: boolean
}

interface DashaTimelineProps {
  currentMahadasha?: string
  currentAntardasha?: string
  periods?: DashaPeriod[]
}

const planetColors: Record<string, string> = {
  Sun: "bg-orange-500",
  Moon: "bg-gray-300",
  Mars: "bg-red-500",
  Mercury: "bg-green-500",
  Jupiter: "bg-yellow-500",
  Venus: "bg-pink-500",
  Saturn: "bg-blue-900",
  Rahu: "bg-slate-700",
  Ketu: "bg-brown-500",
}

const defaultPeriods: DashaPeriod[] = [
  { planet: "Sun", startDate: "2020-01-01", endDate: "2026-01-01", years: 6, isCurrent: true },
  { planet: "Moon", startDate: "2026-01-01", endDate: "2036-01-01", years: 10 },
  { planet: "Mars", startDate: "2036-01-01", endDate: "2043-01-01", years: 7 },
  { planet: "Rahu", startDate: "2043-01-01", endDate: "2061-01-01", years: 18 },
  { planet: "Jupiter", startDate: "2061-01-01", endDate: "2077-01-01", years: 16 },
  { planet: "Saturn", startDate: "2077-01-01", endDate: "2096-01-01", years: 19 },
  { planet: "Mercury", startDate: "2096-01-01", endDate: "2113-01-01", years: 17 },
  { planet: "Ketu", startDate: "2113-01-01", endDate: "2120-01-01", years: 7 },
  { planet: "Venus", startDate: "2120-01-01", endDate: "2140-01-01", years: 20 },
]

export function DashaTimeline({ 
  currentMahadasha = "Sun", 
  currentAntardasha = "Moon",
  periods = defaultPeriods 
}: DashaTimelineProps) {
  const totalYears = periods.reduce((sum, p) => sum + p.years, 0)

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Vimshottari Dasha Timeline (120 Years)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Period Display */}
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Current Period</p>
          <p className="text-2xl font-bold">
            <span className="text-purple-400">{currentMahadasha}</span>
            <span className="text-muted-foreground mx-2">→</span>
            <span className="text-blue-400">{currentAntardasha}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Mahadasha ends: January 1, 2026
          </p>
        </div>

        {/* Visual Timeline */}
        <div className="mb-8">
          <div className="flex rounded-lg overflow-hidden h-10">
            {periods.map((period, index) => (
              <motion.div
                key={period.planet}
                initial={{ width: 0 }}
                animate={{ width: `${(period.years / totalYears) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`${planetColors[period.planet] || "bg-gray-500"} relative group cursor-pointer ${
                  period.isCurrent ? "ring-2 ring-white" : ""
                }`}
                style={{ minWidth: "20px" }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white truncate px-1">
                  {period.years >= 10 ? period.planet : period.planet.substring(0, 2)}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  <p className="font-semibold">{period.planet} Mahadasha</p>
                  <p className="text-xs text-muted-foreground">{period.years} years</p>
                  <p className="text-xs text-muted-foreground">{period.startDate} - {period.endDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Periods Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Mahadasha</th>
                <th className="text-left py-2 px-3">Start Date</th>
                <th className="text-left py-2 px-3">End Date</th>
                <th className="text-center py-2 px-3">Duration</th>
                <th className="text-center py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr 
                  key={period.planet} 
                  className={`border-b ${period.isCurrent ? "bg-purple-500/10" : "hover:bg-muted/50"}`}
                >
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${planetColors[period.planet] || "bg-gray-500"}`} />
                      <span className="font-medium">{period.planet}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">{period.startDate}</td>
                  <td className="py-2 px-3">{period.endDate}</td>
                  <td className="text-center py-2 px-3">{period.years} years</td>
                  <td className="text-center py-2 px-3">
                    {period.isCurrent ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">Current</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Upcoming</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
