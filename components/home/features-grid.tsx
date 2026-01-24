"use client"

import { motion } from "framer-motion"
import { 
  FileText, 
  Heart, 
  Sun, 
  Zap, 
  AlertTriangle, 
  Gem 
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Free Kundli Generation",
    description: "Get your complete birth chart with planetary positions, houses, and detailed analysis.",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: Heart,
    title: "Kundli Matching (Gun Milan)",
    description: "Check compatibility with your partner using traditional Ashtakoot matching system.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Sun,
    title: "Daily Horoscope",
    description: "Get personalized daily predictions for love, career, health, and finances.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Dasha Predictions",
    description: "Understand your planetary periods with Vimshottari Dasha system and predictions.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: AlertTriangle,
    title: "Dosha Analysis",
    description: "Detect Manglik, Kaal Sarp, and other doshas with powerful remedial solutions.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Gem,
    title: "Personalized Remedies",
    description: "Receive gemstone recommendations, mantras, and rituals for planetary imbalances.",
    gradient: "from-emerald-500 to-teal-500",
  },
]

export function FeaturesGrid() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Comprehensive{" "}
            <span className="gradient-text">Astrology Services</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Everything you need to understand your cosmic journey and make informed decisions
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              className="group relative"
            >
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl">
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                    <feature.icon className={`h-6 w-6 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    Learn more →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
