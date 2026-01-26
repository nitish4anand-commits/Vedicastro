import { NextRequest, NextResponse } from 'next/server'
import { 
  analyzeEmotion, 
  detectCrisis, 
  getCrisisResponse, 
  detectConversationTheme,
  CRISIS_HELPLINES 
} from '@/lib/ai/emotion-detection'
import { buildSystemPrompt, generateQuickActions } from '@/lib/ai/system-prompt'
import { enhanceWithAstrology, containsAstroInsight } from '@/lib/ai/astrology-enhancer'

// Types
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  emotion?: string
}

interface UserBirthChart {
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
  yogas?: Array<{ name: string; description: string }>
  doshas?: Array<{ name: string; present: boolean; severity?: string }>
}

// Get user's birth chart from localStorage/session (passed from frontend)
function parseBirthChart(chartData: unknown): UserBirthChart | undefined {
  if (!chartData || typeof chartData !== 'object') return undefined
  return chartData as UserBirthChart
}

// Detect if user wants meditation/breathing
function wantsMeditation(message: string): boolean {
  const keywords = [
    'breathing exercise', 'meditation', 'calm down', 'calm me',
    'help me relax', 'anxious', 'panic', 'overwhelmed', 'stressed',
    'need to breathe', 'can\'t breathe', 'grounding'
  ]
  return keywords.some(k => message.toLowerCase().includes(k))
}

// Call Anthropic Claude API
async function callClaudeAPI(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        ...messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ]
    })
  })
  
  if (!response.ok) {
    const errorData = await response.text()
    console.error('Claude API error:', errorData)
    throw new Error('Failed to get response from Claude')
  }
  
  const data = await response.json()
  const textBlock = data.content?.find((block: { type: string }) => block.type === 'text')
  return textBlock?.text || ''
}

// Call OpenAI GPT API as fallback
async function callOpenAIAPI(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ],
      max_tokens: 2048,
      temperature: 0.7
    })
  })
  
  if (!response.ok) {
    throw new Error('Failed to get response from OpenAI')
  }
  
  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Intelligent fallback responses when no API is available
function generateFallbackResponse(message: string, emotion: string, theme: string): string {
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
  
  // Emotion-specific responses
  if (emotion === 'anxiety' || emotion === 'stress') {
    return `I can sense you're carrying some weight right now, and that's okay. Your feelings are completely valid. 💜

Let me share a simple technique: Take a slow breath in through your nose for 4 counts, hold for 4, then release through your mouth for 6 counts. Do this 3 times.

When you're ready, I'm here to listen. What's been on your mind? Sometimes just putting it into words can help lighten the load.

Would you like me to guide you through a full breathing exercise, or would you prefer to talk about what's causing this feeling?`
  }
  
  if (emotion === 'sadness') {
    return `I hear you, and I want you to know that your feelings matter. It takes courage to express what's in your heart. 💙

Whatever you're going through, you don't have to face it alone. In Vedic wisdom, we believe that even the darkest nights give way to dawn.

Tell me more about what you're experiencing. I'm here to listen without judgment, and together we might find some light in this moment.`
  }
  
  // Theme-specific responses
  if (theme === 'career') {
    return `Career and purpose are such important parts of our journey! 💼

In Vedic astrology, career paths are influenced by the 10th house (house of profession), Saturn (discipline and hard work), and your current planetary period (Dasha).

**Some questions to reflect on:**
- What activities make you lose track of time?
- When do you feel most energized at work?
- What would your ideal workday look like?

If you share your birth details, I can look at how the planets are currently influencing your professional life. What specific aspect of your career would you like to explore?`
  }
  
  if (theme === 'relationship') {
    return `Matters of the heart are so central to our human experience. 💕

In Vedic astrology, relationships are governed by the 7th house (partnerships), Venus (love and attraction), and the Moon (emotional connection).

**Key insights from the stars:**
- The 7th house reveals what we seek in a partner
- Venus placement shows our love language
- Current transits can highlight relationship themes

What's on your heart regarding relationships? Whether it's a specific situation or a general question about your romantic path, I'm here to explore this with you.`
  }
  
  if (theme === 'spiritual') {
    return `What a beautiful question to be exploring! Spiritual growth is at the heart of Vedic wisdom. 🕉️

The 9th house in your chart governs dharma (life purpose), higher learning, and spiritual evolution. Jupiter, the great benefic, guides our expansion and wisdom.

**Three pillars of spiritual growth in Vedic tradition:**
1. Self-awareness (knowing your tendencies and patterns)
2. Daily practice (even small, consistent efforts)
3. Service to others (karma yoga)

What aspect of spirituality calls to you right now? Meditation, understanding your purpose, or perhaps navigating a specific spiritual question?`
  }
  
  // Default response
  return `Thank you for reaching out. I'm Jyoti, here to blend ancient Vedic wisdom with compassionate support. ✨

I'm happy to explore:
- **Your birth chart** for personalized insights
- **Current planetary transits** affecting you
- **Life guidance** on relationships, career, health
- **Emotional support** and grounding techniques
- **Meditation** and mindfulness practices

What would feel most helpful for you right now? I'm all ears. 🙏`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      message, 
      history = [], 
      userName = 'Friend',
      birthChart: rawBirthChart
    } = body
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Parse birth chart if provided
    const birthChart = parseBirthChart(rawBirthChart)
    
    // Analyze emotional state
    const emotionalState = analyzeEmotion(message)
    
    // Detect crisis situation
    const crisisCheck = detectCrisis(message, emotionalState)
    
    if (crisisCheck.isCrisis) {
      const crisisResponse = getCrisisResponse(crisisCheck.severity)
      return NextResponse.json({
        reply: crisisResponse,
        messageType: 'crisis-support',
        quickActions: [],
        emotion: emotionalState.emotion,
        intensity: emotionalState.intensity,
        helplines: CRISIS_HELPLINES
      })
    }
    
    // Check for meditation request
    if (wantsMeditation(message)) {
      return NextResponse.json({
        reply: "I can sense you need some calm right now. Let me guide you through a breathing exercise to help regulate your nervous system. 🧘‍♀️\n\nThis is a 4-4-6-2 breathing pattern that activates your parasympathetic response and helps calm anxiety.",
        messageType: 'meditation',
        quickActions: [
          { id: '1', label: '🌬️ Start breathing', action: 'start_breathing' },
          { id: '2', label: '💬 Keep talking', action: 'continue_chat' }
        ],
        emotion: emotionalState.emotion,
        intensity: emotionalState.intensity
      })
    }
    
    // Detect conversation theme
    const theme = detectConversationTheme(message, history)
    
    // Build system prompt with full context
    const systemPrompt = buildSystemPrompt({
      userName,
      birthChart,
      emotionalState,
      conversationTheme: theme,
      userHistory: history.slice(-5) as ChatMessage[]
    })
    
    let reply: string
    
    // Try AI APIs
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    
    if (hasClaudeKey) {
      try {
        reply = await callClaudeAPI(systemPrompt, history, message)
      } catch (error) {
        console.error('Claude API error:', error)
        if (hasOpenAIKey) {
          try {
            reply = await callOpenAIAPI(systemPrompt, history, message)
          } catch (openAIError) {
            console.error('OpenAI API error:', openAIError)
            reply = generateFallbackResponse(message, emotionalState.emotion, theme)
          }
        } else {
          reply = generateFallbackResponse(message, emotionalState.emotion, theme)
        }
      }
    } else if (hasOpenAIKey) {
      try {
        reply = await callOpenAIAPI(systemPrompt, history, message)
      } catch (error) {
        console.error('OpenAI API error:', error)
        reply = generateFallbackResponse(message, emotionalState.emotion, theme)
      }
    } else {
      // No API keys configured - use intelligent fallback
      reply = generateFallbackResponse(message, emotionalState.emotion, theme)
    }
    
    // Enhance with astrological insights if relevant
    reply = enhanceWithAstrology(reply, message, birthChart)
    
    // Generate quick actions based on context
    const quickActions = generateQuickActions(theme, emotionalState.emotion)
    
    // Check if response has astrological content
    const hasAstro = containsAstroInsight(reply)
    
    return NextResponse.json({
      reply,
      quickActions,
      hasAstroInsight: hasAstro,
      messageType: 'text',
      emotion: emotionalState.emotion,
      intensity: emotionalState.intensity,
      sentimentScore: emotionalState.score,
      theme
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { 
        reply: "I'm having a moment of cosmic interference. 🌌 Please try again in a moment, and I'll be right here for you.",
        messageType: 'error',
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
