import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Layouts
import AppLayout from './app/layout/AppLayout'
import AdminLayout from './app/layout/AdminLayout'

// Auth pages
import Login from './app/pages/Login'
import Register from './app/pages/Register'
import ForgotPassword from './app/pages/ForgotPassword'
import ResetPassword from './app/pages/ResetPassword'

// App pages
import Onboarding from './app/pages/Onboarding'
import NoAccess from './app/pages/NoAccess'
import Dashboard from './app/pages/Dashboard'
import RouteView from './app/pages/RouteView'
import LessonView from './app/pages/LessonView'
import SimulationView from './app/pages/SimulationView'
import Progress from './app/pages/Progress'
import Profile from './app/pages/Profile'
import Vocabulary from './app/pages/Vocabulary'

// Lazy-loaded pages (code splitting — reduces initial bundle ~30%)
const LandingPage = lazy(() => import('./app/pages/LandingPage'))
const AdminDashboard = lazy(() => import('./app/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./app/admin/AdminUsers'))
const AdminBeta = lazy(() => import('./app/admin/AdminBeta'))
const AdminTestimonials = lazy(() => import('./app/admin/AdminTestimonials'))
const AdminSettings = lazy(() => import('./app/admin/AdminSettings'))

// Placeholder
const Placeholder = ({ title, emoji = '🚧' }) => (
  <div style={{ padding: 40, textAlign: 'center', marginTop: 40, fontFamily: 'Inter, sans-serif' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
    <h2 style={{ color: '#1E293B', marginBottom: 8 }}>{title}</h2>
    <p style={{ color: '#64748B', fontSize: 14 }}>En construcción</p>
  </div>
)

/* ─── GUARDS ─── */

function PublicOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppLayoutGuard() {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />
  return <AppLayout />
}

function AccessRequired({ children }) {
  const { hasAccess, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!hasAccess) return <Navigate to="/sin-acceso" replace />
  return children
}

function AdminLayoutGuard() {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return <AdminLayout />
}

function OnboardingGuard() {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  if (profile?.onboarding_completed) return <Navigate to="/dashboard" replace />
  return <Onboarding />
}

function NoAccessGuard() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  return <NoAccess />
}

/* ─── ROUTES ─── */
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public auth */}
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/registro" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public landing pages */}
      <Route path="/ingles-para-trabajo" element={<LandingPage />} />
      <Route path="/ingles-call-center" element={<LandingPage />} />

      {/* Auth-only no-layout pages */}
      <Route path="/onboarding" element={<OnboardingGuard />} />
      <Route path="/sin-acceso" element={<NoAccessGuard />} />

      {/* App — with AppLayout */}
      <Route element={<AppLayoutGuard />}>
        <Route path="/dashboard" element={<AccessRequired><Dashboard /></AccessRequired>} />
        <Route path="/ruta/:routeId" element={<AccessRequired><RouteView /></AccessRequired>} />
        <Route path="/leccion/:lessonId" element={<AccessRequired><LessonView /></AccessRequired>} />
        <Route path="/simulacion/:simId" element={<AccessRequired><SimulationView /></AccessRequired>} />
        <Route path="/progreso" element={<AccessRequired><Progress /></AccessRequired>} />
        <Route path="/vocabulario" element={<AccessRequired><Vocabulary /></AccessRequired>} />
        <Route path="/perfil" element={<Profile />} />
      </Route>

      {/* Admin — with AdminLayout */}
      <Route element={<AdminLayoutGuard />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/beta" element={<AdminBeta />} />
        <Route path="/admin/testimonios" element={<AdminTestimonials />} />
        <Route path="/admin/ajustes" element={<AdminSettings />} />
      </Route>

      {/* Legal */}
      <Route path="/terminos" element={<Placeholder title="Términos de Uso" emoji="📄" />} />
      <Route path="/politica-privacidad" element={<Placeholder title="Política de Privacidad" emoji="🔏" />} />

      <Route path="*" element={<Placeholder title="Página no encontrada" emoji="🔍" />} />
    </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppSettingsProvider>
          <AppRoutes />
        </AppSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
