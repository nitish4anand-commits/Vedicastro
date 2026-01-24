"use client"

import { motion } from "framer-motion"
import { Users, Star, Award, Heart, BookOpen, Shield, Target, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const teamMembers = [
  {
    name: "Pt. Raghunath Sharma",
    role: "Chief Astrologer",
    experience: "35+ years",
    specialization: "Vedic Astrology, Kundli Analysis",
    image: "/team/astrologer-1.jpg",
    initials: "RS",
  },
  {
    name: "Dr. Kavita Joshi",
    role: "Senior Astrologer",
    experience: "20+ years",
    specialization: "Horary Astrology, Muhurta",
    image: "/team/astrologer-2.jpg",
    initials: "KJ",
  },
  {
    name: "Acharya Vinod Kumar",
    role: "Numerology Expert",
    experience: "25+ years",
    specialization: "Numerology, Vastu Shastra",
    image: "/team/astrologer-3.jpg",
    initials: "VK",
  },
  {
    name: "Shri Mahesh Tripathi",
    role: "Remedial Expert",
    experience: "18+ years",
    specialization: "Gemology, Remedial Astrology",
    image: "/team/astrologer-4.jpg",
    initials: "MT",
  },
]

const stats = [
  { icon: Users, value: "2M+", label: "Kundlis Generated" },
  { icon: Star, value: "4.9", label: "User Rating" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Heart, value: "500K+", label: "Happy Users" },
]

const values = [
  {
    icon: BookOpen,
    title: "Authentic Vedic Knowledge",
    description: "Our predictions are based on ancient Vedic scriptures and time-tested principles passed down through generations.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your birth data and personal information are encrypted and never shared with third parties.",
  },
  {
    icon: Target,
    title: "Precision & Accuracy",
    description: "We use the Lahiri Ayanamsa and precise astronomical calculations for accurate planetary positions.",
  },
  {
    icon: Sparkles,
    title: "Modern Technology",
    description: "Ancient wisdom meets modern tech - get instant, beautifully presented astrological insights.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="purple" className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bridging <span className="gradient-text">Ancient Wisdom</span> with Modern Technology
            </h1>
            <p className="text-xl text-muted-foreground">
              VedicAstro is your trusted companion for authentic Vedic astrology insights. 
              We combine centuries-old astrological knowledge with cutting-edge technology 
              to bring you accurate, personalized predictions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y glass">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="purple" className="mb-4">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                From Temple Libraries to Your Screen
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  VedicAstro was founded in 2010 by a group of passionate astrologers and 
                  technologists who shared a common vision: to make authentic Vedic astrology 
                  accessible to everyone, regardless of where they are in the world.
                </p>
                <p>
                  Our founding astrologers spent years studying ancient Sanskrit texts in 
                  temple libraries across India, learning from revered gurus, and mastering 
                  the intricate calculations that form the backbone of Jyotish Shastra.
                </p>
                <p>
                  Today, we serve millions of users worldwide, offering everything from 
                  detailed birth charts to personalized predictions, all while staying true 
                  to the authentic principles of Vedic astrology.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-8 glass-card">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                    <div className="h-1/2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-6xl">
                      ॐ
                    </div>
                    <div className="h-1/2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-6xl">
                      ☉
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-1/2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-6xl">
                      ☽
                    </div>
                    <div className="h-1/2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-6xl">
                      ♃
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from the predictions we provide 
              to how we handle your personal data.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value) => (
              <motion.div key={value.title} variants={item}>
                <Card className="glass-card h-full text-center">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-purple-500" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="purple" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Expert Astrologers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team of experienced astrologers brings decades of combined experience 
              in Vedic astrology, numerology, and related sciences.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.name} variants={item}>
                <Card className="glass-card text-center group hover:border-purple-500/50 transition-colors">
                  <CardContent className="pt-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-purple-500 text-sm mb-2">{member.role}</p>
                    <Badge variant="secondary" className="mb-3">{member.experience}</Badge>
                    <p className="text-sm text-muted-foreground">{member.specialization}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Discover Your Cosmic Blueprint?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join millions of users who trust VedicAstro for accurate, 
              personalized astrological insights.
            </p>
            <motion.a
              href="/kundli"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
            >
              <Sparkles className="h-5 w-5" />
              Generate Your Free Kundli
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
