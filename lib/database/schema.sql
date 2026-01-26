-- Jyoti AI Chatbot Database Schema
-- PostgreSQL / Supabase
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  preferred_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  
  -- Birth details for astrology
  birth_date DATE,
  birth_time TIME,
  birth_place TEXT,
  birth_latitude DECIMAL(10, 7),
  birth_longitude DECIMAL(10, 7),
  timezone TEXT DEFAULT 'Asia/Kolkata',
  
  -- Preferences
  language TEXT DEFAULT 'en',
  notification_enabled BOOLEAN DEFAULT true,
  daily_horoscope_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHAT SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Session metadata
  title TEXT,
  summary TEXT,
  
  -- Emotional tracking
  initial_emotion TEXT,
  final_emotion TEXT,
  average_sentiment DECIMAL(3, 2), -- -1.00 to 1.00
  
  -- Themes covered
  themes TEXT[] DEFAULT '{}',
  
  -- Astrology context used
  birth_chart_used BOOLEAN DEFAULT false,
  transits_discussed BOOLEAN DEFAULT false,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived'))
);

-- Index for efficient queries
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_started ON chat_sessions(started_at DESC);

-- ============================================
-- CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- AI analysis
  emotion TEXT,
  emotion_intensity TEXT CHECK (emotion_intensity IN ('low', 'medium', 'high', 'very_high')),
  sentiment_score DECIMAL(3, 2), -- -1.00 to 1.00
  themes TEXT[] DEFAULT '{}',
  
  -- Special message types
  message_type TEXT DEFAULT 'text' CHECK (message_type IN (
    'text', 'meditation', 'breathing', 'crisis-support', 'astro-insight', 'quick-action'
  )),
  
  -- Metadata
  tokens_used INTEGER,
  model_used TEXT,
  response_time_ms INTEGER,
  
  -- User feedback
  helpful_rating INTEGER CHECK (helpful_rating >= 1 AND helpful_rating <= 5),
  user_feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_emotion ON chat_messages(emotion);

-- ============================================
-- MOOD ENTRIES (Daily mood tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Mood data
  mood TEXT NOT NULL CHECK (mood IN (
    'excellent', 'good', 'neutral', 'low', 'very_low', 'anxious', 'stressed', 'calm', 'happy', 'sad'
  )),
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  
  -- Additional tracking
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  
  -- Context
  notes TEXT,
  activities TEXT[] DEFAULT '{}',
  triggers TEXT[] DEFAULT '{}',
  
  -- Astrological context
  moon_phase TEXT,
  moon_sign TEXT,
  planetary_aspects TEXT[] DEFAULT '{}',
  
  -- Timestamps
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_time TIME DEFAULT CURRENT_TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_date ON mood_entries(entry_date DESC);
CREATE INDEX idx_mood_entries_mood ON mood_entries(mood);
CREATE UNIQUE INDEX idx_mood_entries_user_date ON mood_entries(user_id, entry_date);

-- ============================================
-- USER GOALS
-- ============================================
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Goal details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'career', 'relationship', 'health', 'spiritual', 'financial', 'personal', 'family', 'education'
  )),
  
  -- Progress tracking
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  milestones JSONB DEFAULT '[]',
  
  -- Astrological timing
  favorable_periods JSONB DEFAULT '[]',
  recommended_remedies TEXT[] DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_user_goals_user ON user_goals(user_id);
CREATE INDEX idx_user_goals_status ON user_goals(status);
CREATE INDEX idx_user_goals_category ON user_goals(category);

-- ============================================
-- MEDITATION SESSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  
  -- Session details
  type TEXT NOT NULL CHECK (type IN (
    'breathing', 'guided', 'body-scan', 'loving-kindness', 'visualization', 'grounding', 'mantra'
  )),
  technique TEXT, -- e.g., '4-4-6-2 breathing', 'box breathing'
  
  -- Duration
  duration_seconds INTEGER NOT NULL,
  target_duration_seconds INTEGER,
  
  -- Pre/post mood
  mood_before TEXT,
  mood_before_score INTEGER CHECK (mood_before_score >= 1 AND mood_before_score <= 10),
  mood_after TEXT,
  mood_after_score INTEGER CHECK (mood_after_score >= 1 AND mood_after_score <= 10),
  
  -- Metrics
  cycles_completed INTEGER,
  heart_rate_before INTEGER,
  heart_rate_after INTEGER,
  
  -- User feedback
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  notes TEXT,
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_meditation_sessions_user ON meditation_sessions(user_id);
CREATE INDEX idx_meditation_sessions_type ON meditation_sessions(type);
CREATE INDEX idx_meditation_sessions_started ON meditation_sessions(started_at DESC);

-- ============================================
-- CHATBOT FEEDBACK
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  
  -- Feedback
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT CHECK (category IN (
    'accuracy', 'helpfulness', 'empathy', 'astrology', 'response-quality', 'other'
  )),
  feedback_text TEXT,
  
  -- Was the response
  was_helpful BOOLEAN,
  was_accurate BOOLEAN,
  was_empathetic BOOLEAN,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chatbot_feedback_user ON chatbot_feedback(user_id);
CREATE INDEX idx_chatbot_feedback_rating ON chatbot_feedback(rating);

-- ============================================
-- CRISIS INTERVENTIONS (For safety tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS crisis_interventions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  
  -- Crisis details
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  detected_keywords TEXT[] DEFAULT '{}',
  trigger_message TEXT,
  
  -- Response
  response_provided TEXT,
  helplines_shown TEXT[] DEFAULT '{}',
  
  -- Follow-up
  followed_up BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  
  -- Timestamps
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Index for safety monitoring
CREATE INDEX idx_crisis_interventions_severity ON crisis_interventions(severity);
CREATE INDEX idx_crisis_interventions_detected ON crisis_interventions(detected_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_interventions ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can only access their own profile
CREATE POLICY user_profiles_policy ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Chat sessions: Users can only access their own sessions
CREATE POLICY chat_sessions_policy ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chat messages: Users can access messages from their sessions
CREATE POLICY chat_messages_policy ON chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

-- Mood entries: Users can only access their own entries
CREATE POLICY mood_entries_policy ON mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- User goals: Users can only access their own goals
CREATE POLICY user_goals_policy ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Meditation sessions: Users can only access their own sessions
CREATE POLICY meditation_sessions_policy ON meditation_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Chatbot feedback: Users can access their own feedback
CREATE POLICY chatbot_feedback_policy ON chatbot_feedback
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's mood trend
CREATE OR REPLACE FUNCTION get_mood_trend(p_user_id UUID, p_days INTEGER DEFAULT 7)
RETURNS TABLE (
  entry_date DATE,
  mood TEXT,
  mood_score INTEGER,
  avg_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    me.entry_date,
    me.mood,
    me.mood_score,
    AVG(me.mood_score) OVER (ORDER BY me.entry_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as avg_score
  FROM mood_entries me
  WHERE me.user_id = p_user_id
    AND me.entry_date >= CURRENT_DATE - p_days
  ORDER BY me.entry_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get chat session summary
CREATE OR REPLACE FUNCTION get_session_stats(p_user_id UUID)
RETURNS TABLE (
  total_sessions BIGINT,
  total_messages BIGINT,
  avg_session_messages DECIMAL,
  most_common_theme TEXT,
  total_meditations BIGINT,
  avg_mood_improvement DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT cs.id) as total_sessions,
    COUNT(cm.id) as total_messages,
    ROUND(COUNT(cm.id)::DECIMAL / NULLIF(COUNT(DISTINCT cs.id), 0), 2) as avg_session_messages,
    (SELECT unnest(themes) as t FROM chat_sessions WHERE user_id = p_user_id GROUP BY t ORDER BY COUNT(*) DESC LIMIT 1) as most_common_theme,
    (SELECT COUNT(*) FROM meditation_sessions WHERE user_id = p_user_id) as total_meditations,
    (SELECT AVG(mood_after_score - mood_before_score) FROM meditation_sessions WHERE user_id = p_user_id AND mood_after_score IS NOT NULL) as avg_mood_improvement
  FROM chat_sessions cs
  LEFT JOIN chat_messages cm ON cs.id = cm.session_id
  WHERE cs.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
/*
-- Uncomment to insert sample data

-- Sample mood entries for testing
INSERT INTO mood_entries (user_id, mood, mood_score, energy_level, sleep_quality, stress_level, entry_date)
SELECT 
  'your-user-uuid-here',
  (ARRAY['good', 'neutral', 'excellent', 'low', 'calm'])[floor(random() * 5 + 1)],
  floor(random() * 6 + 4)::INTEGER,
  floor(random() * 10 + 1)::INTEGER,
  floor(random() * 10 + 1)::INTEGER,
  floor(random() * 7 + 1)::INTEGER,
  CURRENT_DATE - (generate_series(1, 30))
ON CONFLICT (user_id, entry_date) DO NOTHING;
*/

-- ============================================
-- GRANTS (For Supabase anon/authenticated roles)
-- ============================================

-- Grant access to authenticated users
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON chat_sessions TO authenticated;
GRANT ALL ON chat_messages TO authenticated;
GRANT ALL ON mood_entries TO authenticated;
GRANT ALL ON user_goals TO authenticated;
GRANT ALL ON meditation_sessions TO authenticated;
GRANT ALL ON chatbot_feedback TO authenticated;
GRANT ALL ON crisis_interventions TO authenticated;

-- Grant access to service role for admin operations
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
