"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Share2, Sparkles, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { NorthIndianChart } from "@/components/kundli/north-indian-chart"
import { PlanetaryPositionsTable } from "@/components/kundli/planetary-table"
import { DashaTimeline } from "@/components/kundli/dasha-timeline"
import { EnhancedDashaView } from "@/components/kundli/enhanced-dasha-view"
import { YogaAnalysis } from "@/components/kundli/yoga-analysis"
import { DoshaAnalysis } from "@/components/kundli/dosha-analysis"
import { Remedies } from "@/components/kundli/remedies"
import { AdvancedAnalysisView } from "@/components/kundli/advanced-analysis"
import { generateKundliPDF } from "@/lib/pdf/generate-kundli-pdf"
import { useRouter } from "next/navigation"

// Sample Kundli data structure for default values
const sampleKundliData = {
  birthDetails: {
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
  },
  kundli: {
    ascendant: {
      sign: "Mesha",
      nakshatra: "Ashwini",
      pada: 2,
      degree: "15°30'",
    },
    moonSign: { name: "Vrishabha", english: "Taurus" },
    sunSign: { name: "Makara", english: "Capricorn" },
  },
  planets: [
    { name: "Sun", sign: "Makara", nakshatra: "Shravana", house: 10, degree: "0°45'", isRetrograde: false },
    { name: "Moon", sign: "Vrishabha", nakshatra: "Rohini", house: 2, degree: "15°20'", isRetrograde: false },
    { name: "Mars", sign: "Dhanu", nakshatra: "Mula", house: 9, degree: "8°15'", isRetrograde: false },
    { name: "Mercury", sign: "Makara", nakshatra: "Uttara Ashadha", house: 10, degree: "22°30'", isRetrograde: false },
    { name: "Jupiter", sign: "Mithuna", nakshatra: "Ardra", house: 3, degree: "12°45'", isRetrograde: true },
    { name: "Venus", sign: "Kumbha", nakshatra: "Shatabhisha", house: 11, degree: "5°10'", isRetrograde: false },
    { name: "Saturn", sign: "Dhanu", nakshatra: "Purva Ashadha", house: 9, degree: "25°55'", isRetrograde: false },
    { name: "Rahu", sign: "Kumbha", nakshatra: "Dhanishta", house: 11, degree: "18°20'", isRetrograde: true },
    { name: "Ketu", sign: "Simha", nakshatra: "Magha", house: 5, degree: "18°20'", isRetrograde: true },
  ],
  dasha: {
    currentDasha: "Jupiter",
    timeline: [
      { planet: "Jupiter", startDate: "2020-03-15", endDate: "2036-03-15", duration: "16 years" },
      { planet: "Saturn", startDate: "2036-03-15", endDate: "2055-03-15", duration: "19 years" },
      { planet: "Mercury", startDate: "2055-03-15", endDate: "2072-03-15", duration: "17 years" },
      { planet: "Ketu", startDate: "2072-03-15", endDate: "2079-03-15", duration: "7 years" },
      { planet: "Venus", startDate: "2079-03-15", endDate: "2099-03-15", duration: "20 years" },
    ],
  },
  yogas: [
    { name: "Gajakesari Yoga", description: "Jupiter and Moon in mutual kendras brings wisdom and prosperity", strength: "High" },
    { name: "Budhaditya Yoga", description: "Sun-Mercury conjunction enhances intelligence", strength: "Medium" },
  ],
  doshas: [
    {
      name: "Mangal Dosha",
      description: "Mars in 9th house - mild effect on relationships",
      severity: "medium" as const,
      remedies: ["Recite Hanuman Chalisa daily", "Fast on Tuesdays", "Donate red items"],
    },
  ],
}

export default function KundliDashboard() {
  const [advancedAnalysis, setAdvancedAnalysis] = useState<any>(null)
  const [kundliData, setKundliData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [birthDetails, setBirthDetails] = useState<any>(null)
  const router = useRouter()

  // Load birth details from localStorage and fetch advanced analysis
  useEffect(() => {
    // Load birth details from localStorage
    const storedDetails = localStorage.getItem("birthDetails")

    if (!storedDetails) {
      // No birth details found, redirect to form
      router.push("/kundli")
      return
    }

    try {
      const details = JSON.parse(storedDetails)
      setBirthDetails(details)

      // Fetch advanced analysis with actual user data
      const fetchAdvancedAnalysis = async () => {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch('/api/kundli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: details.name,
              dateOfBirth: details.dateOfBirth,
              timeOfBirth: details.timeOfBirth,
              placeOfBirth: details.placeOfBirth,
              latitude: details.latitude || 0,
              longitude: details.longitude || 0,
              timezone: parseFloat(details.timezone || "0")
            })
          })

          if (!response.ok) {
            throw new Error('Failed to fetch analysis')
          }

          const data = await response.json()

          // Store complete Kundli data
          if (data.status === 'success' && data.data) {
            setKundliData(data.data)
            setAdvancedAnalysis(data.data.advancedAnalysis)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          console.error('Failed to fetch advanced analysis:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchAdvancedAnalysis()
    } catch (err) {
      console.error('Failed to parse birth details:', err)
      router.push("/kundli")
    }
  }, [router])

  const handleDownloadPDF = () => {
    if (birthDetails && kundliData) {
      generateKundliPDF({
        birthDetails: {
          name: birthDetails.name,
          dateOfBirth: birthDetails.dateOfBirth,
          timeOfBirth: birthDetails.timeOfBirth,
          placeOfBirth: birthDetails.placeOfBirth,
        },
        kundli: kundliData.kundli || sampleKundliData.kundli,
        planets: kundliData.planets || sampleKundliData.planets,
        dasha: kundliData.dasha || sampleKundliData.dasha,
        yogas: kundliData.yogas || sampleKundliData.yogas,
        doshas: kundliData.doshas || sampleKundliData.doshas
      })
    }
  }

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  // Format time from 24-hour to 12-hour with AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const hour = parseInt(hours)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour.toString().padStart(2, "0")}:${minutes} ${period}`
  }

  // Get zodiac sign emoji
  const getZodiacEmoji = (sign: string) => {
    const emojiMap: Record<string, string> = {
      'Aries': '♈', 'Mesha': '♈',
      'Taurus': '♉', 'Vrishabha': '♉',
      'Gemini': '♊', 'Mithuna': '♊',
      'Cancer': '♋', 'Karka': '♋',
      'Leo': '♌', 'Simha': '♌',
      'Virgo': '♍', 'Kanya': '♍',
      'Libra': '♎', 'Tula': '♎',
      'Scorpio': '♏', 'Vrishchika': '♏',
      'Sagittarius': '♐', 'Dhanu': '♐',
      'Capricorn': '♑', 'Makara': '♑',
      'Aquarius': '♒', 'Kumbha': '♒',
      'Pisces': '♓', 'Meena': '♓'
    }
    return emojiMap[sign] || '⭐'
  }

  // Get Sanskrit name for zodiac sign
  const getSanskritName = (sign: string) => {
    const sanskritMap: Record<string, string> = {
      'Aries': 'Mesha', 'Taurus': 'Vrishabha', 'Gemini': 'Mithuna',
      'Cancer': 'Karka', 'Leo': 'Simha', 'Virgo': 'Kanya',
      'Libra': 'Tula', 'Scorpio': 'Vrishchika', 'Sagittarius': 'Dhanu',
      'Capricorn': 'Makara', 'Aquarius': 'Kumbha', 'Pisces': 'Meena'
    }
    return sanskritMap[sign] || sign
  }

  // Show loading state while checking localStorage
  if (!birthDetails) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your Kundli...</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Kundli Dashboard</h1>
          <p className="text-muted-foreground">
            Explore your personalized Vedic astrology chart and predictions
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced" className="relative">
              <Sparkles className="h-3 w-3 mr-1" />
              Advanced
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full animate-pulse" />
            </TabsTrigger>
            <TabsTrigger value="chart">Birth Chart</TabsTrigger>
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="dasha">Dasha</TabsTrigger>
            <TabsTrigger value="yogas">Yogas</TabsTrigger>
            <TabsTrigger value="doshas">Doshas</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="remedies">Remedies</TabsTrigger>
            <TabsTrigger value="divisional">Divisional</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{birthDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">DOB:</span>
                      <span className="font-medium">{formatDate(birthDetails.dateOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">TOB:</span>
                      <span className="font-medium">{formatTime(birthDetails.timeOfBirth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">POB:</span>
                      <span className="font-medium">{birthDetails.placeOfBirth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Ascendant (Lagna)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {kundliData?.kundli?.ascendant ? (
                      <>
                        <div className="text-4xl font-bold gradient-text mb-2">
                          {getZodiacEmoji(kundliData.kundli.ascendant.sign)}
                        </div>
                        <p className="text-2xl font-semibold">{kundliData.kundli.ascendant.sign}</p>
                        <p className="text-sm text-muted-foreground">{getSanskritName(kundliData.kundli.ascendant.sign)} Lagna</p>
                        <p className="text-xs text-muted-foreground mt-1">{kundliData.kundli.ascendant.degree}</p>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Calculating...</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Moon Sign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {kundliData?.kundli?.moonSign ? (
                      <>
                        <div className="text-4xl font-bold gradient-text mb-2">
                          {getZodiacEmoji(kundliData.kundli.moonSign.english || kundliData.kundli.moonSign.name)}
                        </div>
                        <p className="text-2xl font-semibold">{kundliData.kundli.moonSign.english || kundliData.kundli.moonSign.name}</p>
                        <p className="text-sm text-muted-foreground">{kundliData.kundli.moonSign.name || getSanskritName(kundliData.kundli.moonSign.english)} Rashi</p>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Calculating...</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Nakshatra</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {kundliData?.kundli?.ascendant?.nakshatra ? (
                      <>
                        <p className="text-2xl font-semibold mb-1">{kundliData.kundli.ascendant.nakshatra}</p>
                        <p className="text-sm text-muted-foreground mb-2">Pada {kundliData.kundli.ascendant.pada}</p>
                        <div className="text-3xl">🌙</div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">Calculating...</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Summary</CardTitle>
                <CardDescription>Overview of your astrological profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Current Dasha</h4>
                    <p className="text-sm text-muted-foreground">
                      Sun Mahadasha → Moon Antardasha
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Lucky Gemstone</h4>
                    <p className="text-sm text-muted-foreground">
                      Ruby (Manik) - 5 to 7 carats
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Active Yogas</h4>
                    <p className="text-sm text-muted-foreground">
                      5 Raj Yogas, 3 Dhana Yogas detected
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Dosha Status</h4>
                    <p className="text-sm text-muted-foreground">
                      No Manglik Dosha, Kaal Sarp Yoga Present
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Analysis Tab - State-of-the-Art Predictions */}
          <TabsContent value="advanced" className="space-y-6">
            {loading ? (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                  <p className="text-lg font-medium">Generating Advanced Analysis...</p>
                  <p className="text-sm text-muted-foreground">
                    Computing Shadbala, Ashtakavarga, and 100+ Yoga combinations
                  </p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="glass-card border-red-500/20">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <p className="text-lg font-medium text-red-500">Error loading analysis</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : advancedAnalysis ? (
              <AdvancedAnalysisView
                shadbala={advancedAnalysis.shadbala || []}
                yogas={advancedAnalysis.yogas || []}
                dashaAnalysis={advancedAnalysis.dashaAnalysis || {
                  currentMahadasha: {
                    planet: "Jupiter",
                    startDate: new Date().toISOString(),
                    endDate: new Date().toISOString(),
                    yearsRemaining: 10,
                    interpretation: "Loading...",
                    keyThemes: [],
                    antardashas: []
                  },
                  upcomingMahadashas: []
                }}
                bhavaAnalysis={advancedAnalysis.bhavaAnalysis || []}
                transits={advancedAnalysis.transits || []}
                overallSummary={advancedAnalysis.overallSummary || "Generating comprehensive analysis..."}
                strengthsAndWeaknesses={advancedAnalysis.strengthsAndWeaknesses || {
                  strengths: [],
                  weaknesses: [],
                  opportunities: []
                }}
              />
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <Sparkles className="h-12 w-12 text-purple-500 mb-4" />
                  <p className="text-lg font-medium">No Analysis Available</p>
                  <p className="text-sm text-muted-foreground">
                    Generate your Kundli to see the advanced analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chart">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Birth Chart (Rashi Chart)</CardTitle>
                <CardDescription>Your Vedic birth chart showing planetary positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <NorthIndianChart
                    planets={kundliData?.planets?.map((p: any) => ({
                      name: p.name,
                      symbol: ({ Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋" } as Record<string, string>)[p.name] || "●",
                      house: p.house || 1,
                      retrograde: p.isRetrograde
                    }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planets">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Planetary Positions</CardTitle>
                <CardDescription>Detailed positions of all planets in your chart</CardDescription>
              </CardHeader>
              <CardContent>
                <PlanetaryPositionsTable planets={kundliData?.planets} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dasha">
            {kundliData?.dasha?.enhanced ? (
              <EnhancedDashaView dashaData={kundliData.dasha} />
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Dasha Periods</CardTitle>
                  <CardDescription>Vimshottari Dasha timeline and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashaTimeline
                    currentMahadasha={kundliData?.dasha?.currentDasha}
                    periods={kundliData?.dasha?.timeline?.map((d: any, idx: number) => ({
                      planet: d.planet,
                      startDate: d.startDate,
                      endDate: d.endDate,
                      years: parseFloat(d.duration) || 0,
                      isCurrent: idx === 0
                    }))}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="yogas">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Yogas in Your Chart</CardTitle>
                <CardDescription>Special planetary combinations and their effects</CardDescription>
              </CardHeader>
              <CardContent>
                <YogaAnalysis yogas={kundliData?.yogas} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doshas">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Dosha Analysis</CardTitle>
                <CardDescription>Check for Manglik, Kaal Sarp, and other doshas</CardDescription>
              </CardHeader>
              <CardContent>
                <DoshaAnalysis doshas={kundliData?.doshas} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personalized Predictions</CardTitle>
                <CardDescription>Career, marriage, health, and finance predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass-card border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">💼 Career</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Strong placement of Saturn in the 10th house indicates success in structured careers. 
                        Best suited for management, administration, or technical fields. Avoid partnerships 
                        in business until after age 35.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-pink-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">💕 Relationships</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Venus in the 7th house promises a loving and supportive spouse. Best period for 
                        marriage is during Jupiter Mahadasha. Look for partners with Moon in earth signs 
                        for maximum compatibility.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">💰 Finance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Multiple Dhana Yogas indicate strong wealth potential. Best financial gains 
                        through career rather than speculation. Real estate investments favored after 
                        Saturn return at age 29.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg">🏥 Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        6th lord well-placed indicates overall good health. Pay attention to digestive 
                        system during Saturn transits. Regular exercise and stress management recommended 
                        during Rahu periods.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remedies">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Remedies & Recommendations</CardTitle>
                <CardDescription>Gemstones, mantras, and other remedies for your chart</CardDescription>
              </CardHeader>
              <CardContent>
                <Remedies />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="divisional">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Divisional Charts</CardTitle>
                <CardDescription>D1, D9, D10, and other divisional charts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Navamsa Chart (D9)</h3>
                    <NorthIndianChart />
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      The Navamsa chart shows the deeper nature of planets and marriage potential.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dasamsa Chart (D10)</h3>
                    <NorthIndianChart />
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      The Dasamsa chart reveals career potential and professional success.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="download">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Download Report</CardTitle>
                <CardDescription>Get your complete Kundli report in various formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="glass-card border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                      <h3 className="font-semibold mb-2">Complete Kundli PDF</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Full 30+ page report with all charts, predictions, and remedies
                      </p>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-blue-500/20 cursor-pointer hover:border-blue-500/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                      <h3 className="font-semibold mb-2">Birth Chart Only</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        High-resolution birth chart image for personal use
                      </p>
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Image
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-green-500/20 cursor-pointer hover:border-green-500/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Share2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <h3 className="font-semibold mb-2">Share Kundli</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share your Kundli via link or social media
                      </p>
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
