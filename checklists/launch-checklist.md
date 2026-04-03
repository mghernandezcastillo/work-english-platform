# Launch Checklist — English for Work

> Complete every item before going live with ads.
> Last updated: 2026-04-03

---

## Product

- [x] All 36 lessons have content and display correctly
- [x] All 12 simulations work with audio
- [x] All exercises give correct feedback
- [x] Progress tracking saves and displays
- [x] Onboarding flow works for new users
- [x] Dashboard displays routes and progress correctly
- [x] Audio player works on Android Chrome
- [x] Audio player works on iOS Safari
- [x] PWA install prompt appears on mobile
- [x] Vocabulary section with dictionary
- [x] XP system and badges

## Admin

- [x] Admin panel loads (only for admin users)
- [x] Can view all users and their access types
- [x] Can change access type (none → beta / paid / unlimited)
- [x] Can generate beta invite links
- [x] Can review and approve testimonials
- [x] Testimonials appear on landing page when approved
- [x] Ad Center with campaigns, images, and copy ready to publish
- [x] Admin settings panel

## Authentication

- [x] Login works with email/password
- [x] Register works (standard)
- [x] Register works with beta token
- [x] User without active access sees "not active" screen
- [x] User with active access can use the app
- [x] Session persists on refresh
- [x] Forgot password / reset password flow

## Payments

- [x] Hotmart product is configured
- [x] Hotmart checkout link works
- [x] Hotmart webhook fires on test purchase
- [x] User account created/updated on purchase
- [x] Welcome email sent after purchase
- [x] Refund webhook revokes access

## Emails

- [x] Welcome email (Day 0) template tested
- [x] Day 1 email sends correctly
- [x] Day 3 email sends correctly
- [x] Day 5 email (with testimonial CTA) sends correctly
- [x] Day 7 email sends correctly
- [x] Emails don't go to spam (SPF/DKIM configured)
- [x] Unsubscribe link works

## Landing pages

- [x] LP1 (`/ingles-para-trabajo`) loads correctly
- [x] LP3 (`/ingles-call-center`) loads correctly
- [x] Testimonials display dynamically (6 real testimonials)
- [x] CTA buttons link to correct Hotmart checkout
- [x] Sticky mobile CTA bar works
- [x] Page loads in < 2 seconds on mobile
- [x] Mobile layout looks correct (360px)
- [x] Facebook Pixel fires on page load

## Facebook Ads

- [x] Facebook Pixel installed and verified
- [x] Custom events configured (ViewContent, InitiateCheckout)
- [x] Purchase event fires on Hotmart webhook
- [x] Ad creatives ready (5 static + 1 carousel = 9 images in 4 campaigns)
- [ ] Campaign created in Ads Manager (paused)
- [ ] Target audiences configured
- [ ] Budget set ($10-20/day initial)

## Social proof

- [x] 6 real testimonials approved and in database
- [x] Testimonials displaying on all landing pages
- [x] Testimonials look authentic and real

## Infrastructure

- [x] App deployed to production URL
- [x] HTTPS working
- [x] No console errors on production
- [x] No broken links
- [x] Legal pages (Terms, Privacy)

## Content & Audio

- [x] 36/36 lessons with full content (~5-7KB each)
- [x] 12/12 simulations with content (5-8 turns each)
- [x] 321/348 audio clips produced (228 lessons + 93 simulations)
- [x] Audio uploaded to Supabase Storage (lesson-audios, sim-audios)

---

## 🚀 ONLY REMAINING TO LAUNCH

- [ ] Create Facebook Ads campaign in Ads Manager (use Ad Center)
- [ ] Configure target audiences
- [ ] Set initial budget ($10-20/day)
- [ ] Activate campaign
