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
    '🗣️ Estas frases las usan los profesionales',
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
    '🎤 ¡Ahora habla tú! Es la parte más importante',
    '🗣️ Di cada frase en voz alta — ¡sin miedo!',
    '🎙️ Tu pronunciación mejora cada vez que practicas',
  ],
  reinforcement: [
    '🎉 ¡Increíble {name}! Completaste la lección',
    '🏆 ¡Lo lograste! Eres imparable, {name}',
    '⭐ ¡Misión cumplida! Sigue así, {name}',
  ],
}

const EXPRESSIONS = {
  objective: 'happy',
  phrases: 'happy',
  examples: 'curious',
  explanation: 'curious',
  exercises: 'excited',
  match: 'excited',
  practice: 'excited',
  reinforcement: 'celebrate',
}

function getMessage(stepKey, userName) {
  const messages = STEP_MESSAGES[stepKey] || STEP_MESSAGES.objective
  const msg = messages[Math.floor(Math.random() * messages.length)]
  return msg.replace(/{name}/g, userName || 'Estudiante')
}

/**
 * Premium SVG face — inspired by ELSA's character.
 * Inline SVG allows full animation control via CSS.
 */
function BotFace({ expression = 'happy', size = 80 }) {
  // Mouth paths per expression
  const mouths = {
    happy: <path d="M33 48 Q40 55 47 48" stroke="#2D2255" strokeWidth="2.2" fill="none" strokeLinecap="round" />,
    curious: <path d="M35 49 Q40 53 45 49" stroke="#2D2255" strokeWidth="2" fill="none" strokeLinecap="round" />,
    excited: <ellipse cx="40" cy="49" rx="5" ry="4" fill="#2D2255" />,
    celebrate: <path d="M31 47 Q40 58 49 47" stroke="#2D2255" strokeWidth="2.2" fill="none" strokeLinecap="round" />,
  }

  return (
    <svg viewBox="0 0 80 80" width={size} height={size} className="workbot-svg" aria-hidden="true">
      <defs>
        {/* Main gradient */}
        <radialGradient id="botGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </radialGradient>

        {/* Glow filter */}
        <filter id="botGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Eye gradient */}
        <radialGradient id="eyeGrad" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>

        {/* Shine gradient */}
        <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Outer glow ring */}
      <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(99,102,241,0.25)" strokeWidth="1.5" filter="url(#botGlow)" />

      {/* Main face sphere */}
      <circle cx="40" cy="40" r="35" fill="url(#botGrad)" />

      {/* Inner shadow for depth */}
      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />

      {/* Top shine / reflection */}
      <ellipse cx="32" cy="24" rx="14" ry="8" fill="url(#shineGrad)" transform="rotate(-15 32 24)" />

      {/* Circuit decoration — left */}
      <g opacity="0.35" stroke="#A5F3FC" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <line x1="12" y1="32" x2="20" y2="32" />
        <circle cx="10" cy="32" r="2" fill="#A5F3FC" />
        <line x1="15" y1="42" x2="22" y2="38" />
        <circle cx="14" cy="43" r="1.5" fill="#A5F3FC" />
      </g>

      {/* Circuit decoration — right */}
      <g opacity="0.35" stroke="#A5F3FC" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <line x1="58" y1="28" x2="65" y2="24" />
        <circle cx="67" cy="23" r="2" fill="#A5F3FC" />
        <line x1="60" y1="38" x2="68" y2="40" />
        <circle cx="70" cy="40" r="1.5" fill="#A5F3FC" />
        <line x1="55" y1="52" x2="62" y2="55" />
        <circle cx="64" cy="56" r="1.5" fill="#A5F3FC" />
      </g>

      {/* Headphone accent — left side */}
      <path d="M10 34 Q6 30 10 26" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Eyes */}
      <g className="workbot-eyes-svg">
        {/* Left eye */}
        <ellipse cx="31" cy="36" rx="5.5" ry="6" fill="url(#eyeGrad)" />
        <circle cx="32.5" cy="34.5" r="2" fill="rgba(255,255,255,0.8)" />
        <circle cx="29" cy="37" r="1" fill="rgba(255,255,255,0.4)" />

        {/* Right eye */}
        <ellipse cx="49" cy="36" rx="5.5" ry="6" fill="url(#eyeGrad)" />
        <circle cx="50.5" cy="34.5" r="2" fill="rgba(255,255,255,0.8)" />
        <circle cx="47" cy="37" r="1" fill="rgba(255,255,255,0.4)" />
      </g>

      {/* Mouth — changes per expression */}
      {mouths[expression] || mouths.happy}

      {/* Subtle bottom shadow */}
      <ellipse cx="40" cy="76" rx="20" ry="3" fill="rgba(0,0,0,0.15)" />
    </svg>
  )
}

/**
 * WorkBot — Premium animated tutor character for lessons.
 * No voice — visual-only guide with contextual chat bubbles.
 */
export function WorkBot({ stepKey = 'objective', stepIndex = 0, userName, compact = false }) {
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [animKey, setAnimKey] = useState(0)

  const expression = EXPRESSIONS[stepKey] || 'happy'

  useEffect(() => {
    setShowMessage(false)
    setIsTyping(true)
    setAnimKey(prev => prev + 1)

    const newMsg = getMessage(stepKey, userName)
    setMessage(newMsg)

    const typingTimer = setTimeout(() => {
      setIsTyping(false)
      setShowMessage(true)
    }, 800)

    return () => clearTimeout(typingTimer)
  }, [stepKey, stepIndex])

  return (
    <div className={`workbot-wrap workbot-enter ${compact ? 'workbot-compact' : ''}`} key={animKey}>
      <div className="workbot-avatar">
        <BotFace expression={expression} size={compact ? 56 : 80} />
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

/**
 * WorkBotDashboard — Compact variant for the Dashboard.
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
    '⭐ ¡Lección del día hecha!',
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

  const expression = todayDone ? 'celebrate' : (completedLessons > 0 ? 'happy' : 'excited')

  return (
    <div className="workbot-wrap workbot-compact workbot-enter">
      <div className="workbot-avatar">
        <BotFace expression={expression} size={56} />
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
