import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Card, CardBody } from '../../components/common/Card'
import { Badge, ProgressBar } from '../../components/common/Badge'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import './Progress.css'

export default function Progress() {
  const { profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProgress() }, [profile])

  async function loadProgress() {
    try {
      const { data: routes } = await supabase
        .from('routes')
        .select('*, modules(id, title, lessons(id))')
        .order('sort_order')

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', profile?.id)

      const completed = new Set((progressData || []).filter(p => p.completed).map(p => p.lesson_id))

      const routeStats = (routes || []).map(route => {
        const totalLessons = route.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0
        const completedLessons = route.modules?.reduce((s, m) =>
          s + (m.lessons?.filter(l => completed.has(l.id)).length || 0), 0) || 0
        return {
          ...route,
          totalLessons,
          completedLessons,
          percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        }
      })

      const totalAll = routeStats.reduce((s, r) => s + r.totalLessons, 0)
      const completedAll = routeStats.reduce((s, r) => s + r.completedLessons, 0)

      setStats({ routes: routeStats, totalAll, completedAll })
    } catch (err) {
      console.error('Error loading progress:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="progress-page"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
  }

  const overallPercent = stats?.totalAll ? Math.round((stats.completedAll / stats.totalAll) * 100) : 0

  return (
    <div className="progress-page animate-fadeIn">
      <h1 style={{ marginBottom: 'var(--space-5)' }}>Mi Progreso</h1>

      {/* Overall stats */}
      <div className="progress-stats-grid">
        <Card className="progress-stat-card">
          <CardBody>
            <div className="progress-stat-number">{stats?.completedAll || 0}</div>
            <div className="progress-stat-label">Lecciones completadas</div>
          </CardBody>
        </Card>
        <Card className="progress-stat-card">
          <CardBody>
            <div className="progress-stat-number">{overallPercent}%</div>
            <div className="progress-stat-label">Progreso total</div>
          </CardBody>
        </Card>
      </div>

      {/* Progress by route */}
      <h3 style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>Por ruta</h3>
      <div className="progress-routes">
        {stats?.routes.map(route => (
          <Card key={route.id}>
            <CardBody>
              <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-2)' }}>
                <h4>{route.title}</h4>
                <Badge variant={route.percent === 100 ? 'green' : route.percent > 0 ? 'blue' : 'gray'}>
                  {route.percent}%
                </Badge>
              </div>
              <ProgressBar value={route.completedLessons} max={route.totalLessons || 1} />
              <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
                {route.completedLessons} de {route.totalLessons} lecciones
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Streak / motivation */}
      <Card className="progress-motivation" style={{ marginTop: 'var(--space-6)' }}>
        <CardBody>
          <div className="text-center">
            <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>
              {overallPercent >= 100 ? '🏆' : overallPercent >= 50 ? '🔥' : overallPercent > 0 ? '💪' : '🚀'}
            </div>
            <p className="font-semibold">
              {overallPercent >= 100
                ? '¡Completaste todas las lecciones! 🎉'
                : overallPercent >= 50
                ? '¡Vas a más de la mitad! Sigue así.'
                : overallPercent > 0
                ? '¡Buen inicio! Cada lección te acerca a tu meta.'
                : 'Empieza tu primera lección hoy'}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
