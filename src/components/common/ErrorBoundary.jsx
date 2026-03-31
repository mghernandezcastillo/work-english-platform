import { Component } from 'react'

/**
 * Global Error Boundary — catches render errors in child components.
 * Shows a friendly fallback screen instead of a blank white page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'var(--font-primary, system-ui)',
          background: 'var(--color-background, #F8FAFC)',
          color: 'var(--color-text, #1E293B)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>😵</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Algo salió mal</h2>
          <p style={{ color: '#64748B', maxWidth: 360, marginBottom: 24 }}>
            Ocurrió un error inesperado. Por favor recarga la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              background: 'var(--color-primary, #10B981)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            🔄 Recargar página
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: 24,
              padding: 12,
              background: '#1E293B',
              color: '#F1F5F9',
              borderRadius: 8,
              fontSize: 11,
              maxWidth: '100%',
              overflow: 'auto',
              textAlign: 'left',
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
