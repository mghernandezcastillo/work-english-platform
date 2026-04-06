import { useState, useEffect, useRef } from 'react'
import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import { PronunciationButton } from '../../common/PronunciationButton'
import './Steps.css'

export default function PhrasesStep({ data, onCanAdvance }) {
  const phrases = data?.phrases || []
  const [current, setCurrent] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => { onCanAdvance?.(true) }, [])

  // Auto-play audio on card change
  useEffect(() => {
    if (!phrases.length) return
    const t = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    }, 350)
    return () => clearTimeout(t)
  }, [current])

  if (!phrases.length) return (
    <div className="step-wrapper"><p style={{ color: 'var(--el-text-muted)', fontSize: 15 }}>Sin frases disponibles.</p></div>
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

        {/* Action buttons */}
        <div className="step-btn-row">
          <button
            className="step-circle-btn"
            onClick={() => {
              if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => {}) }
            }}
            aria-label="Escuchar pronunciación"
            title="Escuchar"
          >🔊</button>
          <PronunciationButton key={current} targetText={phrase.en} />
        </div>
      </div>

      {/* Hidden audio element for auto-play */}
      {phrase.audioUrl && (
        <audio ref={audioRef} src={phrase.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Pagination dots */}
      <div className="step-page-dots">
        {phrases.map((_, i) => (
          <button key={i} className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Inline prev/next — use chevron symbols to not duplicate footer "Siguiente" */}
      <div className="step-inline-nav">
        <button className="step-inline-btn" onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}>‹</button>
        <span className="step-inline-label">{current + 1} de {phrases.length}</span>
        <button className="step-inline-btn pulse" onClick={() => current < phrases.length - 1 && setCurrent(c => c + 1)} disabled={current === phrases.length - 1}>›</button>
      </div>
    </div>
  )
}
