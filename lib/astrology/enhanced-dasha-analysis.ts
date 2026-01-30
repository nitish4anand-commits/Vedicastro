// Enhanced Dasha Analysis System - State of the Art
// Provides Antardasha, Planet Strength, Functional Nature, Predictions, and Remedies

import { RASHIS, NAKSHATRAS, DASHA_YEARS, DASHA_SEQUENCE } from './calculations'

// Antardasha duration proportions (relative to Mahadasha)
const ANTARDASHA_PROPORTIONS: Record<string, Record<string, number>> = {
  Sun: { Sun: 0.36, Moon: 0.60, Mars: 0.42, Rahu: 1.08, Jupiter: 0.96, Saturn: 1.14, Mercury: 1.02, Ketu: 0.42, Venus: 1.20 },
  Moon: { Moon: 1.00, Mars: 0.70, Rahu: 1.80, Jupiter: 1.60, Saturn: 1.90, Mercury: 1.70, Ketu: 0.70, Venus: 2.00, Sun: 0.60 },
  Mars: { Mars: 0.49, Rahu: 1.26, Jupiter: 1.12, Saturn: 1.33, Mercury: 1.19, Ketu: 0.49, Venus: 1.40, Sun: 0.42, Moon: 0.70 },
  Rahu: { Rahu: 3.24, Jupiter: 2.88, Saturn: 3.42, Mercury: 3.06, Ketu: 1.26, Venus: 3.60, Sun: 1.08, Moon: 1.80, Mars: 1.26 },
  Jupiter: { Jupiter: 2.56, Saturn: 3.04, Mercury: 2.72, Ketu: 1.12, Venus: 3.20, Sun: 0.96, Moon: 1.60, Mars: 1.12, Rahu: 2.88 },
  Saturn: { Saturn: 3.61, Mercury: 3.23, Ketu: 1.33, Venus: 3.80, Sun: 1.14, Moon: 1.90, Mars: 1.33, Rahu: 3.42, Jupiter: 3.04 },
  Mercury: { Mercury: 2.89, Ketu: 1.19, Venus: 3.40, Sun: 1.02, Moon: 1.70, Mars: 1.19, Rahu: 3.06, Jupiter: 2.72, Saturn: 3.23 },
  Ketu: { Ketu: 0.49, Venus: 1.40, Sun: 0.42, Moon: 0.70, Mars: 0.49, Rahu: 1.26, Jupiter: 1.12, Saturn: 1.33, Mercury: 1.19 },
  Venus: { Venus: 4.00, Sun: 1.20, Moon: 2.00, Mars: 1.40, Rahu: 3.60, Jupiter: 3.20, Saturn: 3.80, Mercury: 3.40, Ketu: 1.40 }
}

// Planet strength factors
export interface PlanetStrength {
  overall: number // 0-100
  dignity: 'Exalted' | 'Own' | 'Friend' | 'Neutral' | 'Enemy' | 'Debilitated'
  dignityScore: number
  housePlacement: number // 1-12
  houseStrength: 'Excellent' | 'Good' | 'Average' | 'Challenging'
  aspects: string[] // Planets aspecting this planet
  conjunctions: string[] // Planets conjunct
  isRetrograde: boolean
  isCombust: boolean
}

// Functional nature based on ascendant
export type FunctionalNature = 'Yogakaraka' | 'Benefic' | 'Neutral' | 'Malefic' | 'Maraka'

// Enhanced Dasha Period
export interface EnhancedMahadasha {
  planet: string
  startDate: Date
  endDate: Date
  years: number
  strength: PlanetStrength
  functionalNature: FunctionalNature
  housesRuled: number[]
  antardashas: Antardasha[]
  predictions: DashaPredictions
  activatedYogas: string[]
  remedies: Remedy[]
}

export interface Antardasha {
  planet: string
  startDate: Date
  endDate: Date
  years: number
  months: number
  days: number
  isCurrent: boolean
  quality: 'Excellent' | 'Good' | 'Mixed' | 'Challenging' | 'Difficult'
  keyEvents: string[]
}

export interface DashaPredictions {
  career: string[]
  wealth: string[]
  relationships: string[]
  health: string[]
  spiritual: string[]
  favorable: boolean
  challenges: string[]
  opportunities: string[]
}

export interface Remedy {
  type: 'Mantra' | 'Gemstone' | 'Charity' | 'Fasting' | 'Worship' | 'Lifestyle'
  description: string
  frequency?: string
  caution?: string
}

// Exaltation, Debilitation, Own signs for planets
const PLANET_DIGNITY: Record<string, {
  exaltation: number
  debilitation: number
  own: number[]
  friend: number[]
  enemy: number[]
}> = {
  Sun: { exaltation: 0, debilitation: 6, own: [4], friend: [0, 8, 11], enemy: [5, 6, 10] },
  Moon: { exaltation: 1, debilitation: 7, own: [3], friend: [0, 4], enemy: [2, 5, 9, 10] },
  Mars: { exaltation: 9, debilitation: 3, own: [0, 7], friend: [0, 3, 4], enemy: [2, 5] },
  Mercury: { exaltation: 5, debilitation: 8, own: [2, 5], friend: [1, 2, 5], enemy: [3] },
  Jupiter: { exaltation: 3, debilitation: 9, own: [8, 11], friend: [0, 3, 4], enemy: [2, 5] },
  Venus: { exaltation: 11, debilitation: 5, own: [1, 6], friend: [2, 5, 10], enemy: [0, 3, 4] },
  Saturn: { exaltation: 6, debilitation: 0, own: [9, 10], friend: [2, 5, 6], enemy: [0, 3, 4] },
  Rahu: { exaltation: 2, debilitation: 8, own: [], friend: [2, 5, 10], enemy: [0, 3, 4] },
  Ketu: { exaltation: 8, debilitation: 2, own: [], friend: [0, 3, 4], enemy: [2, 5] }
}

// Functional lordship based on ascendant (which houses each planet rules)
const FUNCTIONAL_LORDSHIP: Record<number, Record<string, number[]>> = {
  0: { Mars: [1, 8], Venus: [2, 7], Mercury: [3, 6], Moon: [4], Sun: [5], Jupiter: [9, 12], Saturn: [10, 11] }, // Aries
  1: { Venus: [1, 6], Mercury: [2, 5], Moon: [3], Sun: [4], Mars: [7, 12], Saturn: [9, 10], Jupiter: [8, 11] }, // Taurus
  2: { Mercury: [1, 4], Venus: [5, 12], Moon: [2], Sun: [3], Mars: [6, 11], Jupiter: [7, 10], Saturn: [8, 9] }, // Gemini
  3: { Moon: [1], Sun: [2], Mercury: [3, 12], Venus: [4, 11], Mars: [5, 10], Jupiter: [6, 9], Saturn: [7, 8] }, // Cancer
  4: { Sun: [1], Mercury: [2, 11], Venus: [3, 10], Moon: [12], Mars: [4, 9], Saturn: [6, 7], Jupiter: [5, 8] }, // Leo
  5: { Mercury: [1, 10], Venus: [2, 9], Moon: [11], Sun: [12], Mars: [3, 8], Jupiter: [4, 7], Saturn: [5, 6] }, // Virgo
  6: { Venus: [1, 8], Mercury: [9, 12], Moon: [10], Sun: [11], Mars: [2, 7], Saturn: [4, 5], Jupiter: [3, 6] }, // Libra
  7: { Mars: [1, 6], Venus: [7, 12], Mercury: [8, 11], Moon: [9], Sun: [10], Jupiter: [2, 5], Saturn: [3, 4] }, // Scorpio
  8: { Jupiter: [1, 4], Saturn: [2, 3], Mars: [5, 12], Venus: [6, 11], Mercury: [7, 10], Moon: [8], Sun: [9] }, // Sagittarius
  9: { Saturn: [1, 2], Jupiter: [3, 12], Mars: [4, 11], Venus: [5, 10], Mercury: [6, 9], Moon: [7], Sun: [8] }, // Capricorn
  10: { Saturn: [1, 12], Jupiter: [2, 11], Mars: [3, 10], Venus: [4, 9], Mercury: [5, 8], Moon: [6], Sun: [7] }, // Aquarius
  11: { Jupiter: [1, 10], Saturn: [11, 12], Mars: [2, 9], Venus: [3, 8], Mercury: [4, 7], Moon: [5], Sun: [6] }  // Pisces
}

// Calculate planet strength
export function calculatePlanetStrength(
  planetName: string,
  signIndex: number,
  houseNumber: number,
  isRetrograde: boolean,
  isCombust: boolean,
  aspects: string[],
  conjunctions: string[]
): PlanetStrength {
  const dignity = PLANET_DIGNITY[planetName]
  if (!dignity) {
    return {
      overall: 50,
      dignity: 'Neutral',
      dignityScore: 0,
      housePlacement: houseNumber,
      houseStrength: 'Average',
      aspects,
      conjunctions,
      isRetrograde,
      isCombust
    }
  }

  // Dignity score
  let dignityScore = 0
  let dignityLabel: PlanetStrength['dignity'] = 'Neutral'

  if (signIndex === dignity.exaltation) {
    dignityScore = 5
    dignityLabel = 'Exalted'
  } else if (signIndex === dignity.debilitation) {
    dignityScore = -5
    dignityLabel = 'Debilitated'
  } else if (dignity.own.includes(signIndex)) {
    dignityScore = 4
    dignityLabel = 'Own'
  } else if (dignity.friend.includes(signIndex)) {
    dignityScore = 2
    dignityLabel = 'Friend'
  } else if (dignity.enemy.includes(signIndex)) {
    dignityScore = -2
    dignityLabel = 'Enemy'
  }

  // House strength (Kendras and Trines are strong)
  const kendras = [1, 4, 7, 10]
  const trines = [1, 5, 9]
  const dusthanas = [6, 8, 12]

  let houseStrength: PlanetStrength['houseStrength'] = 'Average'
  let houseScore = 0

  if (kendras.includes(houseNumber) && trines.includes(houseNumber)) {
    houseStrength = 'Excellent' // 1st house
    houseScore = 5
  } else if (kendras.includes(houseNumber) || trines.includes(houseNumber)) {
    houseStrength = 'Good'
    houseScore = 3
  } else if (dusthanas.includes(houseNumber)) {
    houseStrength = 'Challenging'
    houseScore = -3
  } else {
    houseScore = 1
  }

  // Retrograde and combustion penalties
  let retroScore = isRetrograde && planetName !== 'Rahu' && planetName !== 'Ketu' ? -1 : 0
  let combustScore = isCombust ? -2 : 0

  // Aspect bonuses (simplified - if aspected by Jupiter, benefic boost)
  let aspectScore = 0
  if (aspects.includes('Jupiter')) aspectScore += 2
  if (aspects.includes('Venus')) aspectScore += 1
  if (aspects.includes('Saturn')) aspectScore -= 1
  if (aspects.includes('Mars')) aspectScore -= 1

  // Calculate overall (0-100)
  const rawScore = 50 + (dignityScore * 5) + (houseScore * 3) + retroScore + combustScore + aspectScore
  const overall = Math.max(0, Math.min(100, rawScore))

  return {
    overall,
    dignity: dignityLabel,
    dignityScore,
    housePlacement: houseNumber,
    houseStrength,
    aspects,
    conjunctions,
    isRetrograde,
    isCombust
  }
}

// Determine functional nature based on ascendant
export function getFunctionalNature(planetName: string, ascendantSign: number): FunctionalNature {
  const lordship = FUNCTIONAL_LORDSHIP[ascendantSign]
  if (!lordship || !lordship[planetName]) return 'Neutral'

  const housesRuled = lordship[planetName]
  const kendras = [1, 4, 7, 10]
  const trines = [1, 5, 9]
  const dusthanas = [6, 8, 12]
  const marakas = [2, 7]

  // Yogakaraka: Rules both Kendra and Trine
  const hasKendra = housesRuled.some(h => kendras.includes(h))
  const hasTrine = housesRuled.some(h => trines.includes(h))
  if (hasKendra && hasTrine && housesRuled.length === 2) {
    return 'Yogakaraka'
  }

  // Maraka: Rules 2nd or 7th
  if (housesRuled.some(h => marakas.includes(h))) {
    return 'Maraka'
  }

  // Malefic: Rules dusthanas
  if (housesRuled.every(h => dusthanas.includes(h))) {
    return 'Malefic'
  }

  // Benefic: Rules trines or kendras
  if (hasKendra || hasTrine) {
    return 'Benefic'
  }

  return 'Neutral'
}

// Natural planetary friendships for quality calculation
const NATURAL_FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'],
  Moon: ['Sun', 'Mercury'],
  Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'],
  Jupiter: ['Sun', 'Moon', 'Mars'],
  Venus: ['Mercury', 'Saturn'],
  Saturn: ['Mercury', 'Venus'],
  Rahu: ['Mercury', 'Venus', 'Saturn'],
  Ketu: ['Mars', 'Jupiter']
}

const NATURAL_ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn', 'Rahu', 'Ketu'],
  Moon: ['Rahu', 'Ketu'],
  Mars: ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'],
  Venus: ['Sun', 'Moon'],
  Saturn: ['Sun', 'Moon', 'Mars'],
  Rahu: ['Sun', 'Moon', 'Mars'],
  Ketu: ['Sun', 'Moon']
}

// Calculate antardasha quality based on planet relationships
function calculateAntardashaQuality(
  mahadashaLord: string,
  antardashaLord: string
): 'Excellent' | 'Good' | 'Mixed' | 'Challenging' | 'Difficult' {
  // Same planet - generally good
  if (mahadashaLord === antardashaLord) {
    return 'Good'
  }

  const friends = NATURAL_FRIENDS[mahadashaLord] || []
  const enemies = NATURAL_ENEMIES[mahadashaLord] || []

  // Special excellent combinations
  const excellentCombos: Record<string, string[]> = {
    Jupiter: ['Sun', 'Moon', 'Mars'],
    Venus: ['Mercury', 'Saturn'],
    Moon: ['Jupiter'],
    Sun: ['Jupiter', 'Mars'],
    Mars: ['Jupiter', 'Sun']
  }

  if (excellentCombos[mahadashaLord]?.includes(antardashaLord)) {
    return 'Excellent'
  }

  if (friends.includes(antardashaLord)) {
    return 'Good'
  }

  if (enemies.includes(antardashaLord)) {
    // Check for difficult combinations
    const difficultCombos = [
      ['Saturn', 'Mars'],
      ['Sun', 'Saturn'],
      ['Moon', 'Rahu'],
      ['Moon', 'Ketu'],
      ['Mars', 'Rahu']
    ]

    for (const combo of difficultCombos) {
      if ((combo[0] === mahadashaLord && combo[1] === antardashaLord) ||
          (combo[1] === mahadashaLord && combo[0] === antardashaLord)) {
        return 'Difficult'
      }
    }

    return 'Challenging'
  }

  return 'Mixed'
}

// Generate Antardashas for a Mahadasha
export function generateAntardashas(
  mahadashaLord: string,
  mahadashaStart: Date,
  mahadashaEnd: Date,
  currentDate: Date = new Date()
): Antardasha[] {
  const antardashas: Antardasha[] = []
  const proportions = ANTARDASHA_PROPORTIONS[mahadashaLord]

  if (!proportions) return []

  // Vimshottari sequence: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
  const vimshottariOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']

  // Find starting position (Mahadasha lord)
  const startIdx = vimshottariOrder.indexOf(mahadashaLord)

  // Build sequence starting from Mahadasha lord
  const sequence: string[] = []
  for (let i = 0; i < 9; i++) {
    sequence.push(vimshottariOrder[(startIdx + i) % 9])
  }

  let currentStartDate = new Date(mahadashaStart)

  for (const planet of sequence) {
    const yearsDecimal = proportions[planet]
    const totalDays = yearsDecimal * 365.25
    const years = Math.floor(yearsDecimal)
    const remainingDays = totalDays - (years * 365.25)
    const months = Math.floor(remainingDays / 30.44)
    const days = Math.round(remainingDays - (months * 30.44))

    // Calculate end date
    const endDate = new Date(currentStartDate)
    endDate.setTime(endDate.getTime() + totalDays * 24 * 60 * 60 * 1000)

    const isCurrent = currentDate >= currentStartDate && currentDate < endDate

    // Calculate quality based on planet relationships
    const quality = calculateAntardashaQuality(mahadashaLord, planet)

    antardashas.push({
      planet,
      startDate: new Date(currentStartDate),
      endDate,
      years: yearsDecimal,
      months,
      days,
      isCurrent,
      quality,
      keyEvents: []
    })

    currentStartDate = new Date(endDate)
  }

  return antardashas
}

// Generate predictions for a Dasha period
export function generateDashaPredictions(
  planet: string,
  strength: PlanetStrength,
  functionalNature: FunctionalNature,
  housesRuled: number[]
): DashaPredictions {
  const predictions: DashaPredictions = {
    career: [],
    wealth: [],
    relationships: [],
    health: [],
    spiritual: [],
    favorable: strength.overall >= 60 && functionalNature !== 'Malefic',
    challenges: [],
    opportunities: []
  }

  // Career predictions based on houses ruled and planet nature
  if (housesRuled.includes(10)) {
    predictions.career.push('Strong career advancement and recognition')
    predictions.opportunities.push('Professional growth opportunities')
  }
  if (housesRuled.includes(6)) {
    predictions.career.push('Competitive success, victory over obstacles')
  }

  // Wealth predictions
  if (housesRuled.includes(2) || housesRuled.includes(11)) {
    if (strength.overall >= 60) {
      predictions.wealth.push('Significant financial gains and wealth accumulation')
    } else {
      predictions.wealth.push('Financial fluctuations, need for careful management')
    }
  }

  // Relationship predictions
  if (housesRuled.includes(7)) {
    if (planet === 'Venus' || planet === 'Jupiter') {
      predictions.relationships.push('Favorable period for marriage and partnerships')
    } else {
      predictions.relationships.push('Important developments in relationships')
    }
  }

  // Health predictions based on planet
  const healthMap: Record<string, string> = {
    Sun: 'Focus on heart, vitality, and bone health',
    Moon: 'Emotional wellbeing, digestive system',
    Mars: 'Energy levels, blood pressure, inflammation',
    Mercury: 'Nervous system, respiratory health',
    Jupiter: 'Liver, fat metabolism, overall vitality',
    Venus: 'Reproductive health, kidneys, skin',
    Saturn: 'Joints, chronic conditions, discipline needed',
    Rahu: 'Unexpected health issues, mental stress',
    Ketu: 'Mysterious ailments, need for spiritual healing'
  }
  predictions.health.push(healthMap[planet] || 'General health awareness')

  // Add challenges based on functional nature
  if (functionalNature === 'Malefic' || functionalNature === 'Maraka') {
    predictions.challenges.push('Exercise caution and patience during this period')
    predictions.challenges.push('Avoid major risks and impulsive decisions')
  }

  if (strength.dignity === 'Debilitated') {
    predictions.challenges.push('Planet is weakened - results may be delayed')
  }

  if (strength.isCombust) {
    predictions.challenges.push('Combust planet - confidence challenges possible')
  }

  // Opportunities based on strength
  if (strength.overall >= 70) {
    predictions.opportunities.push('Excellent period for growth and achievement')
    predictions.opportunities.push('Natural talent and abilities shine')
  }

  if (functionalNature === 'Yogakaraka') {
    predictions.opportunities.push('Highly auspicious Yogakaraka period')
    predictions.opportunities.push('Success through righteous efforts')
  }

  return predictions
}

// Generate remedies for challenging dashas
export function generateRemedies(planet: string, strength: PlanetStrength): Remedy[] {
  const remedies: Remedy[] = []

  // Only suggest remedies if planet is weak or challenging
  if (strength.overall < 50 || strength.dignity === 'Debilitated' || strength.isCombust) {
    const remedyMap: Record<string, Remedy[]> = {
      Sun: [
        { type: 'Mantra', description: 'Om Hraam Hreem Hraum Sah Suryaya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate wheat, jaggery, or copper items on Sundays' },
        { type: 'Gemstone', description: 'Ruby (Manikya)', caution: 'Only after astrological consultation' },
        { type: 'Worship', description: 'Offer water to Sun at sunrise' }
      ],
      Moon: [
        { type: 'Mantra', description: 'Om Shraam Shreem Shraum Sah Chandraya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate white items, rice, or milk on Mondays' },
        { type: 'Gemstone', description: 'Pearl (Moti)', caution: 'Only after astrological consultation' },
        { type: 'Lifestyle', description: 'Practice meditation and emotional balance' }
      ],
      Mars: [
        { type: 'Mantra', description: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate red items, red lentils, or copper on Tuesdays' },
        { type: 'Worship', description: 'Recite Hanuman Chalisa daily' },
        { type: 'Gemstone', description: 'Red Coral (Moonga)', caution: 'Only after astrological consultation' }
      ],
      Mercury: [
        { type: 'Mantra', description: 'Om Braam Breem Braum Sah Budhaya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate green items, books, or educational materials on Wednesdays' },
        { type: 'Gemstone', description: 'Emerald (Panna)', caution: 'Only after astrological consultation' },
        { type: 'Lifestyle', description: 'Engage in learning and communication practices' }
      ],
      Jupiter: [
        { type: 'Mantra', description: 'Om Graam Greem Graum Sah Gurave Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate yellow items, turmeric, or gold on Thursdays' },
        { type: 'Worship', description: 'Visit temple and seek blessings of Guru' },
        { type: 'Gemstone', description: 'Yellow Sapphire (Pukhraj)', caution: 'Only after astrological consultation' }
      ],
      Venus: [
        { type: 'Mantra', description: 'Om Draam Dreem Draum Sah Shukraya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate white items, sugar, or rice on Fridays' },
        { type: 'Gemstone', description: 'Diamond or White Sapphire', caution: 'Only after astrological consultation' },
        { type: 'Worship', description: 'Worship Goddess Lakshmi' }
      ],
      Saturn: [
        { type: 'Mantra', description: 'Om Praam Preem Praum Sah Shanaischaraya Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate to elderly, disabled, or serve those in need on Saturdays' },
        { type: 'Fasting', description: 'Observe Saturday fasts' },
        { type: 'Gemstone', description: 'Blue Sapphire (Neelam)', caution: 'ONLY with expert consultation - powerful gem' },
        { type: 'Lifestyle', description: 'Practice discipline, patience, and hard work' }
      ],
      Rahu: [
        { type: 'Mantra', description: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate black items, mustard oil, or blankets on Saturdays' },
        { type: 'Worship', description: 'Worship Lord Shiva, visit Shiva temple' },
        { type: 'Gemstone', description: 'Hessonite (Gomed)', caution: 'Only after astrological consultation' }
      ],
      Ketu: [
        { type: 'Mantra', description: 'Om Sraam Sreem Sraum Sah Ketave Namah', frequency: '108 times daily' },
        { type: 'Charity', description: 'Donate to spiritual causes, feed dogs' },
        { type: 'Worship', description: 'Worship Lord Ganesha, practice meditation' },
        { type: 'Gemstone', description: "Cat's Eye (Lehsunia)", caution: 'Only after astrological consultation' }
      ]
    }

    const planetRemedies = remedyMap[planet] || []
    remedies.push(...planetRemedies)
  }

  return remedies
}

// Main function to generate enhanced Dasha analysis
export function generateEnhancedDashaAnalysis(
  dashas: Array<{ planet: string; startDate: Date; endDate: Date; years: number }>,
  planets: Array<{ name: string; sign: number; house: number; isRetrograde: boolean; isCombust?: boolean }>,
  ascendantSign: number
): EnhancedMahadasha[] {
  const enhancedDashas: EnhancedMahadasha[] = []
  const currentDate = new Date()

  for (const dasha of dashas) {
    // Find planet data
    const planetData = planets.find(p => p.name === dasha.planet)
    if (!planetData) continue

    // Calculate strength
    const strength = calculatePlanetStrength(
      dasha.planet,
      planetData.sign,
      planetData.house,
      planetData.isRetrograde,
      planetData.isCombust || false,
      [], // Aspects - would need to calculate
      []  // Conjunctions - would need to calculate
    )

    // Determine functional nature
    const functionalNature = getFunctionalNature(dasha.planet, ascendantSign)

    // Get houses ruled
    const lordship = FUNCTIONAL_LORDSHIP[ascendantSign]
    const housesRuled = lordship[dasha.planet] || []

    // Generate antardashas
    const antardashas = generateAntardashas(dasha.planet, dasha.startDate, dasha.endDate, currentDate)

    // Generate predictions
    const predictions = generateDashaPredictions(dasha.planet, strength, functionalNature, housesRuled)

    // Generate remedies
    const remedies = generateRemedies(dasha.planet, strength)

    // Activated yogas (simplified for now)
    const activatedYogas: string[] = []
    if (functionalNature === 'Yogakaraka') {
      activatedYogas.push(`${dasha.planet} Yogakaraka effects`)
    }
    if (strength.overall >= 80) {
      activatedYogas.push(`Strong ${dasha.planet} brings excellent results`)
    }

    enhancedDashas.push({
      planet: dasha.planet,
      startDate: dasha.startDate,
      endDate: dasha.endDate,
      years: dasha.years,
      strength,
      functionalNature,
      housesRuled,
      antardashas,
      predictions,
      activatedYogas,
      remedies
    })
  }

  return enhancedDashas
}
