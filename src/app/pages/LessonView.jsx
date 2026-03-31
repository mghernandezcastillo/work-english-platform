import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { Button } from '../../components/common/Button'
import ObjectiveStep from '../../components/learning/steps/ObjectiveStep'
import PhrasesStep from '../../components/learning/steps/PhrasesStep'
import MiniExampleStep from '../../components/learning/steps/MiniExampleStep'
import ExplanationStep from '../../components/learning/steps/ExplanationStep'
import ExerciseStep from '../../components/learning/steps/ExerciseStep'
import GuidedPracticeStep from '../../components/learning/steps/GuidedPracticeStep'
import ReinforcementStep from '../../components/learning/steps/ReinforcementStep'
import './LessonView.css'

const STEPS = [
  { key: 'objective', label: 'Objetivo', icon: '🎯', component: ObjectiveStep },
  { key: 'phrases', label: 'Frases', icon: '💬', component: PhrasesStep },
  { key: 'examples', label: 'Ejemplos', icon: '📝', component: MiniExampleStep },
  { key: 'explanation', label: 'Explicación', icon: '💡', component: ExplanationStep },
  { key: 'exercises', label: 'Ejercicios', icon: '✏️', component: ExerciseStep },
  { key: 'practice', label: 'Práctica', icon: '🗣️', component: GuidedPracticeStep },
  { key: 'reinforcement', label: 'Repaso', icon: '🏆', component: ReinforcementStep },
]

export default function LessonView() {
  const { lessonId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      setCurrentStep(0)
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

  async function handleLessonComplete() {
    // Wait for progress to save BEFORE navigating
    const saved = await markComplete()
    if (!saved) {
      console.warn('Progress may not have been saved')
    }
    // Small delay to ensure DB write completes
    await new Promise(r => setTimeout(r, 300))
    const routeId = lesson.modules?.route_id || lesson.modules?.routes?.id
    if (routeId) navigate(`/ruta/${routeId}`)
    else navigate('/dashboard')
  }

  function goToStep(index) {
    if (index >= 0 && index < STEPS.length) {
      setCurrentStep(index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!lesson) return <div className="text-center" style={{ padding: 40 }}><h3>Lección no encontrada</h3></div>

  const content = lesson.content || {}
  const step = STEPS[currentStep]
  const StepComponent = step.component
  const stepData = content[step.key] || {}
  const isLast = currentStep === STEPS.length - 1
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100)

  return (
    <div className="lesson-view animate-fadeIn">
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

      {/* Step content */}
      <div className="lesson-content">
        <StepComponent
          data={stepData}
          onComplete={isLast ? handleLessonComplete : undefined}
        />
      </div>

      {/* Navigation */}
      {!isLast && (
        <div className="lesson-nav">
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
      )}
    </div>
  )
}
