import { useState, useRef } from 'react'
import './SpeakButton.css'

const SPEEDS = [
  { value: 0.5, emoji: '🐢', label: 'Muy lento' },
  { value: 0.7, emoji: '🐢', label: 'Lento' },
  { value: 1.0, emoji: '🎯', label: 'Normal' },
  { value: 1.3, emoji: '🐇', label: 'Rápido' },
]

export default function SpeakButton({ text, lang = 'en-US', label }) {
  const [speaking, setSpeaking] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(2) // Normal
  const utterRef = useRef(null)

  const currentSpeed = SPEEDS[speedIdx]

  function speak() {
    if (!window.speechSynthesis || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    if (speaking) {
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = currentSpeed.value
    utterance.pitch = 1

    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find(v => v.lang.startsWith('en-US'))
    
    if (englishVoice) utterance.voice = englishVoice

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    utterRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  function cycleSpeed() {
    setSpeedIdx(idx => (idx + 1) % SPEEDS.length)
  }

  return (
    <div className="speak-controls">
      <button 
        className={`speak-btn ${speaking ? 'speaking' : ''}`}
        onClick={speak}
        title={speaking ? 'Detener' : 'Escuchar pronunciación'}
      >
        <span className="speak-icon">{speaking ? '⏹' : '🔊'}</span>
        <span className="speak-label">{label || (speaking ? 'Reproduciendo...' : 'Escuchar')}</span>
      </button>
      <button 
        className={`speed-btn ${currentSpeed.value < 1 ? 'slow' : currentSpeed.value > 1 ? 'fast' : ''}`}
        onClick={cycleSpeed}
        title={`Velocidad: ${currentSpeed.label} — clic para cambiar`}
      >
        <span style={{ fontSize: 14 }}>{currentSpeed.emoji}</span>
        <span>{currentSpeed.value}x</span>
      </button>
    </div>
  )
}
