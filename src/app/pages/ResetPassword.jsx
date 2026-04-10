import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { updatePassword } from '../../lib/auth'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { toast, showToast, Toast: ToastComponent } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Handle the recovery token from the URL
    async function handleRecovery() {
      // ── NEW: Handle token_hash query parameter (from welcome email) ──
      // The welcome email sends ?token_hash=X&type=recovery to avoid
      // Brevo's click tracker breaking the Supabase redirect chain
      const urlParams = new URLSearchParams(window.location.search)
      const tokenHash = urlParams.get('token_hash')
      const tokenType = urlParams.get('type')

      if (tokenHash && tokenType === 'recovery') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          })
          if (!error) {
            setReady(true)
            setChecking(false)
            // Clean up the URL
            window.history.replaceState(null, '', '/reset-password')
            return
          }
          console.error('verifyOtp error:', error.message)
        } catch (err) {
          console.error('verifyOtp exception:', err)
        }
      }

      // ── EXISTING: Handle hash fragment (#access_token=...) ──
      // Supabase redirects with: #access_token=...&type=recovery
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        // Parse tokens from hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        if (accessToken && type === 'recovery') {
          // Set the session manually
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })
          if (!error) {
            setReady(true)
            setChecking(false)
            // Clean up the URL
            window.history.replaceState(null, '', '/reset-password')
            return
          }
        }
      }

      // Also check URL query params (some flows use ?token=...&type=recovery)
      const type = urlParams.get('type')
      if (type === 'recovery') {
        // Supabase should handle this automatically via onAuthStateChange
      }

      // Listen for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
          setReady(true)
          setChecking(false)
        } else if (event === 'SIGNED_IN' && session) {
          // Also handle SIGNED_IN which happens after recovery token is processed
          setReady(true)
          setChecking(false)
        }
      })

      // Check if we already have a session (user came from a link that was already processed)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setReady(true)
      }
      
      setChecking(false)

      return () => subscription.unsubscribe()
    }

    handleRecovery()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres', 'error')
      return
    }
    if (password !== confirm) {
      showToast('Las contraseñas no coinciden', 'error')
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      showToast('¡Contraseña actualizada!', 'success')
      // Small delay so user sees the success message
      // Full page reload (not SPA navigate) so the browser fires beforeinstallprompt
      // on the dashboard — this is what shows the PWA install banner
      setTimeout(() => { window.location.href = '/dashboard' }, 1200)
    } catch (err) {
      console.error('Password update error:', err)
      showToast(err.message || 'Error al actualizar. Intenta de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="page-center">
        <div className="container-sm w-full animate-fadeIn text-center">
          <div style={{
            width: 64, height: 64, background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-5)', fontSize: 32,
          }}>
            ⏳
          </div>
          <h2>Verificando enlace...</h2>
          <p className="text-muted text-sm" style={{ marginTop: 'var(--space-3)' }}>
            Procesando tu solicitud de recuperación...
          </p>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="page-center">
        <div className="container-sm w-full animate-fadeIn text-center">
          <div style={{
            width: 64, height: 64, background: 'var(--color-error-light, #FEE2E2)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-5)', fontSize: 32,
          }}>
            ⚠️
          </div>
          <h2>Enlace inválido o expirado</h2>
          <p className="text-muted text-sm" style={{ marginTop: 'var(--space-3)', lineHeight: 1.6 }}>
            Este enlace ya fue usado o ha expirado.<br />
            Solicita uno nuevo desde el login.
          </p>
          <div style={{ marginTop: 'var(--space-5)' }}>
            <Button variant="primary" onClick={() => navigate('/forgot-password')}>
              Solicitar nuevo enlace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-center">
      <div className="container-sm w-full animate-fadeIn">
        <div className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 56, height: 56, background: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-4)',
            fontSize: 28, boxShadow: 'var(--shadow-primary)',
          }}>
            🔐
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Crea tu nueva contraseña</h1>
          <p className="text-muted text-sm">Elige una contraseña segura de al menos 8 caracteres</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-6)' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Button type="submit" variant="primary" size="lg" full loading={loading}>
                Guardar contraseña
              </Button>
            </form>
          </div>
        </div>
      </div>
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
