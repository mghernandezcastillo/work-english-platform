import { createContext, useContext, useEffect, useState, useRef } from 'react'
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

  // Refs so the onAuthStateChange closure always reads the LATEST values
  const userRef = useRef(null)
  const profileLoadedRef = useRef(false)

  // Keep refs in sync
  useEffect(() => { userRef.current = user }, [user])
  useEffect(() => { profileLoadedRef.current = profileLoaded }, [profileLoaded])

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

        // ── No session ──
        if (!currentUser) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        // ── Silent update: same user coming back (wake-up, token refresh) ──
        // Use refs to read the CURRENT values, not the stale closure values
        const alreadyLoaded = userRef.current?.id === currentUser.id && profileLoadedRef.current
        if (event === 'TOKEN_REFRESHED' || (event === 'SIGNED_IN' && alreadyLoaded)) {
          setUser(currentUser)
          // Silently refresh profile in background
          getProfile(currentUser.id)
            .then(p => { if (mounted) setProfile(p) })
            .catch(() => {})
          return
        }

        // ── Fresh session (first load or actual new login) ──
        setLoading(true)
        setProfileLoaded(false)
        setUser(currentUser)
        loadProfile(currentUser.id)
      }
    )

    // ── Refresh session when user comes back from phone screen lock ──
    function handleVisibilityChange() {
      if (document.visibilityState !== 'visible') return
      console.log('[Auth] Tab visible — refreshing session...')
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return
        if (session?.user) {
          setUser(session.user)
          getProfile(session.user.id)
            .then(p => { if (mounted) setProfile(p) })
            .catch(() => {})
        }
        // If no session, let onAuthStateChange handle the logout redirect
      }).catch(err => {
        console.warn('[Auth] visibilitychange getSession error:', err.message)
      })
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
