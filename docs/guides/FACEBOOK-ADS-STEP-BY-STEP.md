# 🎯 Guía paso a paso: Crear tu primera campaña en Facebook Ads Manager

> **Situación:** Ya tienes la página de Facebook "English for Work", el Pixel instalado, y los creativos listos en el AdCenter (`/admin/anuncios`). Esta guía te dice exactamente qué elegir en cada pantalla del Ads Manager.

---

## ANTES DE EMPEZAR

1. Abre el **AdCenter** de la app → `/admin/anuncios`
2. Elige la campaña que vas a crear primero (recomendado: **Campaña 1 — Ángulo Dolor**)
3. Ten esa pestaña abierta porque vas a copiar textos desde ahí

---

## PASO 1 — Crear la campaña

Ir a: [https://adsmanager.facebook.com](https://adsmanager.facebook.com)

Clic en **"+ Crear"** (botón verde arriba a la izquierda)

### Pantalla: "Elige un objetivo de campaña"

| Campo | Qué elegir | Por qué |
|-------|-----------|---------|
| **Tipo de compra** | `Subasta` ← ya seleccionado | Es la única opción para presupuestos bajos |
| **Objetivo** | ✅ **Tráfico** | Queremos enviar gente a la landing page. NO elijas "Ventas" porque el Pixel no tiene suficientes datos todavía |

> ⚠️ **NO elijas "Conversiones" ni "Ventas"** para la primera campaña. Facebook necesita al menos 50 conversiones por semana para optimizar. Con $15.000/día no vas a llegar a eso al inicio. **Tráfico** es lo correcto para arrancar.

Clic en **"Continuar"**

---

## PASO 2 — Configurar la campaña

### Pantalla: "Nombre de la campaña"

| Campo | Qué escribir |
|-------|-------------|
| **Nombre de la campaña** | `EW - Dolor - Tráfico - Colombia` |
| **Categorías especiales** | ❌ NO marques ninguna (no es empleo, vivienda, ni crédito) |
| **Presupuesto de campaña Advantage** | ✅ **Activar** → $15.000 COP/día |

> El presupuesto diario de $15.000 COP (~$3.5 USD) es ideal para probar. Facebook distribuye el gasto entre tus anuncios automáticamente.

Clic en **"Siguiente"**

---

## PASO 3 — Configurar el conjunto de anuncios

### Pantalla: "Conjunto de anuncios"

| Campo | Qué elegir |
|-------|-----------|
| **Nombre del conjunto** | `Colombia 22-45 empleo inglés` |
| **Objetivo de rendimiento** | `Maximizar el número de clics en el enlace` |
| **Pixeles y eventos** | Selecciona tu Pixel "English for Work" (si aparece) |

### Sección: Público (Audiencia)

| Campo | Valor |
|-------|-------|
| **Ubicaciones** | `Colombia` (escríbelo y selecciónalo) |
| **Edad** | `22` a `45` |
| **Género** | Todos |
| **Segmentación detallada** | Escribe y agrega estos intereses (los que encuentres): |

Intereses a buscar (agrega todos los que te aparezcan):
- `Duolingo`
- `Aprender inglés`
- `English language`
- `Empleo` o `Búsqueda de empleo`
- `LinkedIn`
- `Call center`
- `Trabajo remoto`

> 💡 No todos van a aparecer exactamente igual. Escribe la palabra y elige la opción más cercana. Con 4-5 intereses es suficiente.

### Sección: Ubicaciones (Placements)

| Opción | Qué elegir |
|--------|-----------|
| **Ubicaciones** | ✅ **Ubicaciones Advantage+** (automáticas) |

> Deja que Facebook decida dónde mostrar el anuncio (Feed, Stories, Reels, etc.). Es más eficiente que elegir manualmente.

Clic en **"Siguiente"**

---

## PASO 4 — Crear el anuncio

### Pantalla: "Anuncio"

Aquí es donde copias todo desde el **AdCenter**.

| Campo | De dónde copiarlo |
|-------|-------------------|
| **Nombre del anuncio** | Del AdCenter: nombre del ad (ej: "Ad 01 — ¿Pierdes trabajos?") |
| **Identidad** | Selecciona tu página: **English for Work** |
| **Formato** | `Imagen o video único` (para imagen única) o `Carousel` (para el carousel) |

### Sección: Creatividad del anuncio

| Campo del Ads Manager | Campo del AdCenter | Acción |
|----------------------|-------------------|--------|
| **Elementos multimedia** | Imagen | Clic "Agregar elementos" → Subir imagen → Sube la imagen que descargaste del AdCenter |
| **Texto principal** | 📝 Texto principal | Clic "Copiar" en AdCenter → Pegar aquí |
| **Título** | 🏷 Título (Headline) | Clic "Copiar" en AdCenter → Pegar aquí |
| **Descripción** | 📄 Descripción | Clic "Copiar" en AdCenter → Pegar aquí |
| **Botón de llamada a la acción** | 🖱 Botón CTA | Selecciona del menú: `Más información` o `Registrarse` (según lo que diga el AdCenter) |
| **URL del sitio web** | 🔗 URL con UTM | Clic "Copiar URL" en AdCenter → Pegar aquí |

> ⚠️ **MUY IMPORTANTE:** La URL debe ser la completa con los parámetros UTM. No la acortes ni la modifiques. Ejemplo:
> ```
> https://work-english-platform.vercel.app/ingles-para-trabajo?utm_source=facebook&utm_medium=cpc&utm_campaign=dolor_frio&utm_content=pain
> ```

### Sección: Seguimiento

| Campo | Qué elegir |
|-------|-----------|
| **Pixel** | Selecciona "English for Work" |
| **Evento de conversión** | `ViewContent` (o déjalo como viene) |

---

## PASO 5 — Publicar

1. Revisa la **vista previa** a la derecha — verifica que se vea bien el texto y la imagen
2. Clic en **"Publicar"** (botón verde abajo a la derecha)
3. Facebook revisa el anuncio (puede tardar 15 min - 24 horas)
4. Te llega notificación cuando se apruebe

---

## 🔄 REPETIR para cada anuncio

Para la Campaña 1, tienes **2 anuncios** (Ad 01 y Ad 03). Puedes:

**Opción A (recomendada):** Dentro de la misma campaña, duplica el conjunto de anuncios y cambia solo el anuncio (textos + imagen).

**Opción B:** En el mismo conjunto de anuncios, agrega un segundo anuncio con "Crear" → nuevo anuncio.

---

## 📋 Orden de activación recomendado

| Semana | Campaña | Presupuesto |
|--------|---------|-------------|
| **Semana 1** | Campaña 1 — Dolor (2 ads) | $15.000/día |
| **Semana 2** | Campaña 2 — Beneficio (1 ad) + Campaña 3 — Call Center (2 ads) | $15.000/día cada una |
| **Semana 3+** | Campaña 4 — Retargeting (solo si ya tienes +500 visitantes en la landing) | $10.000/día |

> La Campaña 4 (retargeting) requiere crear una **Audiencia personalizada** en el Ads Manager:
> - Ir a Audiencias → Crear audiencia → Audiencia personalizada → Sitio web
> - Personas que visitaron: `work-english-platform.vercel.app/ingles-para-trabajo`
> - En los últimos: 30 días

---

## ❓ Problemas comunes

### "Mi anuncio fue rechazado"
- Revisa que la imagen no tenga más del 20% de texto
- Revisa que el texto no haga promesas de ingresos ("gana dinero con inglés")
- Apela si crees que fue un error — a veces el bot de revisión se equivoca

### "No tengo opción de Pixel"
- Ve a Configuración del Business → Fuentes de datos → Conecta tu Pixel al AdCenter
- O simplemente ignora esa sección al inicio — el Pixel ya está instalado en el sitio

### "¿Puedo empezar con menos presupuesto?"
- Sí. Puedes empezar con $8.000-10.000 COP/día. Menos de eso y Facebook no tiene suficiente para optimizar.
