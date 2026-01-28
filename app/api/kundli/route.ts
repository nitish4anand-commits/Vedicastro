import { NextResponse } from "next/server"
import { generateKundli } from "@/lib/astrology/calculations"
import { generatePreciseKundli } from "@/lib/astrology/precise-calculations"
import { generateComprehensiveAnalysis } from "@/lib/astrology/advanced-calculations"
import { generateEnhancedDashaAnalysis } from "@/lib/astrology/enhanced-dasha-analysis"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, dateOfBirth, timeOfBirth, placeOfBirth, latitude, longitude, timezone } = body

    // Validate required fields
    if (!dateOfBirth || !timeOfBirth) {
      return NextResponse.json(
        { status: "error", message: "Date and time of birth are required" },
        { status: 400 }
      )
    }

    // Validate latitude/longitude for accurate calculations
    if (!latitude || !longitude) {
      return NextResponse.json(
        { status: "error", message: "Latitude and longitude are required for accurate calculations" },
        { status: 400 }
      )
    }

    // Parse birth date
    const birthDate = new Date(dateOfBirth)
    
    // Parse timezone (can be string or number)
    const tz = typeof timezone === 'string' ? parseFloat(timezone) : (timezone || 5.5)
    
    // Generate Kundli using PRECISE calculation engine
    const kundliData = generatePreciseKundli(
      name || "User",
      birthDate,
      timeOfBirth,
      placeOfBirth || "Unknown",
      latitude,
      longitude,
      tz
    )

    // Transform to API response format
    const response = {
      status: "success",
      data: {
        birthDetails: {
          name: kundliData.birthDetails.name,
          dateOfBirth,
          timeOfBirth,
          placeOfBirth: kundliData.birthDetails.place,
          latitude: kundliData.birthDetails.latitude,
          longitude: kundliData.birthDetails.longitude,
          timezone: kundliData.birthDetails.timezone,
        },
        kundli: {
          ascendant: {
            sign: kundliData.ascendant.signName,
            signLord: kundliData.planets.find(p => p.name === "Sun")?.signName || "",
            nakshatra: kundliData.ascendant.nakshatra,
            pada: kundliData.ascendant.pada,
            degree: `${kundliData.ascendant.degrees}°${kundliData.ascendant.minutes}'`,
          },
          moonSign: kundliData.moonSign,
          sunSign: kundliData.sunSign,
          houses: kundliData.houses.map((cusp, i) => ({
            house: i + 1,
            sign: Math.floor(cusp / 30),
            signName: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][Math.floor(cusp / 30)],
            degree: cusp % 30,
          })),
        },
        planets: kundliData.planets.map(p => ({
          name: p.name,
          sign: p.signName,
          signLord: p.signName,
          nakshatra: p.nakshatra,
          nakshatraLord: p.nakshatra,
          house: p.house,
          degree: `${p.degrees}°${p.minutes}'`,
          isRetrograde: p.isRetrograde,
          longitude: p.longitude,
        })),
        dasha: (() => {
          // Generate enhanced dasha analysis
          const enhancedDashas = generateEnhancedDashaAnalysis(
            kundliData.dashas,
            kundliData.planets.map(p => ({
              name: p.name,
              sign: p.sign,
              house: p.house,
              isRetrograde: p.isRetrograde,
              isCombust: false // Would need combustion calculation
            })),
            kundliData.ascendant.sign
          )

          return {
            currentDasha: kundliData.dashas[0]?.planet || "Unknown",
            timeline: kundliData.dashas.map(d => ({
              planet: d.planet,
              startDate: d.startDate.toISOString().split("T")[0],
              endDate: d.endDate.toISOString().split("T")[0],
              duration: `${d.years.toFixed(1)} years`,
            })),
            enhanced: enhancedDashas.map(ed => ({
              planet: ed.planet,
              startDate: ed.startDate.toISOString().split("T")[0],
              endDate: ed.endDate.toISOString().split("T")[0],
              years: ed.years,
              strength: {
                overall: ed.strength.overall,
                dignity: ed.strength.dignity,
                housePlacement: ed.strength.housePlacement,
                houseStrength: ed.strength.houseStrength,
                isRetrograde: ed.strength.isRetrograde,
                isCombust: ed.strength.isCombust
              },
              functionalNature: ed.functionalNature,
              housesRuled: ed.housesRuled,
              antardashas: ed.antardashas.map(ad => ({
                planet: ad.planet,
                startDate: ad.startDate.toISOString().split("T")[0],
                endDate: ad.endDate.toISOString().split("T")[0],
                years: ad.years,
                months: ad.months,
                days: ad.days,
                isCurrent: ad.isCurrent,
                quality: ad.quality
              })),
              predictions: ed.predictions,
              activatedYogas: ed.activatedYogas,
              remedies: ed.remedies
            }))
          }
        })(),
        yogas: kundliData.yogas.map(y => ({
          name: y.name,
          description: y.description,
          type: y.strength === "strong" ? "Benefic" : "Mixed",
          strength: y.strength === "strong" ? "High" : y.strength === "medium" ? "Medium" : "Low",
        })),
        doshas: kundliData.doshas.map(d => ({
          name: d.name,
          present: true,
          severity: d.severity,
          description: d.description,
          remedies: d.remedies,
        })),
        
        // Advanced Analysis (State-of-the-Art)
        advancedAnalysis: (() => {
          // Build positions and houses for advanced analysis
          const positions: Record<string, number> = {}
          const houses: Record<string, number> = {}
          
          for (const planet of kundliData.planets) {
            positions[planet.name] = planet.longitude
            houses[planet.name] = planet.house
          }
          
          // Parse birth hour for Kaala Bala
          const [birthHours] = timeOfBirth.split(":").map(Number)
          
          return generateComprehensiveAnalysis(
            positions,
            houses,
            kundliData.houses,
            kundliData.ascendant.longitude,
            positions.Moon || 0,
            birthDate,
            birthHours || 12
          )
        })(),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to generate Kundli. Please try again.",
      },
      { status: 500 }
    )
  }
}
