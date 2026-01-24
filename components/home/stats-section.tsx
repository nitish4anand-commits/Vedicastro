"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/motion-effects"

const stats = [
  { value: 500000, suffix: "+", label: "Kundlis Generated" },
  { value: 100000, suffix: "+", label: "Happy Users" },
  { value: 50000, suffix: "+", label: "Matchings Done" },
  { value: 99, suffix: "%", label: "Accuracy Rate" },
]

export function StatsSection() {
  return (
    <section className="py-16 border-y border-border/50 bg-gradient-to-r from-purple-900/10 via-transparent to-indigo-900/10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-bold gradient-text mb-2">
                <AnimatedCounter to={stat.value} suffix={stat.suffix} duration={2.5} />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
