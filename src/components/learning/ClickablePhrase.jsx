import { useState, useRef, useEffect } from 'react'
import { lookup } from '../../lib/dictionary'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import './ClickablePhrase.css'

/**
 * Renders a phrase where each word is clickable and shows a translation tooltip.
 */
export default function ClickablePhrase({ text, className = '' }) {
  const { user } = useAuth()
  const [activeWord, setActiveWord] = useState(null) // { word, translation, x, y }
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const tooltipRef = useRef(null)

  // Close tooltip on outside click
  useEffect(() => {
    function handleClick(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setActiveWord(null)
        setSaved(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [])

  function handleWordClick(e, word) {
    e.stopPropagation()
    const translation = lookup(word)
    if (!translation) return // ignore words not in dictionary

    const rect = e.target.getBoundingClientRect()
    setActiveWord({ word, translation, wordRect: rect })
    setSaved(false)
  }

  async function handleSave() {
    if (!user || !activeWord || saving) return
    setSaving(true)
    try {
      await supabase.from('saved_words').upsert({
        user_id: user.id,
        word: activeWord.word.toLowerCase(),
        translation: activeWord.translation,
      }, { onConflict: 'user_id,word' })
      setSaved(true)
    } catch (err) {
      console.error('Error saving word:', err)
    } finally {
      setSaving(false)
    }
  }

  // Split text into words, preserving spaces and punctuation attached to words
  const tokens = text.split(/(\s+)/)

  return (
    <span className={`clickable-phrase ${className}`}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
        const cleanWord = token.replace(/[.,;:!?'"()\[\]{}]/g, '')
        const hasTranslation = lookup(cleanWord) !== null
        return (
          <span
            key={i}
            className={`word-token ${hasTranslation ? 'word-has-def' : ''}`}
            onClick={hasTranslation ? (e) => handleWordClick(e, cleanWord) : undefined}
            title={hasTranslation ? 'Toca para ver significado' : undefined}
          >
            {token}
          </span>
        )
      })}

      {/* Tooltip */}
      {activeWord && (
        <span
          ref={tooltipRef}
          className="word-tooltip animate-fadeIn"
          style={{ '--anchor': 'center' }}
        >
          <span className="word-tooltip-arrow" />
          <span className="word-tooltip-word">{activeWord.word}</span>
          <span className="word-tooltip-translation">{activeWord.translation}</span>
          {user && (
            <button
              className={`word-tooltip-save ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={saved || saving}
            >
              {saved ? '✅ Guardado' : saving ? '...' : '📌 Guardar'}
            </button>
          )}
        </span>
      )}
    </span>
  )
}
