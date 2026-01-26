export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'read' | 'error'
  quickActions?: QuickAction[]
  hasAstroInsight?: boolean
  messageType?: 'text' | 'meditation' | 'chart-insight' | 'crisis-support'
  metadata?: Record<string, any>
}

export interface QuickAction {
  id: string
  label: string
  action: string
  data?: Record<string, any>
}

export interface ChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isTyping: boolean
  isRecording: boolean
  unreadCount: number
  showSuggestions: boolean
  suggestions: Suggestion[]
  userProfile?: UserProfile
  conversationId?: string
}

export interface Suggestion {
  id: string
  text: string
  category?: string
}

export interface UserProfile {
  name?: string
  birthDate?: string
  birthTime?: string
  birthPlace?: string
  zodiacSign?: string
  moonSign?: string
  ascendant?: string
  hasCompletedOnboarding: boolean
}

export interface MeditationData {
  title: string
  duration: number
  breathPhases: { phase: string; duration: number }[]
}

export interface CrisisResource {
  name: string
  phone: string
  available: string
  description?: string
  website?: string
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  { name: 'AASRA India', phone: '9820466726', available: '24/7', description: 'Suicide prevention helpline', website: 'http://www.aasra.info' },
  { name: 'Vandrevala Foundation', phone: '1860-266-2345', available: '24/7', description: 'Mental health support', website: 'https://www.vandrevalafoundation.com' },
  { name: 'iCall', phone: '9152987821', available: 'Mon-Sat, 8am-10pm', description: 'Psychosocial helpline', website: 'https://icallhelpline.org' },
]

export const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: '1', text: "What does my day look like?", category: 'daily' },
  { id: '2', text: "I'm feeling anxious today", category: 'emotional' },
  { id: '3', text: "Tell me about my moon sign", category: 'astrology' },
  { id: '4', text: "Guide me through a meditation", category: 'wellness' },
  { id: '5', text: "What planetary transits affect me?", category: 'astrology' },
]
