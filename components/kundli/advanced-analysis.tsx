"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Star, 
  TrendingUp, 
  Shield, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Heart,
  Zap,
  Brain,
  Compass
} from "lucide-react"

interface ShadbalaResult {
  planet: string
  totalBala: number
  percentage: number
  isStrong: boolean
  interpretation: string
  sthanaaBala: number
  digBala: number
  kaalaBala: number
}

interface YogaResult {
  name: string
  sanskritName: string
  category: string
  strength: string
  formingPlanets: string[]
  effects: string
  timing: string
  remedies?: string[]
}

interface AntardashaDetail {
  planet: string
  startDate: string
  endDate: string
  duration: number
  interpretation: string
  keyThemes: string[]
  favorableFor: string[]
  challengingFor: string[]
  remedies: string[]
}

interface DashaAnalysis {
  currentMahadasha: {
    planet: string
    startDate: string
    endDate: string
    yearsRemaining: number
    interpretation: string
    keyThemes: string[]
    antardashas: AntardashaDetail[]
  }
  upcomingMahadashas: Array<{
    planet: string
    startDate: string
    endDate: string
    years: number
    preview: string
  }>
}

interface BhavaAnalysis {
  house: number
  sign: string
  lord: string
  lordPosition: { house: number; sign: string }
  planetsInHouse: string[]
  strength: string
  significations: string[]
  predictions: string
}

interface TransitEffect {
  planet: string
  currentSign: string
  natalHouse: number
  overallEffect: string
  duration: string
  interpretation: string
}

interface AdvancedAnalysisProps {
  shadbala: ShadbalaResult[]
  yogas: YogaResult[]
  dashaAnalysis: DashaAnalysis
  bhavaAnalysis: BhavaAnalysis[]
  transits: TransitEffect[]
  overallSummary: string
  strengthsAndWeaknesses: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
  }
}

const planetColors: Record<string, string> = {
  Sun: "from-orange-500 to-yellow-500",
  Moon: "from-slate-300 to-slate-100",
  Mars: "from-red-500 to-red-700",
  Mercury: "from-green-500 to-emerald-500",
  Jupiter: "from-yellow-500 to-amber-500",
  Venus: "from-pink-500 to-rose-400",
  Saturn: "from-blue-900 to-indigo-900",
  Rahu: "from-gray-700 to-gray-900",
  Ketu: "from-purple-700 to-purple-900"
}

const planetIcons: Record<string, React.ReactNode> = {
  Sun: <Sparkles className="h-4 w-4" />,
  Moon: <Heart className="h-4 w-4" />,
  Mars: <Zap className="h-4 w-4" />,
  Mercury: <Brain className="h-4 w-4" />,
  Jupiter: <Star className="h-4 w-4" />,
  Venus: <Heart className="h-4 w-4" />,
  Saturn: <Shield className="h-4 w-4" />,
  Rahu: <Compass className="h-4 w-4" />,
  Ketu: <Target className="h-4 w-4" />
}

export function AdvancedAnalysisView({ 
  shadbala, 
  yogas, 
  dashaAnalysis, 
  bhavaAnalysis, 
  transits,
  overallSummary,
  strengthsAndWeaknesses 
}: AdvancedAnalysisProps) {
  const [expandedYoga, setExpandedYoga] = useState<string | null>(null)
  const [expandedHouse, setExpandedHouse] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      {/* Overall Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-purple-500" />
              Your Cosmic Blueprint
            </CardTitle>
            <CardDescription>State-of-the-art Vedic analysis combining Shadbala, Ashtakavarga, and classical Yogas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: overallSummary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
            
            {/* Strengths & Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Your Strengths
                </h4>
                <ul className="text-sm space-y-1">
                  {strengthsAndWeaknesses.strengths.slice(0, 4).map((s, i) => (
                    <li key={i} className="text-muted-foreground">• {s}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Opportunities
                </h4>
                <ul className="text-sm space-y-1">
                  {strengthsAndWeaknesses.opportunities.slice(0, 4).map((o, i) => (
                    <li key={i} className="text-muted-foreground">• {o}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Areas to Work On
                </h4>
                <ul className="text-sm space-y-1">
                  {strengthsAndWeaknesses.weaknesses.slice(0, 4).map((w, i) => (
                    <li key={i} className="text-muted-foreground">• {w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="shadbala" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="shadbala">Shadbala</TabsTrigger>
          <TabsTrigger value="yogas">Yogas</TabsTrigger>
          <TabsTrigger value="dasha">Dasha</TabsTrigger>
          <TabsTrigger value="bhavas">Houses</TabsTrigger>
          <TabsTrigger value="transits">Transits</TabsTrigger>
        </TabsList>

        {/* Shadbala Analysis */}
        <TabsContent value="shadbala" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Shadbala - Six-fold Planetary Strength</CardTitle>
              <CardDescription>
                Ancient system measuring planetary power through 6 different sources of strength
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {shadbala.map((planet, index) => (
                  <motion.div
                    key={planet.planet}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${planetColors[planet.planet]} flex items-center justify-center text-white`}>
                          {planetIcons[planet.planet]}
                        </div>
                        <div>
                          <h4 className="font-semibold">{planet.planet}</h4>
                          <p className="text-xs text-muted-foreground">
                            {planet.totalBala.toFixed(2)} Rupas
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={planet.isStrong ? "default" : "secondary"} className={planet.isStrong ? "bg-green-500" : "bg-yellow-500"}>
                          {planet.percentage.toFixed(0)}%
                        </Badge>
                        {planet.isStrong ? (
                          <span className="text-green-500 text-sm">✓ Strong</span>
                        ) : (
                          <span className="text-yellow-500 text-sm">⚠ Needs Support</span>
                        )}
                      </div>
                    </div>
                    
                    <Progress 
                      value={Math.min(planet.percentage, 150)} 
                      className="h-2"
                    />
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {planet.interpretation.split('\n')[0]}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Yogas Analysis */}
        <TabsContent value="yogas" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Classical Yogas in Your Chart</CardTitle>
              <CardDescription>
                Special planetary combinations that shape your destiny
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {yogas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Analyzing yogas... Your chart is being processed for special combinations.
                  </p>
                ) : (
                  yogas.map((yoga, index) => (
                    <motion.div
                      key={yoga.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className="p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                        onClick={() => setExpandedYoga(expandedYoga === yoga.name ? null : yoga.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{yoga.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                ({yoga.sanskritName})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={
                                yoga.category === "Raja" ? "border-purple-500 text-purple-500" :
                                yoga.category === "Dhana" ? "border-yellow-500 text-yellow-500" :
                                yoga.category === "Arishta" ? "border-red-500 text-red-500" :
                                "border-blue-500 text-blue-500"
                              }>
                                {yoga.category} Yoga
                              </Badge>
                              <Badge variant="secondary">
                                {yoga.strength}
                              </Badge>
                            </div>
                          </div>
                          {expandedYoga === yoga.name ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {expandedYoga === yoga.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-border/50">
                                <p className="text-sm text-muted-foreground mb-3">
                                  <strong>Formed by:</strong> {yoga.formingPlanets.join(", ")}
                                </p>
                                <p className="text-sm mb-3">{yoga.effects}</p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Timing:</strong> {yoga.timing}
                                </p>
                                {yoga.remedies && yoga.remedies.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium text-yellow-500">Remedies:</p>
                                    <ul className="text-sm text-muted-foreground mt-1">
                                      {yoga.remedies.map((r, i) => (
                                        <li key={i}>• {r}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dasha Analysis */}
        <TabsContent value="dasha" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vimshottari Dasha - Life Timeline
              </CardTitle>
              <CardDescription>
                Your current planetary period and what&apos;s ahead
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Mahadasha */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${planetColors[dashaAnalysis.currentMahadasha.planet]} flex items-center justify-center text-white text-lg font-bold`}>
                    {dashaAnalysis.currentMahadasha.planet.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {dashaAnalysis.currentMahadasha.planet} Mahadasha
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dashaAnalysis.currentMahadasha.yearsRemaining.toFixed(1)} years remaining
                    </p>
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none text-sm">
                  <div dangerouslySetInnerHTML={{ 
                    __html: dashaAnalysis.currentMahadasha.interpretation
                      .replace(/\n/g, '<br/>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/###\s(.*?)(<br\/>|$)/g, '<h4>$1</h4>')
                  }} />
                </div>

                {/* Antardashas Timeline */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">Antardasha Timeline</h4>
                  <div className="space-y-2">
                    {dashaAnalysis.currentMahadasha.antardashas.slice(0, 5).map((ad, index) => {
                      const isActive = new Date(ad.startDate) <= new Date() && new Date() <= new Date(ad.endDate)
                      return (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg border ${isActive ? 'border-purple-500 bg-purple-500/10' : 'border-border/50'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${planetColors[ad.planet]} flex items-center justify-center text-white text-xs`}>
                                {ad.planet.substring(0, 1)}
                              </div>
                              <span className="font-medium">{dashaAnalysis.currentMahadasha.planet}-{ad.planet}</span>
                              {isActive && <Badge className="bg-purple-500">Current</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {ad.interpretation}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Upcoming Mahadashas */}
              <div>
                <h4 className="font-semibold mb-4">Upcoming Major Periods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashaAnalysis.upcomingMahadashas.map((md, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${planetColors[md.planet]} flex items-center justify-center text-white text-sm`}>
                          {md.planet.substring(0, 2)}
                        </div>
                        <div>
                          <h5 className="font-medium">{md.planet} Mahadasha</h5>
                          <p className="text-xs text-muted-foreground">{md.years} years</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {md.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bhava Analysis */}
        <TabsContent value="bhavas" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Bhava Analysis - House Predictions</CardTitle>
              <CardDescription>
                Detailed analysis of all 12 houses of your birth chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bhavaAnalysis.map((bhava) => (
                  <motion.div
                    key={bhava.house}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: bhava.house * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => setExpandedHouse(expandedHouse === bhava.house ? null : bhava.house)}
                  >
                    <div className={`p-4 rounded-lg border transition-all ${
                      expandedHouse === bhava.house ? 'border-purple-500 bg-purple-500/10' : 'border-border/50 hover:border-purple-500/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {bhava.house}
                          </span>
                          <div>
                            <h5 className="font-medium text-sm">{bhava.sign}</h5>
                            <p className="text-xs text-muted-foreground">Lord: {bhava.lord}</p>
                          </div>
                        </div>
                        <Badge variant={
                          bhava.strength === "strong" ? "default" :
                          bhava.strength === "weak" ? "secondary" : "outline"
                        } className={
                          bhava.strength === "strong" ? "bg-green-500" :
                          bhava.strength === "weak" ? "bg-red-500/80" : ""
                        }>
                          {bhava.strength}
                        </Badge>
                      </div>
                      
                      {bhava.planetsInHouse.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {bhava.planetsInHouse.map(p => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded bg-muted">
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {bhava.significations.slice(0, 3).join(", ")}
                      </p>
                      
                      <AnimatePresence>
                        {expandedHouse === bhava.house && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs text-muted-foreground mb-2">
                                <strong>Lord Position:</strong> {bhava.lord} in {bhava.lordPosition.house}th house ({bhava.lordPosition.sign})
                              </p>
                              <div className="prose prose-invert text-xs max-w-none">
                                <div dangerouslySetInnerHTML={{ 
                                  __html: bhava.predictions
                                    .replace(/\n/g, '<br/>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/###\s(.*?)(<br\/>|$)/g, '<h5 class="text-sm font-semibold mt-2">$1</h5>')
                                }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transits */}
        <TabsContent value="transits" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Current Planetary Transits</CardTitle>
              <CardDescription>
                How current planetary positions are affecting your birth chart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transits.map((transit, index) => (
                  <motion.div
                    key={transit.planet}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${planetColors[transit.planet]} flex items-center justify-center text-white`}>
                          {planetIcons[transit.planet]}
                        </div>
                        <div>
                          <h5 className="font-medium">{transit.planet}</h5>
                          <p className="text-xs text-muted-foreground">
                            in {transit.currentSign}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        transit.overallEffect.includes("favorable") ? "default" :
                        transit.overallEffect.includes("challenging") ? "destructive" : "secondary"
                      } className={
                        transit.overallEffect === "highly favorable" ? "bg-green-500" :
                        transit.overallEffect === "favorable" ? "bg-green-400" :
                        transit.overallEffect === "highly challenging" ? "bg-red-600" :
                        transit.overallEffect === "challenging" ? "bg-red-500" : ""
                      }>
                        {transit.overallEffect}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      Transiting your <strong>{transit.natalHouse}th house</strong>
                    </p>
                    
                    <div className="prose prose-invert text-xs max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: transit.interpretation
                          .replace(/\n/g, '<br/>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Duration: {transit.duration}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
