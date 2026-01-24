"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Hash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NumerologyResult {
  lifePathNumber: number
  destinyNumber: number
  soulUrgeNumber: number
  personalityNumber: number
  birthdayNumber: number
}

const numberMeanings: Record<number, { title: string; traits: string; description: string }> = {
  1: {
    title: "The Leader",
    traits: "Independent, Creative, Original, Ambitious",
    description: "You are a natural leader with strong determination. Your innovative thinking and self-reliance make you a trailblazer.",
  },
  2: {
    title: "The Peacemaker",
    traits: "Diplomatic, Sensitive, Intuitive, Cooperative",
    description: "You excel at bringing harmony to situations. Your empathetic nature makes you an excellent mediator and partner.",
  },
  3: {
    title: "The Communicator",
    traits: "Expressive, Creative, Social, Optimistic",
    description: "You have a gift for expression and creativity. Your charisma and joy inspire others around you.",
  },
  4: {
    title: "The Builder",
    traits: "Practical, Organized, Hardworking, Loyal",
    description: "You are the foundation of any endeavor. Your dedication and methodical approach ensure lasting success.",
  },
  5: {
    title: "The Freedom Seeker",
    traits: "Adventurous, Dynamic, Versatile, Resourceful",
    description: "You thrive on change and variety. Your adaptability and curiosity lead you to exciting experiences.",
  },
  6: {
    title: "The Nurturer",
    traits: "Responsible, Caring, Harmonious, Family-oriented",
    description: "You are the caretaker of others. Your loving nature creates a supportive environment for loved ones.",
  },
  7: {
    title: "The Seeker",
    traits: "Analytical, Intuitive, Spiritual, Wise",
    description: "You seek deeper truths and understanding. Your introspective nature leads to profound insights.",
  },
  8: {
    title: "The Achiever",
    traits: "Ambitious, Authoritative, Business-minded, Successful",
    description: "You are driven to achieve material and professional success. Your leadership brings prosperity.",
  },
  9: {
    title: "The Humanitarian",
    traits: "Compassionate, Generous, Idealistic, Selfless",
    description: "You have a universal love for humanity. Your wisdom and generosity make you a beacon of hope.",
  },
}

function calculateLifePath(dateOfBirth: string): number {
  const digits = dateOfBirth.replace(/-/g, "").split("").map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

function calculateDestiny(name: string): number {
  const letterValues: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  }
  let sum = name.toLowerCase().split("").filter((c) => letterValues[c]).map((c) => letterValues[c]).reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split("").map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

export default function NumerologyPage() {
  const [name, setName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<NumerologyResult | null>(null)

  const handleCalculate = async () => {
    if (!name || !dateOfBirth) return

    setIsCalculating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const lifePathNumber = calculateLifePath(dateOfBirth)
    const destinyNumber = calculateDestiny(name)

    // Simplified calculations for demo
    setResult({
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber: (lifePathNumber + 1) % 9 || 9,
      personalityNumber: (destinyNumber + 2) % 9 || 9,
      birthdayNumber: parseInt(dateOfBirth.split("-")[2]) % 9 || 9,
    })

    setIsCalculating(false)
  }

  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <Hash className="mx-auto h-16 w-16 text-cyan-500 mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Numerology</span> Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the hidden meaning behind your name and birth date through the ancient science of numbers
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Enter Your Details</CardTitle>
              <CardDescription>We&apos;ll calculate your core numerology numbers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name (as per birth certificate)</label>
                <Input
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleCalculate}
                disabled={isCalculating || !name || !dateOfBirth}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Hash className="mr-2 h-5 w-5" />
                    Calculate My Numbers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Your Numerology Profile</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Life Path Number */}
              <Card className="glass-card border-purple-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.lifePathNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Life Path Number</h3>
                  <p className="text-purple-400 font-semibold mb-2">
                    {numberMeanings[result.lifePathNumber]?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {numberMeanings[result.lifePathNumber]?.traits}
                  </p>
                </CardContent>
              </Card>

              {/* Destiny Number */}
              <Card className="glass-card border-blue-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.destinyNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Destiny Number</h3>
                  <p className="text-blue-400 font-semibold mb-2">
                    {numberMeanings[result.destinyNumber]?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {numberMeanings[result.destinyNumber]?.traits}
                  </p>
                </CardContent>
              </Card>

              {/* Soul Urge Number */}
              <Card className="glass-card border-pink-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.soulUrgeNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Soul Urge Number</h3>
                  <p className="text-pink-400 font-semibold mb-2">
                    {numberMeanings[result.soulUrgeNumber]?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {numberMeanings[result.soulUrgeNumber]?.traits}
                  </p>
                </CardContent>
              </Card>

              {/* Personality Number */}
              <Card className="glass-card border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.personalityNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Personality Number</h3>
                  <p className="text-green-400 font-semibold mb-2">
                    {numberMeanings[result.personalityNumber]?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {numberMeanings[result.personalityNumber]?.traits}
                  </p>
                </CardContent>
              </Card>

              {/* Birthday Number */}
              <Card className="glass-card border-orange-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{result.birthdayNumber}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Birthday Number</h3>
                  <p className="text-orange-400 font-semibold mb-2">
                    {numberMeanings[result.birthdayNumber]?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {numberMeanings[result.birthdayNumber]?.traits}
                  </p>
                </CardContent>
              </Card>

              {/* Lucky Elements */}
              <Card className="glass-card border-cyan-500/30">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4 text-center">Lucky Elements</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucky Numbers:</span>
                      <span className="font-semibold">{result.lifePathNumber}, {result.destinyNumber}, 7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucky Colors:</span>
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-purple-500" />
                        <div className="w-5 h-5 rounded-full bg-blue-500" />
                        <div className="w-5 h-5 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucky Days:</span>
                      <span className="font-semibold">Monday, Friday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucky Gem:</span>
                      <span className="font-semibold">Amethyst</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
