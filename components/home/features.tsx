"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Calendar, Clock, Gem, TrendingUp, ArrowRight } from "lucide-react"
import { GlowingBorder, HoverCard } from "@/components/ui/motion-effects"

const features = [
  {
    icon: Star,
    title: "Free Kundli Generation",
    description: "Generate detailed Vedic birth charts with planetary positions, houses, and aspects in seconds.",
    href: "/kundli",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Kundli Matching (Gun Milan)",
    description: "Check marriage compatibility with 36-point Ashtakoot matching system and detailed analysis.",
    href: "/matching",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Calendar,
    title: "Daily Horoscope",
    description: "Get personalized daily predictions for all zodiac signs and nakshatras.",
    href: "/horoscope",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Clock,
    title: "Dasha Predictions",
    description: "Explore Vimshottari, Yogini, and other Dasha systems with timeline predictions.",
    href: "/dasha",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Gem,
    title: "Dosha Analysis",
    description: "Comprehensive analysis of Manglik, Kaal Sarp, Pitra Dosha with remedies.",
    href: "/kundli",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    title: "Transit Predictions",
    description: "Track planetary transits and their effects on your birth chart in real-time.",
    href: "/transits",
    color: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-500 text-sm font-medium border border-purple-500/20">
              ✨ Our Services
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Comprehensive{" "}
            <span className="gradient-text">Astrology Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to understand your cosmic journey, all in one place
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <GlowingBorder>
                <HoverCard>
                  <Link href={feature.href}>
                    <Card className="glass-card h-full hover:shadow-2xl transition-all duration-500 group border-white/5 overflow-hidden">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <CardHeader>
                        <motion.div 
                          className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <feature.icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl group-hover:text-purple-400 transition-colors flex items-center gap-2">
                          {feature.title}
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </HoverCard>
              </GlowingBorder>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
