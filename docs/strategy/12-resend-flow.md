# Resend Email Flow — English for Work

> Source: `00-master-prd.md` Section 19

---

## Overview

Resend sends transactional emails triggered by user actions and scheduled checks.

---

## Email types

| # | Email | Trigger | Day | Purpose |
|---|---|---|---|---|
| 1 | Welcome | Hotmart purchase or beta access | 0 | Activation — how to access |
| 2 | First lesson | Scheduled check | 1 | Get user to first lesson |
| 3 | Re-engagement | Scheduled check | 3 | Bring user back with useful content |
| 4 | Progress update | Scheduled check | 5 | Show progress + ask for testimonial |
| 5 | Retention | Scheduled check | 7 | Remind permanent access, encourage continuation |

---

## Email content

### Email 1: Welcome (Day 0)

- **Subject:** ¡Bienvenido/a! Tu acceso a {brand_name} está listo
- **Content:**
  - Greeting with user's name
  - Login credentials (email + temporary password if new user)
  - Link to the app
  - "Recomendamos empezar por: [recommended route]"
  - Quick overview: "3 rutas, 36 lecciones, 12 simulaciones"
  - WhatsApp support link

### Email 2: First lesson (Day 1)

- **Subject:** Empieza por aquí — tu primera lección te espera
- **Content:**
  - "¿Ya entraste a {brand_name}?"
  - Direct link to recommended first lesson
  - Preview of what they'll learn
  - "Solo te tomará 10 minutos"

### Email 3: Re-engagement (Day 3)

- **Subject:** ¿Ya practicaste esta frase? La vas a necesitar
- **Content:**
  - One highlighted phrase from the content
  - "Esta es una de las frases más importantes para [specific situation]"
  - Link to the lesson that teaches it
  - Encourage continuity

### Email 4: Progress update (Day 5)

- **Subject:** Mira cuánto has avanzado 📊
- **Content:**
  - Summary of lessons completed
  - Encouragement based on progress
  - **Secondary CTA:** "¿Qué te ha parecido {brand_name}? Tu opinión nos ayuda a mejorar."
  - Link to in-app testimonial form

### Email 5: Retention (Day 7)

- **Subject:** Recuerda: tu acceso es para siempre
- **Content:**
  - "Tu acceso a {brand_name} es de por vida — sin límite de tiempo"
  - Highlight content they haven't explored yet
  - "¿Tienes preguntas? Escríbenos por WhatsApp"
  - Gentle positive close

---

## Resend setup

### Account requirements
- Plan: Free (100 emails/day) — sufficient for V1 scale
- Upgrade to Pro ($20/mo) when we exceed 100 emails/day

### Domain verification
- Add DNS records (SPF, DKIM) to domain in Cloudflare
- This ensures emails don't go to spam

### API integration
```
POST https://api.resend.com/emails
Headers: Authorization: Bearer {RESEND_API_KEY}
Body: {
  "from": "English for Work <hola@englishforwork.com>",
  "to": "user@example.com",
  "subject": "¡Bienvenido/a! Tu acceso está listo",
  "html": "<html>...</html>"
}
```

---

## Email delivery via Edge Function

### Welcome email (triggered by webhook)
```
Hotmart webhook → hotmart-webhook Edge Function → calls Resend API → email sent → logged in email_log
```

### Follow-up emails (scheduled)
```
Cron (every 6 hours) → check-email-schedule Edge Function → 
  queries users needing emails → sends via Resend → logged in email_log
```

### Email scheduling logic
```
For each user with access_type IN ('paid', 'beta', 'unlimited'):
  - Check email_log: which emails have been sent?
  - Calculate days since registration
  - IF day >= 1 AND email_2 not sent → send email 2
  - IF day >= 3 AND email_3 not sent → send email 3
  - IF day >= 5 AND email_4 not sent → send email 4
  - IF day >= 7 AND email_5 not sent → send email 5
```

---

## Email templates (HTML)

All emails share:
- Brand name and logo from `config/brand.json`
- Consistent color scheme
- Mobile-responsive design
- Unsubscribe link in footer
- WhatsApp support link

Template system:
- Templates stored as HTML strings in Edge Function
- Brand values injected dynamically
- User name and progress injected per email

---

## Monitoring

| What to check | Where |
|---|---|
| Email delivery rate | Resend dashboard |
| Bounce rate | Resend dashboard |
| Open rate | Resend analytics (if enabled) |
| Spam complaints | Resend dashboard |
| Email log completeness | `email_log` table in Supabase |
