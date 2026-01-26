'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Square, Loader2 } from 'lucide-react'

interface VoiceInputProps {
  onTranscription: (text: string) => void
  disabled?: boolean
}

type RecordingState = 'idle' | 'recording' | 'processing' | 'error'

export function VoiceInput({ onTranscription, disabled = false }: VoiceInputProps) {
  const [state, setState] = useState<RecordingState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const processAudio = useCallback(async (audioBlob: Blob) => {
    setState('processing')
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Transcription failed')
      }
      
      const data = await response.json()
      
      if (data.text && data.text.trim()) {
        onTranscription(data.text.trim())
        setState('idle')
      } else {
        setError('Could not understand audio. Please try again.')
        setState('error')
        setTimeout(() => setState('idle'), 2000)
      }
      
    } catch (err) {
      console.error('Transcription error:', err)
      setError('Transcription failed. Please try typing instead.')
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }, [onTranscription])

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      })
      
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        })
        
        streamRef.current?.getTracks().forEach(track => track.stop())
        
        await processAudio(audioBlob)
      }
      
      mediaRecorder.start(100)
      setState('recording')
      setDuration(0)
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording()
        }
      }, 60000)
      
    } catch (err) {
      console.error('Microphone access error:', err)
      setError('Could not access microphone. Please check permissions.')
      setState('error')
    }
  }, [processAudio, stopRecording])

  const handleClick = () => {
    if (disabled) return
    
    if (state === 'recording') {
      stopRecording()
    } else if (state === 'idle') {
      startRecording()
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={handleClick}
        disabled={disabled || state === 'processing'}
        className={`
          relative p-3 rounded-full transition-all duration-200
          ${state === 'recording' 
            ? 'bg-red-500 hover:bg-red-600' 
            : state === 'processing'
            ? 'bg-purple-500/50'
            : state === 'error'
            ? 'bg-orange-500/50'
            : 'bg-purple-600/30 hover:bg-purple-600/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={
          state === 'recording' ? 'Stop recording' :
          state === 'processing' ? 'Processing...' :
          'Voice input'
        }
      >
        <AnimatePresence mode="wait">
          {state === 'recording' && (
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Square className="w-5 h-5 text-white fill-white" />
            </motion.div>
          )}
          
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </motion.div>
          )}
          
          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff className="w-5 h-5 text-white" />
            </motion.div>
          )}
          
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="w-5 h-5 text-purple-300" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Recording pulse animation */}
        {state === 'recording' && (
          <>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-red-500"
            />
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-red-500"
            />
          </>
        )}
      </motion.button>
      
      {/* Duration display */}
      <AnimatePresence>
        {state === 'recording' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-red-500/80 text-xs text-white font-mono whitespace-nowrap"
          >
            🔴 {formatDuration(duration)}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error tooltip */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-orange-500/90 text-xs text-white max-w-xs text-center whitespace-nowrap"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
