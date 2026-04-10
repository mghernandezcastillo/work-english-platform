import { useState, useEffect, useRef } from 'react'
import { PronunciationButton } from '../../common/PronunciationButton'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

/**
 * Splits a long phrase into individual sentences.
 * "I am not sure. Could you explain? I will take notes." → 3 sentences
 * Protects decimal numbers (e.g. "3.5 million") from being split.
 */
function splitSentences(text) {
  if (!text) return []
  // Protect decimals like "3.5" from being treated as sentence-ending periods
  const safe = text.replace(/(\d)\.(\d)/g, '$1\u00B7$2')
  const parts = safe.match(/[^.!?]*[.!?]+/g)
  if (!parts || parts.length <= 1) return [text.trim()]
  return parts.map(s => s.replace(/\u00B7/g, '.').trim()).filter(Boolean)
}

export default function GuidedPracticeStep({ data, lessonId, onCanAdvance, onActivity, muted, startAtScenario = 0, missedScenarioIndices = [] }) {
  const scenarios = data?.scenarios || []
  const [current, setCurrent] = useState(startAtScenario)
  const SPEEDS = [1, 0.85, 0.7, 0.5]
  const [speedIdx, setSpeedIdx] = useState(0)
  const speed = SPEEDS[speedIdx]
  const audioRef = useRef(null)
  const wrapperRef = useRef(null)

  // Initialize visited:
  // — scenarios that already have a saved score count as visited (done)
  // — startAtScenario is always included
  const [visited, setVisited] = useState(() => {
    const set = new Set([startAtScenario])
    if (lessonId) {
      try {
        const scores = JSON.parse(localStorage.getItem(`lesson_pronun_scores_${lessonId}`) || '{}')
        scenarios.forEach((s, i) => {
          // Check full phrase key OR any individual sentence key
          if (scores[s.phrase]) { set.add(i); return }
          const sents = splitSentences(s.phrase)
          if (sents.length > 1 && sents.some(sent => scores[sent])) set.add(i)
        })
      } catch { }
    }
    return set
  })

  // Sync to startAtScenario if it changes (e.g. coming back from step 7 to a specific missed scenario)
  useEffect(() => {
    setCurrent(startAtScenario)
  }, [startAtScenario])

  // Only allow advancing when ALL scenarios have been viewed
  useEffect(() => {
    const allVisited = scenarios.length > 0 && visited.size >= scenarios.length
    onCanAdvance?.(allVisited)
  }, [visited, scenarios.length])

  // Navigate to a scenario and mark it as visited
  function goTo(idx) {
    setCurrent(idx)
    setVisited(prev => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
  }

  const scenario = scenarios[current] || {}
  const sentences = splitSentences(scenario.phrase)
  const translations = splitSentences(scenario.translation)
  const hasMultiple = sentences.length > 1

  // Helper: get first sentence index without a saved score for the current scenario
  function firstUnpracticedSentence(scenarioIdx) {
    if (!lessonId) return 0
    try {
      const scores = JSON.parse(localStorage.getItem(`lesson_pronun_scores_${lessonId}`) || '{}')
      const sc = scenarios[scenarioIdx] || {}
      const sents = splitSentences(sc.phrase)
      if (sents.length <= 1) return 0
      const firstMissing = sents.findIndex(s => !scores[s])
      return firstMissing === -1 ? 0 : firstMissing
    } catch { return 0 }
  }

  // Track which sentence is currently selected for pronunciation
  // Start at first unpracticed sentence so repair mode resumes correctly
  const [activeSentence, setActiveSentence] = useState(() => firstUnpracticedSentence(startAtScenario))
  // Track which sentences have already been practiced in this scenario
  const [practicedSentences, setPracticedSentences] = useState(() => {
    // Pre-populate with sentences already scored in localStorage
    if (!lessonId) return new Set()
    try {
      const scores = JSON.parse(localStorage.getItem(`lesson_pronun_scores_${lessonId}`) || '{}')
      const sc = scenarios[startAtScenario] || {}
      const sents = splitSentences(sc.phrase)
      return new Set(sents.reduce((acc, s, i) => { if (scores[s]) acc.push(i); return acc }, []))
    } catch { return new Set() }
  })

  // Reset active sentence and practiced set when scenario changes
  useEffect(() => {
    setActiveSentence(firstUnpracticedSentence(current))
    // Restore practiced sentences from localStorage for new scenario
    if (lessonId) {
      try {
        const scores = JSON.parse(localStorage.getItem(`lesson_pronun_scores_${lessonId}`) || '{}')
        const sc = scenarios[current] || {}
        const sents = splitSentences(sc.phrase)
        setPracticedSentences(new Set(sents.reduce((acc, s, i) => { if (scores[s]) acc.push(i); return acc }, [])))
      } catch { setPracticedSentences(new Set()) }
    } else {
      setPracticedSentences(new Set())
    }
  }, [current])

  // Get ElevenLabs audio URL for current active sentence (if available)
  const sentenceAudioUrls = scenario.sentenceAudioUrls || []
  const sentAudioRef = useRef(null)
  // Cache of pre-loaded Audio objects keyed by URL → instant playback
  const audioCacheRef = useRef({})

  // Preload all sentence audios for a scenario into memory cache
  function preloadScenarioAudios(scenarioIdx) {
    const sc = scenarios[scenarioIdx]
    if (!sc) return
    const urls = [...(sc.sentenceAudioUrls || []), sc.audioUrl].filter(Boolean)
    urls.forEach(url => {
      if (!audioCacheRef.current[url]) {
        const a = new Audio(url)
        a.preload = 'auto'
        audioCacheRef.current[url] = a
      }
    })
  }

  // On mount: preload current + next scenario
  useEffect(() => {
    preloadScenarioAudios(current)
    preloadScenarioAudios(current + 1)
  }, [])

  // When scenario changes: preload new current + next
  useEffect(() => {
    preloadScenarioAudios(current)
    preloadScenarioAudios(current + 1)
  }, [current])

  // Play a sentence: use cached (pre-loaded) Audio → zero network delay
  function playSentence(sentIdx) {
    if (muted) return
    window.speechSynthesis?.cancel()
    if (sentAudioRef.current) { sentAudioRef.current.pause(); sentAudioRef.current = null }

    const elUrl = sentenceAudioUrls[sentIdx]
    if (elUrl) {
      const a = audioCacheRef.current[elUrl] || new Audio(elUrl)
      a.currentTime = 0
      a.playbackRate = speed
      a.play().catch(() => {})
      sentAudioRef.current = a
    } else {
      // Fallback: speechSynthesis
      const text = sentences[sentIdx]
      if (!text || !window.speechSynthesis) return
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'; u.rate = speed * 0.85
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
        || voices.find(v => v.lang.startsWith('en-US'))
      if (voice) u.voice = voice
      window.speechSynthesis.speak(u)
    }
  }


  // Auto-play audio on scenario/sentence change — cancel previous first to avoid overlap
  useEffect(() => {
    if (!scenarios.length || muted) return
    window.speechSynthesis?.cancel()
    if (sentAudioRef.current) { sentAudioRef.current.pause(); sentAudioRef.current = null }

    if (hasMultiple) {
      playSentence(activeSentence)
    } else {
      const el = audioRef.current
      if (el) {
        el.playbackRate = speed
        el.currentTime = 0
        el.play().catch(() => {})
      } else {
        playSentence(0)
      }
    }
    return () => {
      window.speechSynthesis?.cancel()
      if (sentAudioRef.current) { sentAudioRef.current.pause(); sentAudioRef.current = null }
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0 }
    }
  }, [current, activeSentence, scenarios.length, muted])

  function playAudio() {
    if (muted) return
    if (hasMultiple) {
      playSentence(activeSentence)
      return
    }
    const el = audioRef.current
    if (el) {
      el.playbackRate = speed
      el.currentTime = 0
      el.play().catch(() => {})
      return
    }
    playSentence(0)
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
      // Only mark the full scenario phrase as complete when ALL individual sentences have scores
      if (hasMultiple && scenario.phrase && scenario.phrase !== phrase) {
        const allDone = sentences.every(s => s === phrase || existing[s])
        if (allDone) {
          existing[scenario.phrase] = Math.max(existing[scenario.phrase] ?? 0, score)
        }
      }
      localStorage.setItem(key, JSON.stringify(existing))
    } catch { }

    // Mark sentence as practiced and auto-advance to next unpracticed sentence after 600ms
    if (hasMultiple) {
      setPracticedSentences(prev => {
        const next = new Set(prev)
        next.add(activeSentence)
        // Find next unpracticed sentence after current
        const nextIdx = sentences.findIndex((_, i) => i > activeSentence && !next.has(i))
        if (nextIdx !== -1) {
          setTimeout(() => setActiveSentence(nextIdx), 600)
        } else {
          // All sentences practiced — auto-scroll to bottom so nav/Siguiente is visible
          setTimeout(() => {
            wrapperRef.current?.scrollTo({ top: wrapperRef.current.scrollHeight, behavior: 'smooth' })
          }, 200)
        }
        return next
      })
    } else {
      // Single sentence scenario — scroll to bottom after practice
      setTimeout(() => {
        wrapperRef.current?.scrollTo({ top: wrapperRef.current.scrollHeight, behavior: 'smooth' })
      }, 700)
    }
  }

  if (!scenarios.length) return (
    <div className="step-wrapper"><p style={{ color: 'var(--el-text-muted)', fontSize: 15 }}>Sin escenarios disponibles.</p></div>
  )

  const pronunTarget = hasMultiple ? sentences[activeSentence] : scenario.phrase

  return (
    <div className="step-wrapper-scroll animate-fadeIn" ref={wrapperRef}>
      {scenario.audioUrl && (
        <audio key={`audio-${current}`} ref={audioRef} src={scenario.audioUrl} preload="auto" style={{ display: 'none' }} />
      )}

      {/* Counter — repair mode shows focused label */}
      {missedScenarioIndices.length > 0 ? (
        <div className="step-counter" style={{ color: 'var(--el-accent)' }}>
          ⚠️ Situación pendiente
        </div>
      ) : (
        <div className="step-counter">Situación {current + 1} / {scenarios.length}</div>
      )}

      {/* Prompt card */}
      <div className="practice-prompt-card">
        <div className="practice-prompt-label">Te preguntan:</div>
        <p className="practice-prompt-text">"<ClickablePhrase text={scenario.prompt || scenario.context} />"</p>
        {scenario.prompt && scenario.context && (
          <p className="practice-prompt-es">{scenario.context}</p>
        )}
      </div>

      {/* Response card — split into individual sentences when multiple */}
      <div className={`practice-response-card ${hasMultiple && sentences.length >= 3 ? 'practice-response-collapsible' : ''}`}>
        <div className="practice-response-label">Tú respondes:</div>

        {hasMultiple ? (
          <div className="practice-sentences">
            {sentences.map((sentence, i) => {
              const isPracticed = practicedSentences.has(i)
              // Next unpracticed sentence after the last practiced one
              const nextUp = !isPracticed && i !== activeSentence &&
                [...practicedSentences].every(p => p < i) &&
                !sentences.slice(0, i).some((_, j) => !practicedSentences.has(j) && j !== activeSentence)
              return (
                <div
                  key={i}
                  className={[
                    'practice-sentence',
                    i === activeSentence ? 'active' : '',
                    isPracticed ? 'practiced' : '',
                    nextUp ? 'next-up' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setActiveSentence(i)}
                >
                  <span className="practice-sentence-num">{i + 1}</span>
                  <div className="practice-sentence-body">
                    <p className="practice-sentence-en"><ClickablePhrase text={sentence} /></p>
                    {translations[i] && (
                      <p className="practice-sentence-es">{translations[i]}</p>
                    )}
                  </div>
                  {isPracticed && <span className="practice-sentence-done">✓</span>}
                </div>
              )
            })}
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
          <PronunciationButton
            key={`${current}-${activeSentence}`}
            targetText={pronunTarget}
            onScore={(s) => savePronunScore(pronunTarget, s)}
            onBeforeRecord={() => {
              const el = audioRef.current
              if (el) { el.pause(); el.currentTime = 0 }
              else window.speechSynthesis?.cancel()
            }}
          />
        </div>
      </div>

      {/* Hint: in repair mode tell user to click Siguiente; else show sentence selector */}
      {missedScenarioIndices.length > 0 ? (
        <div className="practice-sentence-hint" style={{ color: 'var(--el-accent)' }}>
          ✅ Practica la pronunciación y luego toca <strong>Siguiente →</strong> para continuar
        </div>
      ) : hasMultiple && (
        <div className="practice-sentence-hint">
          Frase {activeSentence + 1} de {sentences.length} · Toca una frase para seleccionarla
        </div>
      )}

      {/* Pagination dots — hidden in repair mode */}
      {missedScenarioIndices.length === 0 && (
        <div className="step-page-dots" style={{ marginTop: 'auto', paddingTop: 8 }}>
          {scenarios.map((_, i) => {
            const cls = [
              'step-page-dot',
              i === current ? 'active' : visited.has(i) ? 'done' : '',
            ].filter(Boolean).join(' ')
            return <button key={i} className={cls} onClick={() => goTo(i)} />
          })}
        </div>
      )}
      {/* Nav — repair mode: only between missed indices; normal mode: all scenarios */}
      {missedScenarioIndices.length > 0 ? (() => {
        const missedPos = missedScenarioIndices.indexOf(current)
        const prevMissed = missedScenarioIndices.filter(i => i < current).at(-1)
        const nextMissed = missedScenarioIndices.find(i => i > current)
        return (
          <div className="step-inline-nav" style={{ paddingBottom: 4 }}>
            <button className="step-inline-btn" onClick={() => prevMissed !== undefined && goTo(prevMissed)} disabled={prevMissed === undefined}>‹</button>
            <span className="step-inline-label">
              Pendiente {missedPos + 1} de {missedScenarioIndices.length}
            </span>
            <button className="step-inline-btn" onClick={() => nextMissed !== undefined && goTo(nextMissed)} disabled={nextMissed === undefined}>›</button>
          </div>
        )
      })() : (
        <div className="step-inline-nav" style={{ paddingBottom: 4 }}>
          <button className="step-inline-btn" onClick={() => current > 0 && goTo(current - 1)} disabled={current === 0}>‹</button>
          <span className="step-inline-label">{current + 1} de {scenarios.length}</span>
          <button className="step-inline-btn pulse" onClick={() => current < scenarios.length - 1 && goTo(current + 1)} disabled={current === scenarios.length - 1}>›</button>
        </div>
      )}
    </div>
  )
}
