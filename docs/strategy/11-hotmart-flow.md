# Hotmart Payment Flow — English for Work

> Source: `00-master-prd.md` Sections 5, 17

---

## Overview

```
User clicks CTA on landing page
    ↓
Redirected to Hotmart checkout page
    ↓
User enters payment info (credit card, PSE, Nequi, OXXO, etc.)
    ↓
Hotmart processes payment
    ↓
Hotmart sends webhook to our Edge Function
    ↓
Edge Function creates user account (or updates access_type)
    ↓
Edge Function triggers welcome email via Resend
    ↓
User receives email with login instructions
    ↓
User goes to app → logs in → full access
```

---

## Hotmart product setup

### Product type: Digital product

| Setting | Value |
|---|---|
| Product name | English for Work (or current brand name) |
| Product type | Digital product |
| Category | Education > Languages |
| Price | 47,000 COP (primary) |
| Currency | COP |
| Guarantee | 7 days |
| Delivery | Via email (login instructions) |
| Checkout page | Default Hotmart (customizable) |

### Price variants (for testing)

Create separate offers/checkout links for each price:
- Offer 1: 37,000 COP → Checkout link A
- Offer 2: 47,000 COP → Checkout link B (primary)
- Offer 3: 57,000 COP → Checkout link C
- Offer 4: 67,000 COP → Checkout link D

Each landing page variant points to a specific checkout link.

---

## Webhook configuration

### Setup in Hotmart

1. Go to Hotmart Dashboard → Tools → Webhooks
2. Add webhook URL: `https://{SUPABASE_PROJECT_ID}.supabase.co/functions/v1/hotmart-webhook`
3. Select events: `PURCHASE_COMPLETE`, `PURCHASE_REFUND`
4. Copy webhook secret → add to `.env` as `HOTMART_WEBHOOK_SECRET`

### Webhook payload (PURCHASE_COMPLETE)

Key fields we use from Hotmart's webhook:

```json
{
  "event": "PURCHASE_COMPLETE",
  "data": {
    "buyer": {
      "email": "user@example.com",
      "name": "Carlos Pérez"
    },
    "purchase": {
      "transaction": "HP12345678",
      "price": {
        "value": 47000,
        "currency_code": "COP"
      },
      "offer": {
        "code": "offer123"
      }
    }
  }
}
```

### Edge Function logic (hotmart-webhook)

```
1. Receive POST request
2. Verify webhook signature (HMAC)
3. Parse event type:
   
   IF event = "PURCHASE_COMPLETE":
     a. Extract buyer email and name
     b. Check if user already exists in auth
     c. IF exists: update access_type to 'paid', store transaction_id
     d. IF not exists: create auth user with random password
     e. Update profile: access_type = 'paid', hotmart_transaction_id = transaction
     f. Send welcome email via Resend (includes temp password if new user)
     g. Log email in email_log
     h. Return 200 OK
   
   IF event = "PURCHASE_REFUND":
     a. Find user by transaction_id
     b. Set access_type to 'none'
     c. Return 200 OK
   
   ELSE:
     Return 200 OK (acknowledge but ignore)
```

---

## Checkout link placement

Each landing page CTA button links to a Hotmart checkout URL:

```
https://pay.hotmart.com/PRODUCT_ID?checkoutMode=10&email=&name=

Parameters:
- checkoutMode=10: simplified checkout
- email: can be pre-filled if available
- name: can be pre-filled if available
- src: UTM source tracking
```

### UTM tracking

Add UTM parameters to track which landing/ad drove the sale:

```
https://pay.hotmart.com/PRODUCT_ID?src=lp1-ingles-trabajo&sck=fb-ad-s1
```

| Parameter | Purpose |
|---|---|
| `src` | Landing page identifier (e.g., `lp1-ingles-trabajo`) |
| `sck` | Ad identifier (e.g., `fb-ad-s1`) |

These appear in Hotmart analytics, so you can see which landing + ad combo converts best.

---

## Refund handling

| Event | Action |
|---|---|
| User requests refund via Hotmart | Hotmart processes automatically (within 7 days) |
| Hotmart sends `PURCHASE_REFUND` webhook | Edge Function sets `access_type = 'none'` |
| User tries to access app | Sees "Your access is not active" message |
| User progress data | Preserved (in case they re-purchase) |

---

## Payment methods supported by Hotmart (LATAM)

| Country | Methods |
|---|---|
| 🇨🇴 Colombia | Credit card, PSE, Nequi, Efecty, Baloto |
| 🇲🇽 México | Credit card, OXXO, SPEI |
| 🇵🇪 Peru | Credit card, PagoEfectivo |
| 🇪🇨 Ecuador | Credit card |
| 🇨🇱 Chile | Credit card, Webpay |
| 🇦🇷 Argentina | Credit card, Mercado Pago |

This is handled entirely by Hotmart — no additional configuration needed.

---

## Testing the payment flow

### Before launch (test mode)

1. Enable Hotmart sandbox/test mode
2. Use test credit card numbers provided by Hotmart
3. Verify:
   - Webhook fires correctly
   - User account is created
   - Access type is set to 'paid'
   - Welcome email is sent
   - User can log in and access content
4. Test refund flow:
   - Process test refund
   - Verify access_type reverts to 'none'

### After launch (real mode)

1. Make a real purchase with your own card
2. Wait for webhook
3. Verify full flow
4. Process refund (within 7 days)
5. Verify refund flow
6. Confirm all works → launch ads
