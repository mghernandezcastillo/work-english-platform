import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ================================================================
// invite-beta-user
// Crea cuenta con acceso 'paid' para un beta tester y le envía
// un magic link por email para que entre directamente.
//
// POST body: { email, name, notes? }
// ================================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const APP_URL = "https://english-for-work.vercel.app";
const SENDER = { name: "English for Work", email: "englishforworkapp@gmail.com" };

Deno.serve(async (req: Request) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  const { email, name, notes } = await req.json();
  if (!email) return new Response(JSON.stringify({ error: "email required" }), { status: 400, headers: cors });

  const cleanEmail = email.toLowerCase().trim();
  const displayName = name || cleanEmail.split("@")[0];

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Verificar si ya existe el usuario
  const { data: { users } } = await admin.auth.admin.listUsers();
  const existing = users?.find((u: any) => u.email?.toLowerCase() === cleanEmail);

  let userId: string;
  let isNew = false;

  if (existing) {
    userId = existing.id;
  } else {
    // 2. Crear cuenta nueva con contraseña temporal
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    const tempPass = Array.from(arr).map(b => chars[b % chars.length]).join("");

    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: tempPass,
      email_confirm: true,
      user_metadata: { full_name: displayName, is_beta: true },
    });

    if (createErr || !newUser?.user) {
      return new Response(JSON.stringify({ error: createErr?.message ?? "Failed to create user" }), { status: 500, headers: cors });
    }
    userId = newUser.user.id;
    isNew = true;
    await new Promise(r => setTimeout(r, 600)); // esperar trigger
  }

  // 3. Actualizar perfil con acceso paid + marca beta
  await admin.from("profiles").update({
    access_type: "paid",
    full_name: displayName,
  }).eq("id", userId);

  // 4. Registrar en beta_invites
  await admin.from("beta_invites").upsert({
    email: cleanEmail,
    name: displayName,
    user_id: userId,
    notes: notes ?? null,
    status: "invited",
  }, { onConflict: "email" });

  // 5. Generar magic link para entrada directa
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: cleanEmail,
    options: { redirectTo: `${APP_URL}/dashboard` },
  });

  const magicLink = linkData?.properties?.action_link ?? `${APP_URL}/login`;

  // 6. Enviar email de invitación beta
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hdr{background:linear-gradient(135deg,#1a1a2e,#2d2d5e);padding:36px 40px;text-align:center}
.hdr h1{color:#fff;font-size:22px;margin:0}.hdr p{color:#a0a0c0;font-size:13px;margin:6px 0 0}
.bd{padding:36px 40px}.bd p{font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px}
.badge{display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:.5px;margin-bottom:16px}
.cta{display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff!important;text-decoration:none;font-size:15px;font-weight:700;text-align:center;padding:16px 32px;border-radius:10px;margin:24px 0}
.tip{background:#f0f9ff;border-left:3px solid #6366f1;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:14px}
.foot{background:#f9fafb;padding:20px 40px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #f0f0f0}
</style></head><body><div class="wrap">
<div class="hdr"><h1>&#127758; English for Work</h1><p>Tu ingles profesional, un paso a la vez</p></div>
<div class="bd">
  <span class="badge">&#11088; ACCESO BETA</span>
  <p>Hola <strong>${displayName.split(" ")[0]}</strong>! &#128075;</p>
  <p>Te he dado acceso gratuito a <strong>English for Work</strong> como parte del grupo beta. Eres de las primeras personas en probar la plataforma.</p>
  <p>Tienes acceso completo a <strong>todas las lecciones y simulaciones</strong>. Lo unico que te pido a cambio es que me cuentes tu experiencia honesta.</p>
  <div class="tip">&#128161; El link de abajo te entra directo a tu cuenta sin necesidad de contrasena. Solo haz clic.</div>
  <a class="cta" href="${magicLink}">Entrar a la plataforma ahora &#8594;</a>
  <p style="font-size:13px;color:#9ca3af">
    El link expira en 24 horas. Si vence, escribeme y te mando otro.<br>
    Despues de entrar puedes cambiar tu contrasena desde tu perfil.
  </p>
</div>
<div class="foot">English for Work — Acceso Beta<br>
<a href="${APP_URL}" style="color:#6366f1">english-for-work.vercel.app</a></div>
</div></body></html>`;

  const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: SENDER,
      to: [{ email: cleanEmail, name: displayName }],
      subject: "&#11088; Tu acceso beta a English for Work esta listo",
      htmlContent: html,
    }),
  });

  const emailOk = emailRes.ok;
  const emailBody = await emailRes.text();

  return new Response(JSON.stringify({
    success: true,
    userId,
    email: cleanEmail,
    name: displayName,
    isNew,
    emailSent: emailOk,
    magicLink: magicLink !== `${APP_URL}/login` ? "generated" : "fallback",
    brevoResponse: emailOk ? "ok" : emailBody.substring(0, 200),
  }), { headers: cors });
});
