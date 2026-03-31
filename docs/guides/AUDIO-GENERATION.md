# 🎧 Guía: Generar Audios de Pronunciación

---

## 📊 Estado actual — última ejecución: 2026-03-30

### ✅ Lo que ya está generado
- **193 MP3s** subidos a Supabase Storage (`lesson-audios` bucket)
- **Frases principales (phrases)**: 188/200 generadas — casi todas ✅
- Voz usada: **Sarah** (`EXAVITQu4vr4xnSDxMaL`) — inglés americano, plan gratuito

### ⏳ Pendiente (próxima sesión)

| Tipo | Items pendientes | Chars necesarios | Cuota necesaria |
|------|-----------------|-------------------|-----------------|
| **Phrases** (12 frases fallidas al final) | 12 | 484 | ~484 |
| **Practice scenarios** | 32 | 8,563 | ~8,563 |
| **Examples** (diálogos largos) | 53 | 19,842 | ~20K — requiere 2 meses |
| **TOTAL prioritario** (phrases + practice) | **44** | **~9,047** | **Cabe en 1 mes** |

> 💡 Los *examples* son diálogos largos (emails, conversaciones). Dado su tamaño (19K chars),
> se recomienda **NO generarlos** — el Web Speech API de respaldo funciona bien para esos.
> Priorizar solo phrases y practice_scenarios.

---

### 🔍 Las 12 frases que fallaron (cuota se agotó al final)

Lecciones `les-3-3-3` y `les-3-3-4` — se quedaron sin cuota:

**les-3-3-3** — Reuniones y updates rápidos:
1. "Yesterday I worked on [X]. Today I am planning to [Y]."
2. "I do not have any blockers right now."
3. "I have a question — could we discuss [topic] briefly?"
4. "I agree with that approach."
5. "Could you clarify what you mean by [term]?"
6. "That is a good point — I had not thought of that."

**les-3-3-4** — Práctica guiada — daily standup en inglés:
1. "My average handle time today was [X] minutes."
2. "My first call resolution rate this week is [X]%."
3. "I exceeded my quota by [X]%."
4. "I am on track to meet my targets for the month."
5. "We wrapped up the discussion."
6. "Let us take this offline."

---

### 📅 Plan para próxima sesión de audios

El 1 de cada mes ElevenLabs resetea la cuota a 10,000 chars.

**Próxima ejecución:** ~2026-05-01
- El script ya está listo en `scripts/generate-audio.js`
- Es idempotente: omite automáticamente las frases que ya tienen `audioUrl`
- Solo debe ejecutarse con la cuota reseteada
- Generará: 12 frases pendientes + 32 practice scenarios = **~9,047 chars** (dentro del límite)

```powershell
# Ejecutar el 1° de mayo (o cuando haya cuota disponible):
$env:ELEVENLABS_API_KEY="sk_8152573d944331e81a3ce867a82ee9b388d25f27abcc83c4"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ"
node scripts/generate-audio.js
```

> ⚠️ Los examples (53 items, 19,842 chars) quedan con Web Speech API de respaldo.
> Si en el futuro se quiere generarlos, se necesitaría plan Pro de ElevenLabs o
> cambiar a **Google Cloud TTS** (1M chars/mes gratis — ver Opción B abajo).

---


Esta guía describe las dos opciones para generar los ~180 audios MP3 de las frases en inglés
y subirlos a Supabase Storage.

---

## Script ya listo

El script de generación está en `scripts/generate-audio.js`. Solo necesitas:
1. Elegir un proveedor (Opción A o B abajo)
2. Conseguir la API key
3. Ejecutar el script con las variables de entorno correctas

### Ejecutar el script

```powershell
# En la terminal dentro de work-english-platform/

# Con ElevenLabs:
$env:ELEVENLABS_API_KEY="tu-key"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5..."  # service_role key de Supabase

# Con Google Cloud:
$env:GOOGLE_TTS_API_KEY="tu-key"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5..."

node scripts/generate-audio.js
```

> **SUPABASE_SERVICE_KEY** está en: https://supabase.com/dashboard/project/mtobgwfknefjlpoxznqx/settings/api
> Es la clave `service_role` (no la `anon`).

---

## Opción A: ElevenLabs (Recomendado para facilidad)

**Calidad:** ⭐⭐⭐⭐⭐ casi humana  
**Cuota gratis:** 10,000 chars/mes  
**Cuota necesaria:** ~7,000-10,000 chars para todas las frases

### Pasos para conseguir el API Key

1. Ve a **https://elevenlabs.io/sign-up**
2. Haz clic en **"Continue with Google"** (usa tu cuenta Gmail)
3. Una vez dentro, haz clic en tu avatar → **"Profile + API Key"**
4. Copia el API key que aparece
5. Pégaselo al asistente para ejecutar el script

### Voz usada
- **Rachel** (`21m00Tcm4TlvDq8ikWAM`) — inglés americano, clara y profesional
- Puedes cambiar en `scripts/generate-audio.js` línea: `const VOICE_ID = '...'`
- Ver todas las voces en: https://elevenlabs.io/voice-library

---

## Opción B: Google Cloud TTS (Más cuota gratis)

**Calidad:** ⭐⭐⭐⭐⭐ excelente (Neural2 / Studio voices)  
**Cuota gratis:** 1,000,000 chars/mes de Neural2  
**Cuota necesaria:** ~7,000-10,000 chars — 100x dentro del límite

> ⚠️ Google AI Ultra (Google One) **NO** es lo mismo que Google Cloud. Google Cloud TTS
> es un servicio separado pero igualmente gratuito con cualquier cuenta Google.

### Pasos para conseguir el API Key

1. Ve a **https://console.cloud.google.com**
2. Inicia sesión con tu cuenta Gmail
3. Crea un proyecto nuevo (ej: `english-for-work-tts`)
4. En el menú lateral: **APIs & Services → Library**
5. Busca **"Cloud Text-to-Speech API"** y haz clic en **Enable**
6. Ve a **APIs & Services → Credentials**
7. Haz clic en **"+ Create Credentials" → "API Key"**
8. Copia el API key generado
9. (Opcional) Haz clic en "Restrict Key" → en "API restrictions" selecciona solo "Cloud Text-to-Speech API"

> ⚠️ Google Cloud pide agregar una tarjeta de crédito para activar la cuenta, pero
> **NO te cobran** mientras estés dentro de la cuota gratis (1M chars/mes Neural2).
> Con ~10,000 chars totales, NUNCA llegarás a pagar.

### Pasa el API Key al asistente
Una vez tengas el key, compártelo para actualizar el script `generate-audio.js` 
con la implementación de Google Cloud TTS.

### Voz recomendada para Google Cloud
- **`en-US-Neural2-F`** — inglés americano, femenina, muy natural
- **`en-US-Neural2-D`** — inglés americano, masculina
- **`en-US-Wavenet-F`** — alternativa más suave

---

## Qué hace el script automáticamente

1. Lee las 36 lecciones y extrae todas las frases, ejemplos y escenarios de práctica
2. Genera audio MP3 para cada texto en inglés usando el proveedor elegido
3. Sube los MP3 a **Supabase Storage** → bucket `audios`
4. Actualiza el campo `audioUrl` en cada frase dentro del JSON de contenido en la DB
5. Las lecciones ya tienen el `AudioPlayer` listo → funciona automático sin cambios de código

### Estructura de archivos en Storage
```
audios/
  les-1-1-1/
    phrase-0.mp3
    phrase-1.mp3
    example-0.mp3
    practice-0.mp3
  les-1-1-2/
    phrase-0.mp3
    ...
```

---

## Tiempo estimado de ejecución

- ~180 archivos de audio
- ~300ms entre cada llamada (rate limiting)
- **Total: ~10-15 minutos de ejecución**

---

## Si el script se interrumpe

No hay problema — el script tiene `if (!phrase.audioUrl) continue`, lo que significa
que **omite las frases que ya tienen audio**. Puedes volver a ejecutarlo y continuará
desde donde se quedó.

---

*Última actualización: 2026-03-30*
