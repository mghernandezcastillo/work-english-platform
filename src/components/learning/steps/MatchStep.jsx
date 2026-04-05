import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { checkAndAwardBadges } from '../../../lib/xp'
import './Steps.css'

/**
 * MatchStep — "Conecta la frase"
 * Match English phrases to their Spanish translations.
 * Uses the same phrase data that already exists in every lesson.
 */

/**
 * Produces a derangement — a shuffle where NO element stays at its original index.
 * This guarantees no Spanish phrase sits directly next to its English pair.
 */
function derange(arr) {
  const n = arr.length
  if (n <= 1) return [...arr]
  if (n === 2) return [arr[1], arr[0]] // Only one derangement possible

  // Fisher-Yates with rejection: shuffle until no element is in its original position
  // For n >= 3, ~63% of permutations are derangements, so this converges fast
  let result
  let attempts = 0
  do {
    result = [...arr]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    attempts++
  } while (result.some((item, i) => item.en === arr[i].en) && attempts < 100)

  return result
}

export default function MatchStep({ data, onComplete }) {
  const { profile } = useAuth()
  const allPhrases = data?.phrases || []
  // Pick up to 5 random phrases for the match game
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
  const [sparkling, setSparkling] = useState(new Set())

  // Initialize game
  useEffect(() => {
    if (allPhrases.length === 0) return
    const selected = [...allPhrases]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, allPhrases.length))
    setPairs(selected)
    setShuffledRight(derange(selected))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (completed) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [completed, startTime])

  const checkMatch = useCallback((leftIdx, rightIdx) => {
    const leftPhrase = pairs[leftIdx]
    const rightPhrase = shuffledRight[rightIdx]
    setAttempts(a => a + 1)

    if (leftPhrase.en === rightPhrase.en) {
      // Correct match!
      const newMatched = new Set(matched)
      newMatched.add(leftIdx)
      setMatched(newMatched)
      setSelectedLeft(null)
      setSelectedRight(null)
      // Sparkle effect: mark as sparkling briefly
      setWrongPair(null)
      // Use a temporary sparkle set
      setSparkling(prev => {
        const next = new Set(prev)
        next.add(leftIdx)
        return next
      })
      setTimeout(() => {
        setSparkling(prev => {
          const next = new Set(prev)
          next.delete(leftIdx)
          return next
        })
      }, 500)

      if (newMatched.size === pairs.length) {
        setCompleted(true)
        // Notify parent so outer nav appears
        if (onComplete) onComplete()
        // Check for Velocista badge (<30s) or Sin Errores (100% accuracy)
        if (profile?.id) {
          const finalAccuracy = Math.round((newMatched.size / (attempts + 1)) * 100)
          checkAndAwardBadges(profile.id, {
            match_fast: elapsed < 30 ? 1 : 0,
            perfect_match: finalAccuracy === 100 ? 1 : 0,
            lessonsCompleted: 0, streakDays: 0, totalXP: profile.xp ?? 0,
          }).catch(() => {})
        }
      }
    } else {
      // Wrong match — flash red briefly
      setWrongPair({ left: leftIdx, right: rightIdx })
      setTimeout(() => {
        setWrongPair(null)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 600)
    }
  }, [pairs, shuffledRight, matched])

  function handleLeftClick(idx) {
    if (matched.has(idx)) return
    if (wrongPair) return
    setSelectedLeft(idx)
    if (selectedRight !== null) {
      checkMatch(idx, selectedRight)
    }
  }

  function handleRightClick(idx) {
    // Find if this right item is already matched
    const rightPhrase = shuffledRight[idx]
    const leftIdx = pairs.findIndex(p => p.en === rightPhrase.en)
    if (matched.has(leftIdx)) return
    if (wrongPair) return
    setSelectedRight(idx)
    if (selectedLeft !== null) {
      checkMatch(selectedLeft, idx)
    }
  }

  function isRightMatched(idx) {
    const rightPhrase = shuffledRight[idx]
    const leftIdx = pairs.findIndex(p => p.en === rightPhrase.en)
    return matched.has(leftIdx)
  }

  if (allPhrases.length < 2) {
    return null // Not enough phrases for a match game
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
  const accuracy = attempts > 0 ? Math.round((matched.size / attempts) * 100) : 0

  if (completed) {
    return (
      <div className="step-container animate-fadeIn text-center">
        <div style={{ fontSize: 48, marginBottom: 'var(--space-3)' }}>
          {accuracy >= 80 ? '🎯' : accuracy >= 50 ? '👏' : '💪'}
        </div>
        <h3 style={{ marginBottom: 'var(--space-2)' }}>¡Todas las frases conectadas!</h3>
        <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
          {pairs.length} pares en {formatTime(elapsed)} · {accuracy}% precisión
        </p>
        
        <div className="match-results-grid">
          {pairs.map((p, i) => (
            <div key={i} className="match-result-card animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="match-result-en">{p.en}</span>
              <span className="match-result-arrow">↔</span>
              <span className="match-result-es">{p.es}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="step-container animate-fadeIn">
      <div className="step-badge">🔗 Conecta la frase</div>
      <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-2)' }}>
        Toca una frase en inglés y luego su traducción en español.
      </p>

      {/* Stats bar */}
      <div className="match-stats-bar">
        <span className="match-stat-item">⏱ {formatTime(elapsed)}</span>
        <span className="match-stat-item">✅ {matched.size}/{pairs.length}</span>
      </div>

      {/* Progress dots */}
      <div className="match-progress-dots">
        {pairs.map((_, i) => (
          <div 
            key={i} 
            className={`match-dot ${matched.has(i) ? 'matched' : ''}`}
          />
        ))}
      </div>

      {/* Match columns */}
      <div className="match-columns">
        {/* English column */}
        <div className="match-column">
          <div className="match-column-header">🇺🇸 English</div>
          {pairs.map((p, i) => (
            <button
              key={i}
              className={`match-card match-card-en
                ${matched.has(i) ? ' matched' : ''}
                ${sparkling.has(i) ? ' sparkling' : ''}
                ${selectedLeft === i ? ' selected' : ''}
                ${wrongPair?.left === i ? ' wrong' : ''}
              `}
              onClick={() => handleLeftClick(i)}
              disabled={matched.has(i)}
            >
              {p.en}
            </button>
          ))}
        </div>

        {/* Spanish column */}
        <div className="match-column">
          <div className="match-column-header">🇪🇸 Español</div>
          {shuffledRight.map((p, i) => (
            <button
              key={i}
              className={`match-card match-card-es
                ${isRightMatched(i) ? ' matched' : ''}
                ${selectedRight === i ? ' selected' : ''}
                ${wrongPair?.right === i ? ' wrong' : ''}
              `}
              onClick={() => handleRightClick(i)}
              disabled={isRightMatched(i)}
            >
              {p.es}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
