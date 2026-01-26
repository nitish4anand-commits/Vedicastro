import { NextRequest, NextResponse } from 'next/server'

// Astrological context for better responses
const ASTROLOGICAL_CONTEXT = `
You are Jyoti, a compassionate and wise AI astrology companion. You combine deep knowledge of 
Vedic astrology with therapeutic techniques and emotional support. Your personality traits:

- Warm and empathetic, like a trusted friend
- Knowledgeable about Vedic astrology, including nakshatras, dashas, yogas, and planetary transits
- Skilled in offering meditation and breathing exercises for emotional regulation
- Culturally aware and respectful of diverse backgrounds
- Use gentle language and occasional emojis to feel approachable
- Always validate feelings before offering solutions
- If someone seems distressed, prioritize emotional support over astrological advice

Key Vedic Astrology Concepts you can discuss:
- 12 Rashis (zodiac signs) and their characteristics
- 27 Nakshatras and their influence
- Planetary periods (Mahadasha, Antardasha)
- Common yogas (Gaja Kesari, Budhaditya, Dhana Yoga, etc.)
- Doshas and their remedies (Manglik, Kaal Sarp, Pitra Dosha)
- Transit effects (Shani Sade Sati, Jupiter transits)
- Muhurta for auspicious timings

Always be supportive, never predict death, severe illness, or make scary predictions.
Focus on empowerment and growth opportunities in any chart analysis.
`

// Simple keyword detection for special message types
function detectMessageType(message: string): string | null {
  const lowerMessage = message.toLowerCase()
  
  // Crisis/distress detection
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'no reason to live', 'hopeless', 'worthless', 'self harm']
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'crisis-support'
  }
  
  // Meditation/anxiety request detection
  const meditationKeywords = ['anxious', 'anxiety', 'stressed', 'can\'t breathe', 'panic', 'meditation', 'breathing exercise', 'calm down', 'overwhelmed']
  if (meditationKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'meditation'
  }
  
  return null
}

// Generate quick actions based on response content
function generateQuickActions(response: string, userMessage: string): Array<{id: string; label: string; action: string}> {
  const actions: Array<{id: string; label: string; action: string}> = []
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
    actions.push({ id: '1', label: '10th House Analysis', action: 'analyze_10th_house' })
    actions.push({ id: '2', label: 'Career Transits', action: 'career_transits' })
  }
  
  if (lowerMessage.includes('love') || lowerMessage.includes('relationship') || lowerMessage.includes('marriage')) {
    actions.push({ id: '1', label: '7th House Analysis', action: 'analyze_7th_house' })
    actions.push({ id: '2', label: 'Venus Transit', action: 'venus_transit' })
  }
  
  if (lowerMessage.includes('health')) {
    actions.push({ id: '1', label: '6th House Analysis', action: 'analyze_6th_house' })
    actions.push({ id: '2', label: 'Health Remedies', action: 'health_remedies' })
  }
  
  return actions.slice(0, 3)
}

// Check if response contains astrological content
function hasAstroInsight(response: string): boolean {
  const astroTerms = ['planet', 'house', 'transit', 'dasha', 'rashi', 'nakshatra', 'yoga', 'saturn', 'jupiter', 'venus', 'mars', 'mercury', 'moon', 'sun', 'rahu', 'ketu']
  const lowerResponse = response.toLowerCase()
  return astroTerms.some(term => lowerResponse.includes(term))
}

// Generate response using Anthropic Claude API (if available) or fallback
async function generateResponse(message: string, history: Array<{role: string; content: string}>): Promise<string> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  
  // Try Anthropic Claude first
  if (anthropicKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system: ASTROLOGICAL_CONTEXT,
          messages: [
            ...history.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: message }
          ]
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.content[0].text
      }
    } catch (error) {
      console.error('Anthropic API error:', error)
    }
  }
  
  // Try OpenAI GPT as fallback
  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: ASTROLOGICAL_CONTEXT },
            ...history.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: message }
          ],
          max_tokens: 1024
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.choices[0].message.content
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
    }
  }
  
  // Fallback: Generate contextual response without API
  return generateFallbackResponse(message)
}

// Generate fallback response when no API is available
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|namaste|good morning|good evening)/)) {
    const greetings = [
      "Namaste! ✨ I'm Jyoti, your cosmic companion. How may I guide you on your journey today?",
      "Hello, dear soul! 🌟 The stars have aligned for our conversation. What would you like to explore?",
      "Namaste! 🙏 Welcome to this sacred space. Share with me what's on your heart and mind."
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  // Career questions
  if (lowerMessage.includes('career') || lowerMessage.includes('job') || lowerMessage.includes('work')) {
    return `Career matters are deeply connected to your 10th house (house of profession) and its lord. 🏢

**Key factors in career analysis:**
- **10th House**: Your public image and career direction
- **6th House**: Daily work and service
- **2nd House**: Income and accumulated wealth
- **Saturn**: Discipline, hard work, and long-term success

For a personalized analysis, I'd need your birth details. But generally, this period favors careful planning and patience. Trust that your efforts will bear fruit! 🌱

Would you like to:
• Generate your Kundli for detailed career insights
• Learn about current planetary transits
• Explore career-boosting remedies`
  }
  
  // Relationship questions
  if (lowerMessage.includes('love') || lowerMessage.includes('relationship') || lowerMessage.includes('marriage') || lowerMessage.includes('partner')) {
    return `Matters of the heart are governed by Venus (planet of love) and the 7th house (partnerships). 💕

**Key relationship indicators:**
- **7th House**: Marriage and committed partnerships
- **Venus**: Love, beauty, and romantic attraction
- **5th House**: Romance and courtship
- **Moon**: Emotional compatibility

In Vedic astrology, we also analyze the **Navamsa chart** (D9) for deeper marriage insights.

Remember, the stars show tendencies, but your free will shapes your destiny. What specific aspect would you like to explore? 🌹`
  }
  
  // Health questions
  if (lowerMessage.includes('health')) {
    return `Health in Vedic astrology is analyzed through multiple factors. 🏥

**Key health indicators:**
- **Ascendant**: Overall vitality and constitution
- **6th House**: Diseases and healing ability
- **8th House**: Chronic conditions and longevity
- **Moon**: Mental and emotional health

**General wellness tips from Jyotish:**
• Follow routines aligned with your Moon sign
• Practice pranayama (breathing exercises)
• Wear gemstones only after proper analysis

Would you like a breathing exercise to boost your vitality right now? 🧘‍♀️`
  }
  
  // Zodiac sign questions
  if (lowerMessage.includes('rashi') || lowerMessage.includes('zodiac') || lowerMessage.includes('sign') || 
      lowerMessage.match(/\b(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)\b/i)) {
    return `In Vedic astrology, your **Moon sign (Rashi)** is considered more important than your Sun sign! 🌙

The 12 Rashis represent different energies:
• **Aries (Mesha)**: Initiative, courage
• **Taurus (Vrishabha)**: Stability, sensuality  
• **Gemini (Mithuna)**: Communication, curiosity
• **Cancer (Karka)**: Nurturing, emotions
• **Leo (Simha)**: Leadership, creativity
• **Virgo (Kanya)**: Analysis, service
• **Libra (Tula)**: Balance, relationships
• **Scorpio (Vrishchika)**: Transformation, intensity
• **Sagittarius (Dhanu)**: Wisdom, adventure
• **Capricorn (Makara)**: Ambition, discipline
• **Aquarius (Kumbha)**: Innovation, humanitarian
• **Pisces (Meena)**: Spirituality, compassion

Would you like to generate your Kundli to discover your Moon sign? 🌟`
  }
  
  // General/default response
  const generalResponses = [
    `That's a wonderful question! ✨ In Vedic astrology, every aspect of life is connected to the cosmic dance of planets.

To give you personalized insights, I can:
• Analyze your birth chart (Kundli)
• Explain current planetary transits
• Suggest astrological remedies
• Guide you through a calming meditation

What resonates with you right now? 🌙`,

    `I hear you, and I'm here to help. 🙏

The ancient wisdom of Jyotish (Vedic astrology) offers guidance for all life's journeys. Whether you're seeking clarity about relationships, career, health, or spiritual growth - the planets have messages for you.

Would you like to:
• Share your birth details for personalized insights
• Learn about today's cosmic energies
• Explore a specific area of your life

What calls to you? ✨`,

    `Thank you for sharing that with me. 🌟

Every question you have is valid, and the cosmos has wisdom to offer. Vedic astrology sees life as a beautiful interplay of karma, dharma, and divine timing.

I'm here to be your guide. Would you like me to:
• Help you understand planetary influences
• Suggest remedies for challenges
• Offer a moment of peace through meditation

What would serve you best right now? 🕉️`
  ]
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Detect special message types
    const messageType = detectMessageType(message)
    
    // For crisis messages, return immediate support without API call
    if (messageType === 'crisis-support') {
      return NextResponse.json({
        reply: "I'm here for you, and I'm concerned about what you've shared. Your feelings are valid, and you don't have to face this alone. Please reach out to professional support - they're trained to help.",
        messageType: 'crisis-support',
        quickActions: []
      })
    }
    
    // For meditation requests
    if (messageType === 'meditation') {
      return NextResponse.json({
        reply: "I can sense you need some calm right now. Let me guide you through a breathing exercise. This will help regulate your nervous system and bring peace. 🧘‍♀️",
        messageType: 'meditation',
        quickActions: []
      })
    }
    
    // Generate AI response
    const reply = await generateResponse(message, history)
    
    // Generate quick actions and check for astro insights
    const quickActions = generateQuickActions(reply, message)
    const hasAstro = hasAstroInsight(reply)
    
    return NextResponse.json({
      reply,
      quickActions,
      hasAstroInsight: hasAstro,
      messageType: 'text'
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        reply: "I apologize, but I'm having trouble connecting to my cosmic knowledge right now. Please try again in a moment. 🙏",
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
