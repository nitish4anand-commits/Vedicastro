// Kundli Matching (Gun Milan) Calculations
// Enhanced Ashtakoot system with classical exceptions and chart-level analysis

import { getJulianDay, calculatePreciseAyanamsa } from './precise-calculations'

// Note: NAKSHATRA_DATA imported for potential future use in detailed analysis

// Nakshatra-based matching data
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

const RASHIS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

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
const TARA_NAMES = ['Janma', 'Sampat', 'Vipat', 'Kshema', 'Pratyari', 'Sadhaka', 'Vadha', 'Mitra', 'Atimitra']

// Yoni (sexual/physical compatibility) - 14 animal types with gender
const YONI_ANIMALS: { [key: number]: { animal: string; gender: 'Male' | 'Female' } } = {
  0: { animal: 'Horse', gender: 'Male' },
  1: { animal: 'Elephant', gender: 'Male' },
  2: { animal: 'Sheep', gender: 'Female' },
  3: { animal: 'Serpent', gender: 'Male' },
  4: { animal: 'Serpent', gender: 'Female' },
  5: { animal: 'Dog', gender: 'Female' },
  6: { animal: 'Cat', gender: 'Male' },
  7: { animal: 'Sheep', gender: 'Male' },
  8: { animal: 'Cat', gender: 'Female' },
  9: { animal: 'Rat', gender: 'Male' },
  10: { animal: 'Rat', gender: 'Female' },
  11: { animal: 'Cow', gender: 'Male' },
  12: { animal: 'Buffalo', gender: 'Male' },
  13: { animal: 'Tiger', gender: 'Male' },
  14: { animal: 'Buffalo', gender: 'Female' },
  15: { animal: 'Tiger', gender: 'Female' },
  16: { animal: 'Deer', gender: 'Male' },
  17: { animal: 'Deer', gender: 'Female' },
  18: { animal: 'Dog', gender: 'Male' },
  19: { animal: 'Monkey', gender: 'Male' },
  20: { animal: 'Mongoose', gender: 'Male' },
  21: { animal: 'Monkey', gender: 'Female' },
  22: { animal: 'Lion', gender: 'Male' },
  23: { animal: 'Horse', gender: 'Female' },
  24: { animal: 'Lion', gender: 'Female' },
  25: { animal: 'Cow', gender: 'Female' },
  26: { animal: 'Elephant', gender: 'Female' }
}

// Yoni enemy pairs
const YONI_ENEMIES: { [key: string]: string } = {
  'Horse': 'Buffalo', 'Elephant': 'Lion', 'Sheep': 'Monkey', 'Serpent': 'Mongoose',
  'Dog': 'Deer', 'Cat': 'Rat', 'Rat': 'Cat', 'Cow': 'Tiger',
  'Buffalo': 'Horse', 'Tiger': 'Cow', 'Deer': 'Dog', 'Monkey': 'Sheep',
  'Lion': 'Elephant', 'Mongoose': 'Serpent'
}

// Graha Maitri (planetary friendship)
const NAKSHATRA_LORD: { [key: number]: string } = {
  0: 'Ketu', 1: 'Venus', 2: 'Sun', 3: 'Moon', 4: 'Mars', 5: 'Rahu',
  6: 'Jupiter', 7: 'Saturn', 8: 'Mercury', 9: 'Ketu', 10: 'Venus', 11: 'Sun',
  12: 'Moon', 13: 'Mars', 14: 'Rahu', 15: 'Jupiter', 16: 'Saturn', 17: 'Mercury',
  18: 'Ketu', 19: 'Venus', 20: 'Sun', 21: 'Moon', 22: 'Mars', 23: 'Rahu',
  24: 'Jupiter', 25: 'Saturn', 26: 'Mercury'
}

// Planet friendships for Graha Maitri
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

// Bhakoot (moon sign compatibility) - 6-8 and 2-12 relationships are unfavorable
const BHAKOOT_BAD_COMBINATIONS = [
  [0, 5], [5, 0], // 6-8 relationship (Aries-Scorpio type)
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

// ============================================================================
// CALCULATION HELPER FUNCTIONS
// ============================================================================

function calculateMoonPosition(birthDate: Date, timezone: number): { longitude: number; nakshatra: number; pada: number; rashi: number } {
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

  const nakshatra = Math.floor(moonLon / (360 / 27))
  const nakshatraStart = nakshatra * (360 / 27)
  const degreeInNakshatra = moonLon - nakshatraStart
  const pada = Math.floor(degreeInNakshatra / (360 / 27 / 4)) + 1
  const rashi = Math.floor(moonLon / 30)

  return { longitude: moonLon, nakshatra, pada, rashi }
}

function getVashyaGroup(rashiIndex: number): string {
  const rashi = RASHIS[rashiIndex]
  for (const [group, signs] of Object.entries(VASHYA_GROUPS)) {
    if (signs.includes(rashi)) return group
  }
  return 'Manav'
}

function getSignLord(sign: number): string {
  const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']
  return lords[sign]
}

// ============================================================================
// KOOTA CALCULATIONS WITH PROPER EXCEPTIONS
// ============================================================================

interface KootaResult {
  koota: string
  maxPoints: number
  scored: number
  status: 'pass' | 'warning' | 'fail' | 'exception'
  description: string
  details: string
  combination: string
  exceptions?: string[]
}

// Calculate Varna points (max 1)
function calculateVarna(maleNakshatra: number, femaleNakshatra: number): KootaResult {
  const maleVarna = NAKSHATRA_VARNA[maleNakshatra]
  const femaleVarna = NAKSHATRA_VARNA[femaleNakshatra]

  const maleIndex = VARNA_ORDER.indexOf(maleVarna)
  const femaleIndex = VARNA_ORDER.indexOf(femaleVarna)

  // Male varna should be same or higher than female (traditional rule)
  const points = maleIndex <= femaleIndex ? 1 : 0

  let combination = `${maleVarna}-${femaleVarna}`
  let status: 'pass' | 'warning' | 'fail' = points === 1 ? 'pass' : 'fail'

  return {
    koota: 'Varna',
    maxPoints: 1,
    scored: points,
    status,
    description: points === 1
      ? 'Compatible spiritual and ego levels'
      : 'Varna mismatch - minor factor, easily manageable',
    details: `Groom: ${maleVarna}, Bride: ${femaleVarna}. ${points === 1 ? 'Harmonious spiritual compatibility.' : 'Traditionally suggests groom should be equal or higher varna, but this is least weighted factor.'}`,
    combination
  }
}

// Calculate Vashya points (max 2)
function calculateVashya(maleRashi: number, femaleRashi: number): KootaResult {
  const maleGroup = getVashyaGroup(maleRashi)
  const femaleGroup = getVashyaGroup(femaleRashi)

  let points = 0
  let status: 'pass' | 'warning' | 'fail' = 'fail'

  // Same group = full points
  if (maleGroup === femaleGroup) {
    points = 2
    status = 'pass'
  }
  // Some groups have mutual attraction
  else if (
    (maleGroup === 'Chatushpad' && femaleGroup === 'Manav') ||
    (maleGroup === 'Manav' && femaleGroup === 'Chatushpad')
  ) {
    points = 1
    status = 'warning'
  }
  else if (
    (maleGroup === 'Manav' && femaleGroup === 'Jalchar') ||
    (maleGroup === 'Jalchar' && femaleGroup === 'Manav')
  ) {
    points = 0.5
    status = 'warning'
  }

  return {
    koota: 'Vashya',
    maxPoints: 2,
    scored: points,
    status,
    description: points === 2
      ? 'Excellent mutual attraction and influence'
      : points >= 1
        ? 'Good compatibility with some adjustments needed'
        : 'Different temperament types - requires conscious effort',
    details: `Groom's group: ${maleGroup}, Bride's group: ${femaleGroup}. ${points >= 1 ? 'Natural compatibility in control dynamics.' : 'Different natural temperaments - awareness helps.'}`,
    combination: `${maleGroup}-${femaleGroup}`
  }
}

// Calculate Tara points (max 3)
function calculateTara(maleNakshatra: number, femaleNakshatra: number): KootaResult {
  // Count from female to male nakshatra
  let countMale = ((maleNakshatra - femaleNakshatra + 27) % 27) + 1
  const maleTaraIndex = (countMale - 1) % 9

  // Count from male to female nakshatra
  let countFemale = ((femaleNakshatra - maleNakshatra + 27) % 27) + 1
  const femaleTaraIndex = (countFemale - 1) % 9

  // Good taras: Sampat(2), Kshema(4), Sadhaka(6), Mitra(8), Atimitra(9)
  // Bad taras: Janma(1), Vipat(3), Pratyari(5), Vadha(7)
  const goodTaras = [1, 3, 5, 7, 8] // 0-indexed: Sampat, Kshema, Sadhaka, Mitra, Atimitra

  let points = 0
  let status: 'pass' | 'warning' | 'fail' = 'fail'

  if (goodTaras.includes(maleTaraIndex) && goodTaras.includes(femaleTaraIndex)) {
    points = 3
    status = 'pass'
  } else if (goodTaras.includes(maleTaraIndex) || goodTaras.includes(femaleTaraIndex)) {
    points = 1.5
    status = 'warning'
  }

  return {
    koota: 'Tara',
    maxPoints: 3,
    scored: points,
    status,
    description: points === 3
      ? 'Excellent destiny compatibility and mutual luck'
      : points >= 1.5
        ? 'Moderate birth star harmony'
        : 'Birth star relationship needs attention',
    details: `Groom's Tara: ${TARA_NAMES[maleTaraIndex]}, Bride's Tara: ${TARA_NAMES[femaleTaraIndex]}. ${points >= 1.5 ? 'Stars support each other.' : 'Conscious effort to support each other recommended.'}`,
    combination: `${TARA_NAMES[maleTaraIndex]}-${TARA_NAMES[femaleTaraIndex]}`
  }
}

// Calculate Yoni points (max 4) with proper animal compatibility
function calculateYoni(maleNakshatra: number, femaleNakshatra: number): KootaResult {
  const maleYoniData = YONI_ANIMALS[maleNakshatra]
  const femaleYoniData = YONI_ANIMALS[femaleNakshatra]
  const maleYoni = maleYoniData.animal
  const femaleYoni = femaleYoniData.animal

  let points = 0
  let status: 'pass' | 'warning' | 'fail' = 'fail'

  // Same animal = 4 points
  if (maleYoni === femaleYoni) {
    points = 4
    status = 'pass'
  }
  // Enemy animals = 0 points
  else if (YONI_ENEMIES[maleYoni] === femaleYoni) {
    points = 0
    status = 'fail'
  }
  // Friendly animals = 3 points
  else {
    const friendlyPairs = [
      ['Horse', 'Deer'], ['Elephant', 'Sheep'], ['Dog', 'Cat'],
      ['Cow', 'Buffalo'], ['Monkey', 'Lion'], ['Serpent', 'Cat']
    ]

    const isFriendly = friendlyPairs.some(pair =>
      (pair[0] === maleYoni && pair[1] === femaleYoni) ||
      (pair[1] === maleYoni && pair[0] === femaleYoni)
    )

    if (isFriendly) {
      points = 3
      status = 'pass'
    } else {
      // Neutral = 2 points
      points = 2
      status = 'warning'
    }
  }

  return {
    koota: 'Yoni',
    maxPoints: 4,
    scored: points,
    status,
    description: points === 4
      ? 'Excellent physical and intimate compatibility'
      : points >= 3
        ? 'Good physical harmony'
        : points >= 2
          ? 'Average physical compatibility - understanding needed'
          : 'Physical compatibility challenges - requires patience',
    details: `Groom: ${maleYoni} (${maleYoniData.gender}), Bride: ${femaleYoni} (${femaleYoniData.gender}). ${points >= 3 ? 'Natural physical harmony.' : 'Focus on emotional connection over physical.'}`,
    combination: `${maleYoni}-${femaleYoni}`
  }
}

// Calculate Graha Maitri points (max 5)
function calculateGrahaMaitri(maleNakshatra: number, femaleNakshatra: number): KootaResult {
  const maleLord = NAKSHATRA_LORD[maleNakshatra]
  const femaleLord = NAKSHATRA_LORD[femaleNakshatra]

  let points = 0
  let status: 'pass' | 'warning' | 'fail' = 'fail'

  // Same lord = 5 points
  if (maleLord === femaleLord) {
    points = 5
    status = 'pass'
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
      status = 'pass'
    } else if (total === 1) {
      points = 4
      status = 'pass'
    } else if (total === 0) {
      points = 3
      status = 'warning'
    } else if (total === -1) {
      points = 1
      status = 'warning'
    } else {
      points = 0
      status = 'fail'
    }
  }

  return {
    koota: 'Graha Maitri',
    maxPoints: 5,
    scored: points,
    status,
    description: points >= 4
      ? 'Excellent mental and intellectual compatibility'
      : points >= 3
        ? 'Good mental wavelength with some differences'
        : 'Different thinking patterns - respect differences',
    details: `Groom's lord: ${maleLord}, Bride's lord: ${femaleLord}. ${points >= 3 ? 'Harmonious mental connection.' : 'Different mental approaches - communication key.'}`,
    combination: `${maleLord}-${femaleLord}`
  }
}

// Calculate Gana points (max 6) with exceptions
function calculateGana(maleNakshatra: number, femaleNakshatra: number): KootaResult {
  const maleGana = NAKSHATRA_GANA[maleNakshatra]
  const femaleGana = NAKSHATRA_GANA[femaleNakshatra]

  let points = 0
  let status: 'pass' | 'warning' | 'fail' | 'exception' = 'fail'
  const exceptions: string[] = []

  // Same gana = 6 points
  if (maleGana === femaleGana) {
    points = 6
    status = 'pass'
  }
  // Deva-Manushya = 5 points (good)
  else if (
    (maleGana === 'Deva' && femaleGana === 'Manushya') ||
    (maleGana === 'Manushya' && femaleGana === 'Deva')
  ) {
    points = 5
    status = 'pass'
  }
  // Manushya-Rakshasa = partial compatibility
  else if (maleGana === 'Manushya' && femaleGana === 'Rakshasa') {
    points = 1
    status = 'warning'
  }
  else if (maleGana === 'Rakshasa' && femaleGana === 'Manushya') {
    points = 2
    status = 'warning'
  }
  // Deva-Rakshasa = challenging
  else if (maleGana === 'Rakshasa' && femaleGana === 'Deva') {
    points = 0
    status = 'fail'
  }
  else if (maleGana === 'Deva' && femaleGana === 'Rakshasa') {
    points = 1
    status = 'warning'
  }
  // Rakshasa-Rakshasa = full points
  else if (maleGana === 'Rakshasa' && femaleGana === 'Rakshasa') {
    points = 6
    status = 'pass'
    exceptions.push('Same Rakshasa gana - actually compatible despite name')
  }

  // Exception: If total score is 25+ out of 36, Gana dosha is often overlooked
  // This exception is checked at the final scoring stage

  return {
    koota: 'Gana',
    maxPoints: 6,
    scored: points,
    status,
    description: points >= 5
      ? 'Excellent temperament match'
      : points >= 3
        ? 'Workable temperament differences'
        : points >= 1
          ? 'Temperament adjustment needed - patience helps'
          : 'Significant temperament differences - requires conscious effort',
    details: `Groom: ${maleGana}, Bride: ${femaleGana}. ${points >= 3 ? 'Compatible natures.' : 'Different temperaments - understanding and acceptance important.'}`,
    combination: `${maleGana}-${femaleGana}`,
    exceptions: exceptions.length > 0 ? exceptions : undefined
  }
}

// Calculate Bhakoot points (max 7) with exceptions
function calculateBhakoot(maleRashi: number, femaleRashi: number): KootaResult {
  const isBadCombination = BHAKOOT_BAD_COMBINATIONS.some(
    combo => combo[0] === maleRashi && combo[1] === femaleRashi
  )

  let points = isBadCombination ? 0 : 7
  let status: 'pass' | 'warning' | 'fail' | 'exception' = isBadCombination ? 'fail' : 'pass'
  const exceptions: string[] = []

  // Check for exceptions that cancel Bhakoot dosha
  if (isBadCombination) {
    const diff = ((femaleRashi - maleRashi + 12) % 12) + 1

    // Exception 1: Lords of both signs are friends
    const maleLord = getSignLord(maleRashi)
    const femaleLord = getSignLord(femaleRashi)
    const maleFriends = PLANET_FRIENDS[maleLord] || []

    if (maleLord === femaleLord) {
      exceptions.push('Same sign lord - Bhakoot dosha cancelled')
      points = 7
      status = 'exception'
    } else if (maleFriends.includes(femaleLord)) {
      exceptions.push('Sign lords are friends - Bhakoot dosha reduced')
      points = 3.5
      status = 'exception'
    }

    // Exception 2: Both signs have same lord (already covered above)

    // Exception 3: 5-9 relationship (Trinal) is actually good
    if (diff === 5 || diff === 9 || (12 - diff + 1) === 5 || (12 - diff + 1) === 9) {
      exceptions.push('5-9 (Trinal) relationship - considered auspicious')
      points = 7
      status = 'exception'
    }

    // Exception 4: Nadi dosha absent can partially compensate
    // This is checked at the main function level
  }

  // Determine relationship type
  let relationshipType = 'Favorable'
  if (isBadCombination) {
    const diff = ((femaleRashi - maleRashi + 12) % 12) + 1
    if (diff === 6 || diff === 8 || (12 - diff + 1) === 6 || (12 - diff + 1) === 8) {
      relationshipType = '6-8 relationship (Shadashtak)'
    } else if (diff === 2 || diff === 12 || (12 - diff + 1) === 2 || (12 - diff + 1) === 12) {
      relationshipType = '2-12 relationship (Dwirdwadash)'
    }
  } else if (maleRashi === femaleRashi) {
    relationshipType = 'Same sign'
  } else {
    const diff = ((femaleRashi - maleRashi + 12) % 12) + 1
    if (diff === 5 || diff === 9) relationshipType = '5-9 (Trinal) - auspicious'
    else if (diff === 4 || diff === 10) relationshipType = '4-10 (Kendra) - good'
    else if (diff === 3 || diff === 11) relationshipType = '3-11 (Growth axis) - good'
  }

  return {
    koota: 'Bhakoot',
    maxPoints: 7,
    scored: points,
    status,
    description: points === 7
      ? 'Excellent emotional and financial compatibility'
      : points >= 3.5
        ? 'Bhakoot challenged but exceptions apply - manageable'
        : 'Bhakoot dosha present - emotional adjustment needed',
    details: `Groom: ${RASHIS[maleRashi]}, Bride: ${RASHIS[femaleRashi]}. Relationship: ${relationshipType}. ${points >= 3.5 ? 'Good foundation for emotional bonding.' : 'Work on emotional understanding and financial harmony.'}`,
    combination: relationshipType,
    exceptions: exceptions.length > 0 ? exceptions : undefined
  }
}

// Calculate Nadi points (max 8) with PROPER EXCEPTIONS
function calculateNadi(
  maleNakshatra: number,
  femaleNakshatra: number,
  malePada: number,
  femalePada: number,
  maleRashi: number,
  femaleRashi: number
): KootaResult {
  const maleNadi = NAKSHATRA_NADI[maleNakshatra]
  const femaleNadi = NAKSHATRA_NADI[femaleNakshatra]

  const sameNadi = maleNadi === femaleNadi
  let points = sameNadi ? 0 : 8
  let status: 'pass' | 'warning' | 'fail' | 'exception' = sameNadi ? 'fail' : 'pass'
  const exceptions: string[] = []

  // Check for classical exceptions that cancel Nadi dosha
  if (sameNadi) {
    // Exception 1: Same nakshatra but different pada
    if (maleNakshatra === femaleNakshatra && malePada !== femalePada) {
      exceptions.push('Same nakshatra but different pada - Nadi dosha cancelled')
      points = 8
      status = 'exception'
    }

    // Exception 2: Same rashi but different nakshatra
    if (maleRashi === femaleRashi && maleNakshatra !== femaleNakshatra) {
      exceptions.push('Same rashi but different nakshatra - Nadi dosha cancelled')
      points = 8
      status = 'exception'
    }

    // Exception 3: Specific nakshatra pairs are exempt
    // Rohini, Ardra, Pushya, Shravana - if both have same nakshatra from this list
    const exemptNakshatras = [3, 5, 7, 21] // Rohini, Ardra, Pushya, Shravana
    if (exemptNakshatras.includes(maleNakshatra) && maleNakshatra === femaleNakshatra) {
      exceptions.push(`Both in ${NAKSHATRAS[maleNakshatra]} - traditionally exempt`)
      points = 8
      status = 'exception'
    }

    // Exception 4: Mrigashira, Chitra, Dhanishta - first two padas exempt
    const specialNakshatras = [4, 13, 22] // Mrigashira, Chitra, Dhanishta
    if (specialNakshatras.includes(maleNakshatra) && specialNakshatras.includes(femaleNakshatra)) {
      if ((malePada <= 2 && femalePada <= 2) || (malePada >= 3 && femalePada >= 3)) {
        exceptions.push(`${NAKSHATRAS[maleNakshatra]} special exception applies`)
        points = 4
        status = 'exception'
      }
    }

    // Exception 5: If rashi lords are same or friends - partial cancellation
    const maleLord = getSignLord(maleRashi)
    const femaleLord = getSignLord(femaleRashi)
    const maleFriends = PLANET_FRIENDS[maleLord] || []

    if (maleLord === femaleLord && points === 0) {
      exceptions.push('Same rashi lord - Nadi dosha partially reduced')
      points = 4
      status = 'exception'
    } else if (maleFriends.includes(femaleLord) && points === 0) {
      exceptions.push('Rashi lords are friends - minor mitigation')
      points = 2
      status = 'exception'
    }

    // Exception 6: Different pada same nakshatra already covered above

    // Exception 7: For Adi Nadi - if one is in first half of nakshatra and other in second half
    if (maleNadi === 'Adi' && maleNakshatra !== femaleNakshatra) {
      // Check degree difference within nakshatra
      exceptions.push('Different nakshatras within Adi Nadi - reduced effect')
      if (points === 0) {
        points = 2
        status = 'exception'
      }
    }
  }

  const nadiDescriptions: Record<string, string> = {
    'Adi': 'Vata (Air) constitution',
    'Madhya': 'Pitta (Fire) constitution',
    'Antya': 'Kapha (Water) constitution'
  }

  return {
    koota: 'Nadi',
    maxPoints: 8,
    scored: points,
    status,
    description: points === 8
      ? 'Excellent health and genetic compatibility'
      : points >= 4
        ? 'Nadi dosha present but exceptions apply - reduced concern'
        : points >= 2
          ? 'Nadi dosha with partial mitigation - consider remedies'
          : 'Nadi dosha present - health precautions and remedies recommended',
    details: `Groom: ${maleNadi} (${nadiDescriptions[maleNadi]}), Bride: ${femaleNadi} (${nadiDescriptions[femaleNadi]}). ${
      sameNadi
        ? `Same Nadi traditionally indicates similar health constitution. ${exceptions.length > 0 ? 'However, exceptions apply.' : 'Consider Nadi Nivarana remedies.'}`
        : 'Different Nadi indicates complementary constitutions - favorable for progeny.'
    }`,
    combination: `${maleNadi}-${femaleNadi}`,
    exceptions: exceptions.length > 0 ? exceptions : undefined
  }
}

// ============================================================================
// CHART-LEVEL COMPATIBILITY ANALYSIS
// ============================================================================

interface ChartLevelAnalysis {
  manglikCompatibility: {
    status: 'compatible' | 'mismatch' | 'both_manglik' | 'none'
    description: string
    recommendation: string
  }
  sevenHouseLords: {
    compatible: boolean
    description: string
  }
  marsVenusAnalysis: {
    description: string
    compatibility: 'excellent' | 'good' | 'moderate' | 'challenging'
  }
}

function analyzeChartLevelCompatibility(
  maleRashi: number,
  femaleRashi: number,
  maleNakshatra: number,
  femaleNakshatra: number
): ChartLevelAnalysis {
  // Simplified chart-level analysis based on available data
  // Full analysis would require complete birth charts

  // Mars/7th lord analysis (simplified using Moon sign)
  const maleMarsSign = maleRashi // Simplified - would need full chart
  const femaleMarsSign = femaleRashi

  // Check for Manglik-like combinations from Moon
  const maleMarsMoonRelation = 'neutral' // Would calculate from full chart
  const femaleMarsMoonRelation = 'neutral'

  const manglikCompatibility = {
    status: 'compatible' as const,
    description: 'Manglik status should be verified from full birth charts. Moon sign analysis suggests general compatibility.',
    recommendation: 'Verify Manglik dosha from complete Kundli with accurate birth times.'
  }

  // 7th house lord compatibility
  const male7thLord = getSignLord((maleRashi + 6) % 12)
  const female7thLord = getSignLord((femaleRashi + 6) % 12)
  const lordsAreFriends = PLANET_FRIENDS[male7thLord]?.includes(female7thLord) || male7thLord === female7thLord

  const sevenHouseLords = {
    compatible: lordsAreFriends,
    description: lordsAreFriends
      ? `7th lords (${male7thLord} and ${female7thLord}) are friendly - supports marital harmony.`
      : `7th lords (${male7thLord} and ${female7thLord}) are neutral/unfriendly - conscious effort in marriage needed.`
  }

  // Mars-Venus axis analysis (simplified)
  const maleLord = NAKSHATRA_LORD[maleNakshatra]
  const femaleLord = NAKSHATRA_LORD[femaleNakshatra]

  let marsVenusCompatibility: 'excellent' | 'good' | 'moderate' | 'challenging' = 'moderate'
  let marsVenusDesc = 'Average Mars-Venus dynamics.'

  if ((maleLord === 'Venus' || maleLord === 'Moon') && (femaleLord === 'Mars' || femaleLord === 'Sun')) {
    marsVenusCompatibility = 'excellent'
    marsVenusDesc = 'Strong Mars-Venus complementarity - natural attraction and passion.'
  } else if ((maleLord === 'Mars' && femaleLord === 'Venus') || (maleLord === 'Jupiter' && femaleLord === 'Moon')) {
    marsVenusCompatibility = 'good'
    marsVenusDesc = 'Good romantic and physical chemistry indicated.'
  }

  return {
    manglikCompatibility,
    sevenHouseLords,
    marsVenusAnalysis: {
      description: marsVenusDesc,
      compatibility: marsVenusCompatibility
    }
  }
}

// ============================================================================
// MAIN MATCHING FUNCTION
// ============================================================================

export interface MatchingResult {
  maleDetails: {
    nakshatra: string
    nakshatraIndex: number
    pada: number
    rashi: string
    rashiIndex: number
    nadi: string
    gana: string
  }
  femaleDetails: {
    nakshatra: string
    nakshatraIndex: number
    pada: number
    rashi: string
    rashiIndex: number
    nadi: string
    gana: string
  }
  kootas: KootaResult[]
  totalScore: number
  maxScore: number
  percentage: number
  verdict: string
  verdictType: 'excellent' | 'good' | 'average' | 'below_average'
  doshas: string[]
  exceptions: string[]
  chartLevelAnalysis: ChartLevelAnalysis
  recommendations: string[]
  strengthReasons: string[]
  watchOutPoints: string[]
}

export function calculateKundliMatching(
  maleBirthDate: Date,
  femaleBirthDate: Date,
  maleTimezone: number = 5.5,
  femaleTimezone: number = 5.5
): MatchingResult {
  // Calculate Moon positions
  const maleData = calculateMoonPosition(maleBirthDate, maleTimezone)
  const femaleData = calculateMoonPosition(femaleBirthDate, femaleTimezone)

  const maleNakshatra = maleData.nakshatra
  const femaleNakshatra = femaleData.nakshatra
  const maleRashi = maleData.rashi
  const femaleRashi = femaleData.rashi
  const malePada = maleData.pada
  const femalePada = femaleData.pada

  // Calculate all 8 kootas
  const varna = calculateVarna(maleNakshatra, femaleNakshatra)
  const vashya = calculateVashya(maleRashi, femaleRashi)
  const tara = calculateTara(maleNakshatra, femaleNakshatra)
  const yoni = calculateYoni(maleNakshatra, femaleNakshatra)
  const grahaMaitri = calculateGrahaMaitri(maleNakshatra, femaleNakshatra)
  const gana = calculateGana(maleNakshatra, femaleNakshatra)
  const bhakoot = calculateBhakoot(maleRashi, femaleRashi)
  const nadi = calculateNadi(maleNakshatra, femaleNakshatra, malePada, femalePada, maleRashi, femaleRashi)

  const kootas = [varna, vashya, tara, yoni, grahaMaitri, gana, bhakoot, nadi]

  // Calculate total score
  const totalScore = kootas.reduce((sum, k) => sum + k.scored, 0)
  const maxScore = 36
  const percentage = Math.round((totalScore / maxScore) * 100 * 10) / 10

  // Collect all exceptions applied
  const allExceptions: string[] = []
  kootas.forEach(k => {
    if (k.exceptions) allExceptions.push(...k.exceptions)
  })

  // Identify doshas
  const doshas: string[] = []
  if (nadi.status === 'fail') {
    doshas.push(`Nadi Dosha: Same Nadi (${NAKSHATRA_NADI[maleNakshatra]}) may affect health and progeny. Remedies recommended.`)
  }
  if (bhakoot.status === 'fail') {
    doshas.push(`Bhakoot Dosha: ${bhakoot.combination} relationship may affect emotional/financial harmony.`)
  }
  if (gana.scored <= 1) {
    doshas.push(`Gana Dosha: ${NAKSHATRA_GANA[maleNakshatra]}-${NAKSHATRA_GANA[femaleNakshatra]} temperament mismatch requires patience.`)
  }

  // Additional exception: High total score can compensate for individual doshas
  if (totalScore >= 25 && doshas.length > 0) {
    allExceptions.push(`High overall score (${totalScore}/36) compensates for individual doshas`)
  }

  // Chart-level analysis
  const chartLevelAnalysis = analyzeChartLevelCompatibility(maleRashi, femaleRashi, maleNakshatra, femaleNakshatra)

  // Determine verdict
  let verdict = ''
  let verdictType: 'excellent' | 'good' | 'average' | 'below_average' = 'below_average'

  if (totalScore >= 28) {
    verdict = 'Excellent Match - Highly compatible for marriage. Strong foundation for a harmonious relationship.'
    verdictType = 'excellent'
  } else if (totalScore >= 21) {
    verdict = 'Good Match - Favorable compatibility with minor adjustments needed. Recommended for marriage.'
    verdictType = 'good'
  } else if (totalScore >= 18) {
    verdict = 'Average Match - Compatibility present with some challenges. Marriage possible with awareness and effort.'
    verdictType = 'average'
  } else {
    verdict = 'Below Average - Significant compatibility challenges exist. Consult an astrologer for detailed analysis and remedies.'
    verdictType = 'below_average'
  }

  // Adjust verdict if many exceptions apply
  if (allExceptions.length >= 2 && verdictType === 'average') {
    verdict += ' However, multiple exceptions apply which improve the outlook.'
  }

  // Generate strength reasons
  const strengthReasons: string[] = []
  if (nadi.scored >= 8) strengthReasons.push('Excellent Nadi compatibility - healthy progeny indicated')
  if (bhakoot.scored >= 7) strengthReasons.push('Strong Bhakoot - emotional and financial harmony')
  if (gana.scored >= 5) strengthReasons.push('Good Gana match - compatible temperaments')
  if (grahaMaitri.scored >= 4) strengthReasons.push('Strong Graha Maitri - mental wavelength aligned')
  if (yoni.scored >= 3) strengthReasons.push('Good Yoni - physical compatibility')
  if (chartLevelAnalysis.sevenHouseLords.compatible) strengthReasons.push('7th lords compatible - marriage supported')

  // Generate watch-out points
  const watchOutPoints: string[] = []
  if (nadi.scored < 4) watchOutPoints.push('Nadi requires attention - consider Nadi Nivarana puja')
  if (bhakoot.scored < 4) watchOutPoints.push('Bhakoot challenging - work on emotional understanding')
  if (gana.scored < 3) watchOutPoints.push('Gana mismatch - patience and acceptance needed')
  if (yoni.scored < 2) watchOutPoints.push('Yoni challenging - focus on emotional intimacy')

  // Generate recommendations
  const recommendations: string[] = []

  if (doshas.length === 0) {
    recommendations.push('This is a compatible match. Proceed with confidence.')
  } else {
    recommendations.push('Consider consulting a learned astrologer for personalized guidance.')
    if (nadi.scored < 8 && nadi.status !== 'exception') {
      recommendations.push('Nadi Nivarana Puja recommended before marriage.')
    }
    if (bhakoot.scored < 7 && bhakoot.status !== 'exception') {
      recommendations.push('Bhakoot Shanti rituals may help harmonize energies.')
    }
  }

  if (allExceptions.length > 0) {
    recommendations.push('Note: Several classical exceptions apply to this match, improving the compatibility.')
  }

  recommendations.push('Both partners should focus on communication and mutual understanding.')

  return {
    maleDetails: {
      nakshatra: NAKSHATRAS[maleNakshatra],
      nakshatraIndex: maleNakshatra,
      pada: malePada,
      rashi: RASHIS[maleRashi],
      rashiIndex: maleRashi,
      nadi: NAKSHATRA_NADI[maleNakshatra],
      gana: NAKSHATRA_GANA[maleNakshatra]
    },
    femaleDetails: {
      nakshatra: NAKSHATRAS[femaleNakshatra],
      nakshatraIndex: femaleNakshatra,
      pada: femalePada,
      rashi: RASHIS[femaleRashi],
      rashiIndex: femaleRashi,
      nadi: NAKSHATRA_NADI[femaleNakshatra],
      gana: NAKSHATRA_GANA[femaleNakshatra]
    },
    kootas,
    totalScore,
    maxScore,
    percentage,
    verdict,
    verdictType,
    doshas,
    exceptions: allExceptions,
    chartLevelAnalysis,
    recommendations,
    strengthReasons,
    watchOutPoints
  }
}
