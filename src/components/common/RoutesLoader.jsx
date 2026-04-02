import { useState, useEffect } from 'react'
import './RoutesLoader.css'

const MESSAGES = [
  'Cargando tus rutas...',
  'Preparando tus misiones...',
  '¡Ya casi estás listo!',
]

export function RoutesLoader() {
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="rl-wrap">
      <div className="rl-scene">
        {/* Briefcase SVG */}
        <svg className="rl-svg" viewBox="0 0 120 100" fill="none" aria-hidden="true">
          {/* Open-box side walls — visible once lid is gone */}
          <line x1="9"   y1="36" x2="9"   y2="54" className="rl-side" />
          <line x1="111" y1="36" x2="111" y2="54" className="rl-side" />

          {/* Body (static) */}
          <rect x="8" y="52" width="104" height="42" rx="8" className="rl-body" />

          {/* Clasp detail */}
          <rect x="48" y="55" width="24" height="15" rx="5" className="rl-clasp" />
          <rect x="54" y="59" width="12" height="7"  rx="3" className="rl-clasp-inner" />

          {/* Lid group — opens on mount */}
          <g className="rl-lid-group">
            {/* Handle */}
            <path
              d="M44 35 Q44 16 60 16 Q76 16 76 35"
              className="rl-handle"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Lid */}
            <rect x="8" y="35" width="104" height="19" rx="8" className="rl-lid" />
          </g>
        </svg>

        {/* Floating route icons */}
        <div className="rl-fi rl-fi-1">💼</div>
        <div className="rl-fi rl-fi-2">🎯</div>
        <div className="rl-fi rl-fi-3">🎧</div>
      </div>

      {/* Cycling message */}
      <p className="rl-msg" key={msgIdx}>{MESSAGES[msgIdx]}</p>

      {/* Shimmer bar */}
      <div className="rl-bar-track">
        <div className="rl-bar-fill" />
      </div>
    </div>
  )
}
