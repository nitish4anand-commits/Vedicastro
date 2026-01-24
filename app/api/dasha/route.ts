import { NextResponse } from 'next/server'
import { getJulianDay, calculatePreciseAyanamsa } from '@/lib/astrology/precise-calculations'
import { DASHA_YEARS, DASHA_SEQUENCE, NAKSHATRAS } from '@/lib/astrology/calculations'

type DashaPlanet = keyof typeof DASHA_YEARS

// Calculate Moon's nakshatra from birth details
function calculateMoonNakshatra(birthDate: Date, timezone: number): { index: number; degree: number } {
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
  
  const nakshatraLength = 360 / 27
  const nakshatraIndex = Math.floor(moonLon / nakshatraLength)
  const degreeWithinNakshatra = moonLon % nakshatraLength
  
  return { index: nakshatraIndex, degree: degreeWithinNakshatra }
}

// Calculate Dasha periods based on birth nakshatra
function calculateDashaTimeline(birthDate: Date, timezone: number) {
  const { index: nakshatraIndex, degree: degreeWithin } = calculateMoonNakshatra(birthDate, timezone)
  
  // Each nakshatra has a ruling planet for Dasha
  const nakshatraLords = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ]
  
  const nakshatraLength = 360 / 27
  const startingLord = nakshatraLords[nakshatraIndex] as DashaPlanet
  
  // Calculate balance of first Dasha
  const completedPortion = degreeWithin / nakshatraLength
  const firstDashaYears = DASHA_YEARS[startingLord] * (1 - completedPortion)
  
  // Build Dasha sequence starting from birth nakshatra lord
  const startIndex = DASHA_SEQUENCE.indexOf(startingLord)
  const orderedSequence = [
    ...DASHA_SEQUENCE.slice(startIndex),
    ...DASHA_SEQUENCE.slice(0, startIndex)
  ]
  
  const mahadashas = []
  let currentDate = new Date(birthDate)
  
  for (let i = 0; i < orderedSequence.length; i++) {
    const planet = orderedSequence[i] as DashaPlanet
    const years = i === 0 ? firstDashaYears : DASHA_YEARS[planet]
    
    const startDate = new Date(currentDate)
    const endDate = new Date(currentDate)
    endDate.setFullYear(endDate.getFullYear() + Math.floor(years))
    endDate.setMonth(endDate.getMonth() + Math.floor((years % 1) * 12))
    
    const now = new Date()
    const isActive = now >= startDate && now <= endDate
    const isPast = now > endDate
    
    mahadashas.push({
      planet,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      duration: `${Math.round(years * 10) / 10} Years`,
      years: Math.round(years * 10) / 10,
      isActive,
      isPast,
      color: getPlanetColor(planet),
      effects: getDashaEffects(planet)
    })
    
    currentDate = endDate
    
    // Only calculate for reasonable lifespan (120 years total in Vimshottari)
    if (mahadashas.reduce((sum, d) => sum + d.years, 0) >= 120) break
  }
  
  // Calculate current Antardasha
  const currentMahadasha = mahadashas.find(d => d.isActive)
  let antardashas: any[] = []
  
  if (currentMahadasha) {
    const mahaStart = new Date(currentMahadasha.startDate)
    const mahaDuration = DASHA_YEARS[currentMahadasha.planet as DashaPlanet]
    const mahaStartIndex = DASHA_SEQUENCE.indexOf(currentMahadasha.planet)
    const antarSequence = [
      ...DASHA_SEQUENCE.slice(mahaStartIndex),
      ...DASHA_SEQUENCE.slice(0, mahaStartIndex)
    ]
    
    let antarDate = new Date(mahaStart)
    
    for (const antarPlanet of antarSequence) {
      const antarYears = (mahaDuration * DASHA_YEARS[antarPlanet as DashaPlanet]) / 120
      const antarStart = new Date(antarDate)
      const antarEnd = new Date(antarDate)
      antarEnd.setFullYear(antarEnd.getFullYear() + Math.floor(antarYears))
      antarEnd.setMonth(antarEnd.getMonth() + Math.floor((antarYears % 1) * 12))
      
      const now = new Date()
      const isActive = now >= antarStart && now <= antarEnd
      
      antardashas.push({
        planet: antarPlanet,
        startDate: antarStart.toISOString().split('T')[0],
        endDate: antarEnd.toISOString().split('T')[0],
        duration: `${Math.round(antarYears * 12)} months`,
        isActive,
        description: `${currentMahadasha.planet}-${antarPlanet} period`
      })
      
      antarDate = antarEnd
    }
  }
  
  return {
    birthNakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraLord: nakshatraLords[nakshatraIndex],
    mahadashas,
    currentMahadasha: currentMahadasha?.planet || null,
    antardashas
  }
}

function getPlanetColor(planet: string): string {
  const colors: { [key: string]: string } = {
    Sun: '#FF6B35',
    Moon: '#C0C0C0',
    Mars: '#DC2626',
    Mercury: '#22C55E',
    Jupiter: '#EAB308',
    Venus: '#EC4899',
    Saturn: '#6B7280',
    Rahu: '#8B5CF6',
    Ketu: '#A855F7'
  }
  return colors[planet] || '#6B7280'
}

function getDashaEffects(planet: string): { positive: string[]; negative: string[] } {
  const effects: { [key: string]: { positive: string[]; negative: string[] } } = {
    Sun: {
      positive: ['Leadership opportunities', 'Government favor', 'Recognition and fame', 'Father\'s blessings'],
      negative: ['Ego clashes', 'Eye/bone health issues', 'Authority conflicts']
    },
    Moon: {
      positive: ['Emotional stability', 'Public popularity', 'Mother\'s support', 'Property gains'],
      negative: ['Mood fluctuations', 'Mental stress', 'Water-related issues']
    },
    Mars: {
      positive: ['Energy and courage', 'Property acquisition', 'Technical skills', 'Victory over enemies'],
      negative: ['Accidents potential', 'Anger issues', 'Conflicts and disputes']
    },
    Mercury: {
      positive: ['Business success', 'Communication skills', 'Learning opportunities', 'Trade gains'],
      negative: ['Nervous tension', 'Skin issues', 'Speech problems']
    },
    Jupiter: {
      positive: ['Wisdom and knowledge', 'Spiritual growth', 'Children\'s blessings', 'Wealth accumulation'],
      negative: ['Weight gain', 'Liver issues', 'Overconfidence']
    },
    Venus: {
      positive: ['Love and relationships', 'Artistic talents', 'Material comforts', 'Luxury gains'],
      negative: ['Overindulgence', 'Relationship issues', 'Kidney concerns']
    },
    Saturn: {
      positive: ['Discipline and focus', 'Long-term success', 'Justice served', 'Wisdom through experience'],
      negative: ['Delays and obstacles', 'Health challenges', 'Loneliness periods']
    },
    Rahu: {
      positive: ['Foreign opportunities', 'Unconventional success', 'Technology gains', 'Sudden wealth'],
      negative: ['Confusion and deception', 'Anxiety', 'Addiction potential']
    },
    Ketu: {
      positive: ['Spiritual awakening', 'Intuitive abilities', 'Research success', 'Liberation tendencies'],
      negative: ['Sudden changes', 'Detachment issues', 'Health mysteries']
    }
  }
  return effects[planet] || { positive: [], negative: [] }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { birthDate, birthTime, timezone = 5.5 } = body
    
    if (!birthDate) {
      return NextResponse.json(
        { error: 'Birth date is required' },
        { status: 400 }
      )
    }
    
    const date = new Date(`${birthDate}T${birthTime || '12:00'}:00`)
    
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const dashaData = calculateDashaTimeline(date, timezone)
    
    return NextResponse.json(dashaData)
  } catch (error) {
    console.error('Dasha calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate Dasha periods' },
      { status: 500 }
    )
  }
}
