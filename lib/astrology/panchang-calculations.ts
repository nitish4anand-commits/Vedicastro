// Panchang Calculation Engine
// Calculates Tithi, Nakshatra, Yoga, Karana, and Muhurtas

import { getJulianDay, calculatePreciseAyanamsa } from './precise-calculations'

// Constants
const SYNODIC_MONTH = 29.530588853 // Synodic month in days
const TITHI_LENGTH = SYNODIC_MONTH / 30 // ~0.9844 days per tithi

// Tithi names
export const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
]

// Tithi deities
export const TITHI_DEITIES: { [key: string]: string } = {
  'Pratipada': 'Agni',
  'Dwitiya': 'Brahma',
  'Tritiya': 'Gauri',
  'Chaturthi': 'Ganesha',
  'Panchami': 'Nagas',
  'Shashthi': 'Kartikeya',
  'Saptami': 'Surya',
  'Ashtami': 'Shiva',
  'Navami': 'Durga',
  'Dashami': 'Yama',
  'Ekadashi': 'Vishnu',
  'Dwadashi': 'Vishnu',
  'Trayodashi': 'Kamadeva',
  'Chaturdashi': 'Shiva',
  'Purnima/Amavasya': 'Moon/Pitru'
}

// Nakshatra lords and deities
export const NAKSHATRA_DATA = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitrus' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan' }
]

// Yoga names (27 yogas)
export const YOGAS = [
  'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
]

// Yoga quality
export const YOGA_QUALITY: { [key: string]: string } = {
  'Vishkumbha': 'Inauspicious',
  'Preeti': 'Auspicious',
  'Ayushman': 'Very Auspicious',
  'Saubhagya': 'Auspicious',
  'Shobhana': 'Auspicious',
  'Atiganda': 'Inauspicious',
  'Sukarma': 'Very Auspicious',
  'Dhriti': 'Auspicious',
  'Shoola': 'Inauspicious',
  'Ganda': 'Inauspicious',
  'Vriddhi': 'Auspicious',
  'Dhruva': 'Auspicious',
  'Vyaghata': 'Inauspicious',
  'Harshana': 'Auspicious',
  'Vajra': 'Mixed',
  'Siddhi': 'Very Auspicious',
  'Vyatipata': 'Inauspicious',
  'Variyan': 'Auspicious',
  'Parigha': 'Inauspicious',
  'Shiva': 'Auspicious',
  'Siddha': 'Very Auspicious',
  'Sadhya': 'Auspicious',
  'Shubha': 'Very Auspicious',
  'Shukla': 'Auspicious',
  'Brahma': 'Very Auspicious',
  'Indra': 'Auspicious',
  'Vaidhriti': 'Inauspicious'
}

// Karana names (11 karanas - 4 fixed + 7 repeating)
export const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Nagava', 'Kimstughna'
]

// Weekday data
export const WEEKDAYS = [
  { name: 'Sunday (Ravivar)', lord: 'Sun', color: 'Red/Orange' },
  { name: 'Monday (Somvar)', lord: 'Moon', color: 'White' },
  { name: 'Tuesday (Mangalvar)', lord: 'Mars', color: 'Red' },
  { name: 'Wednesday (Budhvar)', lord: 'Mercury', color: 'Green' },
  { name: 'Thursday (Guruvar)', lord: 'Jupiter', color: 'Yellow' },
  { name: 'Friday (Shukravar)', lord: 'Venus', color: 'White' },
  { name: 'Saturday (Shanivar)', lord: 'Saturn', color: 'Black/Blue' }
]

// Calculate Sun's longitude using Meeus algorithm
function calculateSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  
  // Mean anomaly of Sun
  const M = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T) % 360
  const Mrad = M * Math.PI / 180
  
  // Equation of center
  const C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.00029 * Math.sin(3 * Mrad)
  
  // Sun's geometric longitude
  const L0 = (280.46645 + 36000.76983 * T + 0.0003032 * T * T) % 360
  
  // Sun's true longitude
  let sunLon = (L0 + C) % 360
  if (sunLon < 0) sunLon += 360
  
  return sunLon
}

// Calculate Moon's longitude using Meeus algorithm
function calculateMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  
  // Mean longitude of Moon
  const Lp = (218.3164591 + 481267.88134236 * T - 0.0015786 * T * T + 
              T * T * T / 538841 - T * T * T * T / 65194000) % 360
  
  // Mean anomaly of Moon
  const M = (134.9634114 + 477198.8676313 * T + 0.0089970 * T * T + 
             T * T * T / 69699 - T * T * T * T / 14712000) % 360
  const Mrad = M * Math.PI / 180
  
  // Mean anomaly of Sun
  const Ms = (357.5291092 + 35999.0502909 * T) % 360
  const Msrad = Ms * Math.PI / 180
  
  // Argument of latitude
  const F = (93.2720993 + 483202.0175273 * T - 0.0034029 * T * T) % 360
  const Frad = F * Math.PI / 180
  
  // Mean elongation
  const D = (297.8502042 + 445267.1115168 * T - 0.0016300 * T * T) % 360
  const Drad = D * Math.PI / 180
  
  // Principal terms for longitude
  let moonLon = Lp + 
    6.288750 * Math.sin(Mrad) +
    1.274018 * Math.sin(2 * Drad - Mrad) +
    0.658309 * Math.sin(2 * Drad) +
    0.213616 * Math.sin(2 * Mrad) -
    0.185596 * Math.sin(Msrad) -
    0.114336 * Math.sin(2 * Frad) +
    0.058793 * Math.sin(2 * Drad - 2 * Mrad) +
    0.057212 * Math.sin(2 * Drad - Msrad - Mrad) +
    0.053320 * Math.sin(2 * Drad + Mrad) +
    0.045874 * Math.sin(2 * Drad - Msrad)
  
  moonLon = moonLon % 360
  if (moonLon < 0) moonLon += 360
  
  return moonLon
}

// Calculate Tithi
export function calculateTithi(jd: number, ayanamsa: number): {
  name: string
  paksha: 'Shukla' | 'Krishna'
  index: number
  percentage: number
  endTime: string
  deity: string
} {
  const sunLon = calculateSunLongitude(jd) - ayanamsa
  const moonLon = calculateMoonLongitude(jd) - ayanamsa
  
  // Tithi = (Moon - Sun) / 12
  let diff = moonLon - sunLon
  if (diff < 0) diff += 360
  
  const tithiNumber = Math.floor(diff / 12) + 1
  const tithiIndex = (tithiNumber - 1) % 15
  const paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna'
  
  // Calculate percentage completed
  const tithiStart = (tithiNumber - 1) * 12
  const percentage = Math.round(((diff - tithiStart) / 12) * 100)
  
  // Estimate end time (rough approximation)
  const remainingDegrees = 12 - (diff - tithiStart)
  const hoursRemaining = (remainingDegrees / 12) * 24
  const endDate = new Date(Date.now() + hoursRemaining * 3600000)
  const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  const name = tithiIndex === 14 
    ? (paksha === 'Shukla' ? 'Purnima' : 'Amavasya')
    : TITHIS[tithiIndex]
  
  return {
    name,
    paksha,
    index: tithiNumber,
    percentage,
    endTime,
    deity: TITHI_DEITIES[TITHIS[tithiIndex]] || 'Various'
  }
}

// Calculate Nakshatra of Moon
export function calculateNakshatra(jd: number, ayanamsa: number): {
  name: string
  lord: string
  deity: string
  pada: number
  index: number
  endTime: string
} {
  const moonLon = calculateMoonLongitude(jd) - ayanamsa
  let normalizedLon = moonLon % 360
  if (normalizedLon < 0) normalizedLon += 360
  
  const nakshatraIndex = Math.floor(normalizedLon / (360 / 27))
  const nakshatra = NAKSHATRA_DATA[nakshatraIndex]
  
  // Calculate pada (1-4)
  const padaSize = (360 / 27) / 4
  const withinNakshatra = normalizedLon % (360 / 27)
  const pada = Math.floor(withinNakshatra / padaSize) + 1
  
  // Estimate end time
  const nakshatraLength = 360 / 27
  const remainingDegrees = nakshatraLength - withinNakshatra
  const hoursRemaining = (remainingDegrees / 360) * 27.3 * 24
  const endDate = new Date(Date.now() + hoursRemaining * 3600000)
  const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  return {
    name: nakshatra.name,
    lord: nakshatra.lord,
    deity: nakshatra.deity,
    pada,
    index: nakshatraIndex,
    endTime
  }
}

// Calculate Yoga (Sun + Moon longitude / (360/27))
export function calculateYoga(jd: number, ayanamsa: number): {
  name: string
  quality: string
  index: number
  endTime: string
} {
  const sunLon = calculateSunLongitude(jd) - ayanamsa
  const moonLon = calculateMoonLongitude(jd) - ayanamsa
  
  let sum = sunLon + moonLon
  if (sum >= 360) sum -= 360
  if (sum < 0) sum += 360
  
  const yogaIndex = Math.floor(sum / (360 / 27))
  const yogaName = YOGAS[yogaIndex]
  
  // Estimate end time
  const yogaLength = 360 / 27
  const withinYoga = sum % yogaLength
  const remainingDegrees = yogaLength - withinYoga
  const hoursRemaining = (remainingDegrees / 360) * 24 * 1.5
  const endDate = new Date(Date.now() + hoursRemaining * 3600000)
  const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  return {
    name: yogaName,
    quality: YOGA_QUALITY[yogaName],
    index: yogaIndex,
    endTime
  }
}

// Calculate Karana (half tithi)
export function calculateKarana(jd: number, ayanamsa: number): {
  name: string
  index: number
  endTime: string
} {
  const sunLon = calculateSunLongitude(jd) - ayanamsa
  const moonLon = calculateMoonLongitude(jd) - ayanamsa
  
  let diff = moonLon - sunLon
  if (diff < 0) diff += 360
  
  const karanaNumber = Math.floor(diff / 6) + 1
  
  // Fixed karanas: Shakuni (57), Chatushpada (58), Nagava (59), Kimstughna (60)
  // and Kimstughna at position 1
  let karanaName: string
  if (karanaNumber === 1) {
    karanaName = 'Kimstughna'
  } else if (karanaNumber >= 57) {
    karanaName = KARANAS[karanaNumber - 50]
  } else {
    karanaName = KARANAS[(karanaNumber - 2) % 7]
  }
  
  // Estimate end time
  const remainingDegrees = 6 - (diff % 6)
  const hoursRemaining = (remainingDegrees / 12) * 24
  const endDate = new Date(Date.now() + hoursRemaining * 3600000)
  const endTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  return {
    name: karanaName,
    index: karanaNumber,
    endTime
  }
}

// Calculate sunrise and sunset using NOAA algorithm
export function calculateSunTimes(date: Date, lat: number, lng: number): {
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
} {
  const jd = getJulianDay(date, 0)
  const n = jd - 2451545.0 + 0.0008
  const Jstar = n - lng / 360
  const M = (357.5291 + 0.98560028 * Jstar) % 360
  const Mrad = M * Math.PI / 180
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad)
  const lambda = (M + C + 180 + 102.9372) % 360
  const lambdaRad = lambda * Math.PI / 180
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad)
  
  const sinDec = Math.sin(lambdaRad) * Math.sin(23.44 * Math.PI / 180)
  const cosDec = Math.cos(Math.asin(sinDec))
  const latRad = lat * Math.PI / 180
  
  const cosHa = (Math.sin(-0.83 * Math.PI / 180) - Math.sin(latRad) * sinDec) / (Math.cos(latRad) * cosDec)
  
  if (cosHa < -1 || cosHa > 1) {
    return { sunrise: 'N/A', sunset: 'N/A', moonrise: 'N/A', moonset: 'N/A' }
  }
  
  const Ha = Math.acos(cosHa) * 180 / Math.PI
  
  const Jrise = Jtransit - Ha / 360
  const Jset = Jtransit + Ha / 360
  
  const riseDate = new Date((Jrise - 2440587.5) * 86400000)
  const setDate = new Date((Jset - 2440587.5) * 86400000)
  
  // Approximate moonrise/moonset (simplified)
  const moonPhase = ((jd - 2451550.1) % SYNODIC_MONTH) / SYNODIC_MONTH
  const moonriseOffset = moonPhase * 24 * 50 / 60 // Moon rises ~50 min later each day
  const moonriseDate = new Date(riseDate.getTime() + moonriseOffset * 3600000)
  const moonsetDate = new Date(setDate.getTime() + moonriseOffset * 3600000)
  
  return {
    sunrise: riseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    sunset: setDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    moonrise: moonriseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    moonset: moonsetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
}

// Calculate Rahu Kaal, Yamaghanta, Gulika
export function calculateInauspiciousPeriods(date: Date, sunrise: string, sunset: string): {
  rahuKaal: { start: string; end: string }
  yamaghanta: { start: string; end: string }
  gulikaKaal: { start: string; end: string }
  varjyam: { start: string; end: string }
} {
  const day = date.getDay()
  
  // Parse sunrise/sunset times
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return 6 * 60
    let hours = parseInt(match[1])
    const mins = parseInt(match[2])
    if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12
    if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0
    return hours * 60 + mins
  }
  
  const formatTime = (mins: number): string => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  const sunriseMins = parseTime(sunrise)
  const sunsetMins = parseTime(sunset)
  const dayLength = sunsetMins - sunriseMins
  const eighthPart = dayLength / 8
  
  // Rahu Kaal order: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
  const rahuOrder = [8, 2, 7, 5, 6, 4, 3]
  const rahuStart = sunriseMins + (rahuOrder[day] - 1) * eighthPart
  
  // Yamaghanta order: Sun=5, Mon=4, Tue=3, Wed=2, Thu=1, Fri=7, Sat=6
  const yamaOrder = [5, 4, 3, 2, 1, 7, 6]
  const yamaStart = sunriseMins + (yamaOrder[day] - 1) * eighthPart
  
  // Gulika order: Sun=7, Mon=6, Tue=5, Wed=4, Thu=3, Fri=2, Sat=1
  const gulikaOrder = [7, 6, 5, 4, 3, 2, 1]
  const gulikaStart = sunriseMins + (gulikaOrder[day] - 1) * eighthPart
  
  // Varjyam (simplified - evening period)
  const varjyamStart = sunsetMins + 90
  
  return {
    rahuKaal: { 
      start: formatTime(rahuStart), 
      end: formatTime(rahuStart + eighthPart) 
    },
    yamaghanta: { 
      start: formatTime(yamaStart), 
      end: formatTime(yamaStart + eighthPart) 
    },
    gulikaKaal: { 
      start: formatTime(gulikaStart), 
      end: formatTime(gulikaStart + eighthPart) 
    },
    varjyam: { 
      start: formatTime(varjyamStart), 
      end: formatTime(varjyamStart + 90) 
    }
  }
}

// Calculate Abhijit and other auspicious muhurtas
export function calculateAuspiciousMuhurtas(sunrise: string, sunset: string): {
  abhijitMuhurta: { start: string; end: string }
  amritKaal: { start: string; end: string }
  brahmaMuhurta: { start: string; end: string }
} {
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return 6 * 60
    let hours = parseInt(match[1])
    const mins = parseInt(match[2])
    if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12
    if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0
    return hours * 60 + mins
  }
  
  const formatTime = (mins: number): string => {
    const hours = Math.floor(mins / 60) % 24
    const minutes = mins % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  const sunriseMins = parseTime(sunrise)
  const sunsetMins = parseTime(sunset)
  const midday = (sunriseMins + sunsetMins) / 2
  const muhurtaLength = (sunsetMins - sunriseMins) / 15 // 15 muhurtas in a day
  
  // Abhijit Muhurta - 8th muhurta around midday
  const abhijitStart = midday - muhurtaLength / 2
  
  // Brahma Muhurta - 1.5 hours before sunrise
  const brahmaMuhurtaStart = sunriseMins - 96 // 1 hour 36 mins before sunrise
  
  // Amrit Kaal - varies, usually early morning
  const amritStart = sunriseMins - 48
  
  return {
    abhijitMuhurta: {
      start: formatTime(abhijitStart),
      end: formatTime(abhijitStart + muhurtaLength)
    },
    amritKaal: {
      start: formatTime(amritStart),
      end: formatTime(amritStart + 96)
    },
    brahmaMuhurta: {
      start: formatTime(brahmaMuhurtaStart),
      end: formatTime(brahmaMuhurtaStart + 48)
    }
  }
}

// Calculate Choghadiya
export function calculateChoghadiya(sunrise: string, sunset: string, day: number): Array<{
  name: string
  time: string
  quality: 'excellent' | 'good' | 'neutral' | 'bad'
}> {
  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return 6 * 60
    let hours = parseInt(match[1])
    const mins = parseInt(match[2])
    if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12
    if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0
    return hours * 60 + mins
  }
  
  const formatTime = (mins: number): string => {
    const hours = Math.floor(mins / 60) % 24
    const minutes = mins % 60
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  const sunriseMins = parseTime(sunrise)
  const sunsetMins = parseTime(sunset)
  const dayLength = sunsetMins - sunriseMins
  const choghadiyaLength = dayLength / 8
  
  // Choghadiya sequence varies by day
  const daySequences: { [key: number]: string[] } = {
    0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sunday
    1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'], // Monday
    2: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'], // Tuesday
    3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'], // Wednesday
    4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Thursday
    5: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'], // Friday
    6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']  // Saturday
  }
  
  const qualities: { [key: string]: 'excellent' | 'good' | 'neutral' | 'bad' } = {
    'Amrit': 'excellent',
    'Shubh': 'good',
    'Labh': 'good',
    'Char': 'neutral',
    'Rog': 'bad',
    'Kaal': 'bad',
    'Udveg': 'bad'
  }
  
  const sequence = daySequences[day]
  
  return sequence.map((name, i) => ({
    name,
    time: `${formatTime(sunriseMins + i * choghadiyaLength)} - ${formatTime(sunriseMins + (i + 1) * choghadiyaLength)}`,
    quality: qualities[name]
  }))
}

// Calculate Hindu date (Vikram Samvat)
export function calculateHinduDate(date: Date, jd: number, ayanamsa: number): {
  gregorian: string
  hindu: string
  vikramSamvat: number
  shakaSamvat: number
} {
  const tithi = calculateTithi(jd, ayanamsa)
  const moonLon = calculateMoonLongitude(jd) - ayanamsa
  let normalizedLon = moonLon % 360
  if (normalizedLon < 0) normalizedLon += 360
  
  // Hindu months based on Sun's position
  const sunLon = calculateSunLongitude(jd) - ayanamsa
  let sunSign = Math.floor(((sunLon % 360) + 360) % 360 / 30)
  
  const months = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
    'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
  ]
  
  // Approximate month calculation
  const monthIndex = (sunSign + 9) % 12
  const monthName = months[monthIndex]
  
  // Vikram Samvat = Gregorian year + 57 (approximately)
  const vikramSamvat = date.getFullYear() + 57
  const shakaSamvat = date.getFullYear() - 78
  
  return {
    gregorian: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    hindu: `${monthName} ${tithi.paksha} Paksha ${tithi.name}`,
    vikramSamvat,
    shakaSamvat
  }
}

// Main function to get complete Panchang
export function calculateCompletePanchang(date: Date, lat: number, lng: number, timezone: number) {
  const jd = getJulianDay(date, timezone)
  const ayanamsa = calculatePreciseAyanamsa(jd)
  
  const sunTimes = calculateSunTimes(date, lat, lng)
  const tithi = calculateTithi(jd, ayanamsa)
  const nakshatra = calculateNakshatra(jd, ayanamsa)
  const yoga = calculateYoga(jd, ayanamsa)
  const karana = calculateKarana(jd, ayanamsa)
  const hinduDate = calculateHinduDate(date, jd, ayanamsa)
  const weekday = WEEKDAYS[date.getDay()]
  const inauspicious = calculateInauspiciousPeriods(date, sunTimes.sunrise, sunTimes.sunset)
  const auspicious = calculateAuspiciousMuhurtas(sunTimes.sunrise, sunTimes.sunset)
  const choghadiya = calculateChoghadiya(sunTimes.sunrise, sunTimes.sunset, date.getDay())
  
  return {
    date: hinduDate,
    tithi,
    nakshatra,
    yoga,
    karana,
    var: weekday,
    timings: sunTimes,
    auspicious: [
      { name: 'Abhijit Muhurta', time: `${auspicious.abhijitMuhurta.start} - ${auspicious.abhijitMuhurta.end}` },
      { name: 'Amrit Kaal', time: `${auspicious.amritKaal.start} - ${auspicious.amritKaal.end}` },
      { name: 'Brahma Muhurta', time: `${auspicious.brahmaMuhurta.start} - ${auspicious.brahmaMuhurta.end}` }
    ],
    inauspicious: [
      { name: 'Rahu Kaal', time: `${inauspicious.rahuKaal.start} - ${inauspicious.rahuKaal.end}` },
      { name: 'Yamaghanta', time: `${inauspicious.yamaghanta.start} - ${inauspicious.yamaghanta.end}` },
      { name: 'Gulika Kaal', time: `${inauspicious.gulikaKaal.start} - ${inauspicious.gulikaKaal.end}` },
      { name: 'Varjyam', time: `${inauspicious.varjyam.start} - ${inauspicious.varjyam.end}` }
    ],
    choghadiya
  }
}
