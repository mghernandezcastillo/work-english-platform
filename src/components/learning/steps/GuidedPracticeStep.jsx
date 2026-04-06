import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import { PronunciationButton } from '../../common/PronunciationButton'
import { useState } from 'react'
import './Steps.css'

export default function GuidedPracticeStep({ data, lessonId }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(0)
  const [practiced, setPracticed] = useState(new Set())

  function savePronunScore(phrase, score) {
    if (!lessonId) return
    try {
      const key = `lesson_pronun_scores_${lessonId}`
      const existing = JSON.parse(localStorage.getItem(key) || '{}')
      existing[phrase] = Math.max(existing[phrase] ?? 0, score)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { /* ignore */ }
  }

  if (scenarios.length === 0) return null

  const scenario = scenarios[current]
  const isLast = current === scenarios.length - 1

  return (
    <div className="step-container animate-fadeIn">
      {/* Glassmorphism scenario card */}
      <div className={`glass-card step-card-single ${practiced.has(current) ? 'practiced' : ''}`} key={current}>
        <span className="glass-card-counter">Situación {current + 1}/{scenarios.length}</span>
        <div className="glass-card-context">{scenario.context}</div>

        {scenario.prompt && (
          <div className="glass-card-prompt">
            <span className="glass-card-prompt-label">🎙️ Te dicen:</span>
            <p>"{scenario.prompt}"</p>
          </div>
        )}

        <p className="glass-card-instruction">👤 Tú respondes:</p>
        <p className="glass-card-phrase">
          "<ClickablePhrase text={scenario.phrase} />"
        </p>
        <p className="glass-card-translation">{scenario.translation}</p>

        <div className="glass-card-actions">
          {scenario.audioUrl ? (
            <AudioPlayer src={scenario.audioUrl} label="" autoPlay={true} />
          ) : (
            <SpeakButton text={scenario.phrase} label="" autoPlay={true} />
          )}
          <PronunciationButton
            targetText={scenario.phrase}
            onScore={(score) => savePronunScore(scenario.phrase, score)}
          />
          <button
            className={`glass-practiced-btn ${practiced.has(current) ? 'done' : ''}`}
            onClick={() => {
              setPracticed(prev => {
                const next = new Set(prev)
                next.add(current)
                return next
              })
            }}
          >
            {practiced.has(current) ? '✅ ¡Listo!' : '🎤 Lo dije en voz alta'}
          </button>
        </div>

        {scenario.tip && (
          <div className="glass-card-tip">
            <span>💡</span>
            <span>{scenario.tip}</span>
          </div>
        )}
      </div>

      {/* Sub-progress dots + navigation */}
      <div className="step-card-pagination">
        <div className="step-pagination-dots">
          {scenarios.map((_, i) => (
            <span
              key={i}
              className={`step-pagination-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            />
          ))}
        </div>
        {!isLast ? (
          <button className="step-pagination-btn" onClick={() => setCurrent(c => c + 1)}>
            Siguiente situación →
          </button>
        ) : practiced.size === scenarios.length && scenarios.length > 0 ? (
          <div className="glass-card-tip">
            <span>🎉</span> ¡Excelente! Practicaste todas las situaciones.
          </div>
        ) : null}
      </div>
    </div>
  )
}
