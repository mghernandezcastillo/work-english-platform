import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { brand } from '../../lib/brand'
import { useAppSettings } from '../../context/AppSettingsContext'
import { pixel } from '../../lib/pixel'
import './LandingPageB.css'

/* ── Countdown Timer ── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
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
    <div className="lpb-countdown">
      <p className="lpb-countdown-label">⏰ Esta oferta termina en:</p>
      <div className="lpb-countdown-timer">
        <div className="lpb-countdown-unit">
          <span className="lpb-countdown-num">{pad(timeLeft.days)}</span>
          <span className="lpb-countdown-txt">días</span>
        </div>
        <span className="lpb-countdown-sep">:</span>
        <div className="lpb-countdown-unit">
          <span className="lpb-countdown-num">{pad(timeLeft.hours)}</span>
          <span className="lpb-countdown-txt">hrs</span>
        </div>
        <span className="lpb-countdown-sep">:</span>
        <div className="lpb-countdown-unit">
          <span className="lpb-countdown-num">{pad(timeLeft.minutes)}</span>
          <span className="lpb-countdown-txt">min</span>
        </div>
        <span className="lpb-countdown-sep">:</span>
        <div className="lpb-countdown-unit">
          <span className="lpb-countdown-num">{pad(timeLeft.seconds)}</span>
          <span className="lpb-countdown-txt">seg</span>
        </div>
      </div>
    </div>
  )
}

/* ── Sticky CTA Bar ── */
function StickyCtaBar({ ctaUrl }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`lpb-sticky ${visible ? 'visible' : ''}`}>
      <div className="lpb-sticky-inner">
        <div className="lpb-sticky-price">
          <span className="lpb-sticky-old">$150.000</span>
          <span className="lpb-sticky-current">$47.000</span>
        </div>
        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lpb-btn-cta lpb-btn-sm"
          onClick={() => pixel.initiateCheckout(47000, 'COP')}
        >
          Acceder ahora →
        </a>
      </div>
    </div>
  )
}

/* ── Mini Testimonial Carousel (hero sidebar) ── */
function MiniCarousel({ testimonials }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (testimonials.length < 2) return
    const id = setInterval(() => setIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(id)
  }, [testimonials.length])

  if (!testimonials.length) return null
  const t = testimonials[idx]
  const stars = n => '★'.repeat(n)

  return (
    <div className="lpb-mini-carousel">
      <div className="lpb-mini-card" key={idx}>
        <div className="lpb-mini-stars">{stars(t.rating)}</div>
        <p className="lpb-mini-text">"{t.text.length > 90 ? t.text.slice(0, 90) + '…' : t.text}"</p>
        <span className="lpb-mini-name">— {t.display_name}{t.city ? `, ${t.city}` : ''}</span>
      </div>
      <div className="lpb-mini-dots">
        {testimonials.map((_, i) => (
          <span key={i} className={`lpb-mini-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}

/* ── FAQ Item ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lpb-faq-item ${open ? 'open' : ''}`}>
      <button className="lpb-faq-q" onClick={() => setOpen(o => !o)}>
        <span>❓ {q}</span>
        <span className="lpb-faq-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="lpb-faq-a">{a}</p>}
    </div>
  )
}


const FALLBACK_TESTIMONIALS = [
  { display_name: 'Christian S.', city: 'Colombia', rating: 5, text: 'Lo que más me gustó es que no enseña inglés por enseñar. Se nota que está enfocada en ayudarte con entrevistas.' },
  { display_name: 'Marcela R.', city: 'Colombia', rating: 5, text: 'Me pareció muy buena porque se va directo a cosas útiles. Siento que sí puede ayudar a alguien a prepararse mejor.' },
  { display_name: 'Raquel C.', city: 'Colombia', rating: 5, text: 'Me encanta que da respuestas sugeridas. Es como tener más claridad para entrevistas y situaciones laborales.' },
]

export default function LandingPageB() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)
  const { settings } = useAppSettings()
  const ctaUrl = settings.hotmart_checkout_url || '#'

  useEffect(() => {
    pixel.viewContent('Landing B — Entrevista')

    supabase
      .from('testimonials')
      .select('display_name, city, rating, text')
      .eq('status', 'approved')
      .eq('show_on_landing', true)
      .order('display_order')
      .limit(3)
      .then(({ data }) => { if (data?.length) setTestimonials(data) })
  }, [])

  const stars = (n) => '★'.repeat(n)

  return (
    <div className="lpb">
      <StickyCtaBar ctaUrl={ctaUrl} />

      {/* ── HERO ── */}
      <section className="lpb-hero">
        <div className="lpb-container">
          <div className="lpb-hero-grid">
            <div className="lpb-hero-text">
              <span className="lpb-tag">🇺🇸 Inglés para trabajo</span>
              <h1 className="lpb-h1">
                Prepárate para tu{' '}
                <span className="lpb-highlight">entrevista en inglés</span>{' '}
                y consigue trabajo
              </h1>
              <p className="lpb-sub">
                Practica <strong className="lpb-accent">conversaciones reales</strong> con IA
                y responde con seguridad en tu entrevista.
              </p>

              {/* Pain point callout */}
              <div className="lpb-pain-callout">
                <span className="lpb-pain-emoji">😶</span>
                <div>
                  <p className="lpb-pain-text">¿Te quedas en blanco cuando te hablan en inglés?</p>
                  <p className="lpb-pain-cta">Esta app es para ti.</p>
                </div>
              </div>

              {/* Feature checklist */}
              <ul className="lpb-checklist">
                <li><span className="lpb-check">✅</span> Simulaciones de entrevistas reales</li>
                <li><span className="lpb-check">✅</span> Respuestas sugeridas y feedback</li>
                <li><span className="lpb-check">✅</span> Mejora tu fluidez y confianza</li>
                <li><span className="lpb-check">✅</span> Contenido 100% enfocado en trabajo</li>
              </ul>

              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lpb-btn-cta"
                onClick={() => pixel.initiateCheckout(47000, 'COP')}
              >
                Acceder ahora y empezar hoy →
              </a>
              <p className="lpb-trust-line">✓ Pago único · ✓ Acceso de por vida · ✓ Garantía 7 días</p>
            </div>

            {/* App mockup + mini carousel */}
            <div className="lpb-hero-mockup">
              <div className="lpb-phone-frame">
                <img
                  src="/images/hero-simulation.webp"
                  alt="Simulación de entrevista en English for Work"
                  loading="eager"
                  fetchpriority="high"
                />
              </div>
              <MiniCarousel testimonials={testimonials} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="lpb-proof-bar">
        <div className="lpb-proof-inner">
          <div className="lpb-proof-avatar">👥</div>
          <div className="lpb-proof-content">
            <span className="lpb-proof-text">
              Más de 500 personas ya están practicando y consiguiendo trabajo.
            </span>
            <span className="lpb-proof-stars">★★★★★</span>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="lpb-section lpb-features">
        <div className="lpb-container">
          <h2 className="lpb-h2">Así te ayuda <strong>English for Work</strong></h2>
          <div className="lpb-features-grid">
            <div className="lpb-feature-card">
              <div className="lpb-feature-icon">🎤</div>
              <h4>Simula entrevistas reales</h4>
              <p>Practica con situaciones reales de call center y otras áreas.</p>
            </div>
            <div className="lpb-feature-card">
              <div className="lpb-feature-icon">💡</div>
              <h4>Respuestas sugeridas y feedback</h4>
              <p>Mejora tus respuestas con sugerencias inteligentes.</p>
            </div>
            <div className="lpb-feature-card">
              <div className="lpb-feature-icon">📈</div>
              <h4>Mejora tu fluidez y confianza</h4>
              <p>Gana seguridad y habla con naturalidad en inglés.</p>
            </div>
            <div className="lpb-feature-card">
              <div className="lpb-feature-icon">🎯</div>
              <h4>Enfocado en conseguir trabajo</h4>
              <p>Aprende el inglés exacto que te piden en las entrevistas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="lpb-section lpb-testimonials">
          <div className="lpb-container">
            <h2 className="lpb-h2">
              Personas como tú ya están{' '}
              <strong className="lpb-accent">consiguiendo sus objetivos</strong>
            </h2>
            <div className="lpb-testimonials-grid">
              {testimonials.map((t, i) => {
                const initials = t.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                const colors = ['#10b981', '#6366f1', '#f59e0b']
                return (
                  <div key={i} className="lpb-testimonial-card">
                    <div className="lpb-testimonial-header">
                      <div className="lpb-testimonial-avatar" style={{ background: colors[i % 3] }}>
                        {initials}
                      </div>
                      <div>
                        <div className="lpb-testimonial-name">{t.display_name}</div>
                        {t.city && <div className="lpb-testimonial-city">{t.city}</div>}
                        <div className="lpb-testimonial-stars">{stars(t.rating)}</div>
                      </div>
                    </div>
                    <p className="lpb-testimonial-text">"{t.text}"</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── PRICING ── */}
      <section className="lpb-section lpb-pricing">
        <div className="lpb-container">
          <div className="lpb-price-card">
            <div className="lpb-price-badge">🔥 OFERTA POR LANZAMIENTO 🔥</div>

            <CountdownTimer />

            <div className="lpb-price-body">
              <div className="lpb-price-features">
                <ul>
                  <li>✓ Acceso ilimitado a todas las lecciones</li>
                  <li>✓ Simulaciones de entrevistas reales</li>
                  <li>✓ Respuestas sugeridas y feedback</li>
                  <li>✓ Nuevas situaciones cada semana</li>
                  <li>✓ Acceso desde cualquier dispositivo</li>
                  <li>✓ Garantía de 7 días</li>
                </ul>
              </div>
              <div className="lpb-price-amount">
                <span className="lpb-price-label">Pago único</span>
                <div className="lpb-price-original">$150.000</div>
                <div className="lpb-price-current">$47.000 <span className="lpb-price-currency">COP</span></div>
                <span className="lpb-price-access">Acceso de por vida</span>
              </div>
            </div>

            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="lpb-btn-cta lpb-btn-full"
              onClick={() => pixel.initiateCheckout(47000, 'COP')}
            >
              Quiero acceder ahora →
            </a>

            <div className="lpb-payment-secure">
              <span>🔒 Pago 100% seguro</span>
            </div>

            <div className="lpb-payment-logos">
              <img src="/paymentmethods/visa-mastercard.png" alt="Visa Mastercard" width="80" height="24" loading="lazy" />
              <img src="/paymentmethods/nequi.svg" alt="Nequi" width="64" height="24" loading="lazy" />
              <img src="/paymentmethods/pse.webp" alt="PSE" width="48" height="24" loading="lazy" />
            </div>

            <p className="lpb-guarantee-text">
              Prueba la app 7 días. Si no te encanta, te devolvemos tu dinero.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lpb-section lpb-faq">
        <div className="lpb-container">
          <h2 className="lpb-h2">Preguntas <strong>frecuentes</strong></h2>
          <FAQItem q="¿Cómo funciona la app?" a="Eliges tu ruta (entrevistas, call center, o trabajo general), completas lecciones de 15 minutos con frases reales, audio nativo, y simulaciones interactivas. Todo desde tu celular." />
          <FAQItem q="¿En qué me ayudará para conseguir trabajo?" a="Te preparamos con las frases y situaciones exactas que enfrentarás en entrevistas en inglés y en tu trabajo diario. No gramática teórica — inglés real." />
          <FAQItem q="¿Cuánto tiempo tengo acceso?" a="De por vida. Pagas una sola vez y accedes al contenido para siempre, incluyendo futuras actualizaciones." />
          <FAQItem q="¿Y si no me gusta?" a="Tienes 7 días de garantía. Si no estás satisfecho, te devolvemos el dinero completo. Sin preguntas." />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lpb-section lpb-final">
        <div className="lpb-container" style={{ textAlign: 'center' }}>
          <h2 className="lpb-h2">Tu próximo trabajo pide inglés.</h2>
          <p className="lpb-sub">No dejes que el inglés sea lo que te detenga.</p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lpb-btn-cta"
            onClick={() => pixel.initiateCheckout(47000, 'COP')}
          >
            Empezar ahora →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lpb-footer">
        <div className="lpb-container" style={{ textAlign: 'center' }}>
          <p>🇺🇸 {brand.name} · {brand.legal.country}</p>
          <div className="lpb-footer-links">
            <a href="/terminos">Términos y Condiciones</a>
            <a href="/politica-privacidad">Política de Privacidad</a>
            <a href="/login">Ingresar</a>
          </div>
          <p className="lpb-footer-copy">
            © {new Date().getFullYear()} {brand.name} · Todos los derechos reservados · Colombia
          </p>
        </div>
      </footer>

      {/* ── WhatsApp FAB ── */}
      {brand.contact?.whatsapp && !brand.contact.whatsapp.includes('XXXX') && (
        <a
          href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, tengo una pregunta sobre English for Work')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="lpb-wa-fab"
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
