import { useState, useEffect, useRef } from 'react'
import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import { PronunciationButton } from '../../common/PronunciationButton'
import './Steps.css'

export default function PhrasesStep({ data, onCanAdvance }) {
  const phrases = data?.phrases || []
  const [current, setCurrent] = useState(0)
  const audioRef = useRef(null)

  // On card change, auto-play audio if available
  useEffect(() => {
    if (!phrases.length) return
    // Notify parent: can advance at any time (user controls with dots)
    onCanAdvance?.(true)
    // Slight delay so DOM settles before auto-fire
    const t = setTimeout(() => {
      if (audioRef.current?.play) {
        try { audioRef.current.play() } catch { /* ignore */ }
      }
    }, 300)
    return () => clearTimeout(t)
  }, [current])

  if (!phrases.length) return (
    <div className="step-wrapper">
      <p style={{ color: 'var(--el-text-muted)', fontSize: 14 }}>Sin frases disponibles.</p>
    </div>
  )

  const phrase = phrases[current]

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Counter */}
      <div className="step-counter">{current + 1} / {phrases.length}</div>

      {/* Main phrase card */}
      <div className="step-card-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <p className="phrase-main-text">{phrase.en}</p>
        <p className="phrase-translation">{phrase.es}</p>

        {/* Audio buttons row */}
        <div className="step-btn-row">
          {phrase.audioUrl ? (
            <audio ref={audioRef} src={phrase.audioUrl} style={{ display: 'none' }}>
              <AudioPlayer src={phrase.audioUrl} label="Escuchar" audioRef={audioRef} />
            </audio>
          ) : null}

          {/* Listen button */}
          <button
            className="step-circle-btn"
            onClick={() => {
              if (phrase.audioUrl && audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play().catch(() => {})
              }
            }}
            aria-label="Escuchar pronunciación"
            title="Escuchar"
          >
            🔊
          </button>

          {/* Speak button */}
          <PronunciationButton targetText={phrase.en} />
        </div>
      </div>

      {/* Audio element (hidden, for auto-play) */}
      {phrase.audioUrl && (
        <audio ref={audioRef} src={phrase.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Pagination dots */}
      <div className="step-page-dots">
        {phrases.map((_, i) => (
          <button
            key={i}
            className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Frase ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next inline arrows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', flexShrink: 0 }}>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-text-muted)', fontSize: 13, cursor: current > 0 ? 'pointer' : 'default', opacity: current > 0 ? 1 : 0.3 }}
          onClick={() => current > 0 && setCurrent(c => c - 1)}
        >← Anterior</button>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-primary)', fontSize: 13, fontWeight: 600, cursor: current < phrases.length - 1 ? 'pointer' : 'default', opacity: current < phrases.length - 1 ? 1 : 0.3 }}
          onClick={() => current < phrases.length - 1 && setCurrent(c => c + 1)}
        >Siguiente →</button>
      </div>
    </div>
  )
}
