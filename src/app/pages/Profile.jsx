import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { updateProfile, signOut } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { brand } from '../../lib/brand'
import { Card, CardBody } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { useToast } from '../../components/common/Toast'
import { Badge } from '../../components/common/Badge'
import './Profile.css'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const { toast, showToast, Toast: ToastComponent } = useToast()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile(user.id, { full_name: fullName })
      await refreshProfile()
      setEditing(false)
      showToast('Perfil actualizado', 'success')
    } catch (err) {
      showToast('Error al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  async function handleResetProgress() {
    setResetting(true)
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
      if (error) throw error
      showToast('Progreso reiniciado desde cero 🔄', 'success')
      setShowResetConfirm(false)
    } catch (err) {
      showToast('Error al reiniciar: ' + err.message, 'error')
    } finally {
      setResetting(false)
    }
  }

  const accessLabels = {
    'none': { text: 'Sin acceso', variant: 'gray' },
    'beta': { text: 'Acceso Beta', variant: 'blue' },
    'paid': { text: 'Acceso Completo', variant: 'green' },
    'unlimited': { text: 'Acceso Ilimitado', variant: 'green' },
  }
  const access = accessLabels[profile?.access_type] || accessLabels.none

  const initials = (profile?.full_name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="profile-page animate-fadeIn">
      <h1 style={{ marginBottom: 'var(--space-5)' }}>Mi Perfil</h1>

      {/* Avatar + Name */}
      <Card>
        <CardBody>
          <div className="profile-header">
            <div className="avatar avatar-lg">{initials}</div>
            <div>
              <h3>{profile?.full_name || 'Usuario'}</h3>
              <p className="text-sm text-muted">{user?.email}</p>
              <Badge variant={access.variant}>{access.text}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit name */}
      <Card style={{ marginTop: 'var(--space-3)' }}>
        <CardBody>
          <h4 style={{ marginBottom: 'var(--space-3)' }}>Información personal</h4>
          {editing ? (
            <div className="flex flex-col gap-3">
              <Input
                label="Nombre completo"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="primary" loading={saving} onClick={handleSave}>Guardar</Button>
                <Button variant="ghost" onClick={() => { setEditing(false); setFullName(profile?.full_name || '') }}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted">Nombre</p>
                <p className="font-medium">{profile?.full_name}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar</Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Account info */}
      <Card style={{ marginTop: 'var(--space-3)' }}>
        <CardBody>
          <h4 style={{ marginBottom: 'var(--space-3)' }}>Cuenta</h4>
          <div className="profile-info-row">
            <span className="text-sm text-muted">Email</span>
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="text-sm text-muted">Tipo de acceso</span>
            <Badge variant={access.variant}>{access.text}</Badge>
          </div>
          <div className="profile-info-row">
            <span className="text-sm text-muted">Miembro desde</span>
            <span className="text-sm">{new Date(profile?.created_at).toLocaleDateString('es-CO')}</span>
          </div>
        </CardBody>
      </Card>

      {/* Apariencia */}
      <Card style={{ marginTop: 'var(--space-3)' }}>
        <CardBody>
          <h4 style={{ marginBottom: 'var(--space-3)' }}>Apariencia</h4>
          <div className="profile-info-row">
            <div>
              <p className="text-sm font-medium">
                {isDark ? '🌙 Modo oscuro' : '☀️ Modo claro'}
              </p>
              <p className="text-xs text-muted" style={{ marginTop: 2 }}>
                {isDark ? 'La app usa colores oscuros' : 'La app usa colores claros'}
              </p>
            </div>
            <button
              className={`theme-toggle-switch ${isDark ? 'active' : ''}`}
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              role="switch"
              aria-checked={isDark}
            >
              <span className="theme-toggle-thumb">
                {isDark ? '🌙' : '☀️'}
              </span>
            </button>
          </div>
        </CardBody>
      </Card>

      {/* ── Danger zone ── */}
      <Card style={{ marginTop: 'var(--space-3)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <CardBody>
          <h4 style={{ marginBottom: 'var(--space-1)', color: 'var(--color-error)', opacity: 0.8 }}>
            ⚠️ Zona de peligro
          </h4>
          <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-3)', lineHeight: 1.5 }}>
            Reiniciar tu progreso borra todo tu avance en lecciones. Tu cuenta y acceso no se ven afectados.
          </p>
          <button
            className="profile-danger-btn"
            onClick={() => setShowResetConfirm(true)}
          >
            🔄 Reiniciar mi progreso desde cero
          </button>
        </CardBody>
      </Card>

      {/* Actions */}
      <div style={{ marginTop: 'var(--space-6)' }}>
        <Button variant="ghost" full onClick={handleLogout} style={{ color: 'var(--color-error)' }}>
          🚪 Cerrar sesión
        </Button>
      </div>

      <p className="text-center text-xs text-muted" style={{ marginTop: 'var(--space-4)' }}>
        {brand.name} v1.0 · {brand.legal.country}
      </p>

      {/* Confirm reset modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="⚠️ Reiniciar progreso"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ lineHeight: 1.6 }}>
            Vas a borrar <strong>todo tu progreso</strong> en lecciones y simulaciones.
            <br /><br />
            Tu cuenta y tipo de acceso <strong>no cambian</strong>. Podrás empezar de nuevo desde cero.
          </p>
          <Button
            variant="primary"
            loading={resetting}
            onClick={handleResetProgress}
            full
          >
            🔄 Sí, reiniciar mi progreso
          </Button>
          <Button variant="ghost" onClick={() => setShowResetConfirm(false)} full>
            Cancelar
          </Button>
        </div>
      </Modal>

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
