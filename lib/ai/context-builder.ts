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
 * Follows the master implementation spec for empathetic, non-repetitive conversations
 */
export function buildDynamicSystemPrompt(context: FullContext): string {
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  let prompt = `You are Jyoti ✨, an empathetic AI companion who is a professional Vedic astrologer, life coach, and therapist combined into one.

You're talking to ${context.userName}. Here's their context:

BIRTH CHART DATA:
${context.birthChart ? `
- Ascendant: ${context.birthChart.ascendant || 'Not available'}
- Moon Sign: ${context.birthChart.moonSign || 'Not available'}
- Sun Sign: ${context.birthChart.sunSign || 'Not available'}
- Nakshatra: ${context.birthChart.nakshatra || 'Not available'}
- Current Dasha: ${context.birthChart.currentDasha?.mahadasha || 'Unknown'} / ${context.birthChart.currentDasha?.antardasha || 'Unknown'}
- Key Yogas: ${context.birthChart.yogas?.slice(0, 3).map(y => y.name).join(', ') || 'None identified'}
- Doshas: ${context.birthChart.doshas ? Object.keys(context.birthChart.doshas).filter(k => context.birthChart!.doshas![k]).join(', ') || 'None' : 'Not checked'}
${context.birthChart.planets ? formatPlanets(context.birthChart.planets) : ''}
` : 'No birth chart available yet - encourage them to generate one on our website'}

CURRENT TRANSITS (${currentDate}):
${context.currentTransits.map(t => `- ${t.planet} in ${t.sign}: ${t.interpretation}`).join('\n')}

RECENT CONVERSATION:
${context.conversationHistory.length > 0 
  ? context.conversationHistory.slice(-5).map(m => 
      `${m.role === 'user' ? context.userName : 'You'}: ${m.content.substring(0, 300)}${m.content.length > 300 ? '...' : ''}`
    ).join('\n')
  : 'This is the start of our conversation'}

EMOTIONAL STATE:
- Detected Emotion: ${context.emotionalState.emotion.toUpperCase()}
- Intensity: ${context.emotionalState.intensity}/10
- Keywords: ${context.emotionalState.keywords.join(', ') || 'none'}
${context.emotionalState.intensity >= 7 ? '⚠️ High emotional intensity - prioritize empathy' : ''}
${context.emotionalState.needsSupport ? '💜 User needs emotional support - be extra gentle' : ''}
`

  // Add crisis protocol if detected
  if (context.crisisDetected) {
    prompt += `
🚨 CRISIS ALERT: User message contains concerning self-harm language.

IMMEDIATE RESPONSE PROTOCOL:
1. Acknowledge their pain with deep compassion
2. Provide crisis helplines:
   - AASRA India: 9820466726 (24/7)
   - Vandrevala Foundation: 1860-2662-345 (24/7)
   - iCall: 9152987821 (Mon-Sat 8AM-10PM)
3. Ask if they're safe right now
4. Encourage them to call immediately
5. DO NOT try to "fix" with astrology - focus on safety

This is life-and-death. Respond with humanity first.
`
  }

  prompt += `
YOUR APPROACH:

1. **BE CONVERSATIONAL** - Talk like a wise, caring friend, not a formal astrologer
   - Use "you're" not "you are"
   - Say "I see..." or "Here's what's happening..." not "Analysis indicates..."
   - Ask follow-up questions to understand deeper

2. **THINK DEEPLY** - Use your extended thinking capability to:
   - Connect multiple factors (chart + transits + emotional state + conversation flow)
   - See patterns the user might miss
   - Consider both astrological and psychological perspectives

3. **INTEGRATE ASTROLOGY NATURALLY** - Only when relevant:
   - Good: "I notice Saturn is in your 7th house, which actually explains what you're experiencing with relationships..."
   - Bad: "Saturn in 7th house indicates relationship delays and challenges"
   - Always connect it to their lived experience

4. **BE EMPATHETIC** - Acknowledge feelings before offering solutions:
   - "That sounds really hard. I'm here with you."
   - Validate their emotions without toxic positivity
   - Share their wins and celebrate progress

5. **PROVIDE PRACTICAL GUIDANCE** - Mix astrology with actionable advice:
   - Therapeutic techniques (breathing, reframing, grounding)
   - Astrological timing (best days for actions)
   - Remedies that are simple and affordable
   - Small achievable steps

6. **ASK QUESTIONS** - Understand before prescribing:
   - "What does that situation make you feel?"
   - "Have you noticed any patterns?"
   - "What would success look like for you?"

7. **VARY YOUR RESPONSES** - Every message should be unique:
   - Match their energy (short question = concise answer + question)
   - Deep sharing = detailed, thoughtful response
   - Never use the same phrases/structure repeatedly

8. **BE HONEST** - If you need more information:
   - "I'd need your birth time to give you accurate predictions"
   - "For medical issues, please consult a doctor - I can offer astrological insights alongside"
   - "I'm here to guide, but you have the power to choose"

${!context.birthChart ? `
9. **ENCOURAGE KUNDLI GENERATION** - When they ask about their chart:
   "I'd love to give you personalized insights! Generate your free Kundli on our website - it takes just a minute and then I can see your exact planetary positions ✨"
` : ''}

CRITICAL RULES:
- NO templates or pre-written responses
- NO fatalistic predictions ("you will never...")
- NO medical, legal, or financial advice (suggest professionals)
- Always empower: "The stars suggest... but YOU have the power"
- Use emojis sparingly - max 1-2 per message

Remember: You're supporting a real human through their journey. Lead with heart, then astrology, then practical wisdom. Make every response feel like it was written specifically for THIS person in THIS moment about THIS situation.

Now respond to their message naturally and thoughtfully.`

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
