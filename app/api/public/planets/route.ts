import { NextResponse } from 'next/server';

export async function GET() {
  const planets = [
    {
      name: 'Sun',
      sanskrit: 'Surya',
      represents: 'Soul, ego, father, authority, vitality',
      exaltation: 'Aries',
      debilitation: 'Libra',
      element: 'Fire',
      nature: 'Malefic',
      day: 'Sunday',
      color: 'Red, Orange',
      gemstone: 'Ruby',
      mantra: 'Om Suryaya Namaha'
    },
    {
      name: 'Moon',
      sanskrit: 'Chandra',
      represents: 'Mind, emotions, mother, intuition',
      exaltation: 'Taurus',
      debilitation: 'Scorpio',
      element: 'Water',
      nature: 'Benefic',
      day: 'Monday',
      color: 'White, Silver',
      gemstone: 'Pearl',
      mantra: 'Om Chandraya Namaha'
    },
    {
      name: 'Mars',
      sanskrit: 'Mangal',
      represents: 'Energy, courage, aggression, siblings',
      exaltation: 'Capricorn',
      debilitation: 'Cancer',
      element: 'Fire',
      nature: 'Malefic',
      day: 'Tuesday',
      color: 'Red',
      gemstone: 'Red Coral',
      mantra: 'Om Mangalaya Namaha'
    },
    {
      name: 'Mercury',
      sanskrit: 'Budha',
      represents: 'Intellect, communication, business',
      exaltation: 'Virgo',
      debilitation: 'Pisces',
      element: 'Earth',
      nature: 'Neutral',
      day: 'Wednesday',
      color: 'Green',
      gemstone: 'Emerald',
      mantra: 'Om Budhaya Namaha'
    },
    {
      name: 'Jupiter',
      sanskrit: 'Guru',
      represents: 'Wisdom, expansion, teacher, children',
      exaltation: 'Cancer',
      debilitation: 'Capricorn',
      element: 'Ether',
      nature: 'Benefic',
      day: 'Thursday',
      color: 'Yellow',
      gemstone: 'Yellow Sapphire',
      mantra: 'Om Gurave Namaha'
    },
    {
      name: 'Venus',
      sanskrit: 'Shukra',
      represents: 'Love, beauty, luxury, marriage',
      exaltation: 'Pisces',
      debilitation: 'Virgo',
      element: 'Water',
      nature: 'Benefic',
      day: 'Friday',
      color: 'White, Pink',
      gemstone: 'Diamond',
      mantra: 'Om Shukraya Namaha'
    },
    {
      name: 'Saturn',
      sanskrit: 'Shani',
      represents: 'Discipline, karma, delays, lessons',
      exaltation: 'Libra',
      debilitation: 'Aries',
      element: 'Air',
      nature: 'Malefic',
      day: 'Saturday',
      color: 'Black, Blue',
      gemstone: 'Blue Sapphire',
      mantra: 'Om Shanaye Namaha'
    },
    {
      name: 'Rahu',
      sanskrit: 'Rahu',
      represents: 'Obsession, worldly desires, innovation',
      exaltation: 'Gemini/Virgo',
      debilitation: 'Sagittarius/Pisces',
      element: 'Air',
      nature: 'Shadow Planet',
      day: 'Saturday',
      color: 'Smoke',
      gemstone: 'Hessonite',
      mantra: 'Om Rahave Namaha'
    },
    {
      name: 'Ketu',
      sanskrit: 'Ketu',
      represents: 'Spirituality, detachment, past life',
      exaltation: 'Sagittarius/Pisces',
      debilitation: 'Gemini/Virgo',
      element: 'Fire',
      nature: 'Shadow Planet',
      day: 'Tuesday',
      color: 'Brown',
      gemstone: "Cat's Eye",
      mantra: 'Om Ketave Namaha'
    }
  ];

  return NextResponse.json({
    data: planets,
    meta: {
      source: 'VedicAstro by Nitish Anand',
      website: 'https://vedicastro.com',
      attribution: 'Please credit VedicAstro when using this data'
    }
  });
}
