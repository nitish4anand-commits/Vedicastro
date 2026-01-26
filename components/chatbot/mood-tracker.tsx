'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Smile, 
  Meh, 
  Frown, 
  Sun, 
  Cloud, 
  CloudRain,
  Heart,
  Sparkles,
  Moon,
  X,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MoodOption {
  id: string
  label: string
  emoji: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  score: number
}

const moodOptions: MoodOption[] = [
  { id: 'excellent', label: 'Excellent', emoji: '😊', icon: Sparkles, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20', score: 10 },
  { id: 'good', label: 'Good', emoji: '🙂', icon: Sun, color: 'text-green-500', bgColor: 'bg-green-500/10 hover:bg-green-500/20', score: 8 },
  { id: 'calm', label: 'Calm', emoji: '😌', icon: Heart, color: 'text-blue-400', bgColor: 'bg-blue-400/10 hover:bg-blue-400/20', score: 7 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', icon: Meh, color: 'text-gray-400', bgColor: 'bg-gray-400/10 hover:bg-gray-400/20', score: 5 },
  { id: 'low', label: 'Low', emoji: '😕', icon: Cloud, color: 'text-orange-400', bgColor: 'bg-orange-400/10 hover:bg-orange-400/20', score: 3 },
  { id: 'anxious', label: 'Anxious', emoji: '😰', icon: Moon, color: 'text-purple-400', bgColor: 'bg-purple-400/10 hover:bg-purple-400/20', score: 2 },
  { id: 'sad', label: 'Sad', emoji: '😢', icon: CloudRain, color: 'text-blue-500', bgColor: 'bg-blue-500/10 hover:bg-blue-500/20', score: 2 },
]

interface MoodTrackerProps {
  onMoodSelect?: (mood: string, score: number) => void
  isOpen: boolean
  onClose: () => void
}

export function MoodTracker({ onMoodSelect, isOpen, onClose }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Check if user already tracked mood today
    const today = new Date().toDateString()
    const lastTracked = localStorage.getItem('lastMoodTrackDate')
    if (lastTracked === today) {
      setSubmitted(true)
    }
  }, [])

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood.id)
  }

  const handleSubmit = () => {
    if (!selectedMood) return
    
    const mood = moodOptions.find(m => m.id === selectedMood)
    if (!mood) return

    // Save to localStorage
    const moodEntry = {
      mood: selectedMood,
      score: mood.score,
      energyLevel,
      timestamp: new Date().toISOString()
    }
    
    const existingEntries = JSON.parse(localStorage.getItem('moodHistory') || '[]')
    existingEntries.push(moodEntry)
    localStorage.setItem('moodHistory', JSON.stringify(existingEntries.slice(-30))) // Keep last 30 entries
    localStorage.setItem('lastMoodTrackDate', new Date().toDateString())
    
    setSubmitted(true)
    onMoodSelect?.(selectedMood, mood.score)
    
    // Close after a brief delay to show confirmation
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-purple-500/20 p-6 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {submitted ? 'Thank you! 🙏' : 'How are you feeling?'}
                </h3>
                <p className="text-sm text-gray-400">
                  {submitted 
                    ? 'Your mood has been recorded' 
                    : 'Track your daily emotional wellness'
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-300">See you tomorrow! ✨</p>
              </motion.div>
            ) : (
              <>
                {/* Mood Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {moodOptions.map((mood) => {
                    const Icon = mood.icon
                    const isSelected = selectedMood === mood.id
                    return (
                      <motion.button
                        key={mood.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMoodSelect(mood)}
                        className={`
                          p-4 rounded-xl flex flex-col items-center gap-2 transition-all
                          ${isSelected 
                            ? `ring-2 ring-purple-500 ${mood.bgColor.replace('hover:', '')}` 
                            : mood.bgColor
                          }
                        `}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className={`text-xs font-medium ${isSelected ? mood.color : 'text-gray-400'}`}>
                          {mood.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Energy Level Slider */}
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <label className="text-sm text-gray-400 mb-2 block">
                      Energy Level: {energyLevel}/10
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔋</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={energyLevel}
                        onChange={(e) => setEnergyLevel(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-4
                          [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-purple-500
                          [&::-webkit-slider-thumb]:cursor-pointer
                        "
                      />
                      <span className="text-lg">⚡</span>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedMood}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  Track My Mood
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Small mood indicator component for the chat header
export function MoodIndicator() {
  const [todaysMood, setTodaysMood] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date().toDateString()
    const lastTracked = localStorage.getItem('lastMoodTrackDate')
    if (lastTracked === today) {
      const history = JSON.parse(localStorage.getItem('moodHistory') || '[]')
      if (history.length > 0) {
        const lastEntry = history[history.length - 1]
        setTodaysMood(lastEntry.mood)
      }
    }
  }, [])

  if (!todaysMood) return null

  const mood = moodOptions.find(m => m.id === todaysMood)
  if (!mood) return null

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`px-2 py-1 rounded-full ${mood.bgColor.split(' ')[0]} flex items-center gap-1`}
    >
      <span className="text-sm">{mood.emoji}</span>
      <span className={`text-xs ${mood.color}`}>{mood.label}</span>
    </motion.div>
  )
}
