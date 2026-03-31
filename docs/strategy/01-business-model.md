# Business Model — English for Work

> Source: `00-master-prd.md` Section 5-6

---

## Model type

**Direct-response single purchase** via Facebook Ads → Landing Page → Hotmart Checkout.

No subscription. No freemium. No free trial. One payment = full access forever.

---

## Revenue funnel

```
Facebook Ad (paid traffic)
    ↓ click (CTR target: ≥ 2%)
Sales Landing Page
    ↓ click CTA (target: ≥ 15%)
Hotmart Checkout
    ↓ purchase (target: ≥ 30% of checkout visitors)
Webhook fires → Supabase creates/unlocks user
    ↓
Welcome email sent
    ↓
User accesses app (full content)
    ↓
5-email retention sequence (days 0-7)
    ↓
Testimonial capture (after module/route completion)
```

---

## Pricing

| Variant | Price (COP) | ~USD | Purpose | Hotmart product |
|---|---|---|---|---|
| **Primary** | 47,000 | ~$11 | Main price — balanced value | Create first |
| Test A | 37,000 | ~$9 | Volume test | Separate Hotmart product variant |
| Test B | 57,000 | ~$13 | Margin test | Separate Hotmart product variant |
| Test C | 67,000 | ~$16 | Ceiling test | Separate Hotmart product variant |

> **How to test prices:** Create different Hotmart checkout links for each price. Each landing page variant can point to a different checkout link. Measure which converts best.

---

## Unit economics (at 47,000 COP)

| Metric | Value |
|---|---|
| Sale price | 47,000 COP |
| Hotmart commission (~10%) | -4,700 COP |
| Net revenue per sale | 42,300 COP |
| Target CPA (ad cost per acquisition) | ≤ 18,000 COP |
| **Net profit per sale** | **~24,300 COP (~$5.70 USD)** |
| Break-even daily ad spend | ~180,000 COP at 10 sales/day |

---

## Month 1 targets

| Metric | Target |
|---|---|
| Daily sales | 10–17 |
| Monthly sales | 300–500 |
| Monthly revenue (gross) | 14M–23.5M COP |
| Monthly ad spend | 5.4M–10.8M COP |
| Monthly profit (target) | 7M–12M COP |
| ROAS | ≥ 2.5x |

---

## Payment processor: Hotmart

### Why Hotmart

- Native to LATAM — handles COP, MXN, PEN, CLP, ARS, USD
- Accepts local payment methods (PSE, Nequi, OXXO, transferencia)
- Built-in 7-day money-back guarantee
- Webhook API for automatic app unlock
- Affiliate program built-in (future growth)
- No monthly fee — commission only

### Hotmart product setup (see detailed guide)

1. Create a "Digital Product" in Hotmart
2. Set price to 47,000 COP
3. Enable 7-day guarantee
4. Configure webhook URL → Supabase Edge Function
5. Generate checkout link
6. Place checkout link in landing pages

---

## Access types

| Type | How granted | Duration | Purpose |
|---|---|---|---|
| `none` | Default on registration | — | User registered but hasn't paid |
| `beta` | Admin generates invite link | Until admin revokes | Pre-launch testers |
| `paid` | Hotmart webhook | Permanent | Paying customers |
| `unlimited` | Admin sets manually | Permanent | Special access (partners, collaborators) |

---

## Future monetization (NOT in V1)

1. **Upsell routes** — English for Tech, English for Sales (~$15-20 USD each)
2. **Live practice sessions** — Group Zoom sessions with a tutor (~$10/session)
3. **Subscription tier** — Monthly access to updated content ($5-7/month)
4. **Hotmart affiliates** — Commission to affiliates who sell for you (20-30%)
5. **Corporate licenses** — Team packages for companies ($50-100/team)

---

## Key financial decisions

| Decision | Choice | Reason |
|---|---|---|
| Payment model | Single purchase | Lower friction, faster ROI |
| Platform | Hotmart | Native LATAM, local payments |
| Starting price | 47,000 COP | Sweet spot: affordable but not cheap |
| Price testing | 4 variants | Data-driven optimization |
| Guarantee | 7 days | Hotmart default, builds trust |
| Refund target | ≤ 5% | Premium product quality |
