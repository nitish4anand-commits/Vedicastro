"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete"
import { Typewriter, FloatingElement, RotatingElement, MagneticButton } from "@/components/ui/motion-effects"

// Pre-generated deterministic particle positions to avoid hydration mismatch
const PARTICLE_SEEDS = [
  { w: 4, h: 5, l: 12, t: 8, hue: 280, x: 5, dur: 5, del: 0.2 },
  { w: 3, h: 4, l: 25, t: 15, hue: 290, x: -3, dur: 6, del: 0.5 },
  { w: 5, h: 6, l: 38, t: 22, hue: 275, x: 8, dur: 4, del: 0.8 },
  { w: 2, h: 3, l: 52, t: 35, hue: 300, x: -5, dur: 7, del: 1.1 },
  { w: 6, h: 7, l: 68, t: 42, hue: 270, x: 2, dur: 5, del: 1.4 },
  { w: 4, h: 4, l: 82, t: 55, hue: 285, x: -8, dur: 6, del: 1.7 },
  { w: 3, h: 5, l: 15, t: 65, hue: 295, x: 6, dur: 4, del: 0.3 },
  { w: 5, h: 5, l: 30, t: 72, hue: 280, x: -2, dur: 7, del: 0.6 },
  { w: 2, h: 4, l: 45, t: 78, hue: 275, x: 4, dur: 5, del: 0.9 },
  { w: 7, h: 8, l: 60, t: 85, hue: 290, x: -6, dur: 6, del: 1.2 },
  { w: 4, h: 3, l: 75, t: 12, hue: 270, x: 3, dur: 4, del: 1.5 },
  { w: 3, h: 6, l: 88, t: 28, hue: 305, x: -4, dur: 7, del: 1.8 },
  { w: 5, h: 4, l: 8, t: 48, hue: 280, x: 7, dur: 5, del: 0.4 },
  { w: 2, h: 2, l: 22, t: 58, hue: 295, x: -7, dur: 6, del: 0.7 },
  { w: 6, h: 5, l: 35, t: 68, hue: 285, x: 5, dur: 4, del: 1.0 },
  { w: 4, h: 7, l: 48, t: 18, hue: 275, x: -3, dur: 7, del: 1.3 },
  { w: 3, h: 3, l: 62, t: 32, hue: 290, x: 8, dur: 5, del: 1.6 },
  { w: 5, h: 6, l: 78, t: 45, hue: 270, x: -5, dur: 6, del: 1.9 },
  { w: 2, h: 5, l: 92, t: 62, hue: 300, x: 2, dur: 4, del: 0.1 },
  { w: 7, h: 4, l: 5, t: 88, hue: 285, x: -8, dur: 7, del: 0.4 },
  { w: 4, h: 6, l: 18, t: 5, hue: 275, x: 6, dur: 5, del: 0.7 },
  { w: 3, h: 2, l: 32, t: 92, hue: 295, x: -2, dur: 6, del: 1.0 },
  { w: 5, h: 5, l: 55, t: 8, hue: 280, x: 4, dur: 4, del: 1.3 },
  { w: 2, h: 7, l: 70, t: 75, hue: 290, x: -6, dur: 7, del: 1.6 },
  { w: 6, h: 3, l: 85, t: 38, hue: 270, x: 3, dur: 5, del: 1.9 },
  { w: 4, h: 5, l: 42, t: 52, hue: 305, x: -4, dur: 6, del: 0.2 },
  { w: 3, h: 4, l: 58, t: 25, hue: 280, x: 7, dur: 4, del: 0.5 },
  { w: 5, h: 2, l: 72, t: 95, hue: 285, x: -7, dur: 7, del: 0.8 },
  { w: 2, h: 6, l: 28, t: 82, hue: 275, x: 5, dur: 5, del: 1.1 },
  { w: 7, h: 7, l: 95, t: 15, hue: 290, x: -3, dur: 6, del: 1.4 },
]

export function HeroSection() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    place: ""
  })
  const [selectedPlace, setSelectedPlace] = useState<{
    formattedAddress: string
    latitude: number
    longitude: number
    timezone: number
  } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGenerate = () => {
    const hasAnyInput = formData.date || formData.time || formData.place
    if (hasAnyInput) {
      const draft = {
        dateOfBirth: formData.date || "",
        timeOfBirth: formData.time || "",
        placeOfBirth: formData.place || "",
        latitude:
          selectedPlace && selectedPlace.formattedAddress === formData.place
            ? selectedPlace.latitude
            : undefined,
        longitude:
          selectedPlace && selectedPlace.formattedAddress === formData.place
            ? selectedPlace.longitude
            : undefined,
        timezone:
          selectedPlace && selectedPlace.formattedAddress === formData.place
            ? selectedPlace.timezone
            : undefined,
      }
      try {
        localStorage.setItem("birthDetailsDraft", JSON.stringify(draft))
      } catch {
        // Ignore storage errors and continue navigation.
      }
    }
    router.push("/kundli")
  }

  const placeNeedsConfirm =
    formData.place.trim().length > 0 &&
    (!selectedPlace || selectedPlace.formattedAddress !== formData.place)

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient" />
      
      {/* Floating Particles - only render after mount */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {PARTICLE_SEEDS.map((p, i) => (
            <motion.div
              key={i}
              className="particle absolute rounded-full"
              style={{
                width: p.w + "px",
                height: p.h + "px",
                left: p.l + "%",
                top: p.t + "%",
                background: `hsl(${p.hue}, 70%, 60%)`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, p.x, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.del,
              }}
            />
          ))}
        </div>
      )}

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
            </motion.div>
            <span>500K+ Kundlis Generated</span>
            <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
          >
            Discover Your{" "}
            <span className="gradient-text inline-block">
              <Typewriter
                words={["Cosmic Blueprint", "Life Path", "True Potential", "Destiny"]}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={3000}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto"
          >
            Unlock the secrets of your destiny with ancient Vedic astrology.
            Generate your free Kundli in seconds and get personalized predictions.
          </motion.p>

          {/* Quick Birth Details Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto max-w-2xl"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <h3 className="mb-6 text-xl font-semibold flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Generate Your Free Kundli
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="group">
                  <Input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
                <div className="group">
                  <Input
                    type="time"
                    placeholder="Time of Birth"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
                <div className="group">
                  <PlacesAutocomplete
                    value={formData.place}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, place: value }))
                      setSelectedPlace(null)
                    }}
                    onPlaceSelect={(place) => {
                      setSelectedPlace({
                        formattedAddress: place.formattedAddress,
                        latitude: place.latitude,
                        longitude: place.longitude,
                        timezone: place.timezone,
                      })
                      setFormData((prev) => ({ ...prev, place: place.formattedAddress }))
                    }}
                    placeholder="Place of Birth"
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
              </div>
              {placeNeedsConfirm && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Select a suggestion to use precise coordinates.
                </p>
              )}
              <MagneticButton className="w-full mt-6">
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="w-full group"
                  onClick={handleGenerate}
                >
                  <Star className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Generate Kundli
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </MagneticButton>
              <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  100% Free
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  No Registration
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Instant Results
                </span>
              </p>
            </div>
          </motion.div>

          {/* Animated Zodiac Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="mt-16"
          >
            <FloatingElement duration={4} distance={8}>
              <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
                <RotatingElement duration={60}>
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
                </RotatingElement>
                <RotatingElement duration={45}>
                  <div className="absolute inset-4 rounded-full border-2 border-blue-500/30 border-dashed" />
                </RotatingElement>
                <RotatingElement duration={90}>
                  <div className="absolute inset-8 rounded-full border-2 border-pink-500/30" />
                </RotatingElement>
                <RotatingElement duration={30}>
                  <div className="absolute inset-12 rounded-full border border-indigo-500/20" />
                </RotatingElement>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative"
                  >
                    <Sparkles className="h-16 w-16 text-purple-500" />
                    <div className="absolute inset-0 h-16 w-16 bg-purple-500/30 rounded-full blur-xl" />
                  </motion.div>
                </div>
              </div>
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
