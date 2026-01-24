"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started with Vedic astrology",
    features: [
      "Basic Kundli Generation",
      "Birth Chart Analysis",
      "Daily Horoscope",
      "Panchang Access",
      "Basic Dasha Predictions",
      "Community Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 9.99,
    description: "Everything you need for comprehensive astrology insights",
    features: [
      "Everything in Free",
      "Unlimited Kundli Matching",
      "Detailed PDF Reports",
      "All Divisional Charts",
      "Advanced Dosha Analysis",
      "Personalized Remedies",
      "Transit Predictions",
      "Numerology Reports",
      "Priority Email Support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Premium",
    price: 19.99,
    description: "For serious astrology enthusiasts and professionals",
    features: [
      "Everything in Pro",
      "Live Video Consultations",
      "Unlimited Report Downloads",
      "API Access",
      "Custom Predictions",
      "Gemstone Recommendations",
      "Muhurta Selection",
      "24/7 Priority Support",
      "White-label Reports",
    ],
    cta: "Go Premium",
    popular: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

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
            Choose Your <span className="gradient-text">Plan</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Start free and upgrade as your needs grow
          </motion.p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center space-x-3 bg-muted rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !annual
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                annual
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
            </button>
            {annual && (
              <span className="text-sm font-medium text-green-500">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div
                className={`glass-card rounded-2xl p-8 h-full flex flex-col ${
                  plan.popular ? "ring-2 ring-purple-500 shadow-2xl scale-105" : ""
                }`}
              >
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">
                      ${annual ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      /{annual ? "year" : "month"}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={plan.name === "Free" ? "/kundli" : "/pricing"}
                  className={`w-full inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 btn-glow"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
