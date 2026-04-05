import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FirstMissionBanner.css'

const TIPS = [
  'Aprende frases reales que usan en entrevistas',
  '15 minutos al día es suficiente para progresar',
  'Cada lección te acerca a tu trabajo ideal',
  'Practica pronunciación con el audio de cada lección',
]

/**
 * Shown on dashboard when the user has 0% progress.
 * Animated figure + pulsing arrow pointing to first route.
 */
export function FirstMissionBanner({ firstRoute, onStart }) {
  const navigate = useNavigate()
  const [tipIdx, setTipIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setTipIdx(i => (i + 1) % TIPS.length)
    }, 3000)
    return () => clearInterval(t)
  }, [])

  function handleStart() {
    sessionStorage.setItem('highlight_first_lesson', '1')
    if (onStart) onStart()
    else if (firstRoute) navigate(`/ruta/${firstRoute.id}`)
  }

  return (
    <div className="fmb-banner">
      {/* Animated figure */}
      <div className="fmb-figure" aria-hidden="true">
        {/* Head */}
        <div className="fmb-head">
          <span className="fmb-face">😊</span>
        </div>
        {/* Body with waving arm */}
        <div className="fmb-body">
          <span className="fmb-arm fmb-arm-left">💼</span>
          <div className="fmb-torso" />
          <span className="fmb-arm fmb-arm-right fmb-wave">👋</span>
        </div>
        {/* Bouncing arrow */}
        <div className="fmb-arrow-row">
          <div className="fmb-arrow-bounce">↓</div>
        </div>
      </div>

      {/* Text */}
      <div className="fmb-content">
        <h3 className="fmb-title">¡Tu primera misión te espera!</h3>
        <p className="fmb-tip" key={tipIdx}>{TIPS[tipIdx]}</p>
        <button className="fmb-cta" onClick={handleStart}>
          🚀 Comenzar ahora
        </button>
      </div>
    </div>
  )
}
