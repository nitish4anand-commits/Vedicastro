"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Star, Heart, Briefcase, DollarSign, Activity, Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const zodiacSigns = [
  { name: "Aries", hindi: "मेष", symbol: "♈", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", hindi: "वृषभ", symbol: "♉", dates: "Apr 20 - May 20" },
  { name: "Gemini", hindi: "मिथुन", symbol: "♊", dates: "May 21 - Jun 20" },
  { name: "Cancer", hindi: "कर्क", symbol: "♋", dates: "Jun 21 - Jul 22" },
  { name: "Leo", hindi: "सिंह", symbol: "♌", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", hindi: "कन्या", symbol: "♍", dates: "Aug 23 - Sep 22" },
  { name: "Libra", hindi: "तुला", symbol: "♎", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", hindi: "वृश्चिक", symbol: "♏", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", hindi: "धनु", symbol: "♐", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", hindi: "मकर", symbol: "♑", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", hindi: "कुंभ", symbol: "♒", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", hindi: "मीन", symbol: "♓", dates: "Feb 19 - Mar 20" },
]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

interface MonthlyHoroscope {
  sign: string
  sanskrit: string
  symbol: string
  month: string
  year: number
  overallScore: number
  scores: {
    love: number
    career: number
    finance: number
    health: number
  }
  overview: string
  lovePrediction: string
  careerPrediction: string
  financePrediction: string
  healthPrediction: string
  luckyNumbers: number[]
  luckyColors: string[]
  luckyDays: string[]
  challengingDays: number[]
  advice: string
  keyDates: { date: number; event: string }[]
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export default function RashifalPage() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const [selectedSign, setSelectedSign] = useState(zodiacSigns[0])
  const [selectedMonth, setSelectedMonth] = useState(months[currentMonth])
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
  const [rashifal, setRashifal] = useState<MonthlyHoroscope | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRashifal = async () => {
      setLoading(true)
      try {
        const monthIndex = months.indexOf(selectedMonth) + 1
        const response = await fetch(
          `/api/horoscope?sign=${selectedSign.name}&type=monthly&month=${monthIndex}&year=${selectedYear}`
        )
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setRashifal(data)
      } catch (error) {
        console.error('Failed to fetch rashifal:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRashifal()
  }, [selectedSign, selectedMonth, selectedYear, period])

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">राशिफल</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Monthly & Yearly Horoscope</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get detailed predictions for your zodiac sign covering love, career, 
            finance, and health.
          </p>
        </motion.div>

        {/* Period Selection */}
        <div className="flex justify-center mb-8">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as "monthly" | "yearly")} className="w-auto">
            <TabsList className="glass">
              <TabsTrigger value="monthly" className="gap-2">
                <Calendar className="h-4 w-4" />
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="gap-2">
                <Star className="h-4 w-4" />
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Zodiac Sign Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 mb-8"
        >
          {zodiacSigns.map((sign) => (
            <motion.button
              key={sign.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSign(sign)}
              className={`p-3 rounded-lg text-center transition-all ${
                selectedSign.name === sign.name
                  ? "glass-card border-purple-500 bg-purple-500/10"
                  : "glass hover:bg-muted/50"
              }`}
            >
              <div className="text-2xl mb-1">{sign.symbol}</div>
              <p className="text-xs font-medium truncate">{sign.name}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Month/Year Selection */}
        {period === "monthly" && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {months.map((month) => (
              <Button
                key={month}
                variant={selectedMonth === month ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMonth(month)}
                className={selectedMonth === month ? "gradient-bg" : ""}
              >
                {month.substring(0, 3)}
              </Button>
            ))}
          </div>
        )}

        {/* Year Selection */}
        <div className="flex justify-center gap-2 mb-8">
          {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
            <Button
              key={year}
              variant={selectedYear === year.toString() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year.toString())}
              className={selectedYear === year.toString() ? "gradient-bg" : ""}
            >
              {year}
            </Button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-muted-foreground">Loading your rashifal...</p>
          </div>
        ) : rashifal ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sign Header */}
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedSign.symbol}</div>
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedSign.name} ({selectedSign.hindi})
                      </CardTitle>
                      <CardDescription>
                        {rashifal.month} {rashifal.year} • {selectedSign.dates}
                      </CardDescription>
                    </div>
                    <div className="ml-auto text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(rashifal.overallScore)}`}>
                        {rashifal.overallScore}%
                      </div>
                      <p className="text-sm text-muted-foreground">Overall</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Overview */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Monthly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{rashifal.overview}</p>
                </CardContent>
              </Card>

              {/* Detailed Predictions */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-pink-500" />
                      Love & Relationships
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={rashifal.scores.love} className="flex-1" />
                      <span className={`text-sm font-medium ${getScoreColor(rashifal.scores.love)}`}>
                        {rashifal.scores.love}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rashifal.lovePrediction}</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      Career & Work
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={rashifal.scores.career} className="flex-1" />
                      <span className={`text-sm font-medium ${getScoreColor(rashifal.scores.career)}`}>
                        {rashifal.scores.career}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rashifal.careerPrediction}</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Finance & Wealth
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={rashifal.scores.finance} className="flex-1" />
                      <span className={`text-sm font-medium ${getScoreColor(rashifal.scores.finance)}`}>
                        {rashifal.scores.finance}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rashifal.financePrediction}</p>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-red-500" />
                      Health & Wellness
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={rashifal.scores.health} className="flex-1" />
                      <span className={`text-sm font-medium ${getScoreColor(rashifal.scores.health)}`}>
                        {rashifal.scores.health}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{rashifal.healthPrediction}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Advice */}
              <Card className="glass-card bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardHeader>
                  <CardTitle>Monthly Advice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg">{rashifal.advice}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lucky Info */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Lucky Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Lucky Numbers</p>
                    <div className="flex gap-2">
                      {rashifal.luckyNumbers.map((num) => (
                        <Badge key={num} variant="outline" className="text-lg px-3 py-1">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Lucky Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {rashifal.luckyColors.map((color) => (
                        <Badge key={color} className="bg-purple-500/20 text-purple-400">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Lucky Days</p>
                    <div className="flex flex-wrap gap-2">
                      {rashifal.luckyDays.map((day) => (
                        <Badge key={day} variant="secondary">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Challenging Days</p>
                    <div className="flex gap-2">
                      {rashifal.challengingDays.map((day) => (
                        <Badge key={day} variant="destructive" className="opacity-70">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Dates */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Key Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rashifal.keyDates.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                          {item.date}
                        </div>
                        <p className="text-sm">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scores Summary */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Score Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(rashifal.scores).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <span className={getScoreColor(value)}>{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
