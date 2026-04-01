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

        // Has session:
        // - INITIAL_SESSION: fresh page load with existing session
        // - SIGNED_IN: login or token refresh on F5
        // - TOKEN_REFRESHED: background token refresh (don't flash spinner)
        if (event === 'TOKEN_REFRESHED') {
          // Silent update — don't reset loading state (user already sees content)
          setUser(currentUser)
          // Update profile silently in background
          getProfile(currentUser.id)
            .then(p => { if (mounted) setProfile(p) })
            .catch(() => {})
          return
        }

        // For INITIAL_SESSION and SIGNED_IN: show spinner + load profile
        setLoading(true)
        setProfileLoaded(false)
        setUser(currentUser)
        loadProfile(currentUser.id)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
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
