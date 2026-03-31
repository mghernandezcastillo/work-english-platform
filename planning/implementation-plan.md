# Implementation Plan — English for Work

> Technical blueprint for building the project.

---

## Architecture decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Vite + React (SPA) | Fast, lightweight, great dev experience, PWA friendly |
| CSS | Vanilla CSS (custom properties) | Full control, no build dependencies, config-driven |
| Router | React Router v6 | Standard, well-documented |
| State | React Context + Supabase realtime | Simple, no Redux/Zustand overhead needed |
| Auth | Supabase Auth | Integrated with RLS, session management |
| Database | Supabase PostgreSQL | Relational with RLS, free tier sufficient |
| Storage | Supabase Storage | Audio files, same platform as DB |
| Email | Resend | Simple API, free tier, good deliverability |
| Deployment | Cloudflare Pages | Free, global CDN, Git-based deploys |
| PWA | vite-plugin-pwa | Service worker, install prompt, offline support |

---

## File structure

```
work-english-platform/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── favicon.ico
│   ├── manifest.json (PWA)
│   └── images/
│       ├── logo.svg
│       ├── logo-alt.svg
│       └── og.jpg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── app/
│   │   ├── routes.jsx           ← All route definitions
│   │   ├── layout/
│   │   │   ├── PublicLayout.jsx
│   │   │   ├── AppLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Welcome.jsx
│   │       ├── Dashboard.jsx
│   │       ├── RouteView.jsx
│   │       ├── LessonView.jsx
│   │       ├── SimulationView.jsx
│   │       ├── Progress.jsx
│   │       ├── Profile.jsx
│   │       ├── admin/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── AdminUsers.jsx
│   │       │   ├── AdminBeta.jsx
│   │       │   └── AdminTestimonials.jsx
│   │       └── landing/
│   │           └── LandingPage.jsx  ← Renders from JSON data
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthGuard.jsx
│   │   │   ├── AccessGuard.jsx
│   │   │   └── AdminGuard.jsx
│   │   ├── learning/
│   │   │   ├── LessonViewer.jsx
│   │   │   ├── steps/
│   │   │   │   ├── ObjectiveStep.jsx
│   │   │   │   ├── PhrasesStep.jsx
│   │   │   │   ├── MiniExampleStep.jsx
│   │   │   │   ├── ExplanationStep.jsx
│   │   │   │   ├── ExerciseStep.jsx
│   │   │   │   ├── GuidedPracticeStep.jsx
│   │   │   │   └── ReinforcementStep.jsx
│   │   │   ├── exercises/
│   │   │   │   ├── FillBlank.jsx
│   │   │   │   ├── Match.jsx
│   │   │   │   ├── Reorder.jsx
│   │   │   │   └── Choose.jsx
│   │   │   ├── SimulationViewer.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── landing/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── PainSection.jsx
│   │   │   ├── SolutionSection.jsx
│   │   │   ├── WhatYouGetSection.jsx
│   │   │   ├── HowItWorksSection.jsx
│   │   │   ├── TestimonialsSection.jsx
│   │   │   ├── GuaranteeSection.jsx
│   │   │   ├── PriceSection.jsx
│   │   │   ├── FAQSection.jsx
│   │   │   ├── FinalCTASection.jsx
│   │   │   └── StickyMobileCTA.jsx
│   │   ├── admin/
│   │   │   ├── AdminStats.jsx
│   │   │   ├── UserTable.jsx
│   │   │   ├── BetaLinkGenerator.jsx
│   │   │   └── TestimonialReviewList.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Badge.jsx
│   │       ├── Toast.jsx
│   │       └── LoadingSpinner.jsx
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── auth.js
│   │   ├── brand.js
│   │   ├── pixel.js (Facebook Pixel)
│   │   └── utils.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ProgressContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProgress.js
│   │   └── useTestimonials.js
│   ├── data/
│   │   └── landing/
│   │       ├── ingles-para-trabajo.json
│   │       └── ingles-call-center.json
│   └── styles/
│       ├── index.css      ← Design system
│       ├── layout.css     ← Layout styles
│       ├── components.css ← Component styles
│       ├── landing.css    ← Landing page styles
│       └── admin.css      ← Admin styles
```

---

## Key implementation details

### Lesson content delivery
- Lessons stored in Supabase `lessons` table as JSONB
- Fetched per-lesson on demand (not all at once)
- Cached in memory during session
- Content JSON structure follows `docs/strategy/04-pedagogical-framework.md`

### Audio loading
- Audio files in Supabase Storage (public bucket)
- Lazy loaded (load when user reaches section)
- Preload next audio when current is playing
- Service worker caches played audio for offline access

### Brand config
- `config/brand.json` imported at build time
- CSS custom properties set from brand colors on app load
- All text references use brand config, never hardcoded

### Facebook Pixel
- Loaded on all pages
- Events: PageView (auto), ViewContent (landing), InitiateCheckout (CTA click)
- Purchase event fires server-side (Edge Function → Facebook Conversions API)

### Testimonial display
- Landing pages query Supabase for `testimonials WHERE show_on_landing = true AND status = 'approved' ORDER BY display_order`
- No auth needed (public RLS policy for approved landing testimonials)
- Component re-renders without code changes when admin updates testimonials
