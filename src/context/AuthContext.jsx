import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

// Wrap any promise with a hard timeout
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    )
  ])
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    // Helper: load profile with a hard timeout so it NEVER hangs
    async function loadProfile(userId) {
      try {
        const p = await withTimeout(getProfile(userId), 6000, 'getProfile')
        if (mounted) setProfile(p)
      } catch (err) {
        console.warn('[Auth] getProfile error/timeout:', err.message)
        if (mounted) setProfile(null)
      } finally {
        if (mounted) {
          setProfileLoaded(true)
          setLoading(false)
          console.log('[Auth] Ready')
        }
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return
        console.log('[Auth] event:', event, '| user:', session?.user?.email ?? 'none')

        const currentUser = session?.user ?? null

        // No session cases
        if (!currentUser) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        // TOKEN_REFRESHED or SIGNED_IN with same user already loaded
        // → silent update, don't flash spinner (fixes screen-lock race condition)
        if (
          event === 'TOKEN_REFRESHED' ||
          (event === 'SIGNED_IN' && user?.id === currentUser.id && profileLoaded)
        ) {
          setUser(currentUser)
          getProfile(currentUser.id)
            .then(p => { if (mounted) setProfile(p) })
            .catch(() => {})
          return
        }

        // Fresh INITIAL_SESSION or real new login: show spinner + load profile
        setLoading(true)
        setProfileLoaded(false)
        setUser(currentUser)
        loadProfile(currentUser.id)
      }
    )

    // Refresh session silently when user comes back from phone screen lock
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user && mounted) {
            setUser(session.user)
            getProfile(session.user.id)
              .then(p => { if (mounted) setProfile(p) })
              .catch(() => {})
          }
        }).catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const refreshProfile = async () => {
    if (user) {
      try {
        const p = await getProfile(user.id)
        setProfile(p)
      } catch {
        setProfile(null)
      }
    }
  }

  const isAdmin = profile?.is_admin === true
  const hasAccess = ['beta', 'paid', 'unlimited'].includes(profile?.access_type)

  return (
    <AuthContext.Provider value={{
      user, profile, loading, profileLoaded,
      isAdmin, hasAccess, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
