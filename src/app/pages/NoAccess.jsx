import { useNavigate, Link } from 'react-router-dom'
import { brand, checkoutUrl } from '../../lib/brand'
import './NoAccess.css'

export default function NoAccess() {
  const navigate = useNavigate()

  return (
    <div className="no-access-page animate-fadeIn">
      <div className="no-access-inner">
        <div className="no-access-icon">🔒</div>
        <h1>Acceso no disponible</h1>
        <p className="text-muted" style={{ marginTop: 8, marginBottom: 'var(--space-6)' }}>
          Para acceder al contenido necesitas una cuenta con acceso activo.
        </p>

        {/* Options */}
        <div className="no-access-options">
          {/* Buy option */}
          <div className="no-access-card primary">
            <div className="no-access-badge">⭐ Más popular</div>
            <h3>Acceso Completo</h3>
            <p className="text-sm text-muted">36 lecciones · 3 rutas · 12 simulaciones · Audio profesional</p>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 'var(--space-4)' }}
            >
              Obtener acceso →
            </a>
            <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
              ✓ Pago único · ✓ Garantía 7 días · ✓ Acceso de por vida
            </p>
          </div>

          {/* Beta option */}
          <div className="no-access-card">
            <h3>¿Tienes código beta?</h3>
            <p className="text-sm text-muted">Si alguien te compartió un código de acceso, regístrate con él.</p>
            <button
              className="btn btn-outline btn-full"
              style={{ marginTop: 'var(--space-4)' }}
              onClick={() => navigate('/registro')}
            >
              Usar código beta
            </button>
          </div>
        </div>

        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
          style={{ marginTop: 'var(--space-4)' }}
        >
          ← Volver
        </button>
      </div>
    </div>
  )
}
