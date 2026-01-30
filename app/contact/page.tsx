"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, FileQuestion } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "support@zodii.in",
    link: "mailto:support@zodii.in",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+91 98765 43210",
    link: "tel:+919876543210",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Mumbai, Maharashtra, India",
    link: "#",
  },
  {
    icon: Clock,
    title: "Working Hours",
    description: "Mon-Sat: 9AM - 8PM IST",
    link: "#",
  },
]

const faqItems = [
  {
    question: "How accurate are your Kundli predictions?",
    answer: "Our predictions are based on authentic Vedic astrology principles using precise astronomical calculations. We use the Lahiri Ayanamsa, which is the most widely accepted system in India.",
  },
  {
    question: "Do I need to know my exact birth time?",
    answer: "Yes, accurate birth time is crucial for precise Kundli generation. Even a few minutes difference can change your Lagna (Ascendant) and affect predictions.",
  },
  {
    question: "Is my personal data safe?",
    answer: "Absolutely. We use industry-standard encryption to protect your data. Your birth details are never shared with third parties.",
  },
  {
    question: "Can I consult with an astrologer directly?",
    answer: "Yes! We offer personal consultations with our expert astrologers. You can book a session through our premium services.",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Form submitted:", data)
    setIsSubmitting(false)
    setSubmitted(true)
    reset()
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="purple" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            We&apos;d Love to <span className="gradient-text">Hear From You</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about your Kundli or need astrological guidance? 
            Our team is here to help.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We&apos;ll respond to your inquiry soon.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name *</label>
                        <Input
                          {...register("name")}
                          placeholder="Your name"
                          className="glass"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <Input
                          {...register("email")}
                          type="email"
                          placeholder="your@email.com"
                          className="glass"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone (Optional)</label>
                        <Input
                          {...register("phone")}
                          placeholder="+91 98765 43210"
                          className="glass"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject *</label>
                        <Input
                          {...register("subject")}
                          placeholder="How can we help?"
                          className="glass"
                        />
                        {errors.subject && (
                          <p className="text-sm text-red-500">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message *</label>
                      <Textarea
                        {...register("message")}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="glass"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <info.icon className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium">{info.title}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="glass-card overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-purple-500/50" />
                  <p className="text-sm text-muted-foreground">Map Integration</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our services.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Button variant="outline" className="gap-2">
              <FileQuestion className="h-4 w-4" />
              View All FAQs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
