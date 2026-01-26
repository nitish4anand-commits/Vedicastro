"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, User, Star, Check, X, AlertTriangle, Loader2, Sparkles, ChevronDown, ChevronUp, Info, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TimePicker, LocationAutocomplete, type LocationData } from "@/components/forms"

interface KootaExplanation {
  meaning: string
  impact: string
  scoreReason: string
  improvementTips?: string[]
}

interface MatchResult {
  koota: string
  maxPoints: number
  scored: number
  status: "pass" | "warning" | "fail"
  description: string
  combination?: string
  explanation?: KootaExplanation
}

interface OverallSummary {
  headline: string
  compatibilityPercent: number
  verdictType: 'excellent' | 'very-good' | 'good' | 'average' | 'needs-attention'
  strengths: Array<{ koota: string; why: string }>
  watchOuts: Array<{ koota: string; why: string; howToAddress: string }>
  compatibilityNote: string
}

interface DataQuality {
  isApproximate: boolean
  confidenceLevel: 'high' | 'medium' | 'low'
  limitations: string[]
}

interface MatchingResult {
  maleDetails: {
    nakshatra: string
    rashi: string
  }
  femaleDetails: {
    nakshatra: string
    rashi: string
  }
  kootas: MatchResult[]
  totalScore: number
  maxScore: number
  percentage: number
  verdict: string
  verdictType: 'excellent' | 'good' | 'average' | 'poor'
  doshas: string[]
  recommendations: string[]
  overallSummary?: OverallSummary
  dataQuality?: DataQuality
}

export default function MatchingPage() {
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedKoota, setExpandedKoota] = useState<string | null>(null)
  
  const [maleDetails, setMaleDetails] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: '',
    latitude: 0,
    longitude: 0,
    timezone: 'Asia/Kolkata'
  })
  
  const [femaleDetails, setFemaleDetails] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: '',
    latitude: 0,
    longitude: 0,
    timezone: 'Asia/Kolkata'
  })

  const handleMaleLocationChange = (location: LocationData) => {
    setMaleDetails(prev => ({
      ...prev,
      place: location.placeName,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone
    }))
  }

  const handleFemaleLocationChange = (location: LocationData) => {
    setFemaleDetails(prev => ({
      ...prev,
      place: location.placeName,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone
    }))
  }

  const handleCalculate = async () => {
    if (!maleDetails.date || !femaleDetails.date) {
      setError('Please enter birth dates for both partners')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maleBirthDate: maleDetails.date,
          maleBirthTime: maleDetails.time,
          maleTimezone: maleDetails.timezone === 'Asia/Kolkata' ? 5.5 : 0,
          malePlaceOfBirth: maleDetails.place,
          maleLatitude: maleDetails.latitude,
          maleLongitude: maleDetails.longitude,
          femaleBirthDate: femaleDetails.date,
          femaleBirthTime: femaleDetails.time,
          femaleTimezone: femaleDetails.timezone === 'Asia/Kolkata' ? 5.5 : 0,
          femalePlaceOfBirth: femaleDetails.place,
          femaleLatitude: femaleDetails.latitude,
          femaleLongitude: femaleDetails.longitude
        })
      })

      if (!response.ok) throw new Error('Failed to calculate matching')
      
      const data = await response.json()
      setResult(data)
      setShowResults(true)
    } catch (err) {
      setError('Failed to calculate matching. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "fail":
        return <X className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getVerdictColor = (type: string) => {
    switch (type) {
      case 'excellent': return 'text-green-500 bg-green-500/20'
      case 'good': return 'text-blue-500 bg-blue-500/20'
      case 'average': return 'text-yellow-500 bg-yellow-500/20'
      default: return 'text-red-500 bg-red-500/20'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 28) return "text-green-500"
    if (score >= 21) return "text-blue-500"
    if (score >= 18) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <Heart className="mx-auto h-16 w-16 text-pink-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Kundli <span className="gradient-text">Matching</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check marriage compatibility using the Ashtakoot Gun Milan system with 36 points analysis
          </p>
        </div>

        {!showResults ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Male Details */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-6 w-6 text-blue-500" />
                    <CardTitle>Male (Groom) Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <Input 
                      placeholder="Enter full name" 
                      value={maleDetails.name}
                      onChange={(e) => setMaleDetails({ ...maleDetails, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date of Birth *</label>
                    <Input 
                      type="date" 
                      value={maleDetails.date}
                      onChange={(e) => setMaleDetails({ ...maleDetails, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Time of Birth</label>
                    <TimePicker
                      value={maleDetails.time}
                      onChange={(time) => setMaleDetails({ ...maleDetails, time })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Place of Birth</label>
                    <LocationAutocomplete
                      value={maleDetails.place}
                      onChange={handleMaleLocationChange}
                      onInputChange={(place) => setMaleDetails({ ...maleDetails, place })}
                      placeholder="Enter city, state, country"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Female Details */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-6 w-6 text-pink-500" />
                    <CardTitle>Female (Bride) Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <Input 
                      placeholder="Enter full name" 
                      value={femaleDetails.name}
                      onChange={(e) => setFemaleDetails({ ...femaleDetails, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date of Birth *</label>
                    <Input 
                      type="date" 
                      value={femaleDetails.date}
                      onChange={(e) => setFemaleDetails({ ...femaleDetails, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Time of Birth</label>
                    <TimePicker
                      value={femaleDetails.time}
                      onChange={(time) => setFemaleDetails({ ...femaleDetails, time })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Place of Birth</label>
                    <LocationAutocomplete
                      value={femaleDetails.place}
                      onChange={handleFemaleLocationChange}
                      onInputChange={(place) => setFemaleDetails({ ...femaleDetails, place })}
                      placeholder="Enter city, state, country"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}

            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="gradient-bg text-white"
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Check Compatibility
                  </>
                )}
              </Button>
            </div>
          </>
        ) : result ? (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setShowResults(false)}
              className="mb-6"
            >
              ← Back to Form
            </Button>

            {/* Score Summary */}
            <Card className="glass-card mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-center">
                        <User className="h-8 w-8 text-blue-500 mx-auto mb-1" />
                        <p className="text-sm font-medium">{maleDetails.name || 'Groom'}</p>
                        <p className="text-xs text-muted-foreground">{result.maleDetails.nakshatra}</p>
                        <p className="text-xs text-muted-foreground">{result.maleDetails.rashi}</p>
                      </div>
                      <Heart className="h-8 w-8 text-pink-500" />
                      <div className="text-center">
                        <User className="h-8 w-8 text-pink-500 mx-auto mb-1" />
                        <p className="text-sm font-medium">{femaleDetails.name || 'Bride'}</p>
                        <p className="text-xs text-muted-foreground">{result.femaleDetails.nakshatra}</p>
                        <p className="text-xs text-muted-foreground">{result.femaleDetails.rashi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(result.totalScore)}`}>
                      {result.totalScore}
                    </div>
                    <div className="text-muted-foreground">out of {result.maxScore} points</div>
                    <Progress 
                      value={result.percentage} 
                      className="w-48 mt-2" 
                    />
                    <p className="text-sm mt-1">{result.percentage}% compatibility</p>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${getVerdictColor(result.verdictType)}`}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <p className="font-medium">{result.verdict}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Quality Warning */}
            {result.dataQuality && result.dataQuality.limitations.length > 0 && (
              <Card className="glass-card border-yellow-500/30 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                        Data Quality: {result.dataQuality.confidenceLevel === 'high' ? 'High Confidence' : result.dataQuality.confidenceLevel === 'medium' ? 'Moderate Confidence' : 'Lower Confidence'}
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.dataQuality.limitations.map((limitation, idx) => (
                          <li key={idx}>- {limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overall Summary */}
            {result.overallSummary && (
              <Card className="glass-card mb-8">
                <CardContent className="pt-6">
                  <p className="text-lg font-medium mb-4">{result.overallSummary.headline}</p>
                  <p className="text-muted-foreground mb-6">{result.overallSummary.compatibilityNote}</p>
                  
                  {result.overallSummary.strengths.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-2 mb-2">
                        <Check className="h-4 w-4" /> Key Strengths
                      </h4>
                      <ul className="space-y-2">
                        {result.overallSummary.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm p-2 bg-green-500/10 rounded-lg">
                            <span className="font-medium">{strength.koota}:</span> {strength.why}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.overallSummary.watchOuts.length > 0 && (
                    <div>
                      <h4 className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4" /> Areas for Attention
                      </h4>
                      <ul className="space-y-2">
                        {result.overallSummary.watchOuts.map((watchOut, idx) => (
                          <li key={idx} className="text-sm p-2 bg-amber-500/10 rounded-lg">
                            <span className="font-medium">{watchOut.koota}:</span> {watchOut.why}
                            <p className="text-xs text-muted-foreground mt-1">
                              <Lightbulb className="h-3 w-3 inline mr-1" />
                              {watchOut.howToAddress}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Kootas Details */}
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Ashtakoot Analysis (8 Kootas)
                </CardTitle>
                <CardDescription>
                  Click on each koota to learn more about its meaning and impact on your relationship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.kootas.map((koota, index) => (
                    <motion.div
                      key={koota.koota}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-muted/30 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedKoota(expandedKoota === koota.koota ? null : koota.koota)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                      >
                        {getStatusIcon(koota.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{koota.koota}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant={koota.status === 'pass' ? 'default' : koota.status === 'warning' ? 'secondary' : 'destructive'}>
                                {koota.scored} / {koota.maxPoints}
                              </Badge>
                              {expandedKoota === koota.koota ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{koota.description}</p>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedKoota === koota.koota && koota.explanation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border/50"
                          >
                            <div className="p-4 space-y-4 bg-background/50">
                              <div>
                                <h5 className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">What is {koota.koota}?</h5>
                                <p className="text-sm text-muted-foreground">{koota.explanation.meaning}</p>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Your Score Explained</h5>
                                <p className="text-sm text-muted-foreground">{koota.explanation.scoreReason}</p>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Impact on Your Relationship</h5>
                                <p className="text-sm text-muted-foreground">{koota.explanation.impact}</p>
                              </div>
                              
                              {koota.explanation.improvementTips && koota.explanation.improvementTips.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                                    <Lightbulb className="h-4 w-4" /> Guidance
                                  </h5>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {koota.explanation.improvementTips.map((tip, tipIdx) => (
                                      <li key={tipIdx} className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">-</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doshas */}
            {result.doshas.length > 0 && (
              <Card className="glass-card border-red-500/30 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    Doshas Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.doshas.map((dosha, index) => (
                      <li key={index} className="p-3 bg-red-500/10 rounded-lg text-sm">
                        {dosha}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowResults(false)}
              >
                Check Another Match
              </Button>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
