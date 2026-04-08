import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { checkAndAwardBadges } from '../../../lib/xp'
import './Steps.css'

function derange(arr) {
  const n = arr.length
  if (n <= 1) return [...arr]
  if (n === 2) return [arr[1], arr[0]]
  let result, attempts = 0
  do {
    result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]]
    }
    attempts++
  } while (result.some((item, i) => item.en === arr[i].en) && attempts < 100)
  return result
}

export default function MatchStep({ data, onComplete, onCanAdvance, onActivity }) {
  const { profile } = useAuth()
  const allPhrases = data?.phrases || []
  const [pairs, setPairs] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wrongPair, setWrongPair] = useState(null)
  const [shuffledRight, setShuffledRight] = useState([])
  const [completed, setCompleted] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [startTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (allPhrases.length === 0) return
    const selected = [...allPhrases].sort(() => Math.random() - 0.5).slice(0, Math.min(5, allPhrases.length))
    setPairs(selected)
    setShuffledRight(derange(selected))
    onCanAdvance?.(false)
  }, []) // eslint-disable-line

  useEffect(() => {
    if (completed) return
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(interval)
  }, [completed, startTime])

  const checkMatch = useCallback((leftIdx, rightIdx) => {
    const leftPhrase = pairs[leftIdx]
    const rightPhrase = shuffledRight[rightIdx]
    setAttempts(a => a + 1)
    if (leftPhrase.en === rightPhrase.en) {
      const newMatched = new Set(matched)
      newMatched.add(leftIdx)
      setMatched(newMatched)
      setSelectedLeft(null)
      setSelectedRight(null)
      setWrongPair(null)
      if (newMatched.size === pairs.length) {
        setCompleted(true)
        onCanAdvance?.(true)
        onActivity?.('match_done')
        if (onComplete) onComplete()
        if (profile?.id) {
          const finalAccuracy = Math.round((newMatched.size / (attempts + 1)) * 100)
          checkAndAwardBadges(profile.id, {
            match_fast: elapsed < 30 ? 1 : 0, perfect_match: finalAccuracy === 100 ? 1 : 0,
            lessonsCompleted: 0, streakDays: 0, totalXP: profile.xp ?? 0,
          }).catch(() => {})
        }
      }
    } else {
      setWrongPair({ left: leftIdx, right: rightIdx })
      setTimeout(() => { setWrongPair(null); setSelectedLeft(null); setSelectedRight(null) }, 600)
    }
  }, [pairs, shuffledRight, matched, attempts, elapsed])

  function handleLeftClick(idx) {
    if (matched.has(idx) || wrongPair) return
    setSelectedLeft(idx)
    if (selectedRight !== null) checkMatch(idx, selectedRight)
  }
  function handleRightClick(idx) {
    const rightPhrase = shuffledRight[idx]
    const leftIdx = pairs.findIndex(p => p.en === rightPhrase.en)
    if (matched.has(leftIdx) || wrongPair) return
    setSelectedRight(idx)
    if (selectedLeft !== null) checkMatch(selectedLeft, idx)
  }
  function isRightMatched(idx) {
    const rightPhrase = shuffledRight[idx]
    const leftIdx = pairs.findIndex(p => p.en === rightPhrase.en)
    return matched.has(leftIdx)
  }

  if (allPhrases.length < 2) return null

  if (completed) {
    const accuracy = attempts > 0 ? Math.round((matched.size / attempts) * 100) : 100
    return (
      <div className="step-wrapper animate-fadeIn">
        <div className="match-complete">
          <div style={{ fontSize: 44 }}>{accuracy >= 80 ? '🎯' : '👏'}</div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--el-text)', fontFamily: 'Manrope,sans-serif' }}>¡Todas conectadas!</p>
          <p style={{ fontSize: 13, color: 'var(--el-text-muted)' }}>{pairs.length} pares · {accuracy}% precisión</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 }}>
            {pairs.map((p, i) => (
              <div key={i} className="step-card animate-fadeIn" style={{ animationDelay: `${i * 0.08}s`, display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
                <span style={{ color: 'var(--el-text)', flex: 1 }}>{p.en}</span>
                <span style={{ color: 'var(--el-primary)', fontWeight: 700 }}>↔</span>
                <span style={{ color: 'var(--el-text-muted)', flex: 1 }}>{p.es}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Instruction + score */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--el-text-muted)' }}>Toca inglés, luego español.</span>
        <span className="match-score" style={{ padding: 0 }}>{matched.size} / {pairs.length} conectados</span>
      </div>

      {/* Match columns */}
      <div className="match-columns" style={{ flex: 1, minHeight: 0 }}>
        {/* English */}
        <div className="match-col">
          <div className="match-col-label">🇺🇸 English</div>
          {pairs.map((p, i) => (
            <button
              key={i}
              className={`match-chip ${matched.has(i) ? 'matched' : ''} ${selectedLeft === i ? 'selected' : ''} ${wrongPair?.left === i ? 'wrong' : ''}`}
              onClick={() => handleLeftClick(i)}
              disabled={matched.has(i)}
            >{p.en}</button>
          ))}
        </div>
        {/* Spanish */}
        <div className="match-col">
          <div className="match-col-label">🇪🇸 Español</div>
          {shuffledRight.map((p, i) => (
            <button
              key={i}
              className={`match-chip ${isRightMatched(i) ? 'matched' : ''} ${selectedRight === i ? 'selected' : ''} ${wrongPair?.right === i ? 'wrong' : ''}`}
              onClick={() => handleRightClick(i)}
              disabled={isRightMatched(i)}
            >{p.es}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
