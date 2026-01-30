"use client"

import { HeroSection } from "@/components/home/hero"
import { FeaturesSection } from "@/components/home/features"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { ScrollProgress, AnimatedBackground } from "@/components/ui/motion-effects"
import { StatsSection } from "@/components/home/stats-section"
import { CTASection } from "@/components/home/cta-section"
import { OrganizationSchema, SoftwareSchema } from "@/components/schema"

export default function HomePage() {
  return (
    <>
      {/* Schema.org markup for SEO and AI discoverability */}
      <OrganizationSchema />
      <SoftwareSchema />
      
      <ScrollProgress />
      <AnimatedBackground />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
