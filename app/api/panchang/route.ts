import { NextResponse } from 'next/server'
import { calculateCompletePanchang } from '@/lib/astrology/panchang-calculations'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')
    const lat = parseFloat(searchParams.get('lat') || '28.6139') // Default: New Delhi
    const lng = parseFloat(searchParams.get('lng') || '77.2090')
    const timezone = parseFloat(searchParams.get('timezone') || '5.5')
    
    const date = dateStr ? new Date(dateStr) : new Date()
    
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }
    
    const panchang = calculateCompletePanchang(date, lat, lng, timezone)
    
    return NextResponse.json(panchang)
  } catch (error) {
    console.error('Panchang calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate Panchang' },
      { status: 500 }
    )
  }
}
