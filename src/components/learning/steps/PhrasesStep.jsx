import { useState, useEffect, useRef } from 'react'
import AudioPlayer from '../AudioPlayer'
import SpeakButton from '../SpeakButton'
import { PronunciationButton } from '../../common/PronunciationButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

export default function PhrasesStep({ data, onCanAdvance, onActivity, muted, lessonId, startAtPhrase = 0, missedPhraseIndices = [] }) {
  const phrases = data?.phrases || []
  const [current, setCurrent] = useState(startAtPhrase)
  const SPEEDS = [1, 0.85, 0.7, 0.5]
  const [speedIdx, setSpeedIdx] = useState(0)
  const speed = SPEEDS[speedIdx]
  const audioRef = useRef(null)

  // Initialize visited:
  // — phrases that already have a saved score count as visited (done)
  // — startAtPhrase is always included
  const [visited, setVisited] = useState(() => {
    const set = new Set([startAtPhrase])
    if (lessonId) {
      try {
        const scores = JSON.parse(localStorage.getItem(`lesson_phrases_pronun_${lessonId}`) || '{}')
        phrases.forEach((p, i) => { if (scores[p.en]) set.add(i) })
      } catch {}
    }
    return set
  })

  // Sync to startAtPhrase if it changes (e.g. coming back from step 7 to a specific missed phrase)
  useEffect(() => {
    setCurrent(startAtPhrase)
  }, [startAtPhrase])

  // Only allow advancing when ALL phrases have been viewed
  useEffect(() => {
    const allVisited = phrases.length > 0 && visited.size >= phrases.length
    onCanAdvance?.(allVisited)
  }, [visited, phrases.length])

  // Navigate to a sub-step and mark it as visited
  function goTo(idx) {
    setCurrent(idx)
    setVisited(prev => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
  }

  // Auto-play audio on card change — no delay for instant playback
  useEffect(() => {
    if (!phrases.length) return
    if (muted) return
    const el = audioRef.current
    if (el) {
      el.playbackRate = speed
      el.currentTime = 0
      el.play().catch(() => {})
    }
  }, [current, muted])

  function playAudio() {
    if (muted) return
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  function toggleSpeed() {
    const next = (speedIdx + 1) % SPEEDS.length
    setSpeedIdx(next)
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next]
  }

  // Save per-phrase pronunciation score so step 7 can detect exactly which phrases were practiced
  function savePhraseScore(phraseEn, score) {
    if (!lessonId) return
    onActivity?.('phrases_pronunciation')
    try {
      const key = `lesson_phrases_pronun_${lessonId}`
      const existing = JSON.parse(localStorage.getItem(key) || '{}')
      existing[phraseEn] = Math.max(existing[phraseEn] ?? 0, score)
      localStorage.setItem(key, JSON.stringify(existing))
    } catch {}
  }

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
        <p className="phrase-main-text"><ClickablePhrase text={phrase.en} /></p>
        <p className="phrase-translation">{phrase.es}</p>

        {/* Action buttons */}
        <div className="step-btn-row">
          <div className="listen-speed-group">
            <button
              className="step-circle-btn"
              onClick={playAudio}
              aria-label="Escuchar pronunciación"
              title="Escuchar"
            >🔊</button>
            <button className="speed-toggle-btn" onClick={toggleSpeed} title="Cambiar velocidad">
              {speed}×
            </button>
          </div>
          <PronunciationButton
            compact
            key={current}
            targetText={phrase.en}
            onScore={(s) => savePhraseScore(phrase.en, s)}
            onBeforeRecord={() => {
              const el = audioRef.current
              if (el) { el.pause(); el.currentTime = 0 }
            }}
          />
        </div>
      </div>



      {/* Hidden audio element for auto-play */}
      {phrase.audioUrl && (
        <audio ref={audioRef} src={phrase.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Pagination dots */}
      <div className="step-page-dots">
        {phrases.map((_, i) => {
          const isMissed = missedPhraseIndices.includes(i) && !visited.has(i)
          const cls = [
            'step-page-dot',
            i === current ? 'active' : visited.has(i) ? 'done' : '',
            isMissed ? 'missed' : '',
          ].filter(Boolean).join(' ')
          return <button key={i} className={cls} onClick={() => goTo(i)} />
        })}
      </div>

      {missedPhraseIndices.length > 0 ? (() => {
        const missedPos = missedPhraseIndices.indexOf(current)
        const prevMissed = missedPhraseIndices.filter(i => i < current).at(-1)
        const nextMissed = missedPhraseIndices.find(i => i > current)
        return (
          <>
            <div className="practice-sentence-hint" style={{ color: 'var(--el-accent)' }}>
              ✅ Practica la pronunciación y luego toca <strong>Siguiente →</strong> para continuar
            </div>
            <div className="step-inline-nav">
              <button className="step-inline-btn" onClick={() => prevMissed !== undefined && goTo(prevMissed)} disabled={prevMissed === undefined}>‹</button>
              <span className="step-inline-label">Pendiente {missedPos + 1} de {missedPhraseIndices.length}</span>
              <button className="step-inline-btn" onClick={() => nextMissed !== undefined && goTo(nextMissed)} disabled={nextMissed === undefined}>›</button>
            </div>
          </>
        )
      })() : (
        <div className="step-inline-nav">
          <button className="step-inline-btn" onClick={() => current > 0 && goTo(current - 1)} disabled={current === 0}>‹</button>
          <span className="step-inline-label">{current + 1} de {phrases.length}</span>
          <button className="step-inline-btn pulse" onClick={() => current < phrases.length - 1 && goTo(current + 1)} disabled={current === phrases.length - 1}>›</button>
        </div>
      )}
    </div>
  )
}
