import { useState, useEffect } from 'react'
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
  { display_name: 'Marcela R.',   city: 'Colombia', rating: 5, text: 'Me pareció muy buena porque se va directo a cosas útiles. Siento que sí puede ayudar a alguien a prepararse mejor.' },
  { display_name: 'Raquel C.',    city: 'Colombia', rating: 5, text: 'Me encanta que da respuestas sugeridas. Es como tener más claridad para entrevistas y situaciones laborales.' },
  { display_name: 'Mayra S.',     city: 'Colombia', rating: 5, text: 'Me gustó porque está muy enfocada en el inglés para trabajar. Se siente como una ayuda real para entrevistas y atención al cliente.' },
  { display_name: 'Andrés M.',    city: 'Colombia', rating: 5, text: 'Nunca había podido practicar inglés de trabajo de forma tan real. Me siento mucho más seguro para mi próxima entrevista.' },
  { display_name: 'Laura V.',     city: 'Colombia', rating: 5, text: 'Muy práctica y enfocada. En pocas semanas noté cambios reales en cómo respondo en inglés en el trabajo.' },
]

export default function LandingPageB() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)
  const { settings } = useAppSettings()
  const ctaUrl = settings.hotmart_checkout_url || '#'

  useEffect(() => {
    pixel.viewContent('Landing B — Entrevista')

    // Lazy-load Supabase after first paint — testimonials are not critical for LCP
    import('../../lib/supabase').then(({ supabase }) => {
      supabase
        .from('testimonials')
        .select('display_name, city, rating, text')
        .eq('status', 'approved')
        .eq('show_on_landing', true)
        .order('display_order')
        .limit(4)
        .then(({ data }) => { if (data?.length) setTestimonials(data) })
    })
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
                <span className="lpb-highlight">entrevista</span>{' '}en inglés
                {' '}y{' '}
                <span className="lpb-highlight">consigue trabajo</span>
              </h1>
              <p className="lpb-sub">
                Practica <strong className="lpb-accent">entrevistas</strong> en inglés
                y <strong className="lpb-accent">consigue el trabajo</strong> que quieres.
              </p>

              {/* Pain point callout only — card moves below grid */}
              <div className="lpb-pain-callout">
                <span className="lpb-pain-emoji">😶</span>
                <div>
                  <p className="lpb-pain-text">¿Te quedas en blanco cuando te hablan en inglés?</p>
                  <p className="lpb-pain-cta">Esta app es para ti.</p>
                </div>
              </div>

              {/* What you'll receive — fills empty space */}
              <div className="lpb-receive-card">
                <p className="lpb-receive-title">📦 Al pagar recibes:</p>
                <ul className="lpb-receive-list">
                  <li><span className="lpb-receive-icon">📱</span>Acceso inmediato a la app</li>
                  <li><span className="lpb-receive-icon">🎤</span>Simulaciones de entrevistas reales</li>
                  <li><span className="lpb-receive-icon">📚</span>36 lecciones de inglés laboral</li>
                  <li><span className="lpb-receive-icon">♾️</span>Actualizaciones de por vida</li>
                </ul>
              </div>
            </div>

            {/* App mockup + mini carousel */}
            <div className="lpb-hero-mockup">
              <div className="lpb-phone-frame">
                <div className="lpb-phone-inner lpb-phone-slideshow">
                  <img src="/images/hero-simulation.webp"  alt="Simulación entrevista"      className="lpb-slide lpb-slide-1" loading="eager"  fetchpriority="high" />
                  <img src="/images/hero-sim2.webp"        alt="Práctica de vocabulario"    className="lpb-slide lpb-slide-2" loading="lazy" />
                  <img src="/images/hero-sim3.webp"        alt="Feedback de respuestas"     className="lpb-slide lpb-slide-3" loading="lazy" />
                  <img src="/images/hero-sim4.webp"        alt="Lección de inglés laboral"  className="lpb-slide lpb-slide-4" loading="lazy" />
                </div>
              </div>
              <MiniCarousel testimonials={FALLBACK_TESTIMONIALS} />
            </div>
          </div>

          {/* Compact pricing card — FULL WIDTH below the grid */}
          <div className="lpb-hero-price-card">
            <div className="lpb-hpc-badge">🔥 Oferta por lanzamiento</div>
            <div className="lpb-hpc-body">
              <ul className="lpb-hpc-list">
                <li><span className="lpb-check-icon"></span>Simulaciones de entrevistas</li>
                <li><span className="lpb-check-icon"></span>Respuestas sugeridas y feedback</li>
                <li><span className="lpb-check-icon"></span>Mejora tu fluidez y confianza</li>
                <li><span className="lpb-check-icon"></span>Garantía de 7 días</li>
              </ul>
              <div className="lpb-hpc-right">
                <span className="lpb-hpc-label">Pago único</span>
                <span className="lpb-hpc-price">$47.000 <em>COP</em></span>
                <span className="lpb-hpc-access">Acceso de por vida</span>
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lpb-btn-cta lpb-hpc-btn"
                  onClick={() => pixel.initiateCheckout(47000, 'COP')}
                >
                  Quiero acceder →
                </a>
              </div>
            </div>
            <p className="lpb-hpc-secure">
              🔒
              <span className="lpb-pay-badge lpb-pay-visa">VISA</span>
              <span className="lpb-pay-badge lpb-pay-mc"><span>●</span><span>●</span> Mastercard</span>
              <span className="lpb-pay-badge lpb-pay-amex">AMEX</span>
              <span className="lpb-pay-badge lpb-pay-nequi">Nequi</span>
              <span className="lpb-pay-badge lpb-pay-pse">PSE</span>
            </p>
            <p className="lpb-hpc-delivery">📧 Acceso inmediato en tu correo tras el pago</p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="lpb-proof-bar">
        <span className="lpb-proof-avatar">👥</span>
        <span className="lpb-proof-stars">★★★★★</span>
        <span className="lpb-proof-text">Personas como tú ya consiguiendo trabajo.</span>
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
      <section className="lpb-section lpb-testimonials">
        <div className="lpb-container">
          <h2 className="lpb-h2">
            Personas como tú ya están{' '}
            <strong className="lpb-accent">consiguiendo sus objetivos</strong>
          </h2>
          <div className="lpb-testimonials-grid">
            {FALLBACK_TESTIMONIALS.map((t, i) => {
              const initials = t.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
              const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#14b8a6']
              return (
                <div key={i} className="lpb-testimonial-card">
                  <div className="lpb-testimonial-header">
                    <div className="lpb-testimonial-avatar" style={{ background: colors[i % 6] }}>{initials}</div>
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
