'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LocationData {
  placeName: string
  latitude: number
  longitude: number
  timezone: string
  city: string
  state: string
  country: string
}

interface Suggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
  lat: number
  lon: number
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: LocationData) => void
  onInputChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

// Estimate timezone from longitude (each 15° = 1 hour)
function estimateTimezoneFromLongitude(longitude: number): number {
  return Math.round(longitude / 15)
}

// Get timezone ID from offset
function getTimezoneId(offset: number): string {
  // Common Indian timezone
  if (offset >= 5 && offset <= 6) return 'Asia/Kolkata'
  if (offset === 0) return 'UTC'
  if (offset === -5) return 'America/New_York'
  if (offset === -8) return 'America/Los_Angeles'
  if (offset === 1) return 'Europe/London'
  if (offset === 8) return 'Asia/Shanghai'
  if (offset === 9) return 'Asia/Tokyo'
  return `Etc/GMT${offset >= 0 ? '-' : '+'}${Math.abs(offset)}`
}

export default function LocationAutocomplete({
  value,
  onChange,
  onInputChange,
  placeholder = "Enter city, state, country",
  error,
  className
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions from Nominatim (free, no API key needed)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)

    try {
      // Use Nominatim OpenStreetMap API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `limit=6&` +
        `addressdetails=1`
      )

      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()

      const formattedSuggestions: Suggestion[] = data.map((item: any) => {
        const addressParts = item.display_name.split(',')
        return {
          placeId: item.place_id.toString(),
          description: item.display_name,
          mainText: item.name || addressParts[0]?.trim() || '',
          secondaryText: addressParts.slice(1, 3).join(',').trim(),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }
      })

      setSuggestions(formattedSuggestions)
      setShowSuggestions(formattedSuggestions.length > 0)
    } catch (err) {
      console.error('Location search error:', err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onInputChange(inputValue)

    // Debounce API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(inputValue)
    }, 300)
  }

  const handleSelectPlace = async (suggestion: Suggestion) => {
    setShowSuggestions(false)

    // Calculate timezone from longitude
    const timezoneOffset = estimateTimezoneFromLongitude(suggestion.lon)
    const timezone = getTimezoneId(timezoneOffset)

    // Parse the description for city, state, country
    const parts = suggestion.description.split(',').map(p => p.trim())
    const city = suggestion.mainText
    const state = parts.length >= 3 ? parts[parts.length - 2] : ''
    const country = parts.length >= 2 ? parts[parts.length - 1] : ''

    const locationData: LocationData = {
      placeName: suggestion.description,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
      timezone,
      city,
      state,
      country
    }

    onChange(locationData)
    onInputChange(suggestion.description)
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-lg",
            "bg-background border",
            error ? "border-red-500" : "border-input",
            "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
            "outline-none transition-all text-sm"
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-spin" />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-popover
                       rounded-lg shadow-xl border border-border
                       max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onClick={() => handleSelectPlace(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-accent
                       transition-colors border-b border-border last:border-b-0
                       flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {suggestion.mainText}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.secondaryText}
                </p>
              </div>
            </button>
          ))}
          
          {/* Attribution required by Nominatim */}
          <div className="px-4 py-2 text-[10px] text-muted-foreground bg-muted/30 text-center">
            Data © OpenStreetMap contributors
          </div>
        </div>
      )}
    </div>
  )
}
