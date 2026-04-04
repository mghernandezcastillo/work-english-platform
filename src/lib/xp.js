import { supabase } from './supabase'

export const XP_PER_LESSON = 25

/**
 * Awards XP to a user after completing a lesson and checks/awards any new badges.
 * Returns { newXP, newBadges[] }
 */
export async function awardLessonXP(userId, lessonsCompleted, streakDays) {
  // 1. Increment XP in profiles
  const { data: profile, error: xpError } = await supabase.rpc('increment_xp', {
    p_user_id: userId,
    p_amount: XP_PER_LESSON,
  })

  if (xpError) {
    console.error('XP award error:', xpError)
    return { newXP: 0, newBadges: [] }
  }

  const totalXP = profile?.xp ?? 0

  // 2. Check which badges the user should earn
  const newBadges = await checkAndAwardBadges(userId, {
    lessonsCompleted,
    streakDays,
    totalXP,
  })

  return { newXP: XP_PER_LESSON, newBadges, totalXP }
}

/**
 * Checks all badge conditions and awards any not yet earned.
 * @param {string} userId
 * @param {Object} params - Can include: lessonsCompleted, streakDays, totalXP, match_fast, perfect_exercises, perfect_match
 */
export async function checkAndAwardBadges(userId, params = {}) {
  const { lessonsCompleted = 0, streakDays = 0, totalXP = 0 } = params
  const stats = params // pass everything for custom conditions
  // Get all definitions
  const { data: definitions } = await supabase
    .from('badge_definitions')
    .select('*')

  if (!definitions?.length) return []

  // Get already earned badges
  const { data: earned } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  const earnedIds = new Set((earned || []).map(b => b.badge_id))
  const toAward = []

  for (const def of definitions) {
    if (earnedIds.has(def.id)) continue

    let qualifies = false
    if (def.condition_type === 'lessons_completed' && lessonsCompleted >= def.condition_value) qualifies = true
    if (def.condition_type === 'streak_days' && streakDays >= def.condition_value) qualifies = true
    if (def.condition_type === 'xp_total' && totalXP >= def.condition_value) qualifies = true
    if (def.condition_type === 'match_fast' && (stats?.match_fast ?? 0) >= def.condition_value) qualifies = true
    if (def.condition_type === 'perfect_exercises' && (stats?.perfect_exercises ?? 0) >= def.condition_value) qualifies = true
    if (def.condition_type === 'perfect_match' && (stats?.perfect_match ?? 0) >= def.condition_value) qualifies = true
    // route_completed is handled separately via RouteView

    if (qualifies) toAward.push(def)
  }

  if (!toAward.length) return []

  // Insert new badges
  await supabase.from('user_badges').insert(
    toAward.map(b => ({ user_id: userId, badge_id: b.id }))
  )

  // Award bonus XP for badge rewards
  const bonusXP = toAward.reduce((sum, b) => sum + (b.xp_reward || 0), 0)
  if (bonusXP > 0) {
    await supabase.rpc('increment_xp', { p_user_id: userId, p_amount: bonusXP })
  }

  return toAward
}
