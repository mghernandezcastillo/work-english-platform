import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { useToast } from '../../components/common/Toast'
import './AdminUsers.css'

const ACCESS_OPTIONS = ['none', 'beta', 'paid', 'unlimited']
const accessVariant = { none: 'gray', beta: 'blue', paid: 'green', unlimited: 'green' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const { toast, showToast, Toast: ToastComponent } = useToast()

  // Quick access form
  const [showQuickAccess, setShowQuickAccess] = useState(false)
  const [quickForm, setQuickForm] = useState({ email: '', fullName: '' })
  const [quickLoading, setQuickLoading] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filter !== 'all') query = query.eq('access_type', filter)

    const { data } = await query
    setUsers(data || [])
    setLoading(false)
  }, [filter])

  useEffect(() => { loadUsers() }, [loadUsers])

  const filtered = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  async function changeAccess(userId, newAccess) {
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ access_type: newAccess }).eq('id', userId)
    if (!error) {
      showToast(`Acceso cambiado a ${newAccess}`, 'success')
      setSelected(null)
      loadUsers()
    } else {
      showToast('Error al actualizar', 'error')
    }
    setSaving(false)
  }

  async function toggleAdmin(userId, isAdmin) {
    await supabase.from('profiles').update({ is_admin: !isAdmin }).eq('id', userId)
    showToast(isAdmin ? 'Admin removido' : 'Admin asignado', 'success')
    loadUsers()
  }

  async function handleQuickAccess(e) {
    e.preventDefault()
    if (!quickForm.email || !/\S+@\S+\.\S+/.test(quickForm.email)) {
      showToast('Email inválido', 'error')
      return
    }
    setQuickLoading(true)
    try {
      // Call the Edge Function to create/upgrade user
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: quickForm.email.trim().toLowerCase(),
          fullName: quickForm.fullName.trim() || undefined,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error del servidor')

      showToast(result.message || '¡Acceso otorgado!', 'success')
      setShowQuickAccess(false)
      setQuickForm({ email: '', fullName: '' })
      loadUsers()
    } catch (err) {
      showToast(err.message || 'Error al crear acceso', 'error')
    } finally {
      setQuickLoading(false)
    }
  }

  return (
    <div className="admin-users">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-5)' }}>
        <h1>👥 Usuarios</h1>
        <div className="flex gap-3 items-center">
          <Badge variant="gray">{filtered.length} usuarios</Badge>
          <Button variant="primary" size="sm" onClick={() => setShowQuickAccess(true)}>
            ➕ Dar acceso rápido
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-users-filters">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {['all', 'none', 'beta', 'paid', 'unlimited'].map(f => (
            <button
              key={f}
              className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <div className="admin-table">
          <div className="admin-users-header">
            <span>Nombre</span>
            <span>Email</span>
            <span>Acceso</span>
            <span>Admin</span>
            <span>Registro</span>
            <span>Acciones</span>
          </div>
          {loading ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Cargando...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No hay usuarios
            </div>
          ) : filtered.map(u => (
            <div key={u.id} className="admin-users-row">
              <span className="font-medium">{u.full_name || '—'}</span>
              <span className="text-sm text-muted">{u.email}</span>
              <Badge variant={accessVariant[u.access_type] || 'gray'}>{u.access_type}</Badge>
              <span>{u.is_admin ? '✅' : '—'}</span>
              <span className="text-sm text-muted">{new Date(u.created_at).toLocaleDateString('es-CO')}</span>
              <Button variant="outline" size="sm" onClick={() => setSelected(u)}>Gestionar</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Manage user modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Gestionar: ${selected?.full_name || selected?.email}`}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted">Cambiar tipo de acceso:</p>
              <div className="flex flex-col gap-2" style={{ marginTop: 'var(--space-2)' }}>
                {ACCESS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`admin-access-btn ${selected.access_type === opt ? 'active' : ''}`}
                    onClick={() => changeAccess(selected.id, opt)}
                    disabled={saving}
                  >
                    <Badge variant={accessVariant[opt] || 'gray'}>{opt}</Badge>
                    {selected.access_type === opt && ' ← actual'}
                  </button>
                ))}
              </div>
            </div>
            <div className="divider" />
            <Button
              variant="ghost"
              onClick={() => toggleAdmin(selected.id, selected.is_admin)}
              style={{ color: selected.is_admin ? 'var(--color-error)' : 'var(--color-secondary)' }}
            >
              {selected.is_admin ? '❌ Remover admin' : '✅ Hacer admin'}
            </Button>
          </div>
        )}
      </Modal>

      {/* Quick Access modal */}
      <Modal isOpen={showQuickAccess} onClose={() => setShowQuickAccess(false)} title="➕ Dar acceso rápido">
        <form onSubmit={handleQuickAccess} className="flex flex-col gap-4">
          <p className="text-sm text-muted" style={{ lineHeight: 1.5 }}>
            Ingresa el email de la persona. Si ya tiene cuenta, se le otorgará acceso <strong>paid</strong>.
            Si no tiene cuenta, se creará una y recibirá un email con un enlace para crear su contraseña.
          </p>
          <Input
            label="Email"
            type="email"
            placeholder="ejemplo@gmail.com"
            value={quickForm.email}
            onChange={e => setQuickForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Nombre completo (opcional)"
            type="text"
            placeholder="Solo si es cuenta nueva"
            value={quickForm.fullName}
            onChange={e => setQuickForm(f => ({ ...f, fullName: e.target.value }))}
          />
          <Button type="submit" variant="primary" full loading={quickLoading}>
            Dar acceso paid
          </Button>
        </form>
      </Modal>

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
