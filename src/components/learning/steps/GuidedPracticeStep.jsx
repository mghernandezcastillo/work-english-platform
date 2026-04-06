import { useState, useEffect, useRef } from 'react'
import { PronunciationButton } from '../../common/PronunciationButton'
import './Steps.css'

export default function GuidedPracticeStep({ data, lessonId, onCanAdvance }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(0)
  const audioRef = useRef(null)

  // Always advanceable — user controls their own pace
  useEffect(() => { onCanAdvance?.(true) }, [])

  // Auto-play audio on scenario change
  useEffect(() => {
    if (!scenarios.length) return
    const t = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    }, 350)
    return () => clearTimeout(t)
  }, [current])

  function savePronunScore(phrase, score) {
    if (!lessonId) return
    try {
      const key = `lesson_pronun_scores_${lessonId}`
      const existing = JSON.parse(localStorage.getItem(key) || '{}')
      existing[phrase] = Math.max(existing[phrase] ?? 0, score)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { }
  }

  if (!scenarios.length) return (
    <div className="step-wrapper">
      <p style={{ color: 'var(--el-text-muted)', fontSize: 14 }}>Sin escenarios disponibles.</p>
    </div>
  )

  const scenario = scenarios[current]

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Counter */}
      <div className="step-counter">Situación {current + 1} / {scenarios.length}</div>

      {/* Prompt card */}
      <div className="practice-prompt-card" style={{ marginBottom: 8 }}>
        <div className="practice-prompt-label">Te preguntan:</div>
        <p className="practice-prompt-text">"{scenario.prompt || scenario.context}"</p>
      </div>

      {/* Response card */}
      <div className="practice-response-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="practice-response-label">Tú respondes:</div>
        <p className="practice-response-text">{scenario.phrase}</p>
        <p className="practice-response-es">{scenario.translation}</p>
      </div>

      {/* Hidden audio */}
      {scenario.audioUrl && (
        <audio ref={audioRef} src={scenario.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Action buttons */}
      <div className="step-btn-row">
        <button
          className="step-circle-btn"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(() => {})
            }
          }}
          aria-label="Escuchar"
          title="Escuchar"
        >🔊</button>
        <PronunciationButton
          targetText={scenario.phrase}
          onScore={(score) => savePronunScore(scenario.phrase, score)}
        />
      </div>

      {/* Pagination dots */}
      <div className="step-page-dots">
        {scenarios.map((_, i) => (
          <button
            key={i}
            className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Prev / Next inline */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', flexShrink: 0 }}>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-text-muted)', fontSize: 13, cursor: current > 0 ? 'pointer' : 'default', opacity: current > 0 ? 1 : 0.3 }}
          onClick={() => current > 0 && setCurrent(c => c - 1)}
        >← Anterior</button>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-primary)', fontSize: 13, fontWeight: 600, cursor: current < scenarios.length - 1 ? 'pointer' : 'default', opacity: current < scenarios.length - 1 ? 1 : 0.3 }}
          onClick={() => current < scenarios.length - 1 && setCurrent(c => c + 1)}
        >Siguiente →</button>
      </div>
    </div>
  )
}
