import { useState, useEffect, useRef } from 'react'
import './WorkBot.css'

/**
 * Contextual messages for each lesson step.
 * {name} is replaced with the user's first name.
 */
const STEP_MESSAGES = {
  objective: [
    '¡Hola {name}! Veamos qué aprenderás hoy',
    '¡Hey {name}! Esta lección va a estar buena',
    '{name}, mira lo que vamos a dominar hoy',
  ],
  phrases: [
    'Escucha cada frase y repítela en voz alta',
    'Pon atención a la pronunciación. ¡Repítelas!',
    'Estas frases las usan los profesionales todos los días',
  ],
  examples: [
    'Mira cómo se usan en situaciones reales',
    'Así suenan estas frases en el trabajo real',
    'Fíjate bien en el contexto de cada ejemplo',
  ],
  explanation: [
    'Este es el truco para dominarlo',
    'Entender el por qué te ayuda a recordar',
    'Esta explicación te va a aclarar todo',
  ],
  exercises: [
    '¡Tu turno, {name}! Demuestra lo que aprendiste',
    '¡A practicar! Tú puedes con esto',
    'Hora de poner a prueba lo aprendido',
  ],
  match: [
    'Conecta cada frase con su significado',
    '¡Rápido! Encuentra las parejas correctas',
    'Hazlo lo más rápido que puedas',
  ],
  practice: [
    '¡Ahora habla tú! Esta es la parte más importante',
    'Di cada frase en voz alta. ¡Sin miedo!',
    'Tu pronunciación mejora cada vez que practicas',
  ],
  reinforcement: [
    '¡Increíble {name}! Completaste la lección',
    '¡Lo lograste! Eres imparable, {name}',
    '¡Misión cumplida! Sigue así, {name}',
  ],
}

const MOUTH_STYLES = {
  objective: 'happy',
  phrases: 'happy',
  examples: 'thinking',
  explanation: 'thinking',
  exercises: 'excited',
  match: 'excited',
  practice: 'excited',
  reinforcement: 'happy',
}

function getMessage(stepKey, userName) {
  const messages = STEP_MESSAGES[stepKey] || STEP_MESSAGES.objective
  const msg = messages[Math.floor(Math.random() * messages.length)]
  return msg.replace(/{name}/g, userName || 'Estudiante')
}

/**
 * Speak a message using Web Speech API in Spanish.
 * Returns the utterance so we can track when it ends.
 */
function speakMessage(text, onEnd) {
  if (!window.speechSynthesis) return null
  // Don't speak if user has muted the bot
  if (localStorage.getItem('workbot_muted') === '1') {
    if (onEnd) onEnd()
    return null
  }
  window.speechSynthesis.cancel()

  // Strip emojis for cleaner speech
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '').trim()
  if (!cleanText) {
    if (onEnd) onEnd()
    return null
  }

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = 'es-MX'
  utterance.rate = 1.05
  utterance.pitch = 1.1
  utterance.volume = 0.85

  // Try to pick a good Spanish voice
  const voices = window.speechSynthesis.getVoices()
  const spanishVoice = voices.find(v =>
    v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Paulina') || v.name.includes('Monica'))
  ) || voices.find(v => v.lang.startsWith('es'))
  if (spanishVoice) utterance.voice = spanishVoice

  utterance.onend = () => { if (onEnd) onEnd() }
  utterance.onerror = () => { if (onEnd) onEnd() }

  window.speechSynthesis.speak(utterance)
  return utterance
}

/**
 * WorkBot — Animated tutor character for lessons.
 */
export function WorkBot({ stepKey = 'objective', stepIndex = 0, userName, compact = false }) {
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [muted, setMuted] = useState(() => localStorage.getItem('workbot_muted') === '1')
  const [animKey, setAnimKey] = useState(0)

  const mouth = isSpeaking ? 'speaking' : (MOUTH_STYLES[stepKey] || 'happy')

  useEffect(() => {
    // Reset and re-trigger on step change
    setShowMessage(false)
    setIsTyping(true)
    setIsSpeaking(false)
    setAnimKey(prev => prev + 1)
    window.speechSynthesis?.cancel()

    const newMsg = getMessage(stepKey, userName)
    setMessage(newMsg)

    // Typing delay, then reveal message + speak
    const typingTimer = setTimeout(() => {
      setIsTyping(false)
      setShowMessage(true)
      setIsSpeaking(true)
      speakMessage(newMsg, () => setIsSpeaking(false))
    }, 800)

    return () => {
      clearTimeout(typingTimer)
      window.speechSynthesis?.cancel()
    }
  }, [stepKey, stepIndex])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    localStorage.setItem('workbot_muted', next ? '1' : '0')
    if (next) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className={`workbot-wrap workbot-enter ${compact ? 'workbot-compact' : ''}`} key={animKey}>
      {/* Face */}
      <div className="workbot-face">
        <div className="workbot-eyes">
          <div className="workbot-eye" />
          <div className="workbot-eye" />
        </div>
        <div className={`workbot-mouth workbot-mouth--${mouth}`} />
      </div>

      {/* Chat bubble */}
      <div className="workbot-bubble">
        {isTyping ? (
          <div className="workbot-typing">
            <span className="workbot-typing-dot" />
            <span className="workbot-typing-dot" />
            <span className="workbot-typing-dot" />
          </div>
        ) : (
          <span>{message}</span>
        )}
      </div>

      {/* Mute toggle */}
      <button
        className={`workbot-mute ${muted ? 'workbot-muted' : ''}`}
        onClick={toggleMute}
        title={muted ? 'Activar voz del tutor' : 'Silenciar tutor'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

/**
 * WorkBotDashboard — Compact variant for the Dashboard.
 * Shows contextual messages based on user progress.
 */
const DASHBOARD_MESSAGES = {
  new: [
    '¡Bienvenido {name}! Empecemos tu primera lección',
    '¡Hola {name}! Tu camino al inglés empieza hoy',
  ],
  returning: [
    '¡Hola de nuevo, {name}! ¿Listo para continuar?',
    '¡{name}! Me alegra verte. Sigamos aprendiendo',
    '¡Qué bueno verte, {name}! Tu próxima lección te espera',
  ],
  streaking: [
    '¡{name}, llevas {streak} días seguidos! ¡No pares!',
    '¡{streak} días de racha! Eres imparable, {name}',
    '¡Racha de {streak} días! La constancia paga, {name}',
  ],
  todayDone: [
    '¡Misión del día completa, {name}! Descansa o sigue',
    '¡Ya hiciste tu lección de hoy! Eres disciplinado, {name}',
    '¡Lección del día hecha! Puedes repasar o descansar, {name}',
  ],
  allDone: [
    '¡{name}, completaste todo el curso! Eres un crack',
    '¡100% completado! Orgulloso de ti, {name}',
  ],
}

export function WorkBotDashboard({ userName, completedLessons = 0, totalLessons = 0, streak = 0, todayDone = false }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [muted, setMuted] = useState(() => localStorage.getItem('workbot_muted') === '1')

  const hasSpoken = useRef(false)

  useEffect(() => {
    let pool
    if (totalLessons > 0 && completedLessons >= totalLessons) {
      pool = DASHBOARD_MESSAGES.allDone
    } else if (todayDone) {
      pool = DASHBOARD_MESSAGES.todayDone
    } else if (streak >= 2) {
      pool = DASHBOARD_MESSAGES.streaking
    } else if (completedLessons > 0) {
      pool = DASHBOARD_MESSAGES.returning
    } else {
      pool = DASHBOARD_MESSAGES.new
    }

    const msg = pool[Math.floor(Math.random() * pool.length)]
      .replace(/{name}/g, userName || 'Estudiante')
      .replace(/{streak}/g, streak)
    setMessage(msg)

    const timer = setTimeout(() => {
      setIsTyping(false)
      // Only speak once on dashboard load, not on re-renders
      if (!hasSpoken.current) {
        hasSpoken.current = true
        setIsSpeaking(true)
        speakMessage(msg, () => setIsSpeaking(false))
      }
    }, 700)

    return () => {
      clearTimeout(timer)
      window.speechSynthesis?.cancel()
    }
  }, [userName, completedLessons, streak, todayDone])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    localStorage.setItem('workbot_muted', next ? '1' : '0')
    if (next) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="workbot-wrap workbot-compact workbot-enter">
      <div className="workbot-face">
        <div className="workbot-eyes">
          <div className="workbot-eye" />
          <div className="workbot-eye" />
        </div>
        <div className={`workbot-mouth workbot-mouth--${isSpeaking ? 'speaking' : (todayDone ? 'happy' : 'excited')}`} />
      </div>
      <div className="workbot-bubble">
        {isTyping ? (
          <div className="workbot-typing">
            <span className="workbot-typing-dot" />
            <span className="workbot-typing-dot" />
            <span className="workbot-typing-dot" />
          </div>
        ) : (
          <span>{message}</span>
        )}
      </div>
      <button
        className={`workbot-mute ${muted ? 'workbot-muted' : ''}`}
        onClick={toggleMute}
        title={muted ? 'Activar voz del tutor' : 'Silenciar tutor'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}
