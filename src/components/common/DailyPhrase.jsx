import { useState, useEffect } from 'react'
import './DailyPhrase.css'

// 30 frases laborales cíclicas — rotación diaria
const PHRASES = [
  { en: "Could you tell me a bit about yourself?", es: "¿Podrías contarme un poco sobre ti?", ctx: "Entrevista" },
  { en: "I'm a team player and I work well under pressure.", es: "Soy una persona de equipo y trabajo bien bajo presión.", ctx: "Entrevista" },
  { en: "What are your strengths and weaknesses?", es: "¿Cuáles son tus fortalezas y debilidades?", ctx: "Entrevista" },
  { en: "I'd like to follow up on my application.", es: "Me gustaría hacer seguimiento a mi solicitud.", ctx: "Email" },
  { en: "Could you repeat that, please?", es: "¿Podría repetir eso, por favor?", ctx: "Comunicación" },
  { en: "I'm calling to inquire about the position.", es: "Llamo para preguntar sobre el puesto.", ctx: "Call Center" },
  { en: "Let me transfer you to the right department.", es: "Déjame transferirte al departamento correcto.", ctx: "Call Center" },
  { en: "I appreciate your time and consideration.", es: "Agradezco su tiempo y consideración.", ctx: "Formal" },
  { en: "I have experience working with customers.", es: "Tengo experiencia trabajando con clientes.", ctx: "Entrevista" },
  { en: "My greatest achievement was leading a team of five.", es: "Mi mayor logro fue liderar un equipo de cinco personas.", ctx: "Entrevista" },
  { en: "Could you hold on for a moment, please?", es: "¿Podría esperar un momento, por favor?", ctx: "Call Center" },
  { en: "I'm very interested in this opportunity.", es: "Estoy muy interesado en esta oportunidad.", ctx: "Entrevista" },
  { en: "I work best when I have clear goals.", es: "Me desempeño mejor cuando tengo metas claras.", ctx: "Entrevista" },
  { en: "How would you describe the company culture?", es: "¿Cómo describirías la cultura de la empresa?", ctx: "Entrevista" },
  { en: "I'm a fast learner and I adapt quickly.", es: "Aprendo rápido y me adapto fácilmente.", ctx: "Entrevista" },
  { en: "Thank you for calling. How may I help you?", es: "Gracias por llamar. ¿En qué le puedo ayudar?", ctx: "Call Center" },
  { en: "I can handle multiple tasks simultaneously.", es: "Puedo manejar múltiples tareas al mismo tiempo.", ctx: "Entrevista" },
  { en: "Could you please speak more slowly?", es: "¿Podría hablar un poco más lento, por favor?", ctx: "Comunicación" },
  { en: "I'm looking for a long-term opportunity.", es: "Estoy buscando una oportunidad a largo plazo.", ctx: "Entrevista" },
  { en: "I have excellent communication skills.", es: "Tengo excelentes habilidades de comunicación.", ctx: "Entrevista" },
  { en: "I'd be happy to clarify that for you.", es: "Con gusto puedo aclararte eso.", ctx: "Call Center" },
  { en: "When would I be expected to start?", es: "¿Cuándo se esperaría que comenzara?", ctx: "Entrevista" },
  { en: "I'm passionate about customer satisfaction.", es: "Soy apasionado por la satisfacción del cliente.", ctx: "Entrevista" },
  { en: "Is there anything else I can help you with?", es: "¿Hay algo más en lo que pueda ayudarte?", ctx: "Call Center" },
  { en: "I take initiative and don't wait to be told.", es: "Tomo la iniciativa y no espero que me digan.", ctx: "Entrevista" },
  { en: "I'd like to schedule a follow-up meeting.", es: "Me gustaría programar una reunión de seguimiento.", ctx: "Formal" },
  { en: "I'm comfortable working in a bilingual environment.", es: "Me siento cómodo trabajando en un ambiente bilingüe.", ctx: "Entrevista" },
  { en: "Could you please verify your account information?", es: "¿Podría verificar la información de su cuenta?", ctx: "Call Center" },
  { en: "I always meet my deadlines.", es: "Siempre cumplo con mis fechas límite.", ctx: "Entrevista" },
  { en: "Thank you for the opportunity to interview.", es: "Gracias por la oportunidad de entrevistarme.", ctx: "Entrevista" },
]

// Selección por día del año — cambia cada 24h
function getTodayPhrase() {
  const dayOfYear = Math.floor(Date.now() / 86_400_000)
  return PHRASES[dayOfYear % PHRASES.length]
}

export function DailyPhrase() {
  const phrase = getTodayPhrase()
  const [speaking, setSpeaking] = useState(false)
  const [supported] = useState(() => 'speechSynthesis' in window)

  // Cancel any pending speech on unmount
  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function speak() {
    if (!supported || speaking) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(phrase.en)
    utt.lang = 'en-US'
    utt.rate = 0.85
    utt.onstart = () => setSpeaking(true)
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  return (
    <div className="dp-card">
      <div className="dp-header">
        <span className="dp-label">🗣️ Frase del día</span>
        <span className="dp-ctx">{phrase.ctx}</span>
      </div>

      <p className="dp-en">"{phrase.en}"</p>
      <p className="dp-es">{phrase.es}</p>

      {supported && (
        <button
          className={`dp-speak-btn ${speaking ? 'dp-speaking' : ''}`}
          onClick={speak}
          disabled={speaking}
          title="Escuchar pronunciación"
        >
          {speaking ? (
            <span className="dp-wave">
              <span /><span /><span /><span />
            </span>
          ) : (
            <span>🔊 Escuchar</span>
          )}
        </button>
      )}
    </div>
  )
}
