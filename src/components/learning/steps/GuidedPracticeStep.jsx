import { useState, useEffect, useRef } from 'react'
import { PronunciationButton } from '../../common/PronunciationButton'
import './Steps.css'

export default function GuidedPracticeStep({ data, lessonId, onCanAdvance, onActivity }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => { onCanAdvance?.(true) }, [])

  // Auto-play audio on scenario change (and on first mount)
  useEffect(() => {
    if (!scenarios.length) return
    // Small delay to let the <audio> element mount/update its src
    const t = setTimeout(() => {
      playAudio()
    }, 400)
    return () => clearTimeout(t)
  }, [current, scenarios.length])

  function playAudio() {
    const el = audioRef.current
    if (el) {
      el.currentTime = 0
      el.play().catch(() => {})
      return
    }
    // Fallback: TTS if no audio file
    const scenario = scenarios[current]
    if (scenario?.phrase && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(scenario.phrase)
      u.lang = 'en-US'
      u.rate = 0.85
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
        || voices.find(v => v.lang.startsWith('en-US'))
      if (voice) u.voice = voice
      window.speechSynthesis.speak(u)
    }
  }

  function savePronunScore(phrase, score) {
    if (!lessonId) return
    // Notify parent that pronunciation was attempted
    onActivity?.('pronunciation')
    try {
      const key = `lesson_pronun_scores_${lessonId}`
      const existing = JSON.parse(localStorage.getItem(key) || '{}')
      existing[phrase] = Math.max(existing[phrase] ?? 0, score)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { }
  }

  if (!scenarios.length) return (
    <div className="step-wrapper"><p style={{ color: 'var(--el-text-muted)', fontSize: 15 }}>Sin escenarios disponibles.</p></div>
  )

  const scenario = scenarios[current]

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Hidden audio — rendered first so ref is ready for auto-play */}
      {scenario.audioUrl && (
        <audio key={`audio-${current}`} ref={audioRef} src={scenario.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Counter */}
      <div className="step-counter">Situación {current + 1} / {scenarios.length}</div>

      {/* Prompt card */}
      <div className="practice-prompt-card">
        <div className="practice-prompt-label">Te preguntan:</div>
        <p className="practice-prompt-text">"{scenario.prompt || scenario.context}"</p>
      </div>

      {/* Response card — takes flex space */}
      <div className="practice-response-card" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="practice-response-label">Tú respondes:</div>
        <p className="practice-response-text">{scenario.phrase}</p>
        <p className="practice-response-es">{scenario.translation}</p>
      </div>

      {/* Action buttons */}
      <div className="step-btn-row">
        <button
          className="step-circle-btn"
          onClick={playAudio}
          aria-label="Escuchar" title="Escuchar"
        >🔊</button>
        <PronunciationButton key={current} targetText={scenario.phrase} onScore={(s) => savePronunScore(scenario.phrase, s)} />
      </div>

      {/* Pagination dots */}
      <div className="step-page-dots">
        {scenarios.map((_, i) => (
          <button key={i} className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Inline prev/next — chevrons only */}
      <div className="step-inline-nav">
        <button className="step-inline-btn" onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}>‹</button>
        <span className="step-inline-label">{current + 1} de {scenarios.length}</span>
        <button className="step-inline-btn pulse" onClick={() => current < scenarios.length - 1 && setCurrent(c => c + 1)} disabled={current === scenarios.length - 1}>›</button>
      </div>
    </div>
  )
}
