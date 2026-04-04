import { useState, useRef } from 'react'
import './PronunciationButton.css'

/**
 * Detecta si el browser soporta Web Speech API y devuelve info útil.
 */
function detectBrowserSupport() {
  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  if (isSupported) return { supported: true }

  // Detectar browser específico para dar mensaje útil
  const ua = navigator.userAgent
  const isFirefox = ua.includes('Firefox')
  const isOpera = ua.includes('OPR') || ua.includes('Opera')
  const isBrave = navigator.brave != null
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)

  let message = ''
  let browsers = []

  if (isFirefox) {
    message = 'Firefox no soporta el micrófono para pronunciación.'
    browsers = isMobile
      ? ['Chrome para Android', 'Samsung Browser']
      : ['Google Chrome', 'Microsoft Edge', 'Safari']
  } else if (isIOS) {
    // En iOS debería funcionar con webkitSpeechRecognition — si llegamos aquí es iOS viejo
    message = 'Tu versión de iOS no soporta esta función.'
    browsers = ['Safari (iOS 15 o superior)', 'Chrome para iOS']
  } else {
    message = 'Tu navegador no soporta el reconocimiento de voz.'
    browsers = ['Google Chrome', 'Microsoft Edge', 'Safari']
  }

  return { supported: false, message, browsers }
}

/**
 * PronunciationButton — Graba al usuario y muestra score de pronunciación.
 * Usa Web Speech API. Funciona en: Chrome, Edge, Safari, iOS Safari 15+.
 * En browsers no soportados (Firefox) muestra guía clara.
 */
export function PronunciationButton({ targetText, language = 'en-US', onScore }) {
  const browserInfo = detectBrowserSupport()
  const [state, setState] = useState('idle') // idle | listening | processing | result
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  // Browser no soportado → mostrar aviso con alternativas
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

  // ── Lógica de scoring ──
  function getScore(target, transcript) {
    if (!transcript) return 0
    const t = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean)
    const s = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean)
    const matches = t.filter(word => s.includes(word)).length
    return Math.round((matches / t.length) * 100)
  }

  function getMissedWords(target, transcript) {
    if (!transcript) return []
    const t = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean)
    const s = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean)
    // Return original-casing words from target that weren't detected
    const original = target.replace(/[^a-zA-Z0-9\s]/g, '').split(' ').filter(Boolean)
    return original.filter((_, i) => t[i] && !s.includes(t[i]))
  }

  function getFeedback(score) {
    if (score >= 90) return { emoji: '🌟', text: '¡Pronunciación perfecta!', color: '#10B981' }
    if (score >= 70) return { emoji: '✅', text: '¡Muy bien! Casi perfecto', color: '#3B82F6' }
    if (score >= 50) return { emoji: '💪', text: '¡Muy bien! Sigue practicando', color: '#F59E0B' }
    return { emoji: '🔄', text: '¡Buen intento! Más despacio', color: '#EF4444' }
  }

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false       // iOS requiere false
    recognition.interimResults = false   // iOS no soporta interim
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setState('listening')

    recognition.onresult = (event) => {
      setState('processing')
      const transcript = event.results[0][0].transcript
      const score = getScore(targetText, transcript)
      const feedback = getFeedback(score)
      const missed = getMissedWords(targetText, transcript)
      setResult({ score, transcript, feedback, missed })
      setState('result')
      if (onScore) onScore(score)
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('No se detectó voz. ¿Está tu micrófono activado?')
      } else if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado. Actívalo en la configuración de tu navegador.')
      } else if (event.error === 'network') {
        setError('Error de red. Verifica tu conexión a internet.')
      } else {
        setError('No se pudo grabar. Intenta de nuevo.')
      }
      setState('idle')
    }

    recognition.onend = () => {
      // En iOS a veces dispara onend antes del resultado — lo manejamos con state
      if (state === 'listening') setState('idle')
    }

    setResult(null)
    setError(null)
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setState('idle')
  }

  function reset() {
    setResult(null)
    setError(null)
    setState('idle')
  }

  return (
    <div className="pronun-wrap">
      {/* Indicador de frase objetivo */}
      <div className="pronun-target">
        <span className="pronun-target-label">Di en voz alta:</span>
        <span className="pronun-target-text">"{targetText}"</span>
      </div>

      {/* Botón principal */}
      {state !== 'result' && (
        <button
          className={`pronun-btn pronun-btn--${state}`}
          onClick={state === 'listening' ? stopListening : startListening}
          aria-label={state === 'listening' ? 'Detener grabación' : 'Practicar pronunciación'}
        >
          {state === 'idle' && <><span className="pronun-icon">🎤</span> Practicar pronunciación</>}
          {state === 'listening' && (
            <><span className="pronun-icon pronun-pulse">🔴</span> Escuchando… (toca para parar)</>
          )}
          {state === 'processing' && <><span className="pronun-icon">⏳</span> Procesando…</>}
        </button>
      )}

      {/* Error con mensaje descriptivo */}
      {error && (
        <div className="pronun-error">
          <span>⚠️ {error}</span>
          <button className="pronun-retry" onClick={reset}>Reintentar</button>
        </div>
      )}

      {/* Resultado con score */}
      {state === 'result' && result && (
        <div className="pronun-result">
          <div
            className="pronun-score-ring"
            style={{ '--score-color': result.feedback.color }}
          >
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
                    <span key={i} className="pronun-missed-word">{w}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="pronun-retry-btn" onClick={startListening}>
            🔄 Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}
