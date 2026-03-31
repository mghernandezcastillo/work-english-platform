# 📂 FILES EXPLAINED — English for Work

> **¿Qué hace cada archivo en este proyecto?**
> Esta guía explica cada archivo en lenguaje simple. No necesitas entender programación.

---

## Archivos en la raíz (carpeta principal)

| Archivo | ¿Qué es? | ¿Lo edito yo? |
|---|---|---|
| `START-HERE.md` | Tu punto de entrada al proyecto. Léelo primero. | ❌ No |
| `FILES-EXPLAINED.md` | Este archivo. Explica todos los demás. | ❌ No |
| `master_prd.md` | El plan maestro del producto. Todo empieza aquí. | ❌ No (solo leer) |
| `.env.example` | Plantilla de variables secretas. Copia esto a `.env` y llénalo. | ✅ Sí (copiar y llenar) |
| `.env` | Tus credenciales reales. NUNCA compartas este archivo. | ✅ Sí (solo tú) |

---

## 📋 docs/strategy/ — Documentos estratégicos

Estos archivos definen QUÉ se construye y POR QUÉ. Son la "biblia" del proyecto.

| Archivo | ¿Qué contiene? | ¿Lo edito yo? |
|---|---|---|
| `00-master-prd.md` | El PRD completo — visión, audiencia, scope, todo | ❌ No (fuente de verdad) |
| `01-business-model.md` | Cómo gana dinero el proyecto, precios, economía | ❌ No (solo leer) |
| `02-product-architecture.md` | Cómo está construida la app, páginas, flujos | ❌ No |
| `03-content-architecture.md` | Estructura de rutas, módulos, lecciones | ❌ No |
| `04-pedagogical-framework.md` | Los 7 pasos de cada lección, tipos de ejercicios | ❌ No |
| `05-ux-ui-strategy.md` | Proceso de diseño, principios visuales | ❌ No |
| `06-cro-landing-strategy.md` | Estrategia de landing pages y conversión | ❌ No |
| `07-branding-variable-system.md` | Sistema de marca variable (cambiar nombre/colores sin romper nada) | ⚠️ Solo `config/brand.json` |
| `08-facebook-ads-strategy.md` | Estructura de campañas, presupuestos, creativos | ❌ No (Antigravity genera los ads) |
| `09-audio-strategy.md` | Voces, formato, producción de audio | ❌ No |
| `10-supabase-strategy.md` | Base de datos, autenticación, almacenamiento | ❌ No |
| `11-hotmart-flow.md` | Flujo de pago completo: usuario paga → app se desbloquea | ❌ No |
| `12-resend-flow.md` | Emails automáticos: cuándo se envían, qué dicen | ❌ No |
| `13-cloudflare-deployment.md` | Cómo se publica la app en internet | ❌ No |
| `14-antigravity-execution-strategy.md` | Cómo Antigravity ejecuta el proyecto paso a paso | ❌ No |

---

## 📖 docs/guides/ — Guías para principiantes

Estas guías te llevan paso a paso por cada herramienta. Están escritas para personas sin experiencia técnica.

| Archivo | ¿Cuándo lo leo? |
|---|---|
| `STEP-BY-STEP-FULL-GUIDE.md` | Cuando quieras ver el proceso completo de inicio a fin |
| `NOVICE-TROUBLESHOOTING.md` | Cuando algo falle y no sepas qué hacer |
| `FACEBOOK-ADS-STEP-BY-STEP.md` | Cuando vayas a crear tus campañas de publicidad |
| `HOTMART-SETUP-FOR-BEGINNERS.md` | Cuando vayas a configurar tu producto de pago |
| `SUPABASE-SETUP-FOR-BEGINNERS.md` | Cuando Antigravity necesite crear el proyecto Supabase |
| `RESEND-SETUP-FOR-BEGINNERS.md` | Cuando vayas a configurar el envío de emails |
| `CLOUDFLARE-SETUP-FOR-BEGINNERS.md` | Cuando vayas a publicar la app en internet |
| `ANTIGRAVITY-SETUP-FOR-BEGINNERS.md` | Cuando vayas a usar Antigravity para construir |
| `STITCH-SETUP-FOR-BEGINNERS.md` | Cuando necesites usar el navegador dentro de Antigravity |

---

## ⚙️ config/ — Archivos de configuración

Estos archivos controlan la marca y las campañas. Son los ÚNICOS que el operador debería modificar.

| Archivo | ¿Qué controla? | ¿Lo edito yo? |
|---|---|---|
| `brand.json` | Nombre comercial, tagline, colores, logo | ✅ Sí — para cambiar la marca |
| `campaign.json` | Ángulos de campaña, presupuestos, landing activas | ✅ Sí — para ajustar campañas |

> **IMPORTANTE:** Cambiar estos archivos cambia la marca en toda la app y landing pages automáticamente. No necesitas tocar código.

---

## 📦 manifests/ — Inventarios de contenido

Estos archivos rastrean cada pieza de contenido del proyecto. Muestran qué está listo y qué falta.

| Archivo | ¿Qué rastrea? | ¿Lo edito yo? |
|---|---|---|
| `content-manifest.md` | Cada lección, frase, ejercicio — con estado (pendiente/listo) | ⚠️ Antigravity lo actualiza |
| `landing-manifest.md` | Cada landing page — copy, URL, estado | ⚠️ Antigravity lo actualiza |
| `ad-manifest.md` | Cada anuncio — formato, copy, imagen, estado | ⚠️ Antigravity lo actualiza |
| `audio-manifest.md` | Cada audio — script, archivo, duración, estado | ⚠️ Antigravity lo actualiza |

---

## 🗃️ database/ — Base de datos

Estos archivos definen qué información guarda la app y cómo la protege.

| Archivo | ¿Qué contiene? | ¿Lo edito yo? |
|---|---|---|
| `schema.sql` | Las tablas de la base de datos (usuarios, lecciones, progreso, etc.) | ❌ No — Antigravity lo aplica |
| `rls-planning.md` | Las reglas de seguridad (quién puede ver qué datos) | ❌ No |
| `seed-data-planning.md` | Los datos iniciales (rutas, módulos, lecciones) que se cargan al inicio | ❌ No |

---

## ✅ checklists/ — Verificaciones

Listas de verificación para no olvidar nada en cada fase.

| Archivo | ¿Cuándo lo uso? |
|---|---|
| `credential-checklist.md` | ANTES de empezar — para crear todas las cuentas necesarias |
| `launch-checklist.md` | ANTES del lanzamiento — verificar que todo funciona |
| `launch-readiness-checklist.md` | EL DÍA del lanzamiento — verificación final |
| `publishing-checklist.md` | DESPUÉS del lanzamiento — tareas de publicación |
| `approval-checkpoints.md` | DURANTE la construcción — puntos donde TÚ debes aprobar |

---

## 📊 planning/ — Planificación

Archivos de planificación del proyecto.

| Archivo | ¿Qué contiene? |
|---|---|
| `folder-map.md` | Mapa visual de todas las carpetas y archivos |
| `setup-dependency-map.md` | Qué depende de qué (orden de ejecución) |
| `master-task-list.md` | Todas las tareas del proyecto con estado |
| `implementation-plan.md` | Plan técnico de implementación |

---

## 🤖 .agents/workflows/ — Instrucciones para Antigravity

Estos archivos le dicen a Antigravity exactamente cómo ejecutar cada fase del proyecto.

| Archivo | ¿Qué automatiza? |
|---|---|
| `execution-phases.md` | El orden maestro de ejecución (fase por fase) |
| `ux-generation.md` | Generar y evaluar opciones de diseño visual |
| `branding-generation.md` | Generar y evaluar opciones de marca |
| `landing-generation.md` | Construir landing pages automáticamente |
| `ads-generation.md` | Crear creativos para Facebook Ads |
| `launch.md` | Ejecutar el lanzamiento paso a paso |

> **NOTA:** Tú NO necesitas ejecutar estos workflows. Antigravity los lee automáticamente.

---

## Resumen rápido

| Si quieres... | Lee este archivo |
|---|---|
| Empezar desde cero | `START-HERE.md` |
| Entender los archivos | `FILES-EXPLAINED.md` (este archivo) |
| Ver el plan completo | `docs/strategy/00-master-prd.md` |
| Seguir el proceso paso a paso | `docs/guides/STEP-BY-STEP-FULL-GUIDE.md` |
| Configurar una herramienta | `docs/guides/[HERRAMIENTA]-SETUP-FOR-BEGINNERS.md` |
| Cambiar la marca | `config/brand.json` |
| Ver qué falta | `manifests/content-manifest.md` |
| Verificar antes de lanzar | `checklists/launch-checklist.md` |

---

*Última actualización: 2026-03-28 — Versión 1.0*
