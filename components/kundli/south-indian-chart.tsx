"use client"

import { motion } from "framer-motion"

interface PlanetPosition {
  planet: string
  house: number
  isRetrograde?: boolean
}

interface SouthIndianChartProps {
  planets?: PlanetPosition[]
  ascendant?: number
  className?: string
}

// South Indian chart has fixed signs - Pisces is always in top-left
const signPositions: { [key: number]: { row: number; col: number } } = {
  12: { row: 0, col: 0 }, // Pisces
  1: { row: 0, col: 1 },  // Aries
  2: { row: 0, col: 2 },  // Taurus
  3: { row: 0, col: 3 },  // Gemini
  11: { row: 1, col: 0 }, // Aquarius
  4: { row: 1, col: 3 },  // Cancer
  10: { row: 2, col: 0 }, // Capricorn
  5: { row: 2, col: 3 },  // Leo
  9: { row: 3, col: 0 },  // Sagittarius
  8: { row: 3, col: 1 },  // Scorpio
  7: { row: 3, col: 2 },  // Libra
  6: { row: 3, col: 3 },  // Virgo
}

const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

const planetColors: { [key: string]: string } = {
  'Su': '#FF6B35',
  'Mo': '#C0C0C0',
  'Ma': '#DC2626',
  'Me': '#22C55E',
  'Ju': '#EAB308',
  'Ve': '#EC4899',
  'Sa': '#3B82F6',
  'Ra': '#6B7280',
  'Ke': '#A855F7',
  'As': '#F59E0B',
}

const defaultPlanets: PlanetPosition[] = [
  { planet: 'As', house: 1 },
  { planet: 'Su', house: 1 },
  { planet: 'Mo', house: 4 },
  { planet: 'Ma', house: 7, isRetrograde: true },
  { planet: 'Me', house: 2 },
  { planet: 'Ju', house: 5 },
  { planet: 'Ve', house: 12 },
  { planet: 'Sa', house: 10, isRetrograde: true },
  { planet: 'Ra', house: 3 },
  { planet: 'Ke', house: 9 },
]

export function SouthIndianChart({
  planets = defaultPlanets,
  ascendant = 1,
  className = "",
}: SouthIndianChartProps) {
  const cellSize = 90

  // Group planets by their house/sign
  const planetsBySign: { [key: number]: PlanetPosition[] } = {}
  planets.forEach((p) => {
    // In South Indian chart, we need to calculate which sign the planet is in
    // based on the house and ascendant
    const sign = ((p.house - 1 + ascendant - 1) % 12) + 1
    if (!planetsBySign[sign]) planetsBySign[sign] = []
    planetsBySign[sign].push(p)
  })

  const renderCell = (sign: number) => {
    const planetsInSign = planetsBySign[sign] || []
    const isAscendantSign = sign === ascendant

    return (
      <motion.div
        key={sign}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: sign * 0.03 }}
        className={`
          relative border border-purple-500/30 
          ${isAscendantSign ? 'bg-purple-500/10' : 'bg-background/50'}
          flex flex-col items-center justify-center p-2
        `}
        style={{ width: cellSize, height: cellSize }}
      >
        {/* Sign symbol and name */}
        <div className="absolute top-1 left-1 text-xs text-muted-foreground">
          <span className="mr-1">{signSymbols[sign - 1]}</span>
          <span className="text-[10px]">{signNames[sign - 1].slice(0, 3)}</span>
        </div>

        {/* Ascendant marker */}
        {isAscendantSign && (
          <div className="absolute top-1 right-1">
            <span className="text-xs font-bold text-purple-400">Asc</span>
          </div>
        )}

        {/* Planets */}
        <div className="flex flex-wrap justify-center items-center gap-1 mt-3">
          {planetsInSign.map((p, idx) => (
            <motion.span
              key={`${p.planet}-${idx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                color: planetColors[p.planet] || '#fff',
                backgroundColor: `${planetColors[p.planet]}15` || 'transparent',
              }}
            >
              {p.planet}
              {p.isRetrograde && <span className="text-[8px] text-red-400 ml-0.5">ℜ</span>}
            </motion.span>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`inline-block ${className}`}>
      <div
        className="grid grid-cols-4 border border-purple-500/40 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/5 to-indigo-500/5"
        style={{ width: cellSize * 4, height: cellSize * 4 }}
      >
        {/* Row 1: Pisces, Aries, Taurus, Gemini */}
        {renderCell(12)}
        {renderCell(1)}
        {renderCell(2)}
        {renderCell(3)}

        {/* Row 2: Aquarius, empty, empty, Cancer */}
        {renderCell(11)}
        <div
          className="col-span-2 row-span-2 border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 flex items-center justify-center"
          style={{ width: cellSize * 2, height: cellSize * 2 }}
        >
          <div className="text-center p-4">
            <p className="text-lg font-bold gradient-text mb-1">South Indian</p>
            <p className="text-sm text-muted-foreground">Rashi Chart</p>
            <p className="text-xs text-muted-foreground mt-2">
              Signs are fixed
            </p>
          </div>
        </div>
        {renderCell(4)}

        {/* Row 3: Capricorn, (middle), (middle), Leo */}
        {renderCell(10)}
        {renderCell(5)}

        {/* Row 4: Sagittarius, Scorpio, Libra, Virgo */}
        {renderCell(9)}
        {renderCell(8)}
        {renderCell(7)}
        {renderCell(6)}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(planetColors).map(([planet, color]) => (
          <div
            key={planet}
            className="flex items-center gap-1 text-xs"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{planet}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
