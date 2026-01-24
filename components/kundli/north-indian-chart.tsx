"use client"

import { cn } from "@/lib/utils"

interface Planet {
  name: string
  symbol: string
  house: number
  retrograde?: boolean
}

interface NorthChartProps {
  planets?: Planet[]
  className?: string
}

const zodiacSigns = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"]

const planetSymbols: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mars: "♂",
  Mercury: "☿",
  Jupiter: "♃",
  Venus: "♀",
  Saturn: "♄",
  Rahu: "☊",
  Ketu: "☋",
}

// House positions for North Indian chart (diamond layout)
const housePositions = [
  { id: 1, points: "200,0 300,100 200,200 100,100", labelX: 200, labelY: 100 }, // Top (Lagna)
  { id: 2, points: "300,100 400,0 400,200 300,200", labelX: 350, labelY: 100 },
  { id: 3, points: "300,200 400,200 400,400 300,300", labelX: 350, labelY: 275 },
  { id: 4, points: "200,200 300,300 200,400 100,300", labelX: 200, labelY: 300 }, // Bottom
  { id: 5, points: "100,300 200,400 0,400 0,200", labelX: 50, labelY: 300 },
  { id: 6, points: "0,0 0,200 100,100", labelX: 35, labelY: 100 },
  { id: 7, points: "0,0 100,100 200,0", labelX: 100, labelY: 35 }, // Opposite of Lagna
  { id: 8, points: "200,0 300,100 400,0", labelX: 300, labelY: 35 },
  { id: 9, points: "400,0 300,100 400,200", labelX: 365, labelY: 100 },
  { id: 10, points: "400,200 300,200 300,300 400,400", labelX: 350, labelY: 300 },
  { id: 11, points: "300,300 200,400 400,400", labelX: 300, labelY: 365 },
  { id: 12, points: "200,400 100,300 0,400", labelX: 100, labelY: 365 },
]

const defaultPlanets: Planet[] = [
  { name: "Sun", symbol: "☉", house: 10 },
  { name: "Moon", symbol: "☽", house: 2 },
  { name: "Mars", symbol: "♂", house: 8 },
  { name: "Mercury", symbol: "☿", house: 9 },
  { name: "Jupiter", symbol: "♃", house: 12 },
  { name: "Venus", symbol: "♀", house: 11 },
  { name: "Saturn", symbol: "♄", house: 10, retrograde: true },
  { name: "Rahu", symbol: "☊", house: 3 },
  { name: "Ketu", symbol: "☋", house: 9 },
]

export function NorthIndianChart({ planets = defaultPlanets, className }: NorthChartProps) {
  const getPlanetsInHouse = (house: number) => {
    return planets.filter((p) => p.house === house)
  }

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Background */}
        <rect x="0" y="0" width="400" height="400" className="fill-card" />

        {/* Outer square */}
        <rect
          x="0"
          y="0"
          width="400"
          height="400"
          className="fill-none stroke-border"
          strokeWidth="2"
        />

        {/* Inner diamond */}
        <polygon
          points="200,0 400,200 200,400 0,200"
          className="fill-none stroke-border"
          strokeWidth="2"
        />

        {/* House dividers */}
        <line x1="100" y1="100" x2="300" y2="100" className="stroke-border" strokeWidth="1" />
        <line x1="100" y1="300" x2="300" y2="300" className="stroke-border" strokeWidth="1" />
        <line x1="100" y1="100" x2="100" y2="300" className="stroke-border" strokeWidth="1" />
        <line x1="300" y1="100" x2="300" y2="300" className="stroke-border" strokeWidth="1" />

        {/* Diagonal lines for corners */}
        <line x1="0" y1="0" x2="100" y2="100" className="stroke-border" strokeWidth="1" />
        <line x1="400" y1="0" x2="300" y2="100" className="stroke-border" strokeWidth="1" />
        <line x1="0" y1="400" x2="100" y2="300" className="stroke-border" strokeWidth="1" />
        <line x1="400" y1="400" x2="300" y2="300" className="stroke-border" strokeWidth="1" />

        {/* House Numbers and Planets */}
        {housePositions.map((house) => {
          const housePlanets = getPlanetsInHouse(house.id)
          return (
            <g key={house.id}>
              {/* House number (small) */}
              <text
                x={house.labelX}
                y={house.labelY - 25}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
                fontSize="10"
              >
                {house.id}
              </text>
              {/* Planets in house */}
              {housePlanets.map((planet, idx) => (
                <text
                  key={planet.name}
                  x={house.labelX + (idx % 2 ? 15 : -15)}
                  y={house.labelY + Math.floor(idx / 2) * 15}
                  textAnchor="middle"
                  className="fill-primary font-semibold"
                  fontSize="14"
                >
                  {planet.symbol}
                  {planet.retrograde && (
                    <tspan fontSize="8" className="fill-red-500">R</tspan>
                  )}
                </text>
              ))}
            </g>
          )
        })}

        {/* Lagna marker */}
        <text x="200" y="85" textAnchor="middle" className="fill-purple-500 font-bold" fontSize="12">
          ASC
        </text>
      </svg>
    </div>
  )
}
