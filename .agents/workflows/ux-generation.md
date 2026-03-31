---
description: Autonomous UX/UI direction generation and evaluation workflow
---

# UX Generation Workflow

> Antigravity uses this workflow to autonomously generate, evaluate, and refine visual directions for the project.

## Step 1: Generate 4 visual directions

Generate 4 full-page mockup images using the `generate_image` tool. Each direction should show a **mobile landing page hero section** (360px width).

### Direction A: Dark Professional
- Prompt: "Premium mobile landing page hero for an English learning app. Dark background (#0F172A), white text, electric blue accent (#3B82F6). Clean sans-serif typography. Spanish headline 'El inglés que sí te sirve para trabajar'. Prominent blue CTA button. Trust badges. Professional, tech-forward aesthetic. 360px width mobile view. No device frame."

### Direction B: Light Clean
- Prompt: "Premium mobile landing page hero for an English learning app. White background, light gray (#F1F5F9) sections, green accent (#10B981). Clean typography (Inter font style). Spanish headline 'El inglés que sí te sirve para trabajar'. Prominent green CTA button. Trust badges. Clean, trustworthy, academic-professional. 360px width mobile view. No device frame."

### Direction C: Bold Gradient
- Prompt: "Premium mobile landing page hero for an English learning app. Bold gradient background (deep purple to blue). White text, warm orange accent (#F59E0B) for CTA. Dynamic geometric shapes. Spanish headline 'El inglés que sí te sirve para trabajar'. Large CTA button. Energetic, modern, attention-grabbing. 360px width mobile view. No device frame."

### Direction D: Warm Minimal
- Prompt: "Premium mobile landing page hero for an English learning app. Warm cream background (#FFFBEB), dark text, terracotta accent (#DC2626). Rounded corners, generous whitespace. Spanish headline 'El inglés que sí te sirve para trabajar'. Soft CTA button. Approachable, friendly, low-intimidation, premium minimal. 360px width mobile view. No device frame."

## Step 2: Score each direction

Create a scoring table:

| Criteria (weight) | Direction A | Direction B | Direction C | Direction D |
|---|---|---|---|---|
| Premium perception (20%) | ?/10 | ?/10 | ?/10 | ?/10 |
| Trust (20%) | ?/10 | ?/10 | ?/10 | ?/10 |
| Readability (15%) | ?/10 | ?/10 | ?/10 | ?/10 |
| CTA visibility (15%) | ?/10 | ?/10 | ?/10 | ?/10 |
| Mobile usability (15%) | ?/10 | ?/10 | ?/10 | ?/10 |
| Consistency potential (15%) | ?/10 | ?/10 | ?/10 | ?/10 |
| **Weighted total** | ? | ? | ? | ? |

## Step 3: Present top 2 to operator

Show the top 2 direction images to the operator with:
- Scores and rationale for each
- Pros and cons
- Recommendation

**STOP HERE — Wait for operator to choose.**

## Step 4: Refine selected direction

Generate additional mockups for the chosen direction:
1. Full landing page (mobile, scrollable)
2. Lesson view (showing phrase card + audio player)
3. Dashboard (route cards with progress)
4. Simulation view (conversation turn)

## Step 5: Extract design tokens

From the refined direction, extract:
- Color palette (hex values)
- Font sizes (px/rem values)
- Spacing values
- Border radius
- Shadow values
- Animation specs

Document these in the CSS custom properties for `src/styles/index.css`.
