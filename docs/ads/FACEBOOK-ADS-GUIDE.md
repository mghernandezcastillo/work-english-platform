# 📢 Guía Completa — Facebook Ads para English for Work

## ¿Dónde está todo lo que necesito?

```
docs/ads/
├── FACEBOOK-ADS-GUIDE.md      ← Esta guía (léela primero)
├── AD-BRIEF-TEMPLATE.md       ← Plantilla para pedir nuevos anuncios a IA
├── ad-manifest.md             ← Copy completo de cada anuncio
└── imagenes/
    ├── 01_dolor_pierdes_trabajos.png
    ├── 02_beneficio_confianza.png
    ├── 03_contraste_gramatica_vs_real.png
    ├── 04_precio_47k.png
    ├── 05_callcenter_listo_trabajar.png
    ├── 06_carousel_ruta1_conseguir_trabajo.png
    ├── 07_carousel_ruta2_entrevistas.png
    ├── 08_carousel_ruta3_callcenter.png
    └── 09_carousel_cta_47k.png
```

---

## ¿Cómo funciona publicar? ¿Desde la Página de Facebook o dónde?

Hay **dos formas**:

| Forma | Dónde | Cuándo usarla |
|-------|-------|---------------|
| **Ads Manager** (recomendada) | adsmanager.facebook.com | Cuando quieres control total: segmentación, presupuesto, A/B test |
| **Boost Post** | facebook.com (tu Página) | Simple y rápido pero con menos control |

→ **Usa Ads Manager.** Es más poderoso y es donde aplicarás el copy y las imágenes de este documento.

---

## Paso a paso — Publicar tu primer anuncio

### Antes de empezar, necesitas:
- ✅ Página de Facebook de "English for Work" creada
- ✅ Cuenta publicitaria activa (business.facebook.com)
- ✅ Método de pago agregado (tarjeta de crédito/débito)
- ✅ Las imágenes de `docs/ads/imagenes/`
- ✅ El copy de `docs/ads/ad-manifest.md`

---

### Paso 1 — Crear la campaña

1. Ve a [adsmanager.facebook.com](https://adsmanager.facebook.com)
2. Clic en **"+ Crear"**
3. Elige el objetivo:
   - **Tráfico** → para que la gente visite tu landing
   - **Clientes potenciales** → si quieres que dejen su email
   - _(Para empezar usa Tráfico)_
4. Nombre de la campaña: `EFW — Dolor — Colombia`
5. Presupuesto de campaña: **$15.000–$20.000 COP/día**
6. Clic en **"Siguiente"**

### Paso 2 — Configurar el Ad Set (audiencia)

1. **Ubicación:** Colombia 🇨🇴
2. **Edad:** 22–45 años
3. **Sexo:** Todos
4. **Idioma:** Español
5. **Intereses** (busca y agrega):
   - Duolingo
   - Aprender inglés
   - Call center
   - Buscar empleo
   - LinkedIn
   - Trabajo remoto
6. **Ubicaciones de los anuncios:** Selecciona "Advantage+ Placements" (automático)
7. Clic en **"Siguiente"**

### Paso 3 — Crear el anuncio

1. **Identidad:** selecciona tu Página de Facebook "English for Work"
2. **Formato:** Imagen única
3. **Subir imagen:** escoge una de `docs/ads/imagenes/` (empieza con `01_dolor...`)
4. **Texto principal:** copia el texto del `ad-manifest.md` para ese anuncio
5. **Título:** copia el "Headline" del manifest
6. **Descripción:** copia la "Description"
7. **Sitio web:** `https://work-english-platform.vercel.app/ingles-para-trabajo?utm_source=facebook&utm_medium=cpc&utm_campaign=dolor_frio&utm_content=pain`
8. **Botón CTA:** "Más información"
9. Clic en **"Publicar"**

---

## Cómo publicar el Carousel (las 3 rutas)

1. En el Paso 3 → **Formato:** selecciona **"Anuncio por secuencia"** (Carousel)
2. Sube las 4 tarjetas en orden:
   - Card 1: `06_carousel_ruta1_conseguir_trabajo.png`
   - Card 2: `07_carousel_ruta2_entrevistas.png`
   - Card 3: `08_carousel_ruta3_callcenter.png`
   - Card 4: `09_carousel_cta_47k.png`
3. Cada card tiene su propio titular (ver manifest)
4. URL de destino: landing con UTM de carousel

---

## Cuánto invertir para empezar

| Campaña | Presupuesto/día | Para qué |
|---------|----------------|----------|
| Dolor (Ad 01) | $15.000 COP | Probar el ángulo de dolor |
| Call Center (Ad 05) | $15.000 COP | Audiencia BPO/empleo |
| **Total** | **$30.000 COP/día** | ~$7.5 USD · buen punto de partida |

> ⚠️ Deja correr **mínimo 3–5 días** sin pausar. Facebook necesita tiempo para aprender a quién mostrarle el anuncio (fase de aprendizaje).

---

## ¿Qué revisar después de los primeros 5 días?

| Métrica | Objetivo ideal |
|---------|---------------|
| **CTR** (click-through rate) | > 1% es bueno |
| **CPC** (costo por clic) | < $500 COP es bueno |
| **Alcance** | Que crezca con el presupuesto |
| **Conversiones** | Ver en Events Manager cuántos `InitiateCheckout` |

- Si el CTR es bajo → prueba otra imagen o headline
- Si el CPC es alto → ajusta la audiencia o el anuncio
- Pausa el anuncio que peor funcione y dobla el presupuesto del mejor

---

## ¿Puedo pedir nuevas imágenes?

**Sí, absolutamente.** Para pedir un nuevo anuncio:

1. Abre `docs/ads/AD-BRIEF-TEMPLATE.md`
2. Llena los campos del brief
3. Compártelo y en minutos tendrás nuevas imágenes

O simplemente dime directamente, por ejemplo:
- _"Hazme un anuncio con una mujer hablando en videoconferencia, ángulo de empleo remoto, mismo precio"_
- _"Quiero una variante del Ad 01 pero con fondo blanco"_
- _"Hazme un anuncio para el Día sin IVA"_

Las imágenes generadas quedan guardadas y se pueden usar directamente en Ads Manager.

---

## ¿Necesito una Página de Facebook para publicar anuncios?

**Sí.** Si aún no tienes la Página de "English for Work" en Facebook:

1. Ve a [facebook.com/pages/create](https://facebook.com/pages/create)
2. Tipo: **Empresa o marca**
3. Nombre: `English for Work`
4. Categoría: `Educación` o `Servicio educativo`
5. Foto de perfil: el logo
6. Foto de portada: uno de los creatives generados
7. Conecta la Página a tu cuenta de Business Manager

---

## Resumen de URLs importantes

| Herramienta | URL |
|-------------|-----|
| Ads Manager | https://adsmanager.facebook.com |
| Business Manager | https://business.facebook.com |
| Events Manager (Pixel) | https://business.facebook.com/events_manager2 |
| Tu Landing Principal | https://work-english-platform.vercel.app/ingles-para-trabajo |
| Tu Landing Call Center | https://work-english-platform.vercel.app/ingles-call-center |
| Hotmart Checkout | https://pay.hotmart.com/V105122662R |
