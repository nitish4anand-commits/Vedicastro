// Chat Database Queries for Jyoti AI Chatbot
// These work with the schema defined in lib/database/schema.sql

// For now, using localStorage as a simple persistence layer
// In production, replace with actual Supabase/PostgreSQL queries

interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant'
  content: string
  emotion?: string
  intensity?: number
  sentimentScore?: number
  thinking?: string
  tokensUsed?: number
  createdAt: Date
}

interface ChatSession {
  id: string
  userId: string
  startedAt: Date
  lastActivity: Date
  isActive: boolean
  messagesCount: number
  sessionTheme?: string
}

// In-memory store (replace with database in production)
const sessions: Map<string, ChatSession> = new Map()
const messages: Map<string, ChatMessage[]> = new Map()

/**
 * Create a new chat session
 */
export async function createSession(userId: string): Promise<ChatSession> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const session: ChatSession = {
    id: sessionId,
    userId,
    startedAt: new Date(),
    lastActivity: new Date(),
    isActive: true,
    messagesCount: 0
  }
  
  sessions.set(sessionId, session)
  messages.set(sessionId, [])
  
  return session
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(
  sessionId: string,
  limit: number = 10
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const sessionMessages = messages.get(sessionId) || []
  
  return sessionMessages
    .slice(-limit)
    .map(msg => ({
      role: msg.role,
      content: msg.content
    }))
}

/**
 * Save a message to the session
 */
export async function saveMessage(
  sessionId: string,
  data: {
    role: 'user' | 'assistant'
    content: string
    emotion?: string
    intensity?: number
    thinking?: string
    tokensUsed?: number
  }
): Promise<ChatMessage> {
  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    role: data.role,
    content: data.content,
    emotion: data.emotion,
    intensity: data.intensity,
    thinking: data.thinking,
    tokensUsed: data.tokensUsed,
    createdAt: new Date()
  }
  
  const sessionMessages = messages.get(sessionId) || []
  sessionMessages.push(message)
  messages.set(sessionId, sessionMessages)
  
  // Update session
  const session = sessions.get(sessionId)
  if (session) {
    session.lastActivity = new Date()
    session.messagesCount = sessionMessages.length
    sessions.set(sessionId, session)
  }
  
  return message
}

/**
 * Update session metadata
 */
export async function updateSession(
  sessionId: string,
  data: Partial<ChatSession>
): Promise<void> {
  const session = sessions.get(sessionId)
  if (session) {
    Object.assign(session, data)
    sessions.set(sessionId, session)
  }
}

/**
 * Get message count for a session
 */
export async function getMessageCount(sessionId: string): Promise<number> {
  return messages.get(sessionId)?.length || 0
}

/**
 * Get or create active session for user
 */
export async function getOrCreateSession(userId: string): Promise<ChatSession> {
  // Find existing active session
  for (const session of sessions.values()) {
    if (session.userId === userId && session.isActive) {
      // Check if session is recent (within last 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      if (session.lastActivity > thirtyMinutesAgo) {
        return session
      }
    }
  }
  
  // Create new session
  return await createSession(userId)
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string): Promise<ChatSession[]> {
  return Array.from(sessions.values())
    .filter(s => s.userId === userId)
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
}

/**
 * Close a session
 */
export async function closeSession(sessionId: string): Promise<void> {
  const session = sessions.get(sessionId)
  if (session) {
    session.isActive = false
    sessions.set(sessionId, session)
  }
}

/**
 * Rate a message
 */
export async function rateMessage(
  messageId: string,
  rating: number
): Promise<void> {
  for (const sessionMessages of messages.values()) {
    const message = sessionMessages.find(m => m.id === messageId)
    if (message) {
      // In production, save to database
      console.log(`Message ${messageId} rated: ${rating}/5`)
      break
    }
  }
}

/**
 * Get session statistics
 */
export async function getSessionStats(userId: string): Promise<{
  totalSessions: number
  totalMessages: number
  avgMessagesPerSession: number
}> {
  const userSessions = Array.from(sessions.values())
    .filter(s => s.userId === userId)
  
  const totalMessages = userSessions.reduce((sum, s) => sum + s.messagesCount, 0)
  
  return {
    totalSessions: userSessions.length,
    totalMessages,
    avgMessagesPerSession: userSessions.length > 0 
      ? totalMessages / userSessions.length 
      : 0
  }
}

// ============================================
// SUPABASE IMPLEMENTATION (for production)
// ============================================

/*
// Uncomment and use when Supabase is configured

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createSessionSupabase(userId: string): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      started_at: new Date().toISOString(),
      is_active: true
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getConversationHistorySupabase(
  sessionId: string,
  limit: number = 10
): Promise<Array<{ role: string; content: string }>> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

export async function saveMessageSupabase(
  sessionId: string,
  data: any
): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role: data.role,
      content: data.content,
      emotion: data.emotion,
      sentiment_score: data.sentimentScore,
      intensity: data.intensity,
      thinking: data.thinking,
      tokens_used: data.tokensUsed
    })
  
  if (error) throw error
}
*/
