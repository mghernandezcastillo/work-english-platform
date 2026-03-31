# 🚀 START HERE — English for Work

> **Bienvenido/a al sistema operativo del proyecto English for Work.**
> Este archivo es tu punto de entrada. Léelo completo antes de hacer cualquier otra cosa.

---

## ¿Qué es este proyecto?

**English for Work** es una aplicación web premium que enseña inglés práctico para trabajo a adultos hispanohablantes en Latinoamérica. Se vende por pago único a través de Facebook Ads → Landing Page → Hotmart.

## ¿Qué es este workspace?

Este workspace contiene TODO lo que necesitas para construir, lanzar, y operar el proyecto:

- 📋 **Documentos estratégicos** — el plan completo del producto
- 📖 **Guías para principiantes** — paso a paso para cada herramienta
- ⚙️ **Archivos de configuración** — variables, colores, nombres
- 📦 **Manifiestos** — seguimiento de cada pieza de contenido
- 🗃️ **Base de datos** — esquema SQL listo para aplicar
- ✅ **Checklists** — para no olvidar nada antes de lanzar
- 🤖 **Workflows de Antigravity** — instrucciones para que la IA construya el proyecto

---

## ¿Por dónde empiezo?

### Si eres el OPERADOR (dueño del proyecto):

1. **Lee este archivo completo** ← estás aquí
2. **Lee** [FILES-EXPLAINED.md](FILES-EXPLAINED.md) — entiende qué hace cada archivo
3. **Lee** [docs/guides/STEP-BY-STEP-FULL-GUIDE.md](docs/guides/STEP-BY-STEP-FULL-GUIDE.md) — la guía completa paso a paso
4. **Completa** [checklists/credential-checklist.md](checklists/credential-checklist.md) — crea las cuentas necesarias
5. **Configura** `.env` usando `.env.example` como plantilla
6. **Dile a Antigravity** que ejecute la primera fase de implementación

### Si eres ANTIGRAVITY (IA ejecutando el proyecto):

1. Lee `docs/strategy/00-master-prd.md` — es la fuente de verdad
2. Lee `.agents/workflows/execution-phases.md` — el orden de ejecución
3. Sigue las fases en orden, sin saltar pasos
4. Verifica cada checkpoint en `checklists/approval-checkpoints.md`

---

## Reglas de oro

### 🔴 NO HACER (nunca)

- ❌ No cambiar el nombre técnico del proyecto (`work-english-platform`)
- ❌ No empezar a construir sin tener las credenciales listas
- ❌ No editar archivos SQL directamente en Supabase — usar migraciones
- ❌ No lanzar ads sin que el producto esté 100% completo
- ❌ No inventar testimonios falsos
- ❌ No saltar la fase de beta testing

### 🟢 SÍ HACER (siempre)

- ✅ Leer la guía correspondiente antes de cada paso
- ✅ Usar el checklist de credenciales para no olvidar nada
- ✅ Probar todo en móvil antes de considerar algo "listo"
- ✅ Guardar las credenciales en un lugar seguro (no en el código)
- ✅ Pedir aprobación en cada checkpoint marcado en el proyecto

---

## Herramientas que vas a necesitar

| Herramienta | Para qué | Costo | Guía |
|---|---|---|---|
| **Supabase** | Base de datos, auth, storage, webhooks | Gratis (plan Nano) | [Guía](docs/guides/SUPABASE-SETUP-FOR-BEGINNERS.md) |
| **Hotmart** | Cobrar pagos | Gratis (comisión por venta) | [Guía](docs/guides/HOTMART-SETUP-FOR-BEGINNERS.md) |
| **Resend** | Enviar emails automáticos | Gratis (100 emails/día) | [Guía](docs/guides/RESEND-SETUP-FOR-BEGINNERS.md) |
| **Cloudflare Pages** | Publicar la app en internet | Gratis | [Guía](docs/guides/CLOUDFLARE-SETUP-FOR-BEGINNERS.md) |
| **Facebook Business Manager** | Crear y gestionar anuncios | Depende del presupuesto | [Guía](docs/guides/FACEBOOK-ADS-STEP-BY-STEP.md) |
| **Antigravity** | Construir el proyecto con IA | Tu licencia actual | [Guía](docs/guides/ANTIGRAVITY-SETUP-FOR-BEGINNERS.md) |
| **ElevenLabs** | Generar audio profesional | ~$5-22/mes | Ver [Audio Strategy](docs/strategy/09-audio-strategy.md) |

---

## Estructura del proyecto (resumen visual)

```
📁 Tu workspace
│
├── 📋 docs/strategy/     → Los planes (QUÉ construir y POR QUÉ)
├── 📖 docs/guides/       → Las guías (CÓMO hacerlo paso a paso)
├── ⚙️ config/            → La configuración (nombre, colores, marca)
├── 📦 manifests/         → El inventario (cada lección, audio, ad)
├── 🗃️ database/          → La base de datos (tablas, seguridad, datos)
├── ✅ checklists/        → Las verificaciones (antes de lanzar)
├── 📊 planning/          → La planificación (tareas, dependencias)
└── 🤖 .agents/workflows/ → Las instrucciones para Antigravity
```

---

## Siguiente paso

👉 Ve a **[FILES-EXPLAINED.md](FILES-EXPLAINED.md)** para entender qué hace cada archivo.

---

*Última actualización: 2026-03-28 — Versión 1.0*
