import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { SkeletonCard } from '../../components/common/LoadingSpinner'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentUsers, setRecentUsers] = useState([])

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    try {
      const [
        { count: totalUsers },
        { count: betaUsers },
        { count: paidUsers },
        { count: completions },
        { data: recent },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('access_type', 'beta'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).in('access_type', ['paid', 'unlimited']),
        supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('completed', true),
        supabase.from('profiles').select('id,full_name,email,access_type,created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({ totalUsers, betaUsers, paidUsers, completions })
      setRecentUsers(recent || [])
    } catch (err) {
      console.error('Error loading admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const accessVariant = { none: 'gray', beta: 'blue', paid: 'green', unlimited: 'green' }
  const accessLabel = { none: 'Sin acceso', beta: 'Beta', paid: 'Pagado', unlimited: 'Ilimitado' }

  return (
    <div className="admin-dashboard">
      <h1 style={{ marginBottom: 'var(--space-6)' }}>📊 Dashboard Admin</h1>

      {loading ? (
        <div className="admin-stats-grid">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="admin-stats-grid">
          <Card><CardBody>
            <div className="admin-stat-number">{stats?.totalUsers || 0}</div>
            <div className="admin-stat-label">Total usuarios</div>
          </CardBody></Card>
          <Card><CardBody>
            <div className="admin-stat-number" style={{ color: 'var(--color-secondary)' }}>{stats?.betaUsers || 0}</div>
            <div className="admin-stat-label">Acceso beta</div>
          </CardBody></Card>
          <Card><CardBody>
            <div className="admin-stat-number" style={{ color: 'var(--color-primary)' }}>{stats?.paidUsers || 0}</div>
            <div className="admin-stat-label">Usuarios pagos</div>
          </CardBody></Card>
          <Card><CardBody>
            <div className="admin-stat-number">{stats?.completions || 0}</div>
            <div className="admin-stat-label">Lecciones completadas</div>
          </CardBody></Card>
        </div>
      )}

      {/* Recent users */}
      <h3 style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
        Usuarios recientes
      </h3>
      <Card>
        <div className="admin-table">
          <div className="admin-table-header">
            <span>Nombre</span>
            <span>Email</span>
            <span>Acceso</span>
            <span>Registro</span>
          </div>
          {recentUsers.map(u => (
            <div key={u.id} className="admin-table-row">
              <span className="font-medium">{u.full_name || '—'}</span>
              <span className="text-sm text-muted">{u.email}</span>
              <Badge variant={accessVariant[u.access_type] || 'gray'}>
                {accessLabel[u.access_type] || u.access_type}
              </Badge>
              <span className="text-sm text-muted">
                {new Date(u.created_at).toLocaleDateString('es-CO')}
              </span>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No hay usuarios aún
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
