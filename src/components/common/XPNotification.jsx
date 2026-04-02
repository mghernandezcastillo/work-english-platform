import { useEffect, useState } from 'react'
import './XPNotification.css'

/**
 * XP gain animation — shows "+25 XP" floating up then fades.
 * Usage: mount it with `show={true}`, unmount after ~2s.
 */
export function XPNotification({ xp = 25, show = false }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(t)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className="xp-notification" aria-live="polite">
      <span className="xp-star">⭐</span>
      <span className="xp-text">+{xp} XP</span>
    </div>
  )
}
