import { NextResponse } from 'next/server';

export async function GET() {
  const nakshatras = [
    { number: 1, name: 'Ashwini', deity: 'Ashwini Kumaras', symbol: 'Horse Head', rulingPlanet: 'Ketu', traits: 'Quick, healing, pioneering' },
    { number: 2, name: 'Bharani', deity: 'Yama', symbol: 'Yoni', rulingPlanet: 'Venus', traits: 'Transformation, creativity, nurturing' },
    { number: 3, name: 'Krittika', deity: 'Agni', symbol: 'Razor/Flame', rulingPlanet: 'Sun', traits: 'Cutting, purifying, determined' },
    { number: 4, name: 'Rohini', deity: 'Brahma', symbol: 'Cart/Chariot', rulingPlanet: 'Moon', traits: 'Growth, beauty, materialistic' },
    { number: 5, name: 'Mrigashira', deity: 'Soma', symbol: 'Deer Head', rulingPlanet: 'Mars', traits: 'Searching, gentle, curious' },
    { number: 6, name: 'Ardra', deity: 'Rudra', symbol: 'Teardrop', rulingPlanet: 'Rahu', traits: 'Stormy, transformative, intellectual' },
    { number: 7, name: 'Punarvasu', deity: 'Aditi', symbol: 'Bow & Quiver', rulingPlanet: 'Jupiter', traits: 'Renewal, nurturing, optimistic' },
    { number: 8, name: 'Pushya', deity: 'Brihaspati', symbol: 'Udder of Cow', rulingPlanet: 'Saturn', traits: 'Nourishing, spiritual, disciplined' },
    { number: 9, name: 'Ashlesha', deity: 'Nagas', symbol: 'Coiled Serpent', rulingPlanet: 'Mercury', traits: 'Mystical, manipulative, penetrating' },
    { number: 10, name: 'Magha', deity: 'Pitris', symbol: 'Royal Throne', rulingPlanet: 'Ketu', traits: 'Authority, ancestral, traditional' },
    { number: 11, name: 'Purva Phalguni', deity: 'Bhaga', symbol: 'Front Legs of Bed', rulingPlanet: 'Venus', traits: 'Pleasure, luxury, creative' },
    { number: 12, name: 'Uttara Phalguni', deity: 'Aryaman', symbol: 'Back Legs of Bed', rulingPlanet: 'Sun', traits: 'Friendship, contracts, generous' },
    { number: 13, name: 'Hasta', deity: 'Savitar', symbol: 'Hand', rulingPlanet: 'Moon', traits: 'Skillful, crafty, humorous' },
    { number: 14, name: 'Chitra', deity: 'Tvashtar', symbol: 'Pearl/Jewel', rulingPlanet: 'Mars', traits: 'Artistic, charismatic, builder' },
    { number: 15, name: 'Swati', deity: 'Vayu', symbol: 'Coral/Sword', rulingPlanet: 'Rahu', traits: 'Independent, flexible, trade' },
    { number: 16, name: 'Vishakha', deity: 'Indra-Agni', symbol: 'Triumphal Arch', rulingPlanet: 'Jupiter', traits: 'Goal-oriented, determined, dual' },
    { number: 17, name: 'Anuradha', deity: 'Mitra', symbol: 'Lotus', rulingPlanet: 'Saturn', traits: 'Friendship, devotion, balance' },
    { number: 18, name: 'Jyeshtha', deity: 'Indra', symbol: 'Earring/Umbrella', rulingPlanet: 'Mercury', traits: 'Powerful, protective, responsible' },
    { number: 19, name: 'Mula', deity: 'Nirriti', symbol: 'Bundle of Roots', rulingPlanet: 'Ketu', traits: 'Destructive, investigative, philosophical' },
    { number: 20, name: 'Purva Ashadha', deity: 'Apas', symbol: 'Elephant Tusk', rulingPlanet: 'Venus', traits: 'Invincible, purifying, ambitious' },
    { number: 21, name: 'Uttara Ashadha', deity: 'Vishvadevas', symbol: 'Elephant Tusk', rulingPlanet: 'Sun', traits: 'Victory, leadership, ethical' },
    { number: 22, name: 'Shravana', deity: 'Vishnu', symbol: 'Three Footprints', rulingPlanet: 'Moon', traits: 'Listening, learning, connecting' },
    { number: 23, name: 'Dhanishta', deity: 'Vasus', symbol: 'Drum', rulingPlanet: 'Mars', traits: 'Wealthy, musical, adaptable' },
    { number: 24, name: 'Shatabhisha', deity: 'Varuna', symbol: 'Empty Circle', rulingPlanet: 'Rahu', traits: 'Healing, secretive, mystical' },
    { number: 25, name: 'Purva Bhadrapada', deity: 'Aja Ekapada', symbol: 'Front Legs of Bed', rulingPlanet: 'Jupiter', traits: 'Transformative, intense, philosophical' },
    { number: 26, name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', symbol: 'Back Legs of Bed', rulingPlanet: 'Saturn', traits: 'Depth, wisdom, patient' },
    { number: 27, name: 'Revati', deity: 'Pushan', symbol: 'Fish/Drum', rulingPlanet: 'Mercury', traits: 'Nurturing, protective, journey' }
  ];

  return NextResponse.json({
    data: nakshatras,
    meta: {
      source: 'Zodii by Nitish Anand',
      website: 'https://zodii.in',
      attribution: 'Please credit Zodii when using this data',
      note: '27 lunar mansions in Vedic astrology'
    }
  });
}
