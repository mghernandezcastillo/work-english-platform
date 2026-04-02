import { useState, useRef, useEffect } from 'react'
import { lookup, lookupCompound } from '../../lib/dictionary'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import './ClickablePhrase.css'

/**
 * Tokenize text into compound-aware tokens.
 * First finds compound phrases (like "customer service"), then individual words.
 */
function tokenize(text) {
  // Split into raw tokens preserving whitespace
  const rawTokens = text.split(/(\s+)/)
  const wordTokens = [] // only the non-whitespace tokens (for compound scanning)
  const allTokens = []  // full token list with whitespace

  rawTokens.forEach((token, idx) => {
    if (/^\s+$/.test(token)) {
      allTokens.push({ type: 'space', text: token })
    } else {
      allTokens.push({ type: 'word', text: token, wordIndex: wordTokens.length })
      wordTokens.push(token)
    }
  })

  // Now scan wordTokens for compound matches
  const compoundRanges = [] // [{ startWordIdx, endWordIdx, phrase, translation }]
  let i = 0
  while (i < wordTokens.length) {
    const match = lookupCompound(wordTokens.map(w => w.replace(/[.,;:!?'"()\[\]{}—–-]/g, '').replace(/'/g, '')), i)
    if (match) {
      compoundRanges.push({
        startWordIdx: i,
        endWordIdx: i + match.wordCount - 1,
        phrase: match.phrase,
        translation: match.translation,
      })
      i += match.wordCount
    } else {
      i++
    }
  }

  // Build the final render tokens
  const renderTokens = []
  const usedWordIndices = new Set()

  // Mark all indices used by compounds
  compoundRanges.forEach(range => {
    for (let j = range.startWordIdx; j <= range.endWordIdx; j++) {
      usedWordIndices.add(j)
    }
  })

  let currentCompoundIdx = 0

  allTokens.forEach(token => {
    if (token.type === 'space') {
      // Check if this space is between words in the same compound
      // If so, include it in the compound group
      const prevWord = renderTokens.length > 0 ? renderTokens[renderTokens.length - 1] : null
      if (prevWord && prevWord._inCompound) {
        // Append space to current compound
        prevWord.text += token.text
        prevWord._needsMoreWords = true
        return
      }
      renderTokens.push({ type: 'space', text: token.text })
      return
    }

    const wordIdx = token.wordIndex
    const compound = compoundRanges.find(r => wordIdx >= r.startWordIdx && wordIdx <= r.endWordIdx)

    if (compound) {
      // Part of a compound
      const existingCompound = renderTokens.find(t => t.type === 'compound' && t._compoundId === compound.startWordIdx)
      if (existingCompound) {
        existingCompound.text += token.text
        existingCompound._needsMoreWords = wordIdx < compound.endWordIdx
      } else {
        renderTokens.push({
          type: 'compound',
          text: token.text,
          phrase: compound.phrase,
          translation: compound.translation,
          _compoundId: compound.startWordIdx,
          _inCompound: true,
          _needsMoreWords: wordIdx < compound.endWordIdx,
        })
      }
    } else {
      // Individual word
      const cleanWord = token.text.replace(/[.,;:!?'"()\[\]{}—–-]/g, '').replace(/'/g, '')
      const translation = lookup(cleanWord)
      renderTokens.push({
        type: 'word',
        text: token.text,
        cleanWord,
        translation,
        hasDef: translation !== null,
      })
    }
  })

  return renderTokens
}

/**
 * Renders a phrase where each word is clickable and shows a translation tooltip.
 * Supports compound words (e.g. "customer service" → one tooltip).
 * ALL words are clickable — words without translations show a "save for later" option.
 */
export default function ClickablePhrase({ text, className = '' }) {
  const { user } = useAuth()
  const [activeWord, setActiveWord] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const tooltipRef = useRef(null)
  const containerRef = useRef(null)

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

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        setActiveWord(null)
        setSaved(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function handleTokenClick(e, word, translation, isCompound = false) {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    setActiveWord({
      word,
      translation,
      hasDef: translation !== null,
      isCompound,
      anchorRect: rect,
      containerRect,
    })
    setSaved(false)
  }

  async function handleSave() {
    if (!user || !activeWord || saving) return
    setSaving(true)
    try {
      await supabase.from('saved_words').upsert({
        user_id: user.id,
        word: activeWord.word.toLowerCase(),
        translation: activeWord.translation || '(buscar significado)',
      }, { onConflict: 'user_id,word' })
      setSaved(true)
    } catch (err) {
      console.error('Error saving word:', err)
    } finally {
      setSaving(false)
    }
  }

  const tokens = tokenize(text)

  return (
    <span className={`clickable-phrase ${className}`} ref={containerRef}>
      {tokens.map((token, i) => {
        if (token.type === 'space') {
          return <span key={i}>{token.text}</span>
        }

        if (token.type === 'compound') {
          return (
            <span
              key={i}
              className="word-token word-compound"
              onClick={(e) => handleTokenClick(e, token.phrase, token.translation, true)}
              role="button"
              tabIndex={0}
              aria-label={`${token.phrase}: ${token.translation}`}
            >
              {token.text}
            </span>
          )
        }

        // Individual word — always clickable
        return (
          <span
            key={i}
            className={`word-token ${token.hasDef ? 'word-has-def' : 'word-no-def'}`}
            onClick={(e) => handleTokenClick(e, token.cleanWord, token.translation)}
            role="button"
            tabIndex={0}
            aria-label={token.hasDef ? `${token.cleanWord}: ${token.translation}` : `${token.cleanWord}: toca para más opciones`}
          >
            {token.text}
          </span>
        )
      })}

      {/* Tooltip */}
      {activeWord && (
        <span
          ref={tooltipRef}
          className="word-tooltip animate-fadeIn"
        >
          <span className="word-tooltip-arrow" />
          <span className="word-tooltip-word">
            {activeWord.isCompound ? '🔗 ' : ''}{activeWord.word}
          </span>
          {activeWord.hasDef ? (
            <span className="word-tooltip-translation">{activeWord.translation}</span>
          ) : (
            <span className="word-tooltip-no-def">Significado no disponible</span>
          )}
          <div className="word-tooltip-actions">
            <button
              className="word-tooltip-speak"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(activeWord.word)
                utterance.lang = 'en-US'
                utterance.rate = 0.85
                speechSynthesis.cancel()
                speechSynthesis.speak(utterance)
              }}
              aria-label={`Pronunciar ${activeWord.word}`}
            >
              🔊 Pronunciar
            </button>
            {user && (
              <button
                className={`word-tooltip-save ${saved ? 'saved' : ''}`}
                onClick={handleSave}
                disabled={saved || saving}
                aria-label={saved ? 'Palabra guardada' : 'Guardar palabra'}
              >
                {saved ? '✅ Guardado' : saving ? '...' : '📌 Guardar'}
              </button>
            )}
          </div>
        </span>
      )}
    </span>
  )
}
