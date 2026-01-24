export interface BirthDetails {
  name: string
  gender: "male" | "female" | "other"
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  latitude?: number
  longitude?: number
  timezone?: string
  chartStyle?: "north" | "south" | "east"
}

export interface PlanetPosition {
  planet: string
  sign: string
  degree: number
  nakshatra: string
  pada: number
  house: number
  lord: string
  dignity: "exalted" | "own" | "debilitated" | "friend" | "enemy" | "neutral"
  isRetrograde: boolean
  isCombust: boolean
}

export interface KundliData {
  birthDetails: BirthDetails
  ascendant: string
  moonSign: string
  sunSign: string
  nakshatra: string
  planets: PlanetPosition[]
  houses: any[]
  yogas: any[]
  doshas: any[]
  dasha: any
}
