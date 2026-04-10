import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './BadgesPanel.css'

export function BadgesPanel() {
  const { profile } = useAuth()
  const [definitions, setDefinitions] = useState([])
  const [earned, setEarned] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState(null) // { id, name, description }

  useEffect(() => {
    if (!profile?.id) return
    loadBadges()
  }, [profile?.id])

  async function loadBadges() {
    const [{ data: defs }, { data: userBadges }] = await Promise.all([
      supabase.from('badge_definitions').select('*').order('condition_value'),
      supabase.from('user_badges').select('badge_id').eq('user_id', profile.id),
    ])
    setDefinitions(defs || [])
    setEarned(new Set((userBadges || []).map(b => b.badge_id)))
    setLoading(false)
  }

  function handleBadgeClick(def, isEarned) {
    if (isEarned) {
      setTooltip({ id: def.id, text: `✅ ${def.name} — +${def.xp_reward} XP`, earned: true })
    } else {
      setTooltip({ id: def.id, text: `🔒 ${def.description}`, earned: false })
    }
    // Auto-dismiss after 3s
    setTimeout(() => setTooltip(prev => prev?.id === def.id ? null : prev), 3000)
  }

  if (loading) return null

  const earnedCount = [...earned].filter(id => definitions.find(d => d.id === id)).length

  return (
    <div className="badges-panel">
      <div className="badges-header">
        <span className="badges-title">🏅 Logros</span>
        <span className="badges-count">{earnedCount}/{definitions.length}</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className={`badge-tooltip ${tooltip.earned ? 'badge-tooltip-earned' : 'badge-tooltip-locked'}`}
             onClick={() => setTooltip(null)}>
          {tooltip.text}
        </div>
      )}

      <div className="badges-grid">
        {definitions.map(def => {
          const isEarned = earned.has(def.id)
          return (
            <div
              key={def.id}
              className={`badge-item ${isEarned ? 'badge-earned' : 'badge-locked'}`}
              onClick={() => handleBadgeClick(def, isEarned)}
            >
              <span className="badge-emoji">{isEarned ? def.emoji : '🔒'}</span>
              <span className="badge-name">{def.name}</span>
              {isEarned && def.xp_reward > 0 && (
                <span className="badge-xp">+{def.xp_reward} XP</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

