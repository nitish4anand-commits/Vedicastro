"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton, FloatingElement } from "@/components/ui/motion-effects"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-pink-900/30" />
      
      {/* Floating decorative elements */}
      <FloatingElement className="absolute top-10 left-10 opacity-30" duration={4}>
        <div className="w-20 h-20 rounded-full bg-purple-500/50 blur-xl" />
      </FloatingElement>
      <FloatingElement className="absolute bottom-10 right-10 opacity-30" duration={5} distance={15}>
        <div className="w-32 h-32 rounded-full bg-pink-500/50 blur-xl" />
      </FloatingElement>
      <FloatingElement className="absolute top-1/2 right-1/4 opacity-30" duration={6} distance={20}>
        <div className="w-16 h-16 rounded-full bg-blue-500/50 blur-xl" />
      </FloatingElement>

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2"
          >
            <Sparkles className="h-10 w-10 text-purple-400 animate-pulse" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Ready to Discover Your{" "}
            <span className="gradient-text">Destiny</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-10"
          >
            Join over 500,000 users who have discovered their cosmic path with VedicAstro. 
            Get your free Kundli today and unlock the secrets of your future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton>
              <Button variant="gradient" size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/kundli">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Free Kundli
                </Link>
              </Button>
            </MagneticButton>
            
            <MagneticButton>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 group" asChild>
                <Link href="/matching">
                  Check Compatibility
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            ✨ No credit card required • ✨ Instant results • ✨ 100% accurate calculations
          </motion.p>
        </div>
      </div>
    </section>
  )
}
