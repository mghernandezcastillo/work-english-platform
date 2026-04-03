import { useState, useEffect, useCallback } from 'react'
import './Steps.css'

/**
 * MatchStep — "Conecta la frase"
 * Match English phrases to their Spanish translations.
 * Uses the same phrase data that already exists in every lesson.
 */
export default function MatchStep({ data }) {
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

  // Initialize game
  useEffect(() => {
    if (allPhrases.length === 0) return
    const selected = [...allPhrases]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, allPhrases.length))
    setPairs(selected)
    setShuffledRight([...selected].sort(() => Math.random() - 0.5))
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

      if (newMatched.size === pairs.length) {
        setCompleted(true)
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
