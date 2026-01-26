// Kundli Matching (Gun Milan) Calculations
// Ashtakoot system for marriage compatibility

import { getJulianDay, calculatePreciseAyanamsa } from './precise-calculations'
import { NAKSHATRA_DATA } from './panchang-calculations'

// Nakshatra-based matching data
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

// Varna (spiritual compatibility) - 4 varnas
const VARNA_ORDER = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra']
const NAKSHATRA_VARNA: { [key: number]: string } = {
  0: 'Vaishya', 1: 'Shudra', 2: 'Brahmin', 3: 'Shudra', 4: 'Vaishya', 5: 'Shudra',
  6: 'Vaishya', 7: 'Kshatriya', 8: 'Shudra', 9: 'Shudra', 10: 'Brahmin', 11: 'Kshatriya',
  12: 'Vaishya', 13: 'Shudra', 14: 'Vaishya', 15: 'Brahmin', 16: 'Shudra', 17: 'Vaishya',
  18: 'Shudra', 19: 'Brahmin', 20: 'Kshatriya', 21: 'Shudra', 22: 'Vaishya', 23: 'Shudra',
  24: 'Brahmin', 25: 'Kshatriya', 26: 'Shudra'
}

// Vashya (dominance/control compatibility)
const VASHYA_GROUPS: { [key: string]: string[] } = {
  'Manav': ['Gemini', 'Virgo', 'Libra', 'Sagittarius', 'Aquarius'],
  'Vanchar': ['Leo'],
  'Chatushpad': ['Aries', 'Taurus', 'Capricorn'],
  'Jalchar': ['Cancer', 'Pisces'],
  'Keeta': ['Scorpio']
}

// Tara (birth star compatibility)
// Based on counting from bride's nakshatra to groom's

// Yoni (sexual/physical compatibility) - 14 animal types
const YONI_ANIMALS: { [key: number]: string } = {
  0: 'Horse', 1: 'Elephant', 2: 'Sheep', 3: 'Serpent', 4: 'Serpent', 5: 'Dog',
  6: 'Cat', 7: 'Sheep', 8: 'Cat', 9: 'Rat', 10: 'Rat', 11: 'Cow',
  12: 'Buffalo', 13: 'Tiger', 14: 'Buffalo', 15: 'Tiger', 16: 'Deer', 17: 'Deer',
  18: 'Dog', 19: 'Monkey', 20: 'Mongoose', 21: 'Monkey', 22: 'Lion', 23: 'Horse',
  24: 'Lion', 25: 'Cow', 26: 'Elephant'
}

// Yoni compatibility matrix (simplified)
const YONI_ENEMIES: { [key: string]: string } = {
  'Horse': 'Buffalo', 'Elephant': 'Lion', 'Sheep': 'Monkey', 'Serpent': 'Mongoose',
  'Dog': 'Deer', 'Cat': 'Rat', 'Rat': 'Cat', 'Cow': 'Tiger',
  'Buffalo': 'Horse', 'Tiger': 'Cow', 'Deer': 'Dog', 'Monkey': 'Sheep',
  'Lion': 'Elephant', 'Mongoose': 'Serpent'
}

// Graha Maitri (planetary friendship)
const PLANET_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
const NAKSHATRA_LORD: { [key: number]: string } = {
  0: 'Ketu', 1: 'Venus', 2: 'Sun', 3: 'Moon', 4: 'Mars', 5: 'Rahu',
  6: 'Jupiter', 7: 'Saturn', 8: 'Mercury', 9: 'Ketu', 10: 'Venus', 11: 'Sun',
  12: 'Moon', 13: 'Mars', 14: 'Rahu', 15: 'Jupiter', 16: 'Saturn', 17: 'Mercury',
  18: 'Ketu', 19: 'Venus', 20: 'Sun', 21: 'Moon', 22: 'Mars', 23: 'Rahu',
  24: 'Jupiter', 25: 'Saturn', 26: 'Mercury'
}

// Planet friendships
const PLANET_FRIENDS: { [key: string]: string[] } = {
  'Sun': ['Moon', 'Mars', 'Jupiter'],
  'Moon': ['Sun', 'Mercury'],
  'Mars': ['Sun', 'Moon', 'Jupiter'],
  'Mercury': ['Sun', 'Venus'],
  'Jupiter': ['Sun', 'Moon', 'Mars'],
  'Venus': ['Mercury', 'Saturn'],
  'Saturn': ['Mercury', 'Venus'],
  'Rahu': ['Mercury', 'Venus', 'Saturn'],
  'Ketu': ['Mars', 'Jupiter']
}

const PLANET_ENEMIES: { [key: string]: string[] } = {
  'Sun': ['Saturn', 'Venus'],
  'Moon': ['Rahu', 'Ketu'],
  'Mars': ['Mercury'],
  'Mercury': ['Moon'],
  'Jupiter': ['Mercury', 'Venus'],
  'Venus': ['Sun', 'Moon'],
  'Saturn': ['Sun', 'Moon', 'Mars'],
  'Rahu': ['Sun', 'Moon'],
  'Ketu': ['Sun', 'Moon']
}

// Gana (temperament) - Deva, Manushya, Rakshasa
const NAKSHATRA_GANA: { [key: number]: string } = {
  0: 'Deva', 1: 'Manushya', 2: 'Rakshasa', 3: 'Manushya', 4: 'Deva', 5: 'Manushya',
  6: 'Deva', 7: 'Deva', 8: 'Rakshasa', 9: 'Rakshasa', 10: 'Manushya', 11: 'Manushya',
  12: 'Deva', 13: 'Rakshasa', 14: 'Deva', 15: 'Rakshasa', 16: 'Deva', 17: 'Rakshasa',
  18: 'Rakshasa', 19: 'Manushya', 20: 'Manushya', 21: 'Deva', 22: 'Rakshasa', 23: 'Rakshasa',
  24: 'Manushya', 25: 'Manushya', 26: 'Deva'
}

// Bhakoot (moon sign compatibility) - based on rashi
const BHAKOOT_BAD_COMBINATIONS = [
  [0, 5], [5, 0], // 6-8 relationship
  [0, 11], [11, 0], // 2-12 relationship  
  [1, 6], [6, 1],
  [1, 10], [10, 1],
  [2, 7], [7, 2],
  [2, 9], [9, 2],
  [3, 8], [8, 3],
  [4, 9], [9, 4],
  [5, 10], [10, 5],
  [6, 11], [11, 6]
]

// Nadi (health/genes compatibility) - Adi, Madhya, Antya
const NAKSHATRA_NADI: { [key: number]: string } = {
  0: 'Adi', 1: 'Madhya', 2: 'Antya', 3: 'Antya', 4: 'Madhya', 5: 'Adi',
  6: 'Adi', 7: 'Madhya', 8: 'Antya', 9: 'Antya', 10: 'Madhya', 11: 'Adi',
  12: 'Adi', 13: 'Madhya', 14: 'Antya', 15: 'Antya', 16: 'Madhya', 17: 'Adi',
  18: 'Adi', 19: 'Madhya', 20: 'Antya', 21: 'Antya', 22: 'Madhya', 23: 'Adi',
  24: 'Adi', 25: 'Madhya', 26: 'Antya'
}

// Calculate Moon's nakshatra from birth details
function calculateMoonNakshatra(birthDate: Date, timezone: number): number {
  const jd = getJulianDay(birthDate, timezone)
  const ayanamsa = calculatePreciseAyanamsa(jd)
  
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
  
  return Math.floor(moonLon / (360 / 27))
}

// Calculate Moon's rashi
function calculateMoonRashi(birthDate: Date, timezone: number): number {
  const jd = getJulianDay(birthDate, timezone)
  const ayanamsa = calculatePreciseAyanamsa(jd)
  
  const T = (jd - 2451545.0) / 36525
  const Lp = (218.3164591 + 481267.88134236 * T) % 360
  const M = (134.9634114 + 477198.8676313 * T) % 360
  const D = (297.8502042 + 445267.1115168 * T) % 360
  const Mrad = M * Math.PI / 180
  const Drad = D * Math.PI / 180
  
  let moonLon = Lp + 6.288750 * Math.sin(Mrad) + 1.274018 * Math.sin(2 * Drad - Mrad) + 0.658309 * Math.sin(2 * Drad)
  
  moonLon = (moonLon - ayanamsa) % 360
  if (moonLon < 0) moonLon += 360
  
  return Math.floor(moonLon / 30)
}

// Get Vashya group for a rashi
function getVashyaGroup(rashiIndex: number): string {
  const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  const rashi = RASHIS[rashiIndex]
  
  for (const [group, signs] of Object.entries(VASHYA_GROUPS)) {
    if (signs.includes(rashi)) return group
  }
  return 'Manav'
}

// Calculate Varna points (max 1)
function calculateVarna(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleVarna: string
  femaleVarna: string
  description: string
  combination: string
} {
  const maleVarna = NAKSHATRA_VARNA[maleNakshatra]
  const femaleVarna = NAKSHATRA_VARNA[femaleNakshatra]
  
  const maleIndex = VARNA_ORDER.indexOf(maleVarna)
  const femaleIndex = VARNA_ORDER.indexOf(femaleVarna)
  
  // Male varna should be same or higher than female
  const points = maleIndex <= femaleIndex ? 1 : 0
  
  // Determine combination key for explanations
  let combination = `${maleVarna}-${femaleVarna}`
  if (maleVarna === femaleVarna) {
    combination = 'same'
  } else if (points === 1) {
    combination = 'compatible'
  } else {
    combination = 'incompatible'
  }
  
  return {
    points,
    maxPoints: 1,
    maleVarna,
    femaleVarna,
    description: points === 1 
      ? 'Compatible Varna - Good spiritual harmony'
      : 'Varna mismatch - Minor compatibility issue',
    combination
  }
}

// Calculate Vashya points (max 2)
function calculateVashya(maleRashi: number, femaleRashi: number): {
  points: number
  maxPoints: number
  maleGroup: string
  femaleGroup: string
  description: string
  combination: string
} {
  const maleGroup = getVashyaGroup(maleRashi)
  const femaleGroup = getVashyaGroup(femaleRashi)
  
  let points = 0
  let combination = 'incompatible-vashya'
  
  if (maleGroup === femaleGroup) {
    points = 2
    combination = 'same-sign'
  } else if (
    (maleGroup === 'Manav' && femaleGroup === 'Vanchar') ||
    (maleGroup === 'Vanchar' && femaleGroup === 'Manav') ||
    (maleGroup === 'Chatushpad' && femaleGroup === 'Vanchar')
  ) {
    points = 1
    combination = 'one-way-vashya'
  } else if (femaleGroup === 'Keeta') {
    points = 0.5
    combination = 'neutral'
  }
  
  if (points >= 1.5) combination = 'compatible-vashya'
  
  return {
    points,
    maxPoints: 2,
    maleGroup,
    femaleGroup,
    description: points === 2 
      ? 'Excellent mutual attraction and control'
      : points >= 1 
        ? 'Good compatibility with some adjustments'
        : 'Challenging - requires understanding',
    combination
  }
}

// Calculate Tara points (max 3)
function calculateTara(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleTara: string
  femaleTara: string
  description: string
  combination: string
} {
  const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari', 'Sadhaka', 'Vadha', 'Mitra', 'Atimitra']
  
  // Count from female to male nakshatra
  let count = (maleNakshatra - femaleNakshatra + 27) % 27
  const maleTaraIndex = count % 9
  
  // Count from male to female nakshatra
  count = (femaleNakshatra - maleNakshatra + 27) % 27
  const femaleTaraIndex = count % 9
  
  const goodTaras = [1, 3, 5, 7, 8] // Sampat, Kshema, Sadhaka, Mitra, Atimitra
  
  let points = 0
  let combination = 'unfavorable-tara'
  
  if (goodTaras.includes(maleTaraIndex) && goodTaras.includes(femaleTaraIndex)) {
    points = 3
    combination = 'favorable-tara'
  } else if (goodTaras.includes(maleTaraIndex) || goodTaras.includes(femaleTaraIndex)) {
    points = 1.5
    combination = 'neutral-tara'
  }
  
  // Add specific tara names for detailed explanation
  const maleTaraName = TARA_NAMES[maleTaraIndex].toLowerCase()
  if (['janma', 'sampat', 'vipat', 'kshema', 'pratyak', 'sadhana', 'naidhana'].includes(maleTaraName + '-tara')) {
    combination = maleTaraName + '-tara'
  }
  
  return {
    points,
    maxPoints: 3,
    maleTara: TARA_NAMES[maleTaraIndex],
    femaleTara: TARA_NAMES[femaleTaraIndex],
    description: points === 3 
      ? 'Excellent destiny compatibility'
      : points >= 1.5 
        ? 'Moderate star compatibility'
        : 'Challenging birth star relationship',
    combination
  }
}

// Calculate Yoni points (max 4)
function calculateYoni(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleYoni: string
  femaleYoni: string
  description: string
  combination: string
} {
  const maleYoni = YONI_ANIMALS[maleNakshatra]
  const femaleYoni = YONI_ANIMALS[femaleNakshatra]
  
  let points = 0
  let combination = 'neutral-yoni'
  
  if (maleYoni === femaleYoni) {
    points = 4
    combination = 'same-yoni'
  } else if (YONI_ENEMIES[maleYoni] === femaleYoni) {
    points = 0
    combination = 'enemy-yoni'
  } else {
    // Check if friendly or neutral
    const friendlyPairs = [
      ['Horse', 'Deer'], ['Elephant', 'Sheep'], ['Serpent', 'Cat'],
      ['Dog', 'Tiger'], ['Cow', 'Buffalo'], ['Monkey', 'Lion']
    ]
    
    const isFriendly = friendlyPairs.some(pair => 
      (pair[0] === maleYoni && pair[1] === femaleYoni) ||
      (pair[1] === maleYoni && pair[0] === femaleYoni)
    )
    
    points = isFriendly ? 3 : 2
    combination = isFriendly ? 'friendly-yoni' : 'neutral-yoni'
  }
  
  return {
    points,
    maxPoints: 4,
    maleYoni,
    femaleYoni,
    description: points === 4 
      ? 'Excellent physical and sexual compatibility'
      : points >= 3 
        ? 'Good physical harmony'
        : points >= 2 
          ? 'Average physical compatibility'
          : 'Challenging - may face physical incompatibility',
    combination
  }
}

// Calculate Graha Maitri points (max 5)
function calculateGrahaMaitri(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleLord: string
  femaleLord: string
  description: string
  combination: string
} {
  const maleLord = NAKSHATRA_LORD[maleNakshatra]
  const femaleLord = NAKSHATRA_LORD[femaleNakshatra]
  
  let points = 0
  let combination = 'neutral-relationship'
  
  if (maleLord === femaleLord) {
    points = 5
    combination = 'same-lord'
  } else {
    const maleFriends = PLANET_FRIENDS[maleLord] || []
    const femaleFriends = PLANET_FRIENDS[femaleLord] || []
    const maleEnemies = PLANET_ENEMIES[maleLord] || []
    const femaleEnemies = PLANET_ENEMIES[femaleLord] || []
    
    const maleToFemale = maleFriends.includes(femaleLord) ? 1 : maleEnemies.includes(femaleLord) ? -1 : 0
    const femaleToMale = femaleFriends.includes(maleLord) ? 1 : femaleEnemies.includes(maleLord) ? -1 : 0
    
    const total = maleToFemale + femaleToMale
    
    if (total >= 2) {
      points = 5
      combination = 'natural-friends'
    } else if (total === 1) {
      points = 4
      combination = 'temporary-friends'
    } else if (total === 0) {
      points = 3
      combination = 'neutral-relationship'
    } else if (total === -1) {
      points = 1
      combination = 'natural-enemies'
    } else {
      points = 0
      combination = 'natural-enemies'
    }
  }
  
  return {
    points,
    maxPoints: 5,
    maleLord,
    femaleLord,
    description: points >= 4 
      ? 'Excellent mental and intellectual compatibility'
      : points >= 3 
        ? 'Good mental harmony'
        : 'Mental wavelength differences exist',
    combination
  }
}

// Calculate Gana points (max 6)
function calculateGana(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleGana: string
  femaleGana: string
  description: string
  combination: string
} {
  const maleGana = NAKSHATRA_GANA[maleNakshatra]
  const femaleGana = NAKSHATRA_GANA[femaleNakshatra]
  
  let points = 0
  let combination = 'incompatible-gana'
  
  if (maleGana === femaleGana) {
    points = 6
    combination = `${maleGana}-${femaleGana}`
  } else if (
    (maleGana === 'Deva' && femaleGana === 'Manushya') ||
    (maleGana === 'Manushya' && femaleGana === 'Deva')
  ) {
    points = 5
    combination = 'Dev-Manushya'
  } else if (
    (maleGana === 'Manushya' && femaleGana === 'Rakshasa') ||
    (maleGana === 'Rakshasa' && femaleGana === 'Manushya')
  ) {
    points = 1
    combination = 'Manushya-Rakshasa'
  } else if (maleGana === 'Rakshasa' && femaleGana === 'Deva') {
    points = 0
    combination = 'Dev-Rakshasa'
  } else if (maleGana === 'Deva' && femaleGana === 'Rakshasa') {
    points = 0
    combination = 'Dev-Rakshasa'
  } else {
    points = 3
    combination = 'compatible-gana'
  }
  
  return {
    points,
    maxPoints: 6,
    maleGana,
    femaleGana,
    description: points >= 5 
      ? 'Excellent temperament compatibility'
      : points >= 3 
        ? 'Workable temperament differences'
        : 'Significant temperament mismatch - requires patience',
    combination
  }
}

// Calculate Bhakoot points (max 7)
function calculateBhakoot(maleRashi: number, femaleRashi: number): {
  points: number
  maxPoints: number
  description: string
  combination: string
} {
  const isBadCombination = BHAKOOT_BAD_COMBINATIONS.some(
    combo => combo[0] === maleRashi && combo[1] === femaleRashi
  )
  
  const points = isBadCombination ? 0 : 7
  
  // Determine combination type
  let combination = 'favorable-bhakoot'
  if (isBadCombination) {
    // Check for specific dosha types
    const diff = Math.abs(maleRashi - femaleRashi)
    if (diff === 5 || diff === 7) {
      combination = '6-8-relationship'
    } else if (diff === 1 || diff === 11) {
      combination = '2-12-relationship'
    } else {
      combination = 'unfavorable-bhakoot'
    }
  } else if (maleRashi === femaleRashi) {
    combination = 'same-sign'
  } else {
    const diff = Math.abs(maleRashi - femaleRashi)
    if (diff === 4 || diff === 8) {
      combination = '5-9-relationship'
    }
  }
  
  return {
    points,
    maxPoints: 7,
    description: points === 7 
      ? 'Excellent love and emotional bonding'
      : 'Bhakoot Dosha present - may face challenges in emotional bonding',
    combination
  }
}

// Calculate Nadi points (max 8)
function calculateNadi(maleNakshatra: number, femaleNakshatra: number): {
  points: number
  maxPoints: number
  maleNadi: string
  femaleNadi: string
  hasDosha: boolean
  description: string
  combination: string
} {
  const maleNadi = NAKSHATRA_NADI[maleNakshatra]
  const femaleNadi = NAKSHATRA_NADI[femaleNakshatra]
  
  const hasDosha = maleNadi === femaleNadi
  const points = hasDosha ? 0 : 8
  
  let combination = 'different-nadi'
  if (hasDosha) {
    combination = `${maleNadi}-${femaleNadi}`
  } else {
    combination = `${maleNadi}-${femaleNadi}`
  }
  
  return {
    points,
    maxPoints: 8,
    maleNadi,
    femaleNadi,
    hasDosha,
    description: points === 8 
      ? 'Excellent health and progeny compatibility'
      : 'Nadi Dosha present - May affect health and children',
    combination
  }
}

// Main function: Calculate complete Kundli matching
export function calculateKundliMatching(
  maleBirthDate: Date,
  femaleBirthDate: Date,
  maleTimezone: number = 5.5,
  femaleTimezone: number = 5.5
) {
  const maleNakshatra = calculateMoonNakshatra(maleBirthDate, maleTimezone)
  const femaleNakshatra = calculateMoonNakshatra(femaleBirthDate, femaleTimezone)
  const maleRashi = calculateMoonRashi(maleBirthDate, maleTimezone)
  const femaleRashi = calculateMoonRashi(femaleBirthDate, femaleTimezone)
  
  const varna = calculateVarna(maleNakshatra, femaleNakshatra)
  const vashya = calculateVashya(maleRashi, femaleRashi)
  const tara = calculateTara(maleNakshatra, femaleNakshatra)
  const yoni = calculateYoni(maleNakshatra, femaleNakshatra)
  const grahaMaitri = calculateGrahaMaitri(maleNakshatra, femaleNakshatra)
  const gana = calculateGana(maleNakshatra, femaleNakshatra)
  const bhakoot = calculateBhakoot(maleRashi, femaleRashi)
  const nadi = calculateNadi(maleNakshatra, femaleNakshatra)
  
  const totalPoints = varna.points + vashya.points + tara.points + yoni.points +
                      grahaMaitri.points + gana.points + bhakoot.points + nadi.points
  
  const maxPoints = 36
  const percentage = (totalPoints / maxPoints) * 100
  
  let verdict = ''
  let verdictType: 'excellent' | 'good' | 'average' | 'poor' = 'poor'
  
  if (totalPoints >= 28) {
    verdict = 'Excellent Match - Highly recommended for marriage'
    verdictType = 'excellent'
  } else if (totalPoints >= 21) {
    verdict = 'Good Match - Marriage is favorable with minor adjustments'
    verdictType = 'good'
  } else if (totalPoints >= 18) {
    verdict = 'Average Match - Marriage possible with remedies and understanding'
    verdictType = 'average'
  } else {
    verdict = 'Below Average - Careful consideration and remedies recommended'
    verdictType = 'poor'
  }
  
  // Check for major doshas
  const doshas: string[] = []
  if (nadi.hasDosha) {
    doshas.push('Nadi Dosha - Same Nadi may affect health and children. Remedies: Nadi Nivarana Puja, donation of gold/grains.')
  }
  if (bhakoot.points === 0) {
    doshas.push('Bhakoot Dosha - May affect emotional bonding and financial stability. Remedies: Perform Bhakoot Shanti Puja.')
  }
  if (gana.points <= 1) {
    doshas.push('Gana Dosha - Temperament mismatch. Remedies: Patience, understanding, and Gana Dosha Nivaran Puja.')
  }
  
  const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
  
  return {
    maleDetails: {
      nakshatra: NAKSHATRAS[maleNakshatra],
      nakshatraIndex: maleNakshatra,
      rashi: RASHIS[maleRashi],
      rashiIndex: maleRashi
    },
    femaleDetails: {
      nakshatra: NAKSHATRAS[femaleNakshatra],
      nakshatraIndex: femaleNakshatra,
      rashi: RASHIS[femaleRashi],
      rashiIndex: femaleRashi
    },
    kootas: [
      { koota: 'Varna', maxPoints: 1, scored: varna.points, status: varna.points >= 0.5 ? 'pass' : 'fail', description: varna.description, combination: varna.combination },
      { koota: 'Vashya', maxPoints: 2, scored: vashya.points, status: vashya.points >= 1 ? 'pass' : vashya.points >= 0.5 ? 'warning' : 'fail', description: vashya.description, combination: vashya.combination },
      { koota: 'Tara', maxPoints: 3, scored: tara.points, status: tara.points >= 1.5 ? 'pass' : 'warning', description: tara.description, combination: tara.combination },
      { koota: 'Yoni', maxPoints: 4, scored: yoni.points, status: yoni.points >= 2 ? 'pass' : yoni.points >= 1 ? 'warning' : 'fail', description: yoni.description, combination: yoni.combination },
      { koota: 'Graha Maitri', maxPoints: 5, scored: grahaMaitri.points, status: grahaMaitri.points >= 3 ? 'pass' : 'warning', description: grahaMaitri.description, combination: grahaMaitri.combination },
      { koota: 'Gana', maxPoints: 6, scored: gana.points, status: gana.points >= 3 ? 'pass' : gana.points >= 1 ? 'warning' : 'fail', description: gana.description, combination: gana.combination },
      { koota: 'Bhakoot', maxPoints: 7, scored: bhakoot.points, status: bhakoot.points === 7 ? 'pass' : 'fail', description: bhakoot.description, combination: bhakoot.combination },
      { koota: 'Nadi', maxPoints: 8, scored: nadi.points, status: nadi.points === 8 ? 'pass' : 'fail', description: nadi.description, combination: nadi.combination }
    ],
    totalScore: totalPoints,
    maxScore: maxPoints,
    percentage: Math.round(percentage * 10) / 10,
    verdict,
    verdictType,
    doshas,
    recommendations: doshas.length === 0 
      ? ['This is a compatible match. Proceed with the alliance with confidence.']
      : ['Consider consulting a learned astrologer for personalized remedies.',
         'Perform the recommended pujas before marriage.',
         'Both partners should be aware of potential challenges and work together.']
  }
}
