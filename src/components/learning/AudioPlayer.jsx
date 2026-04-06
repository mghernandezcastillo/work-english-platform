import { useRef, useState, useEffect } from 'react'
import './AudioPlayer.css'

const SPEEDS = [
  { value: 0.6, emoji: '🐢', label: 'Muy lento' },
  { value: 0.8, emoji: '🐢', label: 'Lento' },
  { value: 1.0, emoji: '🎯', label: 'Normal' },
  { value: 1.25, emoji: '🐇', label: 'Rápido' },
]

export default function AudioPlayer({ src, label, autoPlay = false }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(2) // default = Normal (1.0)

  const currentSpeed = SPEEDS[speedIdx]

  useEffect(() => {
    setPlaying(false)
    setProgress(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    // Auto-play when src changes (if autoPlay is enabled)
    if (autoPlay && src && audioRef.current) {
      const a = audioRef.current
      a.playbackRate = currentSpeed.value
      const tryPlay = () => {
        a.play().then(() => setPlaying(true)).catch(() => {})
      }
      if (a.readyState >= 2) tryPlay()
      else a.addEventListener('canplay', tryPlay, { once: true })
    }
  }, [src])

  // Sync playback rate when speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = currentSpeed.value
    }
  }, [speedIdx, currentSpeed.value])

  function togglePlay() {
    if (!audioRef.current || !src) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.playbackRate = currentSpeed.value
      audioRef.current.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  function cycleSpeed() {
    setSpeedIdx(idx => (idx + 1) % SPEEDS.length)
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  function handleEnded() {
    setPlaying(false)
    setProgress(0)
  }

  function handleSeek(e) {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    audioRef.current.currentTime = pct * duration
    setProgress(pct * duration)
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!src) return null

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      <button
        className={`audio-play-btn ${playing ? 'audio-playing' : ''}`}
        onClick={togglePlay}
        title={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? (
          <span className="audio-wave">
            <span /><span /><span /><span />
          </span>
        ) : '▶'}
      </button>
      <div className="audio-info">
        {label && <span className="audio-label">{label}</span>}
        <div className="audio-progress-track" onClick={handleSeek}>
          <div
            className="audio-progress-fill"
            style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="audio-time">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <button
        className={`audio-speed-btn audio-speed-${currentSpeed.value < 1 ? 'slow' : currentSpeed.value > 1 ? 'fast' : 'normal'}`}
        onClick={cycleSpeed}
        title={`Velocidad: ${currentSpeed.label} (${currentSpeed.value}x) — clic para cambiar`}
      >
        <span className="audio-speed-emoji">{currentSpeed.emoji}</span>
        <span className="audio-speed-label">{currentSpeed.value}x</span>
      </button>
    </div>
  )
}
