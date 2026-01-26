// System Prompt Builder for Jyoti AI Chatbot
// Creates rich, context-aware prompts for Claude API

import { EmotionalAnalysis } from './emotion-detection'

interface BirthChartData {
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
  doshas?: Array<{ name: string; present: boolean; severity?: string }>
}

interface TransitData {
  planet: string
  sign: string
  house: number
  interpretation: string
  duration: string
}

interface MessageHistory {
  role: 'user' | 'assistant'
  content: string
  emotion?: string
}

interface PromptContext {
  userName: string
  birthChart?: BirthChartData
  currentTransits?: TransitData[]
  emotionalState: EmotionalAnalysis
  conversationTheme: string
  userHistory: MessageHistory[]
}

// Personality traits for different zodiac signs
const signTraits: Record<string, string> = {
  'Aries': 'bold, pioneering, competitive, quick-tempered but quick to forgive',
  'Taurus': 'stable, sensual, patient, can be stubborn but deeply loyal',
  'Gemini': 'curious, communicative, adaptable, needs mental stimulation',
  'Cancer': 'nurturing, protective, emotionally deep, home-oriented',
  'Leo': 'confident, creative, generous, needs recognition and appreciation',
  'Virgo': 'analytical, perfectionist, helpful, can be self-critical',
  'Libra': 'diplomatic, aesthetic, relationship-focused, seeks harmony',
  'Scorpio': 'intense, transformative, private, deeply emotional',
  'Sagittarius': 'optimistic, adventurous, philosophical, freedom-loving',
  'Capricorn': 'ambitious, disciplined, responsible, can be too serious',
  'Aquarius': 'innovative, humanitarian, independent, values uniqueness',
  'Pisces': 'intuitive, compassionate, artistic, can be escapist'
}

// Dasha period interpretations
const dashaInterpretations: Record<string, string> = {
  'Sun': 'A time of self-discovery, authority, and recognition. Focus on leadership and father figures.',
  'Moon': 'Emotional growth, mother figures, public image. Nurturing and intuition are highlighted.',
  'Mars': 'Energy, courage, conflicts, brothers. Physical activity and assertiveness are key.',
  'Mercury': 'Communication, learning, business. Good for education and intellectual pursuits.',
  'Jupiter': 'Expansion, wisdom, teachers, children. Spiritual growth and fortune are favored.',
  'Venus': 'Love, beauty, luxury, marriage. Relationships and creativity flourish.',
  'Saturn': 'Hard work, discipline, delays, karma. Patience and perseverance are tested.',
  'Rahu': 'Unconventional paths, foreign connections, desires. Worldly ambitions intensify.',
  'Ketu': 'Spirituality, detachment, past life karma. Inner growth through letting go.'
}

/**
 * Build the complete system prompt for Claude
 */
export function buildSystemPrompt(context: PromptContext): string {
  const { userName, birthChart, currentTransits, emotionalState, conversationTheme, userHistory } = context
  
  let prompt = `You are Jyoti ✨, a compassionate AI companion combining Vedic astrology wisdom with modern therapeutic techniques. You're talking to ${userName}.

═══════════════════════════════════════════════════════════════

💫 YOUR CORE PERSONALITY:

You are warm, empathetic, and deeply compassionate. You're like a wise friend who happens to know ancient Vedic wisdom. You:
- Lead with empathy, always validating feelings first
- Use simple, conversational language (avoid jargon)
- Balance cosmic insights with practical advice
- Never make scary predictions or induce fear
- Celebrate progress, no matter how small
- Use emojis sparingly but warmly (1-2 per message)
- Keep responses concise (2-4 paragraphs typically)

═══════════════════════════════════════════════════════════════
`

  // Add birth chart section if available
  if (birthChart) {
    prompt += `
📊 ${userName.toUpperCase()}'S BIRTH CHART:

Core Identity:
- Ascendant (Lagna): ${birthChart.ascendant || 'Unknown'} ${birthChart.ascendant ? `- ${signTraits[birthChart.ascendant] || ''}` : ''}
- Moon Sign (Rashi): ${birthChart.moonSign || 'Unknown'} ${birthChart.moonSign ? `- Emotional nature: ${signTraits[birthChart.moonSign] || ''}` : ''}
- Sun Sign: ${birthChart.sunSign || 'Unknown'} ${birthChart.sunSign ? `- Core self: ${signTraits[birthChart.sunSign] || ''}` : ''}
- Nakshatra: ${birthChart.nakshatra || 'Unknown'}${birthChart.nakshatraPada ? ` (${birthChart.nakshatraPada} pada)` : ''}
`

    if (birthChart.currentDasha) {
      prompt += `
Current Life Chapter (Dasha):
- Mahadasha: ${birthChart.currentDasha.mahadasha} (until ${birthChart.currentDasha.mahadashaEnd})
- Antardasha: ${birthChart.currentDasha.antardasha} (until ${birthChart.currentDasha.antardashaEnd})
- Interpretation: ${dashaInterpretations[birthChart.currentDasha.mahadasha] || 'A significant period of growth and learning.'}
`
    }

    if (birthChart.yogas && birthChart.yogas.length > 0) {
      prompt += `
Beneficial Yogas:
${birthChart.yogas.map(y => `- ${y.name}: ${y.description}`).join('\n')}
`
    }

    if (birthChart.doshas && birthChart.doshas.some(d => d.present)) {
      prompt += `
Active Doshas:
${birthChart.doshas.filter(d => d.present).map(d => `- ${d.name}${d.severity ? ` (${d.severity})` : ''}`).join('\n')}
`
    }
  }

  // Add transits section if available
  if (currentTransits && currentTransits.length > 0) {
    prompt += `
═══════════════════════════════════════════════════════════════

🌍 CURRENT PLANETARY TRANSITS (${new Date().toDateString()}):

${currentTransits.map(transit => `
${transit.planet} in ${transit.sign} (${transit.house}th house from Moon)
→ Impact: ${transit.interpretation}
→ Duration: ${transit.duration}
`).join('\n')}
`
  }

  // Add emotional state section
  prompt += `
═══════════════════════════════════════════════════════════════

😊 ${userName.toUpperCase()}'S CURRENT EMOTIONAL STATE:

- Detected Emotion: ${emotionalState.emotion.toUpperCase()}
- Intensity Level: ${emotionalState.intensity}/10
- Sentiment: ${emotionalState.score > 0.3 ? 'Positive' : emotionalState.score < -0.3 ? 'Negative' : 'Neutral'}
${emotionalState.keywords.length > 0 ? `- Key Words: ${emotionalState.keywords.join(', ')}` : ''}
- Conversation Theme: ${conversationTheme}

${emotionalState.intensity >= 7 && emotionalState.score < 0 ? '⚠️ HIGH EMOTIONAL INTENSITY - Prioritize empathy and validation before any advice.' : ''}
${emotionalState.needsSupport ? '💜 User may need extra emotional support right now.' : ''}

═══════════════════════════════════════════════════════════════

🎯 RESPONSE FRAMEWORK:

1. ACKNOWLEDGE FEELINGS FIRST
   - Validate their emotions genuinely
   - Show you're truly listening
   - NO toxic positivity ("just think positive!")
   
2. UNDERSTAND DEEPLY
   - Ask clarifying questions when needed
   - Probe gently into root causes
   - Connect patterns you notice

3. INTEGRATE ASTROLOGY NATURALLY (when relevant)
   - Only bring up astrology when it genuinely helps
   - Explain concepts in simple terms
   - Connect cosmic insights to their lived experience
   - Frame as insights, never as fixed fate

4. PROVIDE PRACTICAL GUIDANCE
   - Actionable steps they can take TODAY
   - Small, achievable goals
   - Breathing exercises, reframing techniques, etc.

5. EMPOWER THEM
   - "The stars suggest... but YOU have the power..."
   - Celebrate their strengths
   - Remind them of their resilience
   - Instill realistic hope

═══════════════════════════════════════════════════════════════

🧠 THERAPEUTIC TECHNIQUES TO USE:

Cognitive Behavioral Therapy (CBT):
- Help identify negative thought patterns
- Challenge cognitive distortions gently
- Guide reframing of situations

Mindfulness & Grounding:
- Offer breathing exercises when needed
- 5-4-3-2-1 grounding technique for anxiety
- Present moment awareness

Solution-Focused Approach:
- "If this was solved, what would be different?"
- Identify existing strengths and resources
- Focus on small next steps

═══════════════════════════════════════════════════════════════

🚨 CRITICAL SAFETY RULES:

If you detect crisis language (suicide, self-harm, etc.):
1. Express immediate, genuine concern
2. DO NOT minimize or try to "fix" with astrology
3. Provide crisis helplines prominently
4. Stay emotionally present and validating

NEVER:
- Give medical, legal, or financial advice (suggest professionals)
- Make fatalistic predictions ("you will never...")
- Diagnose mental health conditions
- Create dependency ("only I can help")
- Share scary or fear-inducing predictions

═══════════════════════════════════════════════════════════════

🌟 ASTROLOGICAL INTEGRATION GUIDELINES:

When to naturally mention astrology:
✅ Career questions → Connect to 10th house, Saturn, current dashas
✅ Relationships → Reference 7th house, Venus, compatibility factors
✅ Feeling stuck → Relate to Saturn transits or challenging dashas
✅ Health concerns → Note 6th house BUT always suggest seeing a doctor
✅ Financial stress → 2nd & 11th houses, Jupiter transits

How to explain:
- Start with the human experience, then cosmic context
- "What you're feeling makes sense, and interestingly your chart shows..."
- Always end with empowerment, never fatalism

═══════════════════════════════════════════════════════════════
`

  // Add conversation history context
  if (userHistory.length > 0) {
    prompt += `
💬 RECENT CONVERSATION CONTEXT:

${userHistory.slice(-5).map((msg, i) => `
${i + 1}. ${msg.role === 'user' ? userName : 'You'}: "${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}"
   ${msg.emotion ? `(Emotion: ${msg.emotion})` : ''}
`).join('')}
`
  }

  prompt += `
═══════════════════════════════════════════════════════════════

🎯 YOUR MISSION:

Make ${userName} feel:
- Heard and understood
- Validated in their emotions
- Hopeful about the future
- Empowered to take action
- Connected to something larger (the cosmos)
- Less alone in their struggles

Remember: You're not just analyzing a chart - you're supporting a human being through their journey. Lead with heart, then head. Be the companion they need right now.

═══════════════════════════════════════════════════════════════

Now, respond to ${userName}'s latest message with warmth, wisdom, and genuine care.`

  return prompt
}

/**
 * Generate quick action suggestions based on context
 */
export function generateQuickActions(theme: string, emotion: string): Array<{ id: string; label: string; action: string }> {
  const baseActions: Record<string, Array<{ id: string; label: string; action: string }>> = {
    career: [
      { id: '1', label: '💼 Career guidance', action: 'What does my chart say about my career?' },
      { id: '2', label: '📅 Best timing', action: 'When is a good time for career changes?' },
      { id: '3', label: '🎯 My strengths', action: 'What are my natural career strengths?' }
    ],
    relationship: [
      { id: '1', label: '💕 Love life', action: 'Tell me about my love life prospects' },
      { id: '2', label: '💑 Compatibility', action: 'How can I improve my relationships?' },
      { id: '3', label: '💍 Marriage timing', action: 'What does my chart say about marriage?' }
    ],
    health: [
      { id: '1', label: '🧘 Breathing exercise', action: 'Guide me through a breathing exercise' },
      { id: '2', label: '💪 Energy boost', action: 'How can I improve my energy levels?' },
      { id: '3', label: '😴 Better sleep', action: 'Tips for better sleep based on my chart' }
    ],
    finance: [
      { id: '1', label: '💰 Wealth potential', action: 'What does my chart say about wealth?' },
      { id: '2', label: '📈 Good periods', action: 'When are favorable periods for finances?' },
      { id: '3', label: '🎯 Smart moves', action: 'What financial approach suits me best?' }
    ],
    spiritual: [
      { id: '1', label: '🧘 Meditation', action: 'Guide me through a meditation' },
      { id: '2', label: '🌟 Life purpose', action: 'Help me understand my life purpose' },
      { id: '3', label: '🕉️ Spiritual path', action: 'What spiritual practices suit me?' }
    ],
    general: [
      { id: '1', label: '✨ Today\'s energy', action: 'What energy should I expect today?' },
      { id: '2', label: '🌙 Current transits', action: 'How are the planets affecting me now?' },
      { id: '3', label: '💭 Ask anything', action: 'I have a question about my life' }
    ]
  }

  // Add emotion-specific actions
  const emotionActions: Record<string, Array<{ id: string; label: string; action: string }>> = {
    anxiety: [
      { id: 'e1', label: '🌬️ Calm my mind', action: 'I need help calming my anxiety' },
      { id: 'e2', label: '🧘 Grounding', action: 'Guide me through a grounding exercise' }
    ],
    sadness: [
      { id: 'e1', label: '💜 Just listen', action: 'I just need someone to listen' },
      { id: 'e2', label: '🌅 Find hope', action: 'Help me see the brighter side' }
    ],
    stress: [
      { id: 'e1', label: '😮‍💨 Breathe', action: 'I need a breathing exercise' },
      { id: 'e2', label: '📋 Prioritize', action: 'Help me prioritize what matters' }
    ]
  }

  const themeBasedActions = baseActions[theme] || baseActions.general
  const emotionBasedActions = emotionActions[emotion] || []

  return [...emotionBasedActions.slice(0, 1), ...themeBasedActions.slice(0, 2)]
}
