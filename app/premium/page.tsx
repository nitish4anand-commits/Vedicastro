"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star, Zap, Crown, Sparkles, Shield, Clock, FileText, Users, Gem, LifeBuoy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring Vedic astrology",
    price: { monthly: 0, yearly: 0 },
    popular: false,
    features: [
      { text: "Basic Kundli generation", included: true },
      { text: "Daily horoscope", included: true },
      { text: "Panchang access", included: true },
      { text: "5 Kundli saves", included: true },
      { text: "Basic Dasha periods", included: true },
      { text: "Detailed predictions", included: false },
      { text: "Kundli matching", included: false },
      { text: "PDF downloads", included: false },
      { text: "Expert consultations", included: false },
    ],
    cta: "Get Started Free",
    icon: Star,
  },
  {
    name: "Pro",
    description: "For serious astrology enthusiasts",
    price: { monthly: 299, yearly: 2499 },
    popular: true,
    features: [
      { text: "Everything in Free", included: true },
      { text: "Unlimited Kundli saves", included: true },
      { text: "Detailed Dasha analysis", included: true },
      { text: "All Yoga & Dosha analysis", included: true },
      { text: "Kundli matching (unlimited)", included: true },
      { text: "PDF report downloads", included: true },
      { text: "Transit predictions", included: true },
      { text: "Monthly/Yearly horoscopes", included: true },
      { text: "Priority email support", included: true },
    ],
    cta: "Start Pro Trial",
    icon: Zap,
  },
  {
    name: "Premium",
    description: "Complete astrological guidance",
    price: { monthly: 799, yearly: 6999 },
    popular: false,
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Personalized remedies", included: true },
      { text: "Gemstone recommendations", included: true },
      { text: "Muhurta calculations", included: true },
      { text: "2 expert consultations/month", included: true },
      { text: "Divisional charts (D1-D60)", included: true },
      { text: "Varshphal (Annual chart)", included: true },
      { text: "API access", included: true },
      { text: "24/7 priority support", included: true },
    ],
    cta: "Go Premium",
    icon: Crown,
  },
]

const features = [
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Get comprehensive 50+ page PDF reports with all charts, predictions, and remedies.",
  },
  {
    icon: Users,
    title: "Expert Consultations",
    description: "One-on-one sessions with certified Vedic astrologers for personalized guidance.",
  },
  {
    icon: Gem,
    title: "Gemstone Recommendations",
    description: "Get precise gemstone suggestions based on your planetary positions and needs.",
  },
  {
    icon: Shield,
    title: "Personalized Remedies",
    description: "Custom mantras, rituals, and lifestyle changes tailored to your chart.",
  },
  {
    icon: Clock,
    title: "Muhurta Calculator",
    description: "Find the most auspicious times for important life events and decisions.",
  },
  {
    icon: LifeBuoy,
    title: "Priority Support",
    description: "Get quick answers to your questions with dedicated customer support.",
  },
]

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Pro User",
    avatar: "PS",
    content: "The detailed Dasha analysis helped me understand my career transitions. Worth every rupee!",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Premium User",
    avatar: "RK",
    content: "The expert consultation was eye-opening. The astrologer predicted my promotion timing exactly!",
    rating: 5,
  },
  {
    name: "Anita Patel",
    role: "Pro User",
    avatar: "AP",
    content: "Kundli matching helped us understand compatibility issues before marriage. Highly recommended.",
    rating: 5,
  },
]

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="purple" className="mb-4">Premium Features</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Unlock Your <span className="gradient-text">Complete Cosmic Potential</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upgrade to access detailed predictions, expert consultations, and 
              personalized remedies based on your unique birth chart.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12">
        <div className="container">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}>
              <TabsList className="glass">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly" className="relative">
                  Yearly
                  <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] px-1.5">
                    Save 30%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-card h-full relative ${plan.popular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ₹{plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-muted-foreground">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.text} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-green-500/20' : 'bg-muted'}`}>
                            {feature.included ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </div>
                          <span className={`text-sm ${!feature.included && 'text-muted-foreground'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="mb-4">What You Get</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium Features That Make a Difference
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our premium plans include exclusive features designed to give you 
              the most accurate and actionable astrological insights.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover:border-purple-500/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Premium Users Say
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
          >
            <Sparkles className="h-12 w-12 mx-auto mb-6 text-purple-500" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Unlock Your Cosmic Potential?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their lives with 
              personalized astrological guidance. Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Crown className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                Compare Plans
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
