"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, User, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimePicker, LocationAutocomplete, type LocationData } from "@/components/forms"

// Import all new components
import {
  HeroScoreCard,
  DataQualityBanner,
  NarrativeCard,
  StrengthsChallengesGrid,
  InteractiveKootasSection,
  DoshasSection,
  RadarChartCard,
  CircularProgressCard,
  ActionStepsCard,
  CTAButtons
} from "./components"

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
  const router = useRouter()
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
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
      
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError('Failed to calculate matching. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToForm = () => {
    setShowResults(false)
    setResult(null)
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Download report - feature coming soon')
    alert('PDF download feature coming soon!')
  }

  const handleBookConsultation = () => {
    router.push('/premium?source=matching')
  }

  const handleCheckAnother = () => {
    setResult(null)
    setShowResults(false)
    setMaleDetails({
      name: '',
      date: '',
      time: '12:00',
      place: '',
      latitude: 0,
      longitude: 0,
      timezone: 'Asia/Kolkata'
    })
    setFemaleDetails({
      name: '',
      date: '',
      time: '12:00',
      place: '',
      latitude: 0,
      longitude: 0,
      timezone: 'Asia/Kolkata'
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Kundli Matching Results',
      text: result 
        ? `We scored ${result.totalScore}/${result.maxScore} points (${result.percentage}%) in our Vedic compatibility analysis!`
        : 'Check your Vedic marriage compatibility!',
      url: window.location.href
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.log('Share failed:', err)
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch {
        alert('Unable to share. Please copy the URL manually.')
      }
    }
  }

  const handleKootaExpand = (kootaName: string) => {
    // Track analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'koota_expanded', {
        event_category: 'engagement',
        event_label: kootaName
      })
    }
  }

  // Map verdictType to summary verdictType
  const getVerdictTypeForSummary = (vt: string): string => {
    const mapping: Record<string, string> = {
      'excellent': 'excellent',
      'good': 'very-good',
      'average': 'average',
      'poor': 'needs-attention'
    }
    return mapping[vt] || vt
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={showResults ? handleBackToForm : () => router.push('/')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm font-medium hidden sm:inline">
                {showResults ? 'Back to Form' : 'Home'}
              </span>
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Kundli Matching
            </h1>
            <div className="w-16 sm:w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            // FORM VIEW
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Heart className="mx-auto h-12 w-12 md:h-16 md:w-16 text-pink-500 mb-4" />
                </motion.div>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Check Marriage <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Compatibility</span>
                </h2>
                <p className="text-sm md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Using the Ashtakoot Gun Milan system with 36 points analysis
                </p>
              </div>

              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {/* Male Details */}
                <Card className="bg-white/60 dark:bg-gray-900/60 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">Male (Groom)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block font-normal">Full Name</label>
                      <Input
                        placeholder="Enter full name"
                        value={maleDetails.name}
                        onChange={(e) => setMaleDetails({ ...maleDetails, name: e.target.value })}
                        className="bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-purple-500 h-11 text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block font-normal">Date of Birth *</label>
                      <Input
                        type="date"
                        value={maleDetails.date}
                        onChange={(e) => setMaleDetails({ ...maleDetails, date: e.target.value })}
                        className="bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-purple-500 h-11 text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Time of Birth</label>
                      <TimePicker
                        value={maleDetails.time}
                        onChange={(time) => setMaleDetails({ ...maleDetails, time })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Place of Birth</label>
                      <LocationAutocomplete
                        value={maleDetails.place}
                        onChange={handleMaleLocationChange}
                        onInputChange={(place: string) => setMaleDetails({ ...maleDetails, place })}
                        placeholder="Enter city, state, country"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Female Details */}
                <Card className="bg-white/60 dark:bg-gray-900/60 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                        <User className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                      </div>
                      <CardTitle className="text-gray-900 dark:text-white">Female (Bride)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block font-normal">Full Name</label>
                      <Input
                        placeholder="Enter full name"
                        value={femaleDetails.name}
                        onChange={(e) => setFemaleDetails({ ...femaleDetails, name: e.target.value })}
                        className="bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-purple-500 h-11 text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block font-normal">Date of Birth *</label>
                      <Input
                        type="date"
                        value={femaleDetails.date}
                        onChange={(e) => setFemaleDetails({ ...femaleDetails, date: e.target.value })}
                        className="bg-gray-100/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 focus:border-purple-500 h-11 text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Time of Birth</label>
                      <TimePicker
                        value={femaleDetails.time}
                        onChange={(time) => setFemaleDetails({ ...femaleDetails, time })}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1.5 block">Place of Birth</label>
                      <LocationAutocomplete
                        value={femaleDetails.place}
                        onChange={handleFemaleLocationChange}
                        onInputChange={(place: string) => setFemaleDetails({ ...femaleDetails, place })}
                        placeholder="Enter city, state, country"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-center mt-4 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/25"
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

              <p className="text-center text-gray-500 text-xs mt-4">
                * Birth date is required. Birth time and place help improve accuracy.
              </p>
            </motion.div>
          ) : result ? (
            // RESULTS VIEW - New Enhanced UI
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto space-y-6 md:space-y-8"
            >
              {/* 1. Data Quality Warning */}
              {result.dataQuality && (
                <DataQualityBanner
                  isApproximate={result.dataQuality.isApproximate}
                  confidenceLevel={result.dataQuality.confidenceLevel}
                  limitations={result.dataQuality.limitations}
                />
              )}

              {/* 2. Hero Score Card */}
              <HeroScoreCard
                score={result.totalScore}
                total={result.maxScore}
                percent={result.percentage}
                verdict={result.overallSummary?.verdictType || getVerdictTypeForSummary(result.verdictType)}
                maleName={maleDetails.name || 'Groom'}
                femaleName={femaleDetails.name || 'Bride'}
                maleSign={result.maleDetails.rashi}
                femaleSign={result.femaleDetails.rashi}
                maleNakshatra={result.maleDetails.nakshatra}
                femaleNakshatra={result.femaleDetails.nakshatra}
              />

              {/* 3. Visual Representations */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <RadarChartCard kootas={result.kootas} />
                <CircularProgressCard
                  score={result.totalScore}
                  total={result.maxScore}
                  kootas={result.kootas}
                />
              </div>

              {/* 4. Narrative Summary */}
              {result.overallSummary && (
                <NarrativeCard
                  headline={result.overallSummary.headline}
                  body={result.overallSummary.compatibilityNote}
                />
              )}

              {/* 5. Strengths & Challenges */}
              {result.overallSummary && (
                <StrengthsChallengesGrid
                  strengths={result.overallSummary.strengths}
                  challenges={result.overallSummary.watchOuts}
                />
              )}

              {/* 6. Interactive 8 Kootas Section */}
              <InteractiveKootasSection
                kootas={result.kootas}
                onExpand={handleKootaExpand}
              />

              {/* 7. Doshas Section */}
              {result.doshas && result.doshas.length > 0 && (
                <DoshasSection doshas={result.doshas} />
              )}

              {/* 8. Action Steps */}
              {result.recommendations && result.recommendations.length > 0 && (
                <ActionStepsCard steps={result.recommendations} />
              )}

              {/* 9. CTA Buttons */}
              <CTAButtons
                onDownload={handleDownload}
                onBookConsultation={handleBookConsultation}
                onCheckAnother={handleCheckAnother}
                onShare={handleShare}
              />

              {/* 10. Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center py-6 md:py-8 border-t border-gray-200/50 dark:border-gray-800/50"
              >
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  This analysis is based on traditional Vedic astrology principles.
                </p>
                <p className="text-[10px] md:text-xs text-gray-500">
                  For personalized guidance, consider consulting with a certified astrologer.
                </p>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-purple-500/30 text-center max-w-sm mx-4 shadow-xl"
              >
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Loader2 className="w-16 h-16 text-purple-500 dark:text-purple-400 animate-spin" />
                  <Heart className="w-6 h-6 text-pink-500 dark:text-pink-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-2">Calculating Compatibility...</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyzing planetary positions and koota scores
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
