"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wind, Pause, Play, RefreshCw, X } from "lucide-react"

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

export default function MeditationCard() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycleCount, setCycleCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const PHASES = useMemo(() => ({
    inhale: { duration: 4, next: 'hold' as BreathPhase, label: 'Breathe In' },
    hold: { duration: 4, next: 'exhale' as BreathPhase, label: 'Hold' },
    exhale: { duration: 6, next: 'rest' as BreathPhase, label: 'Breathe Out' },
    rest: { duration: 2, next: 'inhale' as BreathPhase, label: 'Rest' }
  }), [])

  useEffect(() => {
    if (!isActive || isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const current = PHASES[phase]
          setPhase(current.next)
          
          if (current.next === 'inhale') {
            setCycleCount(c => c + 1)
          }
          
          return PHASES[current.next].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, isPaused, phase, PHASES])

  const startExercise = () => {
    setIsActive(true)
    setPhase('inhale')
    setTimeLeft(PHASES.inhale.duration)
    setCycleCount(0)
    setIsPaused(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase('inhale')
    setTimeLeft(4)
    setCycleCount(0)
    setIsPaused(false)
  }

  const getCircleScale = () => {
    if (!isActive) return 1
    switch (phase) {
      case 'inhale': return 1.3
      case 'hold': return 1.3
      case 'exhale': return 1
      case 'rest': return 1
      default: return 1
    }
  }

  const getCircleColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400'
      case 'hold': return 'from-purple-400 to-pink-400'
      case 'exhale': return 'from-green-400 to-teal-400'
      case 'rest': return 'from-indigo-400 to-purple-400'
      default: return 'from-purple-400 to-pink-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-sm"
    >
      <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80
                     backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30
                     shadow-xl shadow-purple-500/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-purple-300" />
            <h3 className="text-white font-medium">Breathing Exercise</h3>
          </div>
          {isActive && (
            <button
              onClick={resetExercise}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            {/* Outer glow */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${getCircleColor()} blur-xl`}
                />
              )}
            </AnimatePresence>
            
            {/* Main circle */}
            <motion.div
              animate={{ scale: getCircleScale() }}
              transition={{ duration: PHASES[phase].duration, ease: "easeInOut" }}
              className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getCircleColor()}
                         flex items-center justify-center shadow-lg`}
            >
              <div className="text-center">
                {isActive ? (
                  <>
                    <p className="text-white text-lg font-medium">
                      {PHASES[phase].label}
                    </p>
                    <p className="text-white/80 text-3xl font-bold mt-1">
                      {timeLeft}
                    </p>
                  </>
                ) : (
                  <Wind className="w-12 h-12 text-white/80" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Cycle count */}
          {isActive && (
            <p className="text-purple-300 text-sm mt-4">
              Cycle {cycleCount + 1} of 4
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-4">
          {!isActive ? (
            <button
              onClick={startExercise}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600
                       text-white font-medium hover:shadow-lg hover:shadow-purple-500/30
                       transition-all duration-200 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Exercise
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 rounded-full bg-gray-700 text-white
                         hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetExercise}
                className="px-4 py-2 rounded-full bg-gray-700 text-white
                         hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        {!isActive && (
          <p className="text-center text-purple-300/70 text-sm mt-4">
            A 4-4-6-2 breathing pattern to calm your mind
          </p>
        )}
      </div>
    </motion.div>
  )
}
