// Current Transit Calculations
// Real-time planetary positions and transit effects

import { getJulianDay, calculatePreciseAyanamsa } from './precise-calculations'

// Planet symbols and colors
export const PLANET_INFO = {
  Sun: { symbol: '☉', color: '#FF6B35', glyph: 'Su' },
  Moon: { symbol: '☽', color: '#C0C0C0', glyph: 'Mo' },
  Mars: { symbol: '♂', color: '#DC2626', glyph: 'Ma' },
  Mercury: { symbol: '☿', color: '#22C55E', glyph: 'Me' },
  Jupiter: { symbol: '♃', color: '#EAB308', glyph: 'Ju' },
  Venus: { symbol: '♀', color: '#EC4899', glyph: 'Ve' },
  Saturn: { symbol: '♄', color: '#6B7280', glyph: 'Sa' },
  Rahu: { symbol: '☊', color: '#8B5CF6', glyph: 'Ra' },
  Ketu: { symbol: '☋', color: '#A855F7', glyph: 'Ke' }
}

// Zodiac signs
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

// Sanskrit names for signs
const SIGN_SANSKRIT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
]

// Mean daily motion of planets (degrees per day)
const DAILY_MOTION = {
  Sun: 0.9856,
  Moon: 13.176,
  Mars: 0.524,
  Mercury: 1.383, // average, can be retrograde
  Jupiter: 0.083,
  Venus: 1.2,
  Saturn: 0.034,
  Rahu: -0.053, // always retrograde
  Ketu: -0.053
}

// Orbital periods for transit duration
const TRANSIT_DURATION = {
  Sun: '30 days',
  Moon: '2.25 days',
  Mars: '45 days',
  Mercury: '25 days',
  Jupiter: '1 year',
  Venus: '30 days',
  Saturn: '2.5 years',
  Rahu: '1.5 years',
  Ketu: '1.5 years'
}

// Calculate Sun's position
function calculateSunPosition(jd: number, ayanamsa: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  const L0 = (280.46645 + 36000.76983 * T) % 360
  const M = (357.5291092 + 35999.0502909 * T) % 360
  const Mrad = M * Math.PI / 180
  const C = (1.9146 - 0.004817 * T) * Math.sin(Mrad) + 
            0.019993 * Math.sin(2 * Mrad) + 
            0.00029 * Math.sin(3 * Mrad)
  
  let sunLon = (L0 + C - ayanamsa) % 360
  if (sunLon < 0) sunLon += 360
  
  return { longitude: sunLon, isRetrograde: false }
}

// Calculate Moon's position
function calculateMoonPosition(jd: number, ayanamsa: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  const Lp = (218.3164591 + 481267.88134236 * T) % 360
  const M = (134.9634114 + 477198.8676313 * T) % 360
  const D = (297.8502042 + 445267.1115168 * T) % 360
  const F = (93.2720993 + 483202.0175273 * T) % 360
  const Ms = (357.5291092 + 35999.0502909 * T) % 360
  
  const Mrad = M * Math.PI / 180
  const Drad = D * Math.PI / 180
  const Frad = F * Math.PI / 180
  const Msrad = Ms * Math.PI / 180
  
  let moonLon = Lp + 
    6.288750 * Math.sin(Mrad) +
    1.274018 * Math.sin(2 * Drad - Mrad) +
    0.658309 * Math.sin(2 * Drad) +
    0.213616 * Math.sin(2 * Mrad) -
    0.185596 * Math.sin(Msrad) -
    0.114336 * Math.sin(2 * Frad)
  
  moonLon = (moonLon - ayanamsa) % 360
  if (moonLon < 0) moonLon += 360
  
  return { longitude: moonLon, isRetrograde: false }
}

// Calculate Mars position using orbital elements
function calculateMarsPosition(jd: number, ayanamsa: number, sunLon: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  // Mars orbital elements
  const L = (355.433 + 19140.2993 * T) % 360 // Mean longitude
  const a = 1.523679 // Semi-major axis in AU
  const e = 0.09340 + 0.000090 * T // Eccentricity
  const i = 1.84969 - 0.00068 * T // Inclination
  const omega = 49.5574 + 0.7720 * T // Longitude of ascending node
  const w = 286.537 + 0.7711 * T // Argument of perihelion
  
  const M = (L - omega - w) % 360
  const Mrad = M * Math.PI / 180
  
  // Kepler equation (simplified)
  let E = M + e * 180 / Math.PI * Math.sin(Mrad)
  for (let iter = 0; iter < 5; iter++) {
    const Erad = E * Math.PI / 180
    E = E - (E - e * 180 / Math.PI * Math.sin(Erad) - M) / (1 - e * Math.cos(Erad))
  }
  const Erad = E * Math.PI / 180
  
  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  ) * 180 / Math.PI
  
  // Heliocentric longitude
  let helioLon = (v + omega + w) % 360
  
  // Convert to geocentric (simplified)
  const r = a * (1 - e * Math.cos(Erad))
  const sunDist = 1.0 // AU
  
  // Geocentric correction
  const correction = Math.atan2(
    Math.sin((helioLon - sunLon) * Math.PI / 180),
    r - Math.cos((helioLon - sunLon) * Math.PI / 180)
  ) * 180 / Math.PI
  
  let geoLon = (helioLon + correction - ayanamsa) % 360
  if (geoLon < 0) geoLon += 360
  
  // Check retrograde (when Mars is opposite Sun, approximately)
  const elongation = Math.abs(geoLon - (sunLon - ayanamsa))
  const isRetrograde = elongation > 120 && elongation < 240
  
  return { longitude: geoLon, isRetrograde }
}

// Calculate Mercury position
function calculateMercuryPosition(jd: number, ayanamsa: number, sunLon: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  const L = (252.2509 + 149474.0722 * T) % 360
  const a = 0.387099
  const e = 0.205635 + 0.000023 * T
  const omega = 48.3309 + 1.1748 * T
  const w = 77.456 + 1.5564 * T
  
  const M = (L - omega - w) % 360
  const Mrad = M * Math.PI / 180
  
  let E = M + e * 180 / Math.PI * Math.sin(Mrad)
  for (let iter = 0; iter < 5; iter++) {
    const Erad = E * Math.PI / 180
    E = E - (E - e * 180 / Math.PI * Math.sin(Erad) - M) / (1 - e * Math.cos(Erad))
  }
  const Erad = E * Math.PI / 180
  
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  ) * 180 / Math.PI
  
  let helioLon = (v + omega + w) % 360
  
  // For inner planets, geocentric calculation is different
  // Mercury stays within 28° of Sun
  const maxElongation = 28
  const phase = (L % 360) / 360
  const sinElongation = Math.sin(phase * 2 * Math.PI) * maxElongation
  
  let geoLon = (sunLon + sinElongation - ayanamsa) % 360
  if (geoLon < 0) geoLon += 360
  
  // Retrograde when near inferior conjunction
  const isRetrograde = Math.abs(sinElongation) < 10 && Math.cos(phase * 2 * Math.PI) > 0
  
  return { longitude: geoLon, isRetrograde }
}

// Calculate Venus position
function calculateVenusPosition(jd: number, ayanamsa: number, sunLon: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  const L = (181.9798 + 58519.2130 * T) % 360
  const maxElongation = 47 // Venus can be up to 47° from Sun
  const phase = (L % 360) / 360
  const sinElongation = Math.sin(phase * 2 * Math.PI) * maxElongation
  
  let geoLon = (sunLon + sinElongation - ayanamsa) % 360
  if (geoLon < 0) geoLon += 360
  
  const isRetrograde = Math.abs(sinElongation) < 15 && Math.cos(phase * 2 * Math.PI) > 0
  
  return { longitude: geoLon, isRetrograde }
}

// Calculate Jupiter position
function calculateJupiterPosition(jd: number, ayanamsa: number, sunLon: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  const L = (34.3515 + 3034.9057 * T) % 360
  const a = 5.2026
  const e = 0.048498 - 0.000163 * T
  const omega = 100.4644 + 0.9857 * T
  const w = 14.331 + 0.2159 * T
  
  const M = (L - omega - w) % 360
  const Mrad = M * Math.PI / 180
  
  let E = M + e * 180 / Math.PI * Math.sin(Mrad)
  const Erad = E * Math.PI / 180
  
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  ) * 180 / Math.PI
  
  let helioLon = (v + omega + w) % 360
  
  const r = a * (1 - e * Math.cos(Erad))
  const correction = Math.atan2(Math.sin((helioLon - sunLon) * Math.PI / 180), r - 1) * 180 / Math.PI
  
  let geoLon = (helioLon + correction - ayanamsa) % 360
  if (geoLon < 0) geoLon += 360
  
  const elongation = Math.abs(helioLon - sunLon)
  const isRetrograde = elongation > 120 && elongation < 240
  
  return { longitude: geoLon, isRetrograde }
}

// Calculate Saturn position
function calculateSaturnPosition(jd: number, ayanamsa: number, sunLon: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  const L = (50.0774 + 1222.1138 * T) % 360
  const a = 9.5547
  const e = 0.055548 - 0.000346 * T
  const omega = 113.6655 + 0.8771 * T
  const w = 93.057 + 0.5659 * T
  
  const M = (L - omega - w) % 360
  const Mrad = M * Math.PI / 180
  
  let E = M + e * 180 / Math.PI * Math.sin(Mrad)
  const Erad = E * Math.PI / 180
  
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(Erad / 2),
    Math.sqrt(1 - e) * Math.cos(Erad / 2)
  ) * 180 / Math.PI
  
  let helioLon = (v + omega + w) % 360
  
  const r = a * (1 - e * Math.cos(Erad))
  const correction = Math.atan2(Math.sin((helioLon - sunLon) * Math.PI / 180), r - 1) * 180 / Math.PI
  
  let geoLon = (helioLon + correction - ayanamsa) % 360
  if (geoLon < 0) geoLon += 360
  
  const elongation = Math.abs(helioLon - sunLon)
  const isRetrograde = elongation > 120 && elongation < 240
  
  return { longitude: geoLon, isRetrograde }
}

// Calculate Rahu (North Node) position
function calculateRahuPosition(jd: number, ayanamsa: number): { longitude: number; isRetrograde: boolean } {
  const T = (jd - 2451545.0) / 36525
  
  // Mean longitude of Moon's ascending node (always retrograde motion)
  let rahuLon = (125.0445 - 1934.1363 * T + 0.0021 * T * T) % 360
  rahuLon = (rahuLon - ayanamsa) % 360
  if (rahuLon < 0) rahuLon += 360
  
  return { longitude: rahuLon, isRetrograde: true }
}

// Calculate Ketu (South Node) position - always 180° from Rahu
function calculateKetuPosition(rahuLon: number): { longitude: number; isRetrograde: boolean } {
  let ketuLon = (rahuLon + 180) % 360
  return { longitude: ketuLon, isRetrograde: true }
}

// Get all current planetary positions
export function getCurrentTransits(date: Date = new Date(), timezone: number = 5.5) {
  const jd = getJulianDay(date, timezone)
  const ayanamsa = calculatePreciseAyanamsa(jd)
  
  const sun = calculateSunPosition(jd, ayanamsa)
  const moon = calculateMoonPosition(jd, ayanamsa)
  const mars = calculateMarsPosition(jd, ayanamsa, sun.longitude + ayanamsa)
  const mercury = calculateMercuryPosition(jd, ayanamsa, sun.longitude + ayanamsa)
  const jupiter = calculateJupiterPosition(jd, ayanamsa, sun.longitude + ayanamsa)
  const venus = calculateVenusPosition(jd, ayanamsa, sun.longitude + ayanamsa)
  const saturn = calculateSaturnPosition(jd, ayanamsa, sun.longitude + ayanamsa)
  const rahu = calculateRahuPosition(jd, ayanamsa)
  const ketu = calculateKetuPosition(rahu.longitude)
  
  const formatPlanet = (name: string, data: { longitude: number; isRetrograde: boolean }) => {
    const signIndex = Math.floor(data.longitude / 30)
    const degree = data.longitude % 30
    return {
      planet: name,
      sign: SIGNS[signIndex],
      signSanskrit: SIGN_SANSKRIT[signIndex],
      degree: parseFloat(degree.toFixed(2)),
      isRetrograde: data.isRetrograde,
      ...PLANET_INFO[name as keyof typeof PLANET_INFO]
    }
  }
  
  return [
    formatPlanet('Sun', sun),
    formatPlanet('Moon', moon),
    formatPlanet('Mars', mars),
    formatPlanet('Mercury', mercury),
    formatPlanet('Jupiter', jupiter),
    formatPlanet('Venus', venus),
    formatPlanet('Saturn', saturn),
    formatPlanet('Rahu', rahu),
    formatPlanet('Ketu', ketu)
  ]
}

// Calculate upcoming major transits
export function getUpcomingTransits(date: Date = new Date(), timezone: number = 5.5) {
  const currentTransits = getCurrentTransits(date, timezone)
  const upcomingTransits: any[] = []
  
  // Check when each planet will change signs
  for (const transit of currentTransits) {
    const currentSign = transit.sign
    const degreesRemaining = 30 - transit.degree
    const dailyMotion = DAILY_MOTION[transit.planet as keyof typeof DAILY_MOTION]
    
    if (dailyMotion > 0) {
      const daysToNextSign = degreesRemaining / dailyMotion
      const transitDate = new Date(date.getTime() + daysToNextSign * 24 * 60 * 60 * 1000)
      
      if (daysToNextSign < 365) { // Only show transits within a year
        const nextSignIndex = (SIGNS.indexOf(currentSign) + 1) % 12
        const nextSign = SIGNS[nextSignIndex]
        
        upcomingTransits.push({
          planet: transit.planet,
          fromSign: currentSign,
          toSign: nextSign,
          date: transitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          duration: TRANSIT_DURATION[transit.planet as keyof typeof TRANSIT_DURATION],
          daysAway: Math.round(daysToNextSign),
          impact: getTransitImpact(transit.planet, nextSign),
          effects: getTransitEffects(transit.planet, nextSign)
        })
      }
    }
  }
  
  // Sort by date
  upcomingTransits.sort((a, b) => a.daysAway - b.daysAway)
  
  return upcomingTransits.slice(0, 6) // Return next 6 transits
}

// Get transit impact (simplified)
function getTransitImpact(planet: string, sign: string): 'positive' | 'neutral' | 'negative' {
  // Exaltation signs - positive
  const exaltations: { [key: string]: string } = {
    Sun: 'Aries', Moon: 'Taurus', Mars: 'Capricorn', Mercury: 'Virgo',
    Jupiter: 'Cancer', Venus: 'Pisces', Saturn: 'Libra'
  }
  
  // Debilitation signs - negative
  const debilitations: { [key: string]: string } = {
    Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
    Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries'
  }
  
  if (exaltations[planet] === sign) return 'positive'
  if (debilitations[planet] === sign) return 'negative'
  return 'neutral'
}

// Get transit effects (general descriptions)
function getTransitEffects(planet: string, sign: string): string[] {
  const effects: { [key: string]: { [key: string]: string[] } } = {
    Jupiter: {
      Aries: ['New beginnings and initiatives', 'Leadership opportunities', 'Physical energy increases', 'Independence grows'],
      Taurus: ['Financial growth', 'Material gains', 'Stability in relationships', 'Appreciation for luxury'],
      Gemini: ['Communication improves', 'Learning opportunities', 'Short travels', 'New connections'],
      Cancer: ['Emotional growth', 'Family blessings', 'Property gains', 'Nurturing energy'],
      Leo: ['Creative expression', 'Recognition', 'Children bring joy', 'Leadership roles'],
      Virgo: ['Health focus', 'Service oriented work', 'Analytical skills', 'Routine improvements'],
      Libra: ['Relationship growth', 'Partnership luck', 'Artistic abilities', 'Social expansion'],
      Scorpio: ['Transformation', 'Hidden gains', 'Research success', 'Psychological insights'],
      Sagittarius: ['Higher learning', 'Spiritual growth', 'Long journeys', 'Philosophy interests'],
      Capricorn: ['Career challenges', 'Hard work required', 'Patience needed', 'Authority issues'],
      Aquarius: ['Social causes', 'Networking gains', 'Innovative ideas', 'Humanitarian work'],
      Pisces: ['Spiritual peak', 'Intuition strong', 'Creative inspiration', 'Compassion grows']
    },
    Saturn: {
      Aries: ['Discipline required', 'Patience in new ventures', 'Energy limitations', 'Leadership tests'],
      Taurus: ['Financial discipline', 'Slow material gains', 'Value reassessment', 'Patience with money'],
      Gemini: ['Communication delays', 'Mental discipline', 'Serious learning', 'Short trip obstacles'],
      Cancer: ['Emotional maturity', 'Family responsibilities', 'Home limitations', 'Mother-related karma'],
      Leo: ['Ego checks', 'Creative blocks', 'Heart-related caution', 'Authority challenges'],
      Virgo: ['Health focus required', 'Service karma', 'Work responsibilities', 'Routine discipline'],
      Libra: ['Relationship maturity', 'Partnership karma', 'Justice served', 'Balance achieved'],
      Scorpio: ['Transformation through limits', 'Hidden debts surface', 'Psychological work', 'Research patience'],
      Sagittarius: ['Faith tested', 'Long journey delays', 'Teacher-student karma', 'Philosophy deepens'],
      Capricorn: ['Career peak', 'Hard work pays off', 'Authority established', 'Ambitions realized'],
      Aquarius: ['Social responsibilities', 'Network karma', 'Innovation through discipline', 'Community duties'],
      Pisces: ['Spiritual discipline', 'Isolation periods', 'Intuition development', 'Compassion karma']
    }
  }
  
  // Default effects based on planet nature
  const defaultEffects: { [key: string]: string[] } = {
    Sun: ['Vitality changes', 'Father/authority matters', 'Self-expression shifts', 'Government dealings'],
    Moon: ['Emotional shifts', 'Mother/home matters', 'Public image changes', 'Mental state fluctuations'],
    Mars: ['Energy levels change', 'Action-oriented period', 'Competition increases', 'Conflict potential'],
    Mercury: ['Communication style shifts', 'Learning opportunities', 'Business dealings', 'Travel changes'],
    Jupiter: ['Expansion and growth', 'Wisdom gains', 'Luck and fortune', 'Spiritual development'],
    Venus: ['Relationship energy shifts', 'Artistic inspiration', 'Luxury and comfort', 'Beauty matters'],
    Saturn: ['Discipline required', 'Karma surfaces', 'Long-term planning', 'Responsibility increases'],
    Rahu: ['Unconventional paths', 'Material desires', 'Foreign connections', 'Obsession potential'],
    Ketu: ['Spiritual detachment', 'Past-life karma', 'Liberation focus', 'Intuition heightens']
  }
  
  return effects[planet]?.[sign] || defaultEffects[planet] || ['Transit effects apply', 'Monitor developments', 'Stay aware', 'Take appropriate action']
}

// Get aspects of a planet
export function getPlanetAspects(planetLongitude: number, allTransits: any[]): string[] {
  const aspects: string[] = []
  const aspectAngles = [60, 90, 120, 180] // Sextile, Square, Trine, Opposition
  const aspectNames = ['Sextile', 'Square', 'Trine', 'Opposition']
  
  for (const transit of allTransits) {
    if (transit.degree === undefined) continue
    
    const otherLon = SIGNS.indexOf(transit.sign) * 30 + transit.degree
    let diff = Math.abs(planetLongitude - otherLon)
    if (diff > 180) diff = 360 - diff
    
    for (let i = 0; i < aspectAngles.length; i++) {
      if (Math.abs(diff - aspectAngles[i]) < 8) { // 8 degree orb
        aspects.push(`${aspectNames[i]} ${transit.planet}`)
        break
      }
    }
  }
  
  return aspects
}
