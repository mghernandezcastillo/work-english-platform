import { useEffect } from 'react'
import './Steps.css'

export default function ReinforcementStep({ data, lessonId, onComplete, onCanAdvance }) {
  // Read pronunciation weak spots
  let weakPhrases = []
  if (lessonId) {
    try {
      const raw = localStorage.getItem(`lesson_pronun_scores_${lessonId}`)
      if (raw) {
        const scores = JSON.parse(raw)
        weakPhrases = Object.entries(scores).filter(([, s]) => s < 70).map(([p]) => p)
      }
    } catch { }
  }

  // Auto-trigger completion & enable Next
  useEffect(() => {
    onCanAdvance?.(true)
    const t = setTimeout(() => { if (onComplete) onComplete() }, 800)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  return (
    <div className="step-wrapper animate-fadeIn">
      <div className="reinforcement-wrapper">
        {/* Celebration emojis */}
        <div className="completion-emojis">🎉 ⭐ 🏆</div>

        {/* Trophy */}
        <div className="completion-trophy">🏆</div>

        {/* Headline */}
        <p className="completion-headline">¡Lección completada!</p>
        <p className="completion-sub">Has aprendido <strong>{data?.phrasesLearned || 5} frases nuevas</strong></p>

        {/* Stats */}
        <div className="completion-stats-row">
          <div className="completion-stat-chip">
            <span className="completion-stat-icon">📚</span>
            <span className="completion-stat-value">{data?.phrasesLearned || 5}</span>
            <span className="completion-stat-label">Frases</span>
          </div>
          <div className="completion-stat-chip">
            <span className="completion-stat-icon">✏️</span>
            <span className="completion-stat-value">7</span>
            <span className="completion-stat-label">Pasos</span>
          </div>
          <div className="completion-stat-chip">
            <span className="completion-stat-icon">🎯</span>
            <span className="completion-stat-value">100%</span>
            <span className="completion-stat-label">Completado</span>
          </div>
        </div>

        {/* Key takeaways */}
        {data?.keyTakeaways && data.keyTakeaways.length > 0 && (
          <div className="completion-takeaways">
            <div className="completion-takeaways-title">KEY TAKEAWAYS</div>
            {data.keyTakeaways.map((item, i) => (
              <div key={i} className="completion-takeaway-item">
                <span className="completion-takeaway-check">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Weak phrases reminder */}
        {weakPhrases.length > 0 && (
          <div className="completion-takeaways" style={{ marginTop: 8 }}>
            <div className="completion-takeaways-title" style={{ color: '#F59E0B' }}>💪 Practica un poco más</div>
            {weakPhrases.map((phrase, i) => (
              <div key={i} className="completion-takeaway-item">
                <span style={{ color: '#F59E0B' }}>🔸</span>
                <span style={{ fontSize: 11 }}>"{phrase}"</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
