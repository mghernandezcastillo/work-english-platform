import { useEffect } from 'react'
import './Steps.css'

export default function ObjectiveStep({ data, onCanAdvance }) {
  // Objective is always advanceable
  useEffect(() => { onCanAdvance?.(true) }, [])

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Title + description */}
      <div className="step-card-glass" style={{ marginBottom: 12, flexShrink: 0 }}>
        <p className="objective-title">{data?.title || 'Objetivo de la lección'}</p>
        <p className="objective-desc">{data?.description || ''}</p>
      </div>

      {/* Checklist — scroll within if needed but most lessons have ≤5 items */}
      {data?.whatYouWillLearn && (
        <div className="objective-list" style={{ overflowY: 'auto', flex: 1 }}>
          {data.whatYouWillLearn.map((item, i) => (
            <div key={i} className="objective-item animate-fadeIn" style={{ animationDelay: `${i * 0.06}s` }}>
              <span className="objective-check">✓</span>
              <span className="objective-item-text">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
