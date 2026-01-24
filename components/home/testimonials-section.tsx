"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HoverCard } from "@/components/ui/motion-effects"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    avatar: "PS",
    rating: 5,
    text: "The most accurate Kundli I've ever received! The predictions matched perfectly with my life events. Highly recommended!",
    highlight: "Most accurate Kundli",
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi, India",
    avatar: "RK",
    rating: 5,
    text: "Kundli matching helped me find the perfect life partner. The detailed analysis was spot on. Thank you VedicAstro!",
    highlight: "Perfect match found",
  },
  {
    name: "Anita Patel",
    location: "Ahmedabad, India",
    avatar: "AP",
    rating: 5,
    text: "The remedies suggested really worked wonders in my life. My career took a positive turn after following them.",
    highlight: "Life-changing remedies",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, India",
    avatar: "VS",
    rating: 5,
    text: "Best astrology website I've found. The reports are detailed and easy to understand. Great work!",
    highlight: "Best in class",
  },
  {
    name: "Meera Reddy",
    location: "Bangalore, India",
    avatar: "MR",
    rating: 5,
    text: "I was skeptical at first, but the accuracy of predictions convinced me. This is truly a gem of a platform!",
    highlight: "Skeptic converted",
  },
  {
    name: "Arjun Nair",
    location: "Chennai, India",
    avatar: "AN",
    rating: 5,
    text: "The Dasha timeline helped me plan my career moves. Every prediction came true within the timeframe!",
    highlight: "Career guidance",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= testimonials.length ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - itemsPerPage : prev - 1
    )
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20">
              ⭐ Testimonials
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            What Our <span className="gradient-text">Users Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join thousands of satisfied users who trust VedicAstro for their cosmic guidance
          </motion.p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                layout
              >
                <HoverCard>
                  <Card className="glass-card h-full group hover:shadow-xl transition-all duration-300 border-white/5">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className="text-purple-500"
                        >
                          <Quote className="h-8 w-8" />
                        </motion.div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                          {testimonial.highlight}
                        </span>
                      </div>
                      
                      <div className="flex gap-0.5 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          </motion.div>
                        ))}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      
                      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: testimonials.length - itemsPerPage + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "w-8 bg-purple-500" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
