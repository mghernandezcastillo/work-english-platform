# 📘 Resend Setup para Principiantes — English for Work

---

## Qué es Resend

Resend es el servicio que envía emails automáticos a tus usuarios (bienvenida, follow-ups, etc.).

---

## Paso 1: Crear cuenta

1. Ve a [resend.com](https://resend.com)
2. Haz clic en "Sign up"
3. Registrate con GitHub o email
4. Plan gratuito: 100 emails/día — suficiente para empezar

---

## Paso 2: Obtener API Key

1. En el dashboard → API Keys (menú lateral)
2. Haz clic en "Create API Key"
3. **Nombre:** "English for Work Production"
4. **Permission:** "Sending access"
5. Copia la API key que empieza con `re_`
6. Guárdala en un lugar seguro — solo la verás una vez

**Dónde pegarla:** En Supabase → Edge Functions → Secrets → `RESEND_API_KEY`

---

## Paso 3: Verificar dominio (recomendado)

Para que tus emails no vayan a spam, necesitas verificar tu dominio.

1. En Resend → Domains → "Add domain"
2. Ingresa tu dominio (ej: `englishforwork.com`)
3. Resend te dará registros DNS para agregar
4. Ve a Cloudflare → DNS → agrega los registros:
   - Un registro **TXT** (para SPF)
   - Un registro **CNAME** (para DKIM)
5. Vuelve a Resend → haz clic en "Verify"
6. Espera unos minutos (puede tardar hasta 24 horas)

### Sin dominio propio
Si aún no tienes dominio, puedes usar `onboarding@resend.dev` como remitente temporal. Pero los emails podrían ir a spam.

---

## Paso 4: Probar envío

1. En Resend dashboard → Emails → "Send test email"
2. Envía un email a tu propio correo
3. Verifica que llega (revisa spam también)

---

## Dónde pegar cada valor

| Valor | Dónde lo encuentras | Dónde lo pegas |
|---|---|---|
| API Key | Resend → API Keys | Supabase → Edge Functions → Secrets → `RESEND_API_KEY` |
| Dominio verificado | Resend → Domains | Configura los DNS en Cloudflare |
