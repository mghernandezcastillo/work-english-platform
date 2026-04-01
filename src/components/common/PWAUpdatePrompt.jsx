import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * With autoUpdate, the service worker updates silently.
 * This component just registers the SW — no UI needed.
 */
export default function PWAUpdatePrompt() {
  useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Check for updates every hour
        setInterval(() => { r.update() }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error)
    },
  })

  return null
}
