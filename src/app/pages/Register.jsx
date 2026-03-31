import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { signUp, consumeBetaToken, validateBetaToken } from '../../lib/auth'
import { brand } from '../../lib/brand'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const betaTokenParam = searchParams.get('token') || ''
  const { toast, showToast, Toast: ToastComponent } = useToast()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    betaToken: betaTokenParam,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Tu nombre es obligatorio'
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    try {
      // Validate beta token if provided
      let betaInvite = null
      if (form.betaToken) {
        betaInvite = await validateBetaToken(form.betaToken)
        if (!betaInvite) {
          setErrors(prev => ({ ...prev, betaToken: 'Token inválido o ya usado' }))
          setLoading(false)
          return
        }
      }

      // Create account
      const { user } = await signUp(form.email, form.password, form.fullName)

      // Consume beta token if valid
      if (betaInvite && user) {
        await consumeBetaToken(form.betaToken, user.id)
      }

      navigate('/dashboard')
    } catch (err) {
      const msg = err.message?.includes('already registered')
        ? 'Este email ya tiene una cuenta. Inicia sesión.'
        : 'Error al crear cuenta. Intenta de nuevo.'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="container-sm w-full animate-fadeIn">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 56, height: 56, background: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-4)',
            fontSize: 28, boxShadow: 'var(--shadow-primary)',
          }}>
            🇺🇸
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>Crear cuenta</h1>
          <p className="text-muted text-sm">
            {betaTokenParam ? '🎉 ¡Tienes acceso beta! Completa tu registro.' : `Únete a ${brand.name}`}
          </p>
        </div>

        {/* Beta token banner */}
        {betaTokenParam && (
          <div style={{
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-4)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          }}>
            <span>✅</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary-hover)' }}>
              Token de acceso beta detectado. Registrate para activarlo.
            </span>
          </div>
        )}

        {/* Form */}
        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-6)' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                label="Tu nombre completo"
                type="text"
                placeholder="Michael Hernández"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                error={errors.fullName}
                required
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                error={errors.email}
                required
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password}
                hint="Mínimo 8 caracteres"
                required
                autoComplete="new-password"
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repite tu contraseña"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                error={errors.confirm}
                required
                autoComplete="new-password"
              />
              {!betaTokenParam && (
                <Input
                  label="Token de acceso (opcional)"
                  type="text"
                  placeholder="Si tienes un código de acceso"
                  value={form.betaToken}
                  onChange={e => setForm(f => ({ ...f, betaToken: e.target.value }))}
                  error={errors.betaToken}
                  hint="Si alguien te compartió un código de acceso"
                />
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                full
                loading={loading}
                style={{ marginTop: 'var(--space-2)' }}
              >
                Crear mi cuenta
              </Button>
            </form>

            <p className="text-center text-sm" style={{ marginTop: 'var(--space-5)', color: 'var(--color-text-muted)' }}>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted" style={{ marginTop: 'var(--space-4)' }}>
          Al registrarte aceptas nuestros{' '}
          <Link to="/terminos" style={{ color: 'var(--color-secondary)' }}>términos de uso</Link>
        </p>
      </div>

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
