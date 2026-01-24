"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, User, Star, Check, X, AlertTriangle, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface MatchResult {
  koota: string
  maxPoints: number
  scored: number
  status: "pass" | "warning" | "fail"
  description: string
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
}

export default function MatchingPage() {
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [maleDetails, setMaleDetails] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: ''
  })
  
  const [femaleDetails, setFemaleDetails] = useState({
    name: '',
    date: '',
    time: '12:00',
    place: ''
  })

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
          maleTimezone: 5.5,
          femaleBirthDate: femaleDetails.date,
          femaleBirthTime: femaleDetails.time,
          femaleTimezone: 5.5
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
                  <Input 
                    placeholder="Full Name" 
                    value={maleDetails.name}
                    onChange={(e) => setMaleDetails({ ...maleDetails, name: e.target.value })}
                  />
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
                    <Input 
                      type="time" 
                      value={maleDetails.time}
                      onChange={(e) => setMaleDetails({ ...maleDetails, time: e.target.value })}
                    />
                  </div>
                  <Input 
                    placeholder="Place of Birth" 
                    value={maleDetails.place}
                    onChange={(e) => setMaleDetails({ ...maleDetails, place: e.target.value })}
                  />
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
                  <Input 
                    placeholder="Full Name" 
                    value={femaleDetails.name}
                    onChange={(e) => setFemaleDetails({ ...femaleDetails, name: e.target.value })}
                  />
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
                    <Input 
                      type="time" 
                      value={femaleDetails.time}
                      onChange={(e) => setFemaleDetails({ ...femaleDetails, time: e.target.value })}
                    />
                  </div>
                  <Input 
                    placeholder="Place of Birth" 
                    value={femaleDetails.place}
                    onChange={(e) => setFemaleDetails({ ...femaleDetails, place: e.target.value })}
                  />
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

            {/* Kootas Details */}
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Ashtakoot Analysis (8 Kootas)
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of all 8 matching parameters
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
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      {getStatusIcon(koota.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{koota.koota}</h4>
                          <Badge variant={koota.status === 'pass' ? 'default' : koota.status === 'warning' ? 'secondary' : 'destructive'}>
                            {koota.scored} / {koota.maxPoints}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{koota.description}</p>
                      </div>
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
