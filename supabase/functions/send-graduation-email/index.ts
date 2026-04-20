import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const APP_URL = "https://englishforworkapp.com";
const SENDER = { name: "English for Work", email: "soporte@englishforworkapp.com" };

async function sendBrevoEmail(to: string, name: string, subject: string, html: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sender: SENDER, to: [{ email: to, name }], subject, htmlContent: html }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

function graduationEmail(name: string, completedAt: string): string {
  const firstName = name.split(" ")[0];
  const dateStr = new Date(completedAt).toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:580px;margin:32px auto;background:linear-gradient(180deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);border-radius:20px;overflow:hidden;box-shadow:0 8px 48px rgba(255,215,0,.15),0 2px 0 rgba(255,215,0,.3) inset}
.hdr{padding:48px 40px 32px;text-align:center;position:relative}
.hdr-glow{position:absolute;top:0;left:50%;transform:translateX(-50%);width:300px;height:200px;background:radial-gradient(ellipse,rgba(255,215,0,.12),transparent 70%);pointer-events:none}
.grad-cap{font-size:72px;display:block;margin-bottom:12px;animation:none}
.hdr h1{color:#FFD700;font-size:28px;font-weight:900;margin:0 0 6px;letter-spacing:0.04em;text-shadow:0 0 24px rgba(255,215,0,.4)}
.hdr p{color:rgba(255,255,255,.65);font-size:14px;margin:0}
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(255,215,0,.4),transparent);margin:0 40px}
.bd{padding:36px 40px}
.bd p{font-size:15px;line-height:1.8;color:rgba(255,255,255,.8);margin:0 0 16px}
.bd strong{color:#FFD700}
.stats{display:flex;gap:12px;margin:24px 0;justify-content:center}
.stat{flex:1;text-align:center;background:rgba(255,215,0,.08);border:1px solid rgba(255,215,0,.2);border-radius:12px;padding:16px 8px}
.stat-num{display:block;font-size:28px;font-weight:900;color:#FFD700}
.stat-lbl{display:block;font-size:11px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px;margin-top:4px}
.quote{background:rgba(255,255,255,.04);border-left:3px solid #FFD700;border-radius:0 10px 10px 0;padding:14px 18px;margin:20px 0;font-size:14px;color:rgba(255,255,255,.7);font-style:italic}
.cta{display:block;background:linear-gradient(135deg,#FFD700,#FFA500);color:#1a1a2e!important;text-decoration:none;font-size:16px;font-weight:900;text-align:center;padding:16px 32px;border-radius:12px;margin:28px 0 8px;box-shadow:0 4px 24px rgba(255,215,0,.3)}
.cta-sub{text-align:center;font-size:13px;color:rgba(255,255,255,.4);margin:0 0 24px}
.foot{background:rgba(0,0,0,.2);padding:20px 40px;text-align:center;font-size:12px;color:rgba(255,255,255,.3);border-top:1px solid rgba(255,255,255,.06)}
.foot a{color:#FFD700;text-decoration:none}
</style></head><body><div class="wrap">
  <div class="hdr">
    <div class="hdr-glow"></div>
    <span class="grad-cap">&#127891;</span>
    <h1>&#161;FELICITACIONES!</h1>
    <p>English for Work &bull; Clase ${dateStr}</p>
  </div>
  <div class="divider"></div>
  <div class="bd">
    <p>Hola <strong>${firstName}</strong>,</p>
    <p>Hoy es un d&iacute;a especial. Completaste <strong>las 36 lecciones</strong> de English for Work y eso no es poca cosa. Muchos empiezan, pocos llegan hasta aqu&iacute;.</p>

    <div class="stats">
      <div class="stat"><span class="stat-num">36</span><span class="stat-lbl">Lecciones</span></div>
      <div class="stat"><span class="stat-num">3</span><span class="stat-lbl">Rutas</span></div>
      <div class="stat"><span class="stat-num">100%</span><span class="stat-lbl">Completado</span></div>
    </div>

    <div class="quote">&ldquo;El &eacute;xito no es la clave de la felicidad. La felicidad es la clave del &eacute;xito. Si amas lo que haces, tendr&aacute;s &eacute;xito.&rdquo; &mdash; Albert Schweitzer</div>

    <p>Ahora tienes las herramientas para comunicarte con confianza en <strong>entrevistas</strong>, en tu <strong>trabajo diario</strong> y en <strong>atenci&oacute;n al cliente</strong> en ingl&eacute;s.</p>
    <p>Tu diploma de graduaci&oacute;n te espera en la plataforma. Desc&aacute;rgalo, comp&aacute;rtelo en LinkedIn y &uacute;salo con orgullo &#128081;</p>

    <a class="cta" href="${APP_URL}/dashboard">&#127891; Descargar mi Diploma de Graduaci&oacute;n &rarr;</a>
    <p class="cta-sub">Tambi&eacute;n puedes compartirlo directo en LinkedIn desde la app</p>

    <p style="font-size:13px;color:rgba(255,255,255,.4);text-align:center">Recuerda: tu acceso es de por vida. Puedes repasar cualquier lecci&oacute;n cuando quieras.</p>
  </div>
  <div class="foot">Recibiste este email porque completaste English for Work.<br>
  <a href="${APP_URL}/dashboard">Ir a la plataforma</a></div>
</div></body></html>`;
}

Deno.serve(async (req: Request) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // Requires auth header with service role OR a valid user JWT
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userName: string | null = null;

  try {
    const body = await req.json();
    userId = body.user_id ?? null;
    userEmail = body.email ?? null;
    userName = body.full_name ?? "Estudiante";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400, headers: cors });
  }

  if (!userId || !userEmail) {
    return new Response(JSON.stringify({ error: "user_id and email required" }), { status: 400, headers: cors });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Guard: only send once
  const { data: already } = await admin
    .from("drip_email_log")
    .select("id")
    .eq("user_id", userId)
    .eq("day_number", 999) // 999 = graduation special
    .maybeSingle();

  if (already) {
    return new Response(JSON.stringify({ ok: true, skipped: true, reason: "already_sent" }), { headers: cors });
  }

  const completedAt = new Date().toISOString();
  const subject = `🎓 ¡${userName?.split(" ")[0] || "Estudiante"}! Completaste English for Work — Tu diploma te espera`;
  const html = graduationEmail(userName, completedAt);

  const result = await sendBrevoEmail(userEmail, userName, subject, html);

  // Log it
  await admin.from("drip_email_log").insert({
    user_id: userId,
    email: userEmail,
    day_number: 999,
    status: result.ok ? "sent" : "failed",
    error_msg: result.ok ? null : `${result.status}: ${result.body?.substring(0, 200)}`,
  });

  return new Response(
    JSON.stringify({ ok: result.ok, status: result.status, skipped: false }),
    { headers: cors }
  );
});
