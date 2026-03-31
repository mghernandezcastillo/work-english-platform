# Branding Variable System — English for Work

> Source: `00-master-prd.md` Section 15

---

## Concept

The commercial identity can change WITHOUT changing:
- Internal project structure (`work-english-platform`)
- Route names in code
- Function names
- Database schema
- Component logic
- Technical file names

Everything commercial reads from `config/brand.json`.

---

## What is variable

| Element | Where it lives | How to change |
|---|---|---|
| Commercial name | `config/brand.json` → `name` | Edit JSON file |
| Tagline | `config/brand.json` → `tagline` | Edit JSON file |
| Logo SVG | `public/images/logo.svg` + path in `brand.json` | Replace file + update path |
| Favicon | `public/favicon.ico` + path in `brand.json` | Replace file |
| Primary color | `config/brand.json` → `colors.primary` | Edit hex value |
| Secondary color | `config/brand.json` → `colors.secondary` | Edit hex value |
| Accent color | `config/brand.json` → `colors.accent` | Edit hex value |
| OG image (social sharing) | `public/images/og.jpg` + path in `brand.json` | Replace file + update path |
| Landing page headlines | `src/data/landing/*.json` | Edit JSON files |
| Ad creatives | Facebook Ads Manager (external) | Manual change in Ads Manager |
| Hotmart product name | Hotmart dashboard (external) | Manual change in Hotmart |

---

## What is NOT variable (fixed internal names)

| Element | Fixed value | Why |
|---|---|---|
| Project folder | `work-english-platform` | Technical identifier |
| Supabase project | Created once | Cannot rename |
| Route paths in code | `/app`, `/admin`, etc. | Architecture decision |
| Database table names | `users`, `lessons`, etc. | Schema dependency |
| Edge function names | `hotmart-webhook`, etc. | API contract |
| GitHub repo name | `work-english-platform` | Git identifier |
| Environment variables | `VITE_SUPABASE_URL`, etc. | Code references |

---

## brand.json structure

```json
{
  "name": "English for Work",
  "tagline": "Aprende el inglés que sí te sirve para trabajar",
  "shortDescription": "Inglés práctico para conseguir trabajo, entrevistas y call center.",
  "logo": "/images/logo.svg",
  "logoAlt": "/images/logo-alt.svg",
  "favicon": "/favicon.ico",
  "colors": {
    "primary": "#2563EB",
    "primaryHover": "#1D4ED8",
    "secondary": "#10B981",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "surface": "#F8FAFC",
    "text": "#1E293B",
    "textMuted": "#64748B"
  },
  "fonts": {
    "primary": "Inter",
    "heading": "Inter"
  },
  "social": {
    "ogImage": "/images/og.jpg",
    "ogTitle": "English for Work — Aprende el inglés que sí te sirve para trabajar",
    "ogDescription": "Frases reales, simulaciones prácticas, y la confianza que necesitas para trabajar en inglés."
  },
  "contact": {
    "whatsapp": "+57XXXXXXXXXX",
    "email": "soporte@englishforwork.com"
  },
  "legal": {
    "companyName": "English for Work",
    "country": "Colombia"
  }
}
```

---

## How components use brand config

```javascript
// lib/brand.js
import brandConfig from '../../config/brand.json';

export const brand = brandConfig;
export const brandName = brandConfig.name;
export const brandTagline = brandConfig.tagline;
export const brandColors = brandConfig.colors;
```

```css
/* Applied via JavaScript on app load */
:root {
  --color-primary: var(--brand-primary);
  --color-secondary: var(--brand-secondary);
  /* ... etc */
}
```

---

## Testing alternative names

| Name candidate | How to test |
|---|---|
| English for Work | Default in brand.json |
| WorkEnglish | Change brand.json → name, create new ad set |
| English Ready | Change brand.json → name, create new ad set |
| ProEnglish | Change brand.json → name, create new ad set |
| Job English | Change brand.json → name, create new ad set |

**Testing method:**
1. Run 2-3 names as Facebook Ad headlines simultaneously
2. Measure CTR and CPA per name
3. Winner becomes the default brand.json value
4. Loser ads get paused

---

## Rebranding procedure

If you want to change the commercial name completely:

1. Edit `config/brand.json` — change `name` and `tagline`
2. Replace logo files in `public/images/`
3. Update OG image in `public/images/og.jpg`
4. Redeploy to Cloudflare (`npm run build` → push to repo)
5. Update Hotmart product name manually
6. Update Facebook Ads headlines manually
7. Update WhatsApp number if needed

**Time to rebrand: ~30 minutes** (not counting ad creative redesign)
