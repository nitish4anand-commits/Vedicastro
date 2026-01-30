"use client"

import { motion } from "framer-motion"
import { Shield, FileText, Lock, Eye, Cookie, Mail, AlertTriangle, Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections = [
  {
    id: "information-collection",
    icon: Eye,
    title: "Information We Collect",
    content: [
      "Personal information (name, email, phone number) when you create an account",
      "Birth details (date, time, place) for astrological calculations",
      "Usage data and analytics for improving our services",
      "Payment information for premium subscriptions (processed securely by third-party providers)",
      "Device information and cookies for a personalized experience",
    ],
  },
  {
    id: "information-use",
    icon: FileText,
    title: "How We Use Your Information",
    content: [
      "Generate accurate Kundli charts and astrological predictions",
      "Provide personalized horoscopes and transit predictions",
      "Send relevant notifications about your astrological updates",
      "Improve our services and develop new features",
      "Communicate important account and service updates",
    ],
  },
  {
    id: "data-security",
    icon: Lock,
    title: "Data Security",
    content: [
      "Industry-standard SSL encryption for all data transmission",
      "Secure servers with regular security audits",
      "Limited access to personal data on a need-to-know basis",
      "Regular backups and disaster recovery procedures",
      "Compliance with data protection regulations",
    ],
  },
  {
    id: "data-sharing",
    icon: Server,
    title: "Data Sharing & Third Parties",
    content: [
      "We do NOT sell your personal information to third parties",
      "Trusted payment processors for subscription management",
      "Analytics services to understand usage patterns",
      "Cloud infrastructure providers for hosting",
      "Legal requirements and law enforcement when necessary",
    ],
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Tracking",
    content: [
      "Essential cookies for site functionality and authentication",
      "Analytics cookies to understand how visitors use our site",
      "Preference cookies to remember your settings",
      "You can disable cookies in your browser settings",
      "Third-party cookies for social media integration (optional)",
    ],
  },
  {
    id: "your-rights",
    icon: Shield,
    title: "Your Rights",
    content: [
      "Access your personal data at any time",
      "Request correction of inaccurate information",
      "Delete your account and associated data",
      "Export your data in a portable format",
      "Opt-out of marketing communications",
    ],
  },
]

export default function PrivacyPolicyPage() {
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
            <Badge variant="purple" className="mb-4">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your privacy matters to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 27, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="pb-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Our Commitment to You</h2>
                <p className="text-muted-foreground">
                  At Zodii, we believe in transparency and respect for your privacy. 
                  We only collect information necessary to provide you with the best astrological 
                  services. We never sell your personal data and employ industry-leading security 
                  measures to protect your information.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-purple-500" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-purple-500 mt-1">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions or concerns about our privacy practices, 
              please don&apos;t hesitate to contact us.
            </p>
            <p className="text-purple-500 font-medium">privacy@zodii.in</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
