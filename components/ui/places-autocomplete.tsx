"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaceResult {
  name: string
  formattedAddress: string
  latitude: number
  longitude: number
  timezone: number
  utcOffset: number
}

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: PlaceResult) => void
  placeholder?: string
  className?: string
  error?: string
}

interface Suggestion {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
  lat?: number
  lon?: number
}

// Fallback timezone estimation based on longitude
function estimateTimezoneFromLongitude(longitude: number): number {
  // Each 15 degrees of longitude = 1 hour time zone difference
  return Math.round(longitude / 15)
}

// Get timezone offset using browser's timezone API
async function getTimezoneOffset(lat: number, lng: number): Promise<number> {
  try {
    // Try Google Timezone API if available
    const googleMaps = (window as any).google?.maps
    if (googleMaps?.TimeZoneService) {
      return new Promise((resolve) => {
        const service = new googleMaps.TimeZoneService()
        service.getTimeZoneForLocation({ lat, lng }, Date.now(), (response: any) => {
          if (response.status === 'OK') {
            resolve((response.rawOffset + response.dstOffset) / 3600)
          } else {
            resolve(estimateTimezoneFromLongitude(lng))
          }
        })
      })
    }
    // Fallback: estimate from longitude
    return estimateTimezoneFromLongitude(lng)
  } catch {
    return estimateTimezoneFromLongitude(lng)
  }
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search for a city...",
  className,
  error,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const sessionTokenRef = useRef<any>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const placesServiceRef = useRef<any>(null)

  const initializeServices = useCallback(() => {
    const googleMaps = (window as any).google?.maps?.places
    if (googleMaps) {
      autocompleteServiceRef.current = new googleMaps.AutocompleteService()
      sessionTokenRef.current = new googleMaps.AutocompleteSessionToken()
      
      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div')
      placesServiceRef.current = new googleMaps.PlacesService(dummyDiv)
    }
  }, [])

  // Load Google Maps script
  useEffect(() => {
    const googleMaps = (window as any).google?.maps?.places
    if (typeof window !== 'undefined' && !googleMaps) {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        console.warn('Google Maps API key not found. Using fallback location search.')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsGoogleLoaded(true)
        initializeServices()
      }
      document.head.appendChild(script)
    } else if (googleMaps) {
      setIsGoogleLoaded(true)
      initializeServices()
    }
  }, [initializeServices])

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)

    if (!inputValue || inputValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!autocompleteServiceRef.current) {
      // Fallback: Use free geocoding API
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&limit=5&addressdetails=1`
        )
        const data = await response.json()
        
        const formattedSuggestions = data.map((item: any) => ({
          placeId: item.place_id.toString(),
          description: item.display_name,
          mainText: item.name || item.display_name.split(',')[0],
          secondaryText: item.display_name.split(',').slice(1).join(',').trim(),
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }))
        
        setSuggestions(formattedSuggestions)
        setShowSuggestions(true)
      } catch (err) {
        console.error('Geocoding error:', err)
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Use Google Places Autocomplete
    setIsLoading(true)
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: inputValue,
        types: ['(cities)'],
        sessionToken: sessionTokenRef.current!,
      },
      (predictions: any, status: string) => {
        setIsLoading(false)
        const googleMaps = (window as any).google?.maps?.places
        if (status === googleMaps?.PlacesServiceStatus?.OK && predictions) {
          setSuggestions(
            predictions.map((p: any) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text || '',
            }))
          )
          setShowSuggestions(true)
        } else {
          setSuggestions([])
        }
      }
    )
  }, [onChange])

  const handleSelectPlace = useCallback(async (suggestion: Suggestion) => {
    setIsLoading(true)
    setShowSuggestions(false)
    onChange(suggestion.description)

    try {
      // If we have lat/lon from Nominatim (fallback)
      if (suggestion.lat && suggestion.lon) {
        const timezone = await getTimezoneOffset(suggestion.lat, suggestion.lon)
        onPlaceSelect({
          name: suggestion.mainText,
          formattedAddress: suggestion.description,
          latitude: suggestion.lat,
          longitude: suggestion.lon,
          timezone,
          utcOffset: timezone,
        })
        setIsLoading(false)
        return
      }

      // Use Google Places Details
      if (placesServiceRef.current) {
        const googleMaps = (window as any).google?.maps?.places
        placesServiceRef.current.getDetails(
          {
            placeId: suggestion.placeId,
            fields: ['geometry', 'formatted_address', 'name', 'utc_offset_minutes'],
            sessionToken: sessionTokenRef.current!,
          },
          async (place: any, status: string) => {
            if (status === googleMaps?.PlacesServiceStatus?.OK && place?.geometry?.location) {
              const lat = place.geometry.location.lat()
              const lng = place.geometry.location.lng()
              
              // Get timezone
              let timezone = estimateTimezoneFromLongitude(lng)
              if (place.utc_offset_minutes !== undefined) {
                timezone = place.utc_offset_minutes / 60
              } else {
                timezone = await getTimezoneOffset(lat, lng)
              }

              onPlaceSelect({
                name: place.name || suggestion.mainText,
                formattedAddress: place.formatted_address || suggestion.description,
                latitude: lat,
                longitude: lng,
                timezone,
                utcOffset: timezone,
              })

              // Create new session token for next search
              if (googleMaps?.AutocompleteSessionToken) {
                sessionTokenRef.current = new googleMaps.AutocompleteSessionToken()
              }
            }
            setIsLoading(false)
          }
        )
      }
    } catch (err) {
      console.error('Error getting place details:', err)
      setIsLoading(false)
    }
  }, [onChange, onPlaceSelect])

  const clearInput = () => {
    onChange('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={cn("pl-10 pr-10", className)}
          autoComplete="off"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : value ? (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-3"
              onClick={() => handleSelectPlace(suggestion)}
            >
              <MapPin className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{suggestion.mainText}</p>
                <p className="text-xs text-muted-foreground truncate">{suggestion.secondaryText}</p>
              </div>
            </button>
          ))}
          <div className="px-4 py-2 bg-muted/50 border-t text-xs text-muted-foreground flex items-center gap-1">
            {isGoogleLoaded ? (
              <>
                <span>Powered by</span>
                <span className="font-medium">Google</span>
              </>
            ) : (
              <>
                <span>Powered by</span>
                <span className="font-medium">OpenStreetMap</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
