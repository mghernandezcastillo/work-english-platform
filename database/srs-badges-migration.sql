-- ============================================================
-- Migration: Add SRS columns to saved_words + new badges
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lolbqtlnrbknbipxfmak/sql
-- ============================================================

-- 1. Add SRS columns to saved_words
ALTER TABLE saved_words
  ADD COLUMN IF NOT EXISTS ease_factor    FLOAT       DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS review_count   INTEGER     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS interval       INTEGER     DEFAULT 1,
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Index for efficient SRS queries
CREATE INDEX IF NOT EXISTS idx_saved_words_review
  ON saved_words (user_id, next_review_at);

-- 3. New badge: Velocista
INSERT INTO badge_definitions (name, emoji, description, condition_type, condition_value, xp_reward)
VALUES ('Velocista', '⚡', 'Completaste un ejercicio de emparejamiento en menos de 30 segundos', 'match_fast', 1, 10)
ON CONFLICT (name) DO NOTHING;

-- 4. New badge: Sin Errores
INSERT INTO badge_definitions (name, emoji, description, condition_type, condition_value, xp_reward)
VALUES ('Sin Errores', '💎', 'Completaste todos los ejercicios de una lección sin errores', 'perfect_exercises', 1, 15)
ON CONFLICT (name) DO NOTHING;
