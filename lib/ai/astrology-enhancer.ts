// Astrology Enhancement Layer for Jyoti AI
// Enhances bot responses with relevant astrological insights

interface BirthChartData {
  ascendant?: string
  moonSign?: string
  sunSign?: string
  nakshatra?: string
  currentDasha?: {
    mahadasha: string
    antardasha: string
  }
  houses?: Record<number, {
    sign: string
    lord: string
    planets: string[]
  }>
  planets?: Record<string, { sign: string; house: number; degree: number }>
}

interface TransitData {
  planet: string
  sign: string
  house: number
  interpretation: string
  duration: string
}

// Life area to astrological house mapping
const houseMapping: Record<string, { house: number; ruler: string; description: string }> = {
  career: { house: 10, ruler: 'Saturn', description: 'profession and public image' },
  relationship: { house: 7, ruler: 'Venus', description: 'partnerships and marriage' },
  health: { house: 6, ruler: 'Mercury', description: 'health and daily routines' },
  finance: { house: 2, ruler: 'Jupiter', description: 'wealth and possessions' },
  family: { house: 4, ruler: 'Moon', description: 'home and emotional foundation' },
  education: { house: 5, ruler: 'Jupiter', description: 'learning and creativity' },
  spiritual: { house: 9, ruler: 'Jupiter', description: 'higher wisdom and dharma' },
  communication: { house: 3, ruler: 'Mercury', description: 'expression and siblings' }
}

// Planet characteristics for contextual insights
const planetInsights: Record<string, { nature: string; lesson: string; strengthens: string }> = {
  Sun: { 
    nature: 'soul, authority, father',
    lesson: 'developing confidence and authentic self-expression',
    strengthens: 'leadership, vitality, and sense of purpose'
  },
  Moon: {
    nature: 'mind, emotions, mother',
    lesson: 'emotional balance and inner peace',
    strengthens: 'intuition, nurturing abilities, and emotional intelligence'
  },
  Mars: {
    nature: 'energy, courage, action',
    lesson: 'channeling energy constructively',
    strengthens: 'determination, physical vitality, and assertiveness'
  },
  Mercury: {
    nature: 'intellect, communication, commerce',
    lesson: 'clear thinking and effective expression',
    strengthens: 'analytical abilities, adaptability, and learning'
  },
  Jupiter: {
    nature: 'wisdom, expansion, blessings',
    lesson: 'growth through faith and higher learning',
    strengthens: 'optimism, generosity, and spiritual understanding'
  },
  Venus: {
    nature: 'love, beauty, harmony',
    lesson: 'appreciating beauty and cultivating relationships',
    strengthens: 'artistic sense, diplomacy, and romantic connections'
  },
  Saturn: {
    nature: 'discipline, karma, time',
    lesson: 'patience, perseverance, and accepting responsibility',
    strengthens: 'structure, long-term planning, and maturity'
  },
  Rahu: {
    nature: 'desires, ambition, illusion',
    lesson: 'pursuing growth while staying grounded',
    strengthens: 'innovation, unconventional thinking, and worldly success'
  },
  Ketu: {
    nature: 'spirituality, detachment, past karma',
    lesson: 'letting go and spiritual liberation',
    strengthens: 'intuition, spiritual insight, and inner wisdom'
  }
}

/**
 * Detect life area from user message
 */
export function detectLifeArea(message: string): string | null {
  const patterns: Record<string, RegExp> = {
    career: /\b(job|work|career|profession|business|employment|promotion|salary|boss|office|interview)\b/i,
    relationship: /\b(love|relationship|marriage|partner|dating|boyfriend|girlfriend|spouse|husband|wife|romantic)\b/i,
    health: /\b(health|sick|illness|disease|body|pain|medical|tired|energy|sleep|wellness)\b/i,
    finance: /\b(money|finance|wealth|income|financial|salary|rich|poor|debt|savings|investment)\b/i,
    family: /\b(family|parents|children|mother|father|sibling|brother|sister|home|kid)\b/i,
    education: /\b(study|education|exam|college|school|learning|degree|course|admission)\b/i,
    spiritual: /\b(spiritual|meditation|purpose|meaning|soul|divine|karma|dharma)\b/i
  }
  
  for (const [area, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      return area
    }
  }
  
  return null
}

/**
 * Generate astrological insight based on life area and chart data
 */
export function generateInsight(
  area: string,
  birthChart?: BirthChartData,
  transits?: TransitData[]
): string | null {
  const mapping = houseMapping[area]
  if (!mapping) return null

  const insights: string[] = []
  
  // Check current dasha relevance
  if (birthChart?.currentDasha) {
    const dashaLord = birthChart.currentDasha.mahadasha
    const planetInfo = planetInsights[dashaLord]
    
    if (planetInfo) {
      insights.push(
        `You're currently in ${dashaLord} Mahadasha, which focuses on ${planetInfo.nature}. ` +
        `This period is about ${planetInfo.lesson}.`
      )
    }
  }
  
  // Check for relevant transits
  if (transits && transits.length > 0) {
    const relevantTransit = transits.find(t => 
      t.house === mapping.house || 
      t.planet.toLowerCase() === mapping.ruler.toLowerCase()
    )
    
    if (relevantTransit) {
      insights.push(
        `${relevantTransit.planet} is currently transiting your ${relevantTransit.house}th house, ` +
        `which influences your ${mapping.description}. ${relevantTransit.interpretation}`
      )
    }
  }
  
  // Check house placement if available
  if (birthChart?.houses && birthChart.houses[mapping.house]) {
    const house = birthChart.houses[mapping.house]
    if (house.planets && house.planets.length > 0) {
      const planetList = house.planets.join(' and ')
      insights.push(
        `With ${planetList} in your ${mapping.house}th house of ${mapping.description}, ` +
        `this area of life holds special significance for you.`
      )
    }
  }
  
  if (insights.length === 0) return null
  
  return '\n\n✨ *Astrological Insight:* ' + insights[0]
}

/**
 * Enhance bot response with astrological context
 */
export function enhanceWithAstrology(
  botMessage: string,
  userMessage: string,
  birthChart?: BirthChartData,
  transits?: TransitData[]
): string {
  // Check if astrology is already mentioned
  const astroKeywords = ['chart', 'dasha', 'transit', 'house', 'planet', 'saturn', 'jupiter', 'venus', 'mars', 'moon', 'sun', 'rahu', 'ketu', 'ascendant', 'nakshatra']
  const alreadyHasAstro = astroKeywords.some(keyword => 
    botMessage.toLowerCase().includes(keyword)
  )
  
  if (alreadyHasAstro) return botMessage
  
  // Detect life area from user message
  const lifeArea = detectLifeArea(userMessage)
  if (!lifeArea) return botMessage
  
  // Generate insight
  const insight = generateInsight(lifeArea, birthChart, transits)
  if (!insight) return botMessage
  
  // Inject insight at the end of the first paragraph or at the end
  const paragraphs = botMessage.split('\n\n')
  if (paragraphs.length > 1) {
    return [paragraphs[0], insight, ...paragraphs.slice(1)].join('\n\n')
  }
  
  return botMessage + insight
}

/**
 * Check if response contains astrological insights
 */
export function containsAstroInsight(message: string): boolean {
  const astroKeywords = [
    'chart', 'dasha', 'transit', 'house', 'planet',
    'saturn', 'jupiter', 'venus', 'mars', 'mercury',
    'ascendant', 'moon', 'sun', 'rahu', 'ketu',
    'nakshatra', 'yoga', 'dosha', 'mahadasha', 'antardasha'
  ]
  
  return astroKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  )
}

/**
 * Get remedies based on chart issues
 */
export function getRemedySuggestions(doshas: Array<{ name: string; present: boolean }>): string[] {
  const remedies: string[] = []
  
  doshas.filter(d => d.present).forEach(dosha => {
    switch (dosha.name.toLowerCase()) {
      case 'mangal dosha':
      case 'manglik':
        remedies.push('Chanting Hanuman Chalisa on Tuesdays')
        remedies.push('Wearing a red coral gemstone (after proper analysis)')
        break
      case 'kaal sarp dosha':
        remedies.push('Performing Kaal Sarp Puja at Trimbakeshwar')
        remedies.push('Regular Rahu-Ketu mantras')
        break
      case 'pitra dosha':
        remedies.push('Performing Shradh rituals for ancestors')
        remedies.push('Feeding crows and cows on Amavasya')
        break
      case 'sade sati':
        remedies.push('Chanting Shani mantras, especially on Saturdays')
        remedies.push('Serving the elderly and underprivileged')
        break
    }
  })
  
  return remedies
}
