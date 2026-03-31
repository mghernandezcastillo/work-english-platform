import { useState } from 'react'
import { Button } from '../../common/Button'
import './Steps.css'

export default function ExerciseStep({ data, onComplete }) {
  const exercises = data?.exercises || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [mistakes, setMistakes] = useState([])
  const [showRecap, setShowRecap] = useState(false)

  const current = exercises[currentIndex]

  function checkAnswer(answer) {
    setSelectedAnswer(answer)
    setShowResult(true)
    const isCorrect = current.type === 'fill'
      ? answer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
      : answer === current.correct

    if (isCorrect) {
      setScore(s => s + 1)
    } else {
      setMistakes(prev => [...prev, {
        question: current.question,
        context: current.context,
        yourAnswer: answer,
        correct: current.correct,
        explanation: current.explanation,
      }])
    }
  }

  function nextExercise() {
    if (currentIndex + 1 >= exercises.length) {
      setFinished(true)
      const finalScore = score + (
        (current.type === 'fill'
          ? selectedAnswer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
          : selectedAnswer === current.correct) ? 1 : 0
      )
      if (onComplete) onComplete(finalScore)
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="step-container animate-fadeIn">
        <div className="step-badge">✏️ Ejercicios</div>
        <p className="text-muted">Ejercicios en desarrollo...</p>
      </div>
    )
  }

  // --- Results Screen ---
  if (finished) {
    const percent = Math.round((score / exercises.length) * 100)
    return (
      <div className="step-container animate-fadeIn text-center">
        <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>
          {percent >= 80 ? '🎉' : percent >= 50 ? '💪' : '📚'}
        </div>
        <h3>¡Ejercicios completados!</h3>
        <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>
          {score} de {exercises.length} correctas ({percent}%)
        </p>

        {/* Score bar */}
        <div style={{
          background: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-full)',
          height: 10,
          marginBottom: 'var(--space-5)',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percent}%`,
            height: '100%',
            background: percent >= 80 ? 'var(--color-primary)' : percent >= 50 ? '#F59E0B' : '#EF4444',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s ease',
          }} />
        </div>

        {/* Errors recap */}
        {mistakes.length > 0 && (
          <div className="exercise-recap">
            <button
              className="exercise-recap-toggle"
              onClick={() => setShowRecap(v => !v)}
            >
              <span>📋 {mistakes.length} error{mistakes.length > 1 ? 'es' : ''} — {showRecap ? 'Ocultar' : 'Ver recap'}</span>
              <span style={{ fontSize: 12 }}>{showRecap ? '▲' : '▼'}</span>
            </button>

            {showRecap && (
              <div className="exercise-recap-list animate-fadeIn">
                {mistakes.map((m, i) => (
                  <div key={i} className="exercise-recap-item">
                    <p className="exercise-recap-question">
                      <strong>Pregunta {i + 1}:</strong> {m.question}
                    </p>
                    {m.context && (
                      <p className="text-xs text-muted">{m.context}</p>
                    )}
                    <div className="exercise-recap-answers">
                      <span className="recap-wrong">
                        ❌ Tu respuesta: <em>"{m.yourAnswer}"</em>
                      </span>
                      <span className="recap-correct">
                        ✅ Correcta: <strong>"{m.correct}"</strong>
                      </span>
                    </div>
                    {m.explanation && (
                      <p className="exercise-recap-explanation">💡 {m.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {percent < 80 && (
          <p className="text-sm" style={{ marginTop: 'var(--space-2)', color: 'var(--color-accent)' }}>
            Repasa las frases e intenta de nuevo para mejorar tu puntaje
          </p>
        )}
        {percent === 100 && (
          <p className="text-sm" style={{ marginTop: 'var(--space-2)', color: 'var(--color-primary)' }}>
            ¡Perfecto! Dominaste todos los ejercicios 🏆
          </p>
        )}
      </div>
    )
  }

  // --- Exercise in progress ---
  const progressPct = Math.round((currentIndex / exercises.length) * 100)

  return (
    <div className="step-container animate-fadeIn">

      {/* Progress bar */}
      <div className="exercise-progress-bar-wrap">
        <div className="exercise-progress-bar-track">
          <div
            className="exercise-progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="exercise-progress-label">{currentIndex + 1} / {exercises.length}</span>
      </div>

      <div className="step-badge">✏️ Ejercicio {currentIndex + 1}/{exercises.length}</div>

      {/* Question */}
      <div className="exercise-question">
        <p className="exercise-prompt">{current.question}</p>
        {current.context && <p className="text-sm text-muted">{current.context}</p>}
      </div>

      {/* Multiple choice */}
      {current.type === 'choose' && (
        <div className="exercise-options">
          {current.options.map((opt, i) => {
            let optClass = 'exercise-option'
            if (showResult) {
              if (opt === current.correct) optClass += ' correct'
              else if (opt === selectedAnswer) optClass += ' wrong'
            } else if (opt === selectedAnswer) {
              optClass += ' selected'
            }
            return (
              <button
                key={i}
                className={optClass}
                onClick={() => !showResult && checkAnswer(opt)}
                disabled={showResult}
              >
                <span className="exercise-option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Fill in blank */}
      {current.type === 'fill' && (
        <div className="exercise-fill">
          <input
            className="input"
            placeholder="Escribe tu respuesta..."
            value={selectedAnswer || ''}
            onChange={e => setSelectedAnswer(e.target.value)}
            disabled={showResult}
            onKeyDown={e => e.key === 'Enter' && !showResult && checkAnswer(selectedAnswer)}
          />
          {!showResult && (
            <Button variant="primary" onClick={() => checkAnswer(selectedAnswer)} style={{ marginTop: 'var(--space-2)' }}>
              Verificar
            </Button>
          )}
          {showResult && (
            <div className={selectedAnswer?.toLowerCase().trim() === current.correct?.toLowerCase().trim() ? 'exercise-feedback correct' : 'exercise-feedback wrong'}>
              {selectedAnswer?.toLowerCase().trim() === current.correct?.toLowerCase().trim()
                ? '✅ ¡Correcto!'
                : `❌ La respuesta correcta es: "${current.correct}"`}
            </div>
          )}
        </div>
      )}

      {/* Feedback for choose type */}
      {showResult && current.type === 'choose' && (
        <div className={selectedAnswer === current.correct ? 'exercise-feedback correct' : 'exercise-feedback wrong'}>
          {selectedAnswer === current.correct
            ? '✅ ¡Correcto!'
            : `❌ La respuesta correcta es: "${current.correct}"`}
          {current.explanation && <p className="text-sm" style={{ marginTop: 4 }}>{current.explanation}</p>}
        </div>
      )}

      {/* Next button */}
      {showResult && (
        <Button variant="primary" full onClick={nextExercise} style={{ marginTop: 'var(--space-4)' }}>
          {currentIndex + 1 >= exercises.length ? 'Ver resultado' : 'Siguiente →'}
        </Button>
      )}
    </div>
  )
}
