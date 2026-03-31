# MASTER PRD — English for Work

> **Internal codename:** `work-english-platform`
> **Commercial name (test):** English for Work
> **Tagline:** *Aprende el inglés que sí te sirve para trabajar*
> **Document version:** 1.1 — Strategic Foundation (Updated)
> **Date:** 2026-03-28

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Audience Definition](#2-audience-definition)
3. [Core Pain Points](#3-core-pain-points)
4. [Transformation Promise](#4-transformation-promise)
5. [Business Model](#5-business-model)
6. [Monetization Logic](#6-monetization-logic)
7. [Full V1 Feature Scope](#7-full-v1-feature-scope)
8. [Route / Module / Lesson Structure](#8-route--module--lesson-structure)
9. [Pedagogical Framework](#9-pedagogical-framework)
10. [Audio Strategy](#10-audio-strategy)
11. [Sales & Landing Strategy](#11-sales--landing-strategy)
12. [Facebook Ads Strategy](#12-facebook-ads-strategy)
13. [UX/UI Strategy](#13-uxui-strategy)
14. [Branding & Naming Strategy](#14-branding--naming-strategy)
15. [Variable Branding System](#15-variable-branding-system)
16. [Conversion Principles](#16-conversion-principles)
17. [App Structure Overview](#17-app-structure-overview)
18. [Admin Panel & Testimonial System](#18-admin-panel--testimonial-system)
19. [Post-Purchase Email Strategy](#19-post-purchase-email-strategy)
20. [Beta Testing & Pre-Launch Strategy](#20-beta-testing--pre-launch-strategy)
21. [Success Criteria](#21-success-criteria)
22. [Risks & Mitigations](#22-risks--mitigations)
23. [Assumptions](#23-assumptions)
24. [Launch Sequencing](#24-launch-sequencing)
25. [What the Project Operating System Must Contain Next](#25-what-the-project-operating-system-must-contain-next)
26. [Ready to Move into Project Operating System Planning](#26-ready-to-move-into-project-operating-system-planning)

---

## 1. Product Vision

**English for Work** is a premium, one-time-purchase web application that teaches Spanish-speaking adults the specific English they need to get hired, pass interviews, and perform in customer-facing jobs — nothing more, nothing less.

### Why this product exists

Millions of adults in Latin America study English for years yet cannot answer a basic interview question, handle a customer call, or write a professional email. Traditional courses are too slow, too academic, and too expensive. Free apps gamify grammar but never teach the phrases, tone, and confidence people actually need at work.

**English for Work** closes that gap with a focused, practice-heavy system built around real workplace scenarios — sold directly via Facebook Ads at an accessible price point.

### Core thesis

> If we give people *only* the English that improves their employability, wrap it in guided practice that feels like real work, and sell it at a price that feels like an obvious investment — they will buy immediately, finish the content, and refer others.

### Product pillars

| Pillar | Meaning |
|---|---|
| **Practical only** | Every phrase, exercise, and simulation comes from real workplace needs |
| **Complete on day one** | No "coming soon," no empty modules — V1 is a finished product |
| **Premium feel** | Design, audio, and UX signal quality and justify the price |
| **Fast to value** | Users feel progress in the first 10 minutes |
| **Sales-native** | The product is built to convert from the first ad impression |

---

## 2. Audience Definition

### Primary persona: "Carlos"

| Attribute | Detail |
|---|---|
| **Age** | 22–38 |
| **Location** | Colombia, Mexico, Peru, Ecuador, Chile, Argentina |
| **English level** | A2–B1 (understands basics, cannot hold a work conversation) |
| **Employment** | Employed or actively seeking — wants a better-paying role |
| **Income** | Lower-middle to middle class |
| **Device** | Android phone (80%), desktop (15%), iOS (5%) |
| **Social media** | Facebook, Instagram, WhatsApp, TikTok |
| **Buying behavior** | Buys courses/tools via Facebook Ads; values low risk, clear benefit |
| **Motivation** | Tangible career upgrade, not abstract learning |
| **Frustration** | Has tried apps/courses that feel useless for actual work |

### Secondary persona: "Daniela"

Same demographics but specifically targeting **call center / customer service** roles — already employed, wants to move to an English-language queue or bilingual position for higher pay.

### Audience sizing (addressable)

- Colombia alone: ~4M adults actively studying English for work
- México: ~8M
- Broader LATAM digital-ad-reachable: ~20M+
- At 47,000 COP (~$11 USD), price friction is very low

---

## 3. Core Pain Points

| # | Pain Point | Evidence |
|---|---|---|
| 1 | "Estudio inglés pero no puedo usarlo en el trabajo" | Most courses teach grammar, not workplace communication |
| 2 | "No sé qué decir en una entrevista en inglés" | Interview prep is scattered, not structured |
| 3 | "Me da miedo hablar con clientes en inglés" | Lack of guided practice breeds anxiety |
| 4 | "Los cursos son muy caros o muy largos" | Traditional institutes charge $200–$1000+/level |
| 5 | "Las apps gratis no me enseñan nada útil" | Gamified apps focus on vocabulary, not functional communication |
| 6 | "No sé por dónde empezar" | Overwhelm from unstructured content |
| 7 | "Necesito algo que pueda usar ya" | Urgency — they need results for an upcoming interview or job |

---

## 4. Transformation Promise

### Before → After

| Before | After |
|---|---|
| Estudia inglés sin rumbo | Sabe exactamente qué inglés necesita para trabajar |
| No sabe qué decir en una entrevista | Tiene las frases y la práctica para responder con seguridad |
| Le da miedo hablar con clientes | Practica con simulaciones reales y gana confianza |
| Gasta en cursos que no aplican | Invierte una vez en algo práctico e inmediato |

### One-line promise

> **En pocas semanas, vas a tener el inglés que necesitas para conseguir un mejor trabajo — y la confianza para usarlo.**

---

## 5. Business Model

### Model type: Direct-response single purchase

```
Facebook Ad → Sales Landing Page → Hotmart Checkout → Full App Unlock → Email Welcome → App Access
```

### Why single purchase (not subscription)

1. **Lower friction** — one decision, not recurring commitment
2. **Faster Facebook Ads ROI** — revenue on first conversion, no churn risk
3. **Trust signal** — "pay once, keep forever" resonates with price-sensitive LATAM audiences
4. **Simpler operations** — no billing management, no cancellation flows

### Payment processor: Hotmart

- Native to LATAM
- Handles COP, MXN, PEN, CLP, ARS, USD
- Built-in affiliate system (future growth lever)
- Instant checkout pages
- Webhook integration for app unlock

### Revenue flow

```
User pays on Hotmart → Webhook fires → Backend creates/unlocks user → Email sent → User accesses app
```

---

## 6. Monetization Logic

### Pricing strategy

| Test | Price (COP) | Approx USD | Strategic intent |
|---|---|---|---|
| **Primary** | 47,000 | ~$11 | Sweet spot: affordable but not "cheap" |
| Test A | 37,000 | ~$9 | Volume test — maximum conversions |
| Test B | 57,000 | ~$13 | Margin test — higher LTV per user |
| Test C | 67,000 | ~$16 | Ceiling test — premium positioning |

### Unit economics target (at 47,000 COP)

| Metric | Target |
|---|---|
| CPA (cost per acquisition) | ≤ 18,000 COP (~$4.20) |
| Hotmart fee (~10%) | 4,700 COP |
| Net revenue per sale | ~24,300 COP (~$5.70) |
| Break-even daily sales | 10 sales/day to cover ad spend |
| Month 1 target | 300–500 sales |

### Future monetization levers (NOT in V1 — noted for strategy)

- Upsell: advanced routes (e.g., English for Tech, English for Sales)
- Upsell: live practice sessions
- Subscription tier for continuously updated content
- Affiliate program via Hotmart
- Corporate/team licenses

---

## 7. Full V1 Feature Scope

### Quantitative targets

| Element | Count |
|---|---|
| Learning routes | 3 |
| Modules per route | 3 |
| Lessons per module | 4 |
| Total lessons | 36 |
| Simulations | 12 (1 per module) |
| Useful phrases | 220–280 |
| Audio clips | 80–120 (key phrases, simulations, examples) |
| Sales landing pages | 6 (2 at launch, 4 in weeks 2–4) |
| Facebook ad variants | 18–24 |
| Post-purchase emails | 5 (automated sequence) |

### Feature inventory

| Category | Features |
|---|---|
| **Auth** | Email/password registration, Hotmart webhook unlock, login, session persistence |
| **Onboarding** | Welcome screen, route selector, brief orientation |
| **Learning engine** | Lesson viewer, phrase cards, exercises, guided practice, simulations |
| **Progress** | Lesson completion tracking, module progress, route progress, overall dashboard |
| **Audio** | Inline audio player for phrases/examples/simulations |
| **UX** | Mobile-first responsive design, PWA install prompt, offline phrase access |
| **Sales** | 6 landing page variants (2 at launch), Hotmart checkout integration, dynamic testimonials |
| **Email** | 5-email post-purchase sequence (automated) |
| **Testimonials** | In-app capture after module/route completion, admin approval, dynamic display on landing |
| **Admin** | User management, beta access generation, access type control (beta/paid/unlimited), testimonial approval, basic analytics |

### What is NOT in V1

- Speech recognition / pronunciation scoring
- AI conversation partner
- Video content
- Community / social features
- Certificate generation
- Live tutoring
- Native mobile app (PWA only)
- Subscription billing
- Free trial / freemium

---

## 8. Route / Module / Lesson Structure

### Route 1: Inglés para Conseguir Trabajo

> *Get the English you need to land a job*

| Module | Lessons |
|---|---|
| **M1: Tu perfil profesional en inglés** | L1: Cómo describir tu experiencia · L2: Frases para tu resumen profesional · L3: Habilidades y logros en inglés · L4: Práctica guiada — tu elevator pitch |
| **M2: Aplicar a trabajos en inglés** | L1: Vocabulario de ofertas laborales · L2: Cómo escribir un email de aplicación · L3: Frases para cover letters · L4: Práctica guiada — responde a una oferta real |
| **M3: Comunicación profesional básica** | L1: Saludos y presentaciones formales · L2: Email profesional básico · L3: Pedir información y confirmar · L4: Práctica guiada — tu primer día de trabajo |
| **Simulation** | 🎧 Escenario: Aplicas a un trabajo y recibes una respuesta |

### Route 2: Inglés para Entrevistas

> *Prepare to answer with confidence*

| Module | Lessons |
|---|---|
| **M1: Antes de la entrevista** | L1: Frases clave de entrevistas · L2: Cómo responder "Tell me about yourself" · L3: Tus fortalezas y debilidades en inglés · L4: Práctica guiada — prepara tus respuestas |
| **M2: Durante la entrevista** | L1: Preguntas comunes y cómo responderlas · L2: Hablar de experiencia pasada (STAR method) · L3: Preguntas sobre el salario y beneficios · L4: Práctica guiada — simulación de entrevista |
| **M3: Después de la entrevista** | L1: Cómo hacer follow-up en inglés · L2: Thank-you email después de la entrevista · L3: Negociar una oferta en inglés · L4: Práctica guiada — cierra el proceso |
| **Simulation** | 🎧 Escenario: Entrevista completa para un puesto real |

### Route 3: Inglés para Customer Service / Call Center

> *Speak with confidence on every call*

| Module | Lessons |
|---|---|
| **M1: Atención al cliente en inglés** | L1: Frases de apertura y cierre de llamadas · L2: Cómo escuchar y confirmar lo que dice el cliente · L3: Pedir y dar información · L4: Práctica guiada — tu primera llamada |
| **M2: Resolver problemas en inglés** | L1: Vocabulario de problemas comunes · L2: Cómo explicar un proceso o solución · L3: Manejar clientes difíciles con calma · L4: Práctica guiada — resuelve un caso |
| **M3: Comunicación en equipo** | L1: Hablar con tu supervisor en inglés · L2: Reportar un problema o escalar un caso · L3: Reuniones y updates rápidos · L4: Práctica guiada — daily standup en inglés |
| **Simulation** | 🎧 Escenario: Turno completo en un call center |

### Content volume per lesson

| Element | Target |
|---|---|
| Key phrases | 6–8 per lesson |
| Mini-example | 1 per lesson (2–4 exchange turns) |
| Exercise | 1–2 per lesson (fill-blank, match, reorder, choose) |
| Guided practice | 1 scenario per lesson |
| Estimated completion time | 8–15 minutes per lesson |

---

## 9. Pedagogical Framework

### Lesson anatomy (7-step structure)

Every lesson follows this exact sequence:

```
┌─────────────────────────────────────┐
│ 1. OBJETIVO PRÁCTICO                │  ← "Después de esta lección vas a poder..."
│    (Spanish, 1 sentence)            │
├─────────────────────────────────────┤
│ 2. FRASES CLAVE / VOCABULARIO       │  ← English phrases with Spanish translation
│    (6–8 phrases, with audio)        │     + pronunciation guide + context note
├─────────────────────────────────────┤
│ 3. MINI-EJEMPLO REAL                │  ← Short dialogue or email showing phrases
│    (English, with audio)            │     in a realistic work context
├─────────────────────────────────────┤
│ 4. EXPLICACIÓN CORTA                │  ← Spanish explanation of key patterns,
│    (Spanish, 3–5 sentences max)     │     usage tips, common mistakes
├─────────────────────────────────────┤
│ 5. EJERCICIO                        │  ← Interactive: fill-blank, match, reorder,
│    (1–2 exercises)                  │     multiple choice — immediate feedback
├─────────────────────────────────────┤
│ 6. PRÁCTICA GUIADA                  │  ← Guided scenario where user applies
│    (English + Spanish scaffolding)  │     phrases step by step
├─────────────────────────────────────┤
│ 7. REFUERZO / CIERRE               │  ← Quick summary + motivational close
│    (Spanish + key phrases review)   │     + "next step" preview
└─────────────────────────────────────┘
```

### Design principles

| Principle | Implementation |
|---|---|
| **Context first** | Every phrase is taught inside a workplace scenario |
| **Comprehensible input** | English content is slightly above user's level, with Spanish support |
| **Spaced repetition (light)** | Key phrases reappear across lessons and in simulations |
| **Active recall** | Exercises require production, not just recognition |
| **Confidence building** | Guided practice is scaffolded — user never feels lost |
| **Completion momentum** | Short lessons (8–15 min) create habit of finishing |

### Simulation structure

Each module ends with an extended simulation:

- Multi-turn realistic scenario (6–10 exchanges)
- Multi-speaker audio
- User selects responses from options (scaffolded)
- Immediate feedback on each choice
- Summary with all key phrases used
- Duration: 5–8 minutes

---

## 10. Audio Strategy

### Audio types

| Type | Speaker(s) | Use case | Priority |
|---|---|---|---|
| **Phrase audio** | Single speaker | Each key phrase in isolation | HIGH |
| **Mini-example audio** | 1–2 speakers | Short dialogues in lessons | HIGH |
| **Simulation audio** | 2–3 speakers | Full multi-turn scenarios | CRITICAL |
| **Instruction audio** | N/A | No audio for Spanish instructions | — |

### Production specs

| Attribute | Specification |
|---|---|
| **Accent** | Neutral American English |
| **Tone** | Natural, professional, approachable — not robotic |
| **Quality** | Studio-grade or high-quality AI voice (ElevenLabs / similar) |
| **Format** | MP3 (128kbps for mobile optimization) |
| **Naming** | `{route}-{module}-{lesson}-{type}-{index}.mp3` |

### Speaker roles

| Role | Voice profile |
|---|---|
| **Professional male** | Mid-range, calm, clear — used for managers, interviewers |
| **Professional female** | Warm, articulate — used for HR, customer service trainer |
| **Customer voices** | Varied — natural pace, occasional casual tone |

### Volume estimate

| Content | Estimated clips | Estimated total duration |
|---|---|---|
| Key phrases (36 lessons × ~7 phrases) | ~252 clips | ~25 min |
| Mini-examples (36 lessons) | ~36 clips | ~18 min |
| Simulations (12) | ~12 multi-part clips | ~60 min |
| **Total** | **~300 clips** | **~103 min** |

### Production approach

1. Script all audio text during content authoring
2. Generate using premium AI voice service (ElevenLabs recommended)
3. Review and re-generate any unnatural clips
4. Normalize volume levels across all clips
5. Optimize file sizes for mobile delivery

---

## 11. Sales & Landing Strategy

### Pre-design research phase

> [!IMPORTANT]
> Before writing a single line of landing page copy, a structured research phase will be executed.

| Research area | Method |
|---|---|
| **Competitor landing pages** | Analyze sales pages for English courses on Hotmart, Platzi, Open English, Berlitz LATAM |
| **High-converting copy patterns** | Study direct-response formulas that work with Colombian/Mexican audiences |
| **Objection mapping** | Research Facebook groups, forums, Hotmart reviews — what stops people from buying English courses |
| **FAQ mining** | Collect real questions people ask before buying online English products |
| **High-performing landing structures** | Analyze length, element order, visual patterns that produce best CTR from Facebook traffic |
| **Price psychology in COP** | Research how to frame 47,000 COP as an investment, not an expense |

This research will directly inform all landing page copy, FAQ sections, and objection-handling elements.

### 6 landing page variants (2 at launch, 4 in weeks 2–4)

Each landing page targets a different sales angle while linking to the same Hotmart checkout and the same app.

| # | Angle (slug) | Headline direction | Primary audience pain | Launch wave |
|---|---|---|---|---|
| LP1 | `/ingles-para-trabajo` | El inglés que sí te sirve para trabajar | Generic work English — broadest reach | **Launch day** |
| LP3 | `/ingles-call-center` | Domina el inglés para call center | Call center / customer service | **Launch day** |
| LP2 | `/entrevistas-en-ingles` | Prepárate para tu próxima entrevista en inglés | Interview anxiety | Week 2–3 |
| LP4 | `/habla-con-clientes` | Habla con seguridad con clientes en inglés | Client-facing confidence | Week 2–3 |
| LP5 | `/deja-de-estudiar-al-azar` | Deja de perder tiempo con inglés que no te sirve | Frustration with current methods | Week 4+ |
| LP6 | `/ingles-que-usan-en-trabajos` | Practica el inglés que se usa en trabajos reales | Practicality and realism | Week 4+ |

**Why 2 at launch:** Concentrates ad budget on fewer landing pages for faster learning. LP1 (broadest angle) + LP3 (strongest niche) cover the two most promising segments. Remaining 4 are added as data informs which angles resonate.

### Landing page anatomy

Every landing page follows this persuasion sequence:

```
1. HERO — Headline + subheadline + CTA button
2. PAIN — "¿Te identificas con esto?"
3. SOLUTION — "Esto es English for Work"
4. WHAT YOU GET — Route/module breakdown with icons
5. HOW IT WORKS — 3-step process (Compra → Accede → Practica)
6. SOCIAL PROOF — Dynamic testimonials (fed from admin-approved reviews)
7. GUARANTEE — Hotmart 7-day guarantee
8. PRICE REVEAL — Price + value anchoring
9. FAQ — 5–7 common objections (informed by research phase)
10. FINAL CTA — Urgency + button
```

### Dynamic testimonial display

The social proof section on all landing pages is **fed dynamically from the database**:

- Testimonials are collected in-app after users complete a module or route
- Admin approves and selects which ones to display
- Landing pages pull approved testimonials automatically — no code changes needed
- At launch: populated with beta tester reviews (see Section 20)
- Post-launch: progressively replaced with real buyer testimonials

### Key conversion elements

- **Sticky mobile CTA bar** — always visible on scroll
- **Price anchoring** — compare to cost of English classes (~$200+/month)
- **Hotmart guarantee badge** — 7 days, full refund
- **Dynamic testimonials** — real reviews from beta testers and buyers, updated from admin
- **Countdown timer** (optional, for scarcity campaigns)
- **WhatsApp support link** — builds trust

---

## 12. Facebook Ads Strategy

### Campaign structure

```
Campaign: English for Work — Conversions
├── Ad Set 1: Interest — English learners (CO)
│   ├── Ad 1A: Pain-based (video)
│   ├── Ad 1B: Benefit-based (carousel)
│   ├── Ad 1C: Testimonial-style (image)
│   └── Ad 1D: Direct CTA (image)
├── Ad Set 2: Interest — Job seekers (CO)
│   ├── Ad 2A–2D (same format matrix)
├── Ad Set 3: Interest — Call center workers (CO)
│   ├── Ad 3A–3D
├── Ad Set 4: Lookalike — Purchasers (after initial data)
│   ├── Ad 4A–4D
├── Ad Set 5: Retargeting — Landing page visitors
│   ├── Ad 5A–5D
└── Ad Set 6: Retargeting — Cart abandoners
    ├── Ad 6A–6D
```

### 18–24 ad creative variants

| Format | Quantity | Angle types |
|---|---|---|
| **Static image** | 6–8 | Pain headline, benefit headline, price-focused, social proof |
| **Video (15–30s)** | 6–8 | Problem → solution, quick demo, "imagine this" narrative |
| **Carousel** | 4–6 | Route preview, phrase samples, before/after |
| **Story/Reel** | 2–4 | Quick-hit, vertical, phone-native |

### Ad copy formulas

1. **Pain → Solution:** "¿Estudiaste inglés por años y no puedes usarlo en el trabajo? → English for Work te enseña solo lo que necesitas."
2. **Curiosity:** "Las 7 frases en inglés que te preguntan en TODA entrevista de trabajo."
3. **Social proof:** "María consiguió trabajo en un call center bilingüe después de practicar con English for Work."
4. **Direct offer:** "Por menos de lo que cuesta un almuerzo, aprende el inglés que te va a conseguir un mejor trabajo."
5. **Fear of missing out:** "La próxima entrevista en inglés no espera. ¿Estás listo?"
6. **Contrast:** "Duolingo te enseña 'the cat is on the table.' Nosotros te enseñamos 'I'd be happy to help you with that.'"

### Geo-targeting priority

1. 🇨🇴 Colombia (primary — COP pricing, largest initial market)
2. 🇲🇽 México (secondary — test after Colombia traction)
3. 🇵🇪 Peru, 🇪🇨 Ecuador (tertiary)
4. 🇨🇱 Chile, 🇦🇷 Argentina (future)

### Budget allocation

| Phase | Daily budget | Duration | Goal |
|---|---|---|---|
| Testing | $10–20 USD/day | Week 1–2 | Find winning ad + landing combo |
| Scaling | $30–50 USD/day | Week 3–4 | Scale winning combos |
| Optimization | $50–100 USD/day | Month 2+ | Maximize ROAS |

---

## 13. UX/UI Strategy

### Design process (autonomous, AI-driven)

> [!IMPORTANT]
> The operator does NOT need to find design references manually. The following process will be executed by Antigravity autonomously.

#### Phase 1: Visual direction generation
- Generate **4 distinct premium visual directions** as full-page mockups
- Each direction explores a different aesthetic: (a) dark mode professional, (b) light mode clean, (c) bold gradient modern, (d) warm minimal
- All directions share: mobile-first layout, prominent CTAs, Spanish UI

#### Phase 2: Comparative scoring
- Score each direction on: Premium perception (1-10), Trust (1-10), Readability (1-10), CTA visibility (1-10), Mobile usability (1-10), Consistency potential across ad/landing/app (1-10)
- Present top 2 to user with rationale

#### Phase 3: Refinement
- Refine the selected direction with specific typography, color palette, spacing system, component library
- Generate refined mockups for: landing page hero, lesson view, simulation view, progress dashboard

#### Phase 4: Implementation
- Build design system as CSS custom properties
- Implement all components from the refined direction
- Ensure pixel-level consistency across all surfaces

### Design principles

| Principle | How |
|---|---|
| **Mobile-first** | Design for 360px Android screens, then scale up |
| **Premium feel** | High-quality typography, generous whitespace, micro-animations |
| **Trust signals** | Consistent branding, professional tone, guarantee badges |
| **CTA dominance** | Primary action is always the most visible element on screen |
| **Low cognitive load** | One action per screen, clear hierarchy, no clutter |
| **Consistency** | Same design language from ad → landing → app → email |

### Typography

- **Primary font:** Inter or similar clean sans-serif (Google Fonts)
- **Headings:** Bold, high contrast
- **Body:** Regular weight, comfortable reading size (16px base)
- **Phrases in English:** Slightly larger, distinct styling to separate from Spanish

### Color system

- Defined during visual direction phase
- Must include: primary action color, success/progress color, neutral background, text colors, accent for phrases/audio
- Must pass WCAG AA contrast ratios

---

## 14. Branding & Naming Strategy

### Current naming

| Element | Value | Status |
|---|---|---|
| Internal codename | `work-english-platform` | Fixed — never changes |
| Commercial name | English for Work | Testing — may change |
| Tagline | Aprende el inglés que sí te sirve para trabajar | Testing — may change |

### Naming principles

- Commercial name should be **in English** (signals English expertise)
- Tagline should be **in Spanish** (speaks to the audience's language)
- Name must be **short, memorable, and self-explanatory**
- Name must work in both Facebook Ads and app header

### Alternative names to test

| Name | Tagline variant |
|---|---|
| English for Work | Aprende el inglés que sí te sirve para trabajar |
| WorkEnglish | El inglés práctico para tu carrera |
| English Ready | Prepárate para trabajar en inglés |
| ProEnglish | El inglés profesional que necesitas |
| Job English | Tu inglés para conseguir trabajo |

### Name testing method

- Run 2–3 name variants as ad headlines
- Measure CTR differences
- Winner becomes the commercial name
- Internal codename remains unchanged

---

## 15. Variable Branding System

### Concept

The technical architecture must support swapping commercial identity **without** changing:
- Database schema
- API endpoints
- Component logic
- Lesson content
- User accounts

### What is variable

| Element | Stored in | Changed via |
|---|---|---|
| Commercial name | Environment variable / config | Config file update |
| Tagline | Environment variable / config | Config file update |
| Logo | Asset file reference in config | File swap + config update |
| Primary color | CSS custom property | Config file update |
| Landing page copy | Content JSON/CMS | Content file update |
| Ad creatives | External (Facebook Ads Manager) | Manual in Ads Manager |
| Hotmart product name | External (Hotmart dashboard) | Manual in Hotmart |

### Implementation pattern

```
config/brand.json
├── name: "English for Work"
├── tagline: "Aprende el inglés que sí te sirve para trabajar"
├── logo: "/assets/logo-v1.svg"
├── colors:
│   ├── primary: "#XXXX"
│   ├── secondary: "#XXXX"
│   └── accent: "#XXXX"
├── social:
│   ├── og_image: "/assets/og-v1.jpg"
│   └── favicon: "/assets/favicon-v1.ico"
└── landing:
    ├── hero_headline: "..."
    └── hero_subheadline: "..."
```

All components read from this config. Changing the config changes the brand everywhere.

---

## 16. Conversion Principles

### Core conversion rules

1. **One CTA per viewport** — never compete with yourself
2. **Spanish sells, English teaches** — all persuasion in Spanish, all practice in English
3. **Price before objection** — anchor high (cost of courses), reveal low (47,000 COP)
4. **Guarantee removes risk** — Hotmart 7-day guarantee prominently displayed
5. **Speed over features** — landing pages load in < 2 seconds on 3G
6. **Consistency builds trust** — visual language matches from ad → landing → app
7. **Social proof scales** — start with scenario-based proof, switch to real testimonials ASAP
8. **Mobile is the battlefield** — 85%+ traffic will be mobile; optimize relentlessly

### Conversion metrics to track

| Metric | Target |
|---|---|
| Landing page → Checkout click | ≥ 15% |
| Checkout click → Purchase | ≥ 30% |
| Overall landing → Purchase | ≥ 5% |
| Ad → Landing (CTR) | ≥ 2% |
| CPA | ≤ 18,000 COP |

---

## 17. App Structure Overview

### Technical architecture

```
┌─────────────────────────────────────────┐
│              FRONTEND (PWA)             │
│  Next.js / Vite + React                │
│  Mobile-first responsive               │
│  PWA with offline phrase caching        │
├─────────────────────────────────────────┤
│              BACKEND                    │
│  Supabase                              │
│  ├── Auth (email/password)             │
│  ├── Database (PostgreSQL)             │
│  ├── Storage (audio files)             │
│  ├── Edge Functions (webhooks)         │
│  └── Row Level Security                │
├─────────────────────────────────────────┤
│           EXTERNAL SERVICES             │
│  ├── Hotmart (payments + webhooks)     │
│  ├── Facebook Pixel (tracking)         │
│  ├── Email service (welcome emails)    │
│  └── ElevenLabs (audio generation)     │
└─────────────────────────────────────────┘
```

### App pages

| Page | Route | Access |
|---|---|---|
| Landing pages (×6) | `/{slug}` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Welcome / Onboarding | `/welcome` | Authenticated + Paid/Beta/Unlimited |
| Dashboard / Route selector | `/app` | Authenticated + Paid/Beta/Unlimited |
| Route view | `/app/route/{id}` | Authenticated + Paid/Beta/Unlimited |
| Lesson view | `/app/lesson/{id}` | Authenticated + Paid/Beta/Unlimited |
| Simulation view | `/app/simulation/{id}` | Authenticated + Paid/Beta/Unlimited |
| Progress | `/app/progress` | Authenticated + Paid/Beta/Unlimited |
| Profile / Account | `/app/profile` | Authenticated + Paid/Beta/Unlimited |
| **Admin Dashboard** | `/admin` | Admin only |
| **Admin Users** | `/admin/users` | Admin only |
| **Admin Testimonials** | `/admin/testimonials` | Admin only |
| **Admin Beta Access** | `/admin/beta` | Admin only |

### Database schema (conceptual)

```
users
├── id, email, created_at
├── hotmart_transaction_id
├── access_type (enum: 'none', 'beta', 'paid', 'unlimited')
├── is_admin (boolean, default false)
└── onboarding_completed

routes
├── id, title, description, order, icon

modules
├── id, route_id, title, description, order

lessons
├── id, module_id, title, objective, order
├── content (JSON — phrases, examples, exercises, practice)

simulations
├── id, module_id, title, scenario
├── content (JSON — turns, options, feedback)

user_progress
├── user_id, lesson_id, completed_at
├── user_id, simulation_id, completed_at, score

testimonials
├── id, user_id, rating (1–5), text, city
├── trigger_type (enum: 'module_complete', 'route_complete')
├── trigger_reference_id
├── status (enum: 'pending', 'approved', 'rejected')
├── show_on_landing (boolean)
├── display_order (integer)
├── created_at

beta_invites
├── id, token (unique), created_at, expires_at
├── used_by (user_id, nullable)
├── used_at (nullable)

audio_files
├── id, reference_type, reference_id, file_url

email_log
├── id, user_id, email_type, sent_at, status
```

---

## 18. Admin Panel & Testimonial System

### Admin panel

The admin panel is a protected section of the app accessible only to users with `is_admin = true`. It provides operational control without requiring database access.

#### Admin sections

| Section | Functionality |
|---|---|
| **Dashboard** | Total users, paid vs beta vs unlimited, lessons completed today, active users (7d), refund rate |
| **Users** | List all users, filter by access type, search by email, change access type (beta/paid/unlimited), view progress |
| **Beta Access** | Generate unique invite links, view sent invites, see which are used, set expiration |
| **Testimonials** | View all submitted reviews, approve/reject, mark for landing page display, set display order |

#### Access type management

From the admin user list, the operator can change any user's access type with one click:

| Access type | Who gets it | How |
|---|---|---|
| `none` | Registered but hasn't paid | Default on registration |
| `beta` | Pre-launch testers | Admin generates invite link → user registers via link |
| `paid` | Bought via Hotmart | Automatic via webhook |
| `unlimited` | Anyone the admin chooses | Admin sets manually — permanent, free access |

All access types (`beta`, `paid`, `unlimited`) grant identical in-app access. The distinction is for admin tracking and analytics only.

### Testimonial system

#### Collection flow

```
User completes module or route
  → App shows testimonial prompt (rating + text + city)
  → User submits (optional — can skip)
  → Testimonial saved with status 'pending'
  → Admin sees it in Admin > Testimonials
  → Admin approves + marks 'show on landing'
  → Landing page automatically displays it
```

#### Display on landing pages

- Landing pages query approved testimonials from the database
- Admin controls which testimonials appear and in what order
- No code changes or redeployments needed to update testimonials
- Maximum 5 testimonials displayed at a time (configurable)

---

## 19. Post-Purchase Email Strategy

### 5-email automated sequence

Triggered when a user completes purchase (Hotmart webhook) or receives beta access.

| # | Day | Subject line (Spanish) | Goal | Content |
|---|---|---|---|---|
| 1 | 0 | ¡Bienvenido/a! Tu acceso a English for Work está listo | **Activation** | Access link, how to log in, recommended first route |
| 2 | 1 | Empieza por aquí — tu primera lección te espera | **First lesson** | Direct link to recommended first lesson, what to expect |
| 3 | 3 | ¿Ya practicaste esta frase? La vas a necesitar | **Re-engagement** | One powerful phrase from the content + link to continue |
| 4 | 5 | Mira cuánto has avanzado 📊 | **Progress momentum** | Summary of what they've completed, encouragement to continue |
| 5 | 7 | Recuerda: tu acceso es para siempre | **Anti-refund / retention** | Remind permanent access, highlight remaining content, invite feedback |

### Email implementation

- Emails triggered by Supabase Edge Functions + scheduled checks
- Email service: Resend, SendGrid, or similar (simple transactional emails)
- Each email logged in `email_log` table to prevent duplicates
- Unsubscribe link in every email (legal compliance)

### Testimonial capture via email

Email #4 (day 5) includes a secondary CTA:
> "¿Qué te ha parecido English for Work hasta ahora? Tu opinión nos ayuda a mejorar."
> [Dejar mi opinión →]

Links to the in-app testimonial form, providing an additional channel for capturing reviews.

---

## 20. Beta Testing & Pre-Launch Strategy

### Purpose

Before spending money on Facebook Ads, validate the product with real users and collect testimonials for the landing page.

### Beta testing plan

| Item | Detail |
|---|---|
| **Timeline** | 5–7 days before ad launch |
| **Beta testers** | 10–15 people |
| **Sources** | Personal contacts, LinkedIn connections, Facebook groups for English learners |
| **Access method** | Admin generates unique invite links → sent via WhatsApp |
| **Task** | Complete at least 1 full route |
| **Deliverable** | Honest testimonial via in-app form |

### Beta invite flow

```
Admin → Beta Access → "Generate invite link"
  → Unique URL created (e.g., /register?beta=abc123)
  → Admin copies link → sends via WhatsApp
  → Tester clicks → registers → access_type set to 'beta' automatically
  → Tester uses the app → prompted for testimonial after completing a module
```

### What we get from beta testing

1. **3–5 real testimonials** ready for landing page on launch day
2. **Bug reports** before paying users hit them
3. **Content quality validation** — do lessons make sense? Are phrases useful?
4. **Audio quality check** — does audio play correctly on various devices?
5. **Completion time validation** — are lessons 8–15 min as planned?
6. **UX friction points** — where do testers get confused?

### Testimonial readiness for launch day

By launch day, the landing pages will have:
- 3–5 real testimonials from beta testers (with real names and cities)
- Approved and ordered by admin
- Displaying dynamically — no hardcoded content

---

## 21. Success Criteria

### Launch success (first 30 days)

| Metric | Target |
|---|---|
| Total sales | 300–500 |
| Revenue | 14M–23.5M COP ($3,300–$5,500 USD) |
| CPA | ≤ 18,000 COP |
| ROAS | ≥ 2.5x |
| App completion rate (≥1 route) | ≥ 30% |
| Landing page conversion rate | ≥ 5% |
| Refund rate | ≤ 5% |

### Product quality signals

| Signal | Target |
|---|---|
| Time to first lesson completion | ≤ 15 min from first login |
| Session length (average) | ≥ 12 min |
| Return rate (within 7 days) | ≥ 60% |
| Full route completion | ≥ 20% within 30 days |

### Marketing learning goals

| Question | How we answer it |
|---|---|
| Best-performing sales angle? | A/B test 6 landing pages |
| Best-performing ad format? | Test static, video, carousel |
| Optimal price point? | Test 4 price levels |
| Best geographic market? | Start Colombia, expand |

---

## 22. Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Low ad conversion** | HIGH | 6 landing variants + 18–24 ad creatives = rapid testing |
| **High refund rate** | MEDIUM | Premium V1 quality, fast time-to-value, 7-day guarantee |
| **Content feels thin** | MEDIUM | 36 lessons + 12 simulations = substantial; ensure depth per lesson |
| **Audio quality issues** | MEDIUM | Use premium AI voices; review every clip before launch |
| **Hotmart webhook failures** | HIGH | Implement retry logic, manual unlock fallback, error alerting |
| **Mobile performance** | HIGH | Lighthouse audits, lazy loading, audio preloading strategy |
| **Competitor undercut** | LOW | Speed of execution is the moat; a focused product beats generic ones |
| **Payment method friction** | MEDIUM | Hotmart handles local methods (PSE, Nequi, OXXO, etc.) |
| **Scope creep before launch** | HIGH | V1 scope is locked — no new features until post-launch |
| **Single operator bottleneck** | MEDIUM | PRD + operating system documentation enables delegation |

---

## 23. Assumptions

### Validated assumptions

- ✅ Spanish-speaking adults in LATAM will pay for work-focused English content (Hotmart marketplace data)
- ✅ Facebook Ads can profitably acquire language learning customers in Colombia (industry benchmarks)
- ✅ Single-payment digital products sell well in LATAM via Hotmart (platform data)

### Assumptions to validate

- ⬜ 47,000 COP is the optimal price point (test with 4 prices)
- ⬜ "English for Work" is the strongest commercial name (test with ads)
- ⬜ Call center angle will outperform generic work angle (test with landing pages)
- ⬜ Users will complete at least one full route (monitor in-app analytics)
- ⬜ AI-generated audio will meet premium quality bar (review during production)
- ⬜ PWA is sufficient — native app not needed for V1 (monitor user feedback)

### Hard constraints

- Launch must feel complete — no gaps, no placeholders
- All purchase logic goes through Hotmart — no custom payment
- UI in Spanish, practice content in English — no mixed-language UI
- Mobile-first — desktop is secondary
- Single operator can manage post-launch

---

## 24. Launch Sequencing

### Phase 0: Foundation (This step — DONE)
- [x] Master PRD complete
- [ ] Project Operating System planning

### Phase 1: Technical setup (Week 1)
- Supabase project setup
- Auth system with access_type roles
- Database schema (including testimonials, beta_invites, email_log)
- Hotmart webhook integration
- App skeleton (Next.js/Vite + React PWA)
- Admin panel foundation

### Phase 2: Design system (Week 1–2)
- Landing page pre-design research (competitor analysis, copy patterns, objections)
- Generate visual directions
- Score and select
- Build component library
- Implement design system

### Phase 3: Content authoring (Week 2–3)
- Write all 36 lesson scripts
- Write all 12 simulation scripts
- Compile phrase lists (220–280)
- Mark audio requirements per item

### Phase 4: Audio production (Week 3–4)
- Generate all phrase audio
- Generate all example audio
- Generate all simulation audio
- Review, refine, normalize

### Phase 5: App development (Week 2–4, parallel with content)
- Learning engine (lesson viewer, exercises, practice)
- Simulation engine
- Progress tracking
- Onboarding flow
- Dashboard
- Profile/account
- Admin panel (users, beta access, testimonials)
- In-app testimonial capture
- Post-purchase email system (5-email sequence)

### Phase 6: Landing pages & ads (Week 4–5)
- Build 2 landing page variants (LP1 + LP3) with dynamic testimonial section
- Create 8–12 ad creatives for the 2 launch landings
- Set up Facebook Pixel
- Set up Hotmart checkout links
- Configure conversion tracking
- Set up email automation

### Phase 7: Beta testing (Week 5)
- Generate 10–15 beta invite links from admin
- Distribute to testers via WhatsApp
- Monitor usage and collect feedback
- Approve 3–5 testimonials for landing pages
- Fix any bugs or UX issues found

### Phase 8: QA & polish (Week 5–6)
- Full QA pass on mobile (Android Chrome, iOS Safari)
- Performance optimization
- Audio playback testing
- Hotmart purchase flow end-to-end
- Landing page speed optimization
- Email sequence test (end-to-end)
- Copy review
- Verify testimonials display correctly on landing

### Phase 9: Launch (Week 6)
- Activate Facebook Ads (low budget test, 2 landings)
- Monitor conversions
- Monitor app analytics
- Iterate ads/landing based on first 48h data

### Phase 10: Scale & expand (Week 7+)
- Scale winning ad/landing combos
- Build and launch LP2 + LP4 (week 2–3 post-launch)
- Build and launch LP5 + LP6 (week 4+ post-launch)
- Create additional ad creatives for new landings
- A/B test prices
- Replace beta testimonials with real buyer testimonials
- Plan V2 features based on data

---

## 25. What the Project Operating System Must Contain Next

The Project Operating System is the **complete operational document** that transforms this PRD into an executable project. It must include:

### A. Technical specifications
- Exact tech stack decisions (framework, hosting, CI/CD)
- Database schema (full SQL)
- API endpoint definitions
- Auth flow diagrams
- Hotmart webhook spec
- PWA configuration
- File/folder structure

### B. Content production system
- Lesson content template (fillable for each of 36 lessons)
- Simulation content template (fillable for each of 12 simulations)
- Phrase master list structure
- Audio script format
- Content review checklist

### C. Design system specification
- Visual direction generation prompts
- Scoring rubric
- Color palette definition
- Typography scale
- Component inventory
- Page layout templates
- Responsive breakpoints

### D. Marketing production system
- Landing page content templates (for all 6 variants)
- Ad copy templates (for all 18–24 variants)
- Facebook Ads Manager setup guide
- Hotmart product setup guide
- Pixel and conversion tracking setup
- UTM strategy

### E. Operations playbook
- Launch checklist
- Daily monitoring dashboard
- Ad optimization decision tree
- Customer support scripts (WhatsApp)
- Refund handling process

### F. Task breakdown
- Every task needed to reach launch, broken into actionable items
- Dependency map
- Effort estimates
- Critical path identification

---

## 26. Ready to Move into Project Operating System Planning

### Pre-flight checklist

| # | Item | Status |
|---|---|---|
| 1 | Product vision is clear and documented | ✅ |
| 2 | Audience is defined with specificity | ✅ |
| 3 | Pain points are mapped and validated | ✅ |
| 4 | Transformation promise is compelling | ✅ |
| 5 | Business model is defined (single purchase, Hotmart) | ✅ |
| 6 | Pricing strategy with test variants is set | ✅ |
| 7 | V1 scope is locked (3 routes, 36 lessons, 12 sims) | ✅ |
| 8 | Route/module/lesson structure is complete | ✅ |
| 9 | Pedagogical 7-step framework is defined | ✅ |
| 10 | Audio strategy and volume estimates are set | ✅ |
| 11 | 6 landing page variants defined (2 at launch, 4 progressive) | ✅ |
| 12 | Facebook Ads strategy with 18–24 variants is planned | ✅ |
| 13 | UX/UI autonomous design process is defined | ✅ |
| 14 | Variable branding system is conceptualized | ✅ |
| 15 | Conversion principles and targets are set | ✅ |
| 16 | App architecture is outlined | ✅ |
| 17 | Admin panel with user/beta/testimonial management defined | ✅ |
| 18 | Post-purchase email strategy (5 emails) defined | ✅ |
| 19 | Beta testing pre-launch strategy defined | ✅ |
| 20 | Dynamic testimonial system (capture + display) defined | ✅ |
| 21 | Landing page pre-design research process defined | ✅ |
| 22 | Success criteria are quantified | ✅ |
| 23 | Risks are identified with mitigations | ✅ |
| 24 | Assumptions are explicit | ✅ |
| 25 | Launch sequence is phased (10 phases) | ✅ |
| 26 | Next-step operating system contents are listed | ✅ |

> [!IMPORTANT]
> **All 26 items are complete.** This PRD is ready to serve as the foundation for the Project Operating System. No implementation should begin until the Operating System is built and approved.

---

*End of Master PRD — English for Work v1.1*
