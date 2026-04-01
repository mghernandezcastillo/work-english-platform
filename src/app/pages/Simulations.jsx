import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import './Simulations.css'

const ROUTE_META = {
  1: { emoji: '💼', color: '#3B82F6', label: 'Conseguir Trabajo' },
  2: { emoji: '🎤', color: '#8B5CF6', label: 'Entrevistas' },
  3: { emoji: '📞', color: '#10B981', label: 'Call Center' },
}

export default function Simulations() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [simsByRoute, setSimsByRoute] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedSims, setCompletedSims] = useState(new Set())

  useEffect(() => { loadSimulations() }, [profile])

  async function loadSimulations() {
    try {
      const { data: sims } = await supabase
        .from('simulations')
        .select('id, title, description, route_id, sort_order')
        .order('route_id')
        .order('sort_order')

      const { data: routes } = await supabase
        .from('routes')
        .select('id, title, sort_order')
        .order('sort_order')

      const { data: progress } = await supabase
        .from('user_simulation_progress')
        .select('simulation_id')
        .eq('user_id', profile?.id)
        .eq('completed', true)

      const completed = new Set((progress || []).map(p => p.simulation_id))
      setCompletedSims(completed)

      // Group simulations by route
      const grouped = (routes || []).map((route, idx) => ({
        route,
        meta: ROUTE_META[route.sort_order] || ROUTE_META[idx + 1] || { emoji: '📚', color: '#64748B', label: route.title },
        sims: (sims || []).filter(s => s.route_id === route.id),
      })).filter(g => g.sims.length > 0)

      setSimsByRoute(grouped)
    } catch (err) {
      console.error('Error loading simulations:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage />

  const totalSims = simsByRoute.reduce((s, g) => s + g.sims.length, 0)
  const completedCount = simsByRoute.reduce((s, g) => s + g.sims.filter(sim => completedSims.has(sim.id)).length, 0)

  return (
    <div className="sims-page animate-fadeIn">
      {/* Page header */}
      <div className="sims-header">
        <div className="sims-header-icon">🎧</div>
        <div>
          <h1 className="sims-title">Simulaciones</h1>
          <p className="sims-subtitle">
            Practica situaciones reales de trabajo en inglés. Elige tu respuesta en cada turno y recibe feedback inmediato.
          </p>
        </div>
      </div>

      {/* Progress summary */}
      {totalSims > 0 && (
        <div className="sims-progress-bar-wrap">
          <div className="sims-progress-meta">
            <span>{completedCount} de {totalSims} completadas</span>
            <span>{Math.round((completedCount / totalSims) * 100)}%</span>
          </div>
          <div className="sims-progress-track">
            <div
              className="sims-progress-fill"
              style={{ width: `${(completedCount / totalSims) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="sims-how-to">
        {[
          { icon: '👂', t: 'Escucha', d: 'Escucha lo que dice la otra persona' },
          { icon: '🤔', t: 'Elige', d: 'Selecciona la mejor respuesta' },
          { icon: '✅', t: 'Aprende', d: 'Recibe feedback con la explicación' },
        ].map(s => (
          <div key={s.t} className="sims-how-step">
            <span className="sims-how-icon">{s.icon}</span>
            <strong>{s.t}</strong>
            <span>{s.d}</span>
          </div>
        ))}
      </div>

      {/* Simulations grouped by route */}
      {simsByRoute.length === 0 ? (
        <div className="sims-empty">
          <div style={{ fontSize: 48 }}>🎧</div>
          <h3>Simulaciones próximamente</h3>
          <p>Estamos preparando las simulaciones. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="sims-groups">
          {simsByRoute.map(({ route, meta, sims }) => (
            <div key={route.id} className="sims-group">
              <div className="sims-group-header" style={{ '--route-color': meta.color }}>
                <span className="sims-group-emoji">{meta.emoji}</span>
                <div>
                  <div className="sims-group-route-label">Ruta:</div>
                  <div className="sims-group-route-title">{route.title}</div>
                </div>
              </div>

              <div className="sims-grid">
                {sims.map(sim => {
                  const done = completedSims.has(sim.id)
                  return (
                    <button
                      key={sim.id}
                      className={`sim-card ${done ? 'done' : ''}`}
                      onClick={() => navigate(`/simulacion/${sim.id}`)}
                      style={{ '--route-color': meta.color }}
                    >
                      <div className="sim-card-top">
                        <div className="sim-card-status">
                          {done
                            ? <span className="sim-badge done-badge">✓ Completada</span>
                            : <span className="sim-badge todo-badge">Empezar</span>
                          }
                        </div>
                        <span className="sim-card-emoji">{done ? '🏆' : meta.emoji}</span>
                      </div>
                      <h3 className="sim-card-title">{sim.title}</h3>
                      <p className="sim-card-desc">{sim.description}</p>
                      <div className="sim-card-footer">
                        <span>🎤 Práctica interactiva</span>
                        <span className="sim-card-arrow">→</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
