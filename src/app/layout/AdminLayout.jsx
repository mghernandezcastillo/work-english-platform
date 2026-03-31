import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../lib/auth'
import './AdminLayout.css'

const adminNav = [
  { to: '/admin', icon: '📊', label: 'Dashboard', end: true },
  { to: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/admin/beta', icon: '🔑', label: 'Acceso Beta' },
  { to: '/admin/testimonios', icon: '⭐', label: 'Testimonios' },
  { to: '/admin/ajustes', icon: '⚙️', label: 'Ajustes' },
]

export default function AdminLayout() {
  const { profile } = useAuth()
  const navigate = useNavigate()

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
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span style={{ fontSize: 20 }}>🇺🇸</span>
          <div>
            <div className="admin-sidebar-title">Admin</div>
            <div className="admin-sidebar-sub">{profile?.full_name}</div>
          </div>
        </div>

        <nav className="admin-nav">
          {adminNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-item"
            onClick={() => navigate('/dashboard')}
          >
            <span>🏠</span>
            <span>Ver app</span>
          </button>
          <button
            className="admin-nav-item danger"
            onClick={handleLogout}
          >
            <span>🚪</span>
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
