# UX/UI Strategy — English for Work

> Source: `00-master-prd.md` Section 13

---

## Design process (autonomous, AI-driven)

> The operator does NOT need to find design references manually.
> Antigravity will execute this entire process using its workflows.

### Phase 1: Visual direction generation

Antigravity generates **4 distinct premium visual directions** as full-page mockups.

| Direction | Aesthetic | Key characteristics |
|---|---|---|
| **A: Dark Professional** | Dark background, light text, neon accent | Sophisticated, tech-forward, premium feel |
| **B: Light Clean** | White background, soft shadows, subtle color | Trustworthy, clean, academic-professional |
| **C: Bold Gradient** | Vibrant gradients, dynamic shapes, bold type | Energetic, modern, attention-grabbing |
| **D: Warm Minimal** | Warm neutrals, rounded corners, gentle animation | Approachable, friendly, low-intimidation |

Each direction includes mockups for: landing page hero, lesson view, simulation view, dashboard.

### Phase 2: Comparative scoring

Score each direction on these criteria (1-10):

| Criteria | Weight | What it measures |
|---|---|---|
| Premium perception | 20% | Does this look worth paying for? |
| Trust | 20% | Does this feel safe, legitimate, professional? |
| Readability | 15% | Is content easy to read, especially on mobile? |
| CTA visibility | 15% | Is the primary action button impossible to miss? |
| Mobile usability | 15% | Does it work well on a 360px Android screen? |
| Consistency potential | 15% | Can this visual language extend to ads, landing pages, emails? |

Present top 2 to user with rationale.

### Phase 3: Refinement

Refine the selected direction with:
- Specific color palette (hex values)
- Typography scale (font family, sizes, weights)
- Spacing system (8px grid)
- Border radius values
- Shadow values
- Animation specifications
- Component library sketches

Generate refined mockups for:
- Landing page (full page)
- Lesson view (7 steps)
- Simulation view
- Dashboard
- Login/Register
- Admin panel

### Phase 4: Implementation

Build design system as CSS custom properties. Then implement all components.

---

## Design principles

| Principle | Rule |
|---|---|
| **Mobile-first** | Design for 360px width, then scale up. Test on Android Chrome first. |
| **Premium feel** | Use high-quality typography, generous whitespace, subtle micro-animations |
| **Trust signals** | Consistent branding, professional tone, guarantee badges visible |
| **CTA dominance** | Primary action is always the most visible element. Use contrast color. |
| **Low cognitive load** | One primary action per screen. Clear visual hierarchy. |
| **Consistency** | Same design language across: ad → landing → app → email |
| **Spanish UI** | All interface text in Spanish. Only practice content in English. |
| **Fast loading** | Target < 2s load time on 3G. Lazy load images/audio. |

---

## Typography specification (to be finalized in Phase 3)

| Element | Spec |
|---|---|
| **Primary font** | Inter (Google Fonts) — clean, professional, excellent readability |
| **Heading font** | Same family, bold weight |
| **Base size** | 16px (1rem) |
| **Scale** | 1.25 ratio — 12px / 14px / 16px / 20px / 24px / 32px / 40px |
| **English phrases** | Slightly larger (1.125rem), distinct color, possibly different weight |
| **Line height** | Body: 1.6 / Headings: 1.2 |
| **Letter spacing** | -0.01em for headings, normal for body |

---

## Spacing system

Based on 8px grid:

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight padding, icon gaps |
| `--space-2` | 8px | Small gaps, compact elements |
| `--space-3` | 12px | Default padding inside small components |
| `--space-4` | 16px | Default padding, card padding |
| `--space-5` | 24px | Section padding, major gaps |
| `--space-6` | 32px | Large section padding |
| `--space-7` | 48px | Page-level spacing |
| `--space-8` | 64px | Landing page section spacing |

---

## Responsive breakpoints

| Breakpoint | Width | Target |
|---|---|---|
| Mobile (default) | 0-639px | Android phones (primary target: 360px) |
| Tablet | 640-1023px | iPads, large phones in landscape |
| Desktop | 1024px+ | Laptops, desktops |

---

## Color system (defined in Phase 3)

Must include:

| Token | Purpose |
|---|---|
| `--color-primary` | CTA buttons, links, key actions |
| `--color-primary-hover` | Hover state for primary elements |
| `--color-secondary` | Secondary buttons, accents |
| `--color-success` | Correct answers, progress, completion |
| `--color-error` | Incorrect answers, errors |
| `--color-warning` | Alerts, caution states |
| `--color-bg-primary` | Main background |
| `--color-bg-secondary` | Card backgrounds, alternating sections |
| `--color-bg-tertiary` | Subtle backgrounds, input fields |
| `--color-text-primary` | Main body text |
| `--color-text-secondary` | Muted text, labels |
| `--color-text-inverse` | Text on dark/colored backgrounds |
| `--color-border` | Default borders |
| `--color-phrase-bg` | English phrase card background |
| `--color-phrase-text` | English phrase text |
| `--color-audio-accent` | Audio player, play button |

---

## Animation specification

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| Page transition | 200ms | ease-out | Route changes |
| Card hover | 150ms | ease | Cards, buttons |
| Modal appear | 250ms | ease-out | Modals, overlays |
| Progress bar fill | 500ms | ease-in-out | Progress updates |
| Success celebration | 400ms | spring | Correct answers, completions |
| Error shake | 300ms | ease | Incorrect answers |
| Slide in (mobile) | 200ms | ease-out | Sidebar, panels |
| Fade in | 150ms | ease | Content appearing |

---

## Key component specifications

### Audio player
- Inline, compact design
- Play/pause button (prominent)
- Progress bar (scrubable)
- Speed control (0.75x, 1x, 1.25x)
- Duration display
- Works on mobile without fullscreen takeover

### Phrase card
- Clear English phrase (large, accent color)
- Spanish translation below (smaller, muted)
- Pronunciation guide (smallest, italic)
- Audio play button (right side)
- Context note (expandable or always visible)
- Swipeable on mobile for next phrase

### Exercise feedback
- Correct: green flash, checkmark animation, positive message
- Incorrect: red highlight, shake animation, explanation, correct answer shown
- Both: smooth transition, no jarring alerts

### Sticky mobile CTA (landing pages)
- Fixed to bottom of screen
- Full-width button
- Price visible
- Semi-transparent background
- Appears after scrolling past hero
- Does not cover content

---

## Workflow reference

See `.agents/workflows/ux-generation.md` for the automated execution process.
