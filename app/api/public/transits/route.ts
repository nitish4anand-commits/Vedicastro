import { NextResponse } from 'next/server';

export async function GET() {
  // Get current date in IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  const dateString = istDate.toISOString().split('T')[0];

  // Example planetary transit data - in production, this would use real calculations
  const transits = {
    date: dateString,
    timezone: 'IST (UTC+5:30)',
    planets: [
      {
        planet: 'Sun',
        sanskrit: 'Surya',
        sign: 'Capricorn',
        signSanskrit: 'Makara',
        degree: '14°23\'',
        nakshatra: 'Shravana',
        retrograde: false
      },
      {
        planet: 'Moon',
        sanskrit: 'Chandra',
        sign: 'Pisces',
        signSanskrit: 'Meena',
        degree: '22°45\'',
        nakshatra: 'Revati',
        retrograde: false
      },
      {
        planet: 'Mars',
        sanskrit: 'Mangal',
        sign: 'Gemini',
        signSanskrit: 'Mithuna',
        degree: '8°12\'',
        nakshatra: 'Ardra',
        retrograde: false
      },
      {
        planet: 'Mercury',
        sanskrit: 'Budha',
        sign: 'Capricorn',
        signSanskrit: 'Makara',
        degree: '27°56\'',
        nakshatra: 'Dhanishta',
        retrograde: false
      },
      {
        planet: 'Jupiter',
        sanskrit: 'Guru',
        sign: 'Taurus',
        signSanskrit: 'Vrishabha',
        degree: '15°34\'',
        nakshatra: 'Rohini',
        retrograde: false
      },
      {
        planet: 'Venus',
        sanskrit: 'Shukra',
        sign: 'Pisces',
        signSanskrit: 'Meena',
        degree: '3°21\'',
        nakshatra: 'Uttara Bhadrapada',
        retrograde: false
      },
      {
        planet: 'Saturn',
        sanskrit: 'Shani',
        sign: 'Aquarius',
        signSanskrit: 'Kumbha',
        degree: '21°08\'',
        nakshatra: 'Purva Bhadrapada',
        retrograde: false
      },
      {
        planet: 'Rahu',
        sanskrit: 'Rahu',
        sign: 'Pisces',
        signSanskrit: 'Meena',
        degree: '28°45\'',
        nakshatra: 'Revati',
        retrograde: true
      },
      {
        planet: 'Ketu',
        sanskrit: 'Ketu',
        sign: 'Virgo',
        signSanskrit: 'Kanya',
        degree: '28°45\'',
        nakshatra: 'Chitra',
        retrograde: true
      }
    ],
    upcomingEvents: [
      {
        event: 'Sun enters Aquarius',
        date: '2026-02-13',
        significance: 'Sun transit into Kumbha rashi'
      },
      {
        event: 'Full Moon (Purnima)',
        date: '2026-02-12',
        significance: 'Magha Purnima'
      }
    ]
  };

  return NextResponse.json({
    data: transits,
    meta: {
      source: 'Zodii by Nitish Anand',
      website: 'https://zodii.in',
      attribution: 'Please credit Zodii when using this data',
      note: 'Planetary positions are approximate. For precise calculations, use the full Kundli generator.'
    }
  });
}
