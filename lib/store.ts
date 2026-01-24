import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BirthDetails {
  name: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  latitude: number
  longitude: number
  timezone: string
}

export interface PlanetPosition {
  planet: string
  sign: string
  signLord: string
  degree: number
  nakshatra: string
  nakshatraLord: string
  pada: number
  house: number
  isRetrograde: boolean
  isCombust: boolean
  dignity: 'exalted' | 'own' | 'friend' | 'neutral' | 'enemy' | 'debilitated'
}

export interface DashaPeriod {
  planet: string
  startDate: string
  endDate: string
  isActive: boolean
  subPeriods?: {
    planet: string
    startDate: string
    endDate: string
    isActive: boolean
  }[]
}

export interface Yoga {
  name: string
  type: 'raj' | 'dhana' | 'arishta' | 'special'
  planets: string[]
  strength: number
  description: string
  effects: string[]
  isActive: boolean
}

export interface Dosha {
  name: string
  present: boolean
  severity: 'none' | 'low' | 'medium' | 'high'
  type?: string
  description: string
  remedies: string[]
}

export interface KundliData {
  birthDetails: BirthDetails
  ascendant: {
    sign: string
    degree: number
    nakshatra: string
    pada: number
  }
  moonSign: {
    sign: string
    degree: number
    nakshatra: string
    pada: number
  }
  sunSign: {
    sign: string
    degree: number
    nakshatra: string
    pada: number
  }
  planets: PlanetPosition[]
  houses: {
    houseNumber: number
    sign: string
    signLord: string
    planets: string[]
  }[]
  dashas: DashaPeriod[]
  yogas: Yoga[]
  doshas: Dosha[]
  createdAt: string
}

interface KundliState {
  // Current kundli data
  currentKundli: KundliData | null
  
  // Saved kundlis
  savedKundlis: KundliData[]
  
  // Loading states
  isGenerating: boolean
  error: string | null
  
  // Actions
  setCurrentKundli: (kundli: KundliData) => void
  clearCurrentKundli: () => void
  saveKundli: (kundli: KundliData) => void
  removeSavedKundli: (createdAt: string) => void
  setGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
}

export const useKundliStore = create<KundliState>()(
  persist(
    (set, get) => ({
      currentKundli: null,
      savedKundlis: [],
      isGenerating: false,
      error: null,

      setCurrentKundli: (kundli) => set({ currentKundli: kundli, error: null }),
      
      clearCurrentKundli: () => set({ currentKundli: null }),
      
      saveKundli: (kundli) => {
        const { savedKundlis } = get()
        const exists = savedKundlis.some(
          (k) => k.createdAt === kundli.createdAt
        )
        if (!exists) {
          set({ savedKundlis: [...savedKundlis, kundli] })
        }
      },
      
      removeSavedKundli: (createdAt) => {
        const { savedKundlis } = get()
        set({
          savedKundlis: savedKundlis.filter((k) => k.createdAt !== createdAt),
        })
      },
      
      setGenerating: (isGenerating) => set({ isGenerating }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'kundli-storage',
      partialize: (state) => ({ savedKundlis: state.savedKundlis }),
    }
  )
)

// User preferences store
interface PreferencesState {
  language: 'en' | 'hi'
  chartStyle: 'north' | 'south' | 'east'
  ayanamsa: 'lahiri' | 'raman' | 'krishnamurti'
  timeFormat: '12h' | '24h'
  
  setLanguage: (language: 'en' | 'hi') => void
  setChartStyle: (style: 'north' | 'south' | 'east') => void
  setAyanamsa: (ayanamsa: 'lahiri' | 'raman' | 'krishnamurti') => void
  setTimeFormat: (format: '12h' | '24h') => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: 'en',
      chartStyle: 'north',
      ayanamsa: 'lahiri',
      timeFormat: '12h',

      setLanguage: (language) => set({ language }),
      setChartStyle: (chartStyle) => set({ chartStyle }),
      setAyanamsa: (ayanamsa) => set({ ayanamsa }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
    }),
    {
      name: 'preferences-storage',
    }
  )
)

// Matching store
interface MatchingState {
  maleDetails: BirthDetails | null
  femaleDetails: BirthDetails | null
  matchingResult: {
    totalPoints: number
    maxPoints: number
    kootaDetails: {
      name: string
      maxPoints: number
      receivedPoints: number
      description: string
    }[]
    recommendation: string
  } | null
  
  setMaleDetails: (details: BirthDetails) => void
  setFemaleDetails: (details: BirthDetails) => void
  setMatchingResult: (result: MatchingState['matchingResult']) => void
  clearMatching: () => void
}

export const useMatchingStore = create<MatchingState>()((set) => ({
  maleDetails: null,
  femaleDetails: null,
  matchingResult: null,

  setMaleDetails: (details) => set({ maleDetails: details }),
  setFemaleDetails: (details) => set({ femaleDetails: details }),
  setMatchingResult: (result) => set({ matchingResult: result }),
  clearMatching: () =>
    set({ maleDetails: null, femaleDetails: null, matchingResult: null }),
}))
