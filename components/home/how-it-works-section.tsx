"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { CheckCircle2, ClipboardList, Cpu, FileText, Sparkles } from "lucide-react"
import { useRef } from "react"

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Enter Birth Details",
    description: "Provide your date, time, and place of birth with just a few clicks. Our smart location search makes it easy.",
    color: "from-purple-500 to-violet-500",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Analyzes Planetary Positions",
    description: "Our advanced algorithms calculate precise planetary positions, houses, and aspects based on Vedic principles.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    icon: FileText,
    title: "Generate Comprehensive Report",
    description: "Receive a detailed Kundli with birth charts, divisional charts, doshas, yogas, and dasha predictions.",
    color: "from-pink-500 to-rose-500",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Get Personalized Predictions",
    description: "Access personalized insights for career, marriage, health, finance, and remedies tailored to your chart.",
    color: "from-amber-500 to-orange-500",
  },
]

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium border border-blue-500/20">
              📋 Simple Process
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Get your personalized Kundli in 4 simple steps
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Animated Connecting Line */}
          <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-border hidden md:block overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                className="relative flex items-start gap-6 md:gap-8"
              >
                {/* Step Number Circle */}
                <motion.div 
                  className="relative z-10 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-2xl font-bold text-white shadow-lg`}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4, type: "spring" }}
                    className="absolute -bottom-1 -right-1"
                  >
                    <div className="bg-background rounded-full p-0.5">
                      <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="flex-1 pb-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-white/5 group">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r ${step.color} text-white`}>
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
