import { useState, useEffect, useRef } from 'react'
import { PronunciationButton } from '../../common/PronunciationButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

export default function GuidedPracticeStep({ data, lessonId, onCanAdvance, onActivity }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => { onCanAdvance?.(true) }, [])

  // Auto-play audio on scenario change (and on first mount)
  useEffect(() => {
    if (!scenarios.length) return
    const t = setTimeout(() => { playAudio() }, 400)
    return () => clearTimeout(t)
  }, [current, scenarios.length])

  function playAudio() {
    const el = audioRef.current
    if (el) { el.currentTime = 0; el.play().catch(() => {}); return }
    const scenario = scenarios[current]
    if (scenario?.phrase && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(scenario.phrase)
      u.lang = 'en-US'; u.rate = 0.85
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
        || voices.find(v => v.lang.startsWith('en-US'))
      if (voice) u.voice = voice
      window.speechSynthesis.speak(u)
    }
  }

  function savePronunScore(phrase, score) {
    if (!lessonId) return
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
    /* step-wrapper-scroll: same as step-wrapper but overflow-y:auto so result panel never overlaps */
    <div className="step-wrapper-scroll animate-fadeIn">
      {scenario.audioUrl && (
        <audio key={`audio-${current}`} ref={audioRef} src={scenario.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Counter */}
      <div className="step-counter">Situación {current + 1} / {scenarios.length}</div>

      {/* Prompt card */}
      <div className="practice-prompt-card">
        <div className="practice-prompt-label">Te preguntan:</div>
        <p className="practice-prompt-text">"<ClickablePhrase text={scenario.prompt || scenario.context} />"</p>
      </div>

      {/* Response card — compact, no flex:1 */}
      <div className="practice-response-card">
        <div className="practice-response-label">Tú respondes:</div>
        <p className="practice-response-text"><ClickablePhrase text={scenario.phrase} /></p>
        <p className="practice-response-es">{scenario.translation}</p>
      </div>

      {/* Listen + Pronunciation in a single row so they don't stack */}
      <div className="practice-actions-row">
        <button className="step-circle-btn" onClick={playAudio} aria-label="Escuchar" title="Escuchar">🔊</button>
        <div className="practice-pronun-inline">
          <PronunciationButton key={current} targetText={scenario.phrase} onScore={(s) => savePronunScore(scenario.phrase, s)} />
        </div>
      </div>

      {/* Pagination — always visible at bottom */}
      <div className="step-page-dots" style={{ marginTop: 'auto', paddingTop: 8 }}>
        {scenarios.map((_, i) => (
          <button key={i} className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
      <div className="step-inline-nav" style={{ paddingBottom: 4 }}>
        <button className="step-inline-btn" onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}>‹</button>
        <span className="step-inline-label">{current + 1} de {scenarios.length}</span>
        <button className="step-inline-btn pulse" onClick={() => current < scenarios.length - 1 && setCurrent(c => c + 1)} disabled={current === scenarios.length - 1}>›</button>
      </div>
    </div>
  )
}
