import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // ─── Get initial session ───
    async function init() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!mounted) return

        if (error) {
          console.warn('[Auth] Session error:', error.message)
          await supabase.auth.signOut().catch(() => {})
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          try {
            const p = await getProfile(currentUser.id)
            if (mounted) setProfile(p)
          } catch (err) {
            console.warn('[Auth] Profile error:', err.message)
            if (mounted) setProfile(null)
          }
        }

        if (mounted) setLoading(false)
      } catch (err) {
        console.warn('[Auth] Init error:', err)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    }

    init()

    // ─── Listen for auth changes ───
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        // Skip INITIAL_SESSION — init() handles it
        if (event === 'INITIAL_SESSION') return

        if (event === 'TOKEN_REFRESHED' && !session) {
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

        // TOKEN_REFRESHED with valid session — update silently
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

  // profileReady: true when we've finished trying to load the profile.
  // This is different from `loading` — it tells guards whether the
  // profile data is available to make access decisions.
  const profileReady = !loading && (user ? profile !== null : true)

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isAdmin, hasAccess, refreshProfile, profileReady
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
