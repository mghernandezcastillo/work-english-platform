import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import { PronunciationButton } from '../../common/PronunciationButton'
import { useState } from 'react'
import './Steps.css'

export default function GuidedPracticeStep({ data, lessonId }) {
  const scenarios = data?.scenarios || []
  const [practiced, setPracticed] = useState(new Set())

  function markPracticed(index) {
    setPracticed(prev => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }

  function savePronunScore(phrase, score) {
    if (!lessonId) return
    try {
      const key = `lesson_pronun_scores_${lessonId}`
      const existing = JSON.parse(localStorage.getItem(key) || '{}')
      // Keep the BEST score per phrase
      existing[phrase] = Math.max(existing[phrase] ?? 0, score)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { /* ignore */ }
  }

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">🗣️ Práctica guiada</div>
      <p className="step-subtitle"><strong>Esta es la parte más importante.</strong> Hablar en voz alta activa la memoria muscular que necesitas para el trabajo real.</p>
      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
        💡 Escucha primero, luego repite en voz alta — toca las palabras subrayadas para ver su significado
      </p>

      <div className="practice-scenarios">
        {scenarios.map((scenario, i) => (
          <div key={i} className={`practice-card ${practiced.has(i) ? 'practiced' : ''}`}>
            <div className="practice-header">
              <span className="practice-number">Situación {i + 1}</span>
              <span className="practice-context">{scenario.context}</span>
            </div>

            {/* Interviewer prompt — what the other person says */}
            {scenario.prompt && (
              <div className="practice-prompt">
                <span className="practice-prompt-label">🎙️ Te dicen:</span>
                <p className="practice-prompt-text">"{scenario.prompt}"</p>
              </div>
            )}

            <div className="practice-instruction">
              <p><strong>👤 Tú respondes:</strong></p>
              <p className="phrase-en" style={{ fontSize: 'var(--text-lg)', marginTop: 4 }}>
                "<ClickablePhrase text={scenario.phrase} />"
              </p>
              <p className="phrase-es" style={{ marginTop: 4 }}>
                {scenario.translation}
              </p>
            </div>
            <div className="practice-actions">
              {scenario.audioUrl ? (
                <AudioPlayer src={scenario.audioUrl} label="Escucha primero, luego repite" />
              ) : (
                <SpeakButton text={scenario.phrase} label="Escucha primero" />
              )}
              {/* Mic pronunciation practice */}
              <PronunciationButton
                targetText={scenario.phrase}
                onScore={(score) => savePronunScore(scenario.phrase, score)}
              />
              <button
                className={`practice-done-btn ${practiced.has(i) ? 'done' : ''}`}
                onClick={() => markPracticed(i)}
              >
                {practiced.has(i) ? '✅ ¡Lo hice! Excelente' : '🎤 Lo dije en voz alta'}
              </button>
            </div>
            {scenario.tip && (
              <div className="step-tip" style={{ marginTop: 'var(--space-3)' }}>
                <span>💡</span>
                <p className="text-sm">{scenario.tip}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {practiced.size === scenarios.length && scenarios.length > 0 && (
        <div className="practice-complete-msg animate-fadeIn">
          <span>🎉</span> ¡Excelente! Practicaste todas las situaciones.
        </div>
      )}
    </div>
  )
}
