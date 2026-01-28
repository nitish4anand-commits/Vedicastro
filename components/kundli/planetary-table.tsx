"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Planet {
  name: string
  sign: string
  degree: number
  nakshatra: string
  pada: number
  house: number
  lord: string
  dignity: string
  isRetrograde: boolean
  isCombust: boolean
}

interface PlanetaryTableProps {
  planets?: Planet[]
}

const defaultPlanets: Planet[] = [
  { name: "Sun", sign: "Capricorn", degree: 15.23, nakshatra: "Shravana", pada: 3, house: 10, lord: "Saturn", dignity: "Neutral", isRetrograde: false, isCombust: false },
  { name: "Moon", sign: "Taurus", degree: 8.45, nakshatra: "Rohini", pada: 2, house: 2, lord: "Venus", dignity: "Exalted", isRetrograde: false, isCombust: false },
  { name: "Mars", sign: "Scorpio", degree: 22.11, nakshatra: "Jyeshtha", pada: 1, house: 8, lord: "Mars", dignity: "Own", isRetrograde: false, isCombust: false },
  { name: "Mercury", sign: "Sagittarius", degree: 19.56, nakshatra: "P.Ashadha", pada: 4, house: 9, lord: "Jupiter", dignity: "Enemy", isRetrograde: false, isCombust: true },
  { name: "Jupiter", sign: "Pisces", degree: 12.34, nakshatra: "U.Bhadra", pada: 1, house: 12, lord: "Jupiter", dignity: "Own", isRetrograde: false, isCombust: false },
  { name: "Venus", sign: "Aquarius", degree: 25.67, nakshatra: "P.Bhadra", pada: 3, house: 11, lord: "Saturn", dignity: "Neutral", isRetrograde: false, isCombust: false },
  { name: "Saturn", sign: "Capricorn", degree: 28.90, nakshatra: "Dhanishta", pada: 4, house: 10, lord: "Saturn", dignity: "Own", isRetrograde: true, isCombust: false },
  { name: "Rahu", sign: "Gemini", degree: 14.23, nakshatra: "Ardra", pada: 2, house: 3, lord: "Rahu", dignity: "-", isRetrograde: true, isCombust: false },
  { name: "Ketu", sign: "Sagittarius", degree: 14.23, nakshatra: "P.Ashadha", pada: 2, house: 9, lord: "Ketu", dignity: "-", isRetrograde: true, isCombust: false },
]

const getDignityColor = (dignity: string) => {
  switch (dignity.toLowerCase()) {
    case "exalted":
      return "bg-yellow-500/20 text-yellow-500"
    case "own":
      return "bg-green-500/20 text-green-500"
    case "debilitated":
      return "bg-red-500/20 text-red-500"
    case "friend":
      return "bg-blue-500/20 text-blue-500"
    case "enemy":
      return "bg-orange-500/20 text-orange-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function PlanetaryPositionsTable({ planets }: PlanetaryTableProps) {
  // Transform API data to match the expected Planet interface
  const transformedPlanets = planets ? planets.map((p: any) => {
    // Parse degree string like "15°30'" to decimal
    let degreeNum = 0
    if (typeof p.degree === 'string') {
      const match = p.degree.match(/(\d+)°(\d+)'/)
      if (match) {
        degreeNum = parseInt(match[1]) + parseInt(match[2]) / 60
      }
    } else if (typeof p.degree === 'number') {
      degreeNum = p.degree
    }

    return {
      name: p.name,
      sign: p.sign || p.signName || 'Unknown',
      degree: degreeNum,
      nakshatra: p.nakshatra || 'Unknown',
      pada: p.pada || 1,
      house: p.house || 0,
      lord: p.signLord || p.lord || 'Unknown',
      dignity: p.dignity || 'Neutral',
      isRetrograde: p.isRetrograde || false,
      isCombust: p.isCombust || false
    }
  }) : defaultPlanets

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Planetary Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Planet</th>
                <th className="text-left py-3 px-2">Sign</th>
                <th className="text-center py-3 px-2">Degree</th>
                <th className="text-left py-3 px-2">Nakshatra</th>
                <th className="text-center py-3 px-2">Pada</th>
                <th className="text-center py-3 px-2">House</th>
                <th className="text-center py-3 px-2">Dignity</th>
                <th className="text-center py-3 px-2">R</th>
                <th className="text-center py-3 px-2">C</th>
              </tr>
            </thead>
            <tbody>
              {transformedPlanets.map((planet) => (
                <tr key={planet.name} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{planet.name}</td>
                  <td className="py-3 px-2">{planet.sign}</td>
                  <td className="text-center py-3 px-2">{planet.degree.toFixed(2)}°</td>
                  <td className="py-3 px-2">{planet.nakshatra}</td>
                  <td className="text-center py-3 px-2">{planet.pada}</td>
                  <td className="text-center py-3 px-2">{planet.house}</td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDignityColor(planet.dignity)}`}>
                      {planet.dignity}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2">
                    {planet.isRetrograde && <span className="text-red-500">℞</span>}
                  </td>
                  <td className="text-center py-3 px-2">
                    {planet.isCombust && <span className="text-orange-500">🔥</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>R = Retrograde</span>
          <span>C = Combust</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500/20" /> Exalted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500/20" /> Own Sign
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500/20" /> Debilitated
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
