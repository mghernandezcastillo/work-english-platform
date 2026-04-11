import { useState, useRef, useCallback, useEffect } from 'react'
import './PronunciationButton.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** True when running as installed PWA (standalone window) */
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true // iOS Safari
}

/** True on iOS (all browsers use WebKit) */
function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
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

/** Lista los micrófonos disponibles en el sistema */
async function listMicrophones() {
  try {
    // Need permission first to get labels
    const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    tempStream.getTracks().forEach(t => t.stop())

    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
      .filter(d => d.kind === 'audioinput')
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `Micrófono ${i + 1}`,
      }))
  } catch {
    return []
  }
}

/**
 * Abre el micrófono seleccionado y retorna el stream.
 * IMPORTANTE: NO cerramos el stream aquí — lo mantenemos abierto mientras
 * SpeechRecognition está activo para que Chrome use el mismo dispositivo.
 */
async function openMicStream(deviceId) {
  try {
    const constraints = {
      audio: deviceId && deviceId !== 'default'
        ? { deviceId: { exact: deviceId } }
        : true
    }
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return { ok: true, stream }
  } catch (err) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      return { ok: false, error: 'denied', message: 'Permiso de micrófono denegado. Actívalo en la configuración de tu navegador.' }
    }
    if (err.name === 'NotFoundError') {
      return { ok: false, error: 'no-device', message: 'No se encontró un micrófono. Conecta uno e inténtalo de nuevo.' }
    }
    if (isIOS()) return { ok: true, stream: null } // iOS: let SpeechRecognition handle its own permission
    return { ok: false, error: 'unknown', message: 'No se pudo acceder al micrófono. Verifica los permisos del sistema.' }
  }
}

// ── Scoring logic (unchanged) ─────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

const MIC_DEVICE_KEY = 'efw-mic-device'

/**
 * PronunciationButton — Graba al usuario y muestra score de pronunciación.
 *
 * Fix para Windows PWA:
 * - Selección de dispositivo de micrófono (para audífonos, headsets, etc.)
 * - Stream de getUserMedia se mantiene ABIERTO durante SpeechRecognition
 *   → Esto fuerza a Chrome a usar el mismo dispositivo para ambos
 * - El stream se cierra sólo cuando termina la grabación
 */
export function PronunciationButton({ targetText, language = 'en-US', onScore, compact = false, onBeforeRecord }) {
  const browserInfo = detectBrowserSupport()

  const [state, setState] = useState('idle') // idle | requesting | listening | processing | result
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // PWA device picker
  const [mics, setMics] = useState([])           // available microphones
  const [selectedMic, setSelectedMic] = useState(() => localStorage.getItem(MIC_DEVICE_KEY) || 'default')
  const [showMicPicker, setShowMicPicker] = useState(false)

  const recognitionRef = useRef(null)
  const micStreamRef = useRef(null)   // keep getUserMedia stream alive during recognition
  const stateRef = useRef('idle')
  const gotResultRef = useRef(false)

  const updateState = useCallback((newState) => {
    stateRef.current = newState
    setState(newState)
  }, [])

  // Load available microphones on mount (desktop, non-iOS)
  useEffect(() => {
    if (isIOS()) return
    listMicrophones().then(list => {
      setMics(list)
      // If saved device is no longer available, reset to default
      if (list.length > 0) {
        const saved = localStorage.getItem(MIC_DEVICE_KEY)
        const stillAvailable = list.some(m => m.deviceId === saved)
        if (!stillAvailable) {
          setSelectedMic('default')
          localStorage.removeItem(MIC_DEVICE_KEY)
        }
      }
    })
  }, [])

  function saveMicDevice(deviceId) {
    setSelectedMic(deviceId)
    localStorage.setItem(MIC_DEVICE_KEY, deviceId)
    setShowMicPicker(false)
  }

  // Close the locked stream
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

  // ── Core recording logic ───────────────────────────────────────────────────

  async function startListening() {
    updateState('requesting')
    setResult(null)
    setError(null)
    releaseStream() // clean up any previous stream

    // Open the mic stream with selected device and KEEP IT OPEN
    // This locks Chrome to use this device for SpeechRecognition too
    const micResult = await openMicStream(selectedMic !== 'default' ? selectedMic : undefined)

    if (!micResult.ok) {
      setError(micResult.message)
      updateState('idle')
      return
    }

    // Store stream — will be released in onend / onerror
    micStreamRef.current = micResult.stream

    // Stop any playing audio before mic opens
    onBeforeRecord?.()

    // Start SpeechRecognition with stream already open
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition
    gotResultRef.current = false

    recognition.onstart = () => updateState('listening')

    recognition.onresult = (event) => {
      gotResultRef.current = true
      updateState('processing')
      const transcript = event.results[0][0].transcript
      const score = getScore(targetText, transcript)
      const feedback = getFeedback(score)
      const missed = getMissedWords(targetText, transcript)
      setResult({ score, transcript, feedback, missed })
      updateState('result')
      if (onScore) onScore(score)
    }

    recognition.onerror = (event) => {
      releaseStream()
      if (gotResultRef.current) return // iOS sometimes fires error after result

      const errCode = event.error
      if (errCode === 'no-speech') {
        setError('No se detectó voz. Habla más fuerte o selecciona otro micrófono.')
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
      if (!gotResultRef.current && stateRef.current === 'listening') {
        updateState('idle')
      }
    }

    try {
      recognition.start()
    } catch {
      releaseStream()
      setError('No se pudo iniciar la grabación. Intenta de nuevo.')
      updateState('idle')
    }
  }

  function stopListening() {
    recognitionRef.current?.stop()
    releaseStream()
    updateState('idle')
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

  // ── Selected mic label ─────────────────────────────────────────────────────
  const selectedMicLabel = mics.find(m => m.deviceId === selectedMic)?.label
    || (selectedMic === 'default' ? 'Micrófono predeterminado' : 'Micrófono seleccionado')

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="pronun-wrap">
      {/* Target phrase */}
      <div className="pronun-target">
        <span className="pronun-target-label">Di en voz alta:</span>
        <span className="pronun-target-text">"{targetText}"</span>
      </div>

      {/* ── PWA Microphone selector (Desktop PWA only, not iOS) ── */}
      {isPWA() && !isIOS() && mics.length > 1 && (
        <div className="pronun-mic-selector">
          <button
            className="pronun-mic-selector-btn"
            onClick={() => setShowMicPicker(p => !p)}
            title="Seleccionar micrófono"
          >
            🎙️ <span className="pronun-mic-label">{selectedMicLabel}</span>
            <span className="pronun-mic-arrow">{showMicPicker ? '▲' : '▼'}</span>
          </button>

          {showMicPicker && (
            <div className="pronun-mic-dropdown">
              <div className="pronun-mic-dropdown-title">Selecciona tu micrófono:</div>
              {mics.map(mic => (
                <button
                  key={mic.deviceId}
                  className={`pronun-mic-option ${selectedMic === mic.deviceId ? 'pronun-mic-option--active' : ''}`}
                  onClick={() => saveMicDevice(mic.deviceId)}
                >
                  {selectedMic === mic.deviceId ? '✓ ' : ''}{mic.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main button */}
      {state !== 'result' && (
        <button
          className={`pronun-btn pronun-btn--${state}`}
          onClick={state === 'listening' ? stopListening : startListening}
          disabled={state === 'requesting' || state === 'processing'}
          aria-label={state === 'listening' ? 'Detener grabación' : 'Practicar pronunciación'}
        >
          {state === 'idle' && <><span className="pronun-icon">🎤</span> Practicar pronunciación</>}
          {state === 'requesting' && <><span className="pronun-icon">⏳</span> Activando micrófono…</>}
          {state === 'listening' && <><span className="pronun-icon pronun-pulse">🔴</span> Escuchando… (toca para parar)</>}
          {state === 'processing' && <><span className="pronun-icon">⏳</span> Procesando…</>}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="pronun-error">
          <span>⚠️ {error}</span>
          <div className="pronun-error-actions">
            <button className="pronun-retry" onClick={reset}>Reintentar</button>
            {!isIOS() && mics.length > 1 && (
              <button className="pronun-retry pronun-retry--alt" onClick={() => { reset(); setShowMicPicker(true) }}>
                🎙️ Cambiar micrófono
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {state === 'result' && result && (
        compact ? (
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
