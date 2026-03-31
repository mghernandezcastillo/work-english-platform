import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Card, CardBody } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { useToast } from '../../components/common/Toast'
import { brand } from '../../lib/brand'
import './AdminBeta.css'

export default function AdminBeta() {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast, showToast, Toast: ToastComponent } = useToast()

  useEffect(() => { loadInvites() }, [])

  async function loadInvites() {
    const { data } = await supabase
      .from('beta_invites')
      .select('*, profiles:used_by(full_name, email)')
      .order('created_at', { ascending: false })
    setInvites(data || [])
    setLoading(false)
  }

  async function createInvite() {
    setCreating(true)
    const token = `BETA-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    const expires = new Date()
    expires.setDate(expires.getDate() + 30)

    const { error } = await supabase.from('beta_invites').insert({
      token,
      expires_at: expires.toISOString(),
    })

    if (!error) {
      showToast('Invitación creada', 'success')
      loadInvites()
    } else {
      showToast('Error al crear', 'error')
    }
    setCreating(false)
  }

  function copyLink(token) {
    const url = `${window.location.origin}/registro?token=${token}`
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copiado al portapapeles', 'success')
    })
  }

  const registerBase = `${window.location.origin}/registro?token=`
  const unusedCount = invites.filter(i => !i.used_by).length

  return (
    <div className="admin-beta">
      <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-5)' }}>
        <h1>🔑 Acceso Beta</h1>
        <Button variant="primary" loading={creating} onClick={createInvite}>
          + Crear invitación
        </Button>
      </div>

      {/* Stats */}
      <div className="beta-stats">
        <Card><CardBody>
          <div className="admin-stat-number">{invites.length}</div>
          <div className="admin-stat-label">Total tokens</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="admin-stat-number" style={{ color: 'var(--color-primary)' }}>{unusedCount}</div>
          <div className="admin-stat-label">Disponibles</div>
        </CardBody></Card>
        <Card><CardBody>
          <div className="admin-stat-number" style={{ color: 'var(--color-secondary)' }}>{invites.length - unusedCount}</div>
          <div className="admin-stat-label">Usados</div>
        </CardBody></Card>
      </div>

      {/* Invites list */}
      <Card style={{ marginTop: 'var(--space-5)' }}>
        {loading ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>Cargando...</div>
        ) : invites.length === 0 ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p>No hay tokens. Crea uno con el botón de arriba.</p>
          </div>
        ) : invites.map(inv => (
          <div key={inv.id} className="beta-invite-row">
            <div className="beta-invite-left">
              <code className="beta-token">{inv.token}</code>
              {inv.expires_at && (
                <span className="text-xs text-muted">
                  Vence: {new Date(inv.expires_at).toLocaleDateString('es-CO')}
                </span>
              )}
            </div>
            <div className="beta-invite-mid">
              {inv.used_by ? (
                <div>
                  <Badge variant="gray">Usado</Badge>
                  <p className="text-xs text-muted" style={{ marginTop: 2 }}>
                    {inv.profiles?.full_name || inv.profiles?.email || 'Usuario'}
                  </p>
                </div>
              ) : (
                <Badge variant="green">Disponible</Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyLink(inv.token)}
              disabled={!!inv.used_by}
            >
              📋 Copiar link
            </Button>
          </div>
        ))}
      </Card>

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
