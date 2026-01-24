"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Generate Kundli", href: "/kundli" },
  { name: "Kundli Matching", href: "/matching" },
  { name: "Horoscope", href: "/horoscope" },
  { name: "Panchang", href: "/panchang" },
  { name: "Services", href: "/services" },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass border-b shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
                <div className="absolute inset-0 bg-purple-500/20 blur-xl group-hover:bg-purple-400/30 transition-all rounded-full" />
              </div>
              <span className="text-xl font-bold gradient-text font-outfit">
                Vedic Astro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "bg-purple-500/10 text-purple-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* CTA Button */}
            <Link
              href="/kundli"
              className="hidden md:inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 btn-glow"
            >
              Get Your Kundli
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-base font-medium transition-all",
                  pathname === item.href
                    ? "bg-purple-500/10 text-purple-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/kundli"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full mt-4 text-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-base font-semibold text-white"
            >
              Get Your Kundli
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
