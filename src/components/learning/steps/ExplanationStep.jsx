import { useState, useEffect } from 'react'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

export default function ExplanationStep({ data, onCanAdvance }) {
  const points = data?.points || []
  const [current, setCurrent] = useState(0)

  useEffect(() => { onCanAdvance?.(true) }, [])

  if (!points.length) return (
    <div className="step-wrapper"><p style={{ color: 'var(--el-text-muted)', fontSize: 15 }}>Sin puntos de explicación.</p></div>
  )

  const point = points[current]

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Counter */}
      <div className="step-counter">Punto {current + 1} / {points.length}</div>

      {/* Explanation card — takes all available space */}
      <div className="step-card-glass" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Decorative lightbulb SVG */}
        <div className="expl-icon-wrap">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="expl-bulb-svg">
            {/* Glow circle */}
            <circle cx="24" cy="20" r="16" fill="url(#bulbGlow)" opacity="0.25" />
            {/* Bulb body */}
            <path d="M24 6C18.48 6 14 10.48 14 16c0 3.64 1.94 6.82 4.84 8.58.46.28.76.78.76 1.34V28c0 .55.45 1 1 1h6.8c.55 0 1-.45 1-1v-2.08c0-.56.3-1.06.76-1.34C32.06 22.82 34 19.64 34 16c0-5.52-4.48-10-10-10z" fill="url(#bulbBody)" />
            {/* Filament lines */}
            <path d="M20 32h8M21 35h6M22 38h4" stroke="var(--el-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            {/* Light rays */}
            <line x1="24" y1="2" x2="24" y2="4" stroke="var(--el-primary-light)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <line x1="36" y1="8" x2="34.6" y2="9.4" stroke="var(--el-primary-light)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            <line x1="12" y1="8" x2="13.4" y2="9.4" stroke="var(--el-primary-light)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            <line x1="40" y1="16" x2="38" y2="16" stroke="var(--el-primary-light)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            <line x1="8" y1="16" x2="10" y2="16" stroke="var(--el-primary-light)" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
            <defs>
              <radialGradient id="bulbGlow" cx="0.5" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="var(--el-primary)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--el-primary)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bulbBody" x1="14" y1="6" x2="34" y2="30">
                <stop offset="0%" stopColor="var(--el-primary-light)" />
                <stop offset="100%" stopColor="var(--el-primary)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="expl-pin">📌 Punto clave</div>
        <p className="expl-text">{point.text}</p>
        {point.example && (
          <div className="expl-example">
            <p className="expl-example-label">Ejemplo:</p>
            <p className="expl-example-text"><ClickablePhrase text={point.example} /></p>
          </div>
        )}
      </div>

      {/* Pagination dots */}
      <div className="step-page-dots">
        {points.map((_, i) => (
          <button key={i} className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Inline prev/next — chevron symbols only */}
      <div className="step-inline-nav">
        <button className="step-inline-btn" onClick={() => current > 0 && setCurrent(c => c - 1)} disabled={current === 0}>‹</button>
        <span className="step-inline-label">{current + 1} de {points.length}</span>
        <button className="step-inline-btn pulse" onClick={() => current < points.length - 1 && setCurrent(c => c + 1)} disabled={current === points.length - 1}>›</button>
      </div>
    </div>
  )
}
