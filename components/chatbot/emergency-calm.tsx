'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, Heart, Phone, X, Pause, Play } from 'lucide-react'
import { CRISIS_HELPLINES } from '@/lib/ai/emotion-detection'

interface EmergencyCalmProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2'

const BREATH_PATTERN = {
  inhale: 4,
  hold1: 4,
  exhale: 6,
  hold2: 2
}

const phaseLabels: Record<Phase, string> = {
  inhale: 'Breathe In',
  hold1: 'Hold',
  exhale: 'Breathe Out',
  hold2: 'Rest'
}

const phaseColors: Record<Phase, string> = {
  inhale: 'from-blue-400 to-cyan-400',
  hold1: 'from-purple-400 to-pink-400',
  exhale: 'from-green-400 to-emerald-400',
  hold2: 'from-orange-400 to-yellow-400'
}

export function EmergencyCalm({ isOpen, onClose, onComplete }: EmergencyCalmProps) {
  const [phase, setPhase] = useState<Phase>('inhale')
  const [countdown, setCountdown] = useState(BREATH_PATTERN.inhale)
  const [cycleCount, setCycleCount] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showHelplines, setShowHelplines] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const totalCycles = 5 // Complete 5 full breathing cycles

  const getNextPhase = useCallback((currentPhase: Phase): Phase => {
    const phases: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2']
    const currentIndex = phases.indexOf(currentPhase)
    return phases[(currentIndex + 1) % phases.length]
  }, [])

  useEffect(() => {
    if (!isOpen || isPaused || !isStarted) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(phase)
          setPhase(nextPhase)
          
          if (nextPhase === 'inhale') {
            setCycleCount(prev => {
              if (prev + 1 >= totalCycles) {
                setIsStarted(false)
                onComplete?.()
                return 0
              }
              return prev + 1
            })
          }
          
          return BREATH_PATTERN[nextPhase]
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, isPaused, isStarted, phase, getNextPhase, onComplete])

  const handleStart = () => {
    setIsStarted(true)
    setPhase('inhale')
    setCountdown(BREATH_PATTERN.inhale)
    setCycleCount(0)
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleClose = () => {
    setIsStarted(false)
    setIsPaused(false)
    setCycleCount(0)
    setPhase('inhale')
    setCountdown(BREATH_PATTERN.inhale)
    onClose()
  }

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    if (phase === 'inhale') return 1.5
    if (phase === 'exhale') return 1
    return phase === 'hold1' ? 1.5 : 1
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 rounded-3xl border border-purple-500/20 p-8 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Emergency Calm</h3>
                  <p className="text-sm text-gray-400">4-4-6-2 breathing exercise</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {!isStarted ? (
              /* Pre-start screen */
              <div className="text-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"
                />
                <p className="text-gray-300 mb-6 max-w-xs mx-auto">
                  Take a moment to center yourself. This breathing exercise will help calm your nervous system.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
                >
                  Begin Breathing
                </motion.button>
              </div>
            ) : (
              /* Active breathing screen */
              <div className="flex flex-col items-center">
                {/* Breathing circle */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{
                      scale: getCircleScale(),
                      opacity: phase === 'inhale' || phase === 'hold1' ? 0.3 : 0.1
                    }}
                    transition={{ duration: BREATH_PATTERN[phase], ease: 'easeInOut' }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${phaseColors[phase]} blur-xl`}
                  />
                  
                  {/* Main breathing circle */}
                  <motion.div
                    animate={{
                      scale: getCircleScale()
                    }}
                    transition={{ duration: BREATH_PATTERN[phase], ease: 'easeInOut' }}
                    className={`w-40 h-40 rounded-full bg-gradient-to-r ${phaseColors[phase]} flex items-center justify-center shadow-lg`}
                  >
                    <div className="text-center">
                      <motion.span
                        key={countdown}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-bold text-white"
                      >
                        {countdown}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>

                {/* Phase label */}
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-6"
                >
                  <p className="text-2xl font-medium text-white mb-1">
                    {phaseLabels[phase]}
                  </p>
                  <p className="text-sm text-gray-400">
                    Cycle {cycleCount + 1} of {totalCycles}
                  </p>
                </motion.div>

                {/* Progress bar */}
                <div className="w-full max-w-xs mb-6">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${phaseColors[phase]}`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${((cycleCount + 1) / totalCycles) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePauseResume}
                    className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4" /> Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {/* Need more help section */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={() => setShowHelplines(!showHelplines)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
                Need to talk to someone?
              </button>
              
              <AnimatePresence>
                {showHelplines && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <p className="text-xs text-gray-500 text-center mb-3">
                      24/7 Crisis Helplines (India)
                    </p>
                    {CRISIS_HELPLINES.slice(0, 3).map((helpline) => (
                      <a
                        key={helpline.name}
                        href={`tel:${helpline.phone}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors group"
                      >
                        <div>
                          <p className="font-medium text-white text-sm">{helpline.name}</p>
                          <p className="text-xs text-gray-400">{helpline.available}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400 font-mono text-sm">{helpline.phone}</span>
                          <Phone className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
