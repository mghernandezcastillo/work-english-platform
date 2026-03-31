# Cloudflare Deployment — English for Work

---

## Hosting: Cloudflare Pages

| Feature | Value |
|---|---|
| **Service** | Cloudflare Pages |
| **Plan** | Free |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **Framework** | Vite + React |
| **Deployment** | Git push to main branch → auto deploy |

---

## Setup steps

1. Create Cloudflare account
2. Go to Workers & Pages → Create → Pages
3. Connect GitHub/Git repository
4. Configure build:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: add all from `.env`
5. Deploy

---

## Domain configuration

### Option A: Custom domain (recommended)
1. Buy domain (e.g., `englishforwork.com`)
2. Add domain to Cloudflare
3. Point nameservers to Cloudflare
4. In Cloudflare Pages → Custom domains → Add `englishforwork.com`
5. SSL certificate auto-generated

### Option B: Free subdomain
- Use `englishforwork.pages.dev` (free, auto-configured)
- Good for testing, not ideal for ads (looks less professional)

---

## DNS records (if custom domain)

| Type | Name | Value | Purpose |
|---|---|---|---|
| CNAME | `@` | `englishforwork.pages.dev` | Root domain |
| CNAME | `www` | `englishforwork.pages.dev` | www redirect |
| TXT | `@` | SPF record for Resend | Email delivery |
| CNAME | `resend._domainkey` | Resend DKIM value | Email authentication |

---

## Environment variables in Cloudflare

Add these in Cloudflare Pages → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_FB_PIXEL_ID=123456789
VITE_APP_URL=https://englishforwork.com
```

> **Note:** Do NOT add server-side secrets here (like RESEND_API_KEY). Those go in Supabase Edge Function environment variables.

---

## Deployment workflow

```
Developer pushes to main branch
    ↓
Cloudflare Pages detects change
    ↓
Runs: npm install → npm run build
    ↓
Deploys dist/ to global CDN
    ↓
Available at custom domain (< 1 minute)
```

### Preview deployments
- Every branch push creates a preview URL
- Useful for testing before merging to main
- Format: `{branch-name}.englishforwork.pages.dev`

---

## SPA routing

For Vite React SPA, add a `_redirects` file in `public/`:

```
/* /index.html 200
```

This ensures all routes (like `/app/lesson/123`) are handled by the React router, not returned as 404.

---

## Performance

Cloudflare Pages provides:
- Global CDN (300+ edge nodes)
- Automatic HTTPS
- HTTP/3 support
- Brotli compression
- No cold starts (static hosting)

Expected performance: < 500ms TTFB worldwide, < 2s full page load on 3G.
