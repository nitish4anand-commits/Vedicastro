"use client"

import { motion } from "framer-motion"
import { Sparkles, Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Pre-generated deterministic particle positions to avoid hydration mismatch
const PARTICLE_SEEDS = [
  { w: 3, h: 4, l: 5, t: 10, dur: 3.5 },
  { w: 4, h: 3, l: 12, t: 25, dur: 4.2 },
  { w: 2, h: 5, l: 18, t: 40, dur: 2.8 },
  { w: 5, h: 4, l: 25, t: 55, dur: 3.9 },
  { w: 3, h: 2, l: 32, t: 70, dur: 4.5 },
  { w: 4, h: 5, l: 38, t: 85, dur: 3.2 },
  { w: 2, h: 3, l: 45, t: 15, dur: 4.8 },
  { w: 5, h: 5, l: 52, t: 30, dur: 2.5 },
  { w: 3, h: 4, l: 58, t: 45, dur: 3.7 },
  { w: 4, h: 2, l: 65, t: 60, dur: 4.1 },
  { w: 2, h: 5, l: 72, t: 75, dur: 3.4 },
  { w: 5, h: 3, l: 78, t: 90, dur: 4.6 },
  { w: 3, h: 4, l: 85, t: 5, dur: 2.9 },
  { w: 4, h: 5, l: 92, t: 20, dur: 3.8 },
  { w: 2, h: 2, l: 8, t: 35, dur: 4.3 },
  { w: 5, h: 4, l: 15, t: 50, dur: 3.1 },
  { w: 3, h: 3, l: 22, t: 65, dur: 4.7 },
  { w: 4, h: 5, l: 28, t: 80, dur: 2.6 },
  { w: 2, h: 4, l: 35, t: 95, dur: 3.6 },
  { w: 5, h: 2, l: 42, t: 8, dur: 4.4 },
  { w: 3, h: 5, l: 48, t: 22, dur: 3.0 },
  { w: 4, h: 3, l: 55, t: 38, dur: 4.9 },
  { w: 2, h: 4, l: 62, t: 52, dur: 2.7 },
  { w: 5, h: 5, l: 68, t: 68, dur: 3.5 },
  { w: 3, h: 2, l: 75, t: 82, dur: 4.0 },
  { w: 4, h: 4, l: 82, t: 12, dur: 3.3 },
  { w: 2, h: 3, l: 88, t: 28, dur: 4.2 },
  { w: 5, h: 5, l: 95, t: 42, dur: 2.8 },
  { w: 3, h: 4, l: 3, t: 58, dur: 3.9 },
  { w: 4, h: 2, l: 10, t: 72, dur: 4.5 },
  { w: 2, h: 5, l: 17, t: 88, dur: 3.2 },
  { w: 5, h: 3, l: 24, t: 3, dur: 4.8 },
  { w: 3, h: 4, l: 30, t: 18, dur: 2.5 },
  { w: 4, h: 5, l: 37, t: 32, dur: 3.7 },
  { w: 2, h: 2, l: 44, t: 48, dur: 4.1 },
  { w: 5, h: 4, l: 50, t: 62, dur: 3.4 },
  { w: 3, h: 3, l: 57, t: 78, dur: 4.6 },
  { w: 4, h: 5, l: 64, t: 92, dur: 2.9 },
  { w: 2, h: 4, l: 70, t: 7, dur: 3.8 },
  { w: 5, h: 2, l: 77, t: 22, dur: 4.3 },
  { w: 3, h: 5, l: 84, t: 38, dur: 3.1 },
  { w: 4, h: 3, l: 90, t: 52, dur: 4.7 },
  { w: 2, h: 4, l: 97, t: 68, dur: 2.6 },
  { w: 5, h: 5, l: 4, t: 82, dur: 3.6 },
  { w: 3, h: 2, l: 11, t: 97, dur: 4.4 },
  { w: 4, h: 4, l: 18, t: 13, dur: 3.0 },
  { w: 2, h: 3, l: 25, t: 27, dur: 4.9 },
  { w: 5, h: 5, l: 32, t: 43, dur: 2.7 },
  { w: 3, h: 4, l: 39, t: 57, dur: 3.5 },
]

export function HeroSection() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    place: "",
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient" />
      
      {/* Particles Background - only render after mount */}
      {mounted && (
        <div className="absolute inset-0">
          {PARTICLE_SEEDS.map((p, i) => (
            <motion.div
              key={i}
              className="particle absolute bg-purple-500/30"
              style={{
                width: p.w + "px",
                height: p.h + "px",
                left: p.l + "%",
                top: p.t + "%",
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: p.dur,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Zodiac Wheel Background */}
      <motion.div
        className="absolute right-10 top-20 w-96 h-96 opacity-10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-purple-500"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-blue-500"
          />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const x1 = 100 + 60 * Math.cos(angle)
            const y1 = 100 + 60 * Math.sin(angle)
            const x2 = 100 + 80 * Math.cos(angle)
            const y2 = 100 + 80 * Math.sin(angle)
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-purple-500/50"
              />
            )
          })}
        </svg>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-500">
              500K+ Kundlis Generated
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block">Discover Your</span>
            <span className="block gradient-text font-outfit">
              Cosmic Blueprint
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-12"
          >
            Get your personalized Vedic astrology Kundli with accurate birth chart analysis, 
            predictions, and remedies - absolutely free!
          </motion.p>

          {/* Quick Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto max-w-4xl"
          >
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Generate Your Free Kundli
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Date Input */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Date of Birth"
                  />
                </div>

                {/* Time Input */}
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Time of Birth"
                  />
                </div>

                {/* Place Input */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.place}
                    onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Place of Birth"
                  />
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/kundli"
                className="w-full md:w-auto inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 transition-all duration-300 btn-glow glow-purple"
              >
                <span>Generate Free Kundli</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <p className="mt-4 text-sm text-muted-foreground">
                ✨ No credit card required • 100% Free • Instant Results
              </p>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>500K+ Happy Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Accurate Predictions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Expert Astrologers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
