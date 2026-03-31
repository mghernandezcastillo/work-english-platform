# 🔐 Guía: Configurar HOTMART_HOTTOK

**Tiempo estimado:** 5 minutos  
**Para qué sirve:** El HOTTOK es un token secreto que Hotmart envía en cada webhook para verificar que la petición realmente viene de Hotmart (y no de alguien que intenta hacer fraude).

---

## Qué es el HOTTOK

Cuando alguien compra tu producto en Hotmart, Hotmart envía automáticamente una notificación (webhook) a tu servidor con los datos de la compra. El HOTTOK es una clave secreta que Hotmart incluye en esa notificación para que **tu sistema pueda verificar que el mensaje es auténtico**.

Sin HOTTOK → cualquiera podría simular una "compra" y obtener acceso gratis.  
Con HOTTOK → solo procesas compras reales de Hotmart.

---

## Paso 1 — Encontrar tu HOTTOK en Hotmart

1. Ve a tu dashboard de Hotmart: **https://app-vlc.hotmart.com/**
2. En el menú lateral, ve a **Herramientas** → **Webhooks**
3. Si no tienes un webhook creado, créalo:
   - Clic en **"Crear webhook"** o **"+ Nuevo webhook"**
   - **URL de destino:** `https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/hotmart-webhook`
   - **Eventos a escuchar:** Selecciona todos, especialmente:
     - `PURCHASE_APPROVED`
     - `PURCHASE_REFUNDED`
     - `PURCHASE_CANCELLED`
   - Guarda el webhook
4. Una vez creado, busca el campo **"HOTTOK"** o **"Token"** — es una cadena larga de letras y números
5. Cópialo

---

## Paso 2 — Dárselo a Antigravity

Simplemente dime en el chat:

> "Mi HOTTOK es: [pega aquí el token]"

Y lo configuro automáticamente en tu servidor.

---

## Paso 3 — Qué hace Antigravity con él

Lo configuro como secret en tus Edge Functions de Supabase. Tu función `hotmart-webhook` ya está programada para:

1. Recibir la notificación de Hotmart
2. Verificar que el HOTTOK coincide (seguridad)
3. Si es una compra aprobada → actualizar el usuario en la base de datos a `access_type = 'paid'`
4. Enviar email de bienvenida automáticamente

---

## URL del webhook a configurar en Hotmart

```
https://mtobgwfknefjlpoxznqx.supabase.co/functions/v1/hotmart-webhook
```

Pega esta URL exactamente en el campo "URL de destino" de tu webhook de Hotmart.

---

## ⚠️ Importante

- El HOTTOK es como una contraseña — no lo compartas públicamente
- Si lo compartes por error, puedes regenerarlo en Hotmart y dármelo de nuevo
- Sin este token, las compras de Hotmart no se procesarán automáticamente (tendrías que dar acceso manualmente)

---

*Guía creada por Antigravity — 29 Mar 2026*
