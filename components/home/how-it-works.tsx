"use client"

import { motion } from "framer-motion"
import { UserPlus, Brain, FileCheck, Sparkles } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Enter Birth Details",
    description: "Provide your date, time, and place of birth for accurate calculations",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Brain,
    title: "AI Analyzes Planetary Positions",
    description: "Our advanced system calculates precise planetary positions and aspects",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileCheck,
    title: "Generate Comprehensive Report",
    description: "Receive a detailed birth chart with predictions and analysis",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Sparkles,
    title: "Get Personalized Predictions",
    description: "Access insights about career, relationships, health, and more",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Get your personalized Kundli in just 4 simple steps
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="glass-card rounded-2xl p-6 lg:p-8 max-w-md mx-auto">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${step.bgColor} mb-4`}>
                      <step.icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                {/* Step Number */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <span className="text-2xl font-bold gradient-text">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spacer for layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
