import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './BadgesPanel.css'

export function BadgesPanel() {
  const { profile } = useAuth()
  const [definitions, setDefinitions] = useState([])
  const [earned, setEarned] = useState(new Set())
  const [loading, setLoading] = useState(true)

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

  if (loading) return null

  const earnedCount = [...earned].filter(id => definitions.find(d => d.id === id)).length

  return (
    <div className="badges-panel">
      <div className="badges-header">
        <span className="badges-title">🏅 Logros</span>
        <span className="badges-count">{earnedCount}/{definitions.length}</span>
      </div>
      <div className="badges-grid">
        {definitions.map(def => {
          const isEarned = earned.has(def.id)
          return (
            <div
              key={def.id}
              className={`badge-item ${isEarned ? 'badge-earned' : 'badge-locked'}`}
              title={isEarned ? def.name : `🔒 ${def.description}`}
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
