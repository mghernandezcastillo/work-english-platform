import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './Flashcards.css'

// ── SM-2 simplified algorithm ──────────────────────────
// quality: 0=blackout, 1=wrong, 2=hard, 3=ok, 4=easy, 5=perfect
function sm2(card, quality) {
  let { ease_factor = 2.5, review_count = 0, interval = 1 } = card

  if (quality >= 3) {
    if (review_count === 0) interval = 1
    else if (review_count === 1) interval = 6
    else interval = Math.round(interval * ease_factor)

    ease_factor = Math.max(1.3, ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    review_count++
  } else {
    // Failed — reset
    review_count = 0
    interval = 1
    ease_factor = Math.max(1.3, ease_factor - 0.2)
  }

  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    ease_factor: parseFloat(ease_factor.toFixed(2)),
    review_count,
    interval,
    next_review_at: next.toISOString(),
  }
}

// ──────────────────────────────────────────────────────
function FlipCard({ word, onRate }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="fc-card-scene" onClick={() => setFlipped(f => !f)}>
      <div className={`fc-card ${flipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="fc-card-face fc-front">
          <p className="fc-hint">Toca para ver significado</p>
          <h2 className="fc-word">{word.word}</h2>
          <p className="fc-pos">{word.part_of_speech}</p>
        </div>
        {/* Back */}
        <div className="fc-card-face fc-back">
          <h2 className="fc-translation">{word.translation}</h2>
          {word.example_en && (
            <p className="fc-example">"{word.example_en}"</p>
          )}
          {word.example_es && (
            <p className="fc-example-es">"{word.example_es}"</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────
export default function Flashcards() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })
  const [rating, setRating] = useState(false) // prevent double-tap

  useEffect(() => { loadCards() }, [profile?.id])

  async function loadCards() {
    if (!profile?.id) return
    try {
      // Ensure SRS columns exist via upsert check
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('saved_words')
        .select('*')
        .eq('user_id', profile.id)
        .or(`next_review_at.is.null,next_review_at.lte.${now}`)
        .order('next_review_at', { ascending: true, nullsFirst: true })
        .limit(20)

      setCards(data || [])
    } catch (err) {
      console.error('Flashcards load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const rateCard = useCallback(async (quality) => {
    if (rating) return
    setRating(true)

    const card = cards[currentIdx]
    if (!card) return

    const updated = sm2(card, quality)
    const isCorrect = quality >= 3

    setSessionStats(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1
    }))

    try {
      await supabase.from('saved_words').update({
        ease_factor: updated.ease_factor,
        review_count: updated.review_count,
        next_review_at: updated.next_review_at,
      }).eq('id', card.id)
    } catch (err) {
      console.error('Update error:', err)
    }

    const next = currentIdx + 1
    if (next >= cards.length) {
      setSessionDone(true)
    } else {
      setCurrentIdx(next)
    }

    setTimeout(() => setRating(false), 200)
  }, [cards, currentIdx, rating])

  const currentCard = cards[currentIdx]
  const progress = cards.length > 0 ? ((currentIdx) / cards.length) * 100 : 0

  // ── Loading ──
  if (loading) {
    return (
      <div className="fc-container animate-fadeIn">
        <div className="fc-loading">
          <div className="fc-loading-spinner" />
          <p>Cargando tus tarjetas…</p>
        </div>
      </div>
    )
  }

  // ── No cards ──
  if (!cards.length) {
    return (
      <div className="fc-container animate-fadeIn">
        <div className="fc-empty">
          <span className="fc-empty-icon">📚</span>
          <h2>Sin tarjetas pendientes</h2>
          <p>Guarda palabras desde las lecciones para practicarlas aquí.</p>
          <p className="fc-empty-sub">Las palabras aparecen cuando es hora de repasarlas — el sistema decide cuándo, según cómo te vaya.</p>
          <button className="fc-action-btn" onClick={() => navigate('/vocabulario')}>
            Ver mi vocabulario
          </button>
        </div>
      </div>
    )
  }

  // ── Session done ──
  if (sessionDone) {
    const pct = Math.round((sessionStats.correct / sessionStats.total) * 100)
    return (
      <div className="fc-container animate-fadeIn">
        <div className="fc-done">
          <span className="fc-done-icon">
            {pct >= 80 ? '🌟' : pct >= 60 ? '✅' : '💪'}
          </span>
          <h2 className="fc-done-title">¡Sesión completa!</h2>
          <div className="fc-done-stats">
            <div className="fc-stat">
              <span className="fc-stat-num">{sessionStats.total}</span>
              <span className="fc-stat-label">tarjetas</span>
            </div>
            <div className="fc-stat fc-stat-correct">
              <span className="fc-stat-num">{sessionStats.correct}</span>
              <span className="fc-stat-label">correctas</span>
            </div>
            <div className="fc-stat">
              <span className="fc-stat-num">{pct}%</span>
              <span className="fc-stat-label">precisión</span>
            </div>
          </div>
          <p className="fc-done-msg">
            {pct >= 80
              ? '¡Excelente! Tu memoria está mejorando.'
              : pct >= 60
              ? '¡Buen trabajo! Sigue practicando.'
              : '¡Buen intento! Repasa las difíciles mañana.'}
          </p>
          <button className="fc-action-btn" onClick={() => navigate('/dashboard')}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fc-container animate-fadeIn">
      {/* Header */}
      <div className="fc-header">
        <button className="fc-back-btn" onClick={() => navigate(-1)}>←</button>
        <div className="fc-progress-wrap">
          <div className="fc-progress-track">
            <div className="fc-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="fc-progress-label">{currentIdx + 1} / {cards.length}</span>
        </div>
      </div>

      <p className="fc-section-label">🧠 Repetición espaciada</p>

      {/* Card */}
      <FlipCard key={currentIdx} word={currentCard} onRate={rateCard} />

      {/* Rating buttons */}
      <div className="fc-ratings">
        <p className="fc-ratings-hint">¿Cómo te fue con esta palabra?</p>
        <div className="fc-rating-btns">
          <button
            className="fc-rating-btn fc-rating-bad"
            onClick={() => rateCard(1)}
            disabled={rating}
          >
            <span>😕</span>
            <span>Difícil</span>
            <span className="fc-rating-sub">Repasar pronto</span>
          </button>
          <button
            className="fc-rating-btn fc-rating-ok"
            onClick={() => rateCard(3)}
            disabled={rating}
          >
            <span>🙂</span>
            <span>Ok</span>
            <span className="fc-rating-sub">Repasar en días</span>
          </button>
          <button
            className="fc-rating-btn fc-rating-good"
            onClick={() => rateCard(5)}
            disabled={rating}
          >
            <span>🌟</span>
            <span>¡Fácil!</span>
            <span className="fc-rating-sub">Repasar en semanas</span>
          </button>
        </div>
      </div>
    </div>
  )
}
