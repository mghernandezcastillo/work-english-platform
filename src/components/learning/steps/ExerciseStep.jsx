import { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { checkAndAwardBadges } from '../../../lib/xp'
import './Steps.css'

export default function ExerciseStep({ data, onComplete, onCanAdvance }) {
  const { profile } = useAuth()
  const exercises = data?.exercises || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [mistakes, setMistakes] = useState([])

  const current = exercises[currentIndex]

  // While answer not verified, disable global Next button
  useEffect(() => {
    onCanAdvance?.(false)
  }, [currentIndex])

  // After result shown, re-enable global Next button only when finished
  useEffect(() => {
    if (finished) onCanAdvance?.(true)
  }, [finished])

  function checkAnswer(answer) {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)
    const isCorrect = current.type === 'fill'
      ? answer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
      : answer === current.correct
    if (isCorrect) {
      setScore(s => s + 1)
    } else {
      setMistakes(prev => [...prev, { question: current.question, yourAnswer: answer, correct: current.correct, explanation: current.explanation }])
    }
  }

  function nextExercise() {
    const isLast = currentIndex + 1 >= exercises.length
    if (isLast) {
      const finalScore = score + (isCurrentCorrect() ? 1 : 0)
      setFinished(true)
      if (onComplete) onComplete(finalScore)
      if (profile?.id && finalScore === exercises.length && exercises.length > 0) {
        checkAndAwardBadges(profile.id, { perfect_exercises: 1, lessonsCompleted: 0, streakDays: 0, totalXP: profile.xp ?? 0 }).catch(() => {})
      }
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      onCanAdvance?.(false)
    }
  }

  function isCurrentCorrect() {
    if (!current) return false
    return current.type === 'fill'
      ? selectedAnswer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
      : selectedAnswer === current.correct
  }

  if (exercises.length === 0) return (
    <div className="step-wrapper">
      <p style={{ color: 'var(--el-text-muted)', fontSize: 14 }}>Ejercicios en desarrollo...</p>
    </div>
  )

  // ── Finished screen ──
  if (finished) {
    const percent = Math.round((score / exercises.length) * 100)
    return (
      <div className="step-wrapper animate-fadeIn">
        <div className="exercise-result">
          <div className="exercise-result-emoji">{percent >= 80 ? '🎉' : percent >= 50 ? '💪' : '📚'}</div>
          <p className="exercise-result-title">¡Ejercicios completados!</p>
          <p className="exercise-result-sub">{score} de {exercises.length} correctas ({percent}%)</p>
          <div className="exercise-result-bar-wrap">
            <div className="exercise-result-bar-fill" style={{
              width: `${percent}%`,
              background: percent >= 80 ? 'var(--el-primary)' : percent >= 50 ? '#F59E0B' : '#EF4444'
            }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--el-text-muted)' }}>
            {percent === 100 ? '¡Perfecto! Dominaste todos los ejercicios 🏆' : percent < 80 ? 'Repasa las frases para mejorar tu puntaje' : '¡Muy bien! Sigue así.'}
          </p>
        </div>
      </div>
    )
  }

  // ── Question in progress ──
  const progressPct = Math.round((currentIndex / exercises.length) * 100)

  return (
    <div className="step-wrapper animate-fadeIn">
      {/* Progress */}
      <div className="exercise-q-progress">
        <span>Pregunta {currentIndex + 1} / {exercises.length}</span>
        <span style={{ color: 'var(--el-primary)', fontWeight: 700 }}>{progressPct}% completado</span>
      </div>
      <div className="exercise-q-bar">
        <div className="exercise-q-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question card */}
      <div className="step-card-glass" style={{ marginBottom: 10, flexShrink: 0 }}>
        <p className="exercise-question-text">{current.question}</p>
        {current.context && <p className="exercise-context">{current.context}</p>}
      </div>

      {/* Multiple choice */}
      {current.type === 'choose' && (
        <div className="exercise-options-list" style={{ flex: 1, minHeight: 0, overflowY: 'hidden' }}>
          {current.options.map((opt, i) => {
            let cls = 'exercise-option-btn'
            if (showResult) {
              if (opt === current.correct) cls += ' correct'
              else if (opt === selectedAnswer) cls += ' wrong'
            } else if (opt === selectedAnswer) cls += ' selected'
            return (
              <button key={i} className={cls} onClick={() => !showResult && checkAnswer(opt)} disabled={showResult}>
                <span className="exercise-option-badge">{String.fromCharCode(65 + i)}</span>
                <span className="exercise-option-text">{opt}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Fill in blank */}
      {current.type === 'fill' && (
        <div style={{ flexShrink: 0 }}>
          <input
            className="exercise-input"
            placeholder="Escribe tu respuesta..."
            value={selectedAnswer || ''}
            onChange={e => setSelectedAnswer(e.target.value)}
            disabled={showResult}
            onKeyDown={e => e.key === 'Enter' && !showResult && checkAnswer(selectedAnswer)}
          />
        </div>
      )}

      {/* Feedback */}
      {showResult && (
        <div className={`exercise-feedback ${isCurrentCorrect() ? 'correct' : 'wrong'} animate-fadeIn`}>
          {isCurrentCorrect()
            ? '✅ ¡Correcto!'
            : `❌ Correcta: "${current.correct}"`}
          {current.explanation && <p style={{ fontSize: 12, marginTop: 4, opacity: 0.85 }}>💡 {current.explanation}</p>}
        </div>
      )}

      {/* Next exercise button (inline, only after answering) */}
      {showResult && !finished && (
        <button
          onClick={nextExercise}
          style={{
            background: 'var(--el-surface-high)',
            border: 'none',
            borderRadius: 10,
            padding: '12px 0',
            color: 'var(--el-primary)',
            fontSize: 14,
            fontWeight: 700,
            width: '100%',
            marginTop: 8,
            cursor: 'pointer',
            fontFamily: 'Manrope, sans-serif',
            flexShrink: 0,
          }}
        >
          {currentIndex + 1 >= exercises.length ? 'Ver resultado →' : 'Siguiente ejercicio →'}
        </button>
      )}
    </div>
  )
}
