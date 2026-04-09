import { useState } from 'react'
import campaigns from '../../../data/ads/ad-campaigns.json'
import './AdCenter.css'

function CopyButton({ text, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
      {copied ? '✓ Copiado' : label}
    </button>
  )
}

function AdCard({ ad }) {
  const [showCards, setShowCards] = useState(false)
  const [showVariants, setShowVariants] = useState(false)
  const [activeVariant, setActiveVariant] = useState(0)
  const isCarousel = ad.formato?.toLowerCase().includes('carousel')
  const hasVariants = ad.imagenesVariantes && ad.imagenesVariantes.length > 0

  // All images: original + variants (for the main preview navigation)
  const allImages = hasVariants
    ? [ad.imagen, ...ad.imagenesVariantes]
    : [ad.imagen]

  const currentImage = allImages[activeVariant] || ad.imagen

  return (
    <div className="ad-card">
      {/* Header */}
      <div className="ad-card-header">
        <span className="ad-format-badge">{ad.formato}</span>
        {hasVariants && (
          <span className="ad-variants-badge">🎨 {allImages.length} variantes</span>
        )}
        <h3 className="ad-card-name">{ad.nombre}</h3>
      </div>

      <div className="ad-card-body">
        {/* Image preview */}
        <div className="ad-image-col">
          <div className="ad-image-wrap">
            <img src={currentImage} alt={ad.nombre} className="ad-preview-img" />
            {allImages.length > 1 && (
              <>
                <button
                  className="variant-nav variant-nav-prev"
                  onClick={() => setActiveVariant(v => (v - 1 + allImages.length) % allImages.length)}
                  aria-label="Imagen anterior"
                >‹</button>
                <button
                  className="variant-nav variant-nav-next"
                  onClick={() => setActiveVariant(v => (v + 1) % allImages.length)}
                  aria-label="Imagen siguiente"
                >›</button>
                <div className="variant-dots">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      className={`variant-dot ${i === activeVariant ? 'active' : ''}`}
                      onClick={() => setActiveVariant(i)}
                      aria-label={`Variante ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <a
            className="download-btn"
            href={currentImage}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            ⬇ Descargar imagen {allImages.length > 1 ? `(${activeVariant + 1}/${allImages.length})` : ''}
          </a>

          {/* Variant thumbnails */}
          {hasVariants && (
            <div style={{ marginTop: 8 }}>
              <button
                className="copy-btn"
                style={{ width: '100%' }}
                onClick={() => setShowVariants(s => !s)}
              >
                {showVariants ? '▲ Ocultar variantes' : `▼ Ver ${allImages.length} variantes de imagen`}
              </button>
              {showVariants && (
                <div className="variant-grid">
                  {allImages.map((src, i) => (
                    <div
                      key={i}
                      className={`variant-thumb ${i === activeVariant ? 'active' : ''}`}
                      onClick={() => setActiveVariant(i)}
                    >
                      <img src={src} alt={`Variante ${i + 1}`} />
                      <p className="variant-thumb-label">
                        {i === 0 ? 'Original' : `Variante ${i}`}
                      </p>
                      <a
                        className="download-btn"
                        href={src}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11 }}
                        onClick={e => e.stopPropagation()}
                      >
                        ⬇ Descargar
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isCarousel && ad.imagenCards && (
            <div style={{ marginTop: 8 }}>
              <button
                className="copy-btn"
                style={{ width: '100%' }}
                onClick={() => setShowCards(s => !s)}
              >
                {showCards ? '▲ Ocultar tarjetas' : '▼ Ver las 4 tarjetas'}
              </button>
              {showCards && (
                <div className="carousel-cards-grid">
                  {ad.imagenCards.map((card, i) => (
                    <div key={i} className="carousel-card-thumb">
                      <img src={card.archivo} alt={`Card ${i + 1}`} />
                      <p className="carousel-card-caption">{card.titular}</p>
                      <a
                        className="download-btn"
                        href={card.archivo}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11 }}
                      >
                        ⬇ Card {i + 1}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Copy fields */}
        <div className="ad-copy-col">
          <div className="copy-field">
            <div className="copy-field-label">
              <span>📝 Texto principal</span>
              <CopyButton text={ad.primaryText} />
            </div>
            <textarea
              className="copy-field-textarea"
              readOnly
              value={ad.primaryText}
              rows={8}
              onClick={e => e.target.select()}
            />
          </div>

          <div className="copy-field-row">
            <div className="copy-field copy-field-half">
              <div className="copy-field-label">
                <span>🏷 Título (Headline)</span>
                <CopyButton text={ad.headline} />
              </div>
              <input
                className="copy-field-input"
                readOnly
                value={ad.headline}
                onClick={e => e.target.select()}
              />
            </div>
            <div className="copy-field copy-field-half">
              <div className="copy-field-label">
                <span>📄 Descripción</span>
                <CopyButton text={ad.descripcion} />
              </div>
              <input
                className="copy-field-input"
                readOnly
                value={ad.descripcion}
                onClick={e => e.target.select()}
              />
            </div>
          </div>

          <div className="copy-field-row">
            <div className="copy-field copy-field-quarter">
              <div className="copy-field-label">
                <span>🖱 Botón CTA</span>
              </div>
              <div className="cta-badge">{ad.ctaBoton}</div>
            </div>
          </div>

          <div className="copy-field">
            <div className="copy-field-label">
              <span>🔗 URL con UTM</span>
              <CopyButton text={ad.url} label="Copiar URL" />
            </div>
            <input
              className="copy-field-input copy-field-url"
              readOnly
              value={ad.url}
              onClick={e => e.target.select()}
            />
          </div>

          <a
            className="ads-manager-btn"
            href="https://adsmanager.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir Ads Manager →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AdCenter() {
  const [openCampaign, setOpenCampaign] = useState(null)

  return (
    <div className="ad-center">
      <div className="ad-center-header">
        <div>
          <h1 className="ad-center-title">📢 Centro de Anuncios</h1>
          <p className="ad-center-subtitle">
            Todo listo para publicar en Facebook Ads Manager. Copia el texto, descarga la imagen y sigue la guía.
          </p>
        </div>
        <a
          href="https://adsmanager.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ads-manager-btn ads-manager-btn-main"
        >
          Abrir Ads Manager
        </a>
      </div>

      {/* How-to strip */}
      <div className="how-to-strip">
        {[
          { n: '1', t: 'Elige un anuncio', d: 'Abre la campaña y elige el anuncio' },
          { n: '2', t: 'Descarga la imagen', d: 'Haz clic en "Descargar imagen"' },
          { n: '3', t: 'Copia el texto', d: 'Usa los botones "Copiar" de cada campo' },
          { n: '4', t: 'Pégalo en Ads Manager', d: 'Crea el anuncio y actívalo' },
        ].map(s => (
          <div key={s.n} className="how-to-step">
            <div className="how-to-num">{s.n}</div>
            <div>
              <strong>{s.t}</strong>
              <p>{s.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Beginner guide banner */}
      <div className="guide-banner">
        <div className="guide-banner-left">
          <span className="guide-banner-icon">📖</span>
          <div>
            <strong>¿Primera vez publicando?</strong>
            <p>Lee la guía paso a paso — explica exactamente qué hacer en Ads Manager desde cero.</p>
          </div>
        </div>
        <a
          href="https://github.com/mghernandezcastillo/work-english-platform/blob/main/docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md"
          target="_blank"
          rel="noopener noreferrer"
          className="guide-banner-btn"
        >
          Ver guía →
        </a>
      </div>

      {/* Campaigns */}
      <div className="campaigns-list">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="campaign-section">
            <button
              className={`campaign-header ${openCampaign === campaign.id ? 'open' : ''}`}
              onClick={() => setOpenCampaign(
                openCampaign === campaign.id ? null : campaign.id
              )}
            >
              <div className="campaign-header-left">
                <span className="campaign-name">{campaign.nombre}</span>
                <div className="campaign-meta">
                  <span>🎯 {campaign.objetivo}</span>
                  <span>💰 {campaign.presupuesto}</span>
                  <span>👥 {campaign.audiencia}</span>
                </div>
              </div>
              <div className="campaign-chevron">
                {openCampaign === campaign.id ? '▲' : '▼'}
              </div>
            </button>

            {openCampaign === campaign.id && (
              <div className="campaign-ads">
                {campaign.ads.map(ad => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="ad-center-footer">
        <p>💡 ¿Necesitas un anuncio diferente? Pídelo directamente en el chat con IA — describe el ángulo, el precio y el estilo visual y lo generamos en minutos.</p>
      </div>
    </div>
  )
}
