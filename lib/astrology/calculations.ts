// Vedic Astrology Calculation Engine
// This module provides core Vedic astrology calculations

// Zodiac signs (Rashis) in Sanskrit
export const RASHIS = [
  { name: "Mesha", english: "Aries", symbol: "♈", element: "Fire", ruler: "Mars" },
  { name: "Vrishabha", english: "Taurus", symbol: "♉", element: "Earth", ruler: "Venus" },
  { name: "Mithuna", english: "Gemini", symbol: "♊", element: "Air", ruler: "Mercury" },
  { name: "Karka", english: "Cancer", symbol: "♋", element: "Water", ruler: "Moon" },
  { name: "Simha", english: "Leo", symbol: "♌", element: "Fire", ruler: "Sun" },
  { name: "Kanya", english: "Virgo", symbol: "♍", element: "Earth", ruler: "Mercury" },
  { name: "Tula", english: "Libra", symbol: "♎", element: "Air", ruler: "Venus" },
  { name: "Vrishchika", english: "Scorpio", symbol: "♏", element: "Water", ruler: "Mars" },
  { name: "Dhanu", english: "Sagittarius", symbol: "♐", element: "Fire", ruler: "Jupiter" },
  { name: "Makara", english: "Capricorn", symbol: "♑", element: "Earth", ruler: "Saturn" },
  { name: "Kumbha", english: "Aquarius", symbol: "♒", element: "Air", ruler: "Saturn" },
  { name: "Meena", english: "Pisces", symbol: "♓", element: "Water", ruler: "Jupiter" },
]

// Nakshatras (27 lunar mansions)
export const NAKSHATRAS = [
  { name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras", pada: [0, 13.333333] },
  { name: "Bharani", ruler: "Venus", deity: "Yama", pada: [13.333333, 26.666667] },
  { name: "Krittika", ruler: "Sun", deity: "Agni", pada: [26.666667, 40] },
  { name: "Rohini", ruler: "Moon", deity: "Brahma", pada: [40, 53.333333] },
  { name: "Mrigashira", ruler: "Mars", deity: "Soma", pada: [53.333333, 66.666667] },
  { name: "Ardra", ruler: "Rahu", deity: "Rudra", pada: [66.666667, 80] },
  { name: "Punarvasu", ruler: "Jupiter", deity: "Aditi", pada: [80, 93.333333] },
  { name: "Pushya", ruler: "Saturn", deity: "Brihaspati", pada: [93.333333, 106.666667] },
  { name: "Ashlesha", ruler: "Mercury", deity: "Sarpa", pada: [106.666667, 120] },
  { name: "Magha", ruler: "Ketu", deity: "Pitris", pada: [120, 133.333333] },
  { name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga", pada: [133.333333, 146.666667] },
  { name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman", pada: [146.666667, 160] },
  { name: "Hasta", ruler: "Moon", deity: "Savitar", pada: [160, 173.333333] },
  { name: "Chitra", ruler: "Mars", deity: "Tvashtar", pada: [173.333333, 186.666667] },
  { name: "Swati", ruler: "Rahu", deity: "Vayu", pada: [186.666667, 200] },
  { name: "Vishakha", ruler: "Jupiter", deity: "Indra-Agni", pada: [200, 213.333333] },
  { name: "Anuradha", ruler: "Saturn", deity: "Mitra", pada: [213.333333, 226.666667] },
  { name: "Jyeshtha", ruler: "Mercury", deity: "Indra", pada: [226.666667, 240] },
  { name: "Mula", ruler: "Ketu", deity: "Nirrti", pada: [240, 253.333333] },
  { name: "Purva Ashadha", ruler: "Venus", deity: "Apas", pada: [253.333333, 266.666667] },
  { name: "Uttara Ashadha", ruler: "Sun", deity: "Vishwedevas", pada: [266.666667, 280] },
  { name: "Shravana", ruler: "Moon", deity: "Vishnu", pada: [280, 293.333333] },
  { name: "Dhanishta", ruler: "Mars", deity: "Vasus", pada: [293.333333, 306.666667] },
  { name: "Shatabhisha", ruler: "Rahu", deity: "Varuna", pada: [306.666667, 320] },
  { name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Aja Ekapada", pada: [320, 333.333333] },
  { name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahir Budhnya", pada: [333.333333, 346.666667] },
  { name: "Revati", ruler: "Mercury", deity: "Pushan", pada: [346.666667, 360] },
]

// Planets (Grahas)
export const PLANETS = [
  { name: "Sun", sanskrit: "Surya", symbol: "☉", nature: "Malefic" },
  { name: "Moon", sanskrit: "Chandra", symbol: "☽", nature: "Benefic" },
  { name: "Mars", sanskrit: "Mangal", symbol: "♂", nature: "Malefic" },
  { name: "Mercury", sanskrit: "Budha", symbol: "☿", nature: "Neutral" },
  { name: "Jupiter", sanskrit: "Guru", symbol: "♃", nature: "Benefic" },
  { name: "Venus", sanskrit: "Shukra", symbol: "♀", nature: "Benefic" },
  { name: "Saturn", sanskrit: "Shani", symbol: "♄", nature: "Malefic" },
  { name: "Rahu", sanskrit: "Rahu", symbol: "☊", nature: "Malefic" },
  { name: "Ketu", sanskrit: "Ketu", symbol: "☋", nature: "Malefic" },
]

// Vimshottari Dasha periods (in years)
export const DASHA_YEARS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
}

// Dasha sequence
export const DASHA_SEQUENCE = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
]

// Ayanamsa calculation (Lahiri/Chitrapaksha)
export function calculateAyanamsa(julianDay: number): number {
  // Lahiri Ayanamsa formula
  const T = (julianDay - 2451545.0) / 36525
  const ayanamsa = 23.85 + 0.0137 * T - 0.00034 * T * T
  return ayanamsa
}

// Convert date to Julian Day
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600

  let y = year
  let m = month

  if (m <= 2) {
    y -= 1
    m += 12
  }

  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)

  const JD = Math.floor(365.25 * (y + 4716)) + 
             Math.floor(30.6001 * (m + 1)) + 
             day + hour / 24 + B - 1524.5

  return JD
}

// Calculate sidereal longitude (accounting for ayanamsa)
export function tropicalToSidereal(tropicalLongitude: number, ayanamsa: number): number {
  let sidereal = tropicalLongitude - ayanamsa
  if (sidereal < 0) sidereal += 360
  if (sidereal >= 360) sidereal -= 360
  return sidereal
}

// Get zodiac sign from longitude
export function getZodiacSign(longitude: number): { sign: number; degrees: number; minutes: number } {
  const sign = Math.floor(longitude / 30)
  const degInSign = longitude % 30
  const degrees = Math.floor(degInSign)
  const minutes = Math.floor((degInSign - degrees) * 60)
  return { sign, degrees, minutes }
}

// Get Nakshatra from longitude
export function getNakshatra(longitude: number): { nakshatra: number; pada: number } {
  const nakshatraSpan = 360 / 27 // 13.333... degrees
  const nakshatra = Math.floor(longitude / nakshatraSpan)
  const degInNakshatra = longitude % nakshatraSpan
  const pada = Math.floor(degInNakshatra / (nakshatraSpan / 4)) + 1
  return { nakshatra, pada }
}

// Calculate planetary positions using simplified astronomical formulas
// Note: For production, use Swiss Ephemeris or similar for accuracy
export function calculatePlanetaryPositions(julianDay: number): Record<string, number> {
  const T = (julianDay - 2451545.0) / 36525 // Julian centuries from J2000.0
  
  // Simplified mean longitude calculations
  // These are approximations - use ephemeris for precise calculations
  const positions: Record<string, number> = {}
  
  // Sun
  const sunL = (280.4664567 + 360007.6982779 * T) % 360
  positions.Sun = sunL < 0 ? sunL + 360 : sunL
  
  // Moon (simplified)
  const moonL = (218.3164477 + 481267.88123421 * T) % 360
  positions.Moon = moonL < 0 ? moonL + 360 : moonL
  
  // Mercury
  const mercuryL = (252.250906 + 149474.0722491 * T) % 360
  positions.Mercury = mercuryL < 0 ? mercuryL + 360 : mercuryL
  
  // Venus
  const venusL = (181.979801 + 58517.8156760 * T) % 360
  positions.Venus = venusL < 0 ? venusL + 360 : venusL
  
  // Mars
  const marsL = (355.433275 + 19141.6964746 * T) % 360
  positions.Mars = marsL < 0 ? marsL + 360 : marsL
  
  // Jupiter
  const jupiterL = (34.351484 + 3036.3027889 * T) % 360
  positions.Jupiter = jupiterL < 0 ? jupiterL + 360 : jupiterL
  
  // Saturn
  const saturnL = (50.077471 + 1223.5110141 * T) % 360
  positions.Saturn = saturnL < 0 ? saturnL + 360 : saturnL
  
  // Rahu (Mean North Node)
  const rahuL = (125.0445479 - 1934.1362891 * T) % 360
  positions.Rahu = rahuL < 0 ? rahuL + 360 : rahuL
  
  // Ketu (opposite to Rahu)
  positions.Ketu = (positions.Rahu + 180) % 360
  
  return positions
}

// Calculate Ascendant (Lagna)
export function calculateAscendant(
  julianDay: number,
  latitude: number,
  longitude: number,
  ayanamsa: number
): number {
  // Local Sidereal Time calculation
  const T = (julianDay - 2451545.0) / 36525
  let LST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) +
            0.000387933 * T * T - T * T * T / 38710000
  LST = (LST + longitude) % 360
  if (LST < 0) LST += 360
  
  // Convert to radians
  const latRad = latitude * Math.PI / 180
  const obliquity = 23.4393 - 0.013 * T
  const oblRad = obliquity * Math.PI / 180
  const lstRad = LST * Math.PI / 180
  
  // Ascendant formula
  const tanAsc = Math.cos(lstRad) / (-(Math.sin(oblRad) * Math.tan(latRad)) + Math.cos(oblRad) * Math.sin(lstRad))
  let asc = Math.atan(tanAsc) * 180 / Math.PI
  
  // Adjust quadrant
  if (Math.cos(lstRad) < 0) {
    asc += 180
  } else if (Math.sin(lstRad) < 0) {
    asc += 360
  }
  
  // Apply ayanamsa for sidereal ascendant
  asc = tropicalToSidereal(asc, ayanamsa)
  
  return asc
}

// Calculate house cusps (Equal House System)
export function calculateHouses(ascendant: number): number[] {
  const houses: number[] = []
  for (let i = 0; i < 12; i++) {
    houses.push((ascendant + i * 30) % 360)
  }
  return houses
}

// Determine which house a planet is in
export function getPlanetHouse(planetLongitude: number, ascendant: number): number {
  let diff = planetLongitude - ascendant
  if (diff < 0) diff += 360
  return Math.floor(diff / 30) + 1
}

// Calculate Dasha balance at birth
export function calculateDashaBalance(moonLongitude: number, birthDate: Date): {
  currentDasha: string
  balance: number
  startDate: Date
} {
  const { nakshatra } = getNakshatra(moonLongitude)
  const nakshatraRuler = NAKSHATRAS[nakshatra].ruler
  
  // Position within nakshatra
  const nakshatraStart = nakshatra * (360 / 27)
  const positionInNakshatra = moonLongitude - nakshatraStart
  const proportionElapsed = positionInNakshatra / (360 / 27)
  
  // Get Dasha years for the ruler
  const dashaYears = DASHA_YEARS[nakshatraRuler as keyof typeof DASHA_YEARS]
  const yearsRemaining = dashaYears * (1 - proportionElapsed)
  
  // Calculate start date (birth date minus elapsed portion)
  const yearsElapsed = dashaYears * proportionElapsed
  const startDate = new Date(birthDate)
  startDate.setFullYear(startDate.getFullYear() - yearsElapsed)
  
  return {
    currentDasha: nakshatraRuler,
    balance: yearsRemaining,
    startDate,
  }
}

// Generate complete Dasha timeline
export function generateDashaTimeline(
  moonLongitude: number,
  birthDate: Date,
  years: number = 120
): Array<{
  planet: string
  startDate: Date
  endDate: Date
  years: number
}> {
  const timeline: Array<{ planet: string; startDate: Date; endDate: Date; years: number }> = []
  const { currentDasha, balance, startDate } = calculateDashaBalance(moonLongitude, birthDate)
  
  // Find starting index in sequence
  let currentIndex = DASHA_SEQUENCE.indexOf(currentDasha)
  let currentDate = new Date(startDate)
  
  // First Dasha (may be partial)
  const firstEndDate = new Date(birthDate)
  firstEndDate.setFullYear(firstEndDate.getFullYear() + balance)
  timeline.push({
    planet: currentDasha,
    startDate: new Date(birthDate),
    endDate: firstEndDate,
    years: balance,
  })
  currentDate = firstEndDate
  currentIndex = (currentIndex + 1) % 9
  
  // Remaining Dashas
  const endDate = new Date(birthDate)
  endDate.setFullYear(endDate.getFullYear() + years)
  
  while (currentDate < endDate) {
    const planet = DASHA_SEQUENCE[currentIndex]
    const dashaYears = DASHA_YEARS[planet as keyof typeof DASHA_YEARS]
    const dashaEnd = new Date(currentDate)
    dashaEnd.setFullYear(dashaEnd.getFullYear() + dashaYears)
    
    timeline.push({
      planet,
      startDate: new Date(currentDate),
      endDate: dashaEnd,
      years: dashaYears,
    })
    
    currentDate = dashaEnd
    currentIndex = (currentIndex + 1) % 9
  }
  
  return timeline
}

// Check for common Yogas
export function checkYogas(
  positions: Record<string, number>,
  ascendant: number
): Array<{ name: string; description: string; strength: "strong" | "medium" | "weak" }> {
  const yogas: Array<{ name: string; description: string; strength: "strong" | "medium" | "weak" }> = []
  
  // Get houses for each planet
  const houses: Record<string, number> = {}
  for (const [planet, longitude] of Object.entries(positions)) {
    houses[planet] = getPlanetHouse(longitude, ascendant)
  }
  
  // Raj Yoga - Lord of Trine in Kendra or vice versa
  const kendras = [1, 4, 7, 10]
  const trines = [1, 5, 9]
  
  if (kendras.includes(houses.Jupiter) && trines.includes(houses.Moon)) {
    yogas.push({
      name: "Gajakesari Yoga",
      description: "Jupiter and Moon in mutual kendras brings wisdom, fame, and prosperity",
      strength: "strong",
    })
  }
  
  // Budhaditya Yoga - Sun and Mercury conjunction
  const sunSign = Math.floor(positions.Sun / 30)
  const mercurySign = Math.floor(positions.Mercury / 30)
  if (sunSign === mercurySign) {
    yogas.push({
      name: "Budhaditya Yoga",
      description: "Sun-Mercury conjunction enhances intelligence and communication skills",
      strength: "medium",
    })
  }
  
  // Hamsa Yoga - Jupiter in Kendra in own or exalted sign
  if (kendras.includes(houses.Jupiter)) {
    const jupiterSign = Math.floor(positions.Jupiter / 30)
    if (jupiterSign === 8 || jupiterSign === 11 || jupiterSign === 3) { // Sagittarius, Pisces, Cancer
      yogas.push({
        name: "Hamsa Yoga",
        description: "Jupiter in Kendra in own/exalted sign brings spiritual wisdom and good fortune",
        strength: "strong",
      })
    }
  }
  
  // Malavya Yoga - Venus in Kendra in own or exalted sign
  if (kendras.includes(houses.Venus)) {
    const venusSign = Math.floor(positions.Venus / 30)
    if (venusSign === 1 || venusSign === 6 || venusSign === 11) { // Taurus, Libra, Pisces
      yogas.push({
        name: "Malavya Yoga",
        description: "Venus in Kendra in own/exalted sign brings luxury, beauty, and artistic talent",
        strength: "strong",
      })
    }
  }
  
  // Dhana Yoga - Lords of 2nd and 11th in good positions
  if (houses.Jupiter === 2 || houses.Jupiter === 11) {
    yogas.push({
      name: "Dhana Yoga",
      description: "Benefic in wealth houses indicates good financial fortune",
      strength: "medium",
    })
  }
  
  return yogas
}

// Check for Doshas
export function checkDoshas(
  positions: Record<string, number>,
  ascendant: number
): Array<{ name: string; description: string; severity: "high" | "medium" | "low"; remedies: string[] }> {
  const doshas: Array<{ name: string; description: string; severity: "high" | "medium" | "low"; remedies: string[] }> = []
  
  const houses: Record<string, number> = {}
  for (const [planet, longitude] of Object.entries(positions)) {
    houses[planet] = getPlanetHouse(longitude, ascendant)
  }
  
  // Mangal Dosha - Mars in 1, 2, 4, 7, 8, or 12
  const mangalDoshaHouses = [1, 2, 4, 7, 8, 12]
  if (mangalDoshaHouses.includes(houses.Mars)) {
    const severity = [7, 8].includes(houses.Mars) ? "high" : "medium"
    doshas.push({
      name: "Mangal Dosha",
      description: `Mars in ${houses.Mars}th house may affect marriage and relationships`,
      severity,
      remedies: [
        "Recite Hanuman Chalisa daily",
        "Wear coral gemstone after consultation",
        "Fast on Tuesdays",
        "Donate red items on Tuesdays",
        "Marriage with another Manglik person nullifies the dosha",
      ],
    })
  }
  
  // Kaal Sarp Dosha - All planets between Rahu and Ketu
  const rahuPos = positions.Rahu
  const ketuPos = positions.Ketu
  let allBetween = true
  for (const [planet, pos] of Object.entries(positions)) {
    if (planet !== "Rahu" && planet !== "Ketu") {
      // Check if planet is between Rahu and Ketu
      if (rahuPos < ketuPos) {
        if (!(pos > rahuPos && pos < ketuPos)) {
          allBetween = false
          break
        }
      } else {
        if (!(pos > rahuPos || pos < ketuPos)) {
          allBetween = false
          break
        }
      }
    }
  }
  
  if (allBetween) {
    doshas.push({
      name: "Kaal Sarp Dosha",
      description: "All planets hemmed between Rahu and Ketu may cause struggles and delays",
      severity: "high",
      remedies: [
        "Perform Kaal Sarp Dosha puja at Trimbakeshwar",
        "Recite Rahu mantra 18000 times",
        "Keep fast on Nag Panchami",
        "Donate to orphanages",
        "Wear Hessonite (Gomed) after consultation",
      ],
    })
  }
  
  // Pitra Dosha - Sun afflicted by Rahu/Ketu
  const sunSign = Math.floor(positions.Sun / 30)
  const rahuSign = Math.floor(positions.Rahu / 30)
  const ketuSign = Math.floor(positions.Ketu / 30)
  if (sunSign === rahuSign || sunSign === ketuSign) {
    doshas.push({
      name: "Pitra Dosha",
      description: "Sun afflicted by nodes indicates ancestral karmic debts",
      severity: "medium",
      remedies: [
        "Perform Shraddh rituals for ancestors",
        "Feed crows and cows on Saturdays",
        "Donate food on Amavasya",
        "Recite Pitra Suktam",
        "Plant Peepal tree and nurture it",
      ],
    })
  }
  
  return doshas
}

// Main function to generate complete Kundli
export interface KundliData {
  birthDetails: {
    name: string
    date: Date
    time: string
    place: string
    latitude: number
    longitude: number
    timezone: number
  }
  ascendant: {
    longitude: number
    sign: number
    signName: string
    degrees: number
    minutes: number
    nakshatra: string
    pada: number
  }
  planets: Array<{
    name: string
    sanskrit: string
    longitude: number
    sign: number
    signName: string
    degrees: number
    minutes: number
    nakshatra: string
    pada: number
    house: number
    isRetrograde: boolean
  }>
  houses: number[]
  yogas: Array<{ name: string; description: string; strength: "strong" | "medium" | "weak" }>
  doshas: Array<{ name: string; description: string; severity: "high" | "medium" | "low"; remedies: string[] }>
  dashas: Array<{ planet: string; startDate: Date; endDate: Date; years: number }>
  moonSign: { name: string; english: string }
  sunSign: { name: string; english: string }
}

export function generateKundli(
  name: string,
  birthDate: Date,
  birthTime: string,
  place: string,
  latitude: number,
  longitude: number,
  timezone: number
): KundliData {
  // Parse birth time
  const [hours, minutes] = birthTime.split(":").map(Number)
  const localDate = new Date(birthDate)
  localDate.setHours(hours, minutes, 0, 0)
  
  // Convert to UTC
  const utcDate = new Date(localDate.getTime() - timezone * 60 * 60 * 1000)
  
  // Calculate Julian Day
  const jd = dateToJulianDay(utcDate)
  
  // Calculate Ayanamsa
  const ayanamsa = calculateAyanamsa(jd)
  
  // Calculate tropical planetary positions and convert to sidereal
  const tropicalPositions = calculatePlanetaryPositions(jd)
  const siderealPositions: Record<string, number> = {}
  for (const [planet, position] of Object.entries(tropicalPositions)) {
    siderealPositions[planet] = tropicalToSidereal(position, ayanamsa)
  }
  
  // Calculate Ascendant
  const ascLongitude = calculateAscendant(jd, latitude, longitude, ayanamsa)
  const ascData = getZodiacSign(ascLongitude)
  const ascNakshatra = getNakshatra(ascLongitude)
  
  // Calculate houses
  const houseCusps = calculateHouses(ascLongitude)
  
  // Build planet data
  const planetData = PLANETS.map((planet) => {
    const longitude = siderealPositions[planet.name]
    const signData = getZodiacSign(longitude)
    const nakshatraData = getNakshatra(longitude)
    const house = getPlanetHouse(longitude, ascLongitude)
    
    return {
      name: planet.name,
      sanskrit: planet.sanskrit,
      longitude,
      sign: signData.sign,
      signName: RASHIS[signData.sign].name,
      degrees: signData.degrees,
      minutes: signData.minutes,
      nakshatra: NAKSHATRAS[nakshatraData.nakshatra].name,
      pada: nakshatraData.pada,
      house,
      isRetrograde: false, // Simplified - would need more calculation
    }
  })
  
  // Check yogas and doshas
  const yogas = checkYogas(siderealPositions, ascLongitude)
  const doshas = checkDoshas(siderealPositions, ascLongitude)
  
  // Generate Dasha timeline
  const dashas = generateDashaTimeline(siderealPositions.Moon, birthDate)
  
  // Get Moon and Sun signs
  const moonSignIndex = Math.floor(siderealPositions.Moon / 30)
  const sunSignIndex = Math.floor(siderealPositions.Sun / 30)
  
  return {
    birthDetails: {
      name,
      date: birthDate,
      time: birthTime,
      place,
      latitude,
      longitude,
      timezone,
    },
    ascendant: {
      longitude: ascLongitude,
      sign: ascData.sign,
      signName: RASHIS[ascData.sign].name,
      degrees: ascData.degrees,
      minutes: ascData.minutes,
      nakshatra: NAKSHATRAS[ascNakshatra.nakshatra].name,
      pada: ascNakshatra.pada,
    },
    planets: planetData,
    houses: houseCusps,
    yogas,
    doshas,
    dashas: dashas.slice(0, 10), // First 10 major dashas
    moonSign: {
      name: RASHIS[moonSignIndex].name,
      english: RASHIS[moonSignIndex].english,
    },
    sunSign: {
      name: RASHIS[sunSignIndex].name,
      english: RASHIS[sunSignIndex].english,
    },
  }
}
