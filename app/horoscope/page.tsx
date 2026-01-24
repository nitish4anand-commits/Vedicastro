"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface DailyHoroscope {
  sign: string
  sanskrit: string
  symbol: string
  date: string
  overallScore: number
  predictions: {
    general: string
    love: string
    career: string
    finance: string
    health: string
  }
  scores: {
    love: number
    career: number
    finance: number
    health: number
  }
  luckyColor: string
  luckyNumber: number
  luckyTime: string
  advice: string
}

const ZODIAC_ICONS: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
}

const ZODIAC_DATES: Record<string, string> = {
  Aries: "Mar 21 - Apr 19",
  Taurus: "Apr 20 - May 20",
  Gemini: "May 21 - Jun 20",
  Cancer: "Jun 21 - Jul 22",
  Leo: "Jul 23 - Aug 22",
  Virgo: "Aug 23 - Sep 22",
  Libra: "Sep 23 - Oct 22",
  Scorpio: "Oct 23 - Nov 21",
  Sagittarius: "Nov 22 - Dec 21",
  Capricorn: "Dec 22 - Jan 19",
  Aquarius: "Jan 20 - Feb 18",
  Pisces: "Feb 19 - Mar 20",
}

const zodiacOrder = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

const COLOR_MAP: Record<string, string> = {
  Red: "bg-red-500",
  Orange: "bg-orange-500",
  Yellow: "bg-yellow-500",
  Green: "bg-green-500",
  Blue: "bg-blue-500",
  Purple: "bg-purple-500",
  Pink: "bg-pink-500",
  Gold: "bg-yellow-600",
  White: "bg-white border border-gray-300",
  Silver: "bg-gray-300",
  Black: "bg-gray-900",
  Grey: "bg-gray-500",
  Brown: "bg-amber-700",
  Maroon: "bg-red-800",
  Cream: "bg-amber-100",
  Turquoise: "bg-teal-400",
  "Sea Green": "bg-emerald-500",
  "Light Blue": "bg-sky-300",
}

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const today = new Date().toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  })

  useEffect(() => {
    if (selectedSign) {
      fetchHoroscope(selectedSign)
    }
  }, [selectedSign])

  const fetchHoroscope = async (sign: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/horoscope?sign=${sign}&type=daily`)
      if (!response.ok) throw new Error('Failed to fetch horoscope')
      
      const data = await response.json()
      setHoroscope(data)
    } catch (err) {
      setError('Failed to load horoscope. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getScoreStars = (score: number) => {
    const stars = Math.round(score / 20)
    return Array.from({ length: 5 }, (_, i) => i < stars)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <Star className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Daily <span className="gradient-text">Horoscope</span>
          </h1>
          <p className="text-lg text-muted-foreground">{today}</p>
        </div>

        {!selectedSign ? (
          <>
            <p className="text-center text-muted-foreground mb-8">
              Select your zodiac sign to view today&apos;s horoscope
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {zodiacOrder.map((sign, index) => (
                <motion.div
                  key={sign}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="glass-card cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                    onClick={() => setSelectedSign(sign)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-2 group-hover:scale-125 transition-transform">
                        {ZODIAC_ICONS[sign]}
                      </div>
                      <h3 className="font-bold text-lg">{sign}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {ZODIAC_DATES[sign]}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-muted-foreground">Loading your horoscope...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchHoroscope(selectedSign)}>
              Try Again
            </Button>
          </div>
        ) : horoscope ? (
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedSign(null)
                setHoroscope(null)
              }}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Signs
            </Button>

            <Card className="glass-card mb-8">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{horoscope.symbol}</div>
                <CardTitle className="text-3xl">{horoscope.sign}</CardTitle>
                <CardDescription>
                  {horoscope.sanskrit} • {ZODIAC_DATES[horoscope.sign]}
                </CardDescription>
                <div className="flex justify-center gap-1 mt-4">
                  {getScoreStars(horoscope.overallScore).map((filled, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        filled 
                          ? "fill-yellow-500 text-yellow-500" 
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className={`ml-2 font-semibold ${getScoreColor(horoscope.overallScore)}`}>
                    {horoscope.overallScore}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Lucky Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Lucky Color</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <div 
                        className={`w-4 h-4 rounded-full ${COLOR_MAP[horoscope.luckyColor] || 'bg-purple-500'}`} 
                      />
                      <span className="font-semibold">{horoscope.luckyColor}</span>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Lucky Number</p>
                    <p className="font-semibold text-lg">{horoscope.luckyNumber}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Lucky Time</p>
                    <p className="font-semibold text-lg">{horoscope.luckyTime}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Overall Rating</p>
                    <div className="flex justify-center gap-1 mt-1">
                      {getScoreStars(horoscope.overallScore).map((filled, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            filled 
                              ? "fill-yellow-500 text-yellow-500" 
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Area Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Object.entries(horoscope.scores).map(([area, score]) => (
                    <div key={area} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{area}</span>
                        <span className={getScoreColor(score)}>{score}%</span>
                      </div>
                      <Progress 
                        value={score} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>

                {/* Prediction Tabs */}
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="love">Love</TabsTrigger>
                    <TabsTrigger value="career">Career</TabsTrigger>
                    <TabsTrigger value="health">Health</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                  </TabsList>
                  {Object.entries(horoscope.predictions).map(([key, value]) => (
                    <TabsContent key={key} value={key} className="mt-6">
                      <p className="text-lg leading-relaxed">{value}</p>
                    </TabsContent>
                  ))}
                </Tabs>

                {/* Advice */}
                <div className="mt-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Today&apos;s Advice</h4>
                  <p className="text-muted-foreground">{horoscope.advice}</p>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center gap-4 flex-wrap">
              {zodiacOrder.map((sign) => (
                <Button
                  key={sign}
                  variant={sign === selectedSign ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSign(sign)}
                  className={sign === selectedSign ? "gradient-bg" : ""}
                >
                  {ZODIAC_ICONS[sign]} {sign}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
