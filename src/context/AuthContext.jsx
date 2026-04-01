import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const loadingRef = useRef(true)

  // Keep ref in sync so the safety timeout can read the CURRENT value
  function setLoadingSafe(val) {
    loadingRef.current = val
    setLoading(val)
  }

  useEffect(() => {
    let mounted = true

    // ═══ SAFETY TIMEOUT ═══
    // NEVER let the app stay in loading state for more than 5 seconds.
    const safetyTimer = setTimeout(() => {
      if (mounted && loadingRef.current) {
        console.warn('[Auth] Safety timeout: forcing loading=false after 5s')
        setLoadingSafe(false)
      }
    }, 5000)

    // ─── 1. Get initial session ───
    async function init() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!mounted) return

        if (error) {
          console.warn('[Auth] Session error:', error.message)
          await supabase.auth.signOut().catch(() => {})
          setUser(null)
          setProfile(null)
          setLoadingSafe(false)
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

        if (mounted) setLoadingSafe(false)
      } catch (err) {
        console.warn('[Auth] Init error:', err)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoadingSafe(false)
        }
      }
    }

    init()

    // ─── 2. Listen for auth changes ───
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'INITIAL_SESSION') return

        if (event === 'TOKEN_REFRESHED' && !session) {
          setUser(null)
          setProfile(null)
          setLoadingSafe(false)
          return
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoadingSafe(false)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setLoadingSafe(true)
          setUser(session.user)
          try {
            const p = await getProfile(session.user.id)
            if (mounted) setProfile(p)
          } catch {
            if (mounted) setProfile(null)
          }
          if (mounted) setLoadingSafe(false)
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
      clearTimeout(safetyTimer)
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
