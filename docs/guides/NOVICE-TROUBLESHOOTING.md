# 🔧 Troubleshooting para Novatos — English for Work

> Si algo falla, busca tu problema aquí.

---

## La app no se abre en el navegador

**Síntoma:** Escribes `localhost:5173` y no carga nada.

**Soluciones:**
1. ¿Ejecutaste `npm run dev`? Debe estar corriendo en la terminal.
2. ¿Ves errores en la terminal? Copia el error y dáselo a Antigravity.
3. ¿Instalaste las dependencias? Ejecuta `npm install` primero.

---

## Error: "VITE_SUPABASE_URL is undefined"

**Causa:** El archivo `.env` no existe o no tiene los valores correctos.

**Solución:**
1. Verifica que `.env` existe en la raíz del proyecto
2. Verifica que tiene `VITE_SUPABASE_URL=https://tu-proyecto.supabase.co`
3. Reinicia el servidor: cierra la terminal y ejecuta `npm run dev` de nuevo

---

## No puedo hacer login / "Invalid credentials"

**Soluciones:**
1. ¿Creaste una cuenta primero? Ve a `/register`
2. ¿Escribiste bien email y contraseña?
3. Verifica en Supabase Dashboard → Auth → Users que el usuario existe
4. Si el usuario existe pero no puede entrar, revisa que `access_type` no sea `none`

---

## Hice una compra de prueba pero el usuario no se creó

**Causa:** El webhook de Hotmart no llegó a la Edge Function.

**Soluciones:**
1. Ve a Hotmart → Tools → Webhooks → verifica que la URL es correcta
2. Ve a Supabase → Edge Functions → Logs → busca errores
3. Verifica que `HOTMART_WEBHOOK_SECRET` está configurado en las variables de la Edge Function
4. Prueba enviar el webhook manualmente desde Hotmart

---

## Los emails no llegan

**Soluciones:**
1. ¿Configuraste Resend API Key en las variables de Edge Function?
2. Ve a Resend Dashboard → verifica que el email fue enviado
3. Revisa la carpeta de spam del destinatario
4. ¿Configuraste SPF y DKIM en Cloudflare DNS? Los emails sin esto van a spam.

---

## El audio no se reproduce en el celular

**Soluciones:**
1. ¿Los archivos de audio están subidos a Supabase Storage?
2. ¿El bucket `audio` está configurado como público?
3. En iOS Safari, el audio requiere que el usuario toque play (no autoplay)
4. Verifica la URL del audio en las herramientas de desarrollo del navegador

---

## La landing page carga lento

**Soluciones:**
1. ¿Las imágenes están optimizadas? Deben ser < 200KB cada una
2. ¿Estás cargando audio en la landing? No deberías — solo en la app
3. Ejecuta un test de velocidad: [PageSpeed Insights](https://pagespeed.web.dev/)
4. Si usas Cloudflare Pages, debería ser rápido por defecto

---

## Los testimonios no aparecen en la landing page

**Soluciones:**
1. ¿Hay testimonios aprobados en Admin → Testimonials?
2. ¿Los testimonios tienen `show_on_landing = true`?
3. ¿La sección de testimonios en la landing está conectada a Supabase?
4. Verifica en las herramientas de desarrollo del navegador si hay errores de red

---

## Facebook Pixel no funciona

**Soluciones:**
1. Instala [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/) extensión de Chrome
2. Visita tu landing page con la extensión activa
3. Verifica que `VITE_FB_PIXEL_ID` está en `.env` y es correcto
4. Ve a Facebook Events Manager → verifica si llegan eventos

---

## "Rate limit exceeded" en Supabase

**Causa:** Demasiadas peticiones en poco tiempo (plan gratuito tiene límites).

**Solución:** Espera unos minutos y vuelve a intentar. Si persiste, considera hacer las queries más eficientes.

---

## Para cualquier otro problema

1. Copia el mensaje de error exacto
2. Anota qué estabas haciendo cuando pasó
3. Dáselo a Antigravity:
   ```
   Tengo un error en el proyecto work-english-platform.
   Error: [pegar error]
   Estaba haciendo: [describir acción]
   ```
