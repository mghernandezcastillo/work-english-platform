import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn } from '../../lib/auth'
import { brand } from '../../lib/brand'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { useToast } from '../../components/common/Toast'

export default function Login() {
  const navigate = useNavigate()
  const { toast, showToast, Toast: ToastComponent } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.email) e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es obligatoria'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.message?.includes('Invalid login') 
        ? 'Email o contraseña incorrectos'
        : 'Error al iniciar sesión. Intenta de nuevo.'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div className="container-sm w-full animate-fadeIn">
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 56, height: 56, background: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto var(--space-4)',
            fontSize: 28, boxShadow: 'var(--shadow-primary)',
          }}>
            🇺🇸
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 4 }}>{brand.name}</h1>
          <p className="text-muted text-sm">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="card-body" style={{ padding: 'var(--space-6)' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                placeholder="Tu contraseña"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                error={errors.password}
                required
                autoComplete="current-password"
              />
              <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                <Link to="/forgot-password" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                full
                loading={loading}
                style={{ marginTop: 'var(--space-2)' }}
              >
                Iniciar sesión
              </Button>
            </form>

            <div className="divider-text" style={{ marginTop: 'var(--space-5)' }}>
              <span>o</span>
            </div>

            <p className="text-center text-sm" style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-muted)' }}>
              ¿No tienes cuenta?{' '}
              <Link to="/registro" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}>
                Regístrate aquí
              </Link>
            </p>

            <p className="text-center text-sm" style={{ marginTop: 'var(--space-3)', color: 'var(--color-text-muted)' }}>
              ¿Quieres ver la plataforma?{' '}
              <Link to="/ingles-para-trabajo" style={{ color: 'var(--color-secondary)' }}>
                Ver más información
              </Link>
            </p>
          </div>
        </div>

        {/* Trust */}
        <p className="text-center text-xs text-muted" style={{ marginTop: 'var(--space-4)' }}>
          🔒 Tus datos están seguros y protegidos
        </p>
      </div>

      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </div>
  )
}
