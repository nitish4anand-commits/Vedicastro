import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { 
  analyzeEmotion, 
  detectCrisis, 
  getCrisisResponse, 
  detectConversationTheme,
  CRISIS_HELPLINES 
} from '@/lib/ai/emotion-detection'
import { buildFullContext, buildDynamicSystemPrompt, generateQuickActions } from '@/lib/ai/context-builder'
import { enhanceWithAstrology, containsAstroInsight } from '@/lib/ai/astrology-enhancer'
import { saveMessage, getOrCreateSession, updateSession, getMessageCount } from '@/lib/db/chat-queries'

// Initialize Anthropic client
const anthropic = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

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
  planets?: Record<string, { sign: string; house: number; degree: number }>
  yogas?: Array<{ name: string; description: string }>
  doshas?: Record<string, boolean>
}

// Detect if user wants meditation/breathing
function wantsMeditation(message: string): boolean {
  const keywords = [
    'breathing exercise', 'meditation', 'calm down', 'calm me',
    'help me relax', 'anxious', 'panic', 'overwhelmed', 'stressed',
    'need to breathe', 'can\'t breathe', 'grounding', 'breathing'
  ]
  return keywords.some(k => message.toLowerCase().includes(k))
}

// Call Claude with Extended Thinking using official SDK
// Uses 20,000 token thinking budget for deep reasoning as per spec
async function callClaudeWithThinking(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<{ response: string; thinking: string; tokensUsed: number }> {
  if (!anthropic) {
    throw new Error('Anthropic API not configured')
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    thinking: {
      type: 'enabled',
      budget_tokens: 20000 // 20k budget for deep reasoning
    },
    system: systemPrompt,
    messages: [
      ...messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage }
    ]
  })

  // Extract text response and thinking
  let textResponse = ''
  let thinkingProcess = ''

  for (const block of response.content) {
    if (block.type === 'text') {
      textResponse += block.text
    } else if (block.type === 'thinking') {
      thinkingProcess += block.thinking
    }
  }

  return {
    response: textResponse,
    thinking: thinkingProcess,
    tokensUsed: response.usage?.output_tokens || 0
  }
}

// Call Claude without extended thinking (fallback)
// Temperature 0.8 for more creative, varied responses
async function callClaudeBasic(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<string> {
  if (!anthropic) {
    throw new Error('Anthropic API not configured')
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    temperature: 0.8, // Higher for creative, varied responses
    system: systemPrompt,
    messages: [
      ...messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage }
    ]
  })

  const textBlock = response.content.find(block => block.type === 'text')
  return textBlock?.type === 'text' ? textBlock.text : ''
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
      userId,
      sessionId: providedSessionId,
      birthChart: rawBirthChart
    } = body
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }
    
    // Get or create session
    const session = await getOrCreateSession(userId || 'anonymous')
    const sessionId = providedSessionId || session.id
    
    // Build full context
    const context = await buildFullContext(
      userId,
      sessionId,
      message,
      history as ChatMessage[],
      rawBirthChart as UserBirthChart | null,
      userName
    )
    
    // Check for crisis - highest priority
    if (context.crisisDetected) {
      const crisisResponse = getCrisisResponse(context.crisisSeverity)
      
      // Save crisis interaction
      await saveMessage(sessionId, {
        role: 'user',
        content: message,
        emotion: context.emotionalState.emotion,
        intensity: context.emotionalState.intensity
      })
      
      await saveMessage(sessionId, {
        role: 'assistant',
        content: crisisResponse
      })
      
      return NextResponse.json({
        reply: crisisResponse,
        messageType: 'crisis-support',
        quickActions: [],
        emotion: context.emotionalState.emotion,
        intensity: context.emotionalState.intensity,
        helplines: CRISIS_HELPLINES,
        sessionId
      })
    }
    
    // Check for meditation request
    if (wantsMeditation(message)) {
      const meditationResponse = `I can sense you need some calm right now. Let me guide you through a breathing exercise to help regulate your nervous system. 🧘‍♀️

This is a 4-4-6-2 breathing pattern that activates your parasympathetic response and helps calm anxiety.`

      await saveMessage(sessionId, {
        role: 'user',
        content: message,
        emotion: context.emotionalState.emotion
      })
      
      await saveMessage(sessionId, {
        role: 'assistant',
        content: meditationResponse
      })

      return NextResponse.json({
        reply: meditationResponse,
        messageType: 'meditation',
        quickActions: [
          { id: '1', label: '🌬️ Start breathing', action: 'start_breathing' },
          { id: '2', label: '💬 Keep talking', action: 'continue_chat' }
        ],
        emotion: context.emotionalState.emotion,
        intensity: context.emotionalState.intensity,
        sessionId
      })
    }
    
    // Build system prompt with full context
    const systemPrompt = buildDynamicSystemPrompt(context)
    
    let reply: string
    let thinkingProcess: string | undefined
    let tokensUsed: number | undefined
    
    // Try AI APIs in order of preference
    const hasClaudeKey = !!process.env.ANTHROPIC_API_KEY
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY
    
    if (hasClaudeKey && anthropic) {
      try {
        // Try with extended thinking first
        const result = await callClaudeWithThinking(systemPrompt, history, message)
        reply = result.response
        thinkingProcess = result.thinking
        tokensUsed = result.tokensUsed
      } catch (thinkingError) {
        console.error('Extended thinking failed, trying basic:', thinkingError)
        try {
          // Fallback to basic Claude
          reply = await callClaudeBasic(systemPrompt, history, message)
        } catch (claudeError) {
          console.error('Claude API error:', claudeError)
          if (hasOpenAIKey) {
            try {
              reply = await callOpenAIAPI(systemPrompt, history, message)
            } catch (openAIError) {
              console.error('OpenAI API error:', openAIError)
              reply = generateFallbackResponse(message, context.emotionalState.emotion, context.sessionTheme || 'general')
            }
          } else {
            reply = generateFallbackResponse(message, context.emotionalState.emotion, context.sessionTheme || 'general')
          }
        }
      }
    } else if (hasOpenAIKey) {
      try {
        reply = await callOpenAIAPI(systemPrompt, history, message)
      } catch (error) {
        console.error('OpenAI API error:', error)
        reply = generateFallbackResponse(message, context.emotionalState.emotion, context.sessionTheme || 'general')
      }
    } else {
      // No API keys configured - use intelligent fallback
      reply = generateFallbackResponse(message, context.emotionalState.emotion, context.sessionTheme || 'general')
    }
    
    // Enhance with astrological insights if relevant
    reply = enhanceWithAstrology(reply, message, rawBirthChart as UserBirthChart | undefined)
    
    // Save messages to session
    await saveMessage(sessionId, {
      role: 'user',
      content: message,
      emotion: context.emotionalState.emotion,
      intensity: context.emotionalState.intensity
    })
    
    await saveMessage(sessionId, {
      role: 'assistant',
      content: reply,
      thinking: thinkingProcess,
      tokensUsed
    })
    
    // Update session
    await updateSession(sessionId, {
      lastActivity: new Date(),
      messagesCount: await getMessageCount(sessionId),
      sessionTheme: context.sessionTheme
    })
    
    // Generate quick actions based on context
    const quickActions = generateQuickActions(context)
    
    // Check if response has astrological content
    const hasAstro = containsAstroInsight(reply)
    
    return NextResponse.json({
      reply,
      quickActions,
      hasAstroInsight: hasAstro,
      messageType: 'text',
      emotion: context.emotionalState.emotion,
      intensity: context.emotionalState.intensity,
      sentimentScore: context.emotionalState.score,
      theme: context.sessionTheme,
      sessionId,
      timestamp: new Date().toISOString()
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

// Session creation endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId') || 'anonymous'
  
  const session = await getOrCreateSession(userId)
  
  return NextResponse.json({
    sessionId: session.id,
    startedAt: session.startedAt
  })
}
