---
description: Master execution phases — the ordered workflow for building English for Work from start to launch
---

# Execution Phases — English for Work

> This file defines the EXACT order Antigravity follows to build the project.
> Do NOT skip phases. Each depends on the previous one.

---

## Phase 1: Technical Setup

### Prerequisites
- [ ] Operator has completed `checklists/credential-checklist.md`
- [ ] `.env` file exists with Supabase credentials

### Tasks
1. Create Supabase project (via MCP or operator creates manually)
2. Apply database schema from `database/schema.sql`
3. Apply RLS policies from `database/rls-planning.md`
4. Configure Supabase Auth (email/password, disable email confirmation)
5. Create storage buckets (`audio`, `images`)
6. Initialize Vite + React project in workspace root
7. Install dependencies: `@supabase/supabase-js`, `react-router-dom`
8. Set up PWA configuration
9. Create `.env` from `.env.example` with Supabase values
10. Verify: app runs locally, Supabase connection works

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] App runs locally
- [ ] Database tables visible in Supabase dashboard
- [ ] Operator confirms Supabase project is correct

---

## Phase 2: Design System

### Tasks
1. Run UX generation workflow (`.agents/workflows/ux-generation.md`)
2. Generate 4 visual directions as mockup images
3. Score each direction on 6 criteria
4. Present top 2 to operator for selection
5. Refine selected direction: colors, typography, spacing, components
6. Generate refined mockups: landing hero, lesson view, dashboard, admin
7. Implement design system as CSS custom properties in `src/styles/index.css`
8. Build base component library (Button, Card, Input, Modal, etc.)
9. Verify: components render correctly on mobile and desktop

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Operator approves chosen visual direction
- [ ] Design system looks premium on mobile

---

## Phase 3: Core Application

### Tasks
1. Build auth pages (Login, Register with beta token support)
2. Build AuthGuard, AccessGuard, AdminGuard components
3. Build AppLayout (sidebar, topbar, main content area)
4. Build Dashboard page (route selector with progress)
5. Build Route view page (module cards)
6. Build LessonViewer with all 7 steps:
   - ObjectiveStep, PhrasesStep, MiniExampleStep, ExplanationStep
   - ExerciseStep (4 types), GuidedPracticeStep, ReinforcementStep
7. Build AudioPlayer component
8. Build SimulationViewer (turns, options, feedback, summary)
9. Build Progress page (route/module/lesson completion)
10. Build Profile page (basic account info)
11. Build Onboarding/Welcome page
12. Wire up progress tracking (save to Supabase)
13. Test with sample lesson data
14. Verify: full lesson flow works on mobile

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Lesson viewer displays all 7 steps correctly
- [ ] Audio player works on mobile
- [ ] Exercises give feedback correctly
- [ ] Progress is saved and displayed

---

## Phase 4: Admin Panel

### Tasks
1. Build AdminLayout (sidebar, restricted access)
2. Build Admin Dashboard (user counts, progress stats)
3. Build User Management (list, filter, search, change access type)
4. Build Beta Access (generate links, view invites, track usage)
5. Build Testimonial Management (review, approve/reject, order, landing toggle)
6. Build testimonial prompt component (in-app, after module/route completion)
7. Verify: admin can create beta links, change access types, approve testimonials

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Admin panel accessible only to admin users
- [ ] Beta invite links work correctly
- [ ] Access type changes work (beta, paid, unlimited)

---

## Phase 5: Content Entry

### Tasks
1. Create all 36 lesson content files in JSON format
2. Follow `docs/strategy/03-content-architecture.md` for structure
3. Follow `docs/strategy/04-pedagogical-framework.md` for 7-step content
4. Create all 12 simulation content files in JSON format
5. Compile master phrase list (220-280 phrases)
6. Mark audio requirements in content (which text needs audio)
7. Update `manifests/content-manifest.md` with completion status
8. Verify: all lessons load and display in the app

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] All 36 lessons have content
- [ ] All 12 simulations have content
- [ ] Phrase count is within 220-280 range
- [ ] Content quality review (sample 5 lessons)

---

## Phase 6: Audio Production

### Tasks
1. Extract all audio scripts from content JSON
2. Generate phrase audio (~252 clips) using ElevenLabs
3. Generate example audio (~36 clips) using ElevenLabs
4. Generate simulation audio (~60 clips) using ElevenLabs
5. Review all clips for quality
6. Re-generate any unnatural clips
7. Normalize volume levels
8. Upload to Supabase Storage
9. Update content JSON with audio file URLs
10. Update `manifests/audio-manifest.md` with status
11. Verify: all audio plays correctly in the app on mobile

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Audio quality check (listen to sample of 10 clips)
- [ ] All audio plays on Android Chrome and iOS Safari

---

## Phase 7: Integration

### Tasks
1. Deploy Hotmart webhook Edge Function
2. Test webhook with simulated Hotmart payload
3. Implement email sending via Resend
4. Create email templates (5 emails)
5. Deploy email scheduling Edge Function
6. Test full purchase flow (Hotmart → webhook → user created → email sent)
7. Install Facebook Pixel on all pages
8. Configure Pixel events: PageView, ViewContent, InitiateCheckout
9. Set up Purchase event firing from webhook
10. Verify: Pixel fires correctly in Facebook Events Manager

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Test purchase creates user correctly
- [ ] Welcome email arrives
- [ ] Facebook Pixel events visible in Events Manager

---

## Phase 8: Landing Pages

### Tasks
1. Execute landing research workflow (`.agents/workflows/landing-generation.md`)
2. Build landing page component system
3. Build LP1: `/ingles-para-trabajo` (generic work English)
4. Build LP3: `/ingles-call-center` (call center focus)
5. Implement dynamic testimonial section (queries approved testimonials)
6. Implement sticky mobile CTA bar
7. Optimize for mobile (360px)
8. Optimize loading speed (target < 2s on 3G)
9. Add Facebook Pixel events to CTA clicks
10. Verify: landing pages load fast and look premium on mobile

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Landing page design looks premium and trustworthy
- [ ] CTA is clearly visible on mobile
- [ ] Page loads in < 2 seconds
- [ ] Hotmart checkout link works

---

## Phase 9: Ad Creatives

### Tasks
1. Execute ad generation workflow (`.agents/workflows/ads-generation.md`)
2. Generate 8-12 static image ads
3. Prepare ad copy variants
4. Create carousel ad templates
5. Update `manifests/ad-manifest.md` with all creatives
6. Package ads by campaign angle

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Ad creatives look professional
- [ ] Copy is compelling and clear
- [ ] Ads match landing page visual style

---

## Phase 10: Beta Testing

### Tasks
1. Deploy app to Cloudflare Pages
2. Generate 10-15 beta invite links from admin panel
3. Operator distributes links via WhatsApp
4. Monitor beta tester usage (admin dashboard)
5. Collect and review testimonials
6. Fix any bugs reported
7. Approve 3-5 testimonials for landing pages
8. Verify: testimonials display correctly on landing pages

### Checkpoint: HUMAN APPROVAL REQUIRED
- [ ] Beta testers can access and use the app
- [ ] At least 3 testimonials approved and displaying on landing
- [ ] No critical bugs remaining

---

## Phase 11: Polish & QA

### Tasks
1. Full QA on Android Chrome (3 device sizes)
2. Full QA on iOS Safari
3. Performance audit (Lighthouse)
4. Fix any UI/UX issues
5. Verify all 36 lesson + 12 simulation audio works
6. Test complete purchase flow end-to-end
7. Test email sequence (verify all 5 emails)
8. Test refund flow
9. Final copy review (all landing page text)
10. Verify brand consistency: ad → landing → app → email

### Checkpoint: HUMAN APPROVAL REQUIRED (FINAL)
- [ ] Everything works on mobile
- [ ] Purchase flow is complete
- [ ] All content is in place
- [ ] Launch readiness checklist is 100% complete

---

## Phase 12: Launch

### Tasks
1. Verify `checklists/launch-readiness-checklist.md` is complete
2. Create Facebook Ad campaign (operator in Ads Manager)
3. Set initial budget ($10-20/day)
4. Activate ads
5. Monitor first 24h: CPA, CTR, conversions
6. Monitor app: new users, lesson completions, errors
7. Make adjustments if needed (ad copy, landing copy, budget)

### Post-launch
- Scale winning ads (Week 3-4)
- Build remaining landing pages (LP2, LP4, LP5, LP6)
- Collect and add real testimonials
- A/B test prices
- Plan V2 features
