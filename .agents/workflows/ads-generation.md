---
description: Autonomous ad creative generation for Facebook Ads campaigns
---

# Ads Generation Workflow

## Step 1: Generate static image ads

Using `generate_image`, create ad images (1080x1080) for each variant:

### Pain-based ads
- Image: Person looking frustrated at phone/laptop with English textbook
- Text overlay: Headline from ad manifest
- Brand logo in corner
- CTA text on image

### Benefit-based ads
- Image: Confident professional in meeting/call
- Text overlay: Positive outcome headline
- Brand logo, trust indicators

### Contrast ads
- Split image: left (boring grammar) vs right (real work English)
- Bold headline
- Brand colors

### Price-focused ads
- Clean design with price prominently displayed
- Value comparison visual
- "Pago único" badge

## Step 2: Write ad copy

For each ad, prepare Facebook Ads Manager ready copy:
- Primary text (body)
- Headline
- Description
- CTA button type (Learn More / Sign Up)
- Landing URL

## Step 3: Create carousel templates

Design carousel cards (1080x1080 each):
- Card 1: Route 1 overview
- Card 2: Route 2 overview
- Card 3: Route 3 overview
- Card 4: Price + CTA

## Step 4: Package by campaign

Organize in `manifests/ad-manifest.md`:
- Group by ad set (audience)
- Match each ad to its target landing page
- Include UTM parameters
- Include copy text ready to paste into Ads Manager

## Step 5: Create ad setup guide

Document exact steps for operator to:
1. Create campaign in Ads Manager
2. Create ad sets with targeting
3. Upload creatives
4. Set budgets
5. Activate

Reference: `docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md`
