import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { Card, CardBody } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import AudioPlayer from '../../components/learning/AudioPlayer'
import ClickablePhrase from '../../components/learning/ClickablePhrase'
import { PronunciationButton } from '../../components/common/PronunciationButton'
import './SimulationView.css'

export default function SimulationView() {
  const { simId } = useParams()
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [simulation, setSimulation] = useState(null)
  const [currentTurn, setCurrentTurn] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [responses, setResponses] = useState([])
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showTyping, setShowTyping] = useState(false)
  const [showPronunOffer, setShowPronunOffer] = useState(false)  // offer to practice pronunciation
  const [showPronunPanel, setShowPronunPanel] = useState(false)  // pronunciation panel active

  useEffect(() => { loadSimulation() }, [simId])

  async function loadSimulation() {
    try {
      // Try to find simulation by ID or route_id
      const { data } = await supabase
        .from('simulations')
        .select('*')
        .or(`id.eq.${simId},route_id.eq.${simId}`)
        .order('sort_order')
        .limit(1)
        .single()
      setSimulation(data)
    } catch {
      // If single fails, try to get first simulation for the route
      const { data } = await supabase
        .from('simulations')
        .select('*')
        .eq('route_id', simId)
        .order('sort_order')
        .limit(1)
      if (data?.length) setSimulation(data[0])
    } finally {
      setLoading(false)
    }
  }

  // Shuffle options so correct answer isn't always in same position
  function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const shuffledOptions = useMemo(() => {
    const turns = simulation?.content?.turns || []
    const t = turns[currentTurn]
    return t?.options ? shuffle(t.options) : []
  }, [currentTurn, simulation])

  function handleChoice(option) {
    setSelectedOption(option)
    setShowFeedback(true)
    setResponses(prev => [...prev, { turn: currentTurn, choice: option }])
    // If correct, offer pronunciation practice
    const t = turns[currentTurn]
    if (t && option === t.correct) {
      setShowPronunOffer(true)
    }
  }

  function nextTurn() {
    const turns = simulation?.content?.turns || []
    if (currentTurn + 1 >= turns.length) {
      setFinished(true)
      saveProgress(turns)
    } else {
      setShowTyping(true)
      setTimeout(() => {
        setCurrentTurn(t => t + 1)
        setSelectedOption(null)
        setShowFeedback(false)
        setShowTyping(false)
        setShowPronunOffer(false)
        setShowPronunPanel(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 1200)
    }
  }

  async function saveProgress(turns) {
    if (!profile?.id || !simulation?.id) return
    const correct = [...responses, { turn: currentTurn, choice: selectedOption }]
      .filter((r, i) => turns[i] && r.choice === turns[i].correct).length
    try {
      await supabase.from('user_simulation_progress').upsert({
        user_id: profile.id,
        simulation_id: simulation.id,
        completed: true,
        score: correct,
        total_turns: turns.length,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,simulation_id' })
    } catch { /* non-critical */ }
  }

  function restart() {
    setCurrentTurn(0)
    setSelectedOption(null)
    setShowFeedback(false)
    setResponses([])
    setFinished(false)
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!simulation) {
    return (
      <div className="text-center" style={{ padding: 40 }}>
        <h3>Simulación no encontrada</h3>
        <Button variant="ghost" onClick={() => navigate('/dashboard')} style={{ marginTop: 'var(--space-4)' }}>
          ← Volver al dashboard
        </Button>
      </div>
    )
  }

  const content = simulation.content || {}
  const turns = content.turns || []
  const turn = turns[currentTurn]

  // Finished view
  if (finished) {
    const correctCount = responses.filter((r, i) => {
      const t = turns[i]
      return t && r.choice === t.correct
    }).length

    return (
      <div className="sim-view animate-fadeIn">
        <div className="text-center" style={{ padding: 'var(--space-8) 0' }}>
          <div style={{ fontSize: 56, marginBottom: 'var(--space-4)' }}>
            {correctCount === turns.length ? '🏆' : correctCount >= turns.length / 2 ? '💪' : '📚'}
          </div>
          <h2>Simulación completada</h2>
          <p className="text-muted" style={{ marginTop: 4 }}>
            {correctCount} de {turns.length} respuestas correctas
          </p>
          <div className="flex gap-3 justify-center" style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="outline" onClick={restart}>🔄 Repetir</Button>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Dashboard →</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sim-view animate-fadeIn">
      <button className="route-back" onClick={() => navigate(-1)}>← Volver</button>

      <h3 className="sim-title">{simulation.title}</h3>
      <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-4)' }}>
        Turno {currentTurn + 1} de {turns.length}
      </p>

      {/* Situation context */}
      {turn?.context && (
        <div className="sim-context">
          <span className="sim-context-label">📍 Situación:</span>
          <p>{turn.context}</p>
        </div>
      )}

      {/* Other person speaks */}
      {showTyping ? (
        <div className="sim-typing-bubble">
          <div className="sim-typing-speaker">👤 {turn?.speaker || 'Otra persona'}</div>
          <div className="sim-typing-dots">
            <span /><span /><span />
          </div>
        </div>
      ) : turn?.prompt && (
        <Card className="sim-prompt-card">
          <CardBody>
            <div className="sim-speaker">👤 {turn.speaker || 'Otra persona'}:</div>
            <p className="sim-prompt-text">"<ClickablePhrase text={turn.prompt} />"</p>
            {turn.promptEs && <p className="text-sm text-muted" style={{ marginTop: 4 }}>({turn.promptEs})</p>}
            {turn.audioUrl && <AudioPlayer src={turn.audioUrl} label="Escuchar" />}
          </CardBody>
        </Card>
      )}

      {/* Your options */}
      <div className="sim-options-header">🗣️ Tu respuesta:</div>
      <div className="sim-options">
        {shuffledOptions.map((opt, i) => {
          let cls = 'sim-option'
          if (showFeedback) {
            if (opt === turn.correct) cls += ' correct'
            else if (opt === selectedOption) cls += ' wrong'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !showFeedback && handleChoice(opt)}
              disabled={showFeedback}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* ── Feedback modal overlay ── */}
      {showFeedback && (
        <div className="sim-modal-overlay">
          <div className="sim-modal animate-fadeIn">
            {/* Result */}
            <div className="sim-modal-emoji">
              {selectedOption === turn.correct ? '✅' : '❌'}
            </div>
            <p className="sim-modal-title">
              {selectedOption === turn.correct
                ? '¡Excelente!'
                : 'Respuesta incorrecta'}
            </p>
            <p className="sim-modal-sub">
              {selectedOption === turn.correct
                ? 'Esa es la mejor respuesta.'
                : <>La mejor respuesta era: <strong>"{turn.correct}"</strong></>}
            </p>
            {turn.explanation && (
              <p className="sim-modal-explanation">💡 {turn.explanation}</p>
            )}

            {/* Pronunciation offer — only on correct */}
            {showPronunOffer && !showPronunPanel && (
              <div className="sim-modal-pronun-offer">
                <p className="sim-modal-pronun-label">🎤 ¿Quieres practicar la pronunciación?</p>
                <div className="sim-modal-pronun-btns">
                  <button className="sim-pronun-yes" onClick={() => { setShowPronunOffer(false); setShowPronunPanel(true) }}>Sí, practicar</button>
                  <button className="sim-pronun-skip" onClick={() => { setShowPronunOffer(false); nextTurn() }}>Saltar →</button>
                </div>
              </div>
            )}

            {/* Pronunciation panel inline in modal */}
            {showPronunPanel && (
              <div className="sim-modal-pronun-panel">
                <PronunciationButton targetText={turn.correct} />
              </div>
            )}

            {/* Next button — only when not showing pronun offer */}
            {!showPronunOffer && (
              <button className="sim-modal-next" onClick={nextTurn}>
                {currentTurn + 1 >= turns.length ? 'Ver resultados' : 'Siguiente turno →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
