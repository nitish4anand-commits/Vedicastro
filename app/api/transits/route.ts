import { NextResponse } from 'next/server'
import { getCurrentTransits, getUpcomingTransits } from '@/lib/astrology/transit-calculations'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const timezone = parseFloat(searchParams.get('timezone') || '5.5')
    
    const date = dateStr ? new Date(dateStr) : new Date()
    
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const currentTransits = getCurrentTransits(date, timezone)
    const upcomingTransits = getUpcomingTransits(date, timezone)
    
    return NextResponse.json({
      current: currentTransits,
      upcoming: upcomingTransits,
      calculatedAt: date.toISOString()
    })
  } catch (error) {
    console.error('Transit calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate transits' },
      { status: 500 }
    )
  }
}
