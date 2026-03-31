# 📘 Antigravity Setup para Principiantes — English for Work

---

## Qué es Antigravity

Antigravity es tu asistente de IA que construye el proyecto. Escribe código, crea diseños, configura bases de datos, y genera contenido. Tú le das instrucciones y aprobaciones.

---

## Cómo iniciar una sesión de trabajo

1. Abre Antigravity (tu editor con la extensión instalada)
2. Asegúrate de que el workspace `work-english-platform` está abierto
3. Escribe en el chat:

```
Lee START-HERE.md y docs/strategy/00-master-prd.md en el workspace work-english-platform.
Luego lee .agents/workflows/execution-phases.md para saber qué hacer.
Revisa planning/master-task-list.md para ver dónde quedamos.
Continúa desde donde dejamos.
```

---

## Cómo dar instrucciones

### ✅ Buenas instrucciones
- "Ejecuta la Fase 1 del workflow de ejecución"
- "Genera las 4 direcciones visuales para el diseño"
- "Construye la página de login siguiendo el diseño aprobado"
- "Hay un error: [pegar error]. Arréglalo."
- "Aprobado, continúa a la siguiente fase"

### ❌ Malas instrucciones
- "Haz la app" (demasiado vago)
- "Hazlo bonito" (no dice qué ni cómo)
- Sin contexto (Antigravity necesita saber en qué fase estamos)

---

## Cómo aprobar un checkpoint

Cuando Antigravity te muestra un resultado y pide aprobación:

1. Revisa lo que te muestra (mockup, funcionalidad, etc.)
2. Verifica los puntos del checkpoint (están en `checklists/approval-checkpoints.md`)
3. Responde con una de estas opciones:

| Respuesta | Significado |
|---|---|
| "Aprobado, continúa" | Todo está bien, sigue con la siguiente fase |
| "Aprobado con cambios: [lista]" | Está bien en general, pero haz estos ajustes primero |
| "No aprobado: [razón]" | Necesita más trabajo antes de continuar |
| "Tengo duda: [pregunta]" | Necesitas más información antes de decidir |

---

## Qué puede hacer Antigravity

- ✅ Escribir todo el código de la app
- ✅ Crear diseños y mockups
- ✅ Configurar Supabase (base de datos, auth, storage)
- ✅ Generar contenido para las lecciones
- ✅ Crear creativos para anuncios
- ✅ Deploy a Cloudflare
- ✅ Corregir errores

## Qué NO puede hacer Antigravity (tú lo haces)

- ❌ Crear tu cuenta de Hotmart (necesita tus datos personales)
- ❌ Crear tu Business Manager de Facebook (necesita verificación)
- ❌ Comprar tu dominio (necesita pago)
- ❌ Enviar links de beta testing por WhatsApp
- ❌ Aprobar anuncios en Facebook
- ❌ Decidir el presupuesto de ads
- ❌ Hacer la decisión final de lanzar

---

## Consejos

1. **Sé específico:** mientras más detalle des, mejor resultado obtendrás
2. **Un paso a la vez:** no pidas 5 cosas diferentes a la vez
3. **Lee los workflows:** antes de pedir algo, revisa si ya hay un workflow que lo cubre
4. **Guarda tu progreso:** Antigravity actualiza `planning/master-task-list.md`
