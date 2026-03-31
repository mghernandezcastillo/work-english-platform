# Edge Function Secrets — Configurar en Supabase Dashboard

Ve a: https://supabase.com/dashboard/project/mtobgwfknefjlpoxznqx/settings/functions

Agrega estos secrets:

| Secret | Valor |
|--------|-------|
| RESEND_API_KEY | re_CVe6uor2_LBuS4gfLMcVrp9FazcXfDYVk |
| HOTMART_HOTTOK | (el webhook token que generes en Hotmart) |

Funciones desplegadas:
- `hotmart-webhook` — URL: https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/hotmart-webhook
- `send-email` — URL: https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/send-email

## Configurar webhook en Hotmart:
1. Ve a Hotmart → tu producto → Configuración → Webhooks
2. URL: https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/hotmart-webhook
3. Eventos: PURCHASE_COMPLETE, PURCHASE_APPROVED, PURCHASE_REFUNDED, PURCHASE_CANCELED
