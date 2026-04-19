import { useState, useRef, useCallback, useEffect } from 'react'
import './PronunciationButton.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

function isDesktopPWA() {
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  return standalone && !mobile
}

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

// ── iOS detection ─────────────────────────────────────────────────────────────

const IS_IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
const IS_MOBILE = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── Voice Waveform Component ──────────────────────────────────────────────────

const BAR_COUNT = 24

function VoiceWaveform({ analyserRef, active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const barsRef = useRef(Array(BAR_COUNT).fill(0.08))
  const phaseRef = useRef(Array.from({ length: BAR_COUNT }, (_, i) => i * 1.37))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const barW = 3
    const gap = (W - BAR_COUNT * barW) / (BAR_COUNT + 1)

    function draw() {
      ctx.clearRect(0, 0, W, H)

      const t = Date.now() * 0.001

      let dataArr = null
      if (analyserRef.current && active) {
        const analyser = analyserRef.current
        const buf = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(buf)
        const usable = Math.floor(buf.length * 0.6)
        dataArr = Array.from({ length: BAR_COUNT }, (_, i) => {
          const idx = Math.floor((i / BAR_COUNT) * usable)
          return buf[idx] / 255
        })
      }

      for (let i = 0; i < BAR_COUNT; i++) {
        let target
        if (dataArr) {
          target = Math.max(0.06, dataArr[i])
        } else if (active) {
          // Speech simulation: layered waves + center-spectrum bias
          const centerBias = 1 - Math.abs((i / (BAR_COUNT - 1)) - 0.5) * 1.2
          phaseRef.current[i] += 0.07 + Math.random() * 0.04
          const p = phaseRef.current[i]
          const wave =
            0.35 * Math.sin(p * 3.1 + t * 4.5) +
            0.25 * Math.sin(p * 1.7 + t * 7.3) +
            0.15 * Math.sin(p * 5.9 + t * 2.8) +
            0.10 * (Math.random() - 0.5)
          target = Math.max(0.08, Math.min(0.92, 0.42 + wave * centerBias))
        } else {
          target = 0.06 + 0.04 * Math.sin(t * 2.5 + i * 0.4)
        }

        barsRef.current[i] += (target - barsRef.current[i]) * (active ? 0.38 : 0.08)
        const val = barsRef.current[i]

        const barH = Math.max(3, val * H * 0.92)
        const x = gap + i * (barW + gap)
        const y = (H - barH) / 2
        const alpha = active ? (0.5 + val * 0.5) : 0.3

        // Gradient per bar: indigo → emerald based on amplitude
        const gradient = ctx.createLinearGradient(x, y + barH, x, y)
        gradient.addColorStop(0, `rgba(99,102,241,${alpha})`)
        gradient.addColorStop(0.5, `rgba(139,92,246,${alpha})`)
        gradient.addColorStop(1, `rgba(16,185,129,${alpha * 1.2})`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barW, barH, 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, analyserRef])

  return (
    <canvas
      ref={canvasRef}
      width={180}
      height={48}
      className="pronun-waveform-canvas"
      aria-hidden="true"
    />
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

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
  const recordingStartRef = useRef(null)
  const analyserRef = useRef(null)
  const audioCtxRef = useRef(null)

  const updateState = useCallback((newState) => {
    stateRef.current = newState
    setState(newState)
  }, [])

  function releaseStream() {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop())
      micStreamRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {})
      audioCtxRef.current = null
    }
    analyserRef.current = null
  }

  // ── Waveform: attach analyser to mic stream ───────────────────────────────
  async function attachAnalyser(stream) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      const source = ctx.createMediaStreamSource(stream)
      source.connect(analyser)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
    } catch {
      // Waveform is decorative — silently fail
    }
  }

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

  // ── Core recognition ──────────────────────────────────────────────────────

  function createRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = !IS_MOBILE
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      recordingStartRef.current = Date.now()
      updateState('listening')
    }

    recognition.onresult = (event) => {
      if (!IS_MOBILE) {
        let accumulated = ''
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            accumulated += (accumulated ? ' ' : '') + event.results[i][0].transcript
          }
        }
        recognitionRef.current._accumulated = accumulated
        return
      }
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
      const transcript = recognitionRef.current?._accumulated || ''
      const elapsed = Date.now() - (recordingStartRef.current || 0)
      if (!transcript || elapsed < 1500) {
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

  async function startListening() {
    setResult(null)
    setError(null)
    releaseStream()
    abortRetryRef.current = false
    gotResultRef.current = false

    window.speechSynthesis?.cancel()
    onBeforeRecord?.()

    // Try to get mic stream for waveform visualizer — DESKTOP ONLY.
    // On mobile/iOS, getUserMedia competes with SpeechRecognition for the mic
    // and causes recognition to abort or fail silently. Skip it there.
    if (!IS_MOBILE) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        micStreamRef.current = stream
        await attachAnalyser(stream)
      } catch {
        // No stream → waveform shows idle breathe animation only
      }
    }

    if (IS_IOS) {
      updateState('processing')
      await wait(350)
    }

    doStartRecognition()
  }

  function stopListening() {
    updateState('processing')
    if (IS_MOBILE) {
      recognitionRef.current?.stop()
      releaseStream()
      // Mobile: result comes from onresult, so after brief processing show idle if nothing
      setTimeout(() => {
        if (stateRef.current === 'processing') updateState('idle')
      }, 2000)
    } else {
      // Desktop: stop() → triggers onend → scores
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

      {/* Listening state: waveform + stop button */}
      {state === 'listening' && (
        <div className="pronun-recording-ui">
          <div className="pronun-recording-header">
            <span className="pronun-rec-dot" aria-hidden="true" />
            <span className="pronun-rec-label">Escuchando…</span>
          </div>
          <VoiceWaveform analyserRef={analyserRef} active={true} />
          <button
            className="pronun-stop-btn"
            onClick={stopListening}
            aria-label="Terminar grabación"
          >
            <span className="pronun-stop-icon">⏹</span>
            Listo, terminar grabación
          </button>
        </div>
      )}

      {/* Processing state */}
      {state === 'processing' && (
        <div className="pronun-processing">
          <div className="pronun-processing-spinner" aria-hidden="true" />
          <span>Procesando…</span>
        </div>
      )}

      {/* Idle: start button */}
      {state === 'idle' && (
        <button
          className="pronun-btn pronun-btn--idle"
          onClick={startListening}
          aria-label="Practicar pronunciación"
        >
          <span className="pronun-icon">🎤</span>
          Practicar pronunciación
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
