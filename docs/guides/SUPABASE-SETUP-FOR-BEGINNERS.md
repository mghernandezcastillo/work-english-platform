# 📘 Supabase Setup para Principiantes — English for Work

---

## Qué es Supabase

Supabase es donde tu app guarda toda la información: usuarios, lecciones, progreso, testimonios. También maneja los logins y el almacenamiento de audio.

---

## ⚡ Antigravity hace TODO esto por ti

> **No necesitas crear la cuenta ni el proyecto manualmente.**
> Antigravity tiene acceso al MCP Server de Supabase y puede:
> - ✅ Crear el proyecto
> - ✅ Aplicar el esquema de base de datos
> - ✅ Configurar las políticas de seguridad (RLS)
> - ✅ Crear los buckets de storage
> - ✅ Desplegar las Edge Functions
> - ✅ Obtener las credenciales automáticamente
>
> **Lo único que tú haces:** confirmar en qué organización y región crear el proyecto.

---

## Paso 1: Ya tienes cuenta (confirmado)

Tu cuenta de Supabase ya está activa con estas organizaciones disponibles:
- macris
- AutoNetwork
- NeuroEnglish Loop
- call-center-english-pro
- Binet Corp
- AntigravityCourse

Antigravity te preguntará cuál usar (o si crear una nueva) cuando inicie la Fase 1.

---

## Paso 2: Antigravity crea el proyecto

> **Esto es automático.** Antigravity ejecutará:

1. En el dashboard de Supabase → "New project"
2. **Organization:** Selecciona o crea una
3. **Project name:** `english-for-work`
4. **Database password:** Genera una segura y guárdala
5. **Region:** `South America (São Paulo)` o `US East` — elige la más cercana a tus usuarios
6. **Plan:** Free (Nano)
7. Haz clic en "Create new project"
8. Espera 1-2 minutos a que se configure

---

## Paso 3: Obtener credenciales

1. Ve a Project Settings → API
2. Copia estos valores:
   - **Project URL** → pega en `.env` como `VITE_SUPABASE_URL`
   - **anon/public key** → pega en `.env` como `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → guárdalo para las Edge Functions (NUNCA lo pongas en el código del frontend)

---

## Paso 4: Configurar Auth

1. Ve a Authentication → Settings → Auth Settings
2. **Site URL:** `http://localhost:5173` (para desarrollo) luego cámbialo a tu dominio
3. **Disable Email Confirmations:** ✅ Activar (deshabilitar confirmación por email)
4. **Minimum password length:** 6
5. Guarda los cambios

---

## Paso 5: Aplicar el esquema de base de datos

> **Antigravity hace esto automáticamente.** Si necesitas hacerlo manual:

1. Ve a SQL Editor (en el menú lateral de Supabase)
2. Haz clic en "New query"
3. Copia todo el contenido de `database/schema.sql`
4. Pégalo en el editor
5. Haz clic en "Run"
6. Deberías ver "Success" sin errores

---

## Paso 6: Crear buckets de Storage

1. Ve a Storage (menú lateral)
2. Haz clic en "New bucket"
3. **Nombre:** `audio`
4. **Public bucket:** ✅ Sí (necesitamos que los audio sean públicos)
5. Repite para crear bucket `images` (también público)

---

## Paso 7: Verificar que funciona

1. Ve a Table Editor → deberías ver las tablas: profiles, routes, modules, lessons, etc.
2. Ve a Authentication → Users → debería estar vacío (aún no hay usuarios)
3. Ve a Storage → deberías ver los buckets `audio` e `images`

---

## Dónde pegar cada valor

| Valor | Dónde lo encuentras en Supabase | Dónde lo pegas |
|---|---|---|
| Project URL | Settings → API → project URL | `.env` → `VITE_SUPABASE_URL` |
| Anon Key | Settings → API → anon key | `.env` → `VITE_SUPABASE_ANON_KEY` |
| Service Role Key | Settings → API → service_role | Edge Function env variables (Supabase Dashboard → Edge Functions → Secrets) |

---

## ⚠️ Importante

- **NUNCA** pongas la `service_role` key en el código de tu app (frontend)
- La `anon` key es segura para usar en el frontend — las RLS policies la protegen
- El plan gratuito tiene límites (500MB database, 1GB storage) — suficiente para V1
