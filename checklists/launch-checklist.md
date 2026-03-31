# Launch Checklist — English for Work

> Complete every item before going live with ads.

---

## Product

- [ ] All 36 lessons have content and display correctly
- [ ] All 12 simulations work with audio
- [ ] All exercises give correct feedback
- [ ] Progress tracking saves and displays
- [ ] Onboarding flow works for new users
- [ ] Dashboard displays routes and progress correctly
- [ ] Audio player works on Android Chrome
- [ ] Audio player works on iOS Safari
- [ ] PWA install prompt appears on mobile

## Admin

- [ ] Admin panel loads (only for admin users)
- [ ] Can view all users and their access types
- [ ] Can change access type (none → beta / paid / unlimited)
- [ ] Can generate beta invite links
- [ ] Can review and approve testimonials
- [ ] Testimonials appear on landing page when approved

## Authentication

- [ ] Login works with email/password
- [ ] Register works (standard)
- [ ] Register works with beta token
- [ ] User without active access sees "not active" screen
- [ ] User with active access can use the app
- [ ] Session persists on refresh

## Payments

- [ ] Hotmart product is configured
- [ ] Hotmart checkout link works
- [ ] Hotmart webhook fires on test purchase
- [ ] User account created/updated on purchase
- [ ] Welcome email sent after purchase
- [ ] Refund webhook revokes access

## Emails

- [ ] Welcome email (Day 0) template tested
- [ ] Day 1 email sends correctly
- [ ] Day 3 email sends correctly
- [ ] Day 5 email (with testimonial CTA) sends correctly
- [ ] Day 7 email sends correctly
- [ ] Emails don't go to spam (SPF/DKIM configured)
- [ ] Unsubscribe link works

## Landing pages

- [ ] LP1 (`/ingles-para-trabajo`) loads correctly
- [ ] LP3 (`/ingles-call-center`) loads correctly
- [ ] Testimonials display dynamically
- [ ] CTA buttons link to correct Hotmart checkout
- [ ] Sticky mobile CTA bar works
- [ ] Page loads in < 2 seconds on mobile
- [ ] Mobile layout looks correct (360px)
- [ ] Facebook Pixel fires on page load

## Facebook Ads

- [ ] Facebook Pixel installed and verified
- [ ] Custom events configured (ViewContent, InitiateCheckout)
- [ ] Purchase event fires on Hotmart webhook
- [ ] At least 8 ad creatives ready
- [ ] Campaign created (paused)
- [ ] Target audiences configured
- [ ] Budget set ($10-20/day initial)

## Social proof

- [ ] At least 3 beta tester testimonials approved
- [ ] Testimonials displaying on all landing pages
- [ ] Testimonials look authentic and real

## Infrastructure

- [ ] App deployed to production URL
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS working
- [ ] No console errors on production
- [ ] No broken links
- [ ] OG image displays correctly when URL shared
