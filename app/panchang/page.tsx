"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Calendar, Sun, Moon, Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete"

interface PanchangData {
  date: {
    gregorian: string
    hindu: string
    vikramSamvat: number
    shakaSamvat: number
  }
  tithi: {
    name: string
    deity: string
    endTime: string
    paksha: string
    percentage: number
  }
  nakshatra: {
    name: string
    lord: string
    deity: string
    endTime: string
  }
  yoga: {
    name: string
    quality: string
    endTime: string
  }
  karana: {
    name: string
    endTime: string
  }
  var: {
    name: string
    lord: string
    color: string
  }
  timings: {
    sunrise: string
    sunset: string
    moonrise: string
    moonset: string
  }
  auspicious: Array<{ name: string; time: string }>
  inauspicious: Array<{ name: string; time: string }>
  choghadiya: Array<{ name: string; time: string; quality: string }>
}

export default function PanchangPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const defaultLocation = { lat: 28.6139, lng: 77.2090, name: "New Delhi, India", timezone: 5.5 }
  const [location, setLocation] = useState(defaultLocation)
  const [locationInput, setLocationInput] = useState(defaultLocation.name)
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize date on client side to avoid hydration mismatch
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split("T")[0]
      setSelectedDate(today)
    }
  }, [selectedDate])

  const fetchPanchang = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/panchang?date=${selectedDate}&lat=${location.lat}&lng=${location.lng}&timezone=${location.timezone}`
      )
      if (!response.ok) throw new Error('Failed to fetch panchang')
      const data = await response.json()
      setPanchangData(data)
    } catch (err) {
      setError('Failed to load Panchang data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, location])

  useEffect(() => {
    if (selectedDate) {
      fetchPanchang()
    }
  }, [fetchPanchang, selectedDate])
  const locationNeedsConfirm =
    locationInput.trim().length > 0 && locationInput !== location.name

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-muted-foreground">Calculating Panchang...</p>
        </div>
      </div>
    )
  }

  if (error || !panchangData) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-muted-foreground">{error || 'Failed to load Panchang'}</p>
          <Button onClick={fetchPanchang} className="mt-4">Retry</Button>
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
          <Calendar className="mx-auto h-16 w-16 text-orange-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Panchang</span> Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hindu calendar with Tithi, Nakshatra, Yoga, Karana, and auspicious timings
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Date & Location Selector */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto" 
              />
            </div>
            <div className="flex flex-col items-start gap-1">
              <PlacesAutocomplete
                value={locationInput}
                onChange={(value) => setLocationInput(value)}
                onPlaceSelect={(place) => {
                  setLocation({
                    lat: place.latitude,
                    lng: place.longitude,
                    name: place.formattedAddress,
                    timezone: place.timezone,
                  })
                  setLocationInput(place.formattedAddress)
                }}
                placeholder="Enter location"
                className="w-48"
              />
              {locationNeedsConfirm && (
                <p className="text-xs text-muted-foreground">
                  Select a suggestion to use precise coordinates.
                </p>
              )}
            </div>
          </div>

          {/* Main Panchang Card */}
          <Card className="glass-card mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{panchangData.date.gregorian}</CardTitle>
              <CardDescription className="text-lg">{panchangData.date.hindu}</CardDescription>
              <div className="flex justify-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Vikram Samvat: {panchangData.date.vikramSamvat}</span>
                <span>Shaka Samvat: {panchangData.date.shakaSamvat}</span>
              </div>
            </CardHeader>
          </Card>

          {/* Five Limbs (Panchangas) */}
          <div className="grid gap-4 md:grid-cols-5 mb-8">
            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-purple-500 mb-2">Tithi</h3>
                <p className="text-xl font-bold">{panchangData.tithi.name}</p>
                <p className="text-sm text-muted-foreground">{panchangData.tithi.paksha} Paksha</p>
                <p className="text-xs text-muted-foreground mt-2">Ends: {panchangData.tithi.endTime}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-blue-500 mb-2">Nakshatra</h3>
                <p className="text-xl font-bold">{panchangData.nakshatra.name}</p>
                <p className="text-sm text-muted-foreground">Lord: {panchangData.nakshatra.lord}</p>
                <p className="text-xs text-muted-foreground mt-2">Ends: {panchangData.nakshatra.endTime}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-green-500 mb-2">Yoga</h3>
                <p className="text-xl font-bold">{panchangData.yoga.name}</p>
                <p className="text-sm text-muted-foreground">{panchangData.yoga.quality}</p>
                <p className="text-xs text-muted-foreground mt-2">Ends: {panchangData.yoga.endTime}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-orange-500 mb-2">Karana</h3>
                <p className="text-xl font-bold">{panchangData.karana.name}</p>
                <p className="text-xs text-muted-foreground mt-2">Ends: {panchangData.karana.endTime}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-6 text-center">
                <h3 className="font-semibold text-pink-500 mb-2">Var (Day)</h3>
                <p className="text-xl font-bold">{panchangData.var.name}</p>
                <p className="text-sm text-muted-foreground">Lord: {panchangData.var.lord}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Sun & Moon Timings */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <Moon className="h-5 w-5 text-blue-400" />
                  Sun & Moon Timings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Sunrise: <strong>{panchangData.timings.sunrise}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Sunset: <strong>{panchangData.timings.sunset}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Moonrise: <strong>{panchangData.timings.moonrise}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Moonset: <strong>{panchangData.timings.moonset}</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Choghadiya */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today&apos;s Choghadiya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {panchangData.choghadiya.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        item.quality === "excellent"
                          ? "bg-green-500/20 border border-green-500/50"
                          : item.quality === "good"
                          ? "bg-blue-500/20 border border-blue-500/50"
                          : item.quality === "bad"
                          ? "bg-red-500/20 border border-red-500/50"
                          : "bg-muted"
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Auspicious Timings */}
            <Card className="glass-card border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  Auspicious Timings (Shubh Muhurta)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {panchangData.auspicious.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Inauspicious Timings */}
            <Card className="glass-card border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Inauspicious Timings (Avoid)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {panchangData.inauspicious.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-red-500/10 rounded">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
