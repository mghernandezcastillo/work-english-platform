# 📖 Guía Completa Paso a Paso — English for Work

> Esta guía te lleva desde cero hasta el lanzamiento.
> Sigue cada paso en orden. No te saltes ninguno.

---

## Paso 1: Lee el plan del proyecto

1. Abre `START-HERE.md` y léelo completo
2. Abre `FILES-EXPLAINED.md` y entiende qué hace cada archivo
3. Abre `docs/strategy/00-master-prd.md` y lee al menos las secciones 1-6

**Resultado esperado:** Entiendes qué es el proyecto, cómo gana dinero, y qué contiene.

---

## Paso 2: Crea las cuentas necesarias

Abre `checklists/credential-checklist.md` y crea cada cuenta:

### 2.1 Supabase
- Ve a [supabase.com](https://supabase.com)
- Crea una cuenta gratuita con tu email
- NO crees un proyecto todavía — Antigravity lo hará
- Lee: `docs/guides/SUPABASE-SETUP-FOR-BEGINNERS.md`

### 2.2 Hotmart
- Ve a [hotmart.com](https://hotmart.com)
- Crea una cuenta como "Productor"
- Necesitarás datos bancarios para recibir pagos
- Lee: `docs/guides/HOTMART-SETUP-FOR-BEGINNERS.md`

### 2.3 Resend
- Ve a [resend.com](https://resend.com)
- Crea una cuenta gratuita
- Obtén tu API Key: Dashboard → API Keys → Create
- Lee: `docs/guides/RESEND-SETUP-FOR-BEGINNERS.md`

### 2.4 Cloudflare
- Ve a [cloudflare.com](https://cloudflare.com)
- Crea una cuenta gratuita
- Lee: `docs/guides/CLOUDFLARE-SETUP-FOR-BEGINNERS.md`

### 2.5 Facebook Business Manager
- Ve a [business.facebook.com](https://business.facebook.com)
- Crea tu Business Manager con tu cuenta personal de Facebook
- Crea un Pixel: Events Manager → Connect data source → Web → Facebook Pixel
- Lee: `docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md`

### 2.6 ElevenLabs (para audio)
- Ve a [elevenlabs.io](https://elevenlabs.io)
- Crea una cuenta
- Plan Starter ($5/mes) es suficiente para empezar

**Resultado esperado:** Tienes todas las cuentas creadas y credenciales anotadas en un lugar seguro.

---

## Paso 3: Configura el archivo .env

1. En la carpeta del proyecto, busca el archivo `.env.example`
2. Cópialo y renómbralo a `.env`
3. Abre `.env` con un editor de texto
4. Llena cada valor con tus credenciales (sigue los comentarios del archivo)
5. Guarda el archivo

**⚠️ IMPORTANTE:** Nunca compartas este archivo. Contiene tus claves secretas.

**Resultado esperado:** Archivo `.env` creado con tus credenciales.

---

## Paso 4: Dile a Antigravity que empiece Fase 1

Abre Antigravity y escribe:

```
Lee START-HERE.md y docs/strategy/00-master-prd.md en el workspace work-english-platform.
Después lee .agents/workflows/execution-phases.md.
Ejecuta la Fase 1: Technical Setup.
```

Antigravity va a:
- Crear el proyecto Supabase
- Aplicar el esquema de base de datos
- Configurar autenticación
- Crear la app base
- Conectar todo

**Resultado esperado:** La app corre en tu navegador localmente.

---

## Paso 5: Aprueba la Fase 1

Antigravity te mostrará que la app está funcionando. Verifica:
- [ ] ¿La app se abre en el navegador?
- [ ] ¿Puedes ver las tablas en Supabase Dashboard?
- [ ] ¿El login/registro funciona?

Si todo está bien, dile: **"Aprobado, continúa a Fase 2"**

---

## Paso 6: Aprueba el diseño (Fase 2)

Antigravity generará 4 opciones de diseño visual. Tú eliges:
- Verás 4 mockups diferentes
- Cada uno tiene una estética distinta
- Elige el que más te guste o el que Antigravity recomiende

Dile: **"Elijo la Dirección [A/B/C/D]"**

---

## Pasos 7-12: Sigue las fases

Cada fase sigue el mismo patrón:
1. Antigravity trabaja
2. Te muestra lo que hizo
3. Tú verificas y apruebas
4. Continúa a la siguiente fase

Los checkpoints están en: `checklists/approval-checkpoints.md`

---

## Paso 13: Beta testing

Antes de lanzar con ads:
1. Antigravity genera links de invitación beta desde el admin
2. Tú los envías por WhatsApp a 10-15 personas de confianza
3. Ellos usan la app y dejan testimonios
4. Tú apruebas los mejores testimonios desde el admin
5. Los testimonios aparecen automáticamente en las landing pages

---

## Paso 14: Crear la campaña de Facebook Ads

Sigue la guía: `docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md`

Resumen:
1. Crea una campaña de Conversiones
2. Crea ad sets con las audiencias definidas
3. Sube los creativos que generó Antigravity
4. Pega el copy de ads
5. Establece presupuesto: $10-20 USD/día
6. NO actives todavía

---

## Paso 15: Lanzamiento

1. Verifica `checklists/launch-readiness-checklist.md`
2. Todo está ✅ → activa los ads
3. Monitorea las primeras horas
4. Sigue `checklists/publishing-checklist.md` para la primera semana

---

**¡Felicidades! Tu producto está en el mercado.** 🚀
