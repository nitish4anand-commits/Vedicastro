"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import { motion, useInView, useAnimation, Variants } from "framer-motion"

// Fade in animation
interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className = "",
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const controls = useAnimation()

  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  }

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          ...directions[direction],
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for children animations
interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger item to use inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale on hover
interface ScaleOnHoverProps {
  children: ReactNode
  scale?: number
  className?: string
}

export function ScaleOnHover({
  children,
  scale = 1.05,
  className = "",
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating animation
interface FloatingProps {
  children: ReactNode
  duration?: number
  distance?: number
  className?: string
}

export function Floating({
  children,
  duration = 3,
  distance = 10,
  className = "",
}: FloatingProps) {
  return (
    <motion.div
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse animation
interface PulseProps {
  children: ReactNode
  scale?: number
  duration?: number
  className?: string
}

export function Pulse({
  children,
  scale = 1.05,
  duration = 2,
  className = "",
}: PulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Rotate animation
interface RotateProps {
  children: ReactNode
  duration?: number
  className?: string
}

export function Rotate({
  children,
  duration = 20,
  className = "",
}: RotateProps) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Typewriter effect
interface TypewriterProps {
  text: string
  delay?: number
  className?: string
}

export function Typewriter({
  text,
  delay = 0.05,
  className = "",
}: TypewriterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * delay }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Counter animation
interface CounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}

export function Counter({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
  prefix = "",
}: CounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (isInView) {
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        
        // Ease out function
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentCount = from + (to - from) * easeOut
        
        setCount(Math.round(currentCount))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

// Reveal on scroll
interface RevealProps {
  children: ReactNode
  width?: "fit-content" | "100%"
  className?: string
}

export function Reveal({
  children,
  width = "fit-content",
  className = "",
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 75 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Parallax effect
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({
  children,
  speed = 0.5,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollY = window.scrollY
        const element = ref.current
        const rect = element.getBoundingClientRect()
        const offsetTop = rect.top + scrollY
        const parallaxOffset = (scrollY - offsetTop) * speed
        element.style.transform = `translateY(${parallaxOffset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// Magnetic hover effect
interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate(0px, 0px)"
    }
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Glow effect on hover
interface GlowProps {
  children: ReactNode
  color?: string
  className?: string
}

export function Glow({
  children,
  color = "rgba(147, 51, 234, 0.5)",
  className = "",
}: GlowProps) {
  return (
    <motion.div
      whileHover={{
        boxShadow: `0 0 30px ${color}`,
      }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
