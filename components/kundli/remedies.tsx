"use client"

import { motion } from "framer-motion"
import { Gem, Sun, Moon, Flame, Sparkles, ScrollText, Calendar, Leaf } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Gemstone {
  name: string
  planet: string
  weight: string
  metal: string
  finger: string
  day: string
  mantra: string
  benefits: string[]
  image?: string
}

interface Mantra {
  name: string
  deity: string
  sanskrit: string
  meaning: string
  count: number
  benefits: string[]
}

interface Fasting {
  day: string
  deity: string
  planet: string
  significance: string
  rules: string[]
}

interface Ritual {
  name: string
  type: string
  frequency: string
  description: string
  benefits: string[]
}

interface RemediesProps {
  gemstones?: Gemstone[]
  mantras?: Mantra[]
  fasting?: Fasting[]
  rituals?: Ritual[]
}

const defaultGemstones: Gemstone[] = [
  {
    name: "Yellow Sapphire (Pukhraj)",
    planet: "Jupiter",
    weight: "3-5 Carats",
    metal: "Gold",
    finger: "Index Finger",
    day: "Thursday",
    mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    benefits: [
      "Enhances wisdom and knowledge",
      "Improves financial prosperity",
      "Strengthens marital harmony",
      "Boosts spiritual growth",
    ],
  },
  {
    name: "Emerald (Panna)",
    planet: "Mercury",
    weight: "3-4 Carats",
    metal: "Gold or Silver",
    finger: "Little Finger",
    day: "Wednesday",
    mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    benefits: [
      "Improves communication skills",
      "Enhances intelligence",
      "Benefits business and trade",
      "Calms the nervous system",
    ],
  },
]

const defaultMantras: Mantra[] = [
  {
    name: "Guru Beej Mantra",
    deity: "Lord Brihaspati",
    sanskrit: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    meaning: "I bow to Jupiter, the bestower of wisdom and fortune",
    count: 108,
    benefits: [
      "Strengthens Jupiter in horoscope",
      "Brings wisdom and prosperity",
      "Enhances spiritual knowledge",
    ],
  },
  {
    name: "Mahamrityunjaya Mantra",
    deity: "Lord Shiva",
    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    meaning: "We worship the three-eyed Lord who nourishes all beings",
    count: 108,
    benefits: [
      "Protection from accidents",
      "Healing and longevity",
      "Overcoming fear and obstacles",
    ],
  },
  {
    name: "Gayatri Mantra",
    deity: "Goddess Gayatri",
    sanskrit: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं",
    meaning: "We meditate on the divine light of the Sun",
    count: 108,
    benefits: [
      "Purifies mind and soul",
      "Enhances intellect",
      "Brings peace and clarity",
    ],
  },
]

const defaultFasting: Fasting[] = [
  {
    day: "Thursday",
    deity: "Lord Vishnu / Brihaspati",
    planet: "Jupiter",
    significance: "Strengthens Jupiter for wisdom, prosperity, and spiritual growth",
    rules: [
      "Consume only one meal with no salt",
      "Wear yellow clothes",
      "Donate yellow items like bananas, turmeric",
      "Read Vishnu Sahasranama",
    ],
  },
  {
    day: "Saturday",
    deity: "Lord Shani",
    planet: "Saturn",
    significance: "Appeases Saturn to reduce delays and obstacles",
    rules: [
      "Avoid salt in meals",
      "Donate black sesame, mustard oil",
      "Feed crows and dogs",
      "Recite Shani Chalisa",
    ],
  },
  {
    day: "Monday",
    deity: "Lord Shiva",
    planet: "Moon",
    significance: "Strengthens Moon for mental peace and emotional stability",
    rules: [
      "Consume only fruits or milk",
      "Offer water and milk on Shivalinga",
      "Wear white clothes",
      "Recite Om Namah Shivaya",
    ],
  },
]

const defaultRituals: Ritual[] = [
  {
    name: "Navagraha Shanti Puja",
    type: "Planetary Propitiation",
    frequency: "Once a year or as needed",
    description: "A comprehensive puja to appease all nine planets and balance their energies in your horoscope.",
    benefits: [
      "Balances all planetary influences",
      "Removes malefic effects",
      "Brings overall prosperity",
    ],
  },
  {
    name: "Rudrabhishek",
    type: "Lord Shiva Worship",
    frequency: "Monthly on Mondays",
    description: "Sacred bathing ritual of Shivalinga with water, milk, honey, and other offerings.",
    benefits: [
      "Removes negative karma",
      "Brings health and longevity",
      "Fulfills desires",
    ],
  },
  {
    name: "Havan/Homam",
    type: "Fire Ritual",
    frequency: "On specific occasions",
    description: "Sacred fire ceremony with specific mantras and offerings to invoke divine blessings.",
    benefits: [
      "Purifies the environment",
      "Invokes divine presence",
      "Destroys negative energies",
    ],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export function Remedies({
  gemstones = defaultGemstones,
  mantras = defaultMantras,
  fasting = defaultFasting,
  rituals = defaultRituals,
}: RemediesProps) {
  return (
    <Tabs defaultValue="gemstones" className="w-full">
      <TabsList className="grid w-full grid-cols-4 glass">
        <TabsTrigger value="gemstones" className="flex items-center gap-2">
          <Gem className="h-4 w-4" />
          <span className="hidden sm:inline">Gemstones</span>
        </TabsTrigger>
        <TabsTrigger value="mantras" className="flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          <span className="hidden sm:inline">Mantras</span>
        </TabsTrigger>
        <TabsTrigger value="fasting" className="flex items-center gap-2">
          <Leaf className="h-4 w-4" />
          <span className="hidden sm:inline">Fasting</span>
        </TabsTrigger>
        <TabsTrigger value="rituals" className="flex items-center gap-2">
          <Flame className="h-4 w-4" />
          <span className="hidden sm:inline">Rituals</span>
        </TabsTrigger>
      </TabsList>

      {/* Gemstones Tab */}
      <TabsContent value="gemstones" className="mt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2"
        >
          {gemstones.map((gem) => (
            <motion.div key={gem.name} variants={item}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                      <Gem className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{gem.name}</CardTitle>
                      <CardDescription>Ruled by {gem.planet}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="ml-2">{gem.weight}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Metal:</span>
                      <span className="ml-2">{gem.metal}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Finger:</span>
                      <span className="ml-2">{gem.finger}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Day:</span>
                      <span className="ml-2">{gem.day}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Activation Mantra</p>
                    <p className="font-semibold text-purple-400">{gem.mantra}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-2">Benefits:</p>
                    <ul className="space-y-1">
                      {gem.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>

      {/* Mantras Tab */}
      <TabsContent value="mantras" className="mt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {mantras.map((mantra) => (
            <motion.div key={mantra.name} variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                        <ScrollText className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{mantra.name}</CardTitle>
                        <CardDescription>Dedicated to {mantra.deity}</CardDescription>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-sm">
                      {mantra.count}x daily
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 text-center">
                    <p className="text-xl font-semibold text-orange-400">{mantra.sanskrit}</p>
                    <p className="text-sm text-muted-foreground mt-2">{mantra.meaning}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {mantra.benefits.map((benefit, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>

      {/* Fasting Tab */}
      <TabsContent value="fasting" className="mt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-3"
        >
          {fasting.map((fast) => (
            <motion.div key={fast.day} variants={item}>
              <Card className="glass-card h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{fast.day} Fast</CardTitle>
                      <CardDescription>{fast.deity} • {fast.planet}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{fast.significance}</p>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Guidelines:</p>
                    <ul className="space-y-2">
                      {fast.rules.map((rule, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Leaf className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>

      {/* Rituals Tab */}
      <TabsContent value="rituals" className="mt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {rituals.map((ritual) => (
            <motion.div key={ritual.name} variants={item}>
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20">
                        <Flame className="h-6 w-6 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{ritual.name}</CardTitle>
                        <CardDescription>{ritual.type}</CardDescription>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                      {ritual.frequency}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{ritual.description}</p>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {ritual.benefits.map((benefit, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-muted text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}
