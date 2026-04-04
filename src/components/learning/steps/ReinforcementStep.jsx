import { useState, useEffect } from 'react'
import './Steps.css'

const CONFETTI_EMOJIS = ['🎉', '⭐', '🏆', '✨', '🇺🇸', '💪', '🎯', '🔥']

function ConfettiPiece({ emoji, delay, left }) {
  return (
    <div 
      className="confetti-piece" 
      style={{ 
        left: `${left}%`, 
        animationDelay: `${delay}s`,
      }}
    >
      {emoji}
    </div>
  )
}

export default function ReinforcementStep({ data, lessonId, onComplete }) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [weakPhrases, setWeakPhrases] = useState([])

  useEffect(() => {
    // Trigger confetti after a short delay
    const timer = setTimeout(() => setShowConfetti(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Load pronunciation scores from localStorage
  useEffect(() => {
    if (!lessonId) return
    try {
      const raw = localStorage.getItem(`lesson_pronun_scores_${lessonId}`)
      if (!raw) return
      const scores = JSON.parse(raw) // { phraseText: score, ... }
      // Find phrases with score < 70
      const weak = Object.entries(scores)
        .filter(([, score]) => score < 70)
        .map(([phrase]) => phrase)
      setWeakPhrases(weak)
    } catch { /* ignore */ }
  }, [lessonId])

  // Auto-complete: trigger XP + streak immediately after showing completion
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => onComplete(), 800)
      return () => clearTimeout(timer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="step-container animate-fadeIn text-center reinforcement-container">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 16 }).map((_, i) => (
            <ConfettiPiece 
              key={i}
              emoji={CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
              delay={i * 0.15}
              left={5 + Math.random() * 90}
            />
          ))}
        </div>
      )}

      <div className="completion-badge">🏆</div>

      <h2 className="completion-title">¡Lección completada!</h2>
      <p className="completion-subtitle">
        Has aprendido <strong>{data?.phrasesLearned || 0} frases nuevas</strong>
      </p>

      {/* Stats */}
      <div className="completion-stats">
        <div className="completion-stat">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{data?.phrasesLearned || 5}</span>
          <span className="stat-label">Frases</span>
        </div>
        <div className="completion-stat">
          <span className="stat-icon">✏️</span>
          <span className="stat-value">7</span>
          <span className="stat-label">Pasos</span>
        </div>
        <div className="completion-stat">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">100%</span>
          <span className="stat-label">Completado</span>
        </div>
      </div>

      {/* Smart review — low-scoring phrases */}
      {weakPhrases.length > 0 && (
        <div className="smart-review-section">
          <h4 className="smart-review-title">💪 Practica un poco más estas frases:</h4>
          <div className="smart-review-list">
            {weakPhrases.map((phrase, i) => (
              <div key={i} className="smart-review-item">
                <span className="smart-review-dot">🔸</span>
                <span className="smart-review-phrase">"{phrase}"</span>
              </div>
            ))}
          </div>
          <p className="smart-review-hint">Repítelas en voz alta 3 veces más antes de cerrar</p>
        </div>
      )}

      {/* Key takeaways */}
      {data?.keyTakeaways && (
        <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
          <h4 style={{ marginBottom: 'var(--space-3)' }}>📌 Recuerda:</h4>
          <div className="reinforcement-takeaways">
            {data.keyTakeaways.map((item, i) => (
              <div key={i} className="reinforcement-item">
                <span className="step-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cultural tip */}
      {data?.culturalTip && (
        <div className="cultural-tip">
          <span className="cultural-tip-icon">🌎</span>
          <div>
            <p className="cultural-tip-title">Tip cultural</p>
            <p className="cultural-tip-text">{data.culturalTip}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted" style={{ marginTop: 'var(--space-3)', opacity: 0.7 }}>
        ⏳ Guardando progreso...
      </p>
    </div>
  )
}
