import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../lib/auth'

const AuthContext = createContext(null)

// Wrap any promise with a timeout so it NEVER hangs forever
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`[Auth] ${label} timed out after ${ms}ms`)), ms)
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

    async function init() {
      try {
        console.log('[Auth] init: calling getSession...')
        const { data: { session }, error } = await withTimeout(
          supabase.auth.getSession(), 8000, 'getSession'
        )
        console.log('[Auth] init: getSession done', { hasSession: !!session, error: error?.message })

        if (!mounted) return

        if (error) {
          console.warn('[Auth] Session error:', error.message)
          await supabase.auth.signOut().catch(() => {})
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          try {
            console.log('[Auth] init: calling getProfile...')
            const p = await withTimeout(
              getProfile(currentUser.id), 8000, 'getProfile'
            )
            console.log('[Auth] init: getProfile done', { hasProfile: !!p })
            if (mounted) setProfile(p)
          } catch (err) {
            console.warn('[Auth] Profile error:', err.message)
            if (mounted) setProfile(null)
          }
          if (mounted) setProfileLoaded(true)
        } else {
          setProfileLoaded(true)
        }

        if (mounted) {
          console.log('[Auth] init: setting loading=false')
          setLoading(false)
        }
      } catch (err) {
        console.warn('[Auth] Init error:', err.message)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
        }
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        console.log('[Auth] onAuthStateChange:', event)

        // Skip INITIAL_SESSION — init() handles it
        if (event === 'INITIAL_SESSION') return

        if (event === 'TOKEN_REFRESHED' && !session) {
          setUser(null)
          setProfile(null)
          setProfileLoaded(true)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setProfileLoaded(false)
          setLoading(false)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true)
          setProfileLoaded(false)
          setUser(session.user)
          try {
            const p = await withTimeout(
              getProfile(session.user.id), 8000, 'getProfile (SIGNED_IN)'
            )
            if (mounted) setProfile(p)
          } catch {
            if (mounted) setProfile(null)
          }
          if (mounted) {
            setProfileLoaded(true)
            setLoading(false)
          }
          return
        }

        // TOKEN_REFRESHED with valid session — update silently
        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
          try {
            const p = await withTimeout(
              getProfile(session.user.id), 8000, 'getProfile (TOKEN_REFRESHED)'
            )
            if (mounted) setProfile(p)
          } catch {
            if (mounted) setProfile(null)
          }
          if (mounted) setProfileLoaded(true)
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
