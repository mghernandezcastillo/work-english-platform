# Product Architecture — English for Work

> Source: `00-master-prd.md` Sections 7, 17, 18

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Vite + React | Fast, modern, great DX, lightweight |
| **Styling** | Vanilla CSS (custom properties) | Full control, no dependencies, design system friendly |
| **PWA** | Vite PWA plugin | Offline access, install prompt, mobile-native feel |
| **Backend** | Supabase | Auth, DB, storage, edge functions — all in one |
| **Database** | PostgreSQL (via Supabase) | Robust, relational, RLS built-in |
| **Auth** | Supabase Auth | Email/password, session management |
| **Storage** | Supabase Storage | Audio files, images |
| **Webhooks** | Supabase Edge Functions | Hotmart payment processing |
| **Emails** | Resend | Transactional emails, simple API |
| **Hosting** | Cloudflare Pages | Free, fast, global CDN, easy deployment |
| **Audio gen** | ElevenLabs | Premium AI voices |
| **Tracking** | Facebook Pixel | Conversion tracking for ads |

---

## App pages

### Public pages (no login required)

| Page | Route | Purpose |
|---|---|---|
| Landing page 1 | `/ingles-para-trabajo` | Sales — generic work English |
| Landing page 2 | `/ingles-call-center` | Sales — call center focus |
| Landing page 3 | `/entrevistas-en-ingles` | Sales — interview prep |
| Landing page 4 | `/habla-con-clientes` | Sales — client communication |
| Landing page 5 | `/deja-de-estudiar-al-azar` | Sales — frustration angle |
| Landing page 6 | `/ingles-que-usan-en-trabajos` | Sales — practicality angle |
| Login | `/login` | User authentication |
| Register | `/register` | New user creation |
| Register (beta) | `/register?beta={token}` | Beta tester registration |

### Protected pages (login + active access required)

| Page | Route | Purpose |
|---|---|---|
| Welcome / Onboarding | `/welcome` | First-time user orientation |
| Dashboard | `/app` | Route selector, progress overview |
| Route view | `/app/route/:routeId` | Modules within a route |
| Lesson view | `/app/lesson/:lessonId` | 7-step lesson experience |
| Simulation view | `/app/simulation/:simId` | Interactive multi-turn simulation |
| Progress | `/app/progress` | Completion tracking across routes |
| Profile | `/app/profile` | Account settings |

### Admin pages (login + is_admin required)

| Page | Route | Purpose |
|---|---|---|
| Admin Dashboard | `/admin` | Key metrics overview |
| User Management | `/admin/users` | View/edit users, change access types |
| Beta Access | `/admin/beta` | Generate and manage invite links |
| Testimonials | `/admin/testimonials` | Review, approve, order testimonials |

---

## Component architecture

```
App
├── Layout
│   ├── PublicLayout (landing pages, login, register)
│   │   └── No sidebar, no nav — standalone pages
│   ├── AppLayout (main app)
│   │   ├── Sidebar (navigation)
│   │   ├── TopBar (user info, progress)
│   │   └── MainContent
│   └── AdminLayout
│       ├── AdminSidebar
│       └── AdminContent
│
├── Auth
│   ├── LoginForm
│   ├── RegisterForm
│   ├── AuthGuard (redirects if not authenticated)
│   ├── AccessGuard (redirects if access_type = 'none')
│   └── AdminGuard (redirects if not is_admin)
│
├── Learning
│   ├── RouteCard (route overview on dashboard)
│   ├── ModuleCard (module overview on route page)
│   ├── LessonViewer
│   │   ├── ObjectiveStep
│   │   ├── PhrasesStep (with AudioPlayer)
│   │   ├── MiniExampleStep (with AudioPlayer)
│   │   ├── ExplanationStep
│   │   ├── ExerciseStep (fill-blank, match, reorder, choose)
│   │   ├── GuidedPracticeStep
│   │   └── ReinforcementStep
│   ├── SimulationViewer
│   │   ├── SimulationTurn (with AudioPlayer)
│   │   ├── ResponseOptions
│   │   └── SimulationSummary
│   └── ProgressBar
│
├── Audio
│   └── AudioPlayer (play/pause, progress bar, speed control)
│
├── Testimonials
│   ├── TestimonialPrompt (in-app after completion)
│   ├── TestimonialCard (display on landing)
│   └── TestimonialCarousel (landing section)
│
├── Landing
│   ├── HeroSection
│   ├── PainSection
│   ├── SolutionSection
│   ├── WhatYouGetSection
│   ├── HowItWorksSection
│   ├── TestimonialsSection (dynamic)
│   ├── GuaranteeSection
│   ├── PriceSection
│   ├── FAQSection
│   ├── FinalCTASection
│   └── StickyMobileCTA
│
├── Admin
│   ├── AdminStats
│   ├── UserTable
│   ├── UserAccessControl
│   ├── BetaLinkGenerator
│   ├── TestimonialReviewList
│   └── TestimonialApproval
│
└── Common
    ├── Button
    ├── Card
    ├── Modal
    ├── Badge
    ├── Input
    ├── Select
    ├── Toast
    └── LoadingSpinner
```

---

## Data flow

### Purchase flow
```
User clicks CTA on landing → Hotmart checkout → Payment → 
Hotmart webhook → Edge Function → Creates/updates user (access_type='paid') → 
Sends welcome email via Resend → User logs in → Full access
```

### Beta access flow
```
Admin generates invite link → Sends via WhatsApp → 
Tester registers with beta token → access_type set to 'beta' → 
Full access → Tester completes content → Testimonial prompt
```

### Content flow
```
User selects route → Views modules → Selects lesson → 
Steps through 7-step lesson → Completes exercises → 
Progress saved → Module completion → Simulation unlocked → 
Route completion → Testimonial prompt
```

### Testimonial flow
```
User completes module/route → Testimonial prompt appears → 
User submits rating + text + city → Saved as 'pending' → 
Admin reviews in admin panel → Approves + marks 'show on landing' → 
Landing page auto-displays → No code changes needed
```

---

## File structure (implementation)

```
src/
├── app/
│   ├── layout.jsx                  ← Root layout
│   ├── page.jsx                    ← Home redirect
│   ├── login/page.jsx
│   ├── register/page.jsx
│   ├── welcome/page.jsx
│   ├── app/
│   │   ├── layout.jsx              ← App layout (sidebar)
│   │   ├── page.jsx                ← Dashboard
│   │   ├── route/[routeId]/page.jsx
│   │   ├── lesson/[lessonId]/page.jsx
│   │   ├── simulation/[simId]/page.jsx
│   │   ├── progress/page.jsx
│   │   └── profile/page.jsx
│   ├── admin/
│   │   ├── layout.jsx              ← Admin layout
│   │   ├── page.jsx                ← Admin dashboard
│   │   ├── users/page.jsx
│   │   ├── beta/page.jsx
│   │   └── testimonials/page.jsx
│   └── [landingSlug]/page.jsx      ← Dynamic landing pages
├── components/
│   ├── auth/
│   ├── learning/
│   ├── landing/
│   ├── admin/
│   └── common/
├── lib/
│   ├── supabase.js                 ← Supabase client
│   ├── auth.js                     ← Auth helpers
│   ├── brand.js                    ← Brand config loader
│   └── utils.js                    ← Utility functions
├── data/
│   ├── routes.json                 ← Route/module/lesson content
│   ├── simulations.json            ← Simulation content
│   └── landing/
│       ├── ingles-para-trabajo.json
│       ├── ingles-call-center.json
│       └── ... (one per landing variant)
└── styles/
    ├── index.css                   ← Design system (custom properties)
    ├── components.css              ← Component styles
    └── landing.css                 ← Landing page styles
```

---

## Environment variables

See `.env.example` for the complete list. Key variables:

```env
VITE_SUPABASE_URL=            # Supabase project URL
VITE_SUPABASE_ANON_KEY=       # Supabase publishable key
VITE_HOTMART_WEBHOOK_SECRET=  # Hotmart webhook verification
VITE_RESEND_API_KEY=          # Resend email API key
VITE_FB_PIXEL_ID=             # Facebook Pixel ID
VITE_APP_URL=                 # Production app URL
```
