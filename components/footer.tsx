import Link from "next/link"
import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  services: [
    { name: "Free Kundli", href: "/kundli" },
    { name: "Kundli Matching", href: "/matching" },
    { name: "Daily Horoscope", href: "/horoscope" },
    { name: "Rashifal", href: "/rashifal" },
    { name: "Panchang", href: "/panchang" },
    { name: "Dasha Calculator", href: "/dasha" },
    { name: "Transit Predictions", href: "/transits" },
    { name: "Numerology", href: "/numerology" },
  ],
  resources: [
    { name: "About Vedic Astrology", href: "/about" },
    { name: "Premium Features", href: "/premium" },
    { name: "Zodiac Signs", href: "/zodiac" },
    { name: "Nakshatras", href: "/nakshatras" },
    { name: "Planets", href: "/planets" },
    { name: "Houses", href: "/houses" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Login", href: "/auth/login" },
    { name: "Sign Up", href: "/auth/signup" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "FAQ", href: "/faq" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
]

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/50 border-t mt-20">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <Sparkles className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold gradient-text font-outfit">
                Vedic Astro
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Your trusted companion for Vedic astrology insights. Discover your cosmic blueprint and unlock the secrets of your destiny.
            </p>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@zodii.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-purple-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Services</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-purple-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vedic Astro. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for astrology enthusiasts worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
