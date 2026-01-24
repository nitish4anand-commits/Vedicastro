"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

// Smooth scroll progress indicator
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

// Animated background gradient orbs
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

// Parallax section wrapper
interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxSection({ children, className = "", speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Animated counter
interface AnimatedCounterProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (!isInView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(from + (to - from) * easeOut))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

// Text reveal animation
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// Staggered list animation
interface StaggerListProps {
  children: React.ReactNode[]
  className?: string
  staggerDelay?: number
}

export function StaggerList({ children, className = "", staggerDelay = 0.1 }: StaggerListProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

// Hover card effect
interface HoverCardProps {
  children: React.ReactNode
  className?: string
}

export function HoverCard({ children, className = "" }: HoverCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateXValue = (y - centerY) / 10
    const rotateYValue = (centerX - x) / 10
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      className={`${className} perspective-1000`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// Magnetic button effect
interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) * strength
    const y = (e.clientY - centerY) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// Glowing border effect
interface GlowingBorderProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowingBorder({ 
  children, 
  className = "", 
  glowColor = "rgba(147, 51, 234, 0.5)" 
}: GlowingBorderProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}

// Typewriter effect
interface TypewriterProps {
  words: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function Typewriter({
  words,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < word.length) {
            setCurrentText(word.slice(0, currentText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(word.slice(0, currentText.length - 1))
          } else {
            setIsDeleting(false)
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-[1em] bg-current ml-1 align-middle"
      />
    </span>
  )
}

// Floating elements
interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  distance?: number
}

export function FloatingElement({
  children,
  className = "",
  duration = 3,
  distance = 10,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// Rotating element
interface RotatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
}

export function RotatingElement({
  children,
  className = "",
  duration = 20,
}: RotatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  )
}
