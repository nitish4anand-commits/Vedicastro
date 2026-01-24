import Link from "next/link"
import { Sparkles, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold gradient-text">VedicAstro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover your cosmic blueprint with ancient Vedic wisdom and modern technology.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/kundli" className="hover:text-primary">Free Kundli</Link></li>
              <li><Link href="/matching" className="hover:text-primary">Kundli Matching</Link></li>
              <li><Link href="/horoscope" className="hover:text-primary">Daily Horoscope</Link></li>
              <li><Link href="/panchang" className="hover:text-primary">Panchang</Link></li>
              <li><Link href="/dasha" className="hover:text-primary">Dasha Calculator</Link></li>
              <li><Link href="/transit" className="hover:text-primary">Transit</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
              <li><Link href="/refund" className="hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VedicAstro. All rights reserved. Built with ❤️ using Vedic wisdom.</p>
        </div>
      </div>
    </footer>
  )
}
