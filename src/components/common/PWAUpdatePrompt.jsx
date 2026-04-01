import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * Shows a toast/banner when a new version of the app is available.
 * Clicking "Actualizar" shows a spinner + animated progress bar before reload.
 */
export default function PWAUpdatePrompt() {
  const [dismissed, setDismissed] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [progress, setProgress] = useState(0)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (r) {
        setInterval(() => { r.update() }, 60 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error)
    },
  })

  // Animate progress bar smoothly via rAF
  useEffect(() => {
    if (!updating) return
    setProgress(0)
    const start = performance.now()
    const duration = 2500 // ms — reaches ~99% then jumps to 100 on reload
    let rafId
    const tick = (now) => {
      const pct = Math.min(((now - start) / duration) * 100, 99)
      setProgress(pct)
      if (pct < 99) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [updating])

  if (!needRefresh || dismissed) return null

  function handleUpdate() {
    if (updating) return
    setUpdating(true)
    setTimeout(() => {
      setProgress(100)
      setTimeout(() => updateServiceWorker(true), 300)
    }, 2500)
  }

  function handleDismiss() {
    if (!updating) setDismissed(true)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1E293B',
      color: 'white',
      padding: '14px 20px',
      borderRadius: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'var(--font-primary, Inter, system-ui)',
      fontSize: 14,
      minWidth: 280,
      maxWidth: 'calc(100vw - 32px)',
      animation: 'slideUpFade 0.4s ease',
    }}>
      {/* ── Top row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Icon: spinner while updating, emoji otherwise */}
        <span style={{ fontSize: 20, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {updating
            ? <span style={{
                display: 'inline-block',
                width: 20, height: 20,
                border: '2.5px solid rgba(255,255,255,0.15)',
                borderTopColor: '#10B981',
                borderRadius: '50%',
                animation: 'pwaSpinner 0.7s linear infinite',
              }} />
            : '🆕'
          }
        </span>

        {/* Message */}
        <span style={{ flex: 1 }}>
          {updating ? 'Actualizando app…' : 'Nueva versión disponible'}
        </span>

        {/* Buttons: hide while updating */}
        {!updating && <>
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
              fontSize: 18,
              padding: '2px 4px',
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Cerrar"
          >
            ×
          </button>
        </>}
      </div>

      {/* ── Progress bar (only while updating) ── */}
      {updating && (
        <div style={{
          width: '100%', height: 4,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 4, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #10B981, #34D399)',
            borderRadius: 4,
            transition: 'width 0.08s linear',
          }} />
        </div>
      )}

      <style>{`
        @keyframes slideUpFade {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
        @keyframes pwaSpinner {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
