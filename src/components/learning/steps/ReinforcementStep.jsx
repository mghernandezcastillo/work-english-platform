import { useEffect, useState } from 'react'
import './Steps.css'

export default function ReinforcementStep({
  data,
  lessonId,
  onComplete,
  onCanAdvance,
  completedActivities,
  getIncompleteItems,
  onGoToStep,
  onForceComplete,
}) {
  const [incompleteItems, setIncompleteItems] = useState([])
  const [allDone, setAllDone] = useState(false)

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

  // Check incomplete items on mount and whenever completedActivities changes
  useEffect(() => {
    const missing = getIncompleteItems ? getIncompleteItems() : []
    setIncompleteItems(missing)
    const done = missing.length === 0
    setAllDone(done)
    onCanAdvance?.(done)
    // Auto-trigger completion after a short delay if everything is done
    if (done) {
      const t = setTimeout(() => { if (onComplete) onComplete() }, 800)
      return () => clearTimeout(t)
    }
  }, [completedActivities]) // re-evaluate whenever activities update

  // ── Incomplete: show pending exercises inline ──
  if (!allDone) {
    return (
      <div className="step-wrapper animate-fadeIn">
        <div className="reinforcement-wrapper">
          <div className="completion-emojis">⚠️</div>
          <p className="completion-headline">¡Casi terminas!</p>
          <p className="completion-sub">Te faltan algunos ejercicios. Completarlos mejora tu aprendizaje.</p>

          {/* Pending items list */}
          <div className="incomplete-inline-list">
            {incompleteItems.map((item, i) => (
              <div key={i} className="incomplete-inline-item animate-fadeIn" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className="incomplete-inline-icon">{item.icon}</span>
                <div className="incomplete-inline-text">
                  <span className="incomplete-inline-label">{item.label}</span>
                  <span className="incomplete-inline-detail">{item.detail}</span>
                </div>
                <button
                  className="incomplete-inline-go"
                  onClick={() => onGoToStep?.(item.stepIdx)}
                >Ir →</button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="incomplete-inline-actions">
            <button
              className="incomplete-inline-finish"
              onClick={() => onForceComplete?.()}
            >Finalizar así</button>
          </div>
        </div>
      </div>
    )
  }

  // ── All done: show celebration ──
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
