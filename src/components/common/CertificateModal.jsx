import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { brand } from '../../lib/brand'
import './CertificateModal.css'

/**
 * Draws a professional certificate on a Canvas and offers download + share.
 * @param {object} props
 * @param {string} props.userName   - Full name of the user
 * @param {string} props.routeName  - Name of the completed route
 * @param {Function} props.onClose  - Close handler
 */
export function CertificateModal({ userName, routeName, onClose }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    drawCertificate()
  }, [userName, routeName])

  function drawCertificate() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 900
    const H = 620
    canvas.width = W
    canvas.height = H

    // ── Background ──
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0,   '#0F172A')
    bg.addColorStop(0.5, '#1E293B')
    bg.addColorStop(1,   '#0F172A')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // ── Outer border ──
    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = 3
    roundRect(ctx, 16, 16, W - 32, H - 32, 16)
    ctx.stroke()

    // ── Inner subtle border ──
    ctx.strokeStyle = 'rgba(16,185,129,0.25)'
    ctx.lineWidth = 1
    roundRect(ctx, 28, 28, W - 56, H - 56, 12)
    ctx.stroke()

    // ── Top accent bar ──
    const accent = ctx.createLinearGradient(60, 0, W - 60, 0)
    accent.addColorStop(0, 'transparent')
    accent.addColorStop(0.3, '#10B981')
    accent.addColorStop(0.7, '#10B981')
    accent.addColorStop(1, 'transparent')
    ctx.fillStyle = accent
    ctx.fillRect(60, 56, W - 120, 3)

    // ── Bottom accent bar ──
    ctx.fillStyle = accent
    ctx.fillRect(60, H - 59, W - 120, 3)

    // ── Corner decorations ──
    const corners = [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]]
    corners.forEach(([x, y]) => {
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.stroke()
    })

    // ── App name ──
    ctx.fillStyle = '#10B981'
    ctx.font = 'bold 18px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ENGLISH FOR WORK', W / 2, 105)

    // ── Separator dots ──
    ctx.fillStyle = 'rgba(16,185,129,0.4)'
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath()
      ctx.arc(W / 2 + i * 14, 122, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // ── "Certificado de" ──
    ctx.fillStyle = 'rgba(148,163,184,0.85)'
    ctx.font = '400 15px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('CERTIFICADO DE FINALIZACIÓN', W / 2, 162)

    // ── Username ──
    ctx.fillStyle = '#F8FAFC'
    ctx.font = 'bold 46px "Georgia", "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText(userName, W / 2, 240)

    // ── Underline under name ──
    const nameWidth = ctx.measureText(userName).width
    const underlineGrad = ctx.createLinearGradient(
      W / 2 - nameWidth / 2, 0, W / 2 + nameWidth / 2, 0
    )
    underlineGrad.addColorStop(0, 'transparent')
    underlineGrad.addColorStop(0.5, 'rgba(16,185,129,0.6)')
    underlineGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = underlineGrad
    ctx.fillRect(W / 2 - nameWidth / 2, 252, nameWidth, 1.5)

    // ── Body text ──
    ctx.fillStyle = 'rgba(148,163,184,0.9)'
    ctx.font = '400 16px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ha completado exitosamente la ruta de aprendizaje', W / 2, 300)

    // ── Route name ──
    ctx.fillStyle = '#10B981'
    ctx.font = 'bold 26px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(routeName, W / 2, 348)

    // ── Date ──
    const dateStr = new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
    ctx.fillStyle = 'rgba(148,163,184,0.7)'
    ctx.font = '400 14px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(dateStr, W / 2, 395)

    // ── Medal emoji ──
    ctx.font = '52px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🏆', W / 2, 472)

    // ── Footer ──
    ctx.fillStyle = 'rgba(100,116,139,0.6)'
    ctx.font = '12px "Inter", system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${brand.name} · English for Work · ${brand.legal.country}`, W / 2, 560)

    setReady(true)
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `certificado-english-for-work-${Date.now()}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  async function handleShare() {
    const canvas = canvasRef.current
    if (!canvas) return
    setSharing(true)
    try {
      // Try Web Share API with file (mobile)
      if (navigator.canShare && navigator.share) {
        canvas.toBlob(async (blob) => {
          try {
            const file = new File([blob], 'certificado-english-for-work.png', { type: 'image/png' })
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: '¡Completé una ruta en English for Work! 🏆',
                text: `Acabo de completar la ruta "${routeName}" en English for Work. ¡Inglés para trabajar!`,
                files: [file],
              })
            } else {
              // Fallback: share URL only
              await navigator.share({
                title: '¡Completé una ruta en English for Work! 🏆',
                text: `Acabo de completar la ruta "${routeName}". ¡Aprende inglés para conseguir trabajo!`,
                url: window.location.origin,
              })
            }
          } catch (e) {
            if (e.name !== 'AbortError') handleDownload()
          } finally {
            setSharing(false)
          }
        }, 'image/png')
      } else {
        // Desktop: just download
        handleDownload()
        setSharing(false)
      }
    } catch {
      setSharing(false)
    }
  }

  function handleLinkedIn() {
    const url = encodeURIComponent(window.location.origin)
    const text = encodeURIComponent(
      `¡Acabo de completar la ruta "${routeName}" en English for Work! 🏆 Aprendiendo inglés profesional para el trabajo. #EnglishForWork #InglésLaboral`
    )
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank')
  }

  return createPortal(
    <div className="cert-overlay" onClick={onClose}>
      <div className="cert-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cert-modal-header">
          <h2 className="cert-modal-title">🏆 ¡Ruta completada!</h2>
          <button className="cert-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <p className="cert-modal-sub">
          Has completado <strong>{routeName}</strong>. Descarga tu certificado y compártelo.
        </p>

        {/* Canvas certificate */}
        <div className="cert-canvas-wrap">
          <canvas ref={canvasRef} className="cert-canvas" />
          {!ready && <div className="cert-canvas-loading">Generando certificado...</div>}
        </div>

        {/* Action buttons */}
        <div className="cert-actions">
          <button className="cert-btn cert-btn-download" onClick={handleDownload} disabled={!ready}>
            ⬇️ Descargar PNG
          </button>
          <button className="cert-btn cert-btn-share" onClick={handleShare} disabled={!ready || sharing}>
            {sharing ? '...' : '📤 Compartir'}
          </button>
          <button className="cert-btn cert-btn-linkedin" onClick={handleLinkedIn} disabled={!ready}>
            💼 LinkedIn
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
