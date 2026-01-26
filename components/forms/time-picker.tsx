'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value: string // Format: "HH:MM" or "HH:MM:SS" (24-hour)
  onChange: (time: string) => void
  error?: string
  className?: string
}

export default function TimePicker({ value, onChange, error, className }: TimePickerProps) {
  const [hours, setHours] = useState('12')
  const [minutes, setMinutes] = useState('00')
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from value (24-hour format)
  useEffect(() => {
    if (value && !isInitialized) {
      const [h, m] = value.split(':')
      const hour24 = parseInt(h) || 0

      if (hour24 === 0) {
        setHours('12')
        setPeriod('AM')
      } else if (hour24 < 12) {
        setHours(hour24.toString().padStart(2, '0'))
        setPeriod('AM')
      } else if (hour24 === 12) {
        setHours('12')
        setPeriod('PM')
      } else {
        setHours((hour24 - 12).toString().padStart(2, '0'))
        setPeriod('PM')
      }

      setMinutes(m?.substring(0, 2) || '00')
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  // Convert to 24-hour format and notify parent
  const updateTime = (newHours: string, newMinutes: string, newPeriod: 'AM' | 'PM') => {
    let hour24 = parseInt(newHours) || 12

    if (newPeriod === 'AM') {
      if (hour24 === 12) hour24 = 0
    } else {
      if (hour24 !== 12) hour24 += 12
    }

    const time24 = `${hour24.toString().padStart(2, '0')}:${newMinutes}`
    onChange(time24)
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setHours(val)
    
    // Only update parent if we have a valid complete value
    if (val.length === 2) {
      let num = parseInt(val)
      if (num >= 1 && num <= 12) {
        updateTime(val.padStart(2, '0'), minutes, period)
      }
    } else if (val.length === 1 && parseInt(val) >= 1) {
      // Single digit 1-9 is valid
      updateTime(val.padStart(2, '0'), minutes, period)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setMinutes(val)
    
    // Only update parent if we have a valid value
    if (val.length > 0) {
      let num = parseInt(val)
      if (num >= 0 && num <= 59) {
        updateTime(hours || '12', val.padStart(2, '0'), period)
      }
    }
  }

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod)
    updateTime(hours, minutes, newPeriod)
  }

  const handleHourBlur = () => {
    let num = parseInt(hours) || 12
    if (num < 1) num = 1
    if (num > 12) num = 12
    const formatted = num.toString().padStart(2, '0')
    setHours(formatted)
    updateTime(formatted, minutes || '00', period)
  }

  const handleMinuteBlur = () => {
    let num = parseInt(minutes) || 0
    if (num < 0) num = 0
    if (num > 59) num = 59
    const formatted = num.toString().padStart(2, '0')
    setMinutes(formatted)
    updateTime(hours || '12', formatted, period)
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "bg-background border",
          error ? "border-red-500" : "border-input",
          "focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20",
          "transition-all"
        )}
      >
        <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />

        {/* Hours */}
        <input
          type="text"
          inputMode="numeric"
          value={hours}
          onChange={handleHourChange}
          onBlur={handleHourBlur}
          onFocus={(e) => e.target.select()}
          placeholder="HH"
          maxLength={2}
          className="w-10 text-center bg-transparent outline-none
                     text-foreground font-medium text-sm
                     focus:bg-purple-500/10 rounded cursor-text"
          aria-label="Hours"
        />

        <span className="text-muted-foreground font-bold">:</span>

        {/* Minutes */}
        <input
          type="text"
          inputMode="numeric"
          value={minutes}
          onChange={handleMinuteChange}
          onBlur={handleMinuteBlur}
          onFocus={(e) => e.target.select()}
          placeholder="MM"
          maxLength={2}
          className="w-10 text-center bg-transparent outline-none
                     text-foreground font-medium text-sm
                     focus:bg-purple-500/10 rounded cursor-text"
          aria-label="Minutes"
        />

        {/* AM/PM Toggle */}
        <div className="flex ml-auto border rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => handlePeriodChange('AM')}
            className={cn(
              "px-3 py-1 text-xs font-semibold transition-all",
              period === 'AM'
                ? "bg-purple-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('PM')}
            className={cn(
              "px-3 py-1 text-xs font-semibold transition-all",
              period === 'PM'
                ? "bg-purple-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            PM
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Helper text */}
      <p className="mt-1 text-xs text-muted-foreground">
        Enter time in 12-hour format (e.g., 02:30 PM)
      </p>
    </div>
  )
}
