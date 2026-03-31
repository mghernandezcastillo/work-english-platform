---
description: Launch day workflow — final steps to go live
---

# Launch Workflow

## Pre-launch (Day before)

- [ ] All items in `checklists/launch-readiness-checklist.md` are ✅
- [ ] App is deployed to production URL
- [ ] Landing pages are live and loading fast
- [ ] Hotmart checkout links work
- [ ] Facebook Pixel is verified in Events Manager
- [ ] At least 3 testimonials approved and visible on landing
- [ ] Welcome email template tested
- [ ] Operator has Facebook Ads Manager open and campaign ready (paused)

## Launch (Hour 0)

1. Operator activates Facebook Ads campaign
2. Set initial daily budget: $10-20 USD
3. Target: Ad Set 1 (English learners, CO) + Ad Set 2 (Job seekers, CO)
4. Wait 2 hours

## Hour 2 check

- [ ] Ads are running (check Ads Manager)
- [ ] Landing page is receiving traffic (check Pixel)
- [ ] No errors in Supabase logs
- [ ] No errors in Edge Function logs

## Hour 6 check

- [ ] At least 100+ landing page views
- [ ] Check CTA click rate
- [ ] Check for any purchases
- [ ] Review Supabase auth logs for new users
- [ ] Check email delivery (Resend dashboard)

## Day 1 review

- [ ] Total spend
- [ ] Total landing page views  
- [ ] Total CTA clicks
- [ ] Total purchases
- [ ] CPA (cost per purchase)
- [ ] Any refund requests?
- [ ] User experience in app (check progress tracking)

## Day 2-3 decisions

| Scenario | Action |
|---|---|
| CPA < 15,000 COP | Great! Maintain budget, prepare to scale |
| CPA 15,000-25,000 COP | Acceptable. Test different ad/landing combo |
| CPA > 25,000 COP | Pause worst ads. Keep best 2. Test new creatives |
| No purchases | Check funnel: is traffic reaching landing? Are they clicking CTA? Is Hotmart page loading? |
| High bounces | Landing page problem — check mobile load time, design, copy |

## Week 1 review

- [ ] Kill underperforming ads (CPA > 25,000 COP)
- [ ] Scale winning ads (increase budget 20%)
- [ ] Check user completion rates in app
- [ ] Check refund rate
- [ ] Plan: add LP2 and LP4?

## Week 2+ optimization

- Start A/B testing prices
- Add new ad creatives
- Build and launch additional landing pages
- Collect real buyer testimonials
- Replace beta testimonials with buyer testimonials
