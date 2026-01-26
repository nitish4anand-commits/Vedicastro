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
    let val = e.target.value.replace(/\D/g, '')
    if (val === '') {
      setHours('')
      return
    }

    let num = parseInt(val)
    if (num < 1) num = 1
    if (num > 12) num = 12

    const newHours = num.toString().padStart(2, '0')
    setHours(newHours)
    updateTime(newHours, minutes, period)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val === '') {
      setMinutes('')
      return
    }

    let num = parseInt(val)
    if (num < 0) num = 0
    if (num > 59) num = 59

    const newMinutes = num.toString().padStart(2, '0')
    setMinutes(newMinutes)
    updateTime(hours, newMinutes, period)
  }

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod)
    updateTime(hours, minutes, newPeriod)
  }

  const handleHourBlur = () => {
    if (hours === '') {
      setHours('12')
      updateTime('12', minutes, period)
    }
  }

  const handleMinuteBlur = () => {
    if (minutes === '') {
      setMinutes('00')
      updateTime(hours, '00', period)
    }
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
          value={hours}
          onChange={handleHourChange}
          onBlur={handleHourBlur}
          placeholder="HH"
          maxLength={2}
          className="w-10 text-center bg-transparent outline-none
                     text-foreground font-medium text-sm"
        />

        <span className="text-muted-foreground font-bold">:</span>

        {/* Minutes */}
        <input
          type="text"
          value={minutes}
          onChange={handleMinuteChange}
          onBlur={handleMinuteBlur}
          placeholder="MM"
          maxLength={2}
          className="w-10 text-center bg-transparent outline-none
                     text-foreground font-medium text-sm"
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
