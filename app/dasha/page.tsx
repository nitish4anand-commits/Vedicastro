"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Info, Loader2, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashaPeriod {
  planet: string
  startDate: string
  endDate: string
  duration: string
  years: number
  isActive: boolean
  isPast: boolean
  color: string
  effects: {
    positive: string[]
    negative: string[]
  }
}

interface AntardashaPeriod {
  planet: string
  startDate: string
  endDate: string
  duration: string
  isActive: boolean
  description: string
}

interface DashaResult {
  birthNakshatra: {
    name: string
    ruler: string
    deity: string
    pada: number[]
  }
  nakshatraLord: string
  mahadashas: DashaPeriod[]
  currentMahadasha: string | null
  antardashas: AntardashaPeriod[]
}

export default function DashaPage() {
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('12:00')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DashaResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCalculate = async () => {
    if (!birthDate) {
      setError('Please enter your date of birth')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/dasha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime,
          timezone: 5.5
        })
      })

      if (!response.ok) throw new Error('Failed to calculate Dasha')
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to calculate Dasha periods. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = Date.now()
    
    if (now < start) return 0
    if (now > end) return 100
    
    return Math.round(((now - start) / (end - start)) * 100)
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <Calendar className="mx-auto h-16 w-16 text-purple-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Vimshottari <span className="gradient-text">Dasha</span> Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your planetary periods (Mahadasha & Antardasha) based on Moon&apos;s Nakshatra at birth
          </p>
        </div>

        {!result ? (
          <div className="max-w-md mx-auto">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Enter Birth Details</CardTitle>
                <CardDescription>
                  Your Dasha periods are calculated based on Moon&apos;s position at birth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Date of Birth *</label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Time of Birth (optional)</label>
                  <Input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <Button 
                  className="w-full gradient-bg text-white"
                  onClick={handleCalculate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate Dasha Periods'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button variant="ghost" onClick={() => setResult(null)}>
                ← Calculate Another
              </Button>
              <Badge variant="outline" className="text-base py-1 px-3">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                Birth Nakshatra: {result.birthNakshatra.name} (Lord: {result.nakshatraLord})
              </Badge>
            </div>

            <Tabs defaultValue="mahadasha" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                <TabsTrigger value="mahadasha">Mahadasha</TabsTrigger>
                <TabsTrigger value="antardasha">Antardasha</TabsTrigger>
              </TabsList>

              <TabsContent value="mahadasha">
                {/* Current Mahadasha Highlight */}
                {result.currentMahadasha && (
                  <Card className="glass-card border-purple-500/50 mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full animate-pulse"
                          style={{ backgroundColor: result.mahadashas.find(d => d.isActive)?.color }}
                        />
                        Current Period: {result.currentMahadasha} Mahadasha
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.mahadashas.filter(d => d.isActive).map(dasha => (
                        <div key={dasha.planet}>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{formatDate(dasha.startDate)}</span>
                            <span>{formatDate(dasha.endDate)}</span>
                          </div>
                          <Progress 
                            value={calculateProgress(dasha.startDate, dasha.endDate)} 
                            className="mb-4"
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-green-500 font-medium mb-2">Positive Effects</h4>
                              <ul className="space-y-1">
                                {dasha.effects.positive.map((effect, i) => (
                                  <li key={i} className="text-sm flex items-center gap-2">
                                    <span className="text-green-500">✓</span> {effect}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-red-500 font-medium mb-2">Challenges</h4>
                              <ul className="space-y-1">
                                {dasha.effects.negative.map((effect, i) => (
                                  <li key={i} className="text-sm flex items-center gap-2">
                                    <span className="text-red-500">!</span> {effect}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* All Mahadashas Timeline */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Complete Mahadasha Timeline</CardTitle>
                    <CardDescription>
                      Vimshottari Dasha - 120 year cycle based on your birth nakshatra
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.mahadashas.map((dasha, index) => (
                        <motion.div
                          key={`${dasha.planet}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`relative pl-8 pb-4 border-l-2 ${
                            dasha.isActive 
                              ? 'border-purple-500' 
                              : dasha.isPast 
                                ? 'border-muted' 
                                : 'border-border'
                          }`}
                        >
                          <div 
                            className={`absolute left-[-9px] w-4 h-4 rounded-full ${
                              dasha.isActive ? 'animate-pulse' : ''
                            }`}
                            style={{ backgroundColor: dasha.color }}
                          />
                          
                          <div className={`p-4 rounded-lg ${
                            dasha.isActive 
                              ? 'bg-purple-500/20 border border-purple-500/50' 
                              : dasha.isPast 
                                ? 'bg-muted/30 opacity-60' 
                                : 'bg-muted/50'
                          }`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-lg">{dasha.planet}</h3>
                                {dasha.isActive && (
                                  <Badge className="bg-purple-500">Active</Badge>
                                )}
                                {dasha.isPast && (
                                  <Badge variant="secondary">Completed</Badge>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {dasha.duration}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(dasha.startDate)} → {formatDate(dasha.endDate)}
                            </p>
                            
                            {dasha.isActive && (
                              <Progress 
                                value={calculateProgress(dasha.startDate, dasha.endDate)} 
                                className="mt-2"
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="antardasha">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>
                      Antardasha (Sub-periods) in {result.currentMahadasha} Mahadasha
                    </CardTitle>
                    <CardDescription>
                      Each Mahadasha is divided into 9 Antardashas of all planets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result.antardashas.length > 0 ? (
                      <div className="space-y-3">
                        {result.antardashas.map((antar, index) => (
                          <motion.div
                            key={`${antar.planet}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-lg flex items-center justify-between ${
                              antar.isActive 
                                ? 'bg-purple-500/20 border border-purple-500/50' 
                                : 'bg-muted/30'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{antar.description}</h4>
                                {antar.isActive && (
                                  <Badge className="bg-green-500">Current</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(antar.startDate)} → {formatDate(antar.endDate)}
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {antar.duration}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Enter birth details to see Antardasha periods
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Info Box */}
            <Card className="glass-card mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About Vimshottari Dasha
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  • <strong>Vimshottari Dasha</strong> is the most widely used planetary period system in Vedic astrology
                </p>
                <p>
                  • The total cycle spans <strong>120 years</strong>, divided among 9 planets based on Moon&apos;s Nakshatra at birth
                </p>
                <p>
                  • Each <strong>Mahadasha</strong> (major period) is further divided into 9 <strong>Antardashas</strong> (sub-periods)
                </p>
                <p>
                  • The ruling planet of each period influences the events and experiences during that time
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  )
}
