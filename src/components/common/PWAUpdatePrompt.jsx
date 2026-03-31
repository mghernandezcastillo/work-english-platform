import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Shows a toast/banner when a new version of the app is available.
 * The user can click "Actualizar" to reload with the new version,
 * or they can dismiss it and keep working — it won't interrupt them.
 *
 * This also handles:
 * - Session persistence across deploys (the session lives in localStorage,
 *   not in the JS bundle, so it survives SW updates)
 * - Periodic check for updates (every 60 min while the app is open)
 */
export default function PWAUpdatePrompt() {
  const [dismissed, setDismissed] = useState(false)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // Check for updates every 60 minutes
      if (r) {
        setInterval(() => {
          r.update()
        }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error)
    },
  })

  // Don't show anything if no update or user dismissed
  if (!needRefresh || dismissed) return null

  function handleUpdate() {
    updateServiceWorker(true) // true = force reload
  }

  function handleDismiss() {
    setDismissed(true)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1E293B',
      color: 'white',
      padding: '12px 20px',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: 'var(--font-primary, Inter, system-ui)',
      fontSize: 14,
      maxWidth: 'calc(100vw - 32px)',
      animation: 'slideUpFade 0.4s ease',
    }}>
      <span style={{ fontSize: 20 }}>🆕</span>
      <span style={{ flex: 1 }}>Nueva versión disponible</span>
      <button
        onClick={handleUpdate}
        style={{
          padding: '6px 16px',
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: 20,
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}
      >
        Actualizar
      </button>
      <button
        onClick={handleDismiss}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          fontSize: 16,
          padding: '4px',
          lineHeight: 1,
        }}
        aria-label="Cerrar"
        title="Luego"
      >
        ×
      </button>

      <style>{`
        @keyframes slideUpFade {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
