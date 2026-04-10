import { useEffect, useState, useMemo, useRef } from 'react'
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

// Character avatar images (3D rendered, stored in Supabase)
const AVATAR_BASE = 'https://mtobgwfknefjlpoxznqx.supabase.co/storage/v1/object/public/images/avatars'
const AVATAR_IMAGES = {
  patricia: `${AVATAR_BASE}/patricia.png`,
  emily: `${AVATAR_BASE}/emily.png`,
  david: `${AVATAR_BASE}/david.png`,
  ana: `${AVATAR_BASE}/ana.png`,
  karen: `${AVATAR_BASE}/karen.png`,
  tom: `${AVATAR_BASE}/tom.png`,
  laura: `${AVATAR_BASE}/laura.png`,
  lisa: `${AVATAR_BASE}/lisa.png`,
  diana: `${AVATAR_BASE}/diana.png`,
  rachel: `${AVATAR_BASE}/rachel.png`,
}

function parseSpeaker(speaker) {
  if (!speaker) return { name: 'Otra persona', role: '', avatarUrl: null }
  const match = speaker.match(/^(.+?)\s*\((.+?)\)$/)
  if (match) {
    const role = match[1].trim()
    const name = match[2].trim()
    const key = name.toLowerCase()
    return { name, role: role.toUpperCase(), avatarUrl: AVATAR_IMAGES[key] || null }
  }
  return { name: speaker, role: '', avatarUrl: null }
}

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
  const [showPronunOffer, setShowPronunOffer] = useState(false)
  const [showPronunPanel, setShowPronunPanel] = useState(false)
  const [hasRetried, setHasRetried] = useState(false)  // block retry after first retry
  const audioRef = useRef(null)

  // Auto-play turn audio when turn changes or simulation first loads
  useEffect(() => {
    const turns = simulation?.content?.turns || []
    const url = turns[currentTurn]?.audioUrl
    if (!url || !audioRef.current) return
    const t = setTimeout(() => {
      audioRef.current.src = url
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }, 400)
    return () => clearTimeout(t)
  }, [currentTurn, simulation])

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
    const t = turns[currentTurn]
    if (t && option === t.correct) {
      setShowPronunOffer(true)
    }
  }

  function handleRetry() {
    // Remove the last (wrong) response so scoring stays clean
    setResponses(prev => prev.slice(0, -1))
    setSelectedOption(null)
    setShowFeedback(false)
    setHasRetried(true)   // only one retry allowed
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
        setHasRetried(false)
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
      {/* Hidden audio for auto-play */}
      <audio ref={audioRef} style={{ display: 'none' }} />
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
        (() => { const sp = parseSpeaker(turn?.speaker); return (
        <div className="sim-typing-bubble">
          <div className="sim-avatar-row">
            <div className="sim-avatar-circle">{sp.avatarUrl ? <img src={sp.avatarUrl} alt={sp.name} className="sim-avatar-img" /> : <span>🗣️</span>}</div>
            <div><div className="sim-avatar-name">{sp.name}</div>{sp.role && <div className="sim-avatar-role">{sp.role}</div>}</div>
          </div>
          <div className="sim-typing-dots">
            <span /><span /><span />
          </div>
        </div>
        ) })()
      ) : turn?.prompt && (
        (() => { const sp = parseSpeaker(turn.speaker); return (
        <Card className="sim-prompt-card">
          <CardBody>
            <div className="sim-avatar-row">
              <div className="sim-avatar-circle">{sp.avatarUrl ? <img src={sp.avatarUrl} alt={sp.name} className="sim-avatar-img" /> : <span>🗣️</span>}</div>
              <div>
                <div className="sim-avatar-name">{sp.name}</div>
                {sp.role && <div className="sim-avatar-role">{sp.role}</div>}
              </div>
              <div className="sim-avatar-online" />
            </div>
            <p className="sim-prompt-text">"<ClickablePhrase text={turn.prompt} />"</p>
            {turn.promptEs && <p className="text-sm text-muted" style={{ marginTop: 4 }}>({turn.promptEs})</p>}
            {turn.audioUrl && <AudioPlayer src={turn.audioUrl} label="Escuchar" />}
          </CardBody>
        </Card>
        ) })()
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

            {/* Wrong answer: retry + continue */}
            {selectedOption !== turn.correct && !hasRetried && (
              <div className="sim-modal-pronun-btns" style={{ marginTop: 4 }}>
                <button className="sim-pronun-yes" onClick={handleRetry}>🔄 Intentar de nuevo</button>
                <button className="sim-pronun-skip" onClick={nextTurn}>Continuar →</button>
              </div>
            )}

            {/* Wrong answer after retry: only continue */}
            {selectedOption !== turn.correct && hasRetried && (
              <button className="sim-modal-next" onClick={nextTurn}>Continuar →</button>
            )}

            {/* Next button — only when not showing pronun offer (correct path) */}
            {selectedOption === turn.correct && !showPronunOffer && (
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
