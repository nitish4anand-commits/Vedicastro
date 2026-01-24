"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, TrendingUp, TrendingDown, Minus, Loader2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TransitPlanet {
  planet: string
  sign: string
  signSanskrit: string
  degree: number
  isRetrograde: boolean
  symbol: string
  color: string
}

interface UpcomingTransit {
  planet: string
  fromSign: string
  toSign: string
  date: string
  duration: string
  daysAway: number
  impact: 'positive' | 'neutral' | 'negative'
  effects: string[]
}

const planetColors: { [key: string]: string } = {
  Sun: "bg-orange-500",
  Moon: "bg-slate-300",
  Mars: "bg-red-600",
  Mercury: "bg-green-500",
  Jupiter: "bg-yellow-500",
  Venus: "bg-pink-500",
  Saturn: "bg-gray-600",
  Rahu: "bg-purple-600",
  Ketu: "bg-violet-500"
}

export default function TransitsPage() {
  const [currentTransits, setCurrentTransits] = useState<TransitPlanet[]>([])
  const [upcomingTransits, setUpcomingTransits] = useState<UpcomingTransit[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    fetchTransits()
  }, [])

  const fetchTransits = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/transits')
      if (!response.ok) throw new Error('Failed to fetch transits')
      const data = await response.json()
      setCurrentTransits(data.current)
      setUpcomingTransits(data.upcoming)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Failed to fetch transits:', error)
    } finally {
      setLoading(false)
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-green-500/50 bg-green-500/10'
      case 'negative':
        return 'border-red-500/50 bg-red-500/10'
      default:
        return 'border-yellow-500/50 bg-yellow-500/10'
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-muted-foreground">Calculating planetary positions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <Calendar className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Planetary <span className="gradient-text">Transits</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time planetary positions and upcoming major transits based on precise astronomical calculations
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
            <span>Last updated: {lastUpdated}</span>
            <Button variant="ghost" size="sm" onClick={fetchTransits}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="current" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="current">Current Positions</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Transits</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid gap-4 md:grid-cols-3">
              {currentTransits.map((transit, index) => (
                <motion.div
                  key={transit.planet}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-card hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${planetColors[transit.planet]}`}
                        >
                          {transit.symbol}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{transit.planet}</h3>
                            {transit.isRetrograde && (
                              <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-400">
                                ℞ Retrograde
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">
                            {transit.sign} ({transit.signSanskrit})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transit.degree.toFixed(2)}°
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Current Positions Summary */}
            <Card className="glass-card mt-8">
              <CardHeader>
                <CardTitle>Planetary Positions Overview</CardTitle>
                <CardDescription>
                  All planets positioned as of today using Lahiri Ayanamsa (sidereal zodiac)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Planet</th>
                        <th className="text-left p-2">Sign</th>
                        <th className="text-left p-2">Degree</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTransits.map((transit) => (
                        <tr key={transit.planet} className="border-b border-border/50">
                          <td className="p-2 font-medium">
                            <span className="mr-2">{transit.symbol}</span>
                            {transit.planet}
                          </td>
                          <td className="p-2">{transit.sign}</td>
                          <td className="p-2">{transit.degree.toFixed(2)}°</td>
                          <td className="p-2">
                            {transit.isRetrograde ? (
                              <span className="text-red-400">Retrograde</span>
                            ) : (
                              <span className="text-green-400">Direct</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="space-y-6">
              {upcomingTransits.map((transit, index) => (
                <motion.div
                  key={`${transit.planet}-${transit.date}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`glass-card border ${getImpactColor(transit.impact)}`}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div 
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl ${planetColors[transit.planet]}`}
                          >
                            {transit.planet.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-xl">{transit.planet}</h3>
                              {getImpactIcon(transit.impact)}
                            </div>
                            <p className="text-muted-foreground">
                              {transit.fromSign} → <strong>{transit.toSign}</strong>
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{transit.date}</span>
                              <span className="text-muted-foreground">
                                ({transit.daysAway} days away)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <Badge variant="outline">Duration: {transit.duration}</Badge>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <h4 className="font-medium mb-2">Expected Effects:</h4>
                        <ul className="grid gap-1 md:grid-cols-2">
                          {transit.effects.map((effect, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-purple-500">•</span>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {upcomingTransits.length === 0 && (
                <Card className="glass-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No major transits in the near future</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <Card className="glass-card mt-8 max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>About Transit Calculations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • All planetary positions use <strong>Lahiri Ayanamsa</strong> (sidereal zodiac as per Vedic astrology)
            </p>
            <p>
              • Calculations are based on <strong>VSOP87 theory</strong> for precise planetary positions
            </p>
            <p>
              • Retrograde status indicates apparent backward motion as seen from Earth
            </p>
            <p>
              • Transit effects are general predictions - individual results depend on your birth chart
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
