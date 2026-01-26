import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ChatMessage, ChatState, Suggestion, UserProfile, DEFAULT_SUGGESTIONS } from './chat-types'

interface ChatStore extends ChatState {
  // Actions
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  setTyping: (isTyping: boolean) => void
  setRecording: (isRecording: boolean) => void
  clearMessages: () => void
  markAllRead: () => void
  setSuggestions: (suggestions: Suggestion[]) => void
  setShowSuggestions: (show: boolean) => void
  setUserProfile: (profile: Partial<UserProfile>) => void
  setConversationId: (id: string) => void
  incrementUnread: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isOpen: false,
      isTyping: false,
      isRecording: false,
      unreadCount: 0,
      showSuggestions: true,
      suggestions: DEFAULT_SUGGESTIONS,
      userProfile: undefined,
      conversationId: undefined,

      // Actions
      toggleChat: () => set((state) => ({ 
        isOpen: !state.isOpen,
        unreadCount: !state.isOpen ? 0 : state.unreadCount
      })),
      
      openChat: () => set({ isOpen: true, unreadCount: 0 }),
      
      closeChat: () => set({ isOpen: false }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
        unreadCount: message.role === 'assistant' && !state.isOpen 
          ? state.unreadCount + 1 
          : state.unreadCount,
        showSuggestions: false
      })),
      
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...updates } : msg
        )
      })),
      
      setTyping: (isTyping) => set({ isTyping }),
      
      setRecording: (isRecording) => set({ isRecording }),
      
      clearMessages: () => set({ 
        messages: [], 
        showSuggestions: true,
        suggestions: DEFAULT_SUGGESTIONS
      }),
      
      markAllRead: () => set({ unreadCount: 0 }),
      
      setSuggestions: (suggestions) => set({ suggestions }),
      
      setShowSuggestions: (showSuggestions) => set({ showSuggestions }),
      
      setUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile } as UserProfile
      })),
      
      setConversationId: (conversationId) => set({ conversationId }),
      
      incrementUnread: () => set((state) => ({ 
        unreadCount: state.unreadCount + 1 
      })),
    }),
    {
      name: 'jyoti-chat-storage',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep last 50 messages
        userProfile: state.userProfile,
        conversationId: state.conversationId,
      }),
    }
  )
)
