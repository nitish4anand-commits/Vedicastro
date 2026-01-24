"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "The Kundli report was incredibly accurate! The predictions about my career change came true within months. Highly recommend!",
    avatar: "PS",
  },
  {
    name: "Rahul Mehta",
    location: "Delhi, India",
    rating: 5,
    text: "Used the Kundli matching feature before marriage. The compatibility score and insights helped us understand each other better.",
    avatar: "RM",
  },
  {
    name: "Anjali Patel",
    location: "Ahmedabad, India",
    rating: 5,
    text: "The remedies suggested really worked! My Manglik dosha concerns were addressed with proper guidance and mantras.",
    avatar: "AP",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, India",
    rating: 5,
    text: "Best free Kundli service online. The interface is beautiful and easy to use. The detailed predictions are worth it!",
    avatar: "VS",
  },
  {
    name: "Meera Reddy",
    location: "Hyderabad, India",
    rating: 5,
    text: "The Dasha predictions were spot on! Understanding my planetary periods helped me plan important life decisions.",
    avatar: "MR",
  },
  {
    name: "Amit Kumar",
    location: "Bangalore, India",
    rating: 5,
    text: "I was skeptical at first, but the accuracy of the birth chart analysis amazed me. Great work by the team!",
    avatar: "AK",
  },
]

export function Testimonials() {
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            Trusted by <span className="gradient-text">500K+ Users</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            See what our users say about their experience
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              ref={scrollRef}
              className="flex gap-6"
              animate={{
                x: isPaused ? undefined : ["0%", "-50%"],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Duplicate testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl p-6 min-w-[350px] md:min-w-[400px] flex-shrink-0"
                >
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-muted-foreground mb-6 line-clamp-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
