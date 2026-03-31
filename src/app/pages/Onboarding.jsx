import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../lib/auth'
import { brand } from '../../lib/brand'
import { Button } from '../../components/common/Button'
import { useState } from 'react'
import './Onboarding.css'

const steps = [
  {
    emoji: '🇺🇸',
    title: '¡Bienvenido a English for Work!',
    subtitle: 'El inglés que sí te sirve para trabajar',
    description: 'Aprenderás las frases exactas que usas en el trabajo, en entrevistas, y con clientes — sin perder tiempo con gramática que nunca usarás.',
  },
  {
    emoji: '📚',
    title: '3 rutas de aprendizaje',
    subtitle: 'Elige tu camino',
    description: 'Inglés para Trabajo, para Entrevistas, o para Call Center. Cada ruta tiene módulos, lecciones y simulaciones de situaciones reales.',
    feature: [
      { icon: '💼', text: 'Inglés para Conseguir Trabajo' },
      { icon: '🎯', text: 'Inglés para Entrevistas' },
      { icon: '🎧', text: 'Inglés para Call Center' },
    ],
  },
  {
    emoji: '⏱️',
    title: '15 minutos al día',
    subtitle: 'La constancia lo es todo',
    description: 'Cada lección toma entre 10-15 minutos. Practica a tu ritmo, cuando puedas. Sin presión, sin fechas límite.',
    feature: [
      { icon: '🔊', text: 'Audio profesional en cada frase' },
      { icon: '✏️', text: 'Ejercicios interactivos' },
      { icon: '🎯', text: 'Simulaciones de situaciones reales' },
    ],
  },
]

export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [finishing, setFinishing] = useState(false)

  async function finish() {
    setFinishing(true)
    try {
      await updateProfile(user.id, { onboarding_completed: true })
      await refreshProfile()
    } catch (e) {
      console.error(e)
    }
    navigate('/dashboard')
  }

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="onboarding animate-fadeIn">
      {/* Progress */}
      <div className="onboarding-progress">
        {steps.map((_, i) => (
          <div key={i} className={`onboarding-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>

      {/* Content */}
      <div className="onboarding-content" key={step}>
        <div className="onboarding-emoji">{current.emoji}</div>
        <h1 className="onboarding-title">{current.title}</h1>
        <p className="onboarding-subtitle">{current.subtitle}</p>
        <p className="onboarding-description">{current.description}</p>

        {current.feature && (
          <div className="onboarding-features">
            {current.feature.map((f, i) => (
              <div key={i} className="onboarding-feature">
                <span className="onboarding-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="onboarding-actions">
        <Button
          variant="primary"
          size="lg"
          full
          loading={isLast && finishing}
          onClick={() => isLast ? finish() : setStep(s => s + 1)}
        >
          {isLast ? '¡Comenzar ahora! →' : 'Siguiente →'}
        </Button>
        {step > 0 && (
          <button
            className="btn btn-ghost w-full"
            onClick={() => setStep(s => s - 1)}
            style={{ marginTop: 'var(--space-2)' }}
          >
            ← Anterior
          </button>
        )}
        {!isLast && (
          <button
            className="text-sm text-muted"
            style={{ marginTop: 'var(--space-3)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={finish}
          >
            Saltar introducción
          </button>
        )}
      </div>
    </div>
  )
}
