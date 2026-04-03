import { useState, useRef } from 'react'
import './PronunciationButton.css'

/**
 * PronunciationButton — Records user speech and shows a score + feedback.
 * Uses Web Speech API SpeechRecognition.
 *
 * Props:
 *   targetText: string  — the phrase the user should say
 *   language?: string   — BCP 47 code, default "en-US"
 */
export function PronunciationButton({ targetText, language = 'en-US' }) {
  const [state, setState] = useState('idle') // idle | listening | processing | result
  const [result, setResult] = useState(null)  // { score, transcript, feedback }
  const [error, setError] = useState(null)
  const recognitionRef = useRef(null)

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

  function getScore(target, transcript) {
    if (!transcript) return 0
    const t = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
    const s = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
    const matches = t.filter(word => s.includes(word)).length
    return Math.round((matches / t.length) * 100)
  }

  function getFeedback(score) {
    if (score >= 90) return { emoji: '🌟', text: '¡Pronunciación perfecta!', color: '#10B981' }
    if (score >= 70) return { emoji: '✅', text: '¡Muy bien! Casi perfecto', color: '#3B82F6' }
    if (score >= 50) return { emoji: '💪', text: 'Bien, sigue practicando', color: '#F59E0B' }
    return { emoji: '🔄', text: 'Intenta de nuevo más despacio', color: '#EF4444' }
  }

  function startListening() {
    if (!isSupported) {
      setError('Tu navegador no soporta reconocimiento de voz. Prueba Chrome.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setState('listening')

    recognition.onresult = (event) => {
      setState('processing')
      const transcript = event.results[0][0].transcript
      const score = getScore(targetText, transcript)
      const feedback = getFeedback(score)
      setResult({ score, transcript, feedback })
      setState('result')
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('No se detectó voz. Intenta de nuevo.')
      } else if (event.error === 'not-allowed') {
        setError('Necesitas permitir acceso al micrófono.')
      } else {
        setError('Error al grabar. Intenta de nuevo.')
      }
      setState('idle')
    }

    recognition.onend = () => {
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

  if (!isSupported) return null

  return (
    <div className="pronun-wrap">
      {/* Target phrase hint */}
      <div className="pronun-target">
        <span className="pronun-target-label">Di en voz alta:</span>
        <span className="pronun-target-text">"{targetText}"</span>
      </div>

      {/* Main button */}
      {state !== 'result' && (
        <button
          className={`pronun-btn pronun-btn--${state}`}
          onClick={state === 'listening' ? stopListening : startListening}
          aria-label={state === 'listening' ? 'Detener grabación' : 'Practicar pronunciación'}
        >
          {state === 'idle' && <><span className="pronun-icon">🎤</span> Practicar pronunciación</>}
          {state === 'listening' && (
            <><span className="pronun-icon pronun-pulse">🔴</span> Escuchando... (toca para parar)</>
          )}
          {state === 'processing' && <><span className="pronun-icon">⏳</span> Procesando...</>}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="pronun-error">
          ⚠️ {error}
          <button className="pronun-retry" onClick={reset}>Reintentar</button>
        </div>
      )}

      {/* Result */}
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
          </div>
          <button className="pronun-retry-btn" onClick={startListening}>
            🔄 Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}
