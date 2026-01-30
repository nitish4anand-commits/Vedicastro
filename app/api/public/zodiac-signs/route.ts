import { NextResponse } from 'next/server';

export async function GET() {
  const zodiacSigns = [
    {
      name: 'Aries',
      sanskrit: 'Mesha',
      element: 'Fire',
      rulingPlanet: 'Mars',
      traits: 'Initiative, courage, leadership, impulsive',
      dates: 'March 21 - April 19',
      symbol: '♈'
    },
    {
      name: 'Taurus',
      sanskrit: 'Vrishabha',
      element: 'Earth',
      rulingPlanet: 'Venus',
      traits: 'Stability, sensuality, patience, stubborn',
      dates: 'April 20 - May 20',
      symbol: '♉'
    },
    {
      name: 'Gemini',
      sanskrit: 'Mithuna',
      element: 'Air',
      rulingPlanet: 'Mercury',
      traits: 'Communication, curiosity, adaptable, restless',
      dates: 'May 21 - June 20',
      symbol: '♊'
    },
    {
      name: 'Cancer',
      sanskrit: 'Karka',
      element: 'Water',
      rulingPlanet: 'Moon',
      traits: 'Nurturing, emotions, intuitive, protective',
      dates: 'June 21 - July 22',
      symbol: '♋'
    },
    {
      name: 'Leo',
      sanskrit: 'Simha',
      element: 'Fire',
      rulingPlanet: 'Sun',
      traits: 'Leadership, creativity, confident, dramatic',
      dates: 'July 23 - August 22',
      symbol: '♌'
    },
    {
      name: 'Virgo',
      sanskrit: 'Kanya',
      element: 'Earth',
      rulingPlanet: 'Mercury',
      traits: 'Analysis, service, perfectionist, practical',
      dates: 'August 23 - September 22',
      symbol: '♍'
    },
    {
      name: 'Libra',
      sanskrit: 'Tula',
      element: 'Air',
      rulingPlanet: 'Venus',
      traits: 'Balance, relationships, diplomatic, indecisive',
      dates: 'September 23 - October 22',
      symbol: '♎'
    },
    {
      name: 'Scorpio',
      sanskrit: 'Vrishchika',
      element: 'Water',
      rulingPlanet: 'Mars',
      traits: 'Transformation, intensity, passionate, secretive',
      dates: 'October 23 - November 21',
      symbol: '♏'
    },
    {
      name: 'Sagittarius',
      sanskrit: 'Dhanu',
      element: 'Fire',
      rulingPlanet: 'Jupiter',
      traits: 'Wisdom, adventure, optimistic, philosophical',
      dates: 'November 22 - December 21',
      symbol: '♐'
    },
    {
      name: 'Capricorn',
      sanskrit: 'Makara',
      element: 'Earth',
      rulingPlanet: 'Saturn',
      traits: 'Ambition, discipline, responsible, traditional',
      dates: 'December 22 - January 19',
      symbol: '♑'
    },
    {
      name: 'Aquarius',
      sanskrit: 'Kumbha',
      element: 'Air',
      rulingPlanet: 'Saturn',
      traits: 'Innovation, humanitarian, independent, eccentric',
      dates: 'January 20 - February 18',
      symbol: '♒'
    },
    {
      name: 'Pisces',
      sanskrit: 'Meena',
      element: 'Water',
      rulingPlanet: 'Jupiter',
      traits: 'Spirituality, compassion, imaginative, escapist',
      dates: 'February 19 - March 20',
      symbol: '♓'
    }
  ];

  return NextResponse.json({
    data: zodiacSigns,
    meta: {
      source: 'VedicAstro by Nitish Anand',
      website: 'https://vedicastro.com',
      attribution: 'Please credit VedicAstro when using this data'
    }
  });
}
