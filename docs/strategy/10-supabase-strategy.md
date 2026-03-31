# Supabase Strategy — English for Work

> Source: `00-master-prd.md` Sections 17-18

---

## Supabase services used

| Service | Purpose |
|---|---|
| **Auth** | Email/password registration and login |
| **Database** | PostgreSQL — users, lessons, progress, testimonials, beta invites |
| **Storage** | Audio files (MP3), images |
| **Edge Functions** | Hotmart webhook, email triggers |
| **Row Level Security** | Protect data — users can only see their own progress |

---

## Project setup

| Setting | Value |
|---|---|
| **Plan** | Nano (free) |
| **Region** | `us-east-1` or `sa-east-1` (closest to LATAM users) |
| **Project name** | `english-for-work` |
| **Organization** | To be confirmed with operator |

---

## Auth configuration

| Setting | Value |
|---|---|
| **Provider** | Email/password only |
| **Email confirmation** | Disabled (for faster onboarding — user already paid) |
| **Password min length** | 6 characters |
| **Session duration** | 7 days |
| **JWT expiry** | 3600 seconds (1 hour) |
| **Refresh token** | Enabled (automatic refresh) |

### Auth flow

```
Registration:
1. User pays on Hotmart
2. Hotmart webhook → Edge Function → creates auth user + profile
3. Welcome email sent with login credentials
4. User goes to /login → enters credentials → session created

Beta registration:
1. Admin generates invite link (/register?beta=TOKEN)
2. User clicks link → registration form with auto-populated beta token
3. On registration → access_type set to 'beta'
4. User redirected to /welcome (onboarding)

Login:
1. User enters email + password
2. Supabase Auth validates → returns session + JWT
3. App checks access_type:
   - 'none' → show "Your access is not yet active" page
   - 'beta', 'paid', 'unlimited' → redirect to /app
4. Session persists (7 days)
```

---

## Storage configuration

### Buckets

| Bucket | Purpose | Public | Max file size |
|---|---|---|---|
| `audio` | Audio MP3 files | Yes (public URLs for playback) | 5MB |
| `images` | App images, user avatars | Yes | 2MB |

### Audio folder structure in storage

```
audio/
├── r1/
│   ├── m1/
│   │   ├── r1-m1-l1-phrase-01.mp3
│   │   ├── r1-m1-l1-phrase-02.mp3
│   │   └── ...
│   ├── m2/
│   └── m3/
├── r2/
└── r3/
```

---

## Edge Functions

### 1. `hotmart-webhook`
- **Trigger:** POST from Hotmart when purchase completes
- **Action:** Creates user account (or updates access_type to 'paid'), triggers welcome email
- **Security:** Verify Hotmart webhook signature
- **Environment variables:** `HOTMART_WEBHOOK_SECRET`, `RESEND_API_KEY`

### 2. `send-email`
- **Trigger:** Called by other functions or scheduled
- **Action:** Sends email via Resend API
- **Templates:** Welcome, day 1, day 3, day 5, day 7
- **Security:** Internal only (called by webhook function)

### 3. `check-email-schedule`
- **Trigger:** Cron/scheduled (every 6 hours)
- **Action:** Checks which users need follow-up emails, sends them
- **Logic:** Queries users by registration date, checks email_log for sent emails

---

## Database overview

Full schema in `database/schema.sql`. Summary:

| Table | Purpose | Rows (estimated at scale) |
|---|---|---|
| `profiles` | User profile + access type + admin flag | 500-5000 |
| `routes` | 3 learning routes | 3 |
| `modules` | 9 modules (3 per route) | 9 |
| `lessons` | 36 lessons (4 per module) | 36 |
| `simulations` | 12 simulations | 12 |
| `user_progress` | Lesson completion tracking | ~18,000 |
| `testimonials` | User reviews + approval status | ~200 |
| `beta_invites` | Beta access tokens | ~50 |
| `email_log` | Track sent emails | ~2,500 |

---

## Performance considerations

| Concern | Mitigation |
|---|---|
| Audio file loading | Use public bucket URLs + CDN, lazy load |
| Database queries | Index on user_id, lesson_id, created_at |
| Edge Function cold starts | Keep functions lightweight, use Deno standard library |
| Free tier limits | Nano plan: 500MB DB, 1GB storage, 500K edge function invocations — sufficient for V1 |
| Connection pooling | Use Supabase client library (handles this automatically) |

---

## Monitoring

| What to monitor | How |
|---|---|
| Auth failures | Supabase Auth logs |
| Webhook failures | Edge Function logs |
| Database size | Supabase dashboard |
| Storage usage | Supabase dashboard |
| Active users | Custom query on profiles table |
