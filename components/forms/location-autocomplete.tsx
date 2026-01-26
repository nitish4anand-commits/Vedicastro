'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const libraries: ("places")[] = ["places"]

export interface LocationData {
  placeName: string
  latitude: number
  longitude: number
  timezone: string
  city: string
  state: string
  country: string
}

interface LocationAutocompleteProps {
  value: string
  onChange: (location: LocationData) => void
  onInputChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export default function LocationAutocomplete({
  value,
  onChange,
  onInputChange,
  placeholder = "Enter city, state, country",
  error,
  className
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
    preventGoogleFontsLoading: true
  })

  // Initialize services when Google Maps loads
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService()

      // Create a dummy div for PlacesService (required by API)
      const dummyDiv = document.createElement('div')
      placesService.current = new google.maps.places.PlacesService(dummyDiv)
    }
  }, [isLoaded])

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

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onInputChange(inputValue)

    if (!inputValue.trim() || inputValue.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!autocompleteService.current) return

    setIsLoading(true)

    try {
      autocompleteService.current.getPlacePredictions(
        {
          input: inputValue,
          types: ['(cities)'] // Only cities
        },
        (predictions, status) => {
          setIsLoading(false)

          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        }
      )
    } catch (error) {
      console.error('Autocomplete error:', error)
      setIsLoading(false)
    }
  }, [onInputChange])

  const getTimezone = async (lat: number, lng: number): Promise<string> => {
    if (!apiKey) return 'Asia/Kolkata' // Default to IST

    try {
      const timestamp = Math.floor(Date.now() / 1000)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${apiKey}`
      )
      const data = await response.json()
      return data.timeZoneId || 'Asia/Kolkata'
    } catch (error) {
      console.error('Timezone error:', error)
      return 'Asia/Kolkata'
    }
  }

  const handleSelectPlace = async (placeId: string, description: string) => {
    if (!placesService.current) return

    setIsLoading(true)

    placesService.current.getDetails(
      {
        placeId,
        fields: ['geometry', 'address_components', 'formatted_address', 'name']
      },
      async (place, status) => {
        setIsLoading(false)

        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const lat = place.geometry?.location?.lat() || 0
          const lng = place.geometry?.location?.lng() || 0

          // Get timezone using lat/lng
          const timezone = await getTimezone(lat, lng)

          // Extract city, state, country from address components
          let city = ''
          let state = ''
          let country = ''

          place.address_components?.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name
            }
            if (component.types.includes('country')) {
              country = component.long_name
            }
          })

          const locationData: LocationData = {
            placeName: description,
            latitude: lat,
            longitude: lng,
            timezone,
            city: city || place.name || '',
            state,
            country
          }

          onChange(locationData)
          onInputChange(description)
          setShowSuggestions(false)
          setSuggestions([])
        }
      }
    )
  }

  // If no API key, show a basic input
  if (!apiKey) {
    return (
      <div className={cn("w-full", className)}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-background border",
              error ? "border-red-500" : "border-input",
              "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
              "outline-none transition-all text-sm"
            )}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        <p className="mt-1 text-xs text-amber-500">
          ⚠️ Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable location autocomplete
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">
          Error loading Google Maps. Please check your API key.
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center gap-2 text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading location services...</span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
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
              key={suggestion.place_id}
              type="button"
              onClick={() => handleSelectPlace(suggestion.place_id, suggestion.description)}
              className="w-full px-4 py-3 text-left hover:bg-accent
                       transition-colors border-b border-border last:border-b-0
                       flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {suggestion.structured_formatting?.main_text}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.structured_formatting?.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
