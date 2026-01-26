import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as Blob | null
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      // Return a helpful message if no API key
      return NextResponse.json(
        { 
          error: 'Transcription service not configured',
          text: '' 
        },
        { status: 503 }
      )
    }

    // Convert blob to file for OpenAI
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Create form data for OpenAI Whisper API
    const openAIFormData = new FormData()
    
    // Create a proper File object
    const file = new File([buffer], 'audio.webm', { 
      type: audioFile.type || 'audio/webm' 
    })
    
    openAIFormData.append('file', file)
    openAIFormData.append('model', 'whisper-1')
    openAIFormData.append('language', 'en') // Default to English, can be made dynamic
    openAIFormData.append('response_format', 'json')
    openAIFormData.append('temperature', '0')
    
    // Optional: Add prompt for better accuracy with astrology terms
    openAIFormData.append('prompt', 'This is a conversation about Vedic astrology, horoscopes, kundli, birth charts, planets, zodiac signs, and emotional wellness.')

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: openAIFormData
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Whisper API error:', errorData)
      return NextResponse.json(
        { error: 'Transcription failed', details: errorData },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      text: data.text || '',
      duration: data.duration,
      language: data.language
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Limit file size to 25MB (Whisper API limit)
export const config = {
  api: {
    bodyParser: false
  }
}
