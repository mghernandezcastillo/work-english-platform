---
description: Autonomous branding direction generation and variable branding configuration
---

# Branding Generation Workflow

## Step 1: Generate logo concepts

Using `generate_image`, create 3 logo concepts for "English for Work":
- Concept A: Text-based logotype (modern sans-serif)
- Concept B: Icon + text (briefcase/speech bubble + text)
- Concept C: Monogram (EW or EfW stylized)

All must work at small sizes (mobile header, favicon).

## Step 2: Present to operator

Show all 3 with recommendation. Wait for selection.

## Step 3: Generate brand assets

For the chosen concept:
1. Export as SVG for web use
2. Create favicon (32x32, 16x16)
3. Create OG image (1200x630) with logo + tagline
4. Create app icon (512x512) for PWA

## Step 4: Update brand.json

Populate `config/brand.json` with:
- Selected name
- Selected tagline
- Logo file paths
- Color values from chosen UX direction
- Social/OG image paths

## Step 5: Test variable branding

1. Change brand name in `brand.json`
2. Verify it changes everywhere in the app
3. Revert to chosen name
4. Document in walkthrough
