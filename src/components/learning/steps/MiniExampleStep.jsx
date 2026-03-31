import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

export default function MiniExampleStep({ data }) {
  const examples = data?.examples || []

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">📝 Mini-ejemplos</div>
      <p className="step-subtitle">Mira cómo se usan estas frases en contexto real:</p>
      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
        💡 Toca cualquier palabra subrayada para ver su significado
      </p>

      <div className="examples-list">
        {examples.map((ex, i) => (
          <div key={i} className="example-card">
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
        ))}
      </div>
    </div>
  )
}
