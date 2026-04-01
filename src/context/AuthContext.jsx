import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialLoad = useRef(true)

  useEffect(() => {
    let mounted = true

    // ─── 1. Get initial session ───
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (!mounted) return

      if (error) {
        console.warn('Session error, clearing:', error.message)
        supabase.auth.signOut().catch(() => {})
        setUser(null)
        setProfile(null)
        setLoading(false)
        initialLoad.current = false
        return
      }

      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        try {
          const p = await getProfile(currentUser.id)
          if (mounted) setProfile(p)
        } catch (err) {
          console.warn('Profile load error:', err.message)
          if (mounted) setProfile(null)
        }
      }

      if (mounted) {
        setLoading(false)
        initialLoad.current = false
      }
    }).catch(() => {
      if (mounted) {
        setUser(null)
        setProfile(null)
        setLoading(false)
        initialLoad.current = false
      }
    })

    // ─── 2. Listen for auth changes (login, logout, token refresh) ───
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        // Skip the INITIAL_SESSION event — we already handle it above
        // via getSession(). Processing it again causes a race condition
        // where loading gets set back to true after getSession set it false.
        if (event === 'INITIAL_SESSION') return

        // Handle token refresh failures
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed, signing out')
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        // For SIGNED_IN events: set loading true to prevent flash,
        // then load profile, then set loading false.
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true)
          setUser(session.user)
          try {
            const p = await getProfile(session.user.id)
            if (mounted) setProfile(p)
          } catch {
            if (mounted) setProfile(null)
          }
          if (mounted) setLoading(false)
          return
        }

        // For any other event (TOKEN_REFRESHED with session, etc.)
        // just update user silently without flashing loading state
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const p = await getProfile(session.user.id)
            if (mounted) setProfile(p)
          } catch {
            if (mounted) setProfile(null)
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
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, hasAccess, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
