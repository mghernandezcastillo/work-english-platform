import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './Vocabulary.css'

export default function Vocabulary() {
  const { user } = useAuth()
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch] = useState('')
  const [exportSuccess, setExportSuccess] = useState(false)

  useEffect(() => {
    if (user) fetchWords()
  }, [user])

  async function fetchWords() {
    setLoading(true)
    const { data } = await supabase
      .from('saved_words')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setWords(data || [])
    setLoading(false)
  }

  async function deleteWord(id) {
    setDeletingId(id)
    await supabase.from('saved_words').delete().eq('id', id)
    setWords(prev => prev.filter(w => w.id !== id))
    setDeletingId(null)
  }

  function openInTranslate(word) {
    const url = `https://translate.google.com/?sl=en&tl=es&text=${encodeURIComponent(word)}&op=translate`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function exportVocabulary() {
    if (words.length === 0) return
    const lines = ['📖 Mi Vocabulario — English for Work', `Total: ${words.length} palabras`, '', '---', '']
    words.forEach(w => {
      lines.push(`${w.word.toUpperCase()}`)
      lines.push(`  → ${w.translation}`)
      lines.push('')
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mi-vocabulario.txt'
    a.click()
    URL.revokeObjectURL(url)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 2500)
  }

  const filtered = words.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.translation.toLowerCase().includes(search.toLowerCase())
  )

  // Group by date
  const grouped = filtered.reduce((acc, word) => {
    const date = new Date(word.created_at).toLocaleDateString('es', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(word)
    return acc
  }, {})

  return (
    <div className="vocab-page">
      {/* Header */}
      <div className="vocab-header">
        <div>
          <h1 className="vocab-title">📖 Mi Vocabulario</h1>
          <p className="vocab-subtitle">
            {words.length === 0
              ? 'Aún no has guardado palabras'
              : `${words.length} palabra${words.length !== 1 ? 's' : ''} guardada${words.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Export button */}
        {words.length > 0 && (
          <button
            className={`btn ${exportSuccess ? 'btn-primary' : 'btn-outline'} btn-sm vocab-export-btn`}
            onClick={exportVocabulary}
            title="Exportar vocabulario como archivo de texto"
          >
            {exportSuccess ? '✅ Exportado' : '⬇️ Exportar'}
          </button>
        )}
      </div>

      {/* Stats bar */}
      {words.length > 0 && (
        <div className="vocab-stats">
          <div className="vocab-stat">
            <span className="vocab-stat-num">{words.length}</span>
            <span className="vocab-stat-label">Total guardadas</span>
          </div>
          <div className="vocab-stat">
            <span className="vocab-stat-num">
              {new Set(words.map(w => new Date(w.created_at).toDateString())).size}
            </span>
            <span className="vocab-stat-label">Días de práctica</span>
          </div>
          {search && (
            <div className="vocab-stat">
              <span className="vocab-stat-num">{filtered.length}</span>
              <span className="vocab-stat-label">Resultados</span>
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {words.length > 0 && (
        <div className="vocab-search">
          <input
            className="input"
            placeholder="🔍 Buscar palabra..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="vocab-empty">
          <div className="vocab-empty-icon">⏳</div>
          <p>Cargando...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && words.length === 0 && (
        <div className="vocab-empty">
          <div className="vocab-empty-icon">📚</div>
          <h3>Aún no hay palabras guardadas</h3>
          <p className="text-muted text-sm">
            Cuando estés en una lección, toca cualquier palabra y presiona
            <strong> 📌 Guardar</strong> para agregarla aquí.
          </p>
        </div>
      )}

      {/* No results from search */}
      {!loading && words.length > 0 && filtered.length === 0 && (
        <div className="vocab-empty">
          <div className="vocab-empty-icon">🔍</div>
          <p className="text-muted">No hay palabras que coincidan con "{search}"</p>
        </div>
      )}

      {/* Word list grouped by date */}
      {!loading && Object.entries(grouped).map(([date, dateWords]) => (
        <div key={date} className="vocab-group">
          <div className="vocab-group-date">{date}</div>
          <div className="vocab-grid">
            {dateWords.map(word => (
              <div key={word.id} className="vocab-card">
                <div className="vocab-card-content">
                  <span className="vocab-word">{word.word}</span>
                  <span className="vocab-translation">{word.translation}</span>
                </div>
                <div className="vocab-card-actions">
                  <button
                    className="vocab-translate-btn"
                    onClick={() => openInTranslate(word.word)}
                    title="Buscar en Google Translate"
                    aria-label={`Buscar significado de ${word.word}`}
                  >
                    🔎
                  </button>
                  <button
                    className="vocab-delete"
                    onClick={() => deleteWord(word.id)}
                    disabled={deletingId === word.id}
                    title="Eliminar palabra"
                    aria-label={`Eliminar ${word.word}`}
                  >
                    {deletingId === word.id ? '...' : '×'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tip */}
      {!loading && words.length > 0 && (
        <div className="vocab-tip">
          <span>💡</span>
          <p className="text-xs text-muted">
            Repasa estas palabras con regularidad para memorizarlas mejor.
            Usa 🔎 para ver el significado completo en Google Translate.
          </p>
        </div>
      )}
    </div>
  )
}
