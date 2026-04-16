import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!
const SENDER = { name: 'English for Work', email: 'soporte@englishforworkapp.com' }

async function sendEmail(to: string, name: string) {
  const firstName = name?.split(' ')[0] || 'estudiante'
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0}
.wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.header{background:#10B981;padding:28px 32px;text-align:center}
.header h1{color:#fff;margin:0;font-size:22px}
.body{padding:32px}
.body p{color:#1E293B;font-size:15px;line-height:1.7;margin:0 0 16px}
.btn{display:block;width:fit-content;margin:24px auto;background:#10B981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px}
.steps{background:#F0FDF4;border-left:4px solid #10B981;padding:16px 20px;border-radius:4px;margin:20px 0}
.steps p{margin:4px 0;font-size:14px;color:#064E3B}
.foot{text-align:center;padding:20px;font-size:12px;color:#94A3B8}
</style></head>
<body>
<div class="wrap">
  <div class="header"><h1>🎉 English for Work tiene nuevo dominio</h1></div>
  <div class="body">
    <p>Hola <strong>${firstName}</strong>,</p>
    <p>Tenemos una gran noticia: <strong>English for Work ahora tiene su propio dominio</strong>. A partir de hoy, la plataforma vive en:</p>
    <p style="text-align:center;font-size:20px;font-weight:bold;color:#10B981">englishforworkapp.com</p>
    <p>Si tienes la app instalada en tu celular o computador desde antes, necesitas <strong>reinstalarla</strong> para que funcione con el nuevo dominio. Es rápido:</p>
    <div class="steps">
      <p><strong>📱 En Android:</strong></p>
      <p>1. Mantén presionada la app → Desinstalar</p>
      <p>2. Abre Chrome → ve a <strong>englishforworkapp.com</strong></p>
      <p>3. Instala de nuevo cuando Chrome te lo proponga</p>
      <br>
      <p><strong>💻 En computador:</strong></p>
      <p>1. En Chrome → menú (⋮) → "Desinstalar English for Work"</p>
      <p>2. Ve a <strong>englishforworkapp.com</strong> → instala de nuevo</p>
    </div>
    <p>Tu progreso, acceso y contraseña <strong>siguen siendo los mismos</strong>. No pierdes nada.</p>
    <a class="btn" href="https://englishforworkapp.com">Ir a la plataforma →</a>
    <p style="font-size:13px;color:#64748B">¿Tienes algún problema? Escríbenos por WhatsApp y te ayudamos enseguida.</p>
  </div>
  <div class="foot">English for Work · <a href="https://englishforworkapp.com" style="color:#10B981">englishforworkapp.com</a></div>
</div>
</body></html>`

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: to, name: name || 'Estudiante' }],
      subject: '🎉 English for Work ahora tiene su propio dominio',
      htmlContent: html,
    }),
  })
  return res.ok
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'domain-migration-2026') {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const { data: users, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const results = []
  for (const user of users.users) {
    if (!user.email) continue
    const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Estudiante'
    const ok = await sendEmail(user.email, name)
    results.push({ email: user.email, ok })
    await new Promise(r => setTimeout(r, 200))
  }

  return new Response(JSON.stringify({ sent: results.length, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
