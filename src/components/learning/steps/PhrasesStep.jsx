import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import { PronunciationButton } from '../../common/PronunciationButton'
import { useState } from 'react'
import './Steps.css'

export default function PhrasesStep({ data }) {
  const phrases = data?.phrases || []
  const [current, setCurrent] = useState(0)

  if (phrases.length === 0) return null

  const phrase = phrases[current]
  const isLast = current === phrases.length - 1

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">💬 Frases clave</div>

      {/* Single phrase card */}
      <div className="phrase-card step-card-single" key={current}>
        <div className="phrase-number">
          <span className="phrase-counter">{current + 1}/{phrases.length}</span>
        </div>
        <div className="phrase-content">
          <p className="phrase-en">
            <ClickablePhrase text={phrase.en} />
          </p>
          <p className="phrase-es">{phrase.es}</p>
          {phrase.audioUrl ? (
            <AudioPlayer src={phrase.audioUrl} label="Escuchar pronunciación" />
          ) : (
            <SpeakButton text={phrase.en} label="Escuchar pronunciación" />
          )}
          <PronunciationButton targetText={phrase.en} />
          {phrase.tip && (
            <div className="phrase-tip">
              <span>💡</span>
              <span>{phrase.tip}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-progress dots + navigation */}
      <div className="step-card-pagination">
        <div className="step-pagination-dots">
          {phrases.map((_, i) => (
            <span
              key={i}
              className={`step-pagination-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            />
          ))}
        </div>
        {!isLast ? (
          <button className="step-pagination-btn" onClick={() => setCurrent(c => c + 1)}>
            Siguiente frase →
          </button>
        ) : (
          <div className="step-tip" style={{ marginTop: 'var(--space-2)' }}>
            <span>🎤</span>
            <p>Repite cada frase en voz alta al menos 2 veces. La práctica oral es clave.</p>
          </div>
        )}
      </div>
    </div>
  )
}
