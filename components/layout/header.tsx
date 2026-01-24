"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { Moon, Sun, Sparkles, Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"

const navItems = [
  { href: "/", label: "Home" },
  { 
    label: "Kundli", 
    children: [
      { href: "/kundli", label: "Generate Kundli" },
      { href: "/matching", label: "Kundli Matching" },
      { href: "/dasha", label: "Dasha Calculator" },
    ]
  },
  { 
    label: "Horoscope", 
    children: [
      { href: "/horoscope", label: "Daily Horoscope" },
      { href: "/rashifal", label: "Rashifal (Monthly)" },
    ]
  },
  { href: "/panchang", label: "Panchang" },
  { href: "/transits", label: "Transits" },
  { href: "/numerology", label: "Numerology" },
  { href: "/premium", label: "Premium" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled 
          ? "glass shadow-lg backdrop-blur-xl" 
          : "glass"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className={`container flex items-center justify-between transition-all duration-300 ${
        isScrolled ? "h-14" : "h-16"
      }`}>
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <span className="text-xl font-bold gradient-text">VedicAstro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {openDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 w-48 rounded-lg glass border shadow-lg py-2"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {session.user?.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-1 w-56 rounded-lg glass border shadow-lg py-2"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium truncate">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/kundli/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors w-full text-left text-red-500"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button variant="gradient" size="sm" className="hidden sm:flex" asChild>
              <Link href="/auth/login">Get Started</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t glass overflow-hidden"
          >
            <nav className="container py-4 space-y-2">
              {navItems.map((item) => (
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <p className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-6 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="pt-4">
                <Button variant="gradient" className="w-full" asChild>
                  <Link href="/auth/login">Get Started</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
