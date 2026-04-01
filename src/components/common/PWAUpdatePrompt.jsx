import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'

/**
 * PWA Update Prompt — AutoUpdate mode.
 *
 * The SW updates silently. Additionally, on mount we:
 * 1. Force-update the registration (catches stale SWs left from old deploys)
 * 2. Clean up any old caches that referenced dead JS/CSS chunks
 * 3. Check for updates every 30 minutes
 */
export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Force check for updates immediately on page load
        r.update()
        // Then check every 30 minutes
        setInterval(() => { r.update() }, 30 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error)
    },
  })

  // If the SW signals a refresh is needed, do it automatically
  useEffect(() => {
    if (needRefresh) {
      updateServiceWorker(true)
    }
  }, [needRefresh, updateServiceWorker])

  // On first mount, clean up stale caches from previous SW versions
  useEffect(() => {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          // Clean old workbox caches that might hold dead chunk references
          if (name.startsWith('workbox-precache') || name === 'app-assets') {
            caches.delete(name)
          }
        })
      })
    }
  }, [])

  return null
}
