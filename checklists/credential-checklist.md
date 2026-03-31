# Credential Checklist — English for Work

> Complete this BEFORE starting implementation.
> Each item needs an account + API key or credential.

---

## Required accounts

| # | Service | Account created | API key obtained | Added to .env | Guide |
|---|---|---|---|---|---|
| 1 | **Supabase** | ✅ (ya tienes cuenta) | ⚡ Antigravity lo hace | ⚡ Antigravity lo hace | [Guide](../docs/guides/SUPABASE-SETUP-FOR-BEGINNERS.md) |
| 2 | **Hotmart** | ✅ | ⬜ (webhook secret — después) | ⬜ | [Guide](../docs/guides/HOTMART-SETUP-FOR-BEGINNERS.md) |
| 3 | **Resend** | ✅ | ✅ `re_CVe6...` | ✅ `.env` | [Guide](../docs/guides/RESEND-SETUP-FOR-BEGINNERS.md) |
| 4 | **Cloudflare** | ⬜ | — (no API key needed) | — | [Guide](../docs/guides/CLOUDFLARE-SETUP-FOR-BEGINNERS.md) |
| 5 | **Facebook Business Manager** | ⬜ | ⬜ (Pixel ID) | ⬜ | [Guide](../docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md) |
| 6 | **ElevenLabs** | ⬜ | ⬜ | — (used externally) | [Audio strategy](../docs/strategy/09-audio-strategy.md) |
| 7 | **GitHub** (if using Cloudflare Pages) | ⬜ | — | — | — |

## Credential storage

| Variable | Value | Source | Where to paste |
|---|---|---|---|
| `VITE_SUPABASE_URL` | ✅ `https://mtobgwfknefjlpoxznqx.supabase.co` | Antigravity (done) | `.env` ✅ |
| `VITE_SUPABASE_ANON_KEY` | ✅ `eyJhbG...ExBLk` | Antigravity (done) | `.env` ✅ |
| `VITE_FB_PIXEL_ID` | ⬜ Pendiente | Facebook → Events Manager → Pixel | `.env` |
| `VITE_APP_URL` | ⬜ Pendiente | Your domain | `.env` |
| `HOTMART_WEBHOOK_SECRET` | ⬜ Pendiente | Hotmart → Tools → Webhooks | Supabase Edge Function env |
| `RESEND_API_KEY` | ⬜ Pendiente | Resend → API Keys | Supabase Edge Function env |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚡ Antigravity lo configura | Supabase → Settings → API | Supabase Edge Function env |

## Domains

| Domain | Purchased | Configured | Status |
|---|---|---|---|
| Main domain (e.g., englishforwork.com) | ⬜ | ⬜ | ⬜ |

## ⚠️ Security reminders

- ❌ NEVER paste API keys in code files that get committed to GitHub
- ❌ NEVER share the `.env` file
- ❌ NEVER share the `SUPABASE_SERVICE_ROLE_KEY` publicly
- ✅ Use `.env` for local development
- ✅ Use Cloudflare Pages environment variables for production
- ✅ Use Supabase Edge Function environment variables for server-side secrets
