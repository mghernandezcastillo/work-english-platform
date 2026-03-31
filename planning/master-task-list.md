# Master Task List — English for Work

> Living document. Update status as tasks complete.

## Status legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Complete

---

## Phase 0: Foundation (PRD & Operating System)
- [x] Master PRD created and approved
- [x] Project Operating System created
- [ ] Operator approved operating system

## Phase 1: Technical Setup
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] RLS policies applied
- [ ] Auth configured (email/password, no email confirmation)
- [ ] Storage buckets created (audio, images)
- [ ] Vite + React project initialized
- [ ] Dependencies installed
- [ ] PWA configured
- [ ] .env file created with Supabase credentials
- [ ] App runs locally
- [ ] **CHECKPOINT 1: Operator approval**

## Phase 2: Design System
- [ ] 4 UX directions generated (mockup images)
- [ ] Directions scored on 6 criteria
- [ ] Top 2 presented to operator
- [ ] **CHECKPOINT 2: Operator selects direction**
- [ ] Design system CSS (custom properties) built
- [ ] Base component library built (Button, Card, Input, Modal, Badge, Toast)
- [ ] Refined mockups generated (landing, lesson, dashboard, admin)

## Phase 3: Core Application
- [ ] Login page
- [ ] Register page (with beta token support)
- [ ] AuthGuard, AccessGuard, AdminGuard
- [ ] AppLayout (sidebar, topbar)
- [ ] Dashboard / route selector
- [ ] Route view (module cards)
- [ ] LessonViewer: Objective step
- [ ] LessonViewer: Phrases step (with AudioPlayer)
- [ ] LessonViewer: Mini-example step
- [ ] LessonViewer: Explanation step
- [ ] LessonViewer: Exercise step (fill-blank)
- [ ] LessonViewer: Exercise step (match)
- [ ] LessonViewer: Exercise step (reorder)
- [ ] LessonViewer: Exercise step (choose)
- [ ] LessonViewer: Guided practice step
- [ ] LessonViewer: Reinforcement step
- [ ] AudioPlayer component
- [ ] SimulationViewer (turns, options, feedback, summary)
- [ ] Progress page
- [ ] Profile page
- [ ] Welcome/onboarding page
- [ ] Progress tracking (save to Supabase)
- [ ] **CHECKPOINT 3: Operator approval**

## Phase 4: Admin Panel
- [ ] AdminLayout
- [ ] Admin Dashboard (stats)
- [ ] User Management (list, filter, change access type)
- [ ] Beta Access (generate links, view invites)
- [ ] Testimonial Management (review, approve, order, landing toggle)
- [ ] In-app testimonial prompt (after module/route completion)
- [ ] **CHECKPOINT 4: Operator approval**

## Phase 5: Content Entry
- [ ] Lessons 1.1.1 - 1.1.4
- [ ] Lessons 1.2.1 - 1.2.4
- [ ] Lessons 1.3.1 - 1.3.4
- [ ] Lessons 2.1.1 - 2.1.4
- [ ] Lessons 2.2.1 - 2.2.4
- [ ] Lessons 2.3.1 - 2.3.4
- [ ] Lessons 3.1.1 - 3.1.4
- [ ] Lessons 3.2.1 - 3.2.4
- [ ] Lessons 3.3.1 - 3.3.4
- [ ] Simulations (9 module-level)
- [ ] Simulations (3 route-level)
- [ ] Phrase count verified (220-280)
- [ ] Content manifest updated
- [ ] **CHECKPOINT 5: Content quality review**

## Phase 6: Audio Production
- [ ] Audio scripts extracted from content
- [ ] ElevenLabs account set up
- [ ] Phrase audio generated (~252 clips)
- [ ] Example audio generated (~36 clips)
- [ ] Simulation audio generated (~60 clips)
- [ ] Quality review completed
- [ ] Volume normalization done
- [ ] Audio uploaded to Supabase Storage
- [ ] Content JSON updated with audio URLs
- [ ] Audio manifest updated
- [ ] **CHECKPOINT 6: Audio quality review**

## Phase 7: Integration
- [ ] Hotmart webhook Edge Function deployed
- [ ] Webhook tested with simulated payload
- [ ] Email templates created (5 emails)
- [ ] Email sending via Resend working
- [ ] Email scheduling Edge Function deployed
- [ ] Full purchase flow tested (Hotmart → user → email)
- [ ] Facebook Pixel installed on all pages
- [ ] Pixel events configured
- [ ] Purchase event fires from webhook
- [ ] **CHECKPOINT 7: Payment and email flow review**

## Phase 8: Landing Pages
- [ ] Landing page research completed
- [ ] Landing component system built
- [ ] LP1: /ingles-para-trabajo built
- [ ] LP3: /ingles-call-center built
- [ ] Dynamic testimonials working
- [ ] Sticky mobile CTA working
- [ ] Mobile optimization (360px)
- [ ] Performance optimization (< 2s load)
- [ ] Pixel events on CTA clicks
- [ ] **CHECKPOINT 8: Landing page review**

## Phase 9: Ad Creatives
- [ ] Static image ads generated (8)
- [ ] Carousel ad templates created (4)
- [ ] Story/Reel ad concepts prepared (4)
- [ ] Ad copy written for all variants
- [ ] Ads packaged by campaign angle
- [ ] Ad manifest updated
- [ ] **CHECKPOINT 9: Ad creative review**

## Phase 10: Beta Testing
- [ ] App deployed to production URL
- [ ] Beta invite links generated (10-15)
- [ ] Links distributed to testers
- [ ] Beta testing period (5-7 days)
- [ ] Bug reports addressed
- [ ] Testimonials collected
- [ ] 3-5 testimonials approved for landing
- [ ] **CHECKPOINT 10: Beta results review**

## Phase 11: Polish & QA
- [ ] Full QA on Android Chrome
- [ ] Full QA on iOS Safari
- [ ] Performance audit (Lighthouse)
- [ ] All audio plays correctly
- [ ] Complete purchase flow verified
- [ ] Email sequence tested end-to-end
- [ ] Refund flow tested
- [ ] Copy review completed
- [ ] Brand consistency verified (ad → landing → app → email)
- [ ] **CHECKPOINT 11: FINAL go/no-go**

## Phase 12: Launch
- [ ] Launch readiness checklist 100% complete
- [ ] Facebook Ads campaign created (paused)
- [ ] Initial budget set ($10-20/day)
- [ ] Ads activated
- [ ] First 24h monitoring
- [ ] First week optimization
