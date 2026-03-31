# 📘 Facebook Pixel — Guía desde tu cuenta actual

> **Tu situación:** Ya tienes Meta Business Suite con la página "Imperium Intro".
> No tienes que cambiar esa página ni crear una nueva cuenta.
> El Pixel se crea en el **Business Manager**, no en la página.

---

## Lo que vas a hacer ahora (10 minutos)

1. Ir al **Administrador de Eventos** (Events Manager) de tu Business
2. Crear un Pixel nuevo llamado "English for Work"
3. Copiarme el ID que te da (15 números)
4. Yo lo instalo en el código automáticamente

---

## Paso 1 — Ir al Administrador de Eventos

**En la pantalla que tienes abierta de Meta Business Suite:**

Tienes dos opciones para llegar:

**Opción A (más rápida):** Pega directamente esta URL en tu navegador:
```
https://business.facebook.com/events_manager2/list/pixel/
```

**Opción B (desde el menú):**
1. En la barra lateral izquierda, busca **"Administrador de an..."** (Administrador de anuncios)
2. Al abrirlo, busca en el menú el ícono de **"Administrador de eventos"** o **"Events Manager"**
3. También puedes ir a: `https://www.facebook.com/business/tools/ads-manager`
   y luego en el menú de hamburguesa (≡) buscar "Administrador de eventos"

---

## Paso 2 — Crear el Pixel

Una vez en el Administrador de Eventos:

1. Haz clic en el botón verde **"+ Conectar fuentes de datos"** (o "+ Add")
2. En la pantalla que aparece, selecciona **"Web"**
3. Clic en **"Siguiente"** o **"Connect"**
4. Selecciona **"Meta Pixel"** (probablemente ya viene seleccionado)
5. Clic en **"Conectar"**
6. En el campo de nombre escribe: `English for Work`
7. Clic en **"Crear Pixel"** o **"Continue"**
8. Te pregunta cómo instalar — elige **"Instalar código manualmente"** o simplemente cierra esa ventana

---

## Paso 3 — Copiar el Pixel ID

Después de crear el Pixel verás una pantalla con un número de **15-16 dígitos**, así:

```
📊 English for Work
Pixel ID: 1234567890123456
```

**Copia ese número y pégamelo aquí en el chat.**

Eso es todo. Yo hago el resto.

---

## ⚠️ Si ves "No tienes fuentes de datos" o pantalla vacía

Es normal si nunca has creado un Pixel antes. El botón **"+ Conectar fuentes de datos"** aparece en la esquina superior derecha o como botón azul/verde en el centro de la pantalla vacía.

---

## ⚠️ Si te pregunta cuál Business usar

Si tienes más de un Business, selecciona el mismo Business donde está "Imperium Intro" (business_id que termina en `5698371`). El Pixel puede rastrear cualquier web independientemente de qué página de Facebook tengas.

---

## Próximo paso después de darme el ID

Con ese número yo:
1. Lo agrego al `.env` del proyecto
2. Lo subo a Vercel como variable de entorno
3. Hago redeploy automático
4. El Pixel queda activo en todas las páginas del sitio

**Tiempo total después de que me des el ID: 3 minutos.**
