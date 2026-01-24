"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typewriter, FloatingElement, RotatingElement, MagneticButton } from "@/components/ui/motion-effects"

export function HeroSection() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-gradient" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              background: `hsl(${260 + Math.random() * 60}, 70%, 60%)`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

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
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
                <div className="group">
                  <Input 
                    type="time" 
                    placeholder="Time of Birth" 
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
                <div className="group">
                  <Input 
                    type="text" 
                    placeholder="Place of Birth" 
                    className="transition-all group-hover:border-purple-500/50 focus:border-purple-500"
                  />
                </div>
              </div>
              <MagneticButton className="w-full mt-6">
                <Button 
                  variant="gradient" 
                  size="lg" 
                  className="w-full group"
                  onClick={() => router.push("/kundli")}
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
