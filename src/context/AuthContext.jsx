import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    let mounted = true

    // ═══════════════════════════════════════════════════════════
    // KEY INSIGHT from debugging:
    // supabase.auth.getSession() HANGS when there is an active
    // session — it never resolves. This was causing the infinite
    // spinner on F5.
    //
    // SOLUTION: Use ONLY onAuthStateChange. It fires reliably:
    //   - INITIAL_SESSION  → on page load (with or without session)
    //   - SIGNED_IN        → after login
    //   - SIGNED_OUT       → after logout
    //   - TOKEN_REFRESHED  → after token refresh
    //
    // We handle INITIAL_SESSION here (previously we skipped it).
    // ═══════════════════════════════════════════════════════════
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        console.log('[Auth] event:', event, '| user:', session?.user?.email ?? 'none')

        const currentUser = session?.user ?? null

        if (event === 'SIGNED_OUT' || (!session && event === 'INITIAL_SESSION')) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        if (event === 'TOKEN_REFRESHED' && !session) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        // INITIAL_SESSION with user, SIGNED_IN, TOKEN_REFRESHED with user
        if (currentUser) {
          // Only show loading spinner for INITIAL_SESSION and SIGNED_IN
          // TOKEN_REFRESHED should update silently (user already sees content)
          if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
            setLoading(true)
            setProfileLoaded(false)
          }

          setUser(currentUser)

          try {
            const p = await getProfile(currentUser.id)
            if (mounted) setProfile(p)
          } catch (err) {
            console.warn('[Auth] Profile load error:', err.message)
            if (mounted) setProfile(null)
          }

          if (mounted) {
            setProfileLoaded(true)
            setLoading(false)
            console.log('[Auth] Ready — loading=false, profileLoaded=true')
          }
        }
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
