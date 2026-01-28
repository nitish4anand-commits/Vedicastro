"use client"

import { Star, AlertTriangle, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Yoga {
  name: string
  type: string
  strength: number
  isActive: boolean
  description: string
  planets?: string[]
}

interface YogaAnalysisProps {
  yogas?: Yoga[]
}

const defaultYogas: Yoga[] = [
  {
    name: "Gaja Kesari Yoga",
    type: "Raj Yoga",
    strength: 85,
    isActive: true,
    description: "Moon and Jupiter in mutual kendras. Brings wealth, wisdom, fame, and respected position in society.",
    planets: ["Moon", "Jupiter"],
  },
  {
    name: "Budhaditya Yoga",
    type: "Raj Yoga",
    strength: 75,
    isActive: true,
    description: "Sun and Mercury conjunction. Bestows intelligence, good speech, and success in communication fields.",
    planets: ["Sun", "Mercury"],
  },
  {
    name: "Dhana Yoga",
    type: "Wealth Yoga",
    strength: 70,
    isActive: true,
    description: "Lords of 2nd and 11th houses are well placed. Indicates financial prosperity and wealth accumulation.",
    planets: ["Jupiter", "Saturn"],
  },
  {
    name: "Parivartana Yoga",
    type: "Exchange Yoga",
    strength: 65,
    isActive: true,
    description: "Exchange of house lords creates strong connection between the houses involved.",
    planets: ["Mars", "Jupiter"],
  },
  {
    name: "Neecha Bhanga Raja Yoga",
    type: "Cancellation Yoga",
    strength: 60,
    isActive: false,
    description: "Debilitation of a planet gets cancelled, transforming weakness into strength.",
    planets: [],
  },
]

export function YogaAnalysis({ yogas }: YogaAnalysisProps) {
  // Transform API data to match expected format
  const transformedYogas = yogas ? yogas.map((y: any) => ({
    name: y.name,
    type: y.type || 'Raj Yoga',
    strength: y.strength === 'High' ? 85 : y.strength === 'Medium' ? 65 : 45,
    isActive: y.strength !== 'Low',
    description: y.description,
    planets: y.planets || []
  })) : defaultYogas

  const activeYogas = transformedYogas.filter((y) => y.isActive)
  const inactiveYogas = transformedYogas.filter((y) => !y.isActive)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-4xl font-bold text-purple-500">{transformedYogas.length}</p>
              <p className="text-sm text-muted-foreground">Total Yogas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-500">{activeYogas.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-muted-foreground">{inactiveYogas.length}</p>
              <p className="text-sm text-muted-foreground">Forming</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Yogas */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          Active Yogas
        </h3>
        <div className="grid gap-4">
          {activeYogas.map((yoga) => (
            <Card key={yoga.name} className="glass-card border-green-500/20">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{yoga.name}</CardTitle>
                    <CardDescription>{yoga.type}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(yoga.strength / 20)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{yoga.description}</p>
                {yoga.planets && yoga.planets.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {yoga.planets.map((planet) => (
                      <span
                        key={planet}
                        className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded-full"
                      >
                        {planet}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Inactive/Forming Yogas */}
      {inactiveYogas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Forming Yogas
          </h3>
          <div className="grid gap-4">
            {inactiveYogas.map((yoga) => (
              <Card key={yoga.name} className="glass-card opacity-70">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{yoga.name}</CardTitle>
                      <CardDescription>{yoga.type}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{yoga.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
