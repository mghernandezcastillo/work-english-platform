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
      {/* Glassmorphism phrase card — no borders, tonal shift */}
      <div className="glass-card step-card-single" key={current}>
        <span className="glass-card-counter">{current + 1}/{phrases.length}</span>

        <p className="glass-card-phrase">
          "<ClickablePhrase text={phrase.en} />"
        </p>
        <p className="glass-card-translation">{phrase.es}</p>

        {/* Circular audio buttons */}
        <div className="glass-card-actions">
          {phrase.audioUrl ? (
            <AudioPlayer src={phrase.audioUrl} label="" autoPlay={true} />
          ) : (
            <SpeakButton text={phrase.en} label="" autoPlay={true} />
          )}
          <PronunciationButton targetText={phrase.en} />
        </div>

        {phrase.tip && (
          <div className="glass-card-tip">
            <span>💡</span>
            <span>{phrase.tip}</span>
          </div>
        )}
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
          <div className="glass-card-tip" style={{ marginTop: 'var(--space-2)' }}>
            <span>🎤</span>
            <p>Repite cada frase en voz alta al menos 2 veces</p>
          </div>
        )}
      </div>
    </div>
  )
}
