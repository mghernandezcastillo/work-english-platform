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

### ⚠️ Si aparece: "Se necesita información de la cuenta"

Es normal la primera vez. Facebook necesita datos de facturación antes de permitirte publicar.

1. Clic en **"Ir a Resumen de la cuenta"**
2. Completa lo que te pida:
   - **País:** Colombia
   - **Moneda:** COP (Peso colombiano)
   - **Zona horaria:** (GMT-5) Bogotá
   - **Método de pago:** Agrega tu tarjeta de débito o crédito (Visa/Mastercard)
3. Guarda y vuelve a hacer clic en **"+ Crear"**

> 💡 Si no quieres completar esto ahora, puedes saltarlo haciendo clic fuera del aviso — pero **no podrás publicar el anuncio** hasta que lo completes. Es mejor hacerlo de una vez.

### Pantalla: "Elige un tipo de compra"

Te aparece un menú desplegable con dos opciones:

| Opción | Qué es | ¿Cuál elegir? |
|--------|--------|--------------|
| **Subasta** | Compra en tiempo real con pujas rentables. Facebook compite por mostrarte al público más barato. | ✅ **ESTA — déjala seleccionada** |
| **Reserva** | Compra con antelación para resultados predecibles. Es para presupuestos de millones. | ❌ No tocar — es para grandes empresas |

**Deja `Subasta` seleccionada** (ya viene por defecto).

### Pantalla: "Elige un objetivo de campaña"

Debajo del tipo de compra verás una lista de objetivos. Elige:

| Objetivo | ¿Elegir? | Por qué |
|----------|----------|---------|
| Reconocimiento | ❌ No | Solo muestra tu anuncio, no genera clics |
| **Tráfico** | ✅ **SÍ — Elige este** | Envía personas a tu landing page donde pueden comprar |
| Interacción | ❌ No | Solo genera likes y comentarios, no ventas |
| Clientes potenciales | ❌ No | Recolecta emails dentro de Facebook, no necesitamos eso |
| Promoción de la app | ❌ No | Es para apps en App Store/Play Store |
| Ventas | ❌ No (por ahora) | El Pixel necesita +50 conversiones/semana para funcionar bien. Al inicio no tendremos eso |

> ⚠️ **"Ventas" suena tentador pero NO la elijas todavía.** Facebook necesita al menos 50 compras por semana para optimizar anuncios de ventas. Con $15.000/día no vas a llegar a eso al inicio. Empieza con **"Tráfico"** — envía gente a la landing donde tu copy y precio hacen el trabajo.

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

Al hacer clic en "Siguiente" entras a la pantalla del **conjunto de anuncios**. Esta pantalla es larga — tiene varias secciones que aparecen una debajo de otra al hacer scroll. Aquí va cada sección en orden:

---

### 3.1 — Nombre del conjunto de anuncios

En el campo de texto arriba, escribe:

```
Colombia 22-45 empleo inglés
```

---

### 3.2 — Conversión

Esta es la **primera sección visible**. Aquí defines a dónde quieres enviar a las personas que hagan clic en tu anuncio.

| Campo | Qué elegir |
|-------|-----------|
| **Ubicación de la conversión** | 🔘 **Sitio web** — "Envía el tráfico a tu sitio web" |

> ⚠️ **NO elijas "Destinos de mensajes"** ni ninguna otra opción. Nuestro flujo de ventas es: **Anuncio → Landing Page → Hotmart Checkout**. Queremos que la gente llegue a la landing page `englishforworkapp.com/ingles-para-trabajo` donde ven el precio, los beneficios y el botón de compra que los lleva a Hotmart.

| Campo | Qué elegir |
|-------|-----------|
| **Objetivo de rendimiento** | `Maximizar el número de visitas a la página de destino` |
| **Pixel** | Si aparece, selecciona **"English for Work"**. Si no aparece, no te preocupes — el Pixel ya está instalado en el sitio y va a funcionar |

> ⚠️ Verás dos opciones de rendimiento: "clics en el enlace" y "visitas a la página de destino". **Elige visitas a la página** — esto hace que Facebook solo cuente cuando la landing page carga completamente (el Pixel se dispara). Con "clics en el enlace" Facebook cuenta hasta clics accidentales o de personas con mala conexión que nunca ven tu oferta. Con $15.000/día, necesitamos que cada peso lleve a alguien que realmente vea la landing y el botón de Hotmart.

Debajo del objetivo de rendimiento aparecen estos campos adicionales:

| Campo | Qué hacer |
|-------|-----------|
| **Objetivo de costo por resultado** | ❌ **Déjalo vacío** (el campo que dice "X.XXX"). Meta intentará gastar todo el presupuesto para conseguir el mayor número de visitas posible. Si pones un número, Facebook puede dejar de gastar tu presupuesto si el costo por visita supera ese valor |
| **Reglas de valor** | ❌ **No crear** — déjalo como está. Esto es para negocios con múltiples tipos de conversiones de diferente valor. No lo necesitamos |
| **Modelo de atribución** | ✅ Déjalo en **"Estándar"** (ya viene seleccionado) |
| **Contenido dinámico** | ❌ **Déjalo desactivado**. Esto mezcla automáticamente tus textos e imágenes. Nosotros ya tenemos anuncios diseñados específicamente — no queremos que Facebook los reorganice |

---

### 3.3 — Presupuesto y calendario

| Campo | Valor |
|-------|-------|
| **Presupuesto** | Ya debe mostrar: *"Definiste un presupuesto diario de la campaña Advantage+ de $15.000"* (esto se configuró en el Paso 2) |
| **Límites de gasto de conjuntos de anuncios** | ❌ No agregar — déjalo como "Ningún límite agregado" |
| **Fecha de inicio** | Se pone automáticamente (hoy). Déjala así |
| **Fecha de finalización** | ☐ **No marcar** — deja el anuncio corriendo indefinidamente. Tú lo pausas manualmente cuando quieras |

> 💡 Si quieres limitar la prueba a 7 días, marca "Definir una fecha de finalización" y pon la fecha de dentro de una semana.

---

### 3.4 — Controles de público

Esta sección controla **dónde geográficamente** se muestra el anuncio. Aparece primero con una vista simple, pero si haces clic en **"Ocultar opciones"/"Mostrar opciones"** verás más campos:

| Campo | Qué hacer |
|-------|-----------|
| **Lugares** | Debe decir **Colombia**. Si no, haz clic en "Editar" y escribe "Colombia" y selecciónalo |

Si haces clic en **"Mostrar opciones ▼"** (o "Ocultar opciones ▲" si ya está expandido), verás estos campos adicionales:

| Campo | Qué poner |
|-------|-----------|
| **Edad mínima** | Cámbiala a **22** (por defecto dice 18, pero nuestro público objetivo son profesionales de 22+ que ya buscan empleo) |
| **Excluir estos públicos personalizados** | ❌ Déjalo vacío — no tenemos públicos para excluir todavía |
| **Idiomas** | ✅ Déjalo en **"Todos los idiomas"** — no lo restrinjas |

---

### 3.5 — Público Advantage+ ✨

Esta sección aparece justo debajo de los controles de público. Es el sistema moderno de Meta para configurar tu audiencia. Facebook muestra los anuncios a las personas con más probabilidades de visitar tu landing page, usando tus sugerencias como guía.

Vas a ver estos campos:

| Campo | Qué hacer |
|-------|-----------|
| **Incluye estos públicos personalizados** | ❌ Déjalo vacío por ahora. Esto es para audiencias del Pixel o listas de emails — todavía no tenemos suficientes datos |
| **Edad** | Cambia a **22 - 45** (haz clic en el rango y ajústalo). Nuestro público son adultos jóvenes y de mediana edad que buscan mejorar su inglés para el trabajo |
| **Sexo** | ✅ Déjalo en **"Todos los sexos"** |

### Segmentación detallada

En el campo que dice *"Agregar datos demográficos, intereses, comportamientos"*, escribe **exactamente** estos nombres y selecciónalos cuando aparezcan en la lista desplegable. Los nombres son los que usa Facebook internamente (a veces en inglés, a veces traducidos):

#### 🟢 PRIORIDAD ALTA — Agrega estos primero (son los más relevantes para English for Work):

| Escribir en el buscador | Nombre exacto que aparece | Por qué nos sirve |
|------------------------|--------------------------|-------------------|
| `Duolingo` | **Duolingo** | Personas que ya usan apps para aprender idiomas — nuestro público ideal |
| `English language` | **English language** o **Inglés (idioma)** | Personas interesadas en el idioma inglés |
| `English as a second` | **English as a second or foreign language** | Personas aprendiendo inglés como segundo idioma — exactamente nuestro nicho |
| `Job hunting` | **Job hunting** o **Búsqueda de empleo** | Personas buscando trabajo activamente — quieren inglés para conseguir empleo |
| `Career development` | **Career development** o **Desarrollo profesional** | Profesionales que quieren crecer laboralmente |
| `LinkedIn` | **LinkedIn** | Personas con mentalidad profesional que buscan oportunidades |

#### 🟡 PRIORIDAD MEDIA — Agrega estos si los encuentras:

| Escribir en el buscador | Nombre exacto que aparece | Por qué nos sirve |
|------------------------|--------------------------|-------------------|
| `IELTS` | **IELTS** o **International English Language Testing System** | Personas preparando examen de inglés — alto interés |
| `TOEFL` | **TOEFL** | Similar a IELTS — estudiantes de inglés formales |
| `Babbel` | **Babbel** | Otra app de idiomas — público similar a Duolingo |
| `British Council` | **British Council** | Institución de inglés muy conocida en LATAM |
| `Call centre` | **Call centre** o **Call center** | Para la Campaña 3 específicamente — personas en o buscando trabajo en BPOs |

#### 🔵 OPCIONALES — Útiles para ampliar:

| Escribir en el buscador | Nombre exacto que aparece | Notas |
|------------------------|--------------------------|-------|
| `Teleperformance` | **Teleperformance** | BPO grande en Colombia — para Campaña 3 |
| `Concentrix` | **Concentrix** | Otro BPO grande en Colombia |
| `Remote work` | **Remote work** o **Trabajo remoto** | Profesionales que buscan trabajo remoto (muchos requieren inglés) |
| `Coursera` | **Coursera** | Plataforma educativa — personas que invierten en aprendizaje |
| `Udemy` | **Udemy** | Similar a Coursera |

> ⚠️ **IMPORTANTE:** No marques "Categoría especial de anuncios" como "Empleo". Nosotros **NO estamos ofreciendo empleo** — estamos vendiendo un curso de inglés. Si marcas "Empleo" por error, Facebook restringirá tu segmentación y no podrás filtrar por edad ni intereses.

> 💡 **Truco "Sugerencias":** Después de agregar tu primer interés (ej: `Duolingo`), haz clic en el botón **"Explorar"** que aparece al lado del campo de búsqueda. Facebook te mostrará intereses relacionados que puedes agregar con un clic. Esto es muy útil para descubrir intereses que no conocías.

> 💡 Con Advantage+ activado, estos intereses son **sugerencias para el algoritmo**, no filtros estrictos. Facebook puede mostrar tu anuncio a personas fuera de estos intereses si detecta que van a hacer clic en tu landing. Esto es **normal y positivo** — el algoritmo aprende de quién hace clic y optimiza solo.

Por último:

| Campo | Qué hacer |
|-------|-----------|
| **Guardar público** | Clic en **"Guardar público"** → ponle nombre: `Colombia 22-45 empleo inglés` → así lo puedes reutilizar en futuras campañas sin configurar todo de nuevo |

> A la derecha de la pantalla verás un panel que dice **"Definición del público"** con una barra de color. Si dice "Amplio" con la barra en verde, **está perfecto**. Un público amplio le da a Facebook más espacio para encontrar clics baratos con presupuestos de $15.000/día.

---

### 3.6 — Transparencia de anuncios

| Campo | Qué hacer |
|-------|-----------|
| **Iniciar verificación** | ❌ **Opcional** — no es necesario para publicar. Puedes hacerlo después si quieres. Es un proceso de Meta para verificar tu identidad como anunciante. No bloquea la publicación del anuncio |

---

### 3.7 — Ubicaciones (Placements)

| Campo | Qué elegir |
|-------|-----------|
| **Ubicaciones Advantage+** | ✅ **Dejarlo activado** (es la opción por defecto) |

> Facebook decide automáticamente dónde mostrar tu anuncio (Feed, Stories, Reels, etc.) según dónde sea más barato conseguir visitas a tu landing. Es más eficiente que elegir manualmente, especialmente con presupuestos bajos.

---

✅ **¡Eso es todo para el conjunto de anuncios!** Haz clic en **"Siguiente"** para ir al Paso 4 (crear el anuncio).

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
