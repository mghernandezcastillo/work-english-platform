import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const APP_URL = "https://englishforworkapp.com";
// Sender en Brevo — cambiar a hola@englishforworkapp.com una vez el dominio esté verificado en Brevo
const SENDER = { name: "English for Work", email: "englishforworkapp@gmail.com" };

async function sendBrevoEmail(to: string, name: string, subject: string, html: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ sender: SENDER, to: [{ email: to, name }], subject, htmlContent: html }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

function base(content: string): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
body{margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif}
.wrap{max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hdr{background:linear-gradient(135deg,#1a1a2e,#2d2d5e);padding:36px 40px;text-align:center}
.hdr h1{color:#fff;font-size:22px;margin:0}.hdr p{color:#a0a0c0;font-size:13px;margin:6px 0 0}
.bd{padding:36px 40px}.bd p{font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px}
.cta{display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff!important;text-decoration:none;font-size:15px;font-weight:700;text-align:center;padding:14px 32px;border-radius:10px;margin:24px 0}
.tip{background:#f0f9ff;border-left:3px solid #6366f1;border-radius:8px;padding:14px 18px;margin:20px 0;font-size:14px}
.foot{background:#f9fafb;padding:20px 40px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #f0f0f0}
</style></head><body><div class="wrap">
  <div class="hdr"><h1>&#127758; English for Work</h1><p>Tu ingles profesional, un paso a la vez</p></div>
  <div class="bd">${content}</div>
  <div class="foot">Recibiste este email porque compraste English for Work.<br>
  <a href="${APP_URL}" style="color:#6366f1">Ir a la plataforma</a></div>
</div></body></html>`;
}

const templates: Record<number, (name: string, lessons: number) => { subject: string; html: string }> = {
  0: (name) => ({
    subject: "Bienvenido/a a English for Work!",
    html: base(`<p>Hola <strong>${name.split(" ")[0]}</strong>! &#128075;</p>
      <p>Tu acceso a <strong>English for Work</strong> esta listo. En 30 dias podras comunicarte con confianza en ingles en tu trabajo.</p>
      <div class="tip">&#128161; Haz al menos una leccion al dia. Son 10-15 minutos y estan disenadas para aprender haciendo, no memorizando.</div>
      <a class="cta" href="${APP_URL}/dashboard">Empezar ahora &#8594;</a>
      <p style="font-size:13px;color:#9ca3af;text-align:center">Tienes acceso completo: 36 lecciones + 12 simulaciones.</p>`),
  }),
  1: (name, lessons) => ({
    subject: lessons > 0 ? "Buen comienzo!" : "Ya visitaste la plataforma?",
    html: base(lessons > 0
      ? `<p>Hola <strong>${name.split(" ")[0]}</strong>! &#127881;</p>
         <p>Completaste <strong>${lessons} leccion${lessons>1?"es":""}</strong>. Ese es exactamente el ritmo correcto!</p>
         <div class="tip">&#128161; Hoy: Repasa en voz alta las frases de ayer. Escuchalas, pausalas, repitelas.</div>
         <a class="cta" href="${APP_URL}/dashboard">Continuar aprendiendo &#8594;</a>`
      : `<p>Hola <strong>${name.split(" ")[0]}</strong>! &#128075;</p>
         <p>Aun no has empezado. Tu primera leccion toma <strong>menos de 10 minutos</strong>.</p>
         <div class="tip">&#128161; No tienes que ser perfecto. Solo tienes que empezar.</div>
         <a class="cta" href="${APP_URL}/dashboard">Hacer mi primera leccion &#8594;</a>`),
  }),
  3: (name, lessons) => ({
    subject: "3 habitos que aceleran tu ingles",
    html: base(`<p>Hola <strong>${name.split(" ")[0]}</strong>!</p>
      ${lessons>0?`<p>Llevas <strong>${lessons} leccion${lessons>1?"es":""}</strong>. Vas muy bien! &#128170;</p>`:""}
      <p>&#127911; <strong>1. Escucha antes de leer.</strong> Tu cerebro aprende el sonido diferente al texto.</p>
      <p>&#128483;&#65039; <strong>2. Repite en voz alta siempre.</strong> Tu boca necesita acostumbrarse.</p>
      <p>&#128188; <strong>3. Usa una frase nueva hoy.</strong> En un email o una reunion. Una sola.</p>
      <a class="cta" href="${APP_URL}/dashboard">Practicar ahora &#8594;</a>`),
  }),
  5: (name, lessons) => ({
    subject: "Puedo pedirte un favor?",
    html: base(`<p>Hola <strong>${name.split(" ")[0]}</strong>!</p>
      <p>Llevas 5 dias${lessons>0?` y completaste <strong>${lessons} leccion${lessons>1?"es":""}</strong>`:""}.
      Puedes <strong>contarme como va tu experiencia</strong>?</p>
      <a class="cta" href="mailto:englishforworkapp@gmail.com?subject=Mi%20experiencia%20con%20English%20for%20Work">Escribirme &#8594;</a>
      <p style="font-size:13px;color:#9ca3af;text-align:center">O simplemente responde este email.</p>`),
  }),
  7: (name, lessons) => ({
    subject: lessons >= 3 ? "Una semana. Lo estas logrando!" : "Necesitas ayuda para arrancar?",
    html: base(lessons >= 3
      ? `<p>Hola <strong>${name.split(" ")[0]}</strong>! &#127881;</p>
         <p>Completaste <strong>${lessons} lecciones</strong> en una semana. Eso te pone en el top!</p>
         <div class="tip">&#127919; Esta semana: Completa una simulacion completa.</div>
         <a class="cta" href="${APP_URL}/simulaciones">Ver simulaciones &#8594;</a>`
      : `<p>Hola <strong>${name.split(" ")[0]}</strong>! &#128075;</p>
         <p>Una semana. Tu meta sigue ahi. Solo 10 minutos hoy.</p>
         <a class="cta" href="${APP_URL}/dashboard">Empezar ahora &#8594;</a>`),
  }),
};

Deno.serve(async (req: Request) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  let targetDay: number | null = null;
  let testEmail: string | null = null;
  let testName = "Estudiante";
  if (req.method === "POST") {
    try { const b = await req.json(); targetDay = b.targetDay ?? null; testEmail = b.testEmail ?? null; testName = b.testName ?? "Estudiante"; } catch {}
  }

  // MODO TEST — retorna respuesta exacta de Brevo
  if (testEmail !== null && targetDay !== null) {
    const fn = templates[targetDay];
    if (!fn) return new Response(JSON.stringify({ error: "day must be 0,1,3,5,7" }), { status: 400, headers: cors });
    const { subject, html } = fn(testName, 2);
    const result = await sendBrevoEmail(testEmail, testName, subject, html);
    return new Response(JSON.stringify({
      test: true, day: targetDay, to: testEmail,
      brevoStatus: result.status, brevoOk: result.ok,
      brevoResponse: result.body,
      senderUsed: SENDER.email,
    }), { headers: cors });
  }

  // MODO NORMAL (cron diario a las 10 AM UTC)
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const DAY_NUMBERS = targetDay !== null ? [targetDay] : [0, 1, 3, 5, 7];
  const summary: any[] = [];

  for (const day of DAY_NUMBERS) {
    const now = new Date();
    const start = day === 0 ? new Date(now.getTime() - 2*3600000) : new Date(now.getTime() - (day+0.5)*86400000);
    const end   = day === 0 ? now : new Date(now.getTime() - (day-0.5)*86400000);
    const { data: profiles } = await admin.from("profiles").select("id,email,full_name")
      .eq("access_type","paid").gte("created_at",start.toISOString()).lte("created_at",end.toISOString());
    if (!profiles?.length) { summary.push({ day, users: 0, sent: 0 }); continue; }
    let sent = 0;
    for (const p of profiles) {
      const { data: already } = await admin.from("drip_email_log").select("id")
        .eq("user_id",p.id).eq("day_number",day).maybeSingle();
      if (already) continue;
      const { count } = await admin.from("user_progress").select("*",{count:"exact",head:true})
        .eq("user_id",p.id).eq("completed",true);
      const fn = templates[day]; if (!fn) continue;
      const name = p.full_name || "Estudiante";
      const { subject, html } = fn(name, count ?? 0);
      const result = await sendBrevoEmail(p.email, name, subject, html);
      await admin.from("drip_email_log").insert({
        user_id: p.id, email: p.email, day_number: day,
        status: result.ok ? "sent" : "failed",
        error_msg: result.ok ? null : `${result.status}: ${result.body?.substring(0,200)}`,
      });
      if (result.ok) sent++;
    }
    summary.push({ day, users: profiles.length, sent });
  }
  return new Response(JSON.stringify({ ok:true, summary, totalSent:summary.reduce((a,s)=>a+s.sent,0) }), { headers: cors });
});
