import { Component } from 'react'

/**
 * Global Error Boundary — catches render errors in child components.
 * Shows a friendly fallback screen instead of a blank white page.
 * 
 * Recovery strategy:
 * 1. Clears sessionStorage (lesson caches that may cause re-crash)
 * 2. Clears lesson step localStorage (prevents restoring to broken state)
 * 3. Navigates to /dashboard on retry (avoids the same broken page)
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

  handleRecover = () => {
    try {
      // Clear ALL session storage (lesson caches, etc.) to break crash loops
      sessionStorage.clear()

      // Clear lesson step positions from localStorage (they may restore to broken step)
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('lesson_step_') || key?.startsWith('lesson_cache_')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k))
    } catch { /* ignore storage errors */ }

    // Navigate to dashboard (safe page) instead of reloading the same broken page
    window.location.href = '/dashboard'
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
          background: 'var(--color-background, #0F172A)',
          color: 'var(--color-text, #F8FAFC)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>😵</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Algo salió mal</h2>
          <p style={{ color: '#94A3B8', maxWidth: 360, marginBottom: 24 }}>
            Ocurrió un error inesperado. No te preocupes, tu progreso está guardado.
          </p>
          <button
            onClick={this.handleRecover}
            style={{
              padding: '12px 28px',
              background: 'var(--color-primary, #10B981)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            🏠 Ir al inicio
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
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
