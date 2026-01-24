"use client"

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Dosha {
  name: string
  present: boolean
  severity: "none" | "low" | "medium" | "high"
  type?: string
  description: string
  remedies: string[]
}

interface DoshaAnalysisProps {
  doshas?: Dosha[]
}

const defaultDoshas: Dosha[] = [
  {
    name: "Manglik Dosha",
    present: false,
    severity: "none",
    description: "Mars is not placed in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna. No Manglik Dosha is present.",
    remedies: [],
  },
  {
    name: "Kaal Sarp Dosha",
    present: true,
    severity: "medium",
    type: "Anant Kaal Sarp",
    description: "All planets are hemmed between Rahu and Ketu, creating the serpent yoga. This affects various life areas but has remedies.",
    remedies: [
      "Perform Kaal Sarp Dosha Nivaran Puja at Trimbakeshwar",
      "Chant 'Om Namah Shivaya' 108 times daily",
      "Wear a Gomed (Hessonite) gemstone after consultation",
      "Observe fast on Nag Panchami",
    ],
  },
  {
    name: "Pitra Dosha",
    present: false,
    severity: "none",
    description: "No affliction to Sun or the 9th house indicates absence of ancestral curses or unresolved karmic debts.",
    remedies: [],
  },
  {
    name: "Sadesati",
    present: true,
    severity: "low",
    type: "Rising Phase",
    description: "Saturn is transiting the 12th house from your Moon sign. This is the first phase of Sadesati, which brings gradual changes.",
    remedies: [
      "Donate black sesame, mustard oil on Saturdays",
      "Recite Hanuman Chalisa daily",
      "Wear a Blue Sapphire after proper analysis",
      "Light mustard oil lamp under Peepal tree on Saturdays",
    ],
  },
  {
    name: "Grahan Dosha",
    present: false,
    severity: "none",
    description: "No affliction of Rahu or Ketu to Sun or Moon indicates no eclipse-related dosha.",
    remedies: [],
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "border-red-500/50 bg-red-500/10"
    case "medium":
      return "border-yellow-500/50 bg-yellow-500/10"
    case "low":
      return "border-blue-500/50 bg-blue-500/10"
    default:
      return "border-green-500/50 bg-green-500/10"
  }
}

const getSeverityIcon = (present: boolean, severity: string) => {
  if (!present) {
    return <CheckCircle2 className="h-6 w-6 text-green-500" />
  }
  switch (severity) {
    case "high":
      return <XCircle className="h-6 w-6 text-red-500" />
    case "medium":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    case "low":
      return <AlertTriangle className="h-6 w-6 text-blue-500" />
    default:
      return <CheckCircle2 className="h-6 w-6 text-green-500" />
  }
}

export function DoshaAnalysis({ doshas = defaultDoshas }: DoshaAnalysisProps) {
  const presentDoshas = doshas.filter((d) => d.present)
  const absentDoshas = doshas.filter((d) => !d.present)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-4xl font-bold text-green-500">{absentDoshas.length}</p>
              <p className="text-sm text-muted-foreground">Doshas Absent</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-yellow-500">{presentDoshas.length}</p>
              <p className="text-sm text-muted-foreground">Doshas Present</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Present Doshas */}
      {presentDoshas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Doshas Present
          </h3>
          <div className="grid gap-4">
            {presentDoshas.map((dosha) => (
              <Card key={dosha.name} className={`glass-card ${getSeverityColor(dosha.severity)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getSeverityIcon(dosha.present, dosha.severity)}
                        {dosha.name}
                      </CardTitle>
                      {dosha.type && (
                        <CardDescription className="mt-1">Type: {dosha.type}</CardDescription>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dosha.severity === "high" ? "bg-red-500/20 text-red-500" :
                      dosha.severity === "medium" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-blue-500/20 text-blue-500"
                    }`}>
                      {dosha.severity.charAt(0).toUpperCase() + dosha.severity.slice(1)} Severity
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{dosha.description}</p>
                  
                  {dosha.remedies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Remedies:</h4>
                      <ul className="space-y-2">
                        {dosha.remedies.map((remedy, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{remedy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Absent Doshas */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Doshas Not Present
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {absentDoshas.map((dosha) => (
            <Card key={dosha.name} className="glass-card border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  {dosha.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{dosha.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
