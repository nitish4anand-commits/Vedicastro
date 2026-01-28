"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  TrendingUp,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedDashaProps {
  dashaData: {
    currentDasha: string
    timeline: Array<{
      planet: string
      startDate: string
      endDate: string
      duration: string
    }>
    enhanced: Array<{
      planet: string
      startDate: string
      endDate: string
      years: number
      strength: {
        overall: number
        dignity: string
        housePlacement: number
        houseStrength: string
        isRetrograde: boolean
        isCombust: boolean
      }
      functionalNature: string
      housesRuled: number[]
      antardashas: Array<{
        planet: string
        startDate: string
        endDate: string
        years: number
        months: number
        days: number
        isCurrent: boolean
        quality: string
      }>
      predictions: {
        career: string[]
        wealth: string[]
        relationships: string[]
        health: string[]
        spiritual: string[]
        favorable: boolean
        challenges: string[]
        opportunities: string[]
      }
      activatedYogas: string[]
      remedies: Array<{
        type: string
        description: string
        frequency?: string
        caution?: string
      }>
    }>
  }
}

const getPlanetEmoji = (planet: string) => {
  const emojiMap: Record<string, string> = {
    Sun: "☉",
    Moon: "☽",
    Mars: "♂",
    Mercury: "☿",
    Jupiter: "♃",
    Venus: "♀",
    Saturn: "♄",
    Rahu: "☊",
    Ketu: "☋"
  }
  return emojiMap[planet] || "●"
}

const getStrengthColor = (overall: number) => {
  if (overall >= 75) return "text-green-500"
  if (overall >= 50) return "text-blue-500"
  if (overall >= 30) return "text-yellow-500"
  return "text-red-500"
}

const getFunctionalNatureColor = (nature: string) => {
  const colorMap: Record<string, string> = {
    Yogakaraka: "bg-purple-500/20 text-purple-500 border-purple-500",
    Benefic: "bg-green-500/20 text-green-500 border-green-500",
    Neutral: "bg-gray-500/20 text-gray-500 border-gray-500",
    Malefic: "bg-orange-500/20 text-orange-500 border-orange-500",
    Maraka: "bg-red-500/20 text-red-500 border-red-500"
  }
  return colorMap[nature] || colorMap.Neutral
}

const getQualityColor = (quality: string) => {
  const colorMap: Record<string, string> = {
    Excellent: "bg-green-500/20 text-green-500",
    Good: "bg-blue-500/20 text-blue-500",
    Mixed: "bg-yellow-500/20 text-yellow-500",
    Challenging: "bg-orange-500/20 text-orange-500",
    Difficult: "bg-red-500/20 text-red-500"
  }
  return colorMap[quality] || colorMap.Mixed
}

export function EnhancedDashaView({ dashaData }: EnhancedDashaProps) {
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>("current")

  if (!dashaData?.enhanced || dashaData.enhanced.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-8 text-center text-muted-foreground">
          No dasha data available
        </CardContent>
      </Card>
    )
  }

  // Find current mahadasha
  const currentDate = new Date()
  const currentMahadasha = dashaData.enhanced.find(d => {
    const start = new Date(d.startDate)
    const end = new Date(d.endDate)
    return currentDate >= start && currentDate <= end
  }) || dashaData.enhanced[0]

  // Find current antardasha
  const currentAntardasha = currentMahadasha?.antardashas.find(ad => ad.isCurrent)

  return (
    <div className="space-y-6">
      {/* Current Period Summary */}
      <Card className="glass-card border-2 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Current Dasha Period
          </CardTitle>
          <CardDescription>Your active planetary period and its effects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mahadasha Info */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getPlanetEmoji(currentMahadasha.planet)}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{currentMahadasha.planet} Mahadasha</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(currentMahadasha.startDate).toLocaleDateString()} - {new Date(currentMahadasha.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Planet Strength</span>
                    <span className={`text-sm font-bold ${getStrengthColor(currentMahadasha.strength.overall)}`}>
                      {currentMahadasha.strength.overall}/100
                    </span>
                  </div>
                  <Progress value={currentMahadasha.strength.overall} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getFunctionalNatureColor(currentMahadasha.functionalNature)}>
                    {currentMahadasha.functionalNature}
                  </Badge>
                  <Badge variant="outline">{currentMahadasha.strength.dignity}</Badge>
                  <Badge variant="outline">{currentMahadasha.strength.houseStrength} Position</Badge>
                </div>
              </div>

              {/* Current Antardasha */}
              {currentAntardasha && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getPlanetEmoji(currentAntardasha.planet)}</span>
                      <div>
                        <p className="font-semibold">{currentAntardasha.planet} Antardasha</p>
                        <p className="text-xs text-muted-foreground">Sub-period (Active Now)</p>
                      </div>
                    </div>
                    <Badge className={getQualityColor(currentAntardasha.quality)}>
                      {currentAntardasha.quality}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(currentAntardasha.startDate).toLocaleDateString()} - {new Date(currentAntardasha.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Duration: {currentAntardasha.years.toFixed(1)} years ({currentAntardasha.months}m {currentAntardasha.days}d)
                  </p>
                </div>
              )}
            </div>

            {/* Predictions Summary */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                {currentMahadasha.predictions.favorable ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
                Period Assessment
              </h4>

              <div className="space-y-3">
                {currentMahadasha.predictions.opportunities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Key Opportunities</span>
                    </div>
                    {currentMahadasha.predictions.opportunities.slice(0, 2).map((opp, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground pl-6">• {opp}</p>
                    ))}
                  </div>
                )}

                {currentMahadasha.predictions.challenges.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Areas to Watch</span>
                    </div>
                    {currentMahadasha.predictions.challenges.slice(0, 2).map((ch, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground pl-6">• {ch}</p>
                    ))}
                  </div>
                )}

                {currentMahadasha.activatedYogas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Activated Yogas</span>
                    </div>
                    {currentMahadasha.activatedYogas.map((yoga, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground pl-6">• {yoga}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="current">Current Period</TabsTrigger>
          <TabsTrigger value="antardashas">Sub-Periods</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="remedies">Remedies</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {/* Life Area Predictions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Life Area Analysis</CardTitle>
              <CardDescription>Detailed predictions for different aspects of life</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Career */}
                {currentMahadasha.predictions.career.length > 0 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      <h4 className="font-semibold">Career & Profession</h4>
                    </div>
                    <ul className="space-y-1">
                      {currentMahadasha.predictions.career.map((pred, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{pred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Wealth */}
                {currentMahadasha.predictions.wealth.length > 0 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold">Wealth & Finance</h4>
                    </div>
                    <ul className="space-y-1">
                      {currentMahadasha.predictions.wealth.map((pred, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{pred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Relationships */}
                {currentMahadasha.predictions.relationships.length > 0 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <h4 className="font-semibold">Relationships</h4>
                    </div>
                    <ul className="space-y-1">
                      {currentMahadasha.predictions.relationships.map((pred, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-pink-500 mt-0.5">•</span>
                          <span>{pred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Health */}
                {currentMahadasha.predictions.health.length > 0 && (
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="w-5 h-5 text-red-500" />
                      <h4 className="font-semibold">Health & Wellbeing</h4>
                    </div>
                    <ul className="space-y-1">
                      {currentMahadasha.predictions.health.map((pred, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{pred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="antardashas">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Antardasha Timeline</CardTitle>
              <CardDescription>
                Sub-periods within {currentMahadasha.planet} Mahadasha - Precise timing for events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentMahadasha.antardashas.map((ad, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`p-4 rounded-lg border ${ad.isCurrent ? 'bg-purple-500/10 border-purple-500' : 'bg-card'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPlanetEmoji(ad.planet)}</span>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {currentMahadasha.planet}-{ad.planet}
                            {ad.isCurrent && (
                              <Badge variant="default" className="text-xs">Current</Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ad.years.toFixed(1)} years ({ad.months}m {ad.days}d)
                          </p>
                        </div>
                      </div>
                      <Badge className={getQualityColor(ad.quality)}>
                        {ad.quality}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Complete Predictions</CardTitle>
              <CardDescription>All predictions for {currentMahadasha.planet} Mahadasha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Opportunities */}
              {currentMahadasha.predictions.opportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Opportunities & Strengths
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {currentMahadasha.predictions.opportunities.map((opp, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">• {opp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges */}
              {currentMahadasha.predictions.challenges.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Challenges & Cautions
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {currentMahadasha.predictions.challenges.map((ch, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">• {ch}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Spiritual */}
              {currentMahadasha.predictions.spiritual.length > 0 && (
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Spiritual Growth
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {currentMahadasha.predictions.spiritual.map((sp, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">• {sp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remedies">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Remedial Measures</CardTitle>
              <CardDescription>
                Vedic remedies to strengthen {currentMahadasha.planet} and reduce challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentMahadasha.remedies.length > 0 ? (
                <div className="space-y-4">
                  {currentMahadasha.remedies.map((remedy, idx) => (
                    <div key={idx} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3">
                        <Badge variant="outline" className="mt-0.5">{remedy.type}</Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-1">{remedy.description}</p>
                          {remedy.frequency && (
                            <p className="text-xs text-muted-foreground">
                              Frequency: {remedy.frequency}
                            </p>
                          )}
                          {remedy.caution && (
                            <p className="text-xs text-orange-500 mt-1 flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {remedy.caution}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No specific remedies needed - {currentMahadasha.planet} is well-placed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* All Mahadashas Timeline */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Complete 120-Year Dasha Timeline</CardTitle>
          <CardDescription>Vimshottari Mahadasha periods throughout your life</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dashaData.enhanced.slice(0, 9).map((dasha, idx) => {
              const isExpanded = expandedDasha === dasha.planet
              const isCurrent = dasha.planet === currentMahadasha.planet

              return (
                <div key={idx} className={`rounded-lg border ${isCurrent ? 'border-purple-500' : ''}`}>
                  <button
                    onClick={() => setExpandedDasha(isExpanded ? null : dasha.planet)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getPlanetEmoji(dasha.planet)}</span>
                      <div className="text-left">
                        <p className="font-semibold flex items-center gap-2">
                          {dasha.planet} Mahadasha
                          {isCurrent && (
                            <Badge variant="default" className="text-xs">Current</Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(dasha.startDate).getFullYear()} - {new Date(dasha.endDate).getFullYear()} ({dasha.years} years)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getFunctionalNatureColor(dasha.functionalNature)}>
                        {dasha.functionalNature}
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                      >
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Strength:</span>
                              <span className={`ml-2 font-semibold ${getStrengthColor(dasha.strength.overall)}`}>
                                {dasha.strength.overall}/100
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dignity:</span>
                              <span className="ml-2 font-semibold">{dasha.strength.dignity}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">House:</span>
                              <span className="ml-2 font-semibold">{dasha.strength.housePlacement}th ({dasha.strength.houseStrength})</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Rules:</span>
                              <span className="ml-2 font-semibold">{dasha.housesRuled.join(", ")} houses</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
