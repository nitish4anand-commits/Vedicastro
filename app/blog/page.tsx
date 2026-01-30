"use client"

import { motion } from "framer-motion"
import { Search, Calendar, User, ArrowRight, Clock, BookOpen, Star, TrendingUp, Heart, Gem } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const featuredPost = {
  title: "Understanding Rahu and Ketu: The Shadowy Planets",
  description: "Discover how the lunar nodes influence your destiny and karma. Learn about their effects in different houses and signs.",
  image: "/blog/rahu-ketu.jpg",
  category: "Planets",
  readTime: "8 min read",
  date: "Dec 15, 2024",
  slug: "understanding-rahu-ketu",
}

const categories = [
  { name: "Kundli Basics", icon: BookOpen, count: 24 },
  { name: "Planets", icon: Star, count: 18 },
  { name: "Transits", icon: TrendingUp, count: 12 },
  { name: "Relationships", icon: Heart, count: 15 },
  { name: "Remedies", icon: Gem, count: 20 },
]

const blogPosts = [
  {
    title: "What is Mangal Dosha and How to Find Remedies",
    description: "Learn about Mars Dosha, its effects on marriage, and effective remedies according to Vedic traditions.",
    category: "Remedies",
    readTime: "6 min read",
    date: "Dec 12, 2024",
    slug: "mangal-dosha-remedies",
  },
  {
    title: "Saturn Return: A Complete Guide",
    description: "Everything you need to know about Saturn return and how it transforms your life every 29 years.",
    category: "Transits",
    readTime: "10 min read",
    date: "Dec 10, 2024",
    slug: "saturn-return-guide",
  },
  {
    title: "Understanding the 12 Houses in Vedic Astrology",
    description: "A comprehensive guide to the bhava system and what each house represents in your birth chart.",
    category: "Kundli Basics",
    readTime: "12 min read",
    date: "Dec 8, 2024",
    slug: "12-houses-vedic-astrology",
  },
  {
    title: "Venus Mahadasha: What to Expect",
    description: "Explore the effects of Venus planetary period and how it influences love, wealth, and creativity.",
    category: "Planets",
    readTime: "7 min read",
    date: "Dec 5, 2024",
    slug: "venus-mahadasha",
  },
  {
    title: "Compatibility Beyond Sun Signs",
    description: "Why Kundli matching looks at Moon signs, Nakshatras, and more for accurate relationship analysis.",
    category: "Relationships",
    readTime: "8 min read",
    date: "Dec 3, 2024",
    slug: "compatibility-beyond-sun-signs",
  },
  {
    title: "Nakshatras: The 27 Lunar Mansions",
    description: "Discover the significance of your birth nakshatra and how it shapes your personality and destiny.",
    category: "Kundli Basics",
    readTime: "15 min read",
    date: "Dec 1, 2024",
    slug: "27-nakshatras-guide",
  },
]

export default function BlogPage() {
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
            <Badge variant="purple" className="mb-4">Knowledge Hub</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Zodii <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore the ancient wisdom of Vedic astrology through our insightful articles, 
              guides, and tutorials.
            </p>
            
            {/* Search */}
            <div className="flex gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-10" />
              </div>
              <Button>Search</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card px-4 py-2 rounded-full flex items-center gap-2 hover:border-purple-500/50 transition-colors"
              >
                <category.icon className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">{category.count}</Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-12">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-video md:aspect-auto bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Star className="h-16 w-16 mx-auto text-purple-500/50 mb-4" />
                    <span className="text-muted-foreground">Featured Article</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <Badge variant="purple" className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h2 className="text-2xl font-bold mb-3">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button className="w-fit group">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-20">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card h-full hover:border-purple-500/50 transition-colors group">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-purple-500/30 group-hover:text-purple-500/50 transition-colors" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-purple-500 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-20">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-purple-500/10 to-indigo-500/10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with Cosmic Insights
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for weekly astrological updates, 
              new articles, and exclusive content.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
