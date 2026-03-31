# 📘 Cloudflare Setup para Principiantes — English for Work

---

## Qué es Cloudflare

Cloudflare Pages es donde tu app vive en internet. Es como un "hosting" pero gratis, rápido, y fácil.

---

## Paso 1: Crear cuenta

1. Ve a [cloudflare.com](https://cloudflare.com)
2. Haz clic en "Sign up"
3. Registrarte con tu email
4. Plan gratuito es suficiente

---

## Paso 2: (Opcional) Comprar dominio

Si quieres un dominio propio (ej: `englishforwork.com`):

1. En Cloudflare → Domain Registration → "Register a domain"
2. Busca tu dominio
3. Cómpralo (Cloudflare ofrece precios al costo, sin markup)
4. Si ya tienes un dominio en otro proveedor, puedes transferirlo a Cloudflare

Si NO quieres comprar dominio, usarás `tu-proyecto.pages.dev` (gratis).

---

## Paso 3: Crear proyecto en Pages

> **Antigravity maneja el deploy.** Pero si necesitas configurar manualmente:

1. Ve a Workers & Pages → Create → Pages
2. Conecta tu repositorio de GitHub (si usas GitHub)
3. Selecciona el repositorio `work-english-platform`
4. Configuración de build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Variables de entorno: agrega las de `.env` (las que empiezan con `VITE_`)
6. Haz clic en "Save and deploy"

---

## Paso 4: Configurar dominio personalizado

Si compraste un dominio:

1. En Cloudflare Pages → tu proyecto → Custom domains
2. Haz clic en "Set up a custom domain"
3. Ingresa tu dominio: `englishforwork.com`
4. Cloudflare configurará los DNS automáticamente
5. Espera unos minutos → "Active" aparecerá

---

## Paso 5: Verificar

1. Ve a tu URL (ej: `https://englishforwork.com` o `tu-proyecto.pages.dev`)
2. La app debería cargar
3. Verifica que HTTPS funciona (candadito verde en el navegador)

---

## Dónde pegar cada valor

| Valor | Dónde lo pegas |
|---|---|
| URL de producción | `.env` → `VITE_APP_URL` y Supabase Auth → Site URL |
| Variables de entorno | Cloudflare Pages → Settings → Environment variables |

---

## ⚠️ Importante

- Cada vez que pusheas código a GitHub, Cloudflare re-deploya automáticamente
- Si no usas GitHub, puedes hacer deploy manual: `npm run build` y subir la carpeta `dist`
- El SSL (HTTPS) es automático y gratuito
