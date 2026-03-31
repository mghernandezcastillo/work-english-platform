import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

export default function PhrasesStep({ data }) {
  const phrases = data?.phrases || []

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">💬 Frases clave</div>
      <p className="step-subtitle">Aprende estas frases esenciales. <strong>Escúchalas y repítelas en voz alta:</strong></p>
      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
        💡 Toca cualquier palabra subrayada para ver su significado
      </p>

      <div className="phrases-list">
        {phrases.map((phrase, i) => (
          <div key={i} className="phrase-card">
            <div className="phrase-number">{i + 1}</div>
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
              {phrase.tip && (
                <div className="phrase-tip">
                  <span>💡</span>
                  <span>{phrase.tip}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="step-tip" style={{ marginTop: 'var(--space-4)' }}>
        <span>🎤</span>
        <p>Repite cada frase en voz alta al menos 2 veces. La práctica oral es clave para recordarlas.</p>
      </div>
    </div>
  )
}
