"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, ChevronDown, Search, MessageCircle, Mail, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const faqCategories = [
  { id: "general", name: "General", count: 8 },
  { id: "kundli", name: "Kundli & Charts", count: 6 },
  { id: "predictions", name: "Predictions", count: 5 },
  { id: "premium", name: "Premium & Billing", count: 7 },
  { id: "technical", name: "Technical", count: 4 },
]

const faqs = {
  general: [
    {
      question: "What is Vedic Astrology?",
      answer: "Vedic Astrology, also known as Jyotish, is an ancient Indian system of astrology that dates back over 5,000 years. Unlike Western astrology, Vedic astrology uses the sidereal zodiac (based on actual star positions) and incorporates unique concepts like Nakshatras (lunar mansions), Dashas (planetary periods), and Yogas (planetary combinations).",
    },
    {
      question: "How accurate are the predictions?",
      answer: "Vedic astrology provides insights based on planetary positions at the time of your birth. While many find our predictions remarkably accurate, astrology should be used as a tool for self-reflection and guidance rather than absolute truth. Free will always plays a role in shaping your destiny.",
    },
    {
      question: "Do I need to know my exact birth time?",
      answer: "For the most accurate Kundli, knowing your exact birth time is essential. It determines your Ascendant (Lagna) and house placements. If you don't know your exact time, you can use an approximate time, but predictions may be less precise. We recommend checking birth certificates or hospital records.",
    },
    {
      question: "What's the difference between Vedic and Western astrology?",
      answer: "The main differences include: 1) Vedic uses sidereal zodiac while Western uses tropical, 2) Vedic includes Nakshatras and Dasha systems, 3) Vedic emphasizes the Moon sign more than the Sun sign, 4) Vedic astrology focuses more on karma and destiny. Both systems have their merits.",
    },
    {
      question: "Is Vedic astrology scientific?",
      answer: "Vedic astrology is based on astronomical calculations and mathematical precision. While it's not recognized as a science by modern scientific standards, it represents thousands of years of observational wisdom. Many people find practical value in its insights regardless of its classification.",
    },
    {
      question: "Can astrology predict the future?",
      answer: "Astrology indicates tendencies and potential outcomes based on planetary influences. It's more about understanding cycles and probabilities than predicting exact events. Think of it as a weather forecast for your life - it shows conditions and possibilities, not certainties.",
    },
    {
      question: "What is a Kundli/Birth Chart?",
      answer: "A Kundli (also called Janam Kundli or Birth Chart) is a map of the sky at the exact moment of your birth. It shows the positions of the Sun, Moon, planets, and zodiac signs in 12 houses, each representing different life areas. It's the foundation for all Vedic astrological analysis.",
    },
    {
      question: "Why is the Moon sign important in Vedic astrology?",
      answer: "In Vedic astrology, the Moon sign (Rashi) represents your emotional nature, mind, and instincts. It's considered more important than the Sun sign because the Moon changes signs more frequently (every 2.5 days) and is the basis for Dasha calculations and daily/monthly predictions.",
    },
  ],
  kundli: [
    {
      question: "How do I generate my Kundli?",
      answer: "Simply go to our Kundli page and enter your birth details: date, time, and place of birth. Our system will calculate your complete birth chart including all planetary positions, Nakshatras, and houses. The process takes just a few seconds.",
    },
    {
      question: "What is Kundli Matching?",
      answer: "Kundli Matching (Kundli Milan or Gun Milan) is a compatibility analysis between two individuals, typically for marriage. It analyzes 36 points (Gunas) across 8 categories including Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi. A score above 18 is generally considered favorable.",
    },
    {
      question: "What are the different chart types available?",
      answer: "We offer multiple chart styles: North Indian (diamond format), South Indian (square grid), and East Indian. Additionally, we provide all 16 divisional charts (Varga charts) including D1 (Rasi), D9 (Navamsa), D10 (Dasamsa), and more for premium users.",
    },
    {
      question: "What are Divisional Charts (Vargas)?",
      answer: "Divisional charts are derived from the main birth chart to analyze specific life areas. D9 (Navamsa) shows marriage and spiritual growth, D10 (Dasamsa) reveals career, D4 (Chaturthamsa) indicates property, and so on. There are 16 main divisional charts used in Vedic astrology.",
    },
    {
      question: "Can I save multiple Kundlis?",
      answer: "Free users can save up to 5 Kundlis. Premium users get unlimited Kundli storage, allowing them to save charts for family members, potential partners, or anyone they want to analyze. All saved Kundlis are accessible from your dashboard.",
    },
    {
      question: "How do I download my Kundli as PDF?",
      answer: "PDF downloads are available for Pro and Premium subscribers. After generating your Kundli, look for the 'Download PDF' button on your dashboard. The PDF includes all charts, planetary positions, Dasha periods, and basic predictions.",
    },
  ],
  predictions: [
    {
      question: "What is Dasha and how does it work?",
      answer: "Dasha is a predictive system unique to Vedic astrology that divides your life into planetary periods. The most common is Vimshottari Dasha, which cycles through 9 planets over 120 years. Each planet's period brings its own themes and influences based on its position in your chart.",
    },
    {
      question: "How often are horoscopes updated?",
      answer: "Daily horoscopes are updated every day before midnight. Weekly predictions are updated every Sunday, monthly predictions on the 1st of each month, and yearly predictions in December. All updates are based on current planetary transits and their aspects to your Moon sign.",
    },
    {
      question: "What are Yogas in Vedic astrology?",
      answer: "Yogas are special planetary combinations that indicate specific life outcomes. Positive Yogas like Raj Yoga (success/power) or Dhan Yoga (wealth) bring favorable results, while challenging ones like Kaal Sarp Yoga indicate obstacles. Our system identifies all major Yogas in your chart.",
    },
    {
      question: "What are Doshas and should I be worried?",
      answer: "Doshas indicate challenging planetary placements. Common ones include Mangal Dosha (Mars affliction), Kaal Sarp Dosha, and Pitra Dosha. While they can indicate challenges, every Dosha has remedies. Many Doshas also have cancellation conditions that reduce their effects.",
    },
    {
      question: "How do transits affect my predictions?",
      answer: "Transits are the current positions of planets as they move through the zodiac. When transiting planets aspect or conjunct planets in your birth chart, they trigger events and experiences. Our transit section shows you which planets are currently influencing your chart.",
    },
  ],
  premium: [
    {
      question: "What's included in the Pro plan?",
      answer: "Pro includes unlimited Kundli saves, detailed Dasha analysis, complete Yoga and Dosha analysis, unlimited Kundli matching, PDF downloads, transit predictions, monthly/yearly horoscopes, and priority email support. It's perfect for serious astrology enthusiasts.",
    },
    {
      question: "What additional features does Premium offer?",
      answer: "Premium includes everything in Pro plus personalized remedies, gemstone recommendations, Muhurta calculations, 2 expert consultations per month, all 60 divisional charts, Varshphal (annual chart), API access, and 24/7 priority support.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 7-day free trial for new users. You can explore all Pro features without any commitment. No credit card is required to start the trial. At the end of 7 days, you can choose to subscribe or continue with the free plan.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account settings. Go to Settings > Subscription > Cancel Subscription. Your access continues until the end of your billing period. No refunds are provided for partial periods, but you won't be charged again.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, Net Banking, and popular wallets like Paytm and PhonePe. International users can pay via PayPal. All transactions are secured with industry-standard encryption.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee for first-time subscribers. If you're not satisfied, contact us within 7 days of your initial purchase for a full refund. Expert consultation fees are non-refundable once the session is completed.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan anytime. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle. Your saved data is preserved when changing plans.",
    },
  ],
  technical: [
    {
      question: "Why isn't my location showing up?",
      answer: "Our location search uses a comprehensive database of cities worldwide. Try searching for a nearby larger city or use the coordinates option. If your location still isn't found, contact support with your city details and we'll add it.",
    },
    {
      question: "The chart isn't displaying correctly. What should I do?",
      answer: "First, try refreshing the page. Clear your browser cache if the issue persists. Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge). If you're on mobile, try switching to desktop mode. Contact support if issues continue.",
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and enter your email. You'll receive a reset link within minutes. Check your spam folder if you don't see it. The link expires after 24 hours for security.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard SSL encryption, secure servers, and follow best practices for data protection. We never sell your personal information. Read our Privacy Policy for complete details on how we protect your data.",
    },
  ],
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="border-b border-border last:border-0"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-start justify-between gap-4 text-left hover:text-purple-500 transition-colors"
      >
        <span className="font-medium">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-1"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = searchQuery
    ? Object.values(faqs)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : faqs[activeCategory as keyof typeof faqs]

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
            <Badge variant="purple" className="mb-4">Help Center</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions about Vedic astrology and our services.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {faqCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          )}

          <Card className="glass-card">
            <CardContent className="pt-6">
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-4">
                  Found {filteredFAQs.length} result(s) for &ldquo;{searchQuery}&rdquo;
                </p>
              )}
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No results found. Try a different search term.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/contact">
                <Card className="glass-card h-full hover:border-purple-500/50 transition-colors text-center p-6">
                  <MessageCircle className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                  <h3 className="font-semibold mb-1">Contact Form</h3>
                  <p className="text-sm text-muted-foreground">Send us a message</p>
                </Card>
              </Link>
              <Card className="glass-card h-full hover:border-purple-500/50 transition-colors text-center p-6">
                <Mail className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-1">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@zodii.in</p>
              </Card>
              <Card className="glass-card h-full hover:border-purple-500/50 transition-colors text-center p-6">
                <Phone className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
