import { NextResponse } from 'next/server'
import { calculateKundliMatching } from '@/lib/astrology/matching-calculations'
import { 
  generateKootaExplanation, 
  generateOverallSummary, 
  assessDataQuality,
  type KootaExplanation,
  type OverallSummary,
  type DataQuality
} from '@/lib/astrology/matching-explanations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      maleBirthDate,
      maleBirthTime,
      maleTimezone = 5.5,
      femaleBirthDate,
      femaleBirthTime,
      femaleTimezone = 5.5
    } = body
    
    if (!maleBirthDate || !femaleBirthDate) {
      return NextResponse.json(
        { error: 'Both male and female birth dates are required' },
        { status: 400 }
      )
    }
    
    // Parse dates with times
    const maleDate = new Date(`${maleBirthDate}T${maleBirthTime || '12:00'}:00`)
    const femaleDate = new Date(`${femaleBirthDate}T${femaleBirthTime || '12:00'}:00`)
    
    if (isNaN(maleDate.getTime()) || isNaN(femaleDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const matchResult = calculateKundliMatching(
      maleDate,
      femaleDate,
      typeof maleTimezone === 'number' ? maleTimezone : 5.5,
      typeof femaleTimezone === 'number' ? femaleTimezone : 5.5
    )
    
    // Generate explanations for each koota
    const kootasWithExplanations = matchResult.kootas.map(koota => {
      const explanation = generateKootaExplanation(
        koota.koota,
        koota.scored,
        koota.maxPoints,
        { combination: koota.combination }
      )
      return {
        ...koota,
        explanation
      }
    })
    
    // Generate overall summary
    const overallSummary = generateOverallSummary(
      matchResult.kootas.map(k => ({ name: k.koota, score: k.scored, maxScore: k.maxPoints })),
      matchResult.totalScore
    )
    
    // Assess data quality
    const dataQuality = assessDataQuality(
      { timeOfBirth: maleBirthTime, timezone: String(maleTimezone) },
      { timeOfBirth: femaleBirthTime, timezone: String(femaleTimezone) }
    )
    
    return NextResponse.json({
      ...matchResult,
      kootas: kootasWithExplanations,
      overallSummary,
      dataQuality
    })
  } catch (error) {
    console.error('Matching calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate matching' },
      { status: 500 }
    )
  }
}
