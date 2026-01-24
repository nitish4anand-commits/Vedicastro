import { NextResponse } from 'next/server'
import { calculateKundliMatching } from '@/lib/astrology/matching-calculations'

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
      maleTimezone,
      femaleTimezone
    )
    
    return NextResponse.json(matchResult)
  } catch (error) {
    console.error('Matching calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate matching' },
      { status: 500 }
    )
  }
}
