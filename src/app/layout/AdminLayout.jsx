import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../lib/auth'
import './AdminLayout.css'

const adminNav = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/admin/beta', icon: '🔑', label: 'Acceso Beta' },
  { to: '/admin/testimonios', icon: '⭐', label: 'Testimonios' },
  { to: '/admin/anuncios', icon: '📢', label: 'Anuncios' },
  { to: '/admin/ajustes', icon: '⚙️', label: 'Ajustes' },
]

export default function AdminLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    try {
      await signOut()
    } catch (e) {
      console.warn('signOut error (ignored):', e)
    } finally {
      navigate('/login', { replace: true })
    }
  }

  function handleNavClick() {
    setMenuOpen(false)
  }

  return (
    <div className="adm-layout">
      {/* ── Mobile topbar ── */}
      <header className="adm-mobile-topbar">
        <div className="adm-mobile-topbar-left">
          <button
            className="adm-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className={`adm-hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`adm-hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`adm-hamburger-line ${menuOpen ? 'open' : ''}`} />
          </button>
          <span className="adm-mobile-title">🇺🇸 Admin Panel</span>
        </div>
        <button
          className="adm-mobile-back"
          onClick={() => navigate('/dashboard')}
        >
          🏠 App
        </button>
      </header>

      {/* ── Sidebar (desktop always visible, mobile toggleable) ── */}
      {menuOpen && (
        <div className="adm-overlay" onClick={() => setMenuOpen(false)} />
      )}
      <aside className={`adm-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-header">
          <span style={{ fontSize: 22 }}>🇺🇸</span>
          <div>
            <div className="adm-sidebar-title">Admin Panel</div>
            <div className="adm-sidebar-sub">{profile?.full_name || profile?.email}</div>
          </div>
        </div>

        <nav className="adm-nav">
          {adminNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `adm-nav-item ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <button className="adm-nav-item" onClick={() => { navigate('/dashboard'); setMenuOpen(false) }}>
            <span className="adm-nav-icon">🏠</span>
            <span>Ver app</span>
          </button>
          <button className="adm-nav-item danger" onClick={handleLogout}>
            <span className="adm-nav-icon">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}
