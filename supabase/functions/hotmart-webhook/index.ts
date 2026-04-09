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

const APP_URL = 'https://work-english-platform.vercel.app'
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

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#1a1a2e;padding:36px 40px;text-align:center">
            <h1 style="color:#ffffff;font-size:22px;margin:0;font-family:'Segoe UI',Arial,sans-serif">&#127758; English for Work</h1>
            <p style="color:#a0a0c0;font-size:13px;margin:8px 0 0;font-family:'Segoe UI',Arial,sans-serif">Tu inglés profesional, un paso a la vez</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px">
            <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;font-family:'Segoe UI',Arial,sans-serif">¡Hola <strong>${firstName}</strong>! &#128075;</p>
            <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px;font-family:'Segoe UI',Arial,sans-serif">¡<strong>Felicitaciones por tu compra!</strong> Tu acceso de por vida a English for Work está listo.</p>
            <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 8px;font-family:'Segoe UI',Arial,sans-serif">Solo necesitas <strong>crear tu contraseña</strong> para empezar:</p>

            <!-- CTA BUTTON -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:16px 0">
              <a href="${passwordUrl}" sib-link-notrack
                style="display:inline-block;background-color:#6366f1;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;text-align:center;padding:16px 40px;border-radius:10px;font-family:'Segoe UI',Arial,sans-serif">
                Crear mi contraseña &#8594;
              </a>
            </td></tr></table>

            <!-- STEPS -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-radius:10px;margin:8px 0 20px">
              <tr><td style="padding:20px 24px">
                <p style="font-size:14px;color:#374151;margin:0 0 8px;font-family:'Segoe UI',Arial,sans-serif"><strong>¿Cómo funciona?</strong></p>
                <p style="font-size:14px;color:#374151;margin:0 0 6px;font-family:'Segoe UI',Arial,sans-serif">1️⃣ Haz clic en el botón de arriba</p>
                <p style="font-size:14px;color:#374151;margin:0 0 6px;font-family:'Segoe UI',Arial,sans-serif">2️⃣ Crea tu contraseña</p>
                <p style="font-size:14px;color:#374151;margin:0;font-family:'Segoe UI',Arial,sans-serif">3️⃣ ¡Empieza tu primera lección!</p>
              </td></tr>
            </table>

            <!-- TIP -->
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td width="3" style="background-color:#6366f1;border-radius:4px">&nbsp;</td>
              <td style="background-color:#f0f9ff;padding:14px 18px;border-radius:0 8px 8px 0">
                <p style="font-size:14px;color:#374151;margin:0;font-family:'Segoe UI',Arial,sans-serif">&#128161; Haz al menos una lección al día. Son 10-15 minutos y están diseñadas para aprender haciendo, no memorizando.</p>
              </td>
            </tr></table>

            <p style="font-size:13px;color:#9ca3af;text-align:center;margin:20px 0 8px;font-family:'Segoe UI',Arial,sans-serif">Tienes acceso completo: 36 lecciones + 12 simulaciones + vocabulario laboral.</p>
            <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;font-family:'Segoe UI',Arial,sans-serif">Si el botón no funciona, copia este enlace:<br>
              <a href="${passwordUrl}" sib-link-notrack style="color:#6366f1;word-break:break-all;font-family:'Segoe UI',Arial,sans-serif">${passwordUrl}</a>
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #f0f0f0">
            <p style="font-size:12px;color:#9ca3af;margin:0;font-family:'Segoe UI',Arial,sans-serif">
              Recibiste este email porque compraste English for Work.<br>
              <a href="${APP_URL}" style="color:#6366f1;text-decoration:none">Ir a la plataforma</a>
              &nbsp;·&nbsp;
              <a href="mailto:englishforworkapp@gmail.com" style="color:#6366f1;text-decoration:none">¿Necesitas ayuda?</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

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
          // Construct direct URL with token_hash as query param instead of
          // using action_link (which goes through Supabase verify → redirect chain
          // that Brevo's click tracker breaks by stripping hash fragments)
          const tokenHash = linkData?.properties?.hashed_token
          const passwordUrl = tokenHash
            ? `${APP_URL}/reset-password?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`
            : `${APP_URL}/forgot-password`

          console.log(`[hotmart-webhook] Password URL generado para ${buyerEmail} (token: ${tokenHash ? 'yes' : 'no'})`)

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
