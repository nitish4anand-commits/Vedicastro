"use client"

import { motion } from "framer-motion"
import { FileText, Scale, AlertTriangle, UserCheck, CreditCard, Ban, Shield, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const sections = [
  {
    id: "acceptance",
    icon: UserCheck,
    title: "Acceptance of Terms",
    content: `By accessing or using Zodii's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.`,
  },
  {
    id: "services",
    icon: FileText,
    title: "Description of Services",
    content: `Zodii provides Vedic astrology services including Kundli generation, horoscope predictions, Kundli matching, Panchang information, and related astrological content. Our services are provided for entertainment and informational purposes. We do not guarantee the accuracy of predictions or outcomes.`,
  },
  {
    id: "user-accounts",
    icon: Shield,
    title: "User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. You must be at least 18 years old to create an account. You agree to provide accurate and complete information during registration.`,
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments & Subscriptions",
    content: `Premium features require a paid subscription. All payments are processed securely through third-party payment providers. Subscription fees are billed in advance on a monthly or yearly basis. You may cancel your subscription at any time, but no refunds will be provided for partial periods.`,
  },
  {
    id: "refunds",
    icon: RefreshCw,
    title: "Refund Policy",
    content: `We offer a 7-day money-back guarantee for first-time subscribers. Refund requests must be submitted within 7 days of initial purchase. Expert consultation fees are non-refundable once the consultation has been conducted. Technical issues preventing service usage may qualify for partial refunds at our discretion.`,
  },
  {
    id: "prohibited",
    icon: Ban,
    title: "Prohibited Activities",
    content: `You may not use our services for any unlawful purpose or to solicit others to perform unlawful acts. You may not attempt to gain unauthorized access to our systems. You may not reproduce, duplicate, or sell any part of our services. You may not harass, abuse, or harm other users.`,
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: `Zodii provides astrological information for entertainment and guidance purposes only. We are not responsible for any decisions made based on our predictions. Our services do not constitute professional advice (legal, medical, financial, etc.). We are not liable for any indirect, incidental, or consequential damages.`,
  },
  {
    id: "disputes",
    icon: Scale,
    title: "Dispute Resolution",
    content: `Any disputes arising from these terms shall be resolved through good-faith negotiation. If negotiation fails, disputes will be submitted to binding arbitration. These terms shall be governed by the laws of India. You agree to submit to the exclusive jurisdiction of courts in New Delhi, India.`,
  },
]

export default function TermsOfServicePage() {
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
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Please read these terms carefully before using our services.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 27, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-purple-500" />
                      </div>
                      {index + 1}. {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Changes Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold mb-2">Changes to Terms</h3>
            <p className="text-muted-foreground text-sm">
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes via email or through our website. Continued use of our services 
              after changes constitutes acceptance of the modified terms.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
