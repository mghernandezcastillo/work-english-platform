import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../lib/brand'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'

export default function ForgotPassword() {
  const { toast, showToast, Toast: ToastComponent } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showToast('Ingresa un email válido', 'error')
      return
    }
    setLoading(true)
    try {
      // Call our Edge Function to send a beautiful Brevo email
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reset-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al enviar')
      }
      setSent(true)
    } catch (err) {
      showToast('Error al enviar email. Intenta de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="page-center">
        <div className="container-sm w-full animate-fadeIn text-center">
          <div style={{
            width: 64, height: 64, background: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-5)', fontSize: 32,
          }}>
            📧
          </div>
          <h2>¡Email enviado!</h2>
          <p className="text-muted" style={{ margin: 'var(--space-3) 0 var(--space-5)', lineHeight: 1.6 }}>
            Revisa tu bandeja de entrada en <strong>{email}</strong>.<br />
            Haz clic en el enlace del email para crear tu nueva contraseña.
          </p>
          <p className="text-xs text-muted">
            ¿No lo ves? Revisa tu carpeta de spam.
          </p>
          <div style={{ marginTop: 'var(--space-5)' }}>
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>
              ← Volver al login
            </Link>
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
            🔑
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Recuperar contraseña</h1>
          <p className="text-muted text-sm">Te enviaremos un email para crear una nueva contraseña</p>
        </div>

        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-6)' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="Tu email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" variant="primary" size="lg" full loading={loading}>
                Enviar enlace de recuperación
              </Button>
            </form>

            <p className="text-center text-sm" style={{ marginTop: 'var(--space-5)', color: 'var(--color-text-muted)' }}>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>
                ← Volver al login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
