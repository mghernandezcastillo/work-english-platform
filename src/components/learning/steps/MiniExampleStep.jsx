import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import { useState } from 'react'
import './Steps.css'

export default function MiniExampleStep({ data }) {
  const examples = data?.examples || []
  const [current, setCurrent] = useState(0)

  if (examples.length === 0) return null

  const ex = examples[current]
  const isLast = current === examples.length - 1

  return (
    <div className="step-container animate-fadeIn">
      {/* Glassmorphism example card */}
      <div className="glass-card step-card-single" key={current}>
        <span className="glass-card-counter">{current + 1}/{examples.length}</span>
        <div className="glass-card-context">{ex.context}</div>

        <p className="glass-card-phrase">
          "<ClickablePhrase text={ex.en} />"
        </p>
        <p className="glass-card-translation">"{ex.es}"</p>

        <div className="glass-card-actions">
          {ex.audioUrl ? (
            <AudioPlayer src={ex.audioUrl} label="" autoPlay={true} />
          ) : (
            <SpeakButton text={ex.en} label="" autoPlay={true} />
          )}
        </div>
      </div>

      {/* Sub-progress dots + navigation */}
      <div className="step-card-pagination">
        <div className="step-pagination-dots">
          {examples.map((_, i) => (
            <span
              key={i}
              className={`step-pagination-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            />
          ))}
        </div>
        {!isLast && (
          <button className="step-pagination-btn" onClick={() => setCurrent(c => c + 1)}>
            Siguiente ejemplo →
          </button>
        )}
      </div>
    </div>
  )
}
