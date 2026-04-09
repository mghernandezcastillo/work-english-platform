import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

// ============================================================
// hotmart-webhook — maneja compras y reembolsos de Hotmart
// Se llama SIN JWT (Hotmart no envía JWT, usa HOTTOK)
// ============================================================

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, x-hotmart-hottok',
}

const APP_URL = 'https://english-for-work.vercel.app'
const SENDER = { name: 'English for Work', email: 'englishforworkapp@gmail.com' }

function ok(body: object) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// Genera contraseña temporal aleatoria
function randomPassword(len = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => chars[b % chars.length]).join('')
}

// ── Email de bienvenida con link para crear contraseña ─────
async function sendWelcomeEmail(email: string, name: string, passwordUrl: string) {
  const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
  if (!BREVO_API_KEY) {
    console.warn('[hotmart-webhook] BREVO_API_KEY no configurada, no se envió email')
    return { ok: false, status: 0, body: 'No API key' }
  }

  const firstName = name.split(' ')[0] || 'Estudiante'

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hdr{background:linear-gradient(135deg,#1a1a2e,#2d2d5e);padding:36px 40px;text-align:center}
.hdr h1{color:#fff;font-size:22px;margin:0}.hdr p{color:#a0a0c0;font-size:13px;margin:6px 0 0}
.bd{padding:36px 40px}.bd p{font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px}
.cta{display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff!important;text-decoration:none;font-size:16px;font-weight:700;text-align:center;padding:16px 32px;border-radius:10px;margin:24px 0}
.tip{background:#f0f9ff;border-left:3px solid #6366f1;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:14px}
.steps{background:#fafafa;border-radius:10px;padding:20px 24px;margin:20px 0}
.steps p{font-size:14px;margin:8px 0;color:#374151}
.foot{background:#f9fafb;padding:20px 40px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #f0f0f0}
</style></head><body><div class="wrap">
  <div class="hdr"><h1>&#127758; English for Work</h1><p>Tu inglés profesional, un paso a la vez</p></div>
  <div class="bd">
    <p>¡Hola <strong>${firstName}</strong>! &#128075;</p>
    <p>¡<strong>Felicitaciones por tu compra!</strong> Tu acceso de por vida a English for Work está listo.</p>
    <p>Solo necesitas <strong>crear tu contraseña</strong> para empezar:</p>
    <a class="cta" href="${passwordUrl}">Crear mi contraseña &#8594;</a>
    <div class="steps">
      <p><strong>¿Cómo funciona?</strong></p>
      <p>1️⃣ Haz clic en el botón de arriba</p>
      <p>2️⃣ Crea tu contraseña</p>
      <p>3️⃣ ¡Empieza tu primera lección!</p>
    </div>
    <div class="tip">&#128161; Haz al menos una lección al día. Son 10-15 minutos y están diseñadas para aprender haciendo, no memorizando.</div>
    <p style="font-size:13px;color:#9ca3af;text-align:center">Tienes acceso completo: 36 lecciones + 12 simulaciones + vocabulario laboral.</p>
    <p style="font-size:12px;color:#9ca3af;text-align:center">Si el botón no funciona, copia y pega este enlace:<br><span style="color:#6366f1;word-break:break-all">${passwordUrl}</span></p>
  </div>
  <div class="foot">Recibiste este email porque compraste English for Work.<br>
  <a href="${APP_URL}" style="color:#6366f1">Ir a la plataforma</a> · <a href="mailto:englishforworkapp@gmail.com" style="color:#6366f1">¿Necesitas ayuda?</a></div>
</div></body></html>`

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email, name }],
      subject: '🎉 ¡Bienvenido/a a English for Work! — Crea tu contraseña',
      htmlContent: html,
    }),
  })
  const body = await res.text()
  console.log(`[hotmart-webhook] Email bienvenida enviado a ${email}: ${res.status} ${res.ok ? 'OK' : body}`)
  return { ok: res.ok, status: res.status, body }
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  // ── 1. Verificar HOTTOK ──────────────────────────────────
  const hottok = req.headers.get('X-HOTMART-HOTTOK')
  const expectedToken = Deno.env.get('HOTMART_HOTTOK')

  // Si tenemos secreto configurado, validamos. Si no, logueamos advertencia.
  if (expectedToken && hottok !== expectedToken) {
    console.warn('[hotmart-webhook] HOTTOK inválido recibido:', hottok)
    return err('Forbidden: invalid token', 403)
  }

  // ── 2. Parsear body ──────────────────────────────────────
  let payload: any
  try {
    payload = await req.json()
  } catch {
    return err('Invalid JSON body')
  }

  const event: string = payload?.event ?? 'UNKNOWN'
  const buyer = payload?.data?.buyer ?? {}
  const purchase = payload?.data?.purchase ?? {}
  const buyerEmail: string = (buyer.email ?? '').toLowerCase().trim()
  const buyerName: string = buyer.name ?? buyer.first_name ?? ''
  const transactionId: string = purchase.transaction ?? purchase.order_id ?? ''

  console.log(`[hotmart-webhook] Evento: ${event} | Email: ${buyerEmail} | TX: ${transactionId}`)

  // ── 3. Admin client (service role — bypassa RLS) ─────────
  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Helper: loguear en webhook_logs
  async function logWebhook(result: string, error_message?: string) {
    await admin.from('webhook_logs').insert({
      source: 'hotmart',
      event,
      payload,
      buyer_email: buyerEmail || null,
      transaction_id: transactionId || null,
      result,
      error_message: error_message ?? null,
    })
  }

  // ── 4. PURCHASE — grant access ──────────────────────────
  // Hotmart sends PURCHASE_APPROVED for real card payments
  // and PURCHASE_COMPLETE from their test simulator.
  const isPurchaseEvent = event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE'
  if (isPurchaseEvent) {
    if (!buyerEmail) {
      await logWebhook('error', 'Missing buyer email')
      return err('Missing buyer email')
    }

    try {
      // a. ¿Ya existe el usuario?
      const { data: existingUsers } = await admin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        (u: any) => u.email?.toLowerCase() === buyerEmail
      )

      let userId: string
      let isNewUser = false

      if (existingUser) {
        // b. Ya existe → solo actualizar acceso
        userId = existingUser.id
        console.log(`[hotmart-webhook] Usuario existente: ${userId}`)
      } else {
        // c. No existe → crear cuenta nueva
        isNewUser = true
        const tempPassword = randomPassword()
        const { data: newUser, error: createError } = await admin.auth.admin.createUser({
          email: buyerEmail,
          password: tempPassword,
          email_confirm: true, // no requiere confirmación
          user_metadata: { full_name: buyerName },
        })

        if (createError || !newUser?.user) {
          await logWebhook('error', createError?.message ?? 'Failed to create user')
          return err('Failed to create user: ' + (createError?.message ?? 'unknown'))
        }

        userId = newUser.user.id
        console.log(`[hotmart-webhook] Nuevo usuario creado: ${userId}`)

        // Esperar un momento para que el trigger on_auth_user_created corra
        await new Promise(r => setTimeout(r, 500))
      }

      // d. Actualizar profile con access_type = 'paid' y transaction_id
      const { error: updateError } = await admin
        .from('profiles')
        .update({
          access_type: 'paid',
          hotmart_transaction_id: transactionId,
          full_name: isNewUser ? buyerName || undefined : undefined,
        })
        .eq('id', userId)

      if (updateError) {
        await logWebhook('error', 'Profile update failed: ' + updateError.message)
        return err('Profile update failed: ' + updateError.message)
      }

      await logWebhook('success')
      console.log(`[hotmart-webhook] ✅ Acceso paid otorgado a ${buyerEmail}`)

      // e. Enviar email de bienvenida con link para crear contraseña
      let emailSent = false
      try {
        // Generar link de recovery (funciona como "crear contraseña" para usuarios nuevos)
        const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
          type: 'recovery',
          email: buyerEmail,
          options: { redirectTo: `${APP_URL}/reset-password` }
        })

        if (linkError) {
          console.error(`[hotmart-webhook] Error generando link: ${linkError.message}`)
        } else {
          const passwordUrl = linkData?.properties?.action_link || `${APP_URL}/forgot-password`
          const emailResult = await sendWelcomeEmail(buyerEmail, buyerName, passwordUrl)
          emailSent = emailResult.ok

          // Registrar en drip_email_log para que el cron no reenvíe
          if (emailSent) {
            await admin.from('drip_email_log').insert({
              user_id: userId,
              email: buyerEmail,
              day_number: 0,
              status: 'sent',
            })
          }
        }
      } catch (emailErr: any) {
        console.error(`[hotmart-webhook] Error enviando email: ${emailErr.message}`)
        // No bloquear el webhook por un error de email
      }

      return ok({
        success: true,
        message: `Acceso otorgado a ${buyerEmail}`,
        userId,
        isNewUser,
        emailSent,
      })

    } catch (e: any) {
      await logWebhook('error', e.message)
      return err('Server error: ' + e.message, 500)
    }
  }

  // ── 5. REFUND — revoke access ───────────────────────────
  // Hotmart sends PURCHASE_REFUNDED for real refunds
  // and PURCHASE_REFUND from their test simulator.
  const isRefundEvent = event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_REFUND'
  if (isRefundEvent) {
    if (!transactionId && !buyerEmail) {
      await logWebhook('ignored', 'No transaction_id or email to identify user')
      return ok({ success: true, message: 'Ignored: no identifier' })
    }

    try {
      let updated = false

      // Intentar por transaction_id primero (más preciso)
      if (transactionId) {
        const { error } = await admin
          .from('profiles')
          .update({ access_type: 'none' })
          .eq('hotmart_transaction_id', transactionId)

        if (!error) updated = true
      }

      // Fallback por email
      if (!updated && buyerEmail) {
        await admin
          .from('profiles')
          .update({ access_type: 'none' })
          .eq('email', buyerEmail)
      }

      await logWebhook('success')
      console.log(`[hotmart-webhook] ✅ Acceso revocado — TX: ${transactionId} | Email: ${buyerEmail}`)
      return ok({ success: true, message: 'Acceso revocado' })

    } catch (e: any) {
      await logWebhook('error', e.message)
      return err('Server error: ' + e.message, 500)
    }
  }

  // ── 6. Evento desconocido → ignorar ─────────────────────
  await logWebhook('ignored')
  return ok({ success: true, message: `Event ${event} acknowledged and ignored` })
})
