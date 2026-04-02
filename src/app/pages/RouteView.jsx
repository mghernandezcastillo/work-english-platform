import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Card, CardBody } from '../../components/common/Card'
import { Badge, ProgressBar } from '../../components/common/Badge'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { CertificateModal } from '../../components/common/CertificateModal'
import './RouteView.css'

export default function RouteView() {
  const { routeId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [route, setRoute] = useState(null)
  const [modules, setModules] = useState([])
  const [completedLessons, setCompletedLessons] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [shakingLesson, setShakingLesson] = useState(null)
  const [lockedToast, setLockedToast] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    loadRoute()
  }, [routeId, profile])

  async function loadRoute() {
    try {
      const { data: routeData } = await supabase
        .from('routes')
        .select('*')
        .eq('id', routeId)
        .single()

      const { data: moduleData } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .eq('route_id', routeId)
        .order('sort_order')

      // Sort lessons within each module
      if (moduleData) {
        moduleData.forEach(m => {
          m.lessons?.sort((a, b) => a.sort_order - b.sort_order)
        })
      }

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', profile?.id)
        .eq('route_id', routeId)
        .eq('completed', true)

      const completed = new Set((progressData || []).map(p => p.lesson_id))

      setRoute(routeData)
      setModules(moduleData || [])
      setCompletedLessons(completed)
    } catch (err) {
      console.error('Error loading route:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleLockedClick(lessonId) {
    setShakingLesson(lessonId)
    setLockedToast(true)
    setTimeout(() => setShakingLesson(null), 600)
    setTimeout(() => setLockedToast(false), 2500)
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!route) return <div className="text-center" style={{ padding: 40 }}><h3>Ruta no encontrada</h3></div>

  const totalLessons = modules.reduce((s, m) => s + (m.lessons?.length || 0), 0)
  const isComplete = totalLessons > 0 && completedLessons.size === totalLessons

  return (
    <div className="route-view animate-fadeIn">
      {/* Certificate modal */}
      {showCertificate && (
        <CertificateModal
          userName={profile?.full_name || 'Estudiante'}
          routeName={route.title}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Locked lesson toast */}
      {lockedToast && (
        <div className="route-locked-toast">
          🔒 Completa la lección anterior primero 💪
        </div>
      )}
      {/* Header */}
      <button className="route-back" onClick={() => navigate('/dashboard')}>
        ← Volver
      </button>

      <div className="route-header">
        <h1>{route.title}</h1>
        <p className="text-muted text-sm" style={{ marginTop: 4 }}>{route.description}</p>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <ProgressBar
            value={completedLessons.size}
            max={totalLessons || 1}
            label={`${completedLessons.size} de ${totalLessons} lecciones`}
            showPercent
          />
        </div>
        {/* Certificate CTA — only when 100% */}
        {isComplete && (
          <button
            className="route-cert-btn"
            onClick={() => setShowCertificate(true)}
          >
            🏆 Ver mi certificado
          </button>
        )}
      </div>

      {/* Modules */}
      <div className="route-modules">
        {modules.map((mod, modIndex) => {
          const modLessons = mod.lessons || []
          const modCompleted = modLessons.filter(l => completedLessons.has(l.id)).length
          const allComplete = modCompleted === modLessons.length && modLessons.length > 0

          return (
            <div key={mod.id} className="route-module">
              <div className="route-module-header">
                <div className="route-module-number">{modIndex + 1}</div>
                <div className="flex-1">
                  <h4 className="route-module-title">{mod.title}</h4>
                  <span className="text-xs text-muted">{modCompleted}/{modLessons.length} lecciones</span>
                </div>
                {allComplete && <Badge variant="green">✓ Completado</Badge>}
              </div>

              <div className="route-lessons">
                {modLessons.map((lesson, lessonIndex) => {
                  const isCompleted = completedLessons.has(lesson.id)
                  const prevCompleted = lessonIndex === 0 || completedLessons.has(modLessons[lessonIndex - 1]?.id)
                  const isLocked = !prevCompleted && !isCompleted && lessonIndex > 0

                  return (
                    <Card
                      key={lesson.id}
                      hover={!isLocked}
                      onClick={() => isLocked ? handleLockedClick(lesson.id) : navigate(`/leccion/${lesson.id}`)}
                      className={`route-lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${shakingLesson === lesson.id ? 'shaking' : ''}`}
                    >
                      <CardBody>
                        <div className="flex items-center gap-3">
                          <div className={`route-lesson-status ${isCompleted ? 'done' : isLocked ? 'locked' : 'active'}`}>
                            {isCompleted ? '✓' : isLocked ? '🔒' : `${modIndex + 1}.${lessonIndex + 1}`}
                          </div>
                          <div className="flex-1">
                            <span className={`route-lesson-title ${isLocked ? 'text-muted' : ''}`}>
                              {lesson.title}
                            </span>
                          </div>
                          {!isLocked && <span className="route-lesson-arrow">→</span>}
                        </div>
                      </CardBody>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Simulations CTA */}
      <Card className="route-sim-cta" hover onClick={() => navigate(`/simulacion/${routeId}`)}>
        <CardBody>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 28 }}>🎯</span>
            <div>
              <h4>Simulaciones prácticas</h4>
              <p className="text-xs text-muted">Pon en práctica lo aprendido en situaciones reales</p>
            </div>
            <span style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--text-xl)' }}>→</span>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
