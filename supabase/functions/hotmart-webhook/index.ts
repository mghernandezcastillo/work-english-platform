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

      if (existingUser) {
        // b. Ya existe → solo actualizar acceso
        userId = existingUser.id
        console.log(`[hotmart-webhook] Usuario existente: ${userId}`)
      } else {
        // c. No existe → crear cuenta nueva
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
          full_name: existingUser ? undefined : buyerName || undefined,
        })
        .eq('id', userId)

      if (updateError) {
        await logWebhook('error', 'Profile update failed: ' + updateError.message)
        return err('Profile update failed: ' + updateError.message)
      }

      await logWebhook('success')
      console.log(`[hotmart-webhook] ✅ Acceso paid otorgado a ${buyerEmail}`)

      // Disparar email de bienvenida (día 0) de forma asíncrona
      try {
        const dripUrl = Deno.env.get('SUPABASE_URL')! + '/functions/v1/send-drip-emails'
        const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        fetch(dripUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ targetDay: 0 }),
        }).catch(() => {}) // fire-and-forget
      } catch { /* no bloquear el webhook */ }

      return ok({
        success: true,
        message: `Acceso otorgado a ${buyerEmail}`,
        userId,
        isNewUser: !existingUser,
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
      let updateQuery = admin.from('profiles')

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
