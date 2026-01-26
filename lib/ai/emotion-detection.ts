// Emotion Detection System for Jyoti AI Chatbot

export interface EmotionalAnalysis {
  emotion: string
  intensity: number // 1-10
  score: number // -1 to 1 (sentiment)
  keywords: string[]
  needsSupport: boolean
}

export interface CrisisResult {
  isCrisis: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  keywords: string[]
}

// Emotion patterns with keywords and base intensity
const emotionPatterns: Record<string, { keywords: string[]; intensity: number; isNegative: boolean }> = {
  anxiety: {
    keywords: ['anxious', 'worried', 'nervous', 'panic', 'scared', 'fear', 'frightened', 'terrified', 'dread', 'uneasy', 'tense', 'restless', 'on edge'],
    intensity: 7,
    isNegative: true
  },
  sadness: {
    keywords: ['sad', 'depressed', 'hopeless', 'crying', 'down', 'miserable', 'heartbroken', 'devastated', 'grief', 'sorrow', 'melancholy', 'despair'],
    intensity: 8,
    isNegative: true
  },
  anger: {
    keywords: ['angry', 'frustrated', 'furious', 'hate', 'irritated', 'pissed', 'annoyed', 'rage', 'mad', 'resentful', 'bitter'],
    intensity: 7,
    isNegative: true
  },
  joy: {
    keywords: ['happy', 'excited', 'great', 'wonderful', 'amazing', 'joy', 'thrilled', 'blessed', 'elated', 'ecstatic', 'delighted'],
    intensity: 5,
    isNegative: false
  },
  confusion: {
    keywords: ['confused', 'lost', "don't know", 'uncertain', 'unclear', 'stuck', 'bewildered', 'perplexed', 'unsure'],
    intensity: 6,
    isNegative: true
  },
  stress: {
    keywords: ['stressed', 'overwhelmed', 'too much', "can't handle", 'pressure', 'burden', 'exhausted', 'burnt out', 'drained'],
    intensity: 8,
    isNegative: true
  },
  loneliness: {
    keywords: ['lonely', 'alone', 'isolated', 'nobody', 'no one', 'by myself', 'abandoned', 'neglected', 'disconnected'],
    intensity: 7,
    isNegative: true
  },
  gratitude: {
    keywords: ['grateful', 'thankful', 'blessed', 'appreciate', 'thank you', 'fortunate', 'lucky'],
    intensity: 4,
    isNegative: false
  },
  hope: {
    keywords: ['hope', 'hopeful', 'optimistic', 'looking forward', 'better', 'positive', 'encouraged'],
    intensity: 5,
    isNegative: false
  },
  love: {
    keywords: ['love', 'adore', 'cherish', 'affection', 'care deeply', 'devoted'],
    intensity: 6,
    isNegative: false
  },
  guilt: {
    keywords: ['guilty', 'shame', 'ashamed', 'regret', 'remorse', 'blame myself', 'my fault'],
    intensity: 7,
    isNegative: true
  },
  jealousy: {
    keywords: ['jealous', 'envious', 'envy', 'resentful', 'covet'],
    intensity: 6,
    isNegative: true
  }
}

// Intensifier words that increase emotion intensity
const intensifiers = ['very', 'extremely', 'so', 'really', 'incredibly', 'absolutely', 'totally', 'completely', 'deeply', 'terribly']

// Diminisher words that decrease emotion intensity
const diminishers = ['slightly', 'a bit', 'somewhat', 'kind of', 'a little', 'mildly']

// Positive and negative word lists for sentiment analysis
const positiveWords = ['good', 'great', 'happy', 'love', 'wonderful', 'amazing', 'blessed', 'grateful', 'hope', 'beautiful', 'joy', 'peace', 'calm', 'success', 'proud']
const negativeWords = ['bad', 'awful', 'hate', 'terrible', 'horrible', 'worst', 'pain', 'hurt', 'sad', 'angry', 'fail', 'fear', 'ugly', 'stupid', 'wrong']

/**
 * Analyze the emotional content of a message
 */
export function analyzeEmotion(message: string): EmotionalAnalysis {
  const text = message.toLowerCase()
  
  // Detect primary emotion
  let detectedEmotion = 'neutral'
  let maxCount = 0
  let totalIntensity = 5
  const foundKeywords: string[] = []
  let isNegativeEmotion = false
  
  for (const [emotion, data] of Object.entries(emotionPatterns)) {
    const matches = data.keywords.filter(keyword => text.includes(keyword))
    if (matches.length > maxCount) {
      maxCount = matches.length
      detectedEmotion = emotion
      totalIntensity = data.intensity
      isNegativeEmotion = data.isNegative
      foundKeywords.length = 0
      foundKeywords.push(...matches)
    } else if (matches.length > 0 && matches.length === maxCount) {
      // Multiple emotions detected - prioritize negative ones
      if (data.isNegative && !isNegativeEmotion) {
        detectedEmotion = emotion
        totalIntensity = data.intensity
        isNegativeEmotion = data.isNegative
        foundKeywords.push(...matches)
      }
    }
  }
  
  // Calculate sentiment score
  const positiveCount = positiveWords.filter(w => text.includes(w)).length
  const negativeCount = negativeWords.filter(w => text.includes(w)).length
  const sentimentScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1)
  
  // Adjust intensity based on intensifiers/diminishers
  const hasIntensifier = intensifiers.some(word => text.includes(word))
  const hasDiminisher = diminishers.some(word => text.includes(word))
  
  if (hasIntensifier) totalIntensity = Math.min(10, totalIntensity + 2)
  if (hasDiminisher) totalIntensity = Math.max(1, totalIntensity - 2)
  
  // Check for multiple exclamation marks (increases intensity)
  const exclamationCount = (message.match(/!/g) || []).length
  if (exclamationCount >= 2) totalIntensity = Math.min(10, totalIntensity + 1)
  
  // Check for ALL CAPS (increases intensity)
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length
  if (capsRatio > 0.5 && message.length > 10) totalIntensity = Math.min(10, totalIntensity + 1)
  
  // Determine if user needs emotional support
  const needsSupport = isNegativeEmotion && totalIntensity >= 6
  
  return {
    emotion: detectedEmotion,
    intensity: totalIntensity,
    score: sentimentScore,
    keywords: foundKeywords,
    needsSupport
  }
}

// Crisis detection keywords organized by severity
const crisisKeywords = {
  critical: [
    'kill myself', 'suicide', 'suicidal', 'end it all', 'want to die',
    'better off dead', 'no point in living', 'end my life', 'take my life'
  ],
  high: [
    'hurt myself', 'harm myself', 'self harm', 'cutting', 'cut myself',
    'overdose', "can't go on", "can't take it anymore", 'give up on life'
  ],
  medium: [
    'want to disappear', 'wish I was dead', "don't want to exist",
    'no reason to live', 'everyone would be better without me', 'hopeless'
  ],
  low: [
    'feel like dying', "can't cope", 'falling apart', 'nothing matters',
    'worthless', 'no way out'
  ]
}

/**
 * Detect if message contains crisis indicators
 */
export function detectCrisis(message: string, emotional: EmotionalAnalysis): CrisisResult {
  const text = message.toLowerCase()
  
  // Check for direct crisis keywords
  for (const keyword of crisisKeywords.critical) {
    if (text.includes(keyword)) {
      return { isCrisis: true, severity: 'critical', keywords: [keyword] }
    }
  }
  
  for (const keyword of crisisKeywords.high) {
    if (text.includes(keyword)) {
      return { isCrisis: true, severity: 'high', keywords: [keyword] }
    }
  }
  
  for (const keyword of crisisKeywords.medium) {
    if (text.includes(keyword)) {
      return { isCrisis: true, severity: 'medium', keywords: [keyword] }
    }
  }
  
  // Check for high intensity negative emotions combined with hopelessness keywords
  if (emotional.intensity >= 9 && emotional.emotion === 'sadness') {
    for (const keyword of crisisKeywords.low) {
      if (text.includes(keyword)) {
        return { isCrisis: true, severity: 'medium', keywords: [keyword] }
      }
    }
  }
  
  return { isCrisis: false, severity: 'low', keywords: [] }
}

// Crisis helplines for India
export const CRISIS_HELPLINES = [
  { name: 'AASRA India', phone: '9820466726', available: '24/7', description: 'Crisis intervention center' },
  { name: 'Vandrevala Foundation', phone: '1860-2662-345', available: '24/7', description: 'Mental health support' },
  { name: 'iCall', phone: '9152987821', available: 'Mon-Sat, 8AM-10PM', description: 'Psychosocial helpline' },
  { name: 'Snehi', phone: '91-22-27546669', available: '24/7', description: 'Emotional support' },
  { name: 'NIMHANS', phone: '080-46110007', available: '24/7', description: 'National institute helpline' }
]

/**
 * Generate crisis response message
 */
export function getCrisisResponse(severity: 'low' | 'medium' | 'high' | 'critical'): string {
  if (severity === 'critical' || severity === 'high') {
    return `I'm really concerned about what you just shared. Your safety is the most important thing right now, and I want you to know that you matter deeply.

Please, reach out to one of these helplines immediately:

🆘 **AASRA India**: 9820466726 (24/7)
🆘 **Vandrevala Foundation**: 1860-2662-345 (24/7)
🆘 **iCall**: 9152987821 (Mon-Sat, 8AM-10PM)

These are trained counselors who can support you better than I can right now. The calls are free and confidential.

Is there someone you trust - a friend, family member, anyone - who can be with you right now? Please don't go through this alone.

I'm here with you. Will you call one of these numbers? 💜`
  }
  
  return `I hear that you're going through something really difficult right now. Your feelings are valid, and I'm glad you're sharing them with me.

I want you to know that support is available:

🆘 **AASRA India**: 9820466726 (24/7)
🆘 **Vandrevala Foundation**: 1860-2662-345 (24/7)

Sometimes talking to a trained counselor can help when things feel overwhelming. Would you like to talk more about what you're experiencing? I'm here to listen. 💜`
}

/**
 * Detect conversation theme based on message content
 */
export function detectConversationTheme(currentMessage: string, history: { content: string }[] = []): string {
  const recentMessages = [
    ...history.slice(-3).map(m => m.content),
    currentMessage
  ].join(' ').toLowerCase()
  
  const themes: Record<string, RegExp> = {
    career: /\b(job|work|career|profession|business|office|boss|colleague|promotion|salary|interview|resign|fired)\b/gi,
    relationship: /\b(love|relationship|marriage|partner|dating|boyfriend|girlfriend|spouse|husband|wife|breakup|divorce|crush)\b/gi,
    family: /\b(family|parents|children|mother|father|sibling|brother|sister|kid|son|daughter|in-laws)\b/gi,
    health: /\b(health|sick|illness|pain|doctor|medical|body|tired|energy|sleep|anxiety|depression)\b/gi,
    finance: /\b(money|finance|wealth|income|debt|loan|investment|rich|poor|salary|savings|expenses)\b/gi,
    education: /\b(study|education|exam|college|school|learning|degree|course|grades|admission)\b/gi,
    spiritual: /\b(spiritual|meditation|purpose|meaning|soul|enlighten|divine|karma|dharma|moksha)\b/gi,
    astrology: /\b(chart|kundli|horoscope|dasha|transit|planet|rashi|nakshatra|yoga|dosha)\b/gi
  }
  
  let maxMatches = 0
  let detectedTheme = 'general'
  
  for (const [theme, pattern] of Object.entries(themes)) {
    const matches = recentMessages.match(pattern)
    if (matches && matches.length > maxMatches) {
      maxMatches = matches.length
      detectedTheme = theme
    }
  }
  
  return detectedTheme
}
