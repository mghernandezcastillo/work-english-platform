import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { XPNotification } from '../../components/common/XPNotification'
import { awardLessonXP } from '../../lib/xp'
import ObjectiveStep from '../../components/learning/steps/ObjectiveStep'
import PhrasesStep from '../../components/learning/steps/PhrasesStep'
import ExplanationStep from '../../components/learning/steps/ExplanationStep'
import ExerciseStep from '../../components/learning/steps/ExerciseStep'
import GuidedPracticeStep from '../../components/learning/steps/GuidedPracticeStep'
import ReinforcementStep from '../../components/learning/steps/ReinforcementStep'
import MatchStep from '../../components/learning/steps/MatchStep'
import './LessonView.css'
import '../../components/common/BadgesPanel.css'

/* ─────────────────────────────────────────────────────────────────
   Steps config — 7 steps (Frases absorbs Examples, no MiniExample)
   Steps with internal pagination expose onCanAdvance ← boolean
   ───────────────────────────────────────────────────────────────── */
// startsLocked: true  → Next button starts DISABLED until the step calls onCanAdvance(true)
// startsLocked: false → Next button starts ENABLED immediately (user controls pace)
const STEPS = [
  { key: 'objective',     label: '¿Qué aprenderás?', icon: '🎯', component: ObjectiveStep,       startsLocked: false },
  { key: 'phrases',       label: 'Escucha y repite',  icon: '💬', component: PhrasesStep,         startsLocked: false },
  { key: 'explanation',   label: '¿Por qué así?',     icon: '💡', component: ExplanationStep,     startsLocked: false },
  { key: 'exercises',     label: 'Pon a prueba',       icon: '✏️', component: ExerciseStep,        startsLocked: true  },
  { key: 'match',         label: 'Conecta frases',     icon: '🔗', component: MatchStep,           startsLocked: true, dataKey: 'phrases' },
  { key: 'practice',      label: 'Ahora habla tú',    icon: '🗣️', component: GuidedPracticeStep,  startsLocked: false },
  { key: 'reinforcement', label: '¡Lección lista!',   icon: '🏆', component: ReinforcementStep,   startsLocked: false },
]

export default function LessonView() {
  const { lessonId } = useParams()
  const { profile, refreshProfile } = useAuth()
  const navigate = useNavigate()

  // Hide AppLayout topbar + bottom-nav while in a lesson
  useEffect(() => {
    document.body.classList.add('lesson-mode')
    return () => document.body.classList.remove('lesson-mode')
  }, [])

  const [lesson, setLesson] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showXP, setShowXP] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [activeBadgeToast, setActiveBadgeToast] = useState(null)
  const [stepToast, setStepToast] = useState(null)
  const [hasCompleted, setHasCompleted] = useState(false)

  // Each self-advancing step exposes whether the user can advance
  const [canAdvance, setCanAdvance] = useState(true)

  useEffect(() => { loadLesson() }, [lessonId])

  async function loadLesson() {
    const cached = sessionStorage.getItem(`lesson_cache_${lessonId}`)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setLesson(parsed)
        const saved = parseInt(localStorage.getItem(`lesson_step_${lessonId}`))
        setCurrentStep(Number.isFinite(saved) && saved > 0 ? saved : 0)
        setLoading(false)
        return
      } catch { /* cache corrupted */ }
    }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('lessons')
        .select('*, modules(*, routes(*))')
        .eq('id', lessonId)
        .single()
      setLesson(data)
      if (data) sessionStorage.setItem(`lesson_cache_${lessonId}`, JSON.stringify(data))
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
        await supabase.from('user_progress').insert({
          user_id: profile.id,
          lesson_id: lesson.id,
          module_id: lesson.module_id,
          route_id: routeId,
          completed: true,
          completed_at: new Date().toISOString(),
        })
      }
      return true
    } catch { return false }
  }

  async function calculateCurrentStreak() {
    try {
      if (!profile?.id) return 1
      const { data } = await supabase
        .from('user_progress')
        .select('completed_at')
        .eq('user_id', profile.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
      if (!data?.length) return 1
      const dates = [...new Set(data.map(r => new Date(r.completed_at).toDateString()))]
      let streak = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const check = new Date(today)
        check.setDate(check.getDate() - i)
        if (dates.includes(check.toDateString())) streak++
        else if (i > 0) break
      }
      return Math.max(streak, 1)
    } catch { return 1 }
  }

  async function handleLessonComplete() {
    if (hasCompleted) return
    setHasCompleted(true)
    try {
      await markComplete()
      localStorage.removeItem(`lesson_step_${lessonId}`)
      sessionStorage.removeItem(`lesson_cache_${lessonId}`)
      setShowXP(true)
      if (profile?.id) {
        const days = await calculateCurrentStreak()
        let lessonsCount = 1
        try {
          const { data: pd } = await supabase.from('user_progress').select('id').eq('user_id', profile.id).eq('completed', true)
          lessonsCount = pd?.length ?? 1
        } catch { }
        try {
          const { newBadges: badges } = await awardLessonXP(profile.id, lessonsCount, days)
          await refreshProfile().catch(() => {})
          if (badges?.length) {
            for (let i = 0; i < badges.length; i++) {
              await new Promise(r => setTimeout(r, i === 0 ? 900 : 4200))
              setActiveBadgeToast(badges[i])
              setTimeout(() => setActiveBadgeToast(null), 4000)
            }
          }
        } catch { }
        setStreakCount(days)
      } else {
        await new Promise(r => setTimeout(r, 900))
        setStreakCount(await calculateCurrentStreak())
      }
      setShowStreakModal(true)
    } catch {
      setShowStreakModal(true)
      setStreakCount(1)
    }
  }

  function handleStreakContinue() {
    setShowStreakModal(false)
    const routeId = lesson?.modules?.route_id || lesson?.modules?.routes?.id
    routeId ? navigate(`/ruta/${routeId}`) : navigate('/dashboard')
  }

  const STEP_TOASTS = ['✨ ¡Buen trabajo!', '💪 ¡Avanzando!', '🔥 ¡Vas muy bien!', '⭐ ¡Excelente!', '🚀 ¡Sigue así!', '🎯 ¡Enfocado!']
  function showStepToast() {
    const msg = STEP_TOASTS[Math.floor(Math.random() * STEP_TOASTS.length)]
    setStepToast(msg)
    setTimeout(() => setStepToast(null), 1000)
  }

  function goToStep(index) {
    if (index >= 0 && index < STEPS.length) {
      // Allow going back to any step we've already seen
      if (index < currentStep) {
        setCurrentStep(index)
        setCanAdvance(!STEPS[index].startsLocked)
        localStorage.setItem(`lesson_step_${lessonId}`, index)
        return
      }
      // Forward only to the very next step
      if (index > currentStep + 1) return
      if (index > currentStep) showStepToast()
      setCurrentStep(index)
      setCanAdvance(!STEPS[index].startsLocked)
      localStorage.setItem(`lesson_step_${lessonId}`, index)
    }
  }

  function handleNext() {
    if (!canAdvance) return
    const isLast = currentStep === STEPS.length - 1
    if (isLast) {
      handleLessonComplete()
    } else {
      goToStep(currentStep + 1)
    }
  }

  const MOTIVATIONAL = ['🚀 Preparando tu lección...', '💡 Cargando vocabulario...', '🎯 Listo para aprender...', '🗣️ Preparando ejercicios...', '📖 Cargando contenido...']

  if (loading) return (
    <div className="lesson-loading-screen" role="status">
      <div className="lesson-loading-spinner">
        <div className="lesson-loading-ring" />
        <span className="lesson-loading-icon">📖</span>
      </div>
      <p className="lesson-loading-msg">{MOTIVATIONAL[Math.floor(Date.now() / 1000) % MOTIVATIONAL.length]}</p>
      <div className="lesson-loading-bar"><div className="lesson-loading-bar-fill" /></div>
    </div>
  )

  if (!lesson) return (
    <div className="lesson-loading-screen">
      <p className="lesson-loading-msg">Lección no encontrada</p>
    </div>
  )

  const content = lesson.content || {}
  const step = STEPS[currentStep]
  const StepComponent = step.component
  const stepData = content[step.dataKey || step.key] || {}
  const isLast = currentStep === STEPS.length - 1
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100)
  const btnLabel = isLast ? 'Ver mis lecciones →' : 'Siguiente →'

  return (
    <>
      {/* ── Notifications (outside shell so they float) ── */}
      <XPNotification xp={25} show={showXP} />
      {stepToast && <div className="lesson-step-toast animate-fadeIn">{stepToast}</div>}
      {activeBadgeToast && (
        <div className="badge-toast animate-fadeIn">
          <span className="badge-toast-emoji">{activeBadgeToast.emoji}</span>
          <span className="badge-toast-text">
            <span className="badge-toast-label">🏅 ¡Nuevo logro!</span>
            <span className="badge-toast-name">{activeBadgeToast.name}</span>
          </span>
        </div>
      )}

      {/* ── Streak modal ── */}
      {showStreakModal && (() => {
        const STREAK_MESSAGES = [
          { min: 1, msg: '¡Gran comienzo! Cada día cuenta 💪', sub: 'Sigue aprendiendo para construir tu racha' },
          { min: 2, msg: '¡Vas en racha! No pares ahora 🚀', sub: 'La consistencia es la clave del éxito' },
          { min: 3, msg: '¡3 días seguidos! Eres imparable 🔥', sub: 'Los mejores resultados vienen con la práctica diaria' },
          { min: 5, msg: '¡5 días! Tu inglés está subiendo de nivel ⭐', sub: 'Los empleadores notan la diferencia' },
          { min: 7, msg: '¡Una semana completa! Eres un crack 🏆', sub: 'Tu futuro profesional te lo agradece' },
          { min: 14, msg: '¡2 semanas! Tu dedicación es inspiradora 👑', sub: 'Ya estás en otro nivel' },
          { min: 30, msg: '¡1 MES! Eres una leyenda 🌟', sub: 'Nada te detiene' },
        ]
        let streakMsg = STREAK_MESSAGES[0]
        for (let i = STREAK_MESSAGES.length - 1; i >= 0; i--) {
          if (streakCount >= STREAK_MESSAGES[i].min) { streakMsg = STREAK_MESSAGES[i]; break }
        }
        return (
          <div className="streak-overlay" onClick={handleStreakContinue}>
            <div className="streak-modal" onClick={e => e.stopPropagation()}>
              <div className="streak-confetti-wrap">
                {['🔥','⭐','🎉','✨','💪','🏆','🇺🇸','🎯'].map((e, i) => (
                  <span key={i} className="streak-confetti-piece" style={{ left: `${8 + (i * 12) % 84}%`, animationDelay: `${i * 0.18}s` }}>{e}</span>
                ))}
              </div>
              <div className="streak-fire-badge">🔥</div>
              <div className="streak-count-display">
                <span className="streak-number">{streakCount}</span>
                <span className="streak-unit">{streakCount === 1 ? 'día' : 'días'}</span>
              </div>
              <h2 className="streak-main-msg">{streakMsg.msg}</h2>
              <p className="streak-sub-msg">{streakMsg.sub}</p>
              <button className="streak-continue-btn" onClick={handleStreakContinue}>Continuar →</button>
            </div>
          </div>
        )
      })()}

      {/* ── Main shell ── */}
      <div className="lesson-shell">
        {/* Fixed header */}
        <div className="lesson-header-fixed">
          <div className="lesson-header-top">
            <button className="lesson-back-btn" onClick={() => {
              const routeId = lesson.modules?.route_id || lesson.modules?.routes?.id
              routeId ? navigate(`/ruta/${routeId}`) : navigate('/dashboard')
            }}>←</button>
            <span className="lesson-title-fixed">{lesson.title}</span>
          </div>
          <div className="lesson-dots-row">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                className={`lesson-dot-new ${i === currentStep ? 'active' : i < currentStep ? 'done' : ''}`}
                onClick={() => i < currentStep && goToStep(i)}
                title={`${s.icon} ${s.label}${i < currentStep ? ' — toca para volver' : ''}`}
                style={{ width: i === currentStep ? 24 : 10 }}
              />
            ))}
          </div>
          <div className="lesson-progress-bar-fixed">
            <div className="lesson-progress-fill-fixed" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Step label */}
        <div className="lesson-step-label">{step.icon} {step.label}</div>

        {/* Scrollable body (overflow: hidden) */}
        <div className="lesson-body">
          <StepComponent
            data={stepData}
            lessonId={lessonId}
            onComplete={isLast ? handleLessonComplete : undefined}
            onCanAdvance={setCanAdvance}
          />
        </div>

        {/* Fixed footer button */}
        <div className="lesson-footer-fixed">
          <button
            className="lesson-next-btn"
            onClick={handleNext}
            disabled={!canAdvance}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </>
  )
}
