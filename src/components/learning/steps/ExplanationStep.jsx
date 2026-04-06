import { useState, useEffect } from 'react'
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
        <div className="expl-pin">📌 Punto clave</div>
        <p className="expl-text">{point.text}</p>
        {point.example && (
          <div className="expl-example">
            <p className="expl-example-label">Ejemplo:</p>
            <p className="expl-example-text">{point.example}</p>
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
