import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { brand } from '../../lib/brand'
import { useAppSettings } from '../../context/AppSettingsContext'
import { pixel } from '../../lib/pixel'
import lp1 from '../../data/landing/lp1.json'
import './LandingPage.css'

const copy = lp1.lp1

function StickyCtaBar() {
  const [visible, setVisible] = useState(false)
  const { settings } = useAppSettings()
  const ctaUrl = settings.hotmart_checkout_url || '#'

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`sticky-cta-bar ${visible ? 'visible' : ''}`}>
      <div className="sticky-cta-text">
        <span className="font-semibold">English for Work</span>
        <span className="sticky-price">{copy.price.current} USD</span>
      </div>
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-cta"
        onClick={() => pixel.initiateCheckout(copy.price.current, 'USD')}
      >
        Obtener acceso →
      </a>
    </div>
  )
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  )
}

export default function LandingPage() {
  const [testimonials, setTestimonials] = useState([])
  const { settings } = useAppSettings()
  const ctaUrl = settings.hotmart_checkout_url || '#'

  useEffect(() => {
    // Fire ViewContent when landing page loads
    pixel.viewContent('English for Work Landing')

    supabase
      .from('testimonials')
      .select('display_name, city, rating, text')
      .eq('status', 'approved')
      .eq('show_on_landing', true)
      .order('display_order')
      .limit(6)
      .then(({ data }) => setTestimonials(data || []))
  }, [])

  const stars = (n) => '⭐'.repeat(n)

  return (
    <div className="landing">
      <StickyCtaBar />

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-container">
          <span className="landing-tag">{copy.hero.tag}</span>
          <h1 className="landing-h1">{copy.hero.headline}</h1>
          <p className="landing-subheadline">{copy.hero.subheadline}</p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta-hero"
            onClick={() => pixel.initiateCheckout(copy.price.current, 'USD')}
          >
            {copy.hero.cta}
          </a>
          <p className="landing-subtext">{copy.hero.subtext}</p>

          {/* Social proof strip */}
          <div className="hero-proof">
            <div className="hero-proof-item">
              <strong>36</strong>
              <span>Lecciones</span>
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-item">
              <strong>3</strong>
              <span>Rutas</span>
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-item">
              <strong>12</strong>
              <span>Simulaciones</span>
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-item">
              <strong>15 min</strong>
              <span>Por día</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN ── */}
      <section className="landing-section landing-pain">
        <div className="landing-container">
          <h2 className="landing-h2">{copy.pain.title}</h2>
          <div className="pain-grid">
            {copy.pain.items.map((item, i) => (
              <div key={i} className="pain-item">
                <span className="pain-icon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="landing-section landing-solution">
        <div className="landing-container">
          <h2 className="landing-h2">{copy.solution.title}</h2>
          {copy.solution.paragraphs.map((p, i) => (
            <p key={i} className="solution-paragraph">{p}</p>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="landing-section landing-features">
        <div className="landing-container">
          <h2 className="landing-h2 text-center">{copy.whatYouGet.title}</h2>
          <div className="features-grid">
            {copy.whatYouGet.items.map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <div>
                  <h4 className="feature-title">{item.title}</h4>
                  <p className="feature-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-section landing-how">
        <div className="landing-container">
          <h2 className="landing-h2 text-center">{copy.howItWorks.title}</h2>
          <div className="how-steps">
            {copy.howItWorks.steps.map((step, i) => (
              <div key={i} className="how-step">
                <div className="how-step-number">{step.number}</div>
                <h4>{step.title}</h4>
                <p className="text-muted text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICE + CTA ── */}
      <section className="landing-section landing-price">
        <div className="landing-container">
          <div className="price-card">
            <div className="price-badge">🔥 Precio de lanzamiento</div>
            <div className="price-original">{copy.price.original}</div>
            <div className="price-current">{copy.price.current}</div>
            <p className="text-sm text-muted">{copy.price.note}</p>
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta btn-cta-hero"
              onClick={() => pixel.initiateCheckout(47000, 'COP')}
            >
              {copy.hero.cta}
            </a>
            <div className="trust-list">
              {copy.finalCta.trust.map((t, i) => <span key={i}>{t}</span>)}
            </div>
            {copy.price.terms && (
              <p className="price-terms">{copy.price.terms}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="landing-section landing-testimonials">
          <div className="landing-container">
            <h2 className="landing-h2 text-center">Lo que dicen nuestros estudiantes</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-stars">{stars(t.rating)}</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <strong>{t.display_name}</strong>
                    {t.city && <span className="text-muted"> · {t.city}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GUARANTEE ── */}
      <section className="landing-section landing-guarantee">
        <div className="landing-container">
          <div className="guarantee-card">
            <div className="guarantee-icon">🛡️</div>
            <div>
              <h3>{copy.guarantee.title}</h3>
              <p className="text-muted">{copy.guarantee.text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-section landing-faq">
        <div className="landing-container">
          <h2 className="landing-h2 text-center">Preguntas frecuentes</h2>
          <div className="faq-list">
            {copy.faq.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="landing-section landing-final-cta">
        <div className="landing-container text-center">
          <h2 className="landing-h2">{copy.finalCta.headline}</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>{copy.finalCta.subtext}</p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta-hero"
            onClick={() => pixel.initiateCheckout(copy.price.current, 'USD')}
          >
            {copy.finalCta.cta}
          </a>
          <div className="trust-list" style={{ marginTop: 16 }}>
            {copy.finalCta.trust.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-container text-center">
          <p>🇺🇸 {brand.name} · {brand.legal.country}</p>
          <div className="footer-links">
            <a href="/terminos">Términos de Uso</a>
            <a href="/politica-privacidad">Política de Privacidad</a>
            <a href="/login">Ingresar</a>
          </div>
          <p className="text-xs" style={{ marginTop: 8, color: '#94A3B8' }}>
            {brand.legal.company} · {brand.legal.country}
          </p>
        </div>
      </footer>
    </div>
  )
}
