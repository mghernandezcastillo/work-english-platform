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
      <div className="step-badge">📝 Mini-ejemplos</div>

      {current === 0 && (
        <p className="step-subtitle">Mira cómo se usan estas frases en contexto real:</p>
      )}

      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
        💡 Toca cualquier palabra subrayada para ver su significado
      </p>

      {/* Single example card */}
      <div className="example-card step-card-single" key={current}>
        <div className="example-context">{ex.context}</div>
        <blockquote className="example-dialogue">
          <p className="phrase-en">
            "<ClickablePhrase text={ex.en} />"
          </p>
          <p className="phrase-es">"{ex.es}"</p>
        </blockquote>
        {ex.audioUrl ? (
          <AudioPlayer src={ex.audioUrl} label="Escuchar ejemplo" />
        ) : (
          <SpeakButton text={ex.en} label="Escuchar ejemplo" />
        )}
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
