"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Loader2, Star, MapPin, Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete"
import { TimePicker } from "@/components/forms"
import { birthDetailsSchema, type BirthDetailsFormData } from "@/lib/validations/birth-details"
import { useRouter } from "next/navigation"

interface LocationData {
  name: string
  formattedAddress: string
  latitude: number
  longitude: number
  timezone: number
}

export function BirthDetailsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [placeInput, setPlaceInput] = useState("")
  const [timeValue, setTimeValue] = useState("12:00")
  const router = useRouter()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BirthDetailsFormData>({
    resolver: zodResolver(birthDetailsSchema) as any,
    defaultValues: {
      chartStyle: "north",
      gender: "male",
    },
  })

  const handlePlaceSelect = (place: LocationData) => {
    setLocationData(place)
    setPlaceInput(place.formattedAddress)
    setValue("placeOfBirth", place.formattedAddress)
    setValue("latitude", place.latitude)
    setValue("longitude", place.longitude)
    setValue("timezone", place.timezone.toString())
  }

  const onSubmit: SubmitHandler<BirthDetailsFormData> = async (data) => {
    // Ensure we have location data
    if (!locationData) {
      alert("Please select a valid location from the suggestions")
      return
    }

    setIsSubmitting(true)
    
    // Merge form data with location data
    const fullData = {
      ...data,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone.toString(),
    }
    
    // Save to localStorage
    localStorage.setItem("birthDetails", JSON.stringify(fullData))
    
    // Navigate to processing page
    router.push("/kundli/processing")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Generate Your Kundli</CardTitle>
          <CardDescription className="text-center">
            Enter your birth details to get your personalized Vedic astrology chart
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <div className="flex gap-4">
                {["male", "female", "other"].map((gender) => (
                  <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={gender}
                      {...register("gender")}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <label htmlFor="timeOfBirth" className="text-sm font-medium">
                Time of Birth
              </label>
              <TimePicker
                value={timeValue}
                onChange={(time) => {
                  setTimeValue(time)
                  setValue("timeOfBirth", time)
                }}
                error={errors.timeOfBirth?.message}
              />
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <label htmlFor="placeOfBirth" className="text-sm font-medium">
                Place of Birth
              </label>
              <PlacesAutocomplete
                value={placeInput}
                onChange={(val) => {
                  setPlaceInput(val)
                  if (!val) setLocationData(null)
                }}
                onPlaceSelect={handlePlaceSelect}
                placeholder="Start typing a city name..."
                error={errors.placeOfBirth?.message}
              />
              
              {/* Location Confirmation */}
              {locationData && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-green-500">Location confirmed</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span>Latitude: {locationData.latitude.toFixed(4)}°</span>
                        <span>Longitude: {locationData.longitude.toFixed(4)}°</span>
                        <span>Timezone: UTC{locationData.timezone >= 0 ? '+' : ''}{locationData.timezone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {!locationData && placeInput && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Select a location from the suggestions for accurate calculations
                </p>
              )}
            </div>

            {/* Chart Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Style Preference</label>
              <div className="flex gap-4">
                {["north", "south", "east"].map((style) => (
                  <label key={style} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value={style}
                      {...register("chartStyle")}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{style} Indian</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-5 w-5" />
                  Generate Kundli
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Your data is processed securely and never shared with third parties
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
