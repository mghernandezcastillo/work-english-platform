import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { brand } from '../../lib/brand'
import { useAppSettings } from '../../context/AppSettingsContext'
import { pixel } from '../../lib/pixel'
import lp1 from '../../data/landing/lp1.json'
import './LandingPage.css'

const copy = lp1.lp1

/* ─────────────────────────────────────────────
   ROTATING WORD CONFIGURATION
   Swap these words to test different angles.
───────────────────────────────────────────── */
const dynamicWords = [
  'conseguir trabajo',
  'tu próxima entrevista',
  'mejorar tus ingresos',
]

/* ── Rotating Word ── */
function RotatingWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % dynamicWords.length)
        setVisible(true)
      }, 350) // half of CSS transition
    }, 2600)
    return () => clearInterval(cycle)
  }, [])

  return (
    <span
      className={`hero-rotating-word ${visible ? 'hero-word--visible' : 'hero-word--hidden'}`}
    >
      {dynamicWords[index]}
    </span>
  )
}


/* ── Countdown Timer ── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Set deadline: 5 days from first visit (persisted in localStorage)
    let deadline = localStorage.getItem('efw_offer_deadline')
    if (!deadline) {
      const d = new Date()
      d.setDate(d.getDate() + 5)
      deadline = d.toISOString()
      localStorage.setItem('efw_offer_deadline', deadline)
    }

    const target = new Date(deadline).getTime()

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div className="countdown-wrap">
      <p className="countdown-label">⏰ Este precio termina en:</p>
      <div className="countdown-timer">
        <div className="countdown-unit">
          <span className="countdown-number">{pad(timeLeft.days)}</span>
          <span className="countdown-text">días</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(timeLeft.hours)}</span>
          <span className="countdown-text">horas</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(timeLeft.minutes)}</span>
          <span className="countdown-text">min</span>
        </div>
        <span className="countdown-sep">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(timeLeft.seconds)}</span>
          <span className="countdown-text">seg</span>
        </div>
      </div>
    </div>
  )
}

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
        <span className="sticky-cta-label">🔥 Oferta de lanzamiento</span>
        <div className="sticky-price-row">
          <span className="sticky-price-original">{copy.price.original}</span>
          <span className="sticky-price">{copy.price.current}</span>
        </div>
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

  const stars = (n) => '★'.repeat(n)

  return (
    <div className="landing">
      <StickyCtaBar />

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-container">
          <span className="landing-tag">{copy.hero.tag}</span>
          <h1 className="landing-h1">
            El inglés que necesitas para<br />
            <RotatingWord />
          </h1>
          <p className="landing-subheadline">
            Pasa la entrevista, consigue el{' '}
            <strong className="subheadline-highlight">empleo bilingüe</strong>{' '}
            y <strong className="subheadline-highlight">destaca en tu trabajo</strong>{' '}
            — con el inglés exacto que necesitas.
          </p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta-hero"
            onClick={() => pixel.initiateCheckout(copy.price.current, 'USD')}
          >
            Quiero acceder ahora →
          </a>
          <div className="hero-trust-badges">
            <span className="hero-trust-badge"><span className="hero-trust-icon">✓</span> Pago único</span>
            <span className="hero-trust-badge"><span className="hero-trust-icon">∞</span> Acceso de por vida</span>
            <span className="hero-trust-badge"><span className="hero-trust-icon">🛡</span> Garantía 7 días</span>
          </div>

          {/* Social proof strip — visible above fold */}
          <div className="hero-proof">
            <div className="hero-proof-item">
              <strong>36</strong>
              <span>Lecciones</span>
            </div>
            <div className="hero-proof-divider" />
            <div className="hero-proof-item">
              <strong>15 min</strong>
              <span>Por día</span>
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
          </div>

          {/* Hero app mockup */}
          <div className="hero-mockup">
            <div className="hero-mockup-frame">
              <div className="hero-mockup-phone">
                <img
                  src="/images/hero-simulation.webp"
                  alt="Simulación de entrevista en English for Work"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
            </div>
            <p className="hero-mockup-caption">
              👆 Así se ve una simulación real dentro de la app
            </p>
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

      {/* ── APP DEMO ── */}
      <section className="landing-section landing-demo">
        <div className="landing-container text-center">
          <h2 className="landing-h2">Así se ve por dentro 👀</h2>
          <p className="text-muted" style={{ marginBottom: 36 }}>
            Una plataforma diseñada para aprender haciendo, no memorizando.
          </p>
          <div className="demo-screenshots">
            <div className="demo-phone">
              <img src="/images/demo-phrases.webp" alt="Frases clave con audio" loading="lazy" />
              <span className="demo-label">📚 Frases listas para usar</span>
              <span className="demo-sublabel">Escucha pronunciación nativa en cada frase</span>
            </div>
            <div className="demo-phone demo-phone--highlight">
              <img src="/images/demo-simulation.webp" alt="Simulación de entrevista" loading="lazy" />
              <span className="demo-label">🎤 Simulaciones reales</span>
              <span className="demo-sublabel">Practica con reclutadores virtuales</span>
            </div>
            <div className="demo-phone">
              <img src="/images/demo-completion.webp" alt="Lección completada" loading="lazy" />
              <span className="demo-label">🏆 Progreso visible</span>
              <span className="demo-sublabel">Cada lección suma XP y logros</span>
            </div>
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

      {/* ── TESTIMONIALS (moved before price for better flow) ── */}
      {testimonials.length > 0 && (
        <section className="landing-section landing-testimonials">
          <div className="landing-container">
            <h2 className="landing-h2 text-center">Lo que dicen nuestros estudiantes</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => {
                const initials = t.display_name
                  .split(' ')
                  .map(w => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
                const avatarColors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
                return (
                  <div key={i} className="testimonial-card">
                    <div className="testimonial-header">
                      <div
                        className="testimonial-avatar"
                        style={{ background: avatarColors[i % avatarColors.length] }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="testimonial-author-name">{t.display_name}</div>
                        {t.city && <div className="testimonial-city">{t.city}</div>}
                        <div className="testimonial-stars">{stars(t.rating)}</div>
                      </div>
                    </div>
                    <p className="testimonial-text">"{t.text}"</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── MID-PAGE CTA (after testimonials, before price) ── */}
      <section className="landing-section landing-midcta">
        <div className="landing-container text-center">
          <p className="midcta-text">Ellos ya están practicando. <strong>¿Y tú?</strong></p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta-hero"
            onClick={() => pixel.initiateCheckout(47000, 'COP')}
          >
            Quiero acceder ahora →
          </a>
        </div>
      </section>

      {/* ── PRICE + CTA ── */}
      <section className="landing-section landing-price">
        <div className="landing-container">
          <div className="price-card">
            <div className="price-badge">🔥 Precio de lanzamiento</div>
            <CountdownTimer />
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
              Quiero acceder ahora →
            </a>
            <div className="payment-methods">
              <span className="payment-methods-label">Pago seguro con:</span>
              <div className="payment-logos">
                <img src="/paymentmethods/nequi.svg"        alt="Nequi"          width="64" height="24" loading="lazy" />
                <img src="/paymentmethods/pse.webp"         alt="PSE"            width="48" height="24" loading="lazy" />
                <img src="/paymentmethods/visa-mastercard.png" alt="Visa Mastercard" width="80" height="24" loading="lazy" />
              </div>
            </div>
            <div className="trust-list">
              {copy.finalCta.trust.map((t, i) => <span key={i}>{t}</span>)}
            </div>
            {copy.price.terms && (
              <p className="price-terms">{copy.price.terms}</p>
            )}
          </div>
        </div>
      </section>

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
            Quiero acceder ahora →
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
            <a href="/terminos">Términos y Condiciones</a>
            <a href="/politica-privacidad">Política de Privacidad</a>
            <a href="/login">Ingresar</a>
          </div>
          <p className="text-xs" style={{ marginTop: 10, color: '#94A3B8' }}>
            © {new Date().getFullYear()} {brand.name} · Todos los derechos reservados · Colombia
          </p>
        </div>
      </footer>

      {/* ── WhatsApp floating button (landing pre-sale) ── */}
      {brand.contact?.whatsapp && !brand.contact.whatsapp.includes('XXXX') && (
        <a
          href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, tengo una pregunta sobre English for Work')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="landing-wa-fab"
          aria-label="Contactar por WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.106-1.138l-.294-.176-2.87.852.852-2.87-.176-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
          </svg>
        </a>
      )}

    </div>
  )
}

