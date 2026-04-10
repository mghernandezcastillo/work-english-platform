import { useState, useEffect } from 'react'
import ClickablePhrase from '../ClickablePhrase'
import './Steps.css'

/**
 * Formats explanation text: detects numbered items (1) ... 2) ... or 1. ... 2. ...)
 * and renders them as a compact styled list. Non-numbered text stays as paragraphs.
 */
function formatExplanation(text) {
  if (!text) return null
  // Try to split by numbered patterns: "1) " or "1. " at start or after comma/space
  const numbered = text.match(/\d+\)\s[^,]*(?:,\s*\d+\)\s[^,]*)*/s)
  if (!numbered) {
    // Also try "1. " pattern
    const dotNumbered = text.match(/\d+\.\s/g)
    if (!dotNumbered || dotNumbered.length < 3) {
      // No list detected — just return paragraphs split by \n
      const lines = text.split(/\n+/).filter(l => l.trim())
      if (lines.length <= 1) return <p className="expl-text">{text}</p>
      return (
        <div className="expl-text expl-text-lines">
          {lines.map((line, i) => <p key={i} className="expl-line">{line.trim()}</p>)}
        </div>
      )
    }
  }
  // Extract numbered items: split on number pattern
  const parts = text.split(/(?=\d+[.)]\s)/)
  const intro = []
  const items = []
  const outro = []
  let foundFirst = false
  let lastItemIdx = -1

  for (const part of parts) {
    const match = part.match(/^(\d+)[.)]\s*(.*)$/s)
    if (match) {
      foundFirst = true
      lastItemIdx = items.length
      items.push({ num: match[1], text: match[2].replace(/,\s*$/, '').trim() })
    } else if (!foundFirst) {
      intro.push(part.trim())
    } else {
      // Text after the last numbered item — append to outro
      outro.push(part.trim())
    }
  }

  // If the last item ends with trailing text after a period, split it
  if (items.length > 0) {
    const lastItem = items[items.length - 1]
    // Check if there's a sentence after the last item that's not really part of it
    const trailMatch = lastItem.text.match(/^(.*?\.)\s+((?:[A-Z]|Nunca|Siempre|No ).*)/s)
    if (trailMatch) {
      lastItem.text = trailMatch[1]
      outro.unshift(trailMatch[2])
    }
  }

  if (items.length < 3) {
    // Not enough items to justify a list
    return <p className="expl-text">{text}</p>
  }

  return (
    <div className="expl-text expl-formatted">
      {intro.length > 0 && intro[0] && (
        <p className="expl-intro">{intro.join(' ')}</p>
      )}
      <div className="expl-list">
        {items.map((item, i) => (
          <div key={i} className="expl-list-item">
            <span className="expl-list-num">{item.num}</span>
            <span className="expl-list-content">{item.text}</span>
          </div>
        ))}
      </div>
      {outro.length > 0 && outro[0] && (
        <p className="expl-outro">{outro.join(' ')}</p>
      )}
    </div>
  )
}

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

      {/* Explanation card — scrollable if content is long */}
      <div className="step-card-glass expl-card-scroll">
        {/* Decorative lightbulb SVG — compact */}
        <div className="expl-icon-wrap expl-icon-compact">
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="expl-bulb-svg">
            <circle cx="24" cy="20" r="16" fill="url(#bulbGlow)" opacity="0.25" />
            <path d="M24 6C18.48 6 14 10.48 14 16c0 3.64 1.94 6.82 4.84 8.58.46.28.76.78.76 1.34V28c0 .55.45 1 1 1h6.8c.55 0 1-.45 1-1v-2.08c0-.56.3-1.06.76-1.34C32.06 22.82 34 19.64 34 16c0-5.52-4.48-10-10-10z" fill="url(#bulbBody)" />
            <path d="M20 32h8M21 35h6M22 38h4" stroke="var(--el-primary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
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
        {formatExplanation(point.text)}
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
