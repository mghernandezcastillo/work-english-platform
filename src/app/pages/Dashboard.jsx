import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { RoutesLoader } from '../../components/common/RoutesLoader'
import { DailyPhrase } from '../../components/common/DailyPhrase'
import { FirstMissionBanner } from '../../components/common/FirstMissionBanner'
import { BadgesPanel } from '../../components/common/BadgesPanel'
import './Dashboard.css'

const routeMeta = {
  'route-1': { emoji: '💼', color: '#10B981', glow: 'rgba(16,185,129,0.25)' },
  'route-2': { emoji: '🎯', color: '#3B82F6', glow: 'rgba(59,130,246,0.25)' },
  'route-3': { emoji: '🎧', color: '#F59E0B', glow: 'rgba(245,158,11,0.25)' },
}
function getRouteMeta(route) {
  if (routeMeta[route.id]) return routeMeta[route.id]
  const t = (route.title || '').toLowerCase()
  if (t.includes('entrevista')) return { emoji: '🎯', color: '#3B82F6', glow: 'rgba(59,130,246,0.25)' }
  if (t.includes('call') || t.includes('customer')) return { emoji: '🎧', color: '#F59E0B', glow: 'rgba(245,158,11,0.25)' }
  return { emoji: '💼', color: '#10B981', glow: 'rgba(16,185,129,0.25)' }
}

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

/** Animated SVG circular progress ring */
function ProgressRing({ value, max, size = 180, stroke = 14 }) {
  const ringRef = useRef(null)
  const pct = max > 0 ? Math.min(value / max, 1) : 0
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  useEffect(() => {
    if (!ringRef.current) return
    ringRef.current.style.strokeDashoffset = circ
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (ringRef.current) {
          ringRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
          ringRef.current.style.strokeDashoffset = offset
        }
      })
    })
    return () => cancelAnimationFrame(timer)
  }, [offset, circ])

  return (
    <svg width={size} height={size} className="progress-ring-svg">
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="rgba(59,130,246,0.12)"
        strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        ref={ringRef}
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter="url(#ring-glow)"
      />
    </svg>
  )
}

/** Slim route progress bar */
function SlimBar({ value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="slim-bar-track">
      <div
        className="slim-bar-fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

export default function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [progress, setProgress] = useState({})
  const [rawProgress, setRawProgress] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showResetOverlay, setShowResetOverlay] = useState(false)
  const [nextLesson, setNextLesson] = useState(null)

  // Detect "just reset" flag from Profile
  useEffect(() => {
    if (sessionStorage.getItem('just_reset') === '1') {
      sessionStorage.removeItem('just_reset')
      setShowResetOverlay(true)
      setTimeout(() => setShowResetOverlay(false), 2200)
    }
  }, [])

  useEffect(() => { loadData() }, [profile])

  async function loadData() {
    try {
      const { data: routeData } = await supabase
        .from('routes')
        .select('*, modules(id, title, sort_order, lessons(id, title, sort_order))')
        .order('sort_order')

      // Only query progress if we have a valid user ID
      let progressData = null
      if (profile?.id) {
        const resp = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', profile.id)
        progressData = resp.data
      }

      const progressMap = {}
      const completedSet = new Set()
      if (progressData) {
        progressData.forEach(p => {
          if (!progressMap[p.route_id]) progressMap[p.route_id] = { completed: 0, total: 0 }
          progressMap[p.route_id].total++
          if (p.completed) {
            progressMap[p.route_id].completed++
            completedSet.add(p.lesson_id)
          }
        })
      }

      // Find the next uncompleted lesson across all routes
      let found = null
      for (const route of (routeData || []).sort((a, b) => a.sort_order - b.sort_order)) {
        const sortedModules = (route.modules || []).sort((a, b) => a.sort_order - b.sort_order)
        for (const mod of sortedModules) {
          const sortedLessons = (mod.lessons || []).sort((a, b) => a.sort_order - b.sort_order)
          for (const lesson of sortedLessons) {
            if (!completedSet.has(lesson.id)) {
              found = { lessonId: lesson.id, lessonTitle: lesson.title, routeId: route.id, routeTitle: route.title }
              break
            }
          }
          if (found) break
        }
        if (found) break
      }
      setNextLesson(found)

      setRoutes(routeData || [])
      setProgress(progressMap)
      setRawProgress(progressData || [])
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
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const firstName = profile?.full_name?.split(' ')[0] || 'Estudiante'

  // Daily goal — count lessons completed today
  const todayStr = new Date().toDateString()
  const todayLessons = rawProgress.filter(
    p => p.completed && p.completed_at && new Date(p.completed_at).toDateString() === todayStr
  ).length

  return (
    <div className="dashboard mc-dashboard animate-fadeIn">

      {/* ── Reset animation overlay ── */}
      {showResetOverlay && (
        <div className="reset-overlay">
          <div className="reset-modal">
            <div className="reset-icon">🔄</div>
            <div className="reset-counters">
              <div className="reset-counter-row">
                <span>📚 Lecciones</span>
                <span className="reset-zero">→ 0</span>
              </div>
              <div className="reset-counter-row">
                <span>⭐ XP</span>
                <span className="reset-zero">→ 0</span>
              </div>
              <div className="reset-counter-row">
                <span>🔥 Racha</span>
                <span className="reset-zero">→ 0</span>
              </div>
              <div className="reset-counter-row">
                <span>🏆 Badges</span>
                <span className="reset-zero">→ 0</span>
              </div>
            </div>
            <p className="reset-msg">¡Todo listo! Empiezas desde cero</p>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="mc-header">
        <div className="mc-greeting">
          <h1 className="mc-hello">Hola, {firstName} 👋</h1>
          <p className="mc-subtitle">¿Listo para tu misión de hoy?</p>
        </div>
        {streak > 0 && (
          <div className="mc-streak-badge">
            <span className="mc-streak-fire">🔥</span>
            <div>
              <span className="mc-streak-num">{streak}</span>
              <span className="mc-streak-lbl">{streak === 1 ? 'día' : 'días'}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── XP Bar ── */}
      <div className="mc-xp-bar">
        <span className="mc-xp-icon">⭐</span>
        <span className="mc-xp-label">{profile?.xp ?? 0} XP</span>
        <div className="mc-xp-track">
          <div
            className="mc-xp-fill"
            style={{ width: `${Math.min(((profile?.xp ?? 0) % 100), 100)}%` }}
          />
        </div>
        <span className="mc-xp-next">Siguiente nivel: {100 - ((profile?.xp ?? 0) % 100)} XP</span>
      </div>

      {/* ── Meta diaria ── */}
      <div className="mc-daily-goal">
        <span className="mc-daily-icon">🎯</span>
        <span className="mc-daily-label">Meta hoy:</span>
        <div className="mc-daily-track">
          <div
            className="mc-daily-fill"
            style={{ width: todayLessons >= 1 ? '100%' : '0%' }}
          />
        </div>
        <span className="mc-daily-count">{Math.min(todayLessons, 1)}/1 lección</span>
        {todayLessons >= 1 && <span className="mc-daily-done">✅</span>}
      </div>

      {/* ── Progress Ring Hero ── */}
      <div className="mc-hero">
        <div className="mc-ring-wrap">
          <ProgressRing value={completedLessons} max={totalLessons || 1} />
          <div className="mc-ring-inner">
            <span className="mc-ring-num">{completedLessons}</span>
            <span className="mc-ring-of">de {totalLessons}</span>
            <span className="mc-ring-label">lecciones</span>
          </div>
        </div>
        <div className="mc-hero-info">
          <div className="mc-pct-badge">{pct}% completado</div>
          <p className="mc-hero-msg">
            {pct === 0 && '¡Empieza tu primera misión! 🚀'}
            {pct > 0 && pct < 30 && 'Vas arrancando motores 🚀'}
            {pct >= 30 && pct < 60 && 'Vas por buen camino 💪'}
            {pct >= 60 && pct < 90 && '¡Casi en la cima! 🔭'}
            {pct >= 90 && '¡Misión casi completa! 🏆'}
          </p>
        </div>
      </div>

      {/* ── Continue learning card — shows next lesson for returning users ── */}
      {!loading && nextLesson && completedLessons > 0 && pct < 100 && (
        <button
          className="mc-continue-card"
          onClick={() => navigate(`/leccion/${nextLesson.lessonId}`)}
        >
          <div className="mc-continue-icon">▶</div>
          <div className="mc-continue-body">
            <span className="mc-continue-label">Continuar aprendiendo</span>
            <span className="mc-continue-title">{nextLesson.lessonTitle}</span>
            <span className="mc-continue-route">{nextLesson.routeTitle}</span>
          </div>
          <span className="mc-route-arrow">›</span>
        </button>
      )}

      {/* ── Routes ── */}
      <h3 className="mc-section-title">Elige tu ruta</h3>

      {/* First-time user nudge — only when 0% and loaded */}
      {!loading && pct === 0 && routes.length > 0 && (
        <FirstMissionBanner firstRoute={routes[0]} />
      )}

      {loading ? (
        <RoutesLoader />
      ) : (
        <div className="mc-routes">
          {routes.map(route => {
            const meta = getRouteMeta(route)
            const lessonCount = route.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0
            const completed = progress[route.id]?.completed || 0

            return (
              <button
                key={route.id}
                className="mc-route-card"
                onClick={() => navigate(`/ruta/${route.id}`)}
                style={{ '--accent': meta.color, '--accent-glow': meta.glow }}
              >
                <div className="mc-route-left-bar" />
                <div className="mc-route-icon-pill" style={{ background: `${meta.color}20`, color: meta.color }}>
                  {meta.emoji}
                </div>
                <div className="mc-route-body">
                  <h4 className="mc-route-name">{route.title}</h4>
                  <p className="mc-route-meta">{completed}/{lessonCount} lecciones</p>
                  <SlimBar value={completed} max={lessonCount || 1} color={meta.color} />
                </div>
                <span className="mc-route-arrow">›</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Frase del día ── */}
      <DailyPhrase />

      {/* ── Flashcards shortcut ── */}
      <button
        className="mc-flashcards-btn"
        onClick={() => navigate('/flashcards')}
      >
        <span className="mc-flashcards-icon">🧠</span>
        <div className="mc-flashcards-body">
          <span className="mc-flashcards-title">Tarjetas de memoria</span>
          <span className="mc-flashcards-sub">Repasa el vocabulario guardado</span>
        </div>
        <span className="mc-route-arrow">›</span>
      </button>

      {/* ── Logros / Badges ── */}
      <BadgesPanel />
    </div>
  )
}
