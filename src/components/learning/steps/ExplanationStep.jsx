import { useState, useEffect } from 'react'
import './Steps.css'

export default function ExplanationStep({ data, onCanAdvance }) {
  const points = data?.points || []
  const [current, setCurrent] = useState(0)

  useEffect(() => { onCanAdvance?.(true) }, [])

  if (!points.length) return (
    <div className="step-wrapper">
      <p style={{ color: 'var(--el-text-muted)', fontSize: 14 }}>Sin puntos de explicación.</p>
    </div>
  )

  const point = points[current]

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Counter */}
      <div className="step-counter">Punto {current + 1} / {points.length}</div>

      {/* Explanation card */}
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
          <button
            key={i}
            className={`step-page-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', flexShrink: 0 }}>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-text-muted)', fontSize: 13, cursor: current > 0 ? 'pointer' : 'default', opacity: current > 0 ? 1 : 0.3 }}
          onClick={() => current > 0 && setCurrent(c => c - 1)}
        >← Anterior</button>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--el-primary)', fontSize: 13, fontWeight: 600, cursor: current < points.length - 1 ? 'pointer' : 'default', opacity: current < points.length - 1 ? 1 : 0.3 }}
          onClick={() => current < points.length - 1 && setCurrent(c => c + 1)}
        >Siguiente →</button>
      </div>
    </div>
  )
}
