import { NextRequest, NextResponse } from 'next/server'
import { createSession, getOrCreateSession, getUserSessions } from '@/lib/db/chat-queries'

// Create a new chat session
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }
    
    const session = await createSession(userId)
    
    return NextResponse.json({
      sessionId: session.id,
      startedAt: session.startedAt,
      isActive: session.isActive
    })
    
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// Get existing sessions for a user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }
    
    const sessions = await getUserSessions(userId)
    
    return NextResponse.json({
      sessions: sessions.map(s => ({
        id: s.id,
        startedAt: s.startedAt,
        lastActivity: s.lastActivity,
        messagesCount: s.messagesCount,
        isActive: s.isActive,
        theme: s.sessionTheme
      }))
    })
    
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to get sessions' },
      { status: 500 }
    )
  }
}
