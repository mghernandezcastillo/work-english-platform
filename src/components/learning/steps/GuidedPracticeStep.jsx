import { useState, useEffect, useRef } from 'react'
import { PronunciationButton } from '../../common/PronunciationButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

/**
 * Splits a long phrase into individual sentences.
 * "I am not sure. Could you explain? I will take notes." → 3 sentences
 */
function splitSentences(text) {
  if (!text) return []
  // Split on ". " or "? " or "! " — keep the punctuation with the sentence
  const parts = text.match(/[^.!?]*[.!?]+/g)
  if (!parts || parts.length <= 1) return [text.trim()]
  return parts.map(s => s.trim()).filter(Boolean)
}

export default function GuidedPracticeStep({ data, lessonId, onCanAdvance, onActivity, muted }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(0)
  const SPEEDS = [1, 0.85, 0.7, 0.5]
  const [speedIdx, setSpeedIdx] = useState(0)
  const speed = SPEEDS[speedIdx]
  const audioRef = useRef(null)

  useEffect(() => { onCanAdvance?.(true) }, [])

  const scenario = scenarios[current] || {}
  const sentences = splitSentences(scenario.phrase)
  const translations = splitSentences(scenario.translation)
  const hasMultiple = sentences.length > 1

  // Track which sentence is currently selected for pronunciation
  const [activeSentence, setActiveSentence] = useState(0)

  // Reset active sentence when scenario changes
  useEffect(() => { setActiveSentence(0) }, [current])

  // Auto-play audio on scenario change (and on first mount)
  useEffect(() => {
    if (!scenarios.length) return
    const t = setTimeout(() => { if (!muted) playAudio() }, 400)
    return () => clearTimeout(t)
  }, [current, scenarios.length, muted])

  function playAudio() {
    if (muted) return
    const el = audioRef.current
    if (el) {
      el.playbackRate = speed
      el.currentTime = 0
      el.play().catch(() => {})
      return
    }
    // Read only the active sentence (or full phrase if only 1)
    const textToRead = hasMultiple ? sentences[activeSentence] : scenario.phrase
    if (textToRead && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(textToRead)
      u.lang = 'en-US'; u.rate = speed * 0.85
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
        || voices.find(v => v.lang.startsWith('en-US'))
      if (voice) u.voice = voice
      window.speechSynthesis.speak(u)
    }
  }

  function toggleSpeed() {
    const next = (speedIdx + 1) % SPEEDS.length
    setSpeedIdx(next)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next]
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

  const pronunTarget = hasMultiple ? sentences[activeSentence] : scenario.phrase

  return (
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

      {/* Response card — split into individual sentences when multiple */}
      <div className="practice-response-card">
        <div className="practice-response-label">Tú respondes:</div>

        {hasMultiple ? (
          <div className="practice-sentences">
            {sentences.map((sentence, i) => (
              <div
                key={i}
                className={`practice-sentence ${i === activeSentence ? 'active' : ''}`}
                onClick={() => setActiveSentence(i)}
              >
                <span className="practice-sentence-num">{i + 1}</span>
                <div className="practice-sentence-body">
                  <p className="practice-sentence-en"><ClickablePhrase text={sentence} /></p>
                  {translations[i] && (
                    <p className="practice-sentence-es">{translations[i]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="practice-response-text"><ClickablePhrase text={scenario.phrase} /></p>
            <p className="practice-response-es">{scenario.translation}</p>
          </>
        )}
      </div>

      {/* Listen + Pronunciation in a single row */}
      <div className="practice-actions-row">
        <div className="listen-speed-group">
          <button className="step-circle-btn" onClick={playAudio} aria-label="Escuchar" title="Escuchar">🔊</button>
          <button className="speed-toggle-btn" onClick={toggleSpeed} title="Cambiar velocidad">
            {speed}×
          </button>
        </div>
        <div className="practice-pronun-inline">
          <PronunciationButton key={`${current}-${activeSentence}`} targetText={pronunTarget} onScore={(s) => savePronunScore(pronunTarget, s)} />
        </div>
      </div>

      {/* Sentence selector hint (only for multi-sentence) */}
      {hasMultiple && (
        <div className="practice-sentence-hint">
          Frase {activeSentence + 1} de {sentences.length} · Toca una frase para seleccionarla
        </div>
      )}

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
