import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { XPNotification } from '../../components/common/XPNotification'
import { awardLessonXP } from '../../lib/xp'
import { Button } from '../../components/common/Button'
import ObjectiveStep from '../../components/learning/steps/ObjectiveStep'
import PhrasesStep from '../../components/learning/steps/PhrasesStep'
import MiniExampleStep from '../../components/learning/steps/MiniExampleStep'
import ExplanationStep from '../../components/learning/steps/ExplanationStep'
import ExerciseStep from '../../components/learning/steps/ExerciseStep'
import GuidedPracticeStep from '../../components/learning/steps/GuidedPracticeStep'
import ReinforcementStep from '../../components/learning/steps/ReinforcementStep'
import MatchStep from '../../components/learning/steps/MatchStep'
import './LessonView.css'
import '../../components/common/BadgesPanel.css'

const STEPS = [
  { key: 'objective', label: 'Objetivo', icon: '🎯', component: ObjectiveStep },
  { key: 'phrases', label: 'Frases', icon: '💬', component: PhrasesStep },
  { key: 'examples', label: 'Ejemplos', icon: '📝', component: MiniExampleStep },
  { key: 'explanation', label: 'Explicación', icon: '💡', component: ExplanationStep },
  { key: 'exercises', label: 'Ejercicios', icon: '✏️', component: ExerciseStep },
  { key: 'match', label: 'Conecta', icon: '🔗', component: MatchStep, dataKey: 'phrases' },
  { key: 'practice', label: 'Práctica', icon: '🗣️', component: GuidedPracticeStep },
  { key: 'reinforcement', label: 'Repaso', icon: '🏆', component: ReinforcementStep },
]

export default function LessonView() {
  const { lessonId } = useParams()
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fontScale, setFontScale] = useState(() => {
    const saved = parseFloat(localStorage.getItem('lesson_font_scale'))
    return Number.isFinite(saved) ? saved : 1.05
  })

  function adjustFont(delta) {
    setFontScale(prev => {
      const next = Math.min(1.25, Math.max(0.9, +(prev + delta).toFixed(2)))
      localStorage.setItem('lesson_font_scale', next)
      return next
    })
  }

  useEffect(() => {
    loadLesson()
  }, [lessonId])

  async function loadLesson() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('lessons')
        .select('*, modules(*, routes(*))')
        .eq('id', lessonId)
        .single()
      setLesson(data)
      // Restore last step if user was interrupted (screen lock, reload, etc.)
      const saved = parseInt(localStorage.getItem(`lesson_step_${lessonId}`))
      setCurrentStep(Number.isFinite(saved) && saved > 0 ? saved : 0)
    } catch (err) {
      console.error('Error loading lesson:', err)
    } finally {
      setLoading(false)
    }
  }

  async function markComplete() {
    if (!profile || !lesson) return false
    setSaving(true)
    try {
      const routeId = lesson.modules?.route_id || lesson.modules?.routes?.id
      const { error } = await supabase.from('user_progress').upsert({
        user_id: profile.id,
        lesson_id: lesson.id,
        module_id: lesson.module_id,
        route_id: routeId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })
      
      if (error) {
        console.error('Error saving progress:', error)
        // Try insert as fallback
        const { error: insertError } = await supabase.from('user_progress').insert({
          user_id: profile.id,
          lesson_id: lesson.id,
          module_id: lesson.module_id,
          route_id: routeId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
        if (insertError) {
          console.error('Fallback insert also failed:', insertError)
          return false
        }
      }
      return true
    } catch (err) {
      console.error('Error saving progress:', err)
      return false
    } finally {
      setSaving(false)
    }
  }

  const [showXP, setShowXP] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [newBadges, setNewBadges] = useState([])
  const [activeBadgeToast, setActiveBadgeToast] = useState(null)
  const [stepCompleted, setStepCompleted] = useState(false)
  const navRef = useRef(null)

  // Auto-scroll to nav when exercises/match complete
  useEffect(() => {
    if (stepCompleted && navRef.current) {
      setTimeout(() => {
        navRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [stepCompleted])

  const STREAK_MESSAGES = [
    { min: 1, msg: '¡Gran comienzo! Cada día cuenta 💪', sub: 'Sigue aprendiendo para construir tu racha' },
    { min: 2, msg: '¡Vas en racha! No pares ahora 🚀', sub: 'La consistencia es la clave del éxito' },
    { min: 3, msg: '¡3 días seguidos! Eres imparable 🔥', sub: 'Los mejores resultados vienen con la práctica diaria' },
    { min: 5, msg: '¡5 días! Tu inglés está subiendo de nivel ⭐', sub: 'Los empleadores notan la diferencia' },
    { min: 7, msg: '¡Una semana completa! Eres un crack 🏆', sub: 'Tu futuro profesional te lo agradece' },
    { min: 14, msg: '¡2 semanas! Tu dedicación es inspiradora 👑', sub: 'Ya estás en otro nivel' },
    { min: 30, msg: '¡1 MES! Eres una leyenda 🌟', sub: 'Nada te detiene' },
  ]

  function getStreakMessage(days) {
    for (let i = STREAK_MESSAGES.length - 1; i >= 0; i--) {
      if (days >= STREAK_MESSAGES[i].min) return STREAK_MESSAGES[i]
    }
    return STREAK_MESSAGES[0]
  }

  async function calculateCurrentStreak() {
    if (!profile?.id) return 0
    const { data } = await supabase
      .from('user_progress')
      .select('completed_at')
      .eq('user_id', profile.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
    if (!data?.length) return 1 // First lesson = day 1

    const dates = [...new Set(data.map(r => new Date(r.completed_at).toDateString()))]
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const check = new Date(today)
      check.setDate(check.getDate() - i)
      if (dates.includes(check.toDateString())) {
        streak++
      } else if (i > 0) break // Allow today to not be counted yet
    }
    return Math.max(streak, 1)
  }

  async function handleLessonComplete() {
    const saved = await markComplete()
    if (!saved) console.warn('Progress may not have been saved')

    // Clear saved step — lesson is done
    localStorage.removeItem(`lesson_step_${lessonId}`)

    // Show XP animation first
    setShowXP(true)

    // Award XP + check badges in DB
    if (profile?.id) {
      const days = await calculateCurrentStreak()
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', profile.id)
        .eq('completed', true)
      const lessonsCount = progressData?.length ?? 1
      const { newBadges: badges } = await awardLessonXP(profile.id, lessonsCount, days)
      // Update profile in context so XP shows immediately on dashboard
      await refreshProfile()
      if (badges?.length) {
        setNewBadges(badges)
        // Show badge toasts sequentially
        for (let i = 0; i < badges.length; i++) {
          await new Promise(r => setTimeout(r, i === 0 ? 900 : 4200))
          setActiveBadgeToast(badges[i])
          setTimeout(() => setActiveBadgeToast(null), 4000)
        }
      }
      setStreakCount(days)
    } else {
      await new Promise(r => setTimeout(r, 900))
      const days = await calculateCurrentStreak()
      setStreakCount(days)
    }

    setShowStreakModal(true)
  }

  function handleStreakContinue() {
    setShowStreakModal(false)
    const routeId = lesson.modules?.route_id || lesson.modules?.routes?.id
    if (routeId) navigate(`/ruta/${routeId}`)
    else navigate('/dashboard')
  }

  const STEP_TOASTS = [
    '✨ ¡Buen trabajo!',
    '💪 ¡Avanzando!',
    '🔥 ¡Vas muy bien!',
    '⭐ ¡Excelente!',
    '🚀 ¡Sigue así!',
    '🎯 ¡Enfocado!',
  ]
  const [stepToast, setStepToast] = useState(null)

  function showStepToast() {
    const msg = STEP_TOASTS[Math.floor(Math.random() * STEP_TOASTS.length)]
    setStepToast(msg)
    setTimeout(() => setStepToast(null), 1000)
  }

  function goToStep(index) {
    if (index >= 0 && index < STEPS.length) {
      if (index > currentStep) showStepToast()
      setCurrentStep(index)
      setStepCompleted(false)
      // Persist step so interruptions (screen lock, reload) don't reset progress
      localStorage.setItem(`lesson_step_${lessonId}`, index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const MOTIVATIONAL = [
    '🚀 Preparando tu lección...',
    '💡 Cargando nuevo vocabulario...',
    '🎯 Listo para aprender...',
    '🗣️ Preparando ejercicios de práctica...',
    '📖 Cargando contenido profesional...',
  ]

  if (loading) return (
    <div className="lesson-skeleton animate-pulse" role="status" aria-label="Cargando lección">
      {/* Motivational message */}
      <p className="lesson-skeleton-msg">
        {MOTIVATIONAL[Math.floor(Date.now() / 1000) % MOTIVATIONAL.length]}
      </p>
      {/* Step tabs skeleton */}
      <div className="lesson-skeleton-tabs">
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="skeleton-block" style={{ width: 52, height: 36, borderRadius: 8 }} />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="lesson-skeleton-content">
        <div className="skeleton-block" style={{ width: '40%', height: 20, marginBottom: 20 }} />
        <div className="skeleton-block" style={{ width: '100%', height: 28, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ width: '85%', height: 20, marginBottom: 8 }} />
        <div className="skeleton-block" style={{ width: '92%', height: 20, marginBottom: 24 }} />
        <div className="skeleton-block" style={{ width: '100%', height: 80, borderRadius: 12, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ width: '100%', height: 80, borderRadius: 12, marginBottom: 12 }} />
        <div className="skeleton-block" style={{ width: '100%', height: 80, borderRadius: 12 }} />
      </div>
    </div>
  )
  if (!lesson) return <div className="text-center" style={{ padding: 40 }}><h3>Lección no encontrada</h3></div>

  const content = lesson.content || {}
  const step = STEPS[currentStep]
  const StepComponent = step.component
  const stepData = content[step.dataKey || step.key] || {}
  const isLast = currentStep === STEPS.length - 1
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100)

  return (
    <div className="lesson-view animate-fadeIn">
      <XPNotification xp={25} show={showXP} />
      {/* Step advance micro-celebration */}
      {stepToast && (
        <div className="lesson-step-toast animate-fadeIn">{stepToast}</div>
      )}
      {/* Badge earned toast */}
      {activeBadgeToast && (
        <div className="badge-toast">
          <span className="badge-toast-emoji">{activeBadgeToast.emoji}</span>
          <span className="badge-toast-text">
            <span className="badge-toast-label">🏅 ¡Nuevo logro desbloqueado!</span>
            <span className="badge-toast-name">{activeBadgeToast.name}</span>
          </span>
        </div>
      )}
      {/* Header */}
      <div className="lesson-header">
        <button className="route-back" onClick={() => {
          const routeId = lesson.modules?.route_id || lesson.modules?.routes?.id
          routeId ? navigate(`/ruta/${routeId}`) : navigate('/dashboard')
        }}>
          ← Volver
        </button>
        <h3 className="lesson-title">{lesson.title}</h3>
      </div>

      {/* Progress bar */}
      <div className="lesson-progress-bar-container">
        <div className="lesson-progress-bar">
          <div 
            className="lesson-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="lesson-progress-text">
          {step.icon} {step.label} — Paso {currentStep + 1} de {STEPS.length}
        </span>
      </div>

      {/* Step indicators */}
      <div className="lesson-progress">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            className={`lesson-dot ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}
            onClick={() => i <= currentStep && goToStep(i)}
            title={s.label}
          >
            <span className="lesson-dot-inner">{i < currentStep ? '✓' : s.icon}</span>
          </button>
        ))}
      </div>

      {/* Font size control */}
      <div className="lesson-font-control">
        <button
          className="lesson-font-btn"
          onClick={() => adjustFont(-0.05)}
          disabled={fontScale <= 0.9}
          aria-label="Reducir tamaño de letra"
        >A<span className="font-btn-minus">−</span></button>
        <button
          className="lesson-font-btn"
          onClick={() => adjustFont(0.05)}
          disabled={fontScale >= 1.25}
          aria-label="Aumentar tamaño de letra"
        >A<span className="font-btn-plus">+</span></button>
      </div>

      {/* Step content */}
      <div className="lesson-content" style={{ fontSize: `calc(var(--text-base) * ${fontScale})` }}>
        <StepComponent
          data={stepData}
          lessonId={lessonId}
          onComplete={isLast ? handleLessonComplete : () => setStepCompleted(true)}
        />
      </div>

      {/* Navigation — hidden for exercises/match until they complete internally */}
      {(() => {
        const hasInternalNav = step.key === 'exercises' || step.key === 'match'
        const showNav = !isLast && (!hasInternalNav || stepCompleted)
        return showNav ? (
          <div className="lesson-nav" ref={navRef}>
            {currentStep > 0 && (
              <Button variant="ghost" onClick={() => goToStep(currentStep - 1)}>
                ← Anterior
              </Button>
            )}
            <div style={{ flex: 1 }} />
            <Button variant="primary" onClick={() => goToStep(currentStep + 1)}>
              Siguiente →
            </Button>
          </div>
        ) : !isLast && hasInternalNav && !stepCompleted ? (
          <div className="lesson-nav">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={() => goToStep(currentStep - 1)}>
                ← Anterior
              </Button>
            )}
            <div style={{ flex: 1 }} />
          </div>
        ) : null
      })()}

      {/* ── Streak Celebration Modal ── */}
      {showStreakModal && (() => {
        const streakMsg = getStreakMessage(streakCount)
        return (
          <div className="streak-overlay" onClick={handleStreakContinue}>
            <div className="streak-modal" onClick={e => e.stopPropagation()}>
              <div className="streak-confetti-wrap">
                {['🔥','⭐','🎉','✨','💪','🏆','🇺🇸','🎯'].map((e, i) => (
                  <span key={i} className="streak-confetti-piece" style={{
                    left: `${8 + Math.random() * 84}%`,
                    animationDelay: `${i * 0.18}s`,
                  }}>{e}</span>
                ))}
              </div>

              <div className="streak-fire-badge">🔥</div>
              <div className="streak-count-display">
                <span className="streak-number">{streakCount}</span>
                <span className="streak-unit">{streakCount === 1 ? 'día' : 'días'}</span>
              </div>
              <h2 className="streak-main-msg">{streakMsg.msg}</h2>
              <p className="streak-sub-msg">{streakMsg.sub}</p>

              <button className="streak-continue-btn" onClick={handleStreakContinue}>
                Continuar →
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
