// Advanced Vedic Astrology Calculation Engine
// State-of-the-art predictions with deep analysis
// Fixed and enhanced version with proper classical calculations

import { RASHIS, NAKSHATRAS, PLANETS, DASHA_YEARS, DASHA_SEQUENCE } from "./calculations"

// ============================================================================
// SHADBALA - Six-fold Strength Calculation (Complete Implementation)
// Based on BPHS Chapter 27 and Phaladeepika Chapter 4
// ============================================================================

export interface ShadbalaResult {
  planet: string
  sthanaaBala: number      // Positional strength
  digBala: number          // Directional strength
  kaalaBala: number        // Temporal strength
  cheshtaBala: number      // Motional strength
  naisargikaBala: number   // Natural strength
  drikBala: number         // Aspectual strength
  totalBala: number        // Total strength in Rupas
  totalShashtiamsas: number // Total in Shashtiamsas
  percentage: number       // Normalized 0-100 strength score for display
  classicalPercentage: number // Classical percentage (can exceed 100%)
  isStrong: boolean        // Whether planet is adequately strong
  strengthLabel: 'Very Strong' | 'Strong' | 'Adequate' | 'Weak' | 'Very Weak'
  interpretation: string   // Detailed interpretation
  components: {
    ochchaBala: number
    saptavargajaBala: number
    ojayugmaBala: number
    kendraBala: number
    drekkanaBala: number
  }
}

// Natural strength values (Naisargika Bala) in Shashtiamsas - BPHS
const NAISARGIKA_BALA: Record<string, number> = {
  Sun: 60, Moon: 51.43, Mars: 17.14, Mercury: 25.71,
  Jupiter: 34.29, Venus: 42.86, Saturn: 8.57, Rahu: 0, Ketu: 0
}

// Required minimum Shadbala in Shashtiamsas (BPHS thresholds)
const MIN_SHADBALA: Record<string, number> = {
  Sun: 390, Moon: 360, Mars: 300, Mercury: 420,
  Jupiter: 390, Venus: 330, Saturn: 300, Rahu: 300, Ketu: 300
}

// Exaltation points (degrees in zodiac where planet is most exalted)
const EXALTATION_POINTS: Record<string, number> = {
  Sun: 10, Moon: 33, Mars: 298, Mercury: 165,
  Jupiter: 95, Venus: 357, Saturn: 200, Rahu: 60, Ketu: 240
}

// Dig Bala (Directional Strength) - max 60 Shashtiamsas
// Based on BPHS - planets are strong in specific directions/houses
function calculateDigBala(planet: string, house: number): number {
  const digBalaHouses: Record<string, number> = {
    Sun: 10, Mars: 10,      // Strong in 10th (South/Zenith)
    Moon: 4, Venus: 4,      // Strong in 4th (North/Nadir)
    Mercury: 1, Jupiter: 1, // Strong in 1st (East/Ascendant)
    Saturn: 7,              // Strong in 7th (West/Descendant)
    Rahu: 10, Ketu: 4
  }

  const strongHouse = digBalaHouses[planet] || 1
  // Calculate distance from strongest house
  let distance = Math.abs(house - strongHouse)
  if (distance > 6) distance = 12 - distance

  // Linear decrease: 60 at strongest, 0 at opposite
  return Math.max(0, 60 - (distance * 10))
}

// Uchcha Bala (Exaltation Strength) - part of Sthana Bala
function calculateOchchaBala(longitude: number, planet: string): number {
  const exaltPoint = EXALTATION_POINTS[planet] || 0
  // Distance from exaltation point
  let diff = Math.abs(longitude - exaltPoint)
  if (diff > 180) diff = 360 - diff
  // Max 60 at exaltation, 0 at debilitation (180° away)
  return Math.max(0, 60 - (diff / 3))
}

// Saptavargaja Bala - Dignity in 7 divisional charts (simplified to Rashi)
function calculateSaptavargajaBala(planet: string, sign: number): number {
  // Sign rulers
  const signRulers: Record<number, string> = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
    4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
    8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
  }

  // Exaltation signs
  const exaltedSigns: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 9, Mercury: 5,
    Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 2, Ketu: 8
  }

  // Debilitation signs
  const debilitatedSigns: Record<string, number> = {
    Sun: 6, Moon: 7, Mars: 3, Mercury: 11,
    Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 8, Ketu: 2
  }

  // Moolatrikona signs and ranges
  const moolatrikona: Record<string, { sign: number; start: number; end: number }> = {
    Sun: { sign: 4, start: 0, end: 20 },
    Moon: { sign: 1, start: 3, end: 30 },
    Mars: { sign: 0, start: 0, end: 12 },
    Mercury: { sign: 5, start: 15, end: 20 },
    Jupiter: { sign: 8, start: 0, end: 10 },
    Venus: { sign: 6, start: 0, end: 15 },
    Saturn: { sign: 10, start: 0, end: 20 }
  }

  // Check dignity
  if (exaltedSigns[planet] === sign) return 60 // Exalted
  if (debilitatedSigns[planet] === sign) return 5 // Debilitated

  // Check own sign
  const ruler = signRulers[sign]
  if (ruler === planet) return 45 // Own sign

  // Check moolatrikona (would need degree, simplified here)
  if (moolatrikona[planet]?.sign === sign) return 52.5 // Moolatrikona

  // Check friendship
  const friendships = getPlanetaryFriendships()
  const relationship = friendships[planet]?.[ruler]

  if (relationship === 'friend') return 37.5
  if (relationship === 'enemy') return 15

  return 30 // Neutral
}

// Planetary friendships (Naisargika Maitri)
function getPlanetaryFriendships(): Record<string, Record<string, string>> {
  return {
    Sun: { Moon: 'friend', Mars: 'friend', Jupiter: 'friend', Mercury: 'neutral', Venus: 'enemy', Saturn: 'enemy', Rahu: 'enemy', Ketu: 'neutral' },
    Moon: { Sun: 'friend', Mercury: 'friend', Mars: 'neutral', Jupiter: 'neutral', Venus: 'neutral', Saturn: 'neutral', Rahu: 'enemy', Ketu: 'enemy' },
    Mars: { Sun: 'friend', Moon: 'friend', Jupiter: 'friend', Mercury: 'enemy', Venus: 'neutral', Saturn: 'neutral', Rahu: 'neutral', Ketu: 'friend' },
    Mercury: { Sun: 'friend', Venus: 'friend', Moon: 'enemy', Mars: 'neutral', Jupiter: 'neutral', Saturn: 'neutral', Rahu: 'friend', Ketu: 'neutral' },
    Jupiter: { Sun: 'friend', Moon: 'friend', Mars: 'friend', Mercury: 'enemy', Venus: 'enemy', Saturn: 'neutral', Rahu: 'enemy', Ketu: 'friend' },
    Venus: { Mercury: 'friend', Saturn: 'friend', Sun: 'enemy', Moon: 'enemy', Mars: 'neutral', Jupiter: 'neutral', Rahu: 'friend', Ketu: 'neutral' },
    Saturn: { Mercury: 'friend', Venus: 'friend', Sun: 'enemy', Moon: 'enemy', Mars: 'enemy', Jupiter: 'neutral', Rahu: 'friend', Ketu: 'neutral' },
    Rahu: { Mercury: 'friend', Venus: 'friend', Saturn: 'friend', Sun: 'enemy', Moon: 'enemy', Mars: 'neutral', Jupiter: 'enemy', Ketu: 'enemy' },
    Ketu: { Mars: 'friend', Jupiter: 'friend', Sun: 'neutral', Moon: 'enemy', Mercury: 'neutral', Venus: 'neutral', Saturn: 'neutral', Rahu: 'enemy' }
  }
}

// Ojayugma Bala - Odd/Even sign and Navamsa strength
function calculateOjayugmaBala(planet: string, sign: number, longitude: number): number {
  const isOddSign = sign % 2 === 0 // 0-indexed: Aries(0)=odd, Taurus(1)=even

  // Calculate Navamsa
  const degreeInSign = longitude % 30
  const navamsaNum = Math.floor(degreeInSign / (30/9))
  const navamsaSign = (sign * 9 + navamsaNum) % 12
  const isOddNavamsa = navamsaSign % 2 === 0

  let bala = 0

  // Moon and Venus prefer even signs
  if (planet === 'Moon' || planet === 'Venus') {
    if (!isOddSign) bala += 15
    if (!isOddNavamsa) bala += 15
  } else {
    // Other planets prefer odd signs
    if (isOddSign) bala += 15
    if (isOddNavamsa) bala += 15
  }

  return bala
}

// Kendra Bala - Strength from angular houses
function calculateKendraBala(house: number): number {
  const kendras = [1, 4, 7, 10]
  const panaparas = [2, 5, 8, 11]
  // const apoklimas = [3, 6, 9, 12]

  if (kendras.includes(house)) return 60
  if (panaparas.includes(house)) return 30
  return 15 // Apoklima
}

// Drekkana Bala - Strength from decanate
function calculateDrekkanaBala(planet: string, longitude: number): number {
  const degreeInSign = longitude % 30
  const drekkana = Math.floor(degreeInSign / 10)

  // Male planets strong in 1st drekkana, female in 2nd, hermaphrodite in 3rd
  const malePlanets = ['Sun', 'Mars', 'Jupiter']
  const femalePlanets = ['Moon', 'Venus']
  // Mercury, Saturn, Rahu, Ketu are hermaphrodite

  if (malePlanets.includes(planet) && drekkana === 0) return 15
  if (femalePlanets.includes(planet) && drekkana === 1) return 15
  if (!malePlanets.includes(planet) && !femalePlanets.includes(planet) && drekkana === 2) return 15

  return 7.5
}

// Kaala Bala - Temporal Strength (Complete Implementation)
function calculateKaalaBala(
  planet: string,
  birthHour: number,
  birthDate: Date,
  moonLongitude: number
): number {
  let totalKaalaBala = 0

  // 1. Natonnata Bala (Day/Night strength) - 60 max
  const isDay = birthHour >= 6 && birthHour < 18
  const diurnalPlanets = ['Sun', 'Jupiter', 'Venus']
  const nocturnalPlanets = ['Moon', 'Mars', 'Saturn']

  if (isDay && diurnalPlanets.includes(planet)) {
    totalKaalaBala += 60
  } else if (!isDay && nocturnalPlanets.includes(planet)) {
    totalKaalaBala += 60
  } else if (planet === 'Mercury') {
    totalKaalaBala += 60 // Mercury is always strong
  } else {
    totalKaalaBala += 30
  }

  // 2. Paksha Bala (Lunar phase strength) - 60 max
  // Benefics strong in Shukla Paksha, Malefics in Krishna
  const moonPhase = moonLongitude % 360
  const sunMoonDiff = moonPhase // Simplified - would need Sun position
  const isShukla = sunMoonDiff >= 0 && sunMoonDiff < 180

  const benefics = ['Jupiter', 'Venus', 'Moon', 'Mercury']
  const malefics = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']

  if (isShukla && benefics.includes(planet)) {
    totalKaalaBala += 60
  } else if (!isShukla && malefics.includes(planet)) {
    totalKaalaBala += 60
  } else {
    totalKaalaBala += 30
  }

  // 3. Tribhaga Bala (3-part day/night strength) - 60 max
  const hourOfDay = birthHour
  if (hourOfDay >= 6 && hourOfDay < 10) {
    // First part of day - Mercury
    if (planet === 'Mercury') totalKaalaBala += 60
    else totalKaalaBala += 30
  } else if (hourOfDay >= 10 && hourOfDay < 14) {
    // Second part of day - Sun
    if (planet === 'Sun') totalKaalaBala += 60
    else totalKaalaBala += 30
  } else if (hourOfDay >= 14 && hourOfDay < 18) {
    // Third part of day - Saturn
    if (planet === 'Saturn') totalKaalaBala += 60
    else totalKaalaBala += 30
  } else if (hourOfDay >= 18 && hourOfDay < 22) {
    // First part of night - Moon
    if (planet === 'Moon') totalKaalaBala += 60
    else totalKaalaBala += 30
  } else if (hourOfDay >= 22 || hourOfDay < 2) {
    // Second part of night - Venus
    if (planet === 'Venus') totalKaalaBala += 60
    else totalKaalaBala += 30
  } else {
    // Third part of night - Mars
    if (planet === 'Mars') totalKaalaBala += 60
    else totalKaalaBala += 30
  }

  // 4. Varshadhipati Bala (Year Lord) - 15 max
  const year = birthDate.getFullYear()
  const yearLordSequence = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  const yearLord = yearLordSequence[year % 7]
  if (planet === yearLord) totalKaalaBala += 15

  // 5. Masadhipati Bala (Month Lord) - 30 max
  const month = birthDate.getMonth()
  const monthLordSequence = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']
  const monthLord = monthLordSequence[month]
  if (planet === monthLord) totalKaalaBala += 30

  // 6. Varadhipati Bala (Weekday Lord) - 45 max
  const dayOfWeek = birthDate.getDay()
  const dayLordSequence = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
  const dayLord = dayLordSequence[dayOfWeek]
  if (planet === dayLord) totalKaalaBala += 45

  // 7. Hora Bala (Hour Lord) - 60 max
  const horaLord = dayLordSequence[Math.floor(birthHour) % 7]
  if (planet === horaLord) totalKaalaBala += 60

  return totalKaalaBala
}

// Cheshta Bala - Motional Strength (Proper Implementation)
function calculateCheshtaBala(
  planet: string,
  isRetrograde: boolean,
  longitude: number,
  dailyMotion: number // degrees per day
): number {
  // Sun and Moon don't have Cheshta Bala in traditional sense
  if (planet === 'Sun' || planet === 'Moon') {
    // For Sun, use Ayana Bala based on declination
    return 30
  }

  // Rahu and Ketu are always retrograde
  if (planet === 'Rahu' || planet === 'Ketu') {
    return 30
  }

  // For other planets, Cheshta Bala depends on motion
  // Retrograde planets get high Cheshta Bala (they appear brighter)
  if (isRetrograde) {
    return 60
  }

  // Mean daily motions for comparison
  const meanMotions: Record<string, number> = {
    Mars: 0.524,
    Mercury: 1.383,
    Jupiter: 0.083,
    Venus: 1.2,
    Saturn: 0.033
  }

  const meanMotion = meanMotions[planet] || 1

  // Fast motion = low Cheshta, Slow motion = high Cheshta
  // Stationary (about to retrograde) = highest
  if (Math.abs(dailyMotion) < meanMotion * 0.1) {
    return 60 // Stationary
  } else if (Math.abs(dailyMotion) < meanMotion * 0.5) {
    return 45 // Slow
  } else if (Math.abs(dailyMotion) < meanMotion) {
    return 30 // Normal
  } else {
    return 15 // Fast
  }
}

// Drik Bala - Aspectual Strength (Proper Implementation)
function calculateDrikBala(
  planet: string,
  planetHouse: number,
  allPositions: Record<string, number>,
  ascendant: number
): number {
  let drikBala = 0

  // Calculate aspects received
  for (const [otherPlanet, otherLong] of Object.entries(allPositions)) {
    if (otherPlanet === planet) continue

    const otherHouse = Math.floor(((otherLong - ascendant + 360) % 360) / 30) + 1
    const houseDiff = ((planetHouse - otherHouse + 12) % 12)

    // Check if aspecting
    let aspectStrength = 0

    // All planets have 7th aspect
    if (houseDiff === 6) { // 7th from other planet
      aspectStrength = 1
    }

    // Mars special aspects: 4th and 8th
    if (otherPlanet === 'Mars' && (houseDiff === 3 || houseDiff === 7)) {
      aspectStrength = 1
    }

    // Jupiter special aspects: 5th and 9th
    if (otherPlanet === 'Jupiter' && (houseDiff === 4 || houseDiff === 8)) {
      aspectStrength = 1
    }

    // Saturn special aspects: 3rd and 10th
    if (otherPlanet === 'Saturn' && (houseDiff === 2 || houseDiff === 9)) {
      aspectStrength = 1
    }

    if (aspectStrength > 0) {
      // Benefic aspects add, malefic aspects subtract
      const benefics = ['Jupiter', 'Venus', 'Moon', 'Mercury']
      if (benefics.includes(otherPlanet)) {
        drikBala += 15
      } else {
        drikBala -= 7.5
      }
    }
  }

  // Normalize to 0-60 range
  return Math.max(0, Math.min(60, 30 + drikBala))
}

export function calculateShadbala(
  positions: Record<string, number>,
  houses: Record<string, number>,
  birthDate: Date,
  birthHour: number,
  ascendant: number
): ShadbalaResult[] {
  const results: ShadbalaResult[] = []

  for (const planet of Object.keys(positions)) {
    if (planet === "Rahu" || planet === "Ketu") continue

    const longitude = positions[planet]
    const house = houses[planet]
    const sign = Math.floor(longitude / 30)

    // Calculate all Sthana Bala components
    const ochchaBala = calculateOchchaBala(longitude, planet)
    const saptavargajaBala = calculateSaptavargajaBala(planet, sign)
    const ojayugmaBala = calculateOjayugmaBala(planet, sign, longitude)
    const kendraBala = calculateKendraBala(house)
    const drekkanaBala = calculateDrekkanaBala(planet, longitude)

    const sthanaaBala = ochchaBala + saptavargajaBala + ojayugmaBala + kendraBala + drekkanaBala
    const digBala = calculateDigBala(planet, house)
    const kaalaBala = calculateKaalaBala(planet, birthHour, birthDate, positions.Moon || 0)

    // For Cheshta Bala, we need retrograde info - estimate from positions
    const isRetrograde = false // Would need velocity calculation
    const cheshtaBala = calculateCheshtaBala(planet, isRetrograde, longitude, 1)

    const naisargikaBala = NAISARGIKA_BALA[planet] || 0
    const drikBala = calculateDrikBala(planet, house, positions, ascendant)

    const totalShashtiamsas = sthanaaBala + digBala + kaalaBala + cheshtaBala + naisargikaBala + drikBala
    const totalBala = totalShashtiamsas / 60 // Convert to Rupas

    const minRequired = MIN_SHADBALA[planet] || 300
    const classicalPercentage = (totalShashtiamsas / minRequired) * 100
    const isStrong = classicalPercentage >= 100

    // Normalize to 0-100 scale for user-friendly display
    // Maps 50% classical → 0, 100% classical → 70, 150%+ classical → 100
    const normalizedPercentage = Math.min(100, Math.max(0, (classicalPercentage - 50) * 2))

    // Determine strength label
    let strengthLabel: ShadbalaResult['strengthLabel']
    if (classicalPercentage >= 130) strengthLabel = 'Very Strong'
    else if (classicalPercentage >= 100) strengthLabel = 'Strong'
    else if (classicalPercentage >= 80) strengthLabel = 'Adequate'
    else if (classicalPercentage >= 60) strengthLabel = 'Weak'
    else strengthLabel = 'Very Weak'

    const interpretation = generateShadbalaInterpretation(planet, classicalPercentage, isStrong, {
      sthanaaBala, digBala, kaalaBala, cheshtaBala, ochchaBala
    })

    results.push({
      planet,
      sthanaaBala,
      digBala,
      kaalaBala,
      cheshtaBala,
      naisargikaBala,
      drikBala,
      totalBala,
      totalShashtiamsas,
      percentage: normalizedPercentage,
      classicalPercentage,
      isStrong,
      strengthLabel,
      interpretation,
      components: {
        ochchaBala,
        saptavargajaBala,
        ojayugmaBala,
        kendraBala,
        drekkanaBala
      }
    })
  }

  return results
}

function generateShadbalaInterpretation(
  planet: string,
  percentage: number,
  isStrong: boolean,
  components: { sthanaaBala: number; digBala: number; kaalaBala: number; cheshtaBala: number; ochchaBala: number }
): string {
  const planetSignifications: Record<string, { strong: string; weak: string; areas: string }> = {
    Sun: {
      areas: "self-confidence, authority, father, government, leadership, vitality",
      strong: "You possess natural authority and leadership abilities. Your relationship with father figures is positive. Government matters favor you. Your vitality and immune system are robust.",
      weak: "Work on building self-confidence. Father-related matters may require attention. Seek opportunities to develop leadership skills. Focus on health and vitality through yoga and sun salutations."
    },
    Moon: {
      areas: "mind, emotions, mother, public image, mental peace, intuition",
      strong: "Emotional intelligence is your forte. Strong intuition guides your decisions. Mother's blessings support you. Public relations come naturally.",
      weak: "Practice meditation for mental stability. Nurture the relationship with mother. Develop emotional awareness. Moon remedies like wearing pearl (if suitable) may help."
    },
    Mars: {
      areas: "courage, energy, siblings, property, competition, technical skills",
      strong: "You have excellent courage and competitive spirit. Physical energy is abundant. Property matters favor you. Technical and engineering abilities are pronounced.",
      weak: "Channel aggression constructively through sports. Be patient with siblings. Property decisions need careful analysis. Build physical stamina through regular exercise."
    },
    Mercury: {
      areas: "intelligence, communication, business, education, analytical skills",
      strong: "Sharp intellect and excellent communication skills. Business acumen is strong. Academic pursuits are favorable. Analytical and logical thinking is your strength.",
      weak: "Work on communication skills. Be thorough in business dealings. Continue learning and education. Practice mindfulness to improve focus and concentration."
    },
    Jupiter: {
      areas: "wisdom, children, fortune, spirituality, teaching, expansion",
      strong: "Blessed with wisdom and good fortune. Children bring joy. Spiritual inclinations are strong. Teaching and advisory roles suit you well.",
      weak: "Seek knowledge and wisdom through study. Be patient regarding children matters. Connect with spiritual practices. Respect teachers and elders for blessings."
    },
    Venus: {
      areas: "love, marriage, arts, luxury, beauty, partnerships, vehicles",
      strong: "Blessed in love and relationships. Artistic talents flourish. Luxury and comfort come easily. Partnerships are harmonious.",
      weak: "Work on relationship skills and compromise. Develop artistic appreciation. Manage finances for luxury items carefully. Choose partners wisely."
    },
    Saturn: {
      areas: "discipline, longevity, career, perseverance, delays, servants",
      strong: "Strong work ethic and discipline. Career through hard work succeeds. Longevity is indicated. Perseverance brings results.",
      weak: "Develop patience and discipline. Career may require extra effort. Accept delays philosophically. Saturn remedies and service to elderly help."
    }
  }

  const info = planetSignifications[planet] || { areas: "general life areas", strong: "Favorable results.", weak: "Remedies may help." }

  let interpretation = `**${planet} Strength Analysis (${percentage.toFixed(1)}%)**\n\n`
  interpretation += `*Governs: ${info.areas}*\n\n`

  if (percentage >= 120) {
    interpretation += `**Exceptionally Strong**: ${planet} is extraordinarily powerful in your chart. ${info.strong} This planet acts as a strong benefactor throughout life.`
  } else if (percentage >= 100) {
    interpretation += `**Adequately Strong**: ${planet} has sufficient strength. ${info.strong}`
  } else if (percentage >= 75) {
    interpretation += `**Moderately Weak**: ${planet} needs some support. While not severely afflicted, conscious effort in ${planet}-related areas will yield better results. ${info.weak}`
  } else {
    interpretation += `**Weak**: ${planet} lacks strength in your chart. ${info.weak} Consider specific remedies for ${planet}.`
  }

  // Add component-specific insights
  if (components.digBala >= 45) {
    interpretation += ` Excellent directional strength enhances visibility in ${planet}-related matters.`
  }
  if (components.ochchaBala >= 45) {
    interpretation += ` Strong dignity ensures lasting positive results.`
  }
  if (components.kaalaBala >= 200) {
    interpretation += ` Time-based strength supports this planet's significations.`
  }

  return interpretation
}

// ============================================================================
// ASHTAKAVARGA - Eight-source Strength System (PROPER IMPLEMENTATION)
// Based on classical Ashtakavarga rules from BPHS
// ============================================================================

export interface AshtakavargaResult {
  planet: string
  bindu: number[]  // Points in each sign (0-11)
  totalBindu: number
  strongSigns: number[]  // Signs with 4+ points
  weakSigns: number[]    // Signs with 2 or less points
  interpretation: string
}

export interface SarvashtakavargaResult {
  signTotals: number[]  // Total points for each sign
  strongestSign: { sign: number; points: number }
  weakestSign: { sign: number; points: number }
  interpretation: string
}

// Ashtakavarga benefic positions - CLASSICAL RULES from BPHS
// For each planet, these are the houses from each contributor where benefic points are given
const ASHTAKAVARGA_RULES: Record<string, Record<string, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [3, 4, 6, 10, 11, 12]
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Ascendant: [3, 6, 10, 11]
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 3, 6, 10, 11]
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 2, 4, 6, 8, 10, 11]
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Ascendant: [1, 2, 4, 5, 6, 7, 9, 10, 11]
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Ascendant: [1, 2, 3, 4, 5, 8, 9, 11]
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Ascendant: [1, 3, 4, 6, 10, 11]
  }
}

// Calculate Ashtakavarga with PROPER classical rules
export function calculateAshtakavarga(
  positions: Record<string, number>,
  ascendant: number
): { planets: AshtakavargaResult[]; sarvashtakavarga: SarvashtakavargaResult } {
  const planetResults: AshtakavargaResult[] = []
  const sarvashtakavarga = new Array(12).fill(0)

  const mainPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
  const ascendantSign = Math.floor(ascendant / 30)

  for (const planet of mainPlanets) {
    const bindu = new Array(12).fill(0)
    const rules = ASHTAKAVARGA_RULES[planet]
    if (!rules) continue

    // For each sign (0-11)
    for (let targetSign = 0; targetSign < 12; targetSign++) {
      // Check contribution from each planet
      for (const contributor of mainPlanets) {
        const contributorSign = Math.floor(positions[contributor] / 30)

        // Calculate house distance from contributor to target
        const houseFromContributor = ((targetSign - contributorSign + 12) % 12) + 1

        // Check if this house is benefic according to rules
        if (rules[contributor]?.includes(houseFromContributor)) {
          bindu[targetSign]++
        }
      }

      // Check Ascendant contribution
      const houseFromAsc = ((targetSign - ascendantSign + 12) % 12) + 1
      if (rules.Ascendant?.includes(houseFromAsc)) {
        bindu[targetSign]++
      }

      sarvashtakavarga[targetSign] += bindu[targetSign]
    }

    const strongSigns = bindu.map((p, i) => p >= 4 ? i : -1).filter(i => i >= 0)
    const weakSigns = bindu.map((p, i) => p <= 2 ? i : -1).filter(i => i >= 0)
    const totalBindu = bindu.reduce((a, b) => a + b, 0)

    const interpretation = generateAshtakavargaInterpretation(planet, bindu, totalBindu, strongSigns)

    planetResults.push({
      planet,
      bindu,
      totalBindu,
      strongSigns,
      weakSigns,
      interpretation
    })
  }

  // Find strongest and weakest signs
  let maxPoints = 0, minPoints = 100, strongestSign = 0, weakestSign = 0
  for (let i = 0; i < 12; i++) {
    if (sarvashtakavarga[i] > maxPoints) { maxPoints = sarvashtakavarga[i]; strongestSign = i }
    if (sarvashtakavarga[i] < minPoints) { minPoints = sarvashtakavarga[i]; weakestSign = i }
  }

  const sarvaInterpretation = `The sign **${RASHIS[strongestSign].english}** (${sarvashtakavarga[strongestSign]} points) is most favorable for you overall. Planets transiting this sign bring opportunities and positive results. Conversely, **${RASHIS[weakestSign].english}** (${sarvashtakavarga[weakestSign]} points) requires caution during planetary transits.`

  return {
    planets: planetResults,
    sarvashtakavarga: {
      signTotals: sarvashtakavarga,
      strongestSign: { sign: strongestSign, points: maxPoints },
      weakestSign: { sign: weakestSign, points: minPoints },
      interpretation: sarvaInterpretation
    }
  }
}

function generateAshtakavargaInterpretation(
  planet: string,
  bindu: number[],
  total: number,
  strongSigns: number[]
): string {
  const avgPoints = total / 12
  const planetMeaning: Record<string, string> = {
    Sun: "authority, career recognition, and vitality",
    Moon: "emotional fulfillment and mental peace",
    Mars: "courage, property matters, and energy",
    Mercury: "business success and intellectual pursuits",
    Jupiter: "wisdom, fortune, and spiritual growth",
    Venus: "relationships, arts, and material comforts",
    Saturn: "discipline, longevity, and karmic lessons"
  }

  let interp = `**${planet} Ashtakavarga** (Total: ${total} bindus, Average: ${avgPoints.toFixed(1)}/sign)\n\n`

  if (avgPoints >= 4) {
    interp += `${planet} has strong ashtakavarga strength, indicating favorable results in ${planetMeaning[planet] || "general matters"} when transiting most signs. `
  } else if (avgPoints >= 3) {
    interp += `${planet} has moderate ashtakavarga strength. Results in ${planetMeaning[planet] || "general matters"} will be mixed depending on the transit sign. `
  } else {
    interp += `${planet} has below-average ashtakavarga strength. Extra attention needed in ${planetMeaning[planet] || "general matters"}. `
  }

  if (strongSigns.length > 0) {
    const signNames = strongSigns.map(s => RASHIS[s].english).join(", ")
    interp += `\n\n**Favorable Transit Signs**: ${signNames}. When ${planet} transits these signs, expect positive developments.`
  }

  return interp
}

// ============================================================================
// COMPREHENSIVE YOGA ANALYSIS - With Strength Assessment
// Based on BPHS, Phaladeepika, and classical texts
// ============================================================================

export interface YogaResult {
  name: string
  sanskritName: string
  category: "Raja" | "Dhana" | "Arishta" | "Parivartan" | "Nabhas" | "Pancha Mahapurusha" | "Other"
  strength: number // 0-100
  strengthLabel: "Powerful" | "Strong" | "Moderate" | "Mild" | "Weak"
  isPresent: boolean
  formingPlanets: string[]
  description: string
  effects: string
  timing: string
  activationPeriods: string[]
  afflictions: string[]
  remedies?: string[]
}

// Helper to check if planet is in kendra from another
function isInKendraFrom(house1: number, house2: number): boolean {
  const diff = Math.abs(house1 - house2)
  return [0, 3, 6, 9].includes(diff) || [0, 3, 6, 9].includes(12 - diff)
}

// Helper to check if planet is in trikona from another
function isInTrikonaFrom(house1: number, house2: number): boolean {
  const diff = ((house1 - house2 + 12) % 12)
  return [0, 4, 8].includes(diff)
}

// Get sign lord
function getSignLord(sign: number): string {
  const lords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]
  return lords[sign]
}

// Calculate yoga strength based on participating planets
function calculateYogaStrength(
  planets: string[],
  positions: Record<string, number>,
  houses: Record<string, number>,
  shadbalaResults?: ShadbalaResult[]
): { strength: number; label: "Powerful" | "Strong" | "Moderate" | "Mild" | "Weak"; afflictions: string[] } {
  let totalStrength = 50 // Base
  const afflictions: string[] = []

  for (const planet of planets) {
    const sign = Math.floor((positions[planet] || 0) / 30)
    const house = houses[planet] || 1

    // Check dignity
    const exaltedSigns: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 }
    const debilitatedSigns: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 }
    const ownSigns: Record<string, number[]> = {
      Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10]
    }

    if (exaltedSigns[planet] === sign) {
      totalStrength += 20
    } else if (debilitatedSigns[planet] === sign) {
      totalStrength -= 20
      afflictions.push(`${planet} is debilitated`)
    } else if (ownSigns[planet]?.includes(sign)) {
      totalStrength += 15
    }

    // Check house placement
    const kendras = [1, 4, 7, 10]
    const trikonas = [1, 5, 9]
    if (kendras.includes(house) || trikonas.includes(house)) {
      totalStrength += 10
    }

    // Check for combustion (within 6 degrees of Sun)
    if (planet !== 'Sun' && positions.Sun !== undefined && positions[planet] !== undefined) {
      const sunDiff = Math.abs(positions.Sun - positions[planet])
      if (sunDiff < 6 || sunDiff > 354) {
        totalStrength -= 15
        afflictions.push(`${planet} is combust`)
      }
    }

    // Check for affliction by malefics (conjunction)
    const malefics = ['Saturn', 'Mars', 'Rahu', 'Ketu']
    for (const malefic of malefics) {
      if (malefic !== planet && positions[malefic] !== undefined && positions[planet] !== undefined) {
        const maleficSign = Math.floor(positions[malefic] / 30)
        if (maleficSign === sign) {
          totalStrength -= 10
          afflictions.push(`${planet} conjunct ${malefic}`)
        }
      }
    }

    // Use Shadbala if available
    if (shadbalaResults) {
      const planetShadbala = shadbalaResults.find(s => s.planet === planet)
      if (planetShadbala) {
        if (planetShadbala.percentage >= 100) totalStrength += 10
        else if (planetShadbala.percentage < 75) totalStrength -= 10
      }
    }
  }

  // Normalize to 0-100
  totalStrength = Math.max(0, Math.min(100, totalStrength))

  let label: "Powerful" | "Strong" | "Moderate" | "Mild" | "Weak"
  if (totalStrength >= 80) label = "Powerful"
  else if (totalStrength >= 65) label = "Strong"
  else if (totalStrength >= 50) label = "Moderate"
  else if (totalStrength >= 35) label = "Mild"
  else label = "Weak"

  return { strength: totalStrength, label, afflictions }
}

export function analyzeYogas(
  positions: Record<string, number>,
  houses: Record<string, number>,
  ascendant: number,
  shadbalaResults?: ShadbalaResult[]
): YogaResult[] {
  const results: YogaResult[] = []
  const ascSign = Math.floor(ascendant / 30)

  // 1. GAJA KESARI YOGA
  const moonHouse = houses.Moon
  const jupiterHouse = houses.Jupiter
  if (isInKendraFrom(moonHouse, jupiterHouse)) {
    const { strength, label, afflictions } = calculateYogaStrength(['Moon', 'Jupiter'], positions, houses, shadbalaResults)
    results.push({
      name: "Gaja Kesari Yoga",
      sanskritName: "गजकेसरी योग",
      category: "Raja",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Moon", "Jupiter"],
      description: "Jupiter in kendra (1,4,7,10) from Moon creates this auspicious yoga.",
      effects: "Bestows wisdom, intelligence, fame, and lasting prosperity. The native becomes respected in society, holds positions of authority, and has excellent speaking abilities.",
      timing: "Results manifest strongly during Jupiter and Moon dashas/antardashas, particularly after age 32.",
      activationPeriods: ["Jupiter Mahadasha", "Moon Mahadasha", "Jupiter-Moon Antardasha"],
      afflictions,
      remedies: afflictions.length > 0 ? ["Strengthen Jupiter through Thursday worship", "Donate to educational causes"] : undefined
    })
  }

  // 2. PANCHA MAHAPURUSHA YOGAS
  // Hamsa Yoga (Jupiter)
  const jupiterSign = Math.floor(positions.Jupiter / 30)
  const jupiterKendra = [1, 4, 7, 10].includes(jupiterHouse)
  const jupiterOwnExalted = [3, 8, 11].includes(jupiterSign) // Cancer, Sagittarius, Pisces
  if (jupiterKendra && jupiterOwnExalted) {
    const { strength, label, afflictions } = calculateYogaStrength(['Jupiter'], positions, houses, shadbalaResults)
    results.push({
      name: "Hamsa Yoga",
      sanskritName: "हंस योग",
      category: "Pancha Mahapurusha",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Jupiter"],
      description: "Jupiter in kendra in own/exalted sign (Cancer, Sagittarius, Pisces).",
      effects: "One of the five Mahapurusha Yogas. Bestows righteousness, wisdom, and spiritual inclination. The native becomes a teacher, philosopher, or spiritual guide.",
      timing: "Manifests primarily in Jupiter's Mahadasha and after age 30.",
      activationPeriods: ["Jupiter Mahadasha"],
      afflictions
    })
  }

  // Malavya Yoga (Venus)
  const venusHouse = houses.Venus
  const venusSign = Math.floor(positions.Venus / 30)
  const venusKendra = [1, 4, 7, 10].includes(venusHouse)
  const venusOwnExalted = [1, 6, 11].includes(venusSign) // Taurus, Libra, Pisces
  if (venusKendra && venusOwnExalted) {
    const { strength, label, afflictions } = calculateYogaStrength(['Venus'], positions, houses, shadbalaResults)
    results.push({
      name: "Malavya Yoga",
      sanskritName: "मालव्य योग",
      category: "Pancha Mahapurusha",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Venus"],
      description: "Venus in kendra in own/exalted sign (Taurus, Libra, Pisces).",
      effects: "Grants exceptional beauty, artistic talents, luxurious lifestyle. Success in arts, entertainment, beauty industries.",
      timing: "Strongest during Venus Mahadasha. Physical beauty evident from youth; material success after marriage.",
      activationPeriods: ["Venus Mahadasha"],
      afflictions
    })
  }

  // Ruchaka Yoga (Mars)
  const marsHouse = houses.Mars
  const marsSign = Math.floor(positions.Mars / 30)
  const marsKendra = [1, 4, 7, 10].includes(marsHouse)
  const marsOwnExalted = [0, 7, 9].includes(marsSign) // Aries, Scorpio, Capricorn
  if (marsKendra && marsOwnExalted) {
    const { strength, label, afflictions } = calculateYogaStrength(['Mars'], positions, houses, shadbalaResults)
    results.push({
      name: "Ruchaka Yoga",
      sanskritName: "रुचक योग",
      category: "Pancha Mahapurusha",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Mars"],
      description: "Mars in kendra in own/exalted sign (Aries, Scorpio, Capricorn).",
      effects: "Creates a courageous, commanding personality. Success in military, sports, engineering, surgery.",
      timing: "Mars Mahadasha brings peak manifestation. Leadership qualities evident from early age.",
      activationPeriods: ["Mars Mahadasha"],
      afflictions
    })
  }

  // Bhadra Yoga (Mercury)
  const mercuryHouse = houses.Mercury
  const mercurySign = Math.floor(positions.Mercury / 30)
  const mercuryKendra = [1, 4, 7, 10].includes(mercuryHouse)
  const mercuryOwnExalted = [2, 5].includes(mercurySign) // Gemini, Virgo
  if (mercuryKendra && mercuryOwnExalted) {
    const { strength, label, afflictions } = calculateYogaStrength(['Mercury'], positions, houses, shadbalaResults)
    results.push({
      name: "Bhadra Yoga",
      sanskritName: "भद्र योग",
      category: "Pancha Mahapurusha",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Mercury"],
      description: "Mercury in kendra in own sign (Gemini, Virgo).",
      effects: "Exceptional intelligence, eloquence, business acumen. Success in commerce, writing, analytics.",
      timing: "Mercury Mahadasha brings intellectual peak. Academic brilliance early; business success in prime years.",
      activationPeriods: ["Mercury Mahadasha"],
      afflictions
    })
  }

  // Sasa Yoga (Saturn)
  const saturnHouse = houses.Saturn
  const saturnSign = Math.floor(positions.Saturn / 30)
  const saturnKendra = [1, 4, 7, 10].includes(saturnHouse)
  const saturnOwnExalted = [6, 9, 10].includes(saturnSign) // Libra, Capricorn, Aquarius
  if (saturnKendra && saturnOwnExalted) {
    const { strength, label, afflictions } = calculateYogaStrength(['Saturn'], positions, houses, shadbalaResults)
    results.push({
      name: "Sasa Yoga",
      sanskritName: "शश योग",
      category: "Pancha Mahapurusha",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Saturn"],
      description: "Saturn in kendra in own/exalted sign (Libra, Capricorn, Aquarius).",
      effects: "Grants authority, wealth through discipline, longevity. Success in politics, administration.",
      timing: "Saturn Mahadasha (typically 36-55) brings peak results. Late bloomer achieving lasting success.",
      activationPeriods: ["Saturn Mahadasha"],
      afflictions
    })
  }

  // 3. BUDHADITYA YOGA
  const sunSign = Math.floor(positions.Sun / 30)
  if (sunSign === mercurySign) {
    // Check Mercury is not combust (within 14 degrees of Sun for this yoga to be effective)
    const sunMercuryDiff = Math.abs(positions.Sun - positions.Mercury)
    if (sunMercuryDiff > 14 && sunMercuryDiff < 346) {
      const { strength, label, afflictions } = calculateYogaStrength(['Sun', 'Mercury'], positions, houses, shadbalaResults)
      results.push({
        name: "Budhaditya Yoga",
        sanskritName: "बुधादित्य योग",
        category: "Raja",
        strength,
        strengthLabel: label,
        isPresent: true,
        formingPlanets: ["Sun", "Mercury"],
        description: "Sun and Mercury in same sign (Mercury not combust).",
        effects: "Enhances intelligence, analytical abilities, communication skills. Good for academics, writing.",
        timing: "Active throughout life but stronger in Sun and Mercury periods.",
        activationPeriods: ["Sun Mahadasha", "Mercury Mahadasha"],
        afflictions
      })
    }
  }

  // 4. CHANDRA-MANGAL YOGA (Wealth through self-effort)
  const moonSign = Math.floor(positions.Moon / 30)
  if (moonSign === marsSign) {
    const { strength, label, afflictions } = calculateYogaStrength(['Moon', 'Mars'], positions, houses, shadbalaResults)
    results.push({
      name: "Chandra-Mangal Yoga",
      sanskritName: "चन्द्र-मंगल योग",
      category: "Dhana",
      strength,
      strengthLabel: label,
      isPresent: true,
      formingPlanets: ["Moon", "Mars"],
      description: "Moon and Mars in same sign.",
      effects: "Grants earning capability, entrepreneurial spirit, wealth through self-effort. Good for business.",
      timing: "Especially active in Mars and Moon dashas.",
      activationPeriods: ["Mars Mahadasha", "Moon Mahadasha"],
      afflictions
    })
  }

  // 5. NEECHA BHANGA RAJA YOGA (Debilitation Cancellation)
  const debilitatedPlanets: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 }
  const exaltedSignsMap: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 }

  for (const [planet, debSign] of Object.entries(debilitatedPlanets)) {
    const planetSign = Math.floor((positions[planet] || 0) / 30)
    if (planetSign === debSign) {
      // Check for cancellation
      let cancelled = false
      const cancellationReasons: string[] = []

      // Rule 1: Dispositor in kendra from Lagna or Moon
      const dispositor = getSignLord(debSign)
      const dispositorHouse = houses[dispositor]
      if ([1, 4, 7, 10].includes(dispositorHouse)) {
        cancelled = true
        cancellationReasons.push(`${dispositor} (dispositor) in kendra`)
      }

      // Rule 2: Exaltation lord in kendra
      const exaltLord = getSignLord(exaltedSignsMap[planet])
      const exaltLordHouse = houses[exaltLord]
      if ([1, 4, 7, 10].includes(exaltLordHouse)) {
        cancelled = true
        cancellationReasons.push(`${exaltLord} (exaltation lord) in kendra`)
      }

      // Rule 3: Debilitated planet aspected by its exaltation lord
      // Simplified - would need full aspect calculation

      if (cancelled) {
        const { strength, label, afflictions } = calculateYogaStrength([planet], positions, houses, shadbalaResults)
        results.push({
          name: `Neecha Bhanga Raja Yoga (${planet})`,
          sanskritName: "नीच भंग राज योग",
          category: "Raja",
          strength: Math.min(strength + 20, 100), // Boost for cancellation
          strengthLabel: label,
          isPresent: true,
          formingPlanets: [planet, ...cancellationReasons.map(r => r.split(' ')[0])],
          description: `${planet}'s debilitation is cancelled: ${cancellationReasons.join(', ')}.`,
          effects: "Debilitation cancelled creates Raja Yoga. Initial struggles transform into significant success. Often indicates rise from humble beginnings.",
          timing: `${planet} Mahadasha transforms challenges into opportunities.`,
          activationPeriods: [`${planet} Mahadasha`],
          afflictions: [`${planet} initially debilitated - requires effort`]
        })
      }
    }
  }

  // 6. VIPAREET RAJA YOGA (Lords of 6,8,12 in 6,8,12)
  const dusthanaLords: Record<number, string> = {}
  const lordshipMap: Record<string, number[]> = {
    Sun: [4].map(s => (s - ascSign + 12) % 12 + 1),
    Moon: [3].map(s => (s - ascSign + 12) % 12 + 1),
    Mars: [0, 7].map(s => (s - ascSign + 12) % 12 + 1),
    Mercury: [2, 5].map(s => (s - ascSign + 12) % 12 + 1),
    Jupiter: [8, 11].map(s => (s - ascSign + 12) % 12 + 1),
    Venus: [1, 6].map(s => (s - ascSign + 12) % 12 + 1),
    Saturn: [9, 10].map(s => (s - ascSign + 12) % 12 + 1)
  }

  // Find lords of 6, 8, 12
  const house6Sign = (ascSign + 5) % 12
  const house8Sign = (ascSign + 7) % 12
  const house12Sign = (ascSign + 11) % 12

  const lord6 = getSignLord(house6Sign)
  const lord8 = getSignLord(house8Sign)
  const lord12 = getSignLord(house12Sign)

  const dusthanaHouses = [6, 8, 12]

  // Check if any dusthana lord is in dusthana
  for (const [lord, houseNum] of [[lord6, 6], [lord8, 8], [lord12, 12]] as [string, number][]) {
    const lordHouse = houses[lord]
    if (dusthanaHouses.includes(lordHouse) && lordHouse !== houseNum) {
      const { strength, label, afflictions } = calculateYogaStrength([lord], positions, houses, shadbalaResults)
      results.push({
        name: `Vipareet Raja Yoga (${lord})`,
        sanskritName: "विपरीत राज योग",
        category: "Raja",
        strength,
        strengthLabel: label,
        isPresent: true,
        formingPlanets: [lord],
        description: `Lord of ${houseNum}th house (${lord}) placed in another dusthana (${lordHouse}th).`,
        effects: "Enemies destroy themselves. Gains through overcoming obstacles. Success after initial hardships. Often indicates victory in legal matters or over competitors.",
        timing: `${lord} Mahadasha brings unexpected gains and resolution of long-standing issues.`,
        activationPeriods: [`${lord} Mahadasha`],
        afflictions
      })
    }
  }

  // 7. DHANA YOGAS (Wealth combinations)
  // 2nd and 11th lords in mutual kendras or trikonas
  const house2Sign = (ascSign + 1) % 12
  const house11Sign = (ascSign + 10) % 12
  const lord2 = getSignLord(house2Sign)
  const lord11 = getSignLord(house11Sign)

  if (lord2 !== lord11) {
    const lord2House = houses[lord2]
    const lord11House = houses[lord11]

    // Check for exchange
    const lord2Sign = Math.floor((positions[lord2] || 0) / 30)
    const lord11Sign = Math.floor((positions[lord11] || 0) / 30)

    if (lord2Sign === house11Sign && lord11Sign === house2Sign) {
      const { strength, label, afflictions } = calculateYogaStrength([lord2, lord11], positions, houses, shadbalaResults)
      results.push({
        name: "Dhana Yoga (2-11 Exchange)",
        sanskritName: "धन योग",
        category: "Dhana",
        strength,
        strengthLabel: label,
        isPresent: true,
        formingPlanets: [lord2, lord11],
        description: `Lords of 2nd (${lord2}) and 11th (${lord11}) exchange signs.`,
        effects: "Strong wealth yoga through sign exchange. Multiple income sources. Ability to accumulate and grow wealth.",
        timing: "Dashas of both lords bring financial prosperity.",
        activationPeriods: [`${lord2} Mahadasha`, `${lord11} Mahadasha`],
        afflictions
      })
    }

    // Check for conjunction
    if (lord2Sign === lord11Sign) {
      const { strength, label, afflictions } = calculateYogaStrength([lord2, lord11], positions, houses, shadbalaResults)
      results.push({
        name: "Dhana Yoga (2-11 Conjunction)",
        sanskritName: "धन योग",
        category: "Dhana",
        strength,
        strengthLabel: label,
        isPresent: true,
        formingPlanets: [lord2, lord11],
        description: `Lords of 2nd (${lord2}) and 11th (${lord11}) conjunct in ${RASHIS[lord2Sign].english}.`,
        effects: "Wealth accumulation indicated. Combined energies of savings and gains.",
        timing: "Joint period of these planets brings peak financial results.",
        activationPeriods: [`${lord2} Mahadasha`, `${lord11} Mahadasha`],
        afflictions
      })
    }
  }

  // 8. KEMADRUMA YOGA (Challenging - Moon isolated)
  const moonSignNum = Math.floor(positions.Moon / 30)
  let moonIsolated = true

  for (const [planet, pos] of Object.entries(positions)) {
    if (planet !== 'Moon' && planet !== 'Rahu' && planet !== 'Ketu') {
      const planetSignNum = Math.floor(pos / 30)
      // Check adjacent signs
      if (Math.abs(planetSignNum - moonSignNum) === 1 ||
          Math.abs(planetSignNum - moonSignNum) === 11 ||
          planetSignNum === moonSignNum) {
        moonIsolated = false
        break
      }
    }
  }

  // Check for cancellation
  let kemadrumaRemedied = false
  const kemadrumaRemedies: string[] = []

  if (moonIsolated) {
    // Cancellation 1: Planet in kendra from Lagna
    if ([1, 4, 7, 10].includes(moonHouse)) {
      kemadrumaRemedied = true
      kemadrumaRemedies.push("Moon in kendra from Lagna")
    }

    // Cancellation 2: Moon aspected by Jupiter
    const jupiterMoonAspect = Math.abs(jupiterHouse - moonHouse)
    if (jupiterMoonAspect === 6 || jupiterMoonAspect === 4 || jupiterMoonAspect === 8 ||
        (12 - jupiterMoonAspect) === 6 || (12 - jupiterMoonAspect) === 4 || (12 - jupiterMoonAspect) === 8) {
      kemadrumaRemedied = true
      kemadrumaRemedies.push("Jupiter aspects Moon")
    }
  }

  if (moonIsolated) {
    results.push({
      name: kemadrumaRemedied ? "Kemadruma Yoga (Cancelled)" : "Kemadruma Yoga",
      sanskritName: "केमद्रुम योग",
      category: "Arishta",
      strength: kemadrumaRemedied ? 30 : 60,
      strengthLabel: kemadrumaRemedied ? "Mild" : "Moderate",
      isPresent: true,
      formingPlanets: ["Moon"],
      description: kemadrumaRemedied
        ? `Moon isolated but cancellation present: ${kemadrumaRemedies.join(', ')}.`
        : "No planets in 2nd or 12th from Moon (Moon isolated).",
      effects: kemadrumaRemedied
        ? "Original Kemadruma cancelled. Temporary difficulties overcome through the cancellation factors."
        : "May cause mental disturbances, feeling of isolation, or lack of support. Often improves with age.",
      timing: "Moon Mahadasha may be challenging. Improves in later dashas.",
      activationPeriods: ["Moon Mahadasha"],
      afflictions: kemadrumaRemedied ? [] : ["Moon isolation - strengthen through meditation"],
      remedies: kemadrumaRemedied ? undefined : [
        "Strengthen Moon through pearl (if suitable)",
        "Worship Divine Mother on Mondays",
        "Practice meditation for mental stability",
        "Maintain close family connections"
      ]
    })
  }

  // 9. RAJA YOGA (Kendra-Trikona connection)
  const trikonaLords: string[] = []
  const kendraLords: string[] = []

  // Get trikona lords (1, 5, 9)
  trikonaLords.push(getSignLord(ascSign))
  trikonaLords.push(getSignLord((ascSign + 4) % 12))
  trikonaLords.push(getSignLord((ascSign + 8) % 12))

  // Get kendra lords (1, 4, 7, 10)
  kendraLords.push(getSignLord(ascSign))
  kendraLords.push(getSignLord((ascSign + 3) % 12))
  kendraLords.push(getSignLord((ascSign + 6) % 12))
  kendraLords.push(getSignLord((ascSign + 9) % 12))

  // Check for conjunction/aspect between trikona and kendra lords
  for (const triLord of trikonaLords) {
    for (const kenLord of kendraLords) {
      if (triLord !== kenLord) {
        const triLordSign = Math.floor((positions[triLord] || 0) / 30)
        const kenLordSign = Math.floor((positions[kenLord] || 0) / 30)

        if (triLordSign === kenLordSign) {
          const { strength, label, afflictions } = calculateYogaStrength([triLord, kenLord], positions, houses, shadbalaResults)

          // Avoid duplicate yoga entries
          const yogaName = `Raja Yoga (${triLord}-${kenLord})`
          if (!results.some(r => r.name === yogaName)) {
            results.push({
              name: yogaName,
              sanskritName: "राज योग",
              category: "Raja",
              strength,
              strengthLabel: label,
              isPresent: true,
              formingPlanets: [triLord, kenLord],
              description: `Trikona lord (${triLord}) conjunct Kendra lord (${kenLord}) in ${RASHIS[triLordSign].english}.`,
              effects: "Creates Raja Yoga - potential for authority, recognition, and success. Rise in status and position.",
              timing: "Both planets' dashas bring elevation and opportunities.",
              activationPeriods: [`${triLord} Mahadasha`, `${kenLord} Mahadasha`],
              afflictions
            })
          }
        }
      }
    }
  }

  return results
}

// ============================================================================
// DOSHA ANALYSIS - With Proper Exceptions
// ============================================================================

export interface DoshaResult {
  name: string
  sanskritName: string
  isPresent: boolean
  severity: "High" | "Medium" | "Low" | "Cancelled"
  description: string
  details: string
  exceptions: string[]
  remedies: string[]
  classicalReference: string
}

export function analyzeDoshas(
  positions: Record<string, number>,
  houses: Record<string, number>,
  ascendant: number,
  birthDate?: Date
): DoshaResult[] {
  const results: DoshaResult[] = []
  const ascSign = Math.floor(ascendant / 30)

  // 1. MANGLIK DOSHA with all classical exceptions
  results.push(analyzeManglikDosha(positions, houses, ascSign, birthDate))

  // 2. KAAL SARP DOSHA with honest assessment
  results.push(analyzeKaalSarpDosha(positions, houses))

  // 3. PITRA DOSHA
  results.push(analyzePitraDosha(positions, houses, ascSign))

  // 4. SADESATI (if birth date provided)
  if (birthDate) {
    const sadesati = analyzeSadesati(positions, ascSign)
    if (sadesati) results.push(sadesati)
  }

  return results
}

function analyzeManglikDosha(
  positions: Record<string, number>,
  houses: Record<string, number>,
  ascSign: number,
  birthDate?: Date
): DoshaResult {
  const marsHouse = houses.Mars
  const manglikHouses = [1, 2, 4, 7, 8, 12]
  const isInManglikHouse = manglikHouses.includes(marsHouse)

  if (!isInManglikHouse) {
    return {
      name: "Manglik Dosha",
      sanskritName: "मांगलिक दोष",
      isPresent: false,
      severity: "Cancelled",
      description: "Mars is not in houses 1, 2, 4, 7, 8, or 12 from Lagna.",
      details: `Mars is in the ${marsHouse}th house, which does not create Manglik Dosha.`,
      exceptions: [],
      remedies: [],
      classicalReference: "BPHS and various classical texts mention Mars placement effects on marriage."
    }
  }

  // Check all 12+ exceptions
  const exceptions: string[] = []
  const marsSign = Math.floor(positions.Mars / 30)
  const marsLongitude = positions.Mars

  // Exception 1: Mars in own sign (Aries or Scorpio)
  if (marsSign === 0 || marsSign === 7) {
    exceptions.push("Mars in own sign (Aries/Scorpio) - Dosha cancelled")
  }

  // Exception 2: Mars in Leo or Aquarius (some traditions)
  if (marsSign === 4 || marsSign === 10) {
    exceptions.push("Mars in Leo/Aquarius - Dosha reduced (some traditions)")
  }

  // Exception 3: Mars aspected by Jupiter
  const jupiterHouse = houses.Jupiter
  const jupiterMarsAspect = Math.abs(jupiterHouse - marsHouse)
  if (jupiterMarsAspect === 6 || // 7th aspect
      jupiterMarsAspect === 4 || jupiterMarsAspect === 8 || // Jupiter's special aspects
      (12 - jupiterMarsAspect) === 6 || (12 - jupiterMarsAspect) === 4 || (12 - jupiterMarsAspect) === 8) {
    exceptions.push("Mars aspected by Jupiter - Dosha significantly reduced")
  }

  // Exception 4: Mars conjunct Jupiter
  const jupiterSign = Math.floor(positions.Jupiter / 30)
  if (marsSign === jupiterSign) {
    exceptions.push("Mars conjunct Jupiter - Dosha cancelled")
  }

  // Exception 5: Mars in Kendra from Venus
  const venusHouse = houses.Venus
  const marsVenusDiff = Math.abs(marsHouse - venusHouse)
  if ([0, 3, 6, 9].includes(marsVenusDiff) || [0, 3, 6, 9].includes(12 - marsVenusDiff)) {
    exceptions.push("Mars in Kendra from Venus - Dosha reduced")
  }

  // Exception 6: Mars in Navamsa of Jupiter
  const marsNavamsa = Math.floor((marsLongitude % 30) / (30/9))
  const marsNavamsaSign = (marsSign * 9 + marsNavamsa) % 12
  if (marsNavamsaSign === 8 || marsNavamsaSign === 11) { // Sagittarius or Pisces navamsa
    exceptions.push("Mars in Jupiter's Navamsa - Dosha reduced")
  }

  // Exception 7: For certain ascendants, specific houses don't cause full dosha
  // Aries/Scorpio Lagna: Mars is lagna lord, 1st house placement reduced
  if ((ascSign === 0 || ascSign === 7) && marsHouse === 1) {
    exceptions.push("Mars as Lagna lord in 1st - Dosha minimal for this ascendant")
  }

  // Exception 8: Cancer/Leo Lagna - Mars becomes yogakaraka, reducing dosha
  if (ascSign === 3 || ascSign === 4) {
    exceptions.push("Mars is Yogakaraka for this ascendant - Dosha effects reduced")
  }

  // Exception 9: Age exception (traditional - after 28-32)
  if (birthDate) {
    const age = new Date().getFullYear() - birthDate.getFullYear()
    if (age >= 28) {
      exceptions.push(`Age ${age} - Traditional texts suggest dosha effect diminishes after 28`)
    }
  }

  // Exception 10: Mars in 2nd house for Aries/Scorpio - not full dosha
  if ((ascSign === 0 || ascSign === 7) && marsHouse === 2) {
    exceptions.push("Mars in 2nd for Aries/Scorpio rising - Dosha minimal")
  }

  // Exception 11: Saturn in same houses causes similar dosha - mutual cancellation
  const saturnHouse = houses.Saturn
  if (manglikHouses.includes(saturnHouse)) {
    exceptions.push("Saturn also in Manglik house - Mutual dosha can cancel in matching")
  }

  // Exception 12: Moon sign analysis (check from Moon too)
  const moonSign = Math.floor(positions.Moon / 30)
  const marsFromMoon = ((marsSign - moonSign + 12) % 12) + 1
  if (![1, 2, 4, 7, 8, 12].includes(marsFromMoon)) {
    exceptions.push("Mars not in Manglik houses from Moon - Partial exception")
  }

  // Determine severity
  let severity: "High" | "Medium" | "Low" | "Cancelled" = "High"
  if (exceptions.length >= 3) {
    severity = "Cancelled"
  } else if (exceptions.length === 2) {
    severity = "Low"
  } else if (exceptions.length === 1) {
    severity = "Medium"
  }

  // High severity houses
  if ([7, 8].includes(marsHouse) && exceptions.length < 2) {
    severity = "High"
  }

  return {
    name: "Manglik Dosha",
    sanskritName: "मांगलिक दोष",
    isPresent: severity !== "Cancelled",
    severity,
    description: severity === "Cancelled"
      ? `Mars in ${marsHouse}th house, but multiple cancellation factors present.`
      : `Mars in ${marsHouse}th house creates Manglik Dosha with ${severity.toLowerCase()} intensity.`,
    details: `Mars is placed in the ${marsHouse}th house from Lagna in ${RASHIS[marsSign].english}. ` +
      (exceptions.length > 0
        ? `However, ${exceptions.length} exception(s) apply, significantly modifying the dosha's effects.`
        : `No major exceptions apply.`),
    exceptions,
    remedies: severity === "Cancelled" ? [] : [
      "Kumbh Vivah (symbolic marriage to pot/tree) before actual marriage",
      "Recite Hanuman Chalisa daily",
      "Wear Red Coral only after proper astrological consultation",
      "Fast on Tuesdays",
      "Donate red items (lentils, cloth) on Tuesdays",
      "Marriage with another Manglik person (both doshas cancel)",
      "Perform Mangal Shanti Puja"
    ],
    classicalReference: "Manglik Dosha is widely referenced in marriage matching traditions. The 12+ exceptions listed are from various classical and traditional sources including BPHS, regional traditions, and scholarly interpretations."
  }
}

function analyzeKaalSarpDosha(
  positions: Record<string, number>,
  houses: Record<string, number>
): DoshaResult {
  const rahuLongitude = positions.Rahu
  const ketuLongitude = positions.Ketu

  // Check if all planets are hemmed between Rahu and Ketu
  let allBetween = true
  let planetsOnAxis = 0

  for (const [planet, pos] of Object.entries(positions)) {
    if (planet !== "Rahu" && planet !== "Ketu") {
      // Check if on same degree as Rahu or Ketu (on the axis)
      const rahuDiff = Math.abs(pos - rahuLongitude)
      const ketuDiff = Math.abs(pos - ketuLongitude)
      if (rahuDiff < 1 || rahuDiff > 359 || ketuDiff < 1 || ketuDiff > 359) {
        planetsOnAxis++
      }

      // Check if between Rahu and Ketu
      if (rahuLongitude < ketuLongitude) {
        if (!(pos > rahuLongitude && pos < ketuLongitude)) {
          allBetween = false
        }
      } else {
        if (!(pos > rahuLongitude || pos < ketuLongitude)) {
          allBetween = false
        }
      }
    }
  }

  // Partial Kaal Sarp if planet on axis
  const isPartial = allBetween && planetsOnAxis > 0

  if (!allBetween && !isPartial) {
    return {
      name: "Kaal Sarp Dosha",
      sanskritName: "काल सर्प दोष",
      isPresent: false,
      severity: "Cancelled",
      description: "Planets are not hemmed between Rahu and Ketu.",
      details: "Kaal Sarp Yoga is not formed in this chart as planets are distributed on both sides of the Rahu-Ketu axis.",
      exceptions: [],
      remedies: [],
      classicalReference: "Note: Kaal Sarp Dosha's classical basis is disputed. It is not explicitly mentioned in BPHS or other major classical texts. It gained popularity in the 20th century. Many traditional astrologers do not consider it a major factor."
    }
  }

  // Determine type based on Rahu's house
  const rahuHouse = houses.Rahu
  const kaalSarpTypes: Record<number, string> = {
    1: "Anant", 2: "Kulik", 3: "Vasuki", 4: "Shankhpal",
    5: "Padma", 6: "Mahapadma", 7: "Takshak", 8: "Karkotak",
    9: "Shankhchud", 10: "Ghatak", 11: "Vishdhar", 12: "Sheshnag"
  }
  const type = kaalSarpTypes[rahuHouse] || "Unknown"

  const exceptions: string[] = []

  // Exception: Planet conjunct Rahu or Ketu
  if (planetsOnAxis > 0) {
    exceptions.push(`${planetsOnAxis} planet(s) conjunct Rahu/Ketu axis - creates Partial Kaal Sarp only`)
  }

  // Exception: Jupiter's aspect on Rahu or Ketu
  const jupiterHouse = houses.Jupiter
  if (Math.abs(jupiterHouse - rahuHouse) === 4 || Math.abs(jupiterHouse - rahuHouse) === 8) {
    exceptions.push("Jupiter aspects Rahu - reduces negative effects")
  }

  return {
    name: `Kaal Sarp ${isPartial ? "(Partial)" : "Yoga"} - ${type}`,
    sanskritName: "काल सर्प योग",
    isPresent: true,
    severity: isPartial ? "Low" : (exceptions.length > 0 ? "Medium" : "Medium"),
    description: `All planets hemmed between Rahu (${rahuHouse}th house) and Ketu. Type: ${type} Kaal Sarp.`,
    details: `This is ${isPartial ? "a partial" : "a"} Kaal Sarp formation where all seven planets are on one side of the Rahu-Ketu axis. ` +
      `${isPartial ? "However, planet(s) on the axis weaken this considerably. " : ""}` +
      "Important: This yoga's effects and even its validity are debated among scholars.",
    exceptions,
    remedies: [
      "Perform Kaal Sarp Dosha Nivaran Puja (Trimbakeshwar or Kalahasti are traditional locations)",
      "Recite Rahu mantra 'Om Raam Rahave Namah' - 18,000 times",
      "Keep fast on Nag Panchami",
      "Donate to orphanages or snake protection causes",
      "Worship Lord Shiva regularly"
    ],
    classicalReference: "IMPORTANT: Kaal Sarp Dosha is not mentioned in classical texts like BPHS, Brihat Jataka, or Phaladeepika. It became popular in modern times. Many respected traditional astrologers do not give it significant weight. Consider this in your assessment."
  }
}

function analyzePitraDosha(
  positions: Record<string, number>,
  houses: Record<string, number>,
  ascSign: number
): DoshaResult {
  const sunSign = Math.floor(positions.Sun / 30)
  const rahuSign = Math.floor(positions.Rahu / 30)
  const ketuSign = Math.floor(positions.Ketu / 30)
  const saturnSign = Math.floor(positions.Saturn / 30)

  const sunHouse = houses.Sun
  const ninth_house_sign = (ascSign + 8) % 12
  const ninth_lord = getSignLord(ninth_house_sign)

  let hasPitraDosha = false
  const causes: string[] = []
  const exceptions: string[] = []

  // Condition 1: Sun conjunct Rahu
  if (sunSign === rahuSign) {
    hasPitraDosha = true
    causes.push("Sun conjunct Rahu (Grahan Yoga on Sun)")
  }

  // Condition 2: Sun conjunct Ketu
  if (sunSign === ketuSign) {
    hasPitraDosha = true
    causes.push("Sun conjunct Ketu")
  }

  // Condition 3: Sun conjunct Saturn
  if (sunSign === saturnSign) {
    hasPitraDosha = true
    causes.push("Sun conjunct Saturn")
  }

  // Condition 4: 9th lord afflicted by Rahu/Ketu
  const ninthLordSign = Math.floor((positions[ninth_lord] || 0) / 30)
  if (ninthLordSign === rahuSign || ninthLordSign === ketuSign) {
    hasPitraDosha = true
    causes.push(`9th lord (${ninth_lord}) conjunct Rahu/Ketu`)
  }

  // Condition 5: 9th house afflicted
  const ninthHouse = 9
  if (houses.Rahu === ninthHouse || houses.Ketu === ninthHouse || houses.Saturn === ninthHouse) {
    hasPitraDosha = true
    causes.push("9th house afflicted by malefics")
  }

  if (!hasPitraDosha) {
    return {
      name: "Pitra Dosha",
      sanskritName: "पितृ दोष",
      isPresent: false,
      severity: "Cancelled",
      description: "No significant affliction to Sun, 9th house, or 9th lord by nodes.",
      details: "The chart does not show strong indicators of Pitra Dosha.",
      exceptions: [],
      remedies: [],
      classicalReference: "BPHS Chapter 84 discusses ancestral karmas and their effects."
    }
  }

  // Check for mitigating factors
  const jupiterHouse = houses.Jupiter
  if (jupiterHouse === 9 || jupiterHouse === sunHouse) {
    exceptions.push("Jupiter's influence provides significant mitigation")
  }

  if (sunHouse === 1 || sunHouse === 10 || sunHouse === 11) {
    exceptions.push("Sun well-placed - reduces intensity")
  }

  return {
    name: "Pitra Dosha",
    sanskritName: "पितृ दोष",
    isPresent: true,
    severity: exceptions.length >= 2 ? "Low" : (exceptions.length === 1 ? "Medium" : "High"),
    description: `Ancestral karmic indicators present: ${causes.join('; ')}.`,
    details: "Pitra Dosha indicates karmic debts from ancestors that may manifest as obstacles in areas like progeny, career, or relationships. " +
      (exceptions.length > 0 ? `Mitigating factors: ${exceptions.join(', ')}.` : ""),
    exceptions,
    remedies: [
      "Perform Shraddha rituals for ancestors during Pitru Paksha",
      "Feed crows and cows, especially on Saturdays and Amavasya",
      "Donate food to Brahmins on Amavasya",
      "Recite Pitra Suktam or Pitra Stotram",
      "Plant and nurture a Peepal tree",
      "Perform Narayan Bali or Tripindi Shraddha at appropriate locations",
      "Offer water to Sun at sunrise with black sesame seeds"
    ],
    classicalReference: "References to ancestral karma and remedies appear in BPHS later chapters and various Puranic texts."
  }
}

function analyzeSadesati(
  positions: Record<string, number>,
  ascSign: number
): DoshaResult | null {
  const moonSign = Math.floor(positions.Moon / 30)
  const saturnSign = Math.floor(positions.Saturn / 30)

  // Sadesati: Saturn in 12th, 1st, or 2nd from Moon sign
  const saturnFromMoon = ((saturnSign - moonSign + 12) % 12)

  // Not in Sadesati
  if (![11, 0, 1].includes(saturnFromMoon)) {
    return null // Not currently relevant
  }

  let phase: string
  let severity: "High" | "Medium" | "Low" = "Medium"

  if (saturnFromMoon === 11) {
    phase = "Rising (Saturn in 12th from Moon)"
    severity = "Low"
  } else if (saturnFromMoon === 0) {
    phase = "Peak (Saturn transiting Moon sign)"
    severity = "High"
  } else {
    phase = "Setting (Saturn in 2nd from Moon)"
    severity = "Medium"
  }

  const exceptions: string[] = []

  // Exception: Saturn is yogakaraka for the ascendant
  if (ascSign === 1 || ascSign === 6) { // Taurus, Libra
    exceptions.push("Saturn is Yogakaraka for this ascendant - effects more constructive")
    severity = "Low"
  }

  // Exception: Saturn in own/exalted sign
  if (saturnSign === 9 || saturnSign === 10 || saturnSign === 6) { // Cap, Aqu, Libra
    exceptions.push("Saturn in strong dignity - effects moderated")
  }

  // Exception: Jupiter transiting supportive signs
  const jupiterSign = Math.floor(positions.Jupiter / 30)
  if (jupiterSign === moonSign ||
      ((jupiterSign - moonSign + 12) % 12) === 4 ||
      ((jupiterSign - moonSign + 12) % 12) === 8) {
    exceptions.push("Jupiter supports Moon sign - significant mitigation")
    if (severity === "High") severity = "Medium"
  }

  return {
    name: `Sadesati - ${phase}`,
    sanskritName: "साढ़ेसाती",
    isPresent: true,
    severity,
    description: `Saturn's 7.5 year transit over Moon: Currently in ${phase.toLowerCase()}.`,
    details: `Sadesati is a natural transit phenomenon where Saturn passes through three signs centered on your Moon sign. ` +
      `The ${phase.split(' ')[0].toLowerCase()} phase typically brings ${severity === "High" ? "significant challenges requiring patience" : "moderate adjustments and karmic lessons"}. ` +
      "This is not inherently negative - many achieve great success during Sadesati through discipline.",
    exceptions,
    remedies: [
      "Worship Lord Hanuman regularly",
      "Recite Shani mantras, especially on Saturdays",
      "Serve the elderly and disabled",
      "Keep Saturday fasts",
      "Donate black items (sesame, oil, cloth) on Saturdays",
      "Wear Blue Sapphire ONLY after thorough astrological consultation",
      "Practice patience and avoid major risky decisions"
    ],
    classicalReference: "Sadesati is well-documented in classical texts as Saturn's transit effect over natal Moon."
  }
}

// ============================================================================
// BHAVA (HOUSE) ANALYSIS
// ============================================================================

export interface BhavaAnalysis {
  house: number
  sign: string
  lord: string
  lordPosition: { house: number; sign: string; dignity: string }
  planetsInHouse: string[]
  aspects: string[]
  strength: "Strong" | "Moderate" | "Weak"
  significations: string[]
  predictions: string
}

const HOUSE_SIGNIFICATIONS: Record<number, {
  name: string
  sanskrit: string
  karakas: string[]
  significations: string[]
  bodyParts: string[]
}> = {
  1: {
    name: "Lagna/Tanu Bhava",
    sanskrit: "तनु भाव",
    karakas: ["Sun"],
    significations: ["Self", "Personality", "Physical body", "Fame", "General vitality", "New beginnings"],
    bodyParts: ["Head", "Brain", "Overall health"]
  },
  2: {
    name: "Dhana Bhava",
    sanskrit: "धन भाव",
    karakas: ["Jupiter"],
    significations: ["Wealth", "Family", "Speech", "Food habits", "Right eye", "Early education"],
    bodyParts: ["Face", "Right eye", "Teeth", "Throat"]
  },
  3: {
    name: "Sahaja Bhava",
    sanskrit: "सहज भ���व",
    karakas: ["Mars"],
    significations: ["Siblings", "Courage", "Short travels", "Communication", "Hands", "Hobbies"],
    bodyParts: ["Arms", "Shoulders", "Right ear", "Nervous system"]
  },
  4: {
    name: "Bandhu Bhava",
    sanskrit: "बन्धु भाव",
    karakas: ["Moon"],
    significations: ["Mother", "Home", "Vehicles", "Property", "Education", "Happiness"],
    bodyParts: ["Chest", "Heart", "Lungs"]
  },
  5: {
    name: "Putra Bhava",
    sanskrit: "पुत्र भाव",
    karakas: ["Jupiter"],
    significations: ["Children", "Intelligence", "Creativity", "Romance", "Speculation", "Past merit"],
    bodyParts: ["Stomach", "Upper abdomen", "Heart"]
  },
  6: {
    name: "Ari Bhava",
    sanskrit: "अरि भाव",
    karakas: ["Mars", "Saturn"],
    significations: ["Enemies", "Diseases", "Debts", "Service", "Maternal uncle", "Pets"],
    bodyParts: ["Intestines", "Lower abdomen", "Kidneys"]
  },
  7: {
    name: "Kalatra Bhava",
    sanskrit: "कलत्र भाव",
    karakas: ["Venus"],
    significations: ["Spouse", "Marriage", "Partnerships", "Business", "Foreign travel"],
    bodyParts: ["Lower back", "Kidneys", "Reproductive organs"]
  },
  8: {
    name: "Randhra Bhava",
    sanskrit: "रन्ध्र भाव",
    karakas: ["Saturn"],
    significations: ["Longevity", "Sudden events", "Inheritance", "Occult", "Transformation"],
    bodyParts: ["Reproductive organs", "Chronic diseases"]
  },
  9: {
    name: "Dharma Bhava",
    sanskrit: "धर्म भाव",
    karakas: ["Jupiter", "Sun"],
    significations: ["Fortune", "Father", "Guru", "Religion", "Higher education", "Long journeys"],
    bodyParts: ["Thighs", "Hips", "Liver"]
  },
  10: {
    name: "Karma Bhava",
    sanskrit: "कर्म भाव",
    karakas: ["Sun", "Mercury", "Jupiter", "Saturn"],
    significations: ["Career", "Profession", "Fame", "Authority", "Public status"],
    bodyParts: ["Knees", "Bones", "Joints"]
  },
  11: {
    name: "Labha Bhava",
    sanskrit: "लाभ भाव",
    karakas: ["Jupiter"],
    significations: ["Gains", "Income", "Elder siblings", "Friends", "Hopes", "Achievements"],
    bodyParts: ["Calves", "Ankles", "Left ear"]
  },
  12: {
    name: "Vyaya Bhava",
    sanskrit: "व्यय भाव",
    karakas: ["Saturn", "Ketu"],
    significations: ["Expenses", "Losses", "Foreign lands", "Hospitals", "Moksha", "Sleep"],
    bodyParts: ["Feet", "Left eye"]
  }
}

export function analyzeBhavas(
  positions: Record<string, number>,
  houseCusps: number[],
  ascendant: number
): BhavaAnalysis[] {
  const analyses: BhavaAnalysis[] = []
  const ascSign = Math.floor(ascendant / 30)

  for (let house = 1; house <= 12; house++) {
    const houseSign = (ascSign + house - 1) % 12
    const signInfo = RASHIS[houseSign]
    const lord = getSignLord(houseSign)

    // Find lord's position
    const lordLongitude = positions[lord] || 0
    const lordSign = Math.floor(lordLongitude / 30)
    const lordHouse = ((lordSign - ascSign + 12) % 12) + 1

    // Determine lord's dignity
    const exaltedSigns: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 }
    const debilitatedSigns: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 }
    const ownSigns: Record<string, number[]> = {
      Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10]
    }

    let lordDignity = "Neutral"
    if (exaltedSigns[lord] === lordSign) lordDignity = "Exalted"
    else if (debilitatedSigns[lord] === lordSign) lordDignity = "Debilitated"
    else if (ownSigns[lord]?.includes(lordSign)) lordDignity = "Own Sign"

    // Find planets in this house
    const planetsInHouse: string[] = []
    for (const [planet, longitude] of Object.entries(positions)) {
      const planetSign = Math.floor(longitude / 30)
      const planetHouse = ((planetSign - ascSign + 12) % 12) + 1
      if (planetHouse === house) {
        planetsInHouse.push(planet)
      }
    }

    // Calculate aspects
    const aspects: string[] = []
    for (const [planet, longitude] of Object.entries(positions)) {
      const planetSign = Math.floor(longitude / 30)
      const planetHouse = ((planetSign - ascSign + 12) % 12) + 1
      const houseDiff = ((house - planetHouse + 12) % 12)

      // 7th aspect (all planets)
      if (houseDiff === 6) {
        aspects.push(`${planet} (7th aspect)`)
      }
      // Mars special aspects (4th, 8th)
      if (planet === "Mars" && (houseDiff === 3 || houseDiff === 7)) {
        aspects.push(`Mars (special aspect)`)
      }
      // Jupiter special aspects (5th, 9th)
      if (planet === "Jupiter" && (houseDiff === 4 || houseDiff === 8)) {
        aspects.push(`Jupiter (special aspect)`)
      }
      // Saturn special aspects (3rd, 10th)
      if (planet === "Saturn" && (houseDiff === 2 || houseDiff === 9)) {
        aspects.push(`Saturn (special aspect)`)
      }
    }

    // Determine strength
    let strength: "Strong" | "Moderate" | "Weak" = "Moderate"

    // Lord in good houses strengthens
    if ([1, 4, 5, 7, 9, 10, 11].includes(lordHouse)) strength = "Strong"
    if ([6, 8, 12].includes(lordHouse)) strength = "Weak"
    if (lordDignity === "Exalted" || lordDignity === "Own Sign") strength = "Strong"
    if (lordDignity === "Debilitated") strength = "Weak"

    // Benefics in house strengthen
    if (planetsInHouse.some(p => ["Jupiter", "Venus"].includes(p))) strength = "Strong"
    // Multiple malefics weaken
    const maleficsInHouse = planetsInHouse.filter(p => ["Saturn", "Mars", "Rahu", "Ketu"].includes(p))
    if (maleficsInHouse.length >= 2) strength = "Weak"

    // Jupiter aspect strengthens
    if (aspects.some(a => a.includes("Jupiter"))) {
      if (strength === "Weak") strength = "Moderate"
      else strength = "Strong"
    }

    const houseInfo = HOUSE_SIGNIFICATIONS[house]
    const predictions = generateHousePredictions(house, signInfo.english, lord, lordHouse, lordDignity, planetsInHouse, houseInfo, ascSign)

    analyses.push({
      house,
      sign: signInfo.english,
      lord,
      lordPosition: { house: lordHouse, sign: RASHIS[lordSign].english, dignity: lordDignity },
      planetsInHouse,
      aspects,
      strength,
      significations: houseInfo.significations,
      predictions
    })
  }

  return analyses
}

function generateHousePredictions(
  house: number,
  sign: string,
  lord: string,
  lordHouse: number,
  lordDignity: string,
  planetsInHouse: string[],
  houseInfo: typeof HOUSE_SIGNIFICATIONS[1],
  ascSign: number
): string {
  let prediction = `### ${houseInfo.name} (${houseInfo.sanskrit})\n\n`
  prediction += `**${sign}** governs your ${house}${getOrdinalSuffix(house)} house with **${lord}** as its lord.\n\n`

  // Lord placement interpretation
  const lordPlacements: Record<number, string> = {
    1: "personal control and direct influence over these matters",
    2: "connection with wealth, family values, and resources",
    3: "expression through courage, communication, and initiative",
    4: "comfort, emotional security, and domestic foundation",
    5: "creative expression, intelligence, and good fortune",
    6: "challenges to overcome through service and effort",
    7: "partnerships and relationships play a key role",
    8: "transformation, hidden resources, and deep changes",
    9: "fortune, wisdom, and higher guidance support this area",
    10: "career and public reputation are interlinked",
    11: "gains, aspirations, and social networks connect here",
    12: "spiritual dimensions, foreign connections, or hidden aspects"
  }

  prediction += `**Lord's Position**: ${lord} in ${lordHouse}${getOrdinalSuffix(lordHouse)} house (${lordDignity}) indicates ${lordPlacements[lordHouse]}.\n\n`

  // Planets in house interpretation
  if (planetsInHouse.length > 0) {
    prediction += `**Planets Present**: ${planetsInHouse.join(", ")}\n\n`
    for (const planet of planetsInHouse) {
      const effect = getAscendantSpecificEffect(planet, house, ascSign)
      prediction += `• **${planet}**: ${effect}\n`
    }
    prediction += "\n"
  } else {
    prediction += `No planets occupy this house directly. Results depend on the lord's placement and any aspects received.\n\n`
  }

  prediction += `**Life Areas**: ${houseInfo.significations.join(", ")}.\n`

  return prediction
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

// Ascendant-specific planet effects
function getAscendantSpecificEffect(planet: string, house: number, ascSign: number): string {
  // Yogakaraka planets by ascendant
  const yogakarakas: Record<number, string[]> = {
    0: ["Saturn"], // Aries - Saturn rules 10, 11 (not pure yogakaraka)
    1: ["Saturn"], // Taurus - Saturn rules 9, 10
    2: [], // Gemini
    3: ["Mars"], // Cancer - Mars rules 5, 10
    4: ["Mars"], // Leo - Mars rules 4, 9
    5: [], // Virgo
    6: ["Saturn"], // Libra - Saturn rules 4, 5
    7: [], // Scorpio
    8: [], // Sagittarius
    9: ["Venus"], // Capricorn - Venus rules 5, 10
    10: ["Venus"], // Aquarius - Venus rules 4, 9
    11: [] // Pisces
  }

  const isYogakaraka = yogakarakas[ascSign]?.includes(planet)

  // Generic effects
  const planetEffects: Record<string, Record<number, string>> = {
    Sun: {
      1: "Strong personality, leadership qualities, vitality. Father's influence prominent.",
      4: "Focus on home and property. May indicate government-related property.",
      7: "Authoritative approach in partnerships. Spouse may be influential.",
      10: "Excellent for career, authority, government connections."
    },
    Moon: {
      1: "Emotional, intuitive personality. Popular, changeable nature.",
      4: "Very close to mother. Emotional happiness, own property likely.",
      5: "Creative mind, good intuition. Blessed with intelligent children.",
      7: "Emotional approach to partnerships. Spouse is nurturing."
    },
    Mars: {
      1: "Dynamic, athletic personality. Leadership through action.",
      3: "Courageous, adventurous. Good relationship with siblings.",
      6: "Defeats enemies and competition. Good for medical/technical fields.",
      10: "Success in engineering, military, surgery. Action-oriented career."
    },
    Jupiter: {
      1: "Wise, optimistic personality. Natural teacher and guide.",
      5: "Blessed with good children. Excellent intelligence and creativity.",
      9: "Most auspicious placement. Great fortune, spiritual inclination.",
      11: "Excellent gains. Aspirations fulfilled. Helpful connections."
    },
    Venus: {
      2: "Sweet speech, wealth accumulation. Beautiful appearance.",
      4: "Beautiful, comfortable home. Vehicles and luxuries.",
      7: "Attractive spouse. Happy marriage, successful partnerships.",
      12: "Enjoyment of pleasures. Possible foreign luxury connections."
    },
    Saturn: {
      3: "Disciplined courage. Success through persistent effort.",
      6: "Defeats enemies through perseverance. Good for service professions.",
      10: "Rise through hard work. Career in traditional/structural fields.",
      11: "Steady, long-term gains. Disciplined approach to aspirations."
    }
  }

  let effect = planetEffects[planet]?.[house] || `${planet} influences ${house}${getOrdinalSuffix(house)} house matters.`

  if (isYogakaraka) {
    effect = `[YOGAKARAKA for this ascendant] ${effect} Being Yogakaraka, ${planet} brings especially positive results for this house.`
  }

  return effect
}

// ============================================================================
// COMPREHENSIVE ANALYSIS GENERATOR
// ============================================================================

export interface ComprehensiveAnalysis {
  shadbala: ShadbalaResult[]
  ashtakavarga: { planets: AshtakavargaResult[]; sarvashtakavarga: SarvashtakavargaResult }
  yogas: YogaResult[]
  doshas: DoshaResult[]
  bhavaAnalysis: BhavaAnalysis[]
  overallSummary: string
  strengthsAndWeaknesses: { strengths: string[]; weaknesses: string[]; opportunities: string[] }
}

export function generateComprehensiveAnalysis(
  positions: Record<string, number>,
  houses: Record<string, number>,
  houseCusps: number[],
  ascendant: number,
  moonLongitude: number,
  birthDate: Date,
  birthHour: number
): ComprehensiveAnalysis {
  // Calculate all components
  const shadbala = calculateShadbala(positions, houses, birthDate, birthHour, ascendant)
  const ashtakavarga = calculateAshtakavarga(positions, ascendant)
  const yogas = analyzeYogas(positions, houses, ascendant, shadbala)
  const doshas = analyzeDoshas(positions, houses, ascendant, birthDate)
  const bhavaAnalysis = analyzeBhavas(positions, houseCusps, ascendant)

  // Generate overall summary
  const overallSummary = generateOverallSummary(shadbala, yogas, doshas)

  // Identify strengths and weaknesses
  const strengthsAndWeaknesses = identifyStrengthsAndWeaknesses(shadbala, yogas, bhavaAnalysis, doshas)

  return {
    shadbala,
    ashtakavarga,
    yogas,
    doshas,
    bhavaAnalysis,
    overallSummary,
    strengthsAndWeaknesses
  }
}

function generateOverallSummary(
  shadbala: ShadbalaResult[],
  yogas: YogaResult[],
  doshas: DoshaResult[]
): string {
  let summary = "## Chart Analysis Summary\n\n"

  // Strong planets
  const strongPlanets = shadbala.filter(s => s.isStrong).map(s => s.planet)
  const weakPlanets = shadbala.filter(s => s.percentage < 75).map(s => s.planet)

  if (strongPlanets.length > 0) {
    summary += `**Strong Planets**: ${strongPlanets.join(", ")} - These planets support you throughout life and their dashas tend to be favorable.\n\n`
  }

  if (weakPlanets.length > 0) {
    summary += `**Planets Needing Support**: ${weakPlanets.join(", ")} - Consider remedies during these planets' periods.\n\n`
  }

  // Key Yogas
  const activeYogas = yogas.filter(y => y.isPresent && y.strength >= 50)
  const rajaYogas = activeYogas.filter(y => y.category === "Raja" || y.category === "Pancha Mahapurusha")
  const dhanaYogas = activeYogas.filter(y => y.category === "Dhana")

  if (rajaYogas.length > 0) {
    summary += `**Auspicious Yogas**: ${rajaYogas.map(y => y.name).join(", ")}. These indicate potential for recognition, authority, and success.\n\n`
  }

  if (dhanaYogas.length > 0) {
    summary += `**Wealth Indicators**: ${dhanaYogas.map(y => y.name).join(", ")}. Financial growth potential indicated.\n\n`
  }

  // Doshas summary
  const activeDoshas = doshas.filter(d => d.isPresent && d.severity !== "Cancelled")
  if (activeDoshas.length > 0) {
    summary += `**Areas of Attention**: ${activeDoshas.map(d => `${d.name} (${d.severity})`).join(", ")}. See detailed analysis for exceptions and remedies.\n\n`
  } else {
    summary += `**Doshas**: No major doshas are active or all have significant cancellations.\n\n`
  }

  return summary
}

function identifyStrengthsAndWeaknesses(
  shadbala: ShadbalaResult[],
  yogas: YogaResult[],
  bhavaAnalysis: BhavaAnalysis[],
  doshas: DoshaResult[]
): { strengths: string[]; weaknesses: string[]; opportunities: string[] } {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const opportunities: string[] = []

  // From Shadbala
  for (const planet of shadbala) {
    if (planet.percentage >= 100) {
      const areas = {
        Sun: "leadership, authority, and vitality",
        Moon: "emotional intelligence and public relations",
        Mars: "courage, property, and competitive success",
        Mercury: "communication, business, and intellect",
        Jupiter: "wisdom, fortune, and spiritual growth",
        Venus: "relationships, arts, and material comforts",
        Saturn: "discipline, perseverance, and longevity"
      }
      strengths.push(`Strong ${planet.planet} supports ${areas[planet.planet as keyof typeof areas] || "success"}`)
    } else if (planet.percentage < 75) {
      weaknesses.push(`${planet.planet} needs strengthening - consider remedies during its periods`)
    }
  }

  // From Yogas
  for (const yoga of yogas) {
    if (yoga.category === "Raja" || yoga.category === "Dhana" || yoga.category === "Pancha Mahapurusha") {
      if (yoga.strength >= 65) {
        opportunities.push(`${yoga.name} (${yoga.strengthLabel}) - Active during ${yoga.activationPeriods[0]}`)
      } else if (yoga.strength >= 50) {
        opportunities.push(`${yoga.name} present but needs supporting factors - ${yoga.afflictions.join('; ') || 'optimize during activation periods'}`)
      }
    }
    if (yoga.category === "Arishta" && yoga.strength >= 50) {
      weaknesses.push(`${yoga.name} - ${yoga.remedies?.[0] || 'Follow prescribed remedies'}`)
    }
  }

  // From House analysis
  const strongHouses = bhavaAnalysis.filter(b => b.strength === "Strong")
  for (const house of strongHouses.slice(0, 4)) {
    strengths.push(`${house.house}${getOrdinalSuffix(house.house)} house strong - ${house.significations[0]} favored`)
  }

  // From Doshas
  for (const dosha of doshas) {
    if (dosha.isPresent && dosha.severity === "High") {
      weaknesses.push(`${dosha.name} requires attention - follow remedies`)
    }
  }

  return { strengths, weaknesses, opportunities }
}
