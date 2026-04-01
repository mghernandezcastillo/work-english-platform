# 🎧 Simulaciones — Estado y Pendientes

**Última actualización:** 2026-03-31

---

## ✅ Lo que está completo (lanzamiento V1)

### Infraestructura
- Tabla `simulations` en Supabase con columnas: `id`, `module_id`, `route_id`, `title`, `description`, `content`, `sort_order`
- Tabla `user_simulation_progress` con RLS — guarda score y completion por usuario
- Bucket `sim-audios` en Supabase Storage (público)

### Contenido rico — 3 simulaciones (sim-r1, sim-r2, sim-r3)
| ID | Ruta | Título | Turnos | Audio |
|----|------|--------|--------|-------|
| `sim-r1` | route-1 | Tu primer día en el trabajo | 7 | ✅ 7/7 MP3 |
| `sim-r2` | route-2 | Entrevista de trabajo bilingüe | 8 | ✅ 8/8 MP3 |
| `sim-r3` | route-3 | Llamada con cliente frustrado | 8 | ✅ 8/8 MP3 |

- Voces: **Sarah** (femenina) + **Callum** (masculino) vía ElevenLabs
- Cada turno tiene: `context`, `prompt`, `promptEs`, `options[]`, `correct`, `explanation`, `audioUrl`

### UX
- Página `/simulaciones` en el menú inferior (🎧)
- Agrupa por ruta con color accent por ruta
- Badge "✓ Completada" cuando el usuario termina una sim
- Progreso global (barra X de 3 completadas)
- `SimulationView.jsx` guarda `user_simulation_progress` al terminar
- Botón "Simulaciones prácticas" al final de cada ruta (`RouteView.jsx`)

---

## ❌ Pendiente (post-lanzamiento)

### 1. El rest de las simulaciones (9 básicas sin audio)
Las siguientes existen en la DB pero tienen contenido mínimo (4-5 turnos) y **0 audio**:

| IDs | Ruta | Estado |
|-----|------|--------|
| sim-1-1, sim-1-2, sim-1-3 | route-1 | ⚠️ Básico, sin audio |
| sim-2-1, sim-2-2, sim-2-3 | route-2 | ⚠️ Básico, sin audio |
| sim-3-1, sim-3-2, sim-3-3 | route-3 | ⚠️ Básico, sin audio |

> Actualmente **no se muestran** en `/simulaciones` porque el filtro requiere `description IS NOT NULL`.
> Para habilitarlas: enriquecer contenido → actualizar description → generar audio.

**Para habilitar una de estas:** ejecutar `scripts/update-rich-simulations.js` extendido con el nuevo ID y contenido.

### 2. Audio de lecciones pendiente (~9,047 chars)
Se ejecuta el **1° de mayo 2026** cuando ElevenLabs resetee la cuota:
```powershell
$env:ELEVENLABS_API_KEY="sk_fe54ecb7a1ad52e8a41923cf22d110dbfdd55da3acf0dfc9"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
node scripts/generate-audio.js
```
- 12 frases faltantes (les-3-3-3 y les-3-3-4)
- 32 practice scenarios

**Cuota restante en esa API key:** ~7,698 chars (suficiente para todo).

### 3. Tracking de progreso en dashboard
El dashboard actualmente **no muestra** cuántas simulaciones completó el usuario.
Pendiente: agregar widget/stat en `Dashboard.jsx` que lea `user_simulation_progress`.

### 4. Audio dentro de lecciones para las simulaciones
El `SimulationView.jsx` ya muestra el `AudioPlayer` si hay `audioUrl`.
Las 9 simulaciones básicas no tienen audio → al habilitarlas, hay que generar su audio.

---

## Scripts disponibles

| Script | Propósito |
|--------|-----------|
| `scripts/generate-audio.js` | Genera audio para frases/practice de lecciones |
| `scripts/generate-simulations.js` | Intento original (usa module_id, revisar antes de usar) |
| `scripts/update-rich-simulations.js` | ✅ Script funcional — actualiza content + audio de sim-r1/r2/r3 |

---

## Cómo agregar una nueva simulación

1. Editar `scripts/update-rich-simulations.js` — agregar nuevo entry en `RICH_UPDATES` con el `id` de la simulación existente
2. Ejecutar el script con las env vars de ElevenLabs + Supabase
3. Verificar que `description` quede no-nula (para que aparezca en `/simulaciones`)

---

*Para retomar: "¿qué falta en simulaciones?" → leer este archivo.*
