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
  const [hintLevel, setHintLevel] = useState(0) // 0=none, 1=partial, 2=full

  const current = exercises[currentIndex]

  // While answer not verified, disable global Next button
  useEffect(() => {
    onCanAdvance?.(false)
    setHintLevel(0) // reset hint on new question
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
      setHintLevel(0)
      onCanAdvance?.(false)
    }
  }

  function isCurrentCorrect() {
    if (!current) return false
    return current.type === 'fill'
      ? selectedAnswer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
      : selectedAnswer === current.correct
  }

  // Build a revealing hint: first half of each word visible
  function buildHint(answer) {
    return answer.split(' ').map(w => {
      const show = Math.max(1, Math.ceil(w.length / 2))
      return w.slice(0, show) + '\u00b7'.repeat(w.length - show)
    }).join('  ')
  }

  if (exercises.length === 0) return (
    <div className="step-wrapper">
      <p style={{ color: 'var(--el-text-muted)', fontSize: 14 }}>Ejercicios en desarrollo...</p>
    </div>
  )

  // Finished screen
  if (finished) {
    const percent = Math.round((score / exercises.length) * 100)
    return (
      <div className="step-wrapper animate-fadeIn">
        <div className="exercise-result">
          <div className="exercise-result-emoji">{percent >= 80 ? '\ud83c\udf89' : percent >= 50 ? '\ud83d\udcaa' : '\ud83d\udcda'}</div>
          <p className="exercise-result-title">{'\u00a1'}Ejercicios completados!</p>
          <p className="exercise-result-sub">{score} de {exercises.length} correctas ({percent}%)</p>
          <div className="exercise-result-bar-wrap">
            <div className="exercise-result-bar-fill" style={{
              width: `${percent}%`,
              background: percent >= 80 ? 'var(--el-primary)' : percent >= 50 ? '#F59E0B' : '#EF4444'
            }} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--el-text-muted)' }}>
            {percent === 100 ? '\u00a1Perfecto! Dominaste todos los ejercicios \ud83c\udfc6' : percent < 80 ? 'Repasa las frases para mejorar tu puntaje' : '\u00a1Muy bien! Sigue as\u00ed.'}
          </p>
        </div>
      </div>
    )
  }

  // Question in progress
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
          {/* Input row + hint icon */}
          <div style={{ position: 'relative' }}>
            <input
              className="exercise-input"
              placeholder="Escribe tu respuesta..."
              value={selectedAnswer || ''}
              onChange={e => setSelectedAnswer(e.target.value)}
              disabled={showResult}
              onKeyDown={e => e.key === 'Enter' && !showResult && checkAnswer(selectedAnswer)}
              style={{ paddingRight: 44 }}
            />
            {/* Hint button */}
            {!showResult && (
              <button
                onClick={() => setHintLevel(h => Math.min(h + 1, 2))}
                disabled={hintLevel >= 2}
                title={hintLevel === 0 ? 'Ver pista' : hintLevel === 1 ? 'Ver respuesta completa' : 'Pista m\u00e1xima'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: hintLevel < 2 ? 'pointer' : 'default',
                  fontSize: 20,
                  lineHeight: 1,
                  opacity: hintLevel >= 2 ? 0.35 : 1,
                  transition: 'opacity 0.2s, transform 0.15s',
                }}
                aria-label="Pista"
              >
                {hintLevel === 0 ? '\ud83d\udca1' : hintLevel === 1 ? '\ud83d\udd13' : '\u2713'}
              </button>
            )}
          </div>

          {/* Hint panel level 1: first half of each word + context */}
          {hintLevel === 1 && !showResult && (
            <div style={{
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              marginTop: 8,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {'\ud83d\udca1'} Pista
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--el-text)', letterSpacing: 2, fontFamily: 'monospace' }}>
                {buildHint(current.correct)}
              </p>
              <p style={{ fontSize: 12, color: 'var(--el-text-muted)', marginTop: 6 }}>
                {current.correct.split(' ').length} {current.correct.split(' ').length === 1 ? 'palabra' : 'palabras'} {'\u00b7'} {current.correct.length} letras en total
              </p>
              {current.context && (
                <p style={{ fontSize: 12, color: 'var(--el-text-muted)', marginTop: 3, fontStyle: 'italic' }}>
                  {'\ud83d\udcdd'} Contexto: &quot;{current.context}&quot;
                </p>
              )}
              {current.explanation && (
                <p style={{ fontSize: 12, color: '#F59E0B', marginTop: 3 }}>
                  {'\ud83d\udca1'} {current.explanation}
                </p>
              )}
            </div>
          )}

          {/* Hint panel level 2: full answer */}
          {hintLevel === 2 && !showResult && (
            <div style={{
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10,
              padding: '10px 14px',
              marginTop: 8,
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {'\ud83d\udd13'} Respuesta {'\u2014'} escr{'\u00ed'}bela t{'\u00fa'} mismo
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--el-text)' }}>
                {current.correct}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {showResult && (
        <div className={`exercise-feedback ${isCurrentCorrect() ? 'correct' : 'wrong'} animate-fadeIn`}>
          {isCurrentCorrect()
            ? '\u2705 \u00a1Correcto!'
            : `\u274c Correcta: "${current.correct}"`}
          {current.explanation && <p style={{ fontSize: 12, marginTop: 4, opacity: 0.85 }}>{'\ud83d\udca1'} {current.explanation}</p>}
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
          {currentIndex + 1 >= exercises.length ? 'Ver resultado \u2192' : 'Siguiente ejercicio \u2192'}
        </button>
      )}
    </div>
  )
}
