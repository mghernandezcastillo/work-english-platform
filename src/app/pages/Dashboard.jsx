import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Card, CardBody } from '../../components/common/Card'
import { Badge, ProgressBar } from '../../components/common/Badge'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import './Dashboard.css'

const routeMeta = {
  'route-1': { emoji: '💼', color: '#10B981' },
  'route-2': { emoji: '🎯', color: '#2563EB' },
  'route-3': { emoji: '🎧', color: '#F59E0B' },
}
function getRouteMeta(route) {
  if (routeMeta[route.id]) return routeMeta[route.id]
  const t = (route.title || '').toLowerCase()
  if (t.includes('entrevista')) return { emoji: '🎯', color: '#2563EB' }
  if (t.includes('call') || t.includes('customer')) return { emoji: '🎧', color: '#F59E0B' }
  return { emoji: '💼', color: '#10B981' }
}

/** Calculate consecutive day streak from user_progress records */
function calculateStreak(progressData) {
  if (!progressData || progressData.length === 0) return 0
  const completedDays = new Set(
    progressData
      .filter(p => p.completed && p.completed_at)
      .map(p => new Date(p.completed_at).toDateString())
  )
  if (completedDays.size === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    if (completedDays.has(d.toDateString())) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [progress, setProgress] = useState({})
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [profile])

  async function loadData() {
    try {
      const { data: routeData } = await supabase
        .from('routes')
        .select('*, modules(id, title, sort_order, lessons(id))')
        .order('sort_order')

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', profile?.id)

      const progressMap = {}
      if (progressData) {
        progressData.forEach(p => {
          if (!progressMap[p.route_id]) progressMap[p.route_id] = { completed: 0, total: 0 }
          progressMap[p.route_id].total++
          if (p.completed) progressMap[p.route_id].completed++
        })
      }

      setRoutes(routeData || [])
      setProgress(progressMap)
      setStreak(calculateStreak(progressData))
    } catch (err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalLessons = routes.reduce((sum, r) =>
    sum + (r.modules?.reduce((ms, m) => ms + (m.lessons?.length || 0), 0) || 0), 0)
  const completedLessons = Object.values(progress).reduce((sum, p) => sum + p.completed, 0)
  const firstName = profile?.full_name?.split(' ')[0] || 'Estudiante'

  return (
    <div className="dashboard animate-fadeIn">
      {/* Greeting + Streak */}
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1 className="dashboard-hello">Hola, {firstName} 👋</h1>
          <p className="text-muted text-sm">¿Listo para practicar hoy?</p>
        </div>
        {streak > 0 && (
          <div className="dashboard-streak">
            <span className="streak-fire">🔥</span>
            <div>
              <span className="streak-count">{streak}</span>
              <span className="streak-label">{streak === 1 ? 'día' : 'días'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <Card className="dashboard-progress-card">
        <CardBody>
          <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-3)' }}>
            <span className="text-sm font-semibold">Tu progreso general</span>
            <Badge variant="green">{completedLessons} de {totalLessons} lecciones</Badge>
          </div>
          <ProgressBar
            value={completedLessons}
            max={totalLessons || 1}
            showPercent
          />
        </CardBody>
      </Card>

      {/* Routes */}
      <h3 style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
        Elige tu ruta
      </h3>

      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="dashboard-routes">
          {routes.map(route => {
            const meta = getRouteMeta(route)
            const moduleCount = route.modules?.length || 0
            const lessonCount = route.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0
            const routeProgress = progress[route.id]
            const completed = routeProgress?.completed || 0

            return (
              <Card
                key={route.id}
                hover
                onClick={() => navigate(`/ruta/${route.id}`)}
                className="dashboard-route-card"
              >
                <CardBody>
                  <div className="flex items-start gap-3">
                    <div
                      className="dashboard-route-icon"
                      style={{ background: `${meta.color}15`, color: meta.color }}
                    >
                      {meta.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 style={{ marginBottom: 2 }}>{route.title}</h4>
                      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)' }}>
                        {moduleCount} módulos · {lessonCount} lecciones
                      </p>
                      <ProgressBar
                        value={completed}
                        max={lessonCount || 1}
                        showPercent
                      />
                    </div>
                    <span className="dashboard-route-arrow">→</span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quick tip */}
      <div className="dashboard-tip">
        <span className="dashboard-tip-emoji">💡</span>
        <p className="text-sm">
          <strong>Consejo:</strong> Practica 15 minutos al día. La constancia importa más que la intensidad.
        </p>
      </div>
    </div>
  )
}
