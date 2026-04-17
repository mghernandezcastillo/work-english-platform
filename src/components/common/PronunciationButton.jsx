import { useState, useRef, useCallback } from 'react'
import './PronunciationButton.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** True when running as installed PWA (standalone window) on desktop */
function isDesktopPWA() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  return standalone && !mobile
}

/** Detecta si el browser soporta Web Speech API */
function detectBrowserSupport() {
  const supported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  if (supported) return { supported: true }

  const ua = navigator.userAgent
  const isFirefox = ua.includes('Firefox')
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua)
  const isIOSDevice = /iPhone|iPad|iPod/i.test(ua)

  let message = ''
  let browsers = []

  if (isFirefox) {
    message = 'Firefox no soporta el micrófono para pronunciación.'
    browsers = isMobile ? ['Chrome para Android', 'Samsung Browser'] : ['Google Chrome', 'Microsoft Edge', 'Safari']
  } else if (isIOSDevice) {
    message = 'Tu versión de iOS no soporta esta función.'
    browsers = ['Safari (iOS 15 o superior)', 'Chrome para iOS']
  } else {
    message = 'Tu navegador no soporta el reconocimiento de voz.'
    browsers = ['Google Chrome', 'Microsoft Edge', 'Safari']
  }

  return { supported: false, message, browsers }
}

// ── Scoring logic ─────────────────────────────────────────────────────────────

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(Boolean)
}

function wordMatchesTranscript(word, transcriptWords) {
  if (transcriptWords.includes(word)) return true
  if (word.includes('-')) {
    const parts = word.split('-').filter(Boolean)
    return parts.every(part => transcriptWords.includes(part))
  }
  return false
}

function getScore(target, transcript) {
  if (!transcript) return 0
  const t = normalize(target)
  const s = normalize(transcript)
  const fillerWords = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'by', 'to', 'or', 'up', 'so', 'no', 'it'])
  let totalWeight = 0, matchedWeight = 0
  for (const word of t) {
    const weight = fillerWords.has(word) ? 0.5 : 1
    totalWeight += weight
    if (wordMatchesTranscript(word, s)) matchedWeight += weight
  }
  return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0
}

function getMissedWords(target, transcript) {
  if (!transcript) return []
  const t = normalize(target)
  const s = normalize(transcript)
  const hideFromList = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'by', 'to', 'or', 'up', 'so', 'no', 'it'])
  const original = target.replace(/[^a-zA-Z0-9\s-]/g, '').split(/\s+/).filter(Boolean)
  return original.filter((_, i) => t[i] && !wordMatchesTranscript(t[i], s) && !hideFromList.has(t[i]))
}

function getFeedback(score) {
  if (score >= 90) return { emoji: '🌟', text: '¡Pronunciación perfecta!', color: '#10B981' }
  if (score >= 70) return { emoji: '✅', text: '¡Muy bien! Casi perfecto', color: '#3B82F6' }
  if (score >= 50) return { emoji: '💪', text: '¡Muy bien! Sigue practicando', color: '#F59E0B' }
  return { emoji: '🔄', text: '¡Buen intento! Más despacio', color: '#EF4444' }
}

// ── Helpers: iOS detection ────────────────────────────────────────────────────

const IS_IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

/** Small delay helper */
function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * PronunciationButton — Graba al usuario y muestra score de pronunciación.
 * Usa Web Speech API (Chrome, Edge, Safari, iOS Safari 15+).
 *
 * Approach:
 * - On mobile: simple SpeechRecognition.start() — no getUserMedia at all.
 *   Mobile browsers handle mic permissions natively via SpeechRecognition.
 * - On desktop PWA: optional mic device selector (only shown if user clicks
 *   the gear icon). getUserMedia stream kept alive during recognition to
 *   lock Chrome to the chosen device.
 *
 * iOS fix:
 * - iOS frequently fires 'aborted' when SpeechRecognition starts right after
 *   audio playback stops (audio focus conflict). We add a 350ms delay on iOS
 *   and auto-retry once on 'aborted'.
 */
export function PronunciationButton({ targetText, language = 'en-US', onScore, compact = false, onBeforeRecord }) {
  const browserInfo = detectBrowserSupport()

  const [state, setState] = useState('idle') // idle | listening | processing | result
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const micStreamRef = useRef(null)
  const stateRef = useRef('idle')
  const gotResultRef = useRef(false)
  const abortRetryRef = useRef(false)
  const recordingStartRef = useRef(null) // track when recording started (desktop min-duration guard)

  const updateState = useCallback((newState) => {
    stateRef.current = newState
    setState(newState)
  }, [])

  // Release any held mic stream
  function releaseStream() {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop())
      micStreamRef.current = null
    }
  }

  // Browser not supported
  if (!browserInfo.supported) {
    return (
      <div className="pronun-unsupported">
        <div className="pronun-unsupported-icon">🎤</div>
        <div className="pronun-unsupported-body">
          <p className="pronun-unsupported-title">{browserInfo.message}</p>
          <p className="pronun-unsupported-sub">Para practicar pronunciación usa:</p>
          <div className="pronun-browser-options">
            {browserInfo.browsers.map((b, i) => (
              <span key={i} className="pronun-browser-tag">✓ {b}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Core: create and start a SpeechRecognition instance ─────────────────────

  function createRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    // Desktop: continuous=true so Chrome doesn't cut off mid-sentence
    // Mobile/iOS: continuous=false (required by iOS, mobile handles silence OK)
    recognition.continuous = !IS_MOBILE
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      recordingStartRef.current = Date.now()
      updateState('listening')
    }

    recognition.onresult = (event) => {
      // On desktop (continuous mode), accumulate all results
      if (!IS_MOBILE) {
        // Collect all final results so far
        let accumulated = ''
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            accumulated += (accumulated ? ' ' : '') + event.results[i][0].transcript
          }
        }
        // Store accumulated but don't score yet — wait for user to press Listo
        recognitionRef.current._accumulated = accumulated
        return
      }
      // Mobile: score immediately as before
      gotResultRef.current = true
      updateState('processing')
      const transcript = event.results[0][0].transcript
      const score = getScore(targetText, transcript)
      const feedback = getFeedback(score)
      const missed = getMissedWords(targetText, transcript)
      setResult({ score, transcript, feedback, missed })
      updateState('result')
      releaseStream()
      if (onScore) onScore(score)
    }

    recognition.onerror = (event) => {
      releaseStream()
      if (gotResultRef.current) return

      const errCode = event.error

      // iOS auto-retry: on first 'aborted', silently retry once after a delay
      if (errCode === 'aborted' && !abortRetryRef.current) {
        abortRetryRef.current = true
        setTimeout(() => {
          if (stateRef.current === 'listening' || stateRef.current === 'idle') {
            doStartRecognition()
          }
        }, 400)
        return
      }

      if (errCode === 'no-speech') {
        setError('No se detectó voz. ¿Está tu micrófono activado?')
      } else if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        setError('Permiso de micrófono denegado. Actívalo en la configuración de tu navegador.')
      } else if (errCode === 'network') {
        setError('Error de red. Verifica tu conexión a internet.')
      } else if (errCode === 'aborted') {
        setError('La grabación fue interrumpida. Intenta de nuevo.')
      } else if (errCode === 'audio-capture') {
        setError('No se pudo acceder al micrófono. Verifica los permisos del sistema.')
      } else {
        setError('No se pudo grabar. Intenta de nuevo.')
      }
      updateState('idle')
    }

    recognition.onend = () => {
      releaseStream()
      if (IS_MOBILE) {
        if (!gotResultRef.current && stateRef.current === 'listening') updateState('idle')
        return
      }
      // Desktop: onend fires after recognition.stop() — score now
      const transcript = recognitionRef.current?._accumulated || ''
      const elapsed = Date.now() - (recordingStartRef.current || 0)
      if (!transcript || elapsed < 1500) {
        // Too short or empty — likely a mis-tap, stay idle
        if (stateRef.current === 'listening') updateState('idle')
        return
      }
      gotResultRef.current = true
      updateState('processing')
      const score = getScore(targetText, transcript)
      const feedback = getFeedback(score)
      const missed = getMissedWords(targetText, transcript)
      setResult({ score, transcript, feedback, missed })
      updateState('result')
      if (onScore) onScore(score)
    }

    return recognition
  }

  /** Actually start the recognition instance (used for initial + retry) */
  function doStartRecognition() {
    try {
      const recognition = createRecognition()
      recognitionRef.current = recognition
      recognition.start()
      updateState('listening')
    } catch {
      releaseStream()
      setError('No se pudo iniciar la grabación. Intenta de nuevo.')
      updateState('idle')
    }
  }

  // ── Public: startListening ────────────────────────────────────────────────

  async function startListening() {
    setResult(null)
    setError(null)
    releaseStream()
    abortRetryRef.current = false
    gotResultRef.current = false

    // Stop any playing audio AND speechSynthesis before mic opens
    window.speechSynthesis?.cancel()
    onBeforeRecord?.()

    if (IS_IOS) {
      // iOS needs time between stopping audio and starting recognition
      // Without this delay, iOS immediately fires 'aborted'
      updateState('processing') // Show "Procesando…" while waiting
      await wait(350)
    }

    doStartRecognition()
  }

  function stopListening() {
    if (IS_MOBILE) {
      recognitionRef.current?.stop()
      releaseStream()
      updateState('idle')
    } else {
      // Desktop: stop() → triggers onend → scores accumulated transcript
      updateState('processing')
      recognitionRef.current?.stop()
    }
  }

  function reset() {
    setResult(null)
    setError(null)
    updateState('idle')
  }

  function speakWord(word) {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = language
    utterance.rate = 0.8
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en-US'))
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="pronun-wrap">
      {/* Target phrase */}
      <div className="pronun-target">
        <span className="pronun-target-label">Di en voz alta:</span>
        <span className="pronun-target-text">"{targetText}"</span>
      </div>

      {/* Main button */}
      {state !== 'result' && (
        <button
          className={`pronun-btn pronun-btn--${state}`}
          onClick={state === 'listening' ? (IS_MOBILE ? stopListening : undefined) : startListening}
          disabled={state === 'processing' || (state === 'listening' && !IS_MOBILE)}
          aria-label={state === 'listening' ? 'Escuchando' : 'Practicar pronunciación'}
        >
          {state === 'idle' && <><span className="pronun-icon">🎤</span> Practicar pronunciación</>}
          {state === 'listening' && !IS_MOBILE && <><span className="pronun-icon pronun-pulse">🔴</span> Grabando… habla la frase completa</>}
          {state === 'listening' && IS_MOBILE && <><span className="pronun-icon pronun-pulse">🔴</span> Escuchando… (toca para parar)</>}
          {state === 'processing' && <><span className="pronun-icon">⏳</span> Procesando…</>}
        </button>
      )}

      {/* Desktop-only: explicit "Listo" button to stop continuous recording */}
      {state === 'listening' && !IS_MOBILE && (
        <button
          className="pronun-done-btn"
          onClick={stopListening}
          aria-label="Terminar grabación"
        >
          ✓ Listo, calificar
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="pronun-error">
          <span>⚠️ {error}</span>
          <button className="pronun-retry" onClick={reset}>Reintentar</button>
        </div>
      )}

      {/* Result */}
      {state === 'result' && result && (
        compact ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="pronun-result-compact">
              <span className="pronun-result-compact-score" style={{ color: result.feedback.color }}>
                {result.feedback.emoji} {result.score}%
              </span>
              <span className="pronun-result-compact-text" style={{ color: result.feedback.color }}>
                {result.feedback.text}
              </span>
              <button className="pronun-result-compact-retry" onClick={startListening}>
                🔄 Intentar de nuevo
              </button>
            </div>
            {result.missed?.length > 0 && (
              <div className="pronun-missed">
                <span className="pronun-missed-lbl">💡 Practica estas palabras:</span>
                <div className="pronun-missed-words">
                  {result.missed.map((w, i) => (
                    <button
                      key={i}
                      className="pronun-missed-word"
                      onClick={() => speakWord(w)}
                      title={`Escuchar "${w}"`}
                    >
                      <span className="pronun-missed-speaker">🔊</span> {w}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="pronun-result">
            <div className="pronun-score-ring" style={{ '--score-color': result.feedback.color }}>
              <span className="pronun-score-num">{result.score}%</span>
              <span className="pronun-score-lbl">precisión</span>
            </div>
            <div className="pronun-score-info">
              <div className="pronun-feedback">
                <span>{result.feedback.emoji}</span>
                <span style={{ color: result.feedback.color }}>{result.feedback.text}</span>
              </div>
              <div className="pronun-transcript">
                <span className="pronun-transcript-lbl">Escuché:</span>
                <span className="pronun-transcript-text">"{result.transcript}"</span>
              </div>
              {result.missed?.length > 0 && (
                <div className="pronun-missed">
                  <span className="pronun-missed-lbl">💡 Practica estas palabras:</span>
                  <div className="pronun-missed-words">
                    {result.missed.map((w, i) => (
                      <button
                        key={i}
                        className="pronun-missed-word"
                        onClick={() => speakWord(w)}
                        title={`Escuchar "${w}"`}
                      >
                        <span className="pronun-missed-speaker">🔊</span> {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="pronun-retry-btn" onClick={startListening}>
              🔄 Intentar de nuevo
            </button>
          </div>
        )
      )}
    </div>
  )
}
