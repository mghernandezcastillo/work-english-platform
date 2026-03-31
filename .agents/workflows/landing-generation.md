---
description: Autonomous landing page research, copy writing, and build workflow
---

# Landing Page Generation Workflow

## Step 1: Research (before building)

// turbo
1. Search web for "cursos de inglés para trabajar hotmart" — analyze top 5 results
2. Search web for "English course landing page LATAM" — analyze structure
3. Search Facebook Ads Library for "curso inglés trabajo Colombia" — analyze ad → landing patterns
4. Search web for "high converting landing page copywriting formulas" — extract applicable patterns
5. Search Hotmart marketplace for English courses — analyze pricing, positioning, reviews

Output: Research notes saved to `planning/landing-research.md`

## Step 2: Write copy for LP1 and LP3

Using research + PRD + `docs/strategy/06-cro-landing-strategy.md`:

For each landing page, write:
- Hero headline + subheadline
- Pain identification bullets (5-6)
- Solution description (2-3 paragraphs)
- "What you get" section with specifics
- "How it works" 3 steps
- FAQ (5-7 questions with answers)
- Final CTA copy

Save as JSON in `src/data/landing/`

## Step 3: Build landing components

Build reusable landing sections:
1. HeroSection (reads copy from JSON)
2. PainSection
3. SolutionSection
4. WhatYouGetSection
5. HowItWorksSection
6. TestimonialsSection (dynamic from DB)
7. GuaranteeSection
8. PriceSection
9. FAQSection
10. FinalCTASection
11. StickyMobileCTA

## Step 4: Assemble LP1 and LP3

Compose landing pages from sections + copy JSON.

## Step 5: Optimize

1. Test on mobile (360px) via browser tool
2. Measure load time
3. Verify CTA visibility
4. Verify Hotmart checkout link works
5. Verify testimonials display
6. Verify Facebook Pixel fires

## Step 6: Update manifest

Update `manifests/landing-manifest.md` with status.
