/**
 * Horoscope Calculations - Generate daily/monthly/yearly predictions
 * Based on planetary transits and zodiac sign characteristics
 */

// Zodiac signs with their characteristics
export const ZODIAC_SIGNS = [
  { name: "Aries", sanskrit: "Mesha", symbol: "♈", dates: "Mar 21 - Apr 19", element: "Fire", ruler: "Mars", quality: "Cardinal" },
  { name: "Taurus", sanskrit: "Vrishabha", symbol: "♉", dates: "Apr 20 - May 20", element: "Earth", ruler: "Venus", quality: "Fixed" },
  { name: "Gemini", sanskrit: "Mithuna", symbol: "♊", dates: "May 21 - Jun 20", element: "Air", ruler: "Mercury", quality: "Mutable" },
  { name: "Cancer", sanskrit: "Karka", symbol: "♋", dates: "Jun 21 - Jul 22", element: "Water", ruler: "Moon", quality: "Cardinal" },
  { name: "Leo", sanskrit: "Simha", symbol: "♌", dates: "Jul 23 - Aug 22", element: "Fire", ruler: "Sun", quality: "Fixed" },
  { name: "Virgo", sanskrit: "Kanya", symbol: "♍", dates: "Aug 23 - Sep 22", element: "Earth", ruler: "Mercury", quality: "Mutable" },
  { name: "Libra", sanskrit: "Tula", symbol: "♎", dates: "Sep 23 - Oct 22", element: "Air", ruler: "Venus", quality: "Cardinal" },
  { name: "Scorpio", sanskrit: "Vrishchika", symbol: "♏", dates: "Oct 23 - Nov 21", element: "Water", ruler: "Mars", quality: "Fixed" },
  { name: "Sagittarius", sanskrit: "Dhanu", symbol: "♐", dates: "Nov 22 - Dec 21", element: "Fire", ruler: "Jupiter", quality: "Mutable" },
  { name: "Capricorn", sanskrit: "Makara", symbol: "♑", dates: "Dec 22 - Jan 19", element: "Earth", ruler: "Saturn", quality: "Cardinal" },
  { name: "Aquarius", sanskrit: "Kumbha", symbol: "♒", dates: "Jan 20 - Feb 18", element: "Air", ruler: "Saturn", quality: "Fixed" },
  { name: "Pisces", sanskrit: "Meena", symbol: "♓", dates: "Feb 19 - Mar 20", element: "Water", ruler: "Jupiter", quality: "Mutable" },
]

// Planet positions for transit calculations
interface PlanetPosition {
  longitude: number
  sign: string
  signIndex: number
}

// Calculate Sun's position
function calculateSunPosition(date: Date): PlanetPosition {
  const JD = getJulianDate(date)
  const T = (JD - 2451545.0) / 36525
  
  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360
  const e = 0.016708634 - 0.000042037 * T
  
  const C = (1.914602 - 0.004817 * T) * Math.sin(M * Math.PI / 180) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180) +
            0.000289 * Math.sin(3 * M * Math.PI / 180)
  
  let longitude = (L0 + C) % 360
  if (longitude < 0) longitude += 360
  
  // Vedic (Sidereal) correction - Ayanamsa
  const ayanamsa = 24.1
  longitude = (longitude - ayanamsa + 360) % 360
  
  const signIndex = Math.floor(longitude / 30)
  return {
    longitude,
    sign: ZODIAC_SIGNS[signIndex].name,
    signIndex
  }
}

// Calculate Moon's position
function calculateMoonPosition(date: Date): PlanetPosition {
  const JD = getJulianDate(date)
  const T = (JD - 2451545.0) / 36525
  
  const L = (218.3164477 + 481267.88123421 * T) % 360
  const D = (297.8501921 + 445267.1114034 * T) % 360
  const M = (357.5291092 + 35999.0502909 * T) % 360
  const Mp = (134.9633964 + 477198.8675055 * T) % 360
  const F = (93.272095 + 483202.0175233 * T) % 360
  
  let longitude = L + 
    6.289 * Math.sin(Mp * Math.PI / 180) +
    1.274 * Math.sin((2 * D - Mp) * Math.PI / 180) +
    0.658 * Math.sin(2 * D * Math.PI / 180) +
    0.214 * Math.sin(2 * Mp * Math.PI / 180) -
    0.186 * Math.sin(M * Math.PI / 180)
  
  longitude = longitude % 360
  if (longitude < 0) longitude += 360
  
  const ayanamsa = 24.1
  longitude = (longitude - ayanamsa + 360) % 360
  
  const signIndex = Math.floor(longitude / 30)
  return {
    longitude,
    sign: ZODIAC_SIGNS[signIndex].name,
    signIndex
  }
}

function getJulianDate(date: Date): number {
  const Y = date.getUTCFullYear()
  const M = date.getUTCMonth() + 1
  const D = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24
  
  const A = Math.floor((14 - M) / 12)
  const y = Y + 4800 - A
  const m = M + 12 * A - 3
  
  return D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 
         Math.floor(y / 100) + Math.floor(y / 400) - 32045
}

// Planet effects on each sign
const PLANET_EFFECTS: Record<string, Record<string, { positive: boolean; area: string; description: string }>> = {
  Sun: {
    Aries: { positive: true, area: "career", description: "Leadership opportunities shine bright" },
    Taurus: { positive: false, area: "finance", description: "Careful with expenses" },
    Gemini: { positive: true, area: "general", description: "Communication skills enhanced" },
    Cancer: { positive: false, area: "health", description: "Need for rest and recuperation" },
    Leo: { positive: true, area: "love", description: "Romance and creativity flourish" },
    Virgo: { positive: true, area: "career", description: "Recognition for hard work" },
    Libra: { positive: false, area: "general", description: "Time for introspection" },
    Scorpio: { positive: true, area: "finance", description: "Hidden resources revealed" },
    Sagittarius: { positive: true, area: "general", description: "Expansion and growth period" },
    Capricorn: { positive: true, area: "career", description: "Ambitions reach new heights" },
    Aquarius: { positive: false, area: "health", description: "Balance work and rest" },
    Pisces: { positive: true, area: "love", description: "Spiritual connections deepen" },
  },
  Moon: {
    Aries: { positive: true, area: "general", description: "Emotional energy high" },
    Taurus: { positive: true, area: "love", description: "Comfort and security in relationships" },
    Gemini: { positive: false, area: "health", description: "Mental restlessness possible" },
    Cancer: { positive: true, area: "love", description: "Deep emotional fulfillment" },
    Leo: { positive: true, area: "general", description: "Creative expression flows" },
    Virgo: { positive: false, area: "career", description: "Details may overwhelm" },
    Libra: { positive: true, area: "love", description: "Harmony in partnerships" },
    Scorpio: { positive: false, area: "general", description: "Intense emotions surface" },
    Sagittarius: { positive: true, area: "finance", description: "Optimistic outlook helps" },
    Capricorn: { positive: false, area: "love", description: "Emotional restraint advised" },
    Aquarius: { positive: true, area: "general", description: "Innovative ideas emerge" },
    Pisces: { positive: true, area: "health", description: "Intuition guides wellness" },
  },
}

// Prediction templates by area
const PREDICTIONS = {
  general: {
    positive: [
      "Today brings favorable energy for personal growth and self-expression.",
      "The stars align to support your endeavors and bring clarity to decisions.",
      "A day of positive developments and unexpected opportunities awaits.",
      "Your natural charm and abilities are heightened today.",
      "Fortune favors the bold - take calculated risks today.",
    ],
    negative: [
      "Today calls for patience and careful consideration before acting.",
      "Minor obstacles may arise - use them as learning opportunities.",
      "A good day for reflection rather than major initiatives.",
      "Take time to recharge your energy and avoid overcommitment.",
      "Focus on consolidation rather than expansion today.",
    ],
  },
  love: {
    positive: [
      "Romance blooms as planetary energies favor emotional connections.",
      "Singles may encounter a meaningful connection today.",
      "Existing relationships deepen through honest communication.",
      "Express your feelings openly - they'll be well received.",
      "Love and harmony characterize your relationships today.",
    ],
    negative: [
      "Minor misunderstandings possible - practice patience with loved ones.",
      "Take time for self-love before seeking external validation.",
      "A day to reflect on relationship patterns and growth areas.",
      "Focus on understanding before being understood.",
      "Emotional sensitivity heightened - choose words carefully.",
    ],
  },
  career: {
    positive: [
      "Professional opportunities align with your skills and ambitions.",
      "Recognition for your hard work may come from unexpected sources.",
      "Collaborative efforts yield excellent results today.",
      "Your innovative ideas gain traction with decision-makers.",
      "Leadership qualities shine through in workplace interactions.",
    ],
    negative: [
      "Avoid major work decisions until you have all information.",
      "Routine tasks take precedence over new initiatives today.",
      "Workplace dynamics require diplomatic handling.",
      "Focus on completing existing projects before starting new ones.",
      "Patience with colleagues and processes is essential today.",
    ],
  },
  finance: {
    positive: [
      "Financial opportunities present themselves - evaluate carefully.",
      "Past investments show positive returns or developments.",
      "A good day for financial planning and budget reviews.",
      "Unexpected monetary gains possible from past efforts.",
      "Your financial intuition is sharp - trust your judgment.",
    ],
    negative: [
      "Avoid impulsive purchases and major financial commitments.",
      "Review rather than initiate financial transactions today.",
      "Hidden expenses may surface - review your budget.",
      "Save rather than spend is today's mantra.",
      "Financial caution prevents future regrets.",
    ],
  },
  health: {
    positive: [
      "Energy levels are high - make the most of it!",
      "Physical activities bring joy and vitality today.",
      "Mental clarity supports overall well-being.",
      "A great day to start new health routines or habits.",
      "Your body responds well to positive lifestyle choices.",
    ],
    negative: [
      "Rest and recuperation should be prioritized today.",
      "Avoid overexertion and respect your body's limits.",
      "Stress management techniques will be beneficial.",
      "Pay attention to subtle health signals from your body.",
      "Balance activity with adequate rest periods.",
    ],
  },
}

// Lucky colors based on day and sign
const LUCKY_COLORS: Record<string, string[]> = {
  Aries: ["Red", "Orange", "White"],
  Taurus: ["Green", "Pink", "White"],
  Gemini: ["Yellow", "Green", "Light Blue"],
  Cancer: ["White", "Silver", "Cream"],
  Leo: ["Gold", "Orange", "Red"],
  Virgo: ["Green", "White", "Yellow"],
  Libra: ["Pink", "Blue", "White"],
  Scorpio: ["Red", "Maroon", "Black"],
  Sagittarius: ["Purple", "Blue", "Yellow"],
  Capricorn: ["Black", "Grey", "Brown"],
  Aquarius: ["Blue", "Turquoise", "Silver"],
  Pisces: ["Sea Green", "Purple", "White"],
}

// Lucky numbers based on ruling planet
const LUCKY_NUMBERS: Record<string, number[]> = {
  Aries: [9, 1, 8],
  Taurus: [6, 5, 2],
  Gemini: [5, 3, 6],
  Cancer: [2, 7, 9],
  Leo: [1, 4, 6],
  Virgo: [5, 3, 2],
  Libra: [6, 5, 9],
  Scorpio: [9, 4, 2],
  Sagittarius: [3, 5, 8],
  Capricorn: [8, 2, 6],
  Aquarius: [8, 3, 7],
  Pisces: [3, 7, 9],
}

// Lucky days based on ruling planet
const LUCKY_DAYS: Record<string, string> = {
  Aries: "Tuesday",
  Taurus: "Friday",
  Gemini: "Wednesday",
  Cancer: "Monday",
  Leo: "Sunday",
  Virgo: "Wednesday",
  Libra: "Friday",
  Scorpio: "Tuesday",
  Sagittarius: "Thursday",
  Capricorn: "Saturday",
  Aquarius: "Saturday",
  Pisces: "Thursday",
}

// Hash function for pseudo-random but consistent predictions
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function selectFromArray<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// Calculate scores based on planetary positions
function calculateAreaScore(sign: string, date: Date, area: string): number {
  const sunPos = calculateSunPosition(date)
  const moonPos = calculateMoonPosition(date)
  const signIndex = ZODIAC_SIGNS.findIndex(z => z.name === sign)
  
  // Base score depends on sign's relationship with current transits
  let baseScore = 65
  
  // Sun transit effect
  const sunDist = (12 + sunPos.signIndex - signIndex) % 12
  if (sunDist === 0) baseScore += 15 // Sun in own sign
  else if (sunDist === 4 || sunDist === 8) baseScore += 10 // Trine
  else if (sunDist === 3 || sunDist === 9) baseScore += 5 // Sextile
  else if (sunDist === 6) baseScore -= 10 // Opposition
  else if (sunDist === 3 || sunDist === 10) baseScore -= 5 // Square
  
  // Moon transit effect
  const moonDist = (12 + moonPos.signIndex - signIndex) % 12
  if (moonDist === 0) baseScore += 10
  else if (moonDist === 4 || moonDist === 8) baseScore += 8
  else if (moonDist === 6) baseScore -= 8
  
  // Area-specific variation
  const dateHash = hashCode(sign + date.toDateString() + area)
  const variation = (dateHash % 21) - 10 // -10 to +10
  
  return Math.min(95, Math.max(35, baseScore + variation))
}

// Generate daily horoscope
export interface DailyHoroscope {
  sign: string
  sanskrit: string
  symbol: string
  date: string
  overallScore: number
  predictions: {
    general: string
    love: string
    career: string
    finance: string
    health: string
  }
  scores: {
    love: number
    career: number
    finance: number
    health: number
  }
  luckyColor: string
  luckyNumber: number
  luckyTime: string
  advice: string
}

export function generateDailyHoroscope(signName: string, date: Date = new Date()): DailyHoroscope {
  const sign = ZODIAC_SIGNS.find(z => z.name.toLowerCase() === signName.toLowerCase())
  if (!sign) throw new Error(`Invalid sign: ${signName}`)
  
  const dateStr = date.toDateString()
  const seed = hashCode(sign.name + dateStr)
  
  // Calculate scores for each area
  const scores = {
    love: calculateAreaScore(sign.name, date, 'love'),
    career: calculateAreaScore(sign.name, date, 'career'),
    finance: calculateAreaScore(sign.name, date, 'finance'),
    health: calculateAreaScore(sign.name, date, 'health'),
  }
  
  const overallScore = Math.round((scores.love + scores.career + scores.finance + scores.health) / 4)
  
  // Select predictions based on scores
  const getPrediction = (area: keyof typeof PREDICTIONS, score: number) => {
    const isPositive = score >= 60
    const options = isPositive ? PREDICTIONS[area].positive : PREDICTIONS[area].negative
    return selectFromArray(options, seed + area.length)
  }
  
  // Calculate lucky time based on Moon
  const moonPos = calculateMoonPosition(date)
  const luckyHour = (9 + Math.floor(moonPos.longitude / 30)) % 12 || 12
  const ampm = luckyHour < 6 ? 'PM' : 'AM'
  
  return {
    sign: sign.name,
    sanskrit: sign.sanskrit,
    symbol: sign.symbol,
    date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    overallScore,
    predictions: {
      general: getPrediction('general', overallScore),
      love: getPrediction('love', scores.love),
      career: getPrediction('career', scores.career),
      finance: getPrediction('finance', scores.finance),
      health: getPrediction('health', scores.health),
    },
    scores,
    luckyColor: selectFromArray(LUCKY_COLORS[sign.name], seed),
    luckyNumber: selectFromArray(LUCKY_NUMBERS[sign.name], seed),
    luckyTime: `${luckyHour}:00 ${ampm}`,
    advice: generateAdvice(sign.name, overallScore, seed),
  }
}

function generateAdvice(sign: string, score: number, seed: number): string {
  const signData = ZODIAC_SIGNS.find(z => z.name === sign)!
  
  const advices = {
    Fire: [
      "Channel your natural enthusiasm into productive endeavors.",
      "Your energy is contagious - inspire others around you.",
      "Balance action with reflection for best results.",
    ],
    Earth: [
      "Your practical approach serves you well today.",
      "Trust in the process and avoid rushing outcomes.",
      "Ground yourself through nature or physical activity.",
    ],
    Air: [
      "Your ideas flow freely - capture them while fresh.",
      "Communication is your superpower today.",
      "Connect with like-minded individuals for inspiration.",
    ],
    Water: [
      "Trust your intuition - it's especially accurate now.",
      "Emotional intelligence guides your decisions.",
      "Take time for creative or spiritual practices.",
    ],
  }
  
  return selectFromArray(advices[signData.element as keyof typeof advices], seed)
}

// Generate monthly horoscope
export interface MonthlyHoroscope {
  sign: string
  sanskrit: string
  symbol: string
  month: string
  year: number
  overallScore: number
  scores: {
    love: number
    career: number
    finance: number
    health: number
  }
  overview: string
  lovePrediction: string
  careerPrediction: string
  financePrediction: string
  healthPrediction: string
  luckyNumbers: number[]
  luckyColors: string[]
  luckyDays: string[]
  challengingDays: number[]
  advice: string
  keyDates: { date: number; event: string }[]
}

export function generateMonthlyHoroscope(signName: string, month: number, year: number): MonthlyHoroscope {
  const sign = ZODIAC_SIGNS.find(z => z.name.toLowerCase() === signName.toLowerCase())
  if (!sign) throw new Error(`Invalid sign: ${signName}`)
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]
  const monthName = monthNames[month - 1]
  
  const seed = hashCode(sign.name + monthName + year)
  const midMonth = new Date(year, month - 1, 15)
  
  // Calculate scores using mid-month transits
  const scores = {
    love: calculateAreaScore(sign.name, midMonth, 'love'),
    career: calculateAreaScore(sign.name, midMonth, 'career'),
    finance: calculateAreaScore(sign.name, midMonth, 'finance'),
    health: calculateAreaScore(sign.name, midMonth, 'health'),
  }
  
  const overallScore = Math.round((scores.love + scores.career + scores.finance + scores.health) / 4)
  
  // Generate detailed monthly predictions
  const monthlyPredictions = {
    overview: generateMonthlyOverview(sign, month, overallScore, seed),
    love: generateMonthlyLove(sign, month, scores.love, seed),
    career: generateMonthlyCareer(sign, month, scores.career, seed),
    finance: generateMonthlyFinance(sign, month, scores.finance, seed),
    health: generateMonthlyHealth(sign, month, scores.health, seed),
  }
  
  // Key dates
  const keyDates = [
    { date: 1 + (seed % 5), event: scores.love > 70 ? "Romantic opportunities" : "Focus on self-care" },
    { date: 10 + (seed % 5), event: scores.career > 70 ? "Career breakthrough" : "Professional learning" },
    { date: 15 + (seed % 3), event: "Important decision point" },
    { date: 22 + (seed % 5), event: scores.finance > 70 ? "Financial gains" : "Budget review" },
  ]
  
  return {
    sign: sign.name,
    sanskrit: sign.sanskrit,
    symbol: sign.symbol,
    month: monthName,
    year,
    overallScore,
    scores,
    overview: monthlyPredictions.overview,
    lovePrediction: monthlyPredictions.love,
    careerPrediction: monthlyPredictions.career,
    financePrediction: monthlyPredictions.finance,
    healthPrediction: monthlyPredictions.health,
    luckyNumbers: LUCKY_NUMBERS[sign.name],
    luckyColors: LUCKY_COLORS[sign.name],
    luckyDays: [LUCKY_DAYS[sign.name], getSecondaryLuckyDay(sign.name, seed)],
    challengingDays: [7 + (seed % 3), 14 + (seed % 3), 21 + (seed % 3)],
    advice: generateMonthlyAdvice(sign, overallScore, seed),
    keyDates,
  }
}

function generateMonthlyOverview(sign: typeof ZODIAC_SIGNS[0], month: number, score: number, seed: number): string {
  const quality = score >= 75 ? "excellent" : score >= 60 ? "favorable" : "moderate"
  return `${month === 1 || month === 4 || month === 7 || month === 10 ? "This quarter begins with" : "This month brings"} ${quality} energies for ${sign.name} natives. ${sign.ruler}'s influence ${score >= 65 ? "enhances" : "challenges"} your natural ${sign.element} qualities, creating opportunities for ${score >= 70 ? "growth and expansion" : "reflection and consolidation"}. The planetary alignments suggest ${score >= 60 ? "favorable conditions for new initiatives" : "a time to focus on existing commitments"}. Pay attention to the transiting planets as they activate different houses in your chart throughout the month.`
}

function generateMonthlyLove(sign: typeof ZODIAC_SIGNS[0], month: number, score: number, seed: number): string {
  if (score >= 75) {
    return `Romance flourishes this month! Venus's favorable aspects create magical moments in your love life. Singles may find meaningful connections through ${sign.element === 'Fire' ? 'social activities' : sign.element === 'Earth' ? 'work or hobbies' : sign.element === 'Air' ? 'intellectual pursuits' : 'emotional connections'}. Couples experience renewed passion and deeper understanding. Express your feelings openly - the cosmos supports vulnerability.`
  } else if (score >= 60) {
    return `Love life shows steady progress this month. Communication with your partner improves, and singles may encounter interesting prospects. Focus on building genuine connections rather than superficial attractions. The mid-month period is particularly favorable for romantic initiatives.`
  } else {
    return `This month calls for patience in matters of the heart. Some relationship challenges may surface, offering opportunities for growth. Singles should focus on self-love and personal development. Existing relationships benefit from honest conversations about needs and expectations.`
  }
}

function generateMonthlyCareer(sign: typeof ZODIAC_SIGNS[0], month: number, score: number, seed: number): string {
  if (score >= 75) {
    return `Professional life shines this month! Your ${sign.quality} nature helps you seize opportunities that arise. Recognition for past efforts comes through, and new projects show great promise. Leadership opportunities may present themselves - embrace them with confidence. Networking efforts yield valuable connections.`
  } else if (score >= 60) {
    return `Career matters progress steadily this month. Focus on skill development and strengthening professional relationships. A balanced approach between ambition and collaboration serves you well. Be patient with bureaucratic processes and document your achievements.`
  } else {
    return `Professional life requires extra attention this month. Navigate workplace dynamics carefully and avoid office politics. Focus on completing pending tasks rather than starting new initiatives. This is an excellent time for learning and upskilling. Patience with colleagues is essential.`
  }
}

function generateMonthlyFinance(sign: typeof ZODIAC_SIGNS[0], month: number, score: number, seed: number): string {
  if (score >= 75) {
    return `Financial prospects are excellent this month! Investment opportunities present themselves - evaluate carefully but act decisively. Past financial decisions show positive results. Unexpected gains possible through ${sign.element === 'Earth' ? 'property or investments' : sign.element === 'Fire' ? 'bold ventures' : sign.element === 'Air' ? 'intellectual property or trading' : 'intuitive decisions'}.`
  } else if (score >= 60) {
    return `Finances remain stable with potential for moderate growth. Focus on budgeting and financial planning. Avoid major purchases unless absolutely necessary. This is a good time to review insurance, investments, and savings strategies.`
  } else {
    return `Financial caution is advised this month. Unexpected expenses may arise - maintain an emergency fund. Avoid lending money or making risky investments. Focus on debt reduction if applicable. The end of the month brings better financial clarity.`
  }
}

function generateMonthlyHealth(sign: typeof ZODIAC_SIGNS[0], month: number, score: number, seed: number): string {
  if (score >= 75) {
    return `Health and vitality are strong this month! Energy levels support active pursuits and new fitness goals. ${sign.element === 'Fire' ? 'High-intensity activities' : sign.element === 'Earth' ? 'Outdoor activities and nature' : sign.element === 'Air' ? 'Social sports and group classes' : 'Water-based activities and yoga'} prove particularly beneficial. Mental wellness is excellent.`
  } else if (score >= 60) {
    return `Overall health remains stable with attention to basics. Maintain regular exercise and balanced nutrition. Get adequate sleep and manage stress through relaxation techniques. Minor ailments may surface but resolve quickly with proper care.`
  } else {
    return `Health requires extra attention this month. Avoid overexertion and prioritize rest. Stress management is crucial - consider meditation or breathing exercises. Pay attention to ${sign.element === 'Fire' ? 'inflammation and blood pressure' : sign.element === 'Earth' ? 'digestion and joints' : sign.element === 'Air' ? 'respiratory and nervous system' : 'fluid balance and emotions'}. Regular health check-ups recommended.`
  }
}

function generateMonthlyAdvice(sign: typeof ZODIAC_SIGNS[0], score: number, seed: number): string {
  const advices = [
    `As a ${sign.name}, your natural ${sign.quality.toLowerCase()} approach serves you well. ${score >= 65 ? 'Push forward with confidence' : 'Practice patience and persistence'}.`,
    `With ${sign.ruler} as your ruler, channel its energy through ${score >= 65 ? 'decisive action' : 'mindful reflection'} this month.`,
    `Your ${sign.element} nature ${score >= 65 ? 'is amplified' : 'needs balancing'}. Embrace ${sign.element === 'Fire' ? 'courage' : sign.element === 'Earth' ? 'stability' : sign.element === 'Air' ? 'adaptability' : 'intuition'} in your decisions.`,
  ]
  return selectFromArray(advices, seed)
}

function getSecondaryLuckyDay(sign: string, seed: number): string {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const primaryDay = LUCKY_DAYS[sign]
  const filtered = days.filter(d => d !== primaryDay)
  return selectFromArray(filtered, seed)
}

// Get all zodiac signs info
export function getAllZodiacSigns() {
  return ZODIAC_SIGNS.map(sign => ({
    ...sign,
    luckyColors: LUCKY_COLORS[sign.name],
    luckyNumbers: LUCKY_NUMBERS[sign.name],
    luckyDay: LUCKY_DAYS[sign.name],
  }))
}
