import { NextRequest, NextResponse } from 'next/server'
import { generateDailyHoroscope, generateMonthlyHoroscope, getAllZodiacSigns } from '@/lib/astrology/horoscope-calculations'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sign = searchParams.get('sign')
    const type = searchParams.get('type') || 'daily'
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    // If no sign provided, return all signs info
    if (!sign) {
      return NextResponse.json({
        signs: getAllZodiacSigns()
      })
    }

    if (type === 'daily') {
      const dateParam = searchParams.get('date')
      const date = dateParam ? new Date(dateParam) : new Date()
      
      const horoscope = generateDailyHoroscope(sign, date)
      return NextResponse.json(horoscope)
    }

    if (type === 'monthly') {
      const currentDate = new Date()
      const m = month ? parseInt(month) : currentDate.getMonth() + 1
      const y = year ? parseInt(year) : currentDate.getFullYear()
      
      const horoscope = generateMonthlyHoroscope(sign, m, y)
      return NextResponse.json(horoscope)
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Horoscope API error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate horoscope' 
    }, { status: 500 })
  }
}
