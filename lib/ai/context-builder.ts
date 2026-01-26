// Context Builder for Jyoti AI Chatbot
// Pulls data from existing astrology and user systems

import { analyzeEmotion, detectCrisis } from './emotion-detection'

interface BirthChart {
  ascendant?: string
  moonSign?: string
  sunSign?: string
  nakshatra?: string
  nakshatraPada?: number
  currentDasha?: {
    mahadasha: string
    mahadashaEnd: string
    antardasha: string
    antardashaEnd: string
  }
  planets?: Record<string, { sign: string; house: number; degree: number }>
  yogas?: Array<{ name: string; description: string }>
  doshas?: Record<string, boolean>
}

interface Transit {
  planet: string
  sign: string
  house?: number
  interpretation: string
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  emotion?: string
}

interface EmotionalState {
  emotion: string
  intensity: number
  score: number
  keywords: string[]
  needsSupport: boolean
}

export interface FullContext {
  userName: string
  userId?: string
  birthChart: BirthChart | null
  currentTransits: Transit[]
  conversationHistory: ConversationMessage[]
  emotionalState: EmotionalState
  crisisDetected: boolean
  crisisSeverity: 'low' | 'medium' | 'high' | 'critical'
  sessionTheme?: string
}

/**
 * Build full context for the AI from various data sources
 */
export async function buildFullContext(
  userId: string | undefined,
  sessionId: string | undefined,
  currentMessage: string,
  history: ConversationMessage[] = [],
  birthChart?: BirthChart | null,
  userName?: string
): Promise<FullContext> {
  
  // Analyze emotional state from current message
  const emotionalState = analyzeEmotion(currentMessage)
  
  // Check for crisis
  const crisisResult = detectCrisis(currentMessage, emotionalState)
  
  // Get current transits (simplified - use actual transit calculation)
  const currentTransits = getCurrentPlanetaryTransits()
  
  return {
    userName: userName || 'friend',
    userId,
    birthChart: birthChart || null,
    currentTransits,
    conversationHistory: history.slice(-10), // Last 10 messages
    emotionalState,
    crisisDetected: crisisResult.isCrisis,
    crisisSeverity: crisisResult.severity,
    sessionTheme: detectSessionTheme(history, currentMessage)
  }
}

/**
 * Build dynamic system prompt based on context
 */
export function buildDynamicSystemPrompt(context: FullContext): string {
  let prompt = `You are Jyoti ✨, a deeply empathetic AI companion who understands both Vedic astrology and human psychology.

You're talking to ${context.userName}. Here's everything you need to know:

═══════════════════════════════════════════════════════════════

📊 ${context.userName.toUpperCase()}'S BIRTH CHART:

Ascendant: ${context.birthChart?.ascendant || 'Not provided yet'}
Moon Sign: ${context.birthChart?.moonSign || 'Not provided yet'}
Sun Sign: ${context.birthChart?.sunSign || 'Not provided yet'}
Nakshatra: ${context.birthChart?.nakshatra || 'Not provided yet'}

Current Dasha: ${context.birthChart?.currentDasha?.mahadasha || 'Unknown'} Mahadasha
Current Antardasha: ${context.birthChart?.currentDasha?.antardasha || 'Unknown'}

${context.birthChart?.planets ? formatPlanets(context.birthChart.planets) : 'Planetary positions not available - encourage user to generate their Kundli'}

Active Yogas:
${context.birthChart?.yogas ? formatYogas(context.birthChart.yogas) : 'Generate Kundli to see yogas'}

Doshas:
${context.birthChart?.doshas ? formatDoshas(context.birthChart.doshas) : 'Generate Kundli to check doshas'}

═══════════════════════════════════════════════════════════════

🌍 CURRENT PLANETARY TRANSITS (${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}):

${context.currentTransits.map(t => `• ${t.planet} in ${t.sign} - ${t.interpretation}`).join('\n')}

═══════════════════════════════════════════════════════════════

💬 RECENT CONVERSATION:

${context.conversationHistory.length > 0 
  ? context.conversationHistory.slice(-5).map((m, i) => 
      `${i + 1}. ${m.role === 'user' ? context.userName : 'Jyoti'}: ${m.content.substring(0, 200)}${m.content.length > 200 ? '...' : ''}`
    ).join('\n')
  : 'This is the start of the conversation'
}

═══════════════════════════════════════════════════════════════

😊 CURRENT EMOTIONAL STATE:

Emotion: ${context.emotionalState.emotion.toUpperCase()}
Intensity: ${context.emotionalState.intensity}/10
Sentiment: ${context.emotionalState.score > 0 ? 'Positive' : context.emotionalState.score < 0 ? 'Negative' : 'Neutral'} (${context.emotionalState.score.toFixed(2)})
Keywords detected: ${context.emotionalState.keywords.length > 0 ? context.emotionalState.keywords.join(', ') : 'none'}

${context.emotionalState.intensity >= 7 ? '⚠️ HIGH EMOTIONAL INTENSITY - Prioritize empathy and validation before any advice' : ''}
${context.emotionalState.needsSupport ? '💜 User appears to need emotional support - be extra gentle and caring' : ''}

═══════════════════════════════════════════════════════════════
`

  // Add crisis protocol if needed
  if (context.crisisDetected) {
    prompt += `
🚨 CRISIS ALERT - SEVERITY: ${context.crisisSeverity.toUpperCase()}

Message contains concerning language. YOUR IMMEDIATE RESPONSE:

1. Acknowledge their pain with deep, genuine compassion
2. Provide crisis helplines IMMEDIATELY:
   🆘 AASRA India: 9820466726 (24/7)
   🆘 Vandrevala Foundation: 1860-2662-345 (24/7)
   🆘 iCall: 9152987821 (Mon-Sat, 8AM-10PM)
   🆘 Snehi: 91-22-27546669 (24/7)
   
3. Ask if they're safe right now
4. Encourage reaching out to someone they trust
5. Stay emotionally present - you MATTER
6. DO NOT try to "fix" with astrology - this is about their life

This is life-and-death. Respond with humanity first. Astrology second (or not at all).

═══════════════════════════════════════════════════════════════
`
  }

  prompt += `
YOUR APPROACH:

1. **BE AUTHENTIC** - Talk like a real friend, not a template-following AI. Use natural language.

2. **THINK DEEPLY** - Connect their chart + transits + emotional state + conversation history to give truly personalized insights.

3. **ASK QUESTIONS** - Understand before advising. "What's making you feel this way?" > "Here's what to do"

4. **INTEGRATE ASTROLOGY NATURALLY** - Only when genuinely helpful:
   ✓ "I notice Saturn is transiting your 7th house right now, which often brings relationship lessons..."
   ✗ "Your Saturn placement indicates relationship delays" (too robotic)

5. **MATCH THEIR ENERGY** 
   - Short question = brief, warm answer + follow-up question
   - Long message = thoughtful, detailed response
   - Emotional message = validation first, advice later (if at all)

6. **BE CONVERSATIONAL** 
   ✓ "Okay, here's what I'm seeing in your chart..."
   ✓ "That makes so much sense given what's happening with Mars right now..."
   ✗ "Analysis indicates..." (too formal)

7. **VARY YOUR RESPONSES** - Never sound repetitive. Each response should be unique to THIS moment.

8. **USE EMOJIS SPARINGLY** - One or two per message max, not every sentence.

${!context.birthChart ? `
9. **ENCOURAGE KUNDLI GENERATION** - If they ask about their chart but haven't generated one:
   "I'd love to give you personalized insights! Have you generated your Kundli on our website? It takes just a minute and I can then see your exact planetary positions 🌟"
` : ''}

CRITICAL: No templates. No formulas. Think through what THIS person needs to hear RIGHT NOW.

Respond naturally to their latest message.`

  return prompt
}

/**
 * Get current planetary transits (simplified version)
 */
function getCurrentPlanetaryTransits(): Transit[] {
  // In production, this would call your actual transit calculation
  // For now, return general current transit info
  const now = new Date()
  const month = now.getMonth()
  
  // Simplified transit data - replace with actual calculations
  return [
    { 
      planet: 'Sun', 
      sign: getSunSign(month),
      interpretation: 'Focus on self-expression and vitality'
    },
    {
      planet: 'Moon',
      sign: 'Varies daily',
      interpretation: 'Emotional tides shifting - check Panchang for daily moon sign'
    },
    {
      planet: 'Mercury',
      sign: getMercuryApproxSign(month),
      interpretation: 'Communication and learning themes active'
    },
    {
      planet: 'Venus',
      sign: getVenusApproxSign(month),
      interpretation: 'Love, beauty, and harmony influences'
    },
    {
      planet: 'Mars',
      sign: 'Scorpio', // Update based on actual position
      interpretation: 'Intense energy for transformation and decisive action'
    },
    {
      planet: 'Jupiter',
      sign: 'Taurus', // Update based on actual position
      interpretation: 'Growth through stability and material wisdom'
    },
    {
      planet: 'Saturn',
      sign: 'Aquarius', // Update based on actual position
      interpretation: 'Lessons in community, innovation, and detachment'
    }
  ]
}

function getSunSign(month: number): string {
  const signs = [
    'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
    'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
  ]
  return signs[month] || 'Capricorn'
}

function getMercuryApproxSign(month: number): string {
  // Mercury is usually within 1 sign of Sun
  return getSunSign(month)
}

function getVenusApproxSign(month: number): string {
  // Venus is usually within 2 signs of Sun
  const signs = [
    'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
    'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
  ]
  return signs[(month + 1) % 12] || 'Aquarius'
}

function formatPlanets(planets: Record<string, { sign: string; house: number; degree: number }>): string {
  if (!planets || Object.keys(planets).length === 0) return 'Planetary positions not available'
  
  return 'Planetary Positions:\n' + Object.entries(planets)
    .map(([planet, data]) => `• ${planet}: ${data.sign} in ${data.house}th house (${data.degree.toFixed(1)}°)`)
    .join('\n')
}

function formatYogas(yogas: Array<{ name: string; description: string }>): string {
  if (!yogas || yogas.length === 0) return 'No prominent yogas detected'
  return yogas.slice(0, 5).map(y => `• ${y.name}: ${y.description}`).join('\n')
}

function formatDoshas(doshas: Record<string, boolean>): string {
  const activeDoshas = Object.entries(doshas)
    .filter(([_, present]) => present)
    .map(([name]) => `• ${name}`)
  
  return activeDoshas.length > 0 ? activeDoshas.join('\n') : 'No significant doshas present'
}

function detectSessionTheme(history: ConversationMessage[], currentMessage: string): string {
  const allText = [...history.map(m => m.content), currentMessage].join(' ').toLowerCase()
  
  if (allText.match(/career|job|work|profession|business|money|salary/)) return 'career'
  if (allText.match(/love|relationship|marriage|partner|spouse|dating/)) return 'relationship'
  if (allText.match(/health|illness|disease|medical|body|fitness/)) return 'health'
  if (allText.match(/family|parent|child|mother|father|sibling/)) return 'family'
  if (allText.match(/spiritual|meditation|soul|purpose|meaning/)) return 'spiritual'
  if (allText.match(/education|study|exam|college|learning/)) return 'education'
  if (allText.match(/travel|abroad|foreign|visa|migration/)) return 'travel'
  
  return 'general'
}

/**
 * Generate quick action suggestions based on context
 */
export function generateQuickActions(context: FullContext): Array<{ id: string; label: string; action: string }> {
  const actions: Array<{ id: string; label: string; action: string }> = []
  
  if (context.emotionalState.intensity >= 6) {
    actions.push({ id: '1', label: '🧘 Breathing exercise', action: 'start_breathing' })
  }
  
  if (!context.birthChart) {
    actions.push({ id: '2', label: '📊 Generate my Kundli', action: 'generate_kundli' })
  }
  
  if (context.sessionTheme === 'relationship' && context.birthChart) {
    actions.push({ id: '3', label: '💕 Check compatibility', action: 'kundli_matching' })
  }
  
  actions.push({ id: '4', label: '🌅 Today\'s horoscope', action: 'daily_horoscope' })
  actions.push({ id: '5', label: '📅 Check Panchang', action: 'panchang' })
  
  return actions.slice(0, 4)
}
