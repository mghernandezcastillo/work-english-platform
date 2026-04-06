import { useState, useEffect } from 'react'
import './WorkBot.css'

/**
 * Contextual messages for each lesson step.
 * {name} is replaced with the user's first name.
 */
const STEP_MESSAGES = {
  objective: [
    '¡Hola {name}! Veamos qué aprenderás hoy 🎯',
    '¡Hey {name}! Esta lección va a estar buena 💪',
    '{name}, mira lo que vamos a dominar hoy 🚀',
  ],
  phrases: [
    '🎧 Escucha cada frase y repítela en voz alta',
    '👂 Pon atención a la pronunciación — ¡repítelas!',
    '🗣️ Estas frases las usan los profesionales todos los días',
  ],
  examples: [
    '🤓 Mira cómo se usan en situaciones reales',
    '📝 Así suenan estas frases en el trabajo real',
    '👀 Fíjate bien en el contexto de cada ejemplo',
  ],
  explanation: [
    '💡 Este es el truco para dominarlo',
    '🧠 Entender el "por qué" te ayuda a recordar',
    '💡 Esta explicación te va a aclarar todo',
  ],
  exercises: [
    '💪 ¡Tu turno, {name}! Demuestra lo que aprendiste',
    '✏️ ¡A practicar! Tú puedes con esto',
    '🎯 Hora de poner a prueba lo aprendido',
  ],
  match: [
    '🧩 Conecta cada frase con su significado',
    '🔗 ¡Rápido! Encuentra las parejas correctas',
    '⚡ Hazlo lo más rápido que puedas',
  ],
  practice: [
    '🎤 ¡Ahora habla tú! Esta es la parte más importante',
    '🗣️ Di cada frase en voz alta — ¡sin miedo!',
    '🎙️ Tu pronunciación mejora cada vez que practicas',
  ],
  reinforcement: [
    '🎉 ¡Increíble {name}! Completaste la lección',
    '🏆 ¡Lo lograste! Eres imparable, {name}',
    '⭐ ¡Misión cumplida! Sigue así, {name}',
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
 * WorkBot — Animated tutor character for lessons.
 *
 * Props:
 * - stepKey: current step key (objective, phrases, exercises, etc.)
 * - stepIndex: current step index (for re-triggering entry animation)
 * - userName: user's first name
 * - compact: smaller variant for dashboard
 */
export function WorkBot({ stepKey = 'objective', stepIndex = 0, userName, compact = false }) {
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [animKey, setAnimKey] = useState(0)

  const mouth = MOUTH_STYLES[stepKey] || 'happy'

  useEffect(() => {
    // Reset and re-trigger on step change
    setShowMessage(false)
    setIsTyping(true)
    setAnimKey(prev => prev + 1)

    const newMsg = getMessage(stepKey, userName)
    setMessage(newMsg)

    // Typing delay, then reveal message
    const typingTimer = setTimeout(() => {
      setIsTyping(false)
      setShowMessage(true)
    }, 800)

    return () => clearTimeout(typingTimer)
  }, [stepKey, stepIndex])

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
    </div>
  )
}

/**
 * WorkBotDashboard — Compact variant for the Dashboard.
 * Shows contextual messages based on user progress.
 */
const DASHBOARD_MESSAGES = {
  new: [
    '¡Bienvenido {name}! 🎉 Empecemos tu primera lección',
    '¡Hola {name}! 🚀 Tu camino al inglés empieza hoy',
  ],
  returning: [
    '¡Hola de nuevo, {name}! 💪 ¿Listo para continuar?',
    '¡{name}! Me alegra verte 😊 Sigamos aprendiendo',
    '¡Qué bueno verte, {name}! 📚 Tu próxima lección te espera',
  ],
  streaking: [
    '🔥 ¡{name}, llevas {streak} días seguidos! ¡No pares!',
    '🔥 ¡{streak} días de racha! Eres imparable, {name}',
    '💪 ¡Racha de {streak} días! La constancia paga, {name}',
  ],
  todayDone: [
    '✅ ¡Misión del día completa, {name}! Descansa o sigue 😎',
    '🎯 ¡Ya hiciste tu lección de hoy! Eres disciplinado, {name}',
    '⭐ ¡Lección del día hecha! Puedes repasar o descansar, {name}',
  ],
  allDone: [
    '🏆 ¡{name}, completaste TODO el curso! Eres un crack',
    '👑 ¡100% completado! Orgulloso de ti, {name}',
  ],
}

export function WorkBotDashboard({ userName, completedLessons = 0, totalLessons = 0, streak = 0, todayDone = false }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(true)

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

    const timer = setTimeout(() => setIsTyping(false), 700)
    return () => clearTimeout(timer)
  }, [userName, completedLessons, streak, todayDone])

  return (
    <div className="workbot-wrap workbot-compact workbot-enter">
      <div className="workbot-face">
        <div className="workbot-eyes">
          <div className="workbot-eye" />
          <div className="workbot-eye" />
        </div>
        <div className={`workbot-mouth workbot-mouth--${todayDone ? 'happy' : 'excited'}`} />
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
    </div>
  )
}
