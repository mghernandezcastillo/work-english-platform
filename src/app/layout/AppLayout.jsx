import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useTheme } from '../../context/ThemeContext'
import { signOut } from '../../lib/auth'
import { brand } from '../../lib/brand'
import './AppLayout.css'

// ─── PWA Install Hook ───────────────────────────────────────────────
function usePWAInstall() {
  const [prompt, setPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator).standalone
    setIsIOS(ios)

    // Detect already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator).standalone) {
      setIsInstalled(true)
      return
    }

    const handler = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function install() {
    if (!prompt) return false
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') { setPrompt(null); setIsInstalled(true) }
    return outcome === 'accepted'
  }

  return { prompt, isIOS, isInstalled, install }
}

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/simulaciones', icon: '🎧', label: 'Simulaciones' },
  { to: '/progreso', icon: '📊', label: 'Progreso' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function AppLayout() {
  const { profile, isAdmin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { settings } = useAppSettings()
  const navigate = useNavigate()

  const { prompt: installPrompt, isIOS, isInstalled, install } = usePWAInstall()
  const [showIOSModal, setShowIOSModal] = useState(false)

  const waNumber = (settings.whatsapp_number || '').replace(/\D/g, '')
  const waMsg = encodeURIComponent(settings.support_message || 'Hola, tengo una pregunta sobre English for Work 👋')
  const waEnabled = settings.whatsapp_enabled !== 'false'
  const supportEmail = settings.support_email || ''

  const showInstallBtn = !isInstalled && (isIOS || installPrompt)

  function handleInstall() {
    if (isIOS) { setShowIOSModal(true); return }
    install()
  }

  async function handleLogout() {
    try {
      await signOut()
    } catch (e) {
      console.warn('signOut error (ignored):', e)
    } finally {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="app-layout">
      {/* Top bar */}
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <div className="app-topbar-left">
            <img src="/images/facebook-profile.png" alt="" className="app-topbar-logo" />
            <span className="app-topbar-title">{brand.name}</span>
          </div>
          <div className="app-topbar-right">
            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Cambiar tema"
            >
              <span className="theme-toggle-icon">{isDark ? '🌙' : '☀️'}</span>
              <span className="theme-toggle-track">
                <span className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`} />
              </span>
            </button>

            {isAdmin && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')} title="Panel Admin" aria-label="Panel Admin">
                ⚙️
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm logout-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Bottom navigation (mobile only) */}
      <nav className="app-bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `app-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="app-bottom-nav-icon">{item.icon}</span>
            <span className="app-bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
        {showInstallBtn && (
          <button className="app-bottom-nav-item install-btn" onClick={handleInstall} title="Instalar app">
            <span className="app-bottom-nav-icon">📲</span>
            <span className="app-bottom-nav-label">Instalar</span>
          </button>
        )}
      </nav>

      {/* Sidebar navigation (desktop only) */}
      <nav className="app-sidebar">
        <div className="app-sidebar-logo">
          <img src="/images/facebook-profile.png" alt="" className="app-sidebar-logo-img" />
          <span className="app-sidebar-logo-name">{brand.name}</span>
        </div>
        <div className="app-sidebar-links">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `app-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="app-sidebar-icon">{item.icon}</span>
              <span className="app-sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="app-sidebar-footer">
          {/* Install App button */}
          {showInstallBtn && (
            <button className="app-sidebar-item install-btn" onClick={handleInstall} title="Instalar app">
              <span className="app-sidebar-icon">📲</span>
              <span className="app-sidebar-label">Instalar</span>
            </button>
          )}
          {isAdmin && (
            <button className="app-sidebar-item" onClick={() => navigate('/admin')} title="Panel Admin">
              <span className="app-sidebar-icon">⚙️</span>
              <span className="app-sidebar-label">Admin</span>
            </button>
          )}
          <button className="app-sidebar-item" onClick={toggleTheme} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            <span className="app-sidebar-icon">{isDark ? '🌙' : '☀️'}</span>
            <span className="app-sidebar-label">Tema</span>
          </button>
          <button className="app-sidebar-item logout" onClick={handleLogout} title="Cerrar sesión">
            <span className="app-sidebar-icon">🚪</span>
            <span className="app-sidebar-label">Salir</span>
          </button>
        </div>
      </nav>

      {/* WhatsApp floating button */}
      {waEnabled && waNumber && (
        <a href={`https://wa.me/${waNumber}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
          className="whatsapp-fab" title="Contactar soporte por WhatsApp" aria-label="Soporte por WhatsApp">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span className="whatsapp-fab-label">Soporte</span>
        </a>
      )}

      {/* Support email footer */}
      {!waEnabled && supportEmail && (
        <footer className="app-support-footer">
          <span>¿Tienes dudas?</span>
          <a href={`mailto:${supportEmail}`} className="app-support-email">✉️ {supportEmail}</a>
        </footer>
      )}

      {/* iOS Install instructions modal */}
      {showIOSModal && (
        <div className="pwa-ios-overlay" onClick={() => setShowIOSModal(false)}>
          <div className="pwa-ios-modal" onClick={e => e.stopPropagation()}>
            <div className="pwa-ios-title">📲 Instala la app en tu iPhone</div>
            <ol className="pwa-ios-steps">
              <li>Toca el botón <strong>Compartir</strong> <span className="pwa-ios-share-icon">⬆️</span> en la barra de Safari</li>
              <li>Desliza hacia abajo y toca <strong>"Agregar a pantalla de inicio"</strong></li>
              <li>Toca <strong>Agregar</strong> en la esquina superior derecha</li>
            </ol>
            <button className="pwa-ios-close" onClick={() => setShowIOSModal(false)}>Entendido ✓</button>
          </div>
        </div>
      )}
    </div>
  )
}
