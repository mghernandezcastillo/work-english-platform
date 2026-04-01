#!/usr/bin/env node
/**
 * Updates sim-r1, sim-r2, sim-r3 with rich 7-8 turn content + ElevenLabs audio.
 * Usage:
 *   $env:ELEVENLABS_API_KEY="sk_..."
 *   $env:SUPABASE_SERVICE_KEY="eyJ..."
 *   node scripts/update-rich-simulations.js
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ELEVENLABS_API_KEY   = process.env.ELEVENLABS_API_KEY || ''

const VOICE_FEMALE = 'EXAVITQu4vr4xnSDxMaL' // Sarah
const VOICE_MALE   = 'N2lVS1w4EtoT3dr4eOWO' // Callum
const STORAGE_BUCKET = 'sim-audios'

if (!ELEVENLABS_API_KEY)   { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }
if (!SUPABASE_SERVICE_KEY) { console.error('❌ Set SUPABASE_SERVICE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const sleep = ms => new Promise(r => setTimeout(r, ms))

// ─── RICH SIMULATION CONTENT ─────────────────────────────────────────────────

const RICH_UPDATES = {
  'sim-r1': {
    title: 'Tu primer día en el trabajo',
    description: 'Llegas a una empresa nueva. Debes presentarte, encontrar tu puesto y hablar con tu supervisor.',
    turns: [
      { id:'t1', speaker:'Receptionist (Ana)', vg:'female',
        context: 'Llegas a la recepción. La recepcionista te saluda.',
        prompt: "Good morning! Welcome. How can I help you today?",
        promptEs: "¡Buenos días! Bienvenido. ¿En qué te puedo ayudar?",
        options: ["Hi! I am Carlos Vega. It is my first day. I am here to see HR.", "Hello. Where is the office?", "Good morning. I want to start working now."],
        correct: "Hi! I am Carlos Vega. It is my first day. I am here to see HR.",
        explanation: "La mejor respuesta da tu nombre completo, menciona que es tu primer día y especifica con quién tienes cita." },
      { id:'t2', speaker:'HR Manager (Sarah)', vg:'female',
        context: 'HR te recibe en su oficina.',
        prompt: "Welcome! We are so glad to have you. Could you tell me a little about your experience?",
        promptEs: "¡Bienvenido! Nos alegra tenerte. ¿Puedes contarnos sobre tu experiencia?",
        options: ["Thank you! I have two years in customer service. I am very excited to start here.", "Yes, I worked before. It was okay.", "I do not have a lot of experience but I will try."],
        correct: "Thank you! I have two years in customer service. I am very excited to start here.",
        explanation: "Positivo, profesional y entusiasta — exactamente lo que HR quiere el primer día." },
      { id:'t3', speaker:'HR Manager (Sarah)', vg:'female',
        context: 'Sarah te explica el horario.',
        prompt: "Your working hours are Monday to Friday, from 8 to 5. Does that work for you?",
        promptEs: "Tu horario es de lunes a viernes, de 8 a 5. ¿Está bien?",
        options: ["Yes, that works perfectly. Is there a break in between?", "Okay. Can I leave early sometimes?", "I think so, but I am not sure about Fridays."],
        correct: "Yes, that works perfectly. Is there a break in between?",
        explanation: "Confirmas el horario con una respuesta positiva y haces una pregunta profesional relevante." },
      { id:'t4', speaker:'Supervisor (James)', vg:'male',
        context: 'Tu supervisor te muestra tu puesto de trabajo.',
        prompt: "This is your workstation. You will find everything you need here. Any questions so far?",
        promptEs: "Este es tu puesto. Encontrarás todo lo necesario aquí. ¿Alguna pregunta?",
        options: ["Thank you! Could you show me where the main tools and resources are?", "No, everything is fine. I will figure it out.", "I have many questions, this is all new to me."],
        correct: "Thank you! Could you show me where the main tools and resources are?",
        explanation: "Agradeces y haces una pregunta concreta que demuestra iniciativa." },
      { id:'t5', speaker:'Supervisor (James)', vg:'male',
        context: 'James te asigna tu primera tarea.',
        prompt: "For today, I need you to review these reports and send me a summary by 3 PM. Is that clear?",
        promptEs: "Para hoy, necesito que revises estos reportes y me envíes un resumen antes de las 3 PM.",
        options: ["Yes, review the reports and send you a summary by 3 PM. I will get started right away.", "Okay, I guess I can do that. Where are the reports?", "I am not sure I can do that today, it is my first day."],
        correct: "Yes, review the reports and send you a summary by 3 PM. I will get started right away.",
        explanation: "Repites la tarea para confirmar comprensión y dices que empiezas inmediatamente — genera confianza." },
      { id:'t6', speaker:'Coworker (Maria)', vg:'female',
        context: 'Una compañera se acerca en la hora del almuerzo.',
        prompt: "Hey! I am Maria. We usually have lunch together as a team. Would you like to join us?",
        promptEs: "¡Hola! Soy María. Normalmente almorzamos juntos. ¿Te gustaría acompañarnos?",
        options: ["Hi Maria! I am Carlos. I would love to join, thank you so much!", "Sure. I do not know anyone here anyway.", "Maybe next time, I need to keep working."],
        correct: "Hi Maria! I am Carlos. I would love to join, thank you so much!",
        explanation: "Te presentas, aceptas con entusiasmo y agradeces. Construir relaciones desde el primer día es clave." },
      { id:'t7', speaker:'Supervisor (James)', vg:'male',
        context: 'Al final del día, James te pregunta cómo te fue.',
        prompt: "So, how was your first day? Do you feel comfortable with everything?",
        promptEs: "¿Cómo estuvo tu primer día? ¿Te sientes cómodo con todo?",
        options: ["It was great! I feel comfortable so far. I look forward to learning more tomorrow.", "It was okay. Some things are confusing but I will manage.", "Honestly, it was a lot of information. I hope I remember everything."],
        correct: "It was great! I feel comfortable so far. I look forward to learning more tomorrow.",
        explanation: "Positivo, profesional y orientado al aprendizaje. Cierra tu primer día con una impresión excelente." },
    ]
  },
  'sim-r2': {
    title: 'Entrevista de trabajo bilingüe',
    description: 'Entrevista completa para un puesto de customer service en empresa internacional.',
    turns: [
      { id:'t1', speaker:'Interviewer (Laura)', vg:'female',
        context: 'Entras a la sala. La entrevistadora te saluda.',
        prompt: "Good afternoon! Please come in and have a seat. Thank you for coming today.",
        promptEs: "¡Buenas tardes! Entra y siéntate. Gracias por venir hoy.",
        options: ["Good afternoon! Thank you for the opportunity. I have been looking forward to this.", "Hi! Yes, glad to be here. Nice office!", "Thank you. Sorry if I am a little nervous."],
        correct: "Good afternoon! Thank you for the opportunity. I have been looking forward to this.",
        explanation: "Profesional y positivo. Nunca menciones que estás nervioso al abrir una entrevista." },
      { id:'t2', speaker:'Interviewer (Laura)', vg:'female',
        context: 'La pregunta clásica de apertura.',
        prompt: "So, tell me about yourself.",
        promptEs: "Entonces, cuéntame sobre ti.",
        options: ["I have two years in customer service. I am organized and results-driven, and I am excited because this role combines my communication skills with my passion for English.", "Well, I am 28, I live in Bogotá and I know some English.", "I am a hard worker and I really need this job."],
        correct: "I have two years in customer service. I am organized and results-driven, and I am excited because this role combines my communication skills with my passion for English.",
        explanation: "Experiencia relevante + dos cualidades + conexión con el puesto. Concisa, profesional y entusiasta." },
      { id:'t3', speaker:'Interviewer (Laura)', vg:'female',
        context: 'Pregunta sobre fortalezas.',
        prompt: "What would you say is your greatest strength?",
        promptEs: "¿Cuál es tu mayor fortaleza?",
        options: ["My greatest strength is staying calm under pressure. When customers are frustrated, I focus on listening and finding solutions step by step.", "I am very friendly and get along with everyone.", "I think I am good at many things."],
        correct: "My greatest strength is staying calm under pressure. When customers are frustrated, I focus on listening and finding solutions step by step.",
        explanation: "Fortaleza concreta + relevante para el puesto + cómo se aplica en situaciones reales." },
      { id:'t4', speaker:'Interviewer (Laura)', vg:'female',
        context: 'Pregunta sobre debilidades.',
        prompt: "And what is an area you are working to improve?",
        promptEs: "¿Y en qué área estás trabajando para mejorar?",
        options: ["I am working on delegating more effectively. I tend to want to handle everything myself, so I practice dividing responsibilities.", "I have no real weaknesses, I am pretty good at everything.", "I am really bad at time management, always late with things."],
        correct: "I am working on delegating more effectively. I tend to want to handle everything myself, so I practice dividing responsibilities.",
        explanation: "Debilidad real + auto-conciencia + acción correctiva. Nunca digas que no tienes debilidades." },
      { id:'t5', speaker:'Interviewer (Laura)', vg:'female',
        context: 'Pregunta sobre un cliente difícil.',
        prompt: "Can you tell me about a time you handled a difficult customer?",
        promptEs: "¿Puedes contarme de una vez que manejaste a un cliente difícil?",
        options: ["Once a customer called upset about a billing error. I listened carefully, apologized, and escalated to the billing team while keeping them informed. They ended the call satisfied.", "I have had a few. Some customers are just impossible.", "I always try to stay calm and move on."],
        correct: "Once a customer called upset about a billing error. I listened carefully, apologized, and escalated to the billing team while keeping them informed. They ended the call satisfied.",
        explanation: "Método STAR: Situación → Acción → Resultado. Demuestras manejo de situaciones difíciles con resultado positivo." },
      { id:'t6', speaker:'Interviewer (Laura)', vg:'female',
        context: 'Pregunta sobre salario.',
        prompt: "What are your salary expectations for this position?",
        promptEs: "¿Cuáles son tus expectativas salariales?",
        options: ["Based on my experience, I am expecting between two and two point five million pesos. I am open to discussion depending on the full benefits package.", "I want as much as possible. What is the maximum?", "I do not know. Whatever is fair."],
        correct: "Based on my experience, I am expecting between two and two point five million pesos. I am open to discussion depending on the full benefits package.",
        explanation: "Rango específico + basado en experiencia + actitud flexible. Siempre investiga el mercado antes." },
      { id:'t7', speaker:'Interviewer (Laura)', vg:'female',
        context: 'La entrevistadora te invita a preguntar.',
        prompt: "Do you have any questions for me?",
        promptEs: "¿Tienes alguna pregunta para mí?",
        options: ["Yes! What does a typical day look like, and what are the main success metrics for the first 90 days?", "No, I think I have everything. Thank you.", "When will I know the result? And how much vacation do I get?"],
        correct: "Yes! What does a typical day look like, and what are the main success metrics for the first 90 days?",
        explanation: "KPIs y día a día muestran que piensas a largo plazo. NO preguntes sobre vacaciones en la primera entrevista." },
      { id:'t8', speaker:'Interviewer (Laura)', vg:'female',
        context: 'La entrevistadora cierra.',
        prompt: "Great. We will be in touch within the next few days. Thank you so much for coming in.",
        promptEs: "Perfecto. Nos comunicaremos en los próximos días. Gracias por venir.",
        options: ["Thank you so much, Laura. I really enjoyed our conversation and I am very excited about this opportunity. I look forward to hearing from you.", "Okay, cool. I will wait for your call.", "Thank you. I hope I did well."],
        correct: "Thank you so much, Laura. I really enjoyed our conversation and I am very excited about this opportunity. I look forward to hearing from you.",
        explanation: "Usas el nombre (crea conexión), expresas entusiasmo y terminas con frase profesional. La última impresión importa tanto como la primera." },
    ]
  },
  'sim-r3': {
    title: 'Llamada con cliente frustrado',
    description: 'Atiendes a un cliente enojado con un problema de facturación. Debes resolver su caso manteniendo la calma.',
    turns: [
      { id:'t1', speaker:'Your opening', vg:'female',
        context: 'Suena el teléfono. Debes contestar profesionalmente.',
        prompt: "The phone is ringing. Answer the call now.",
        promptEs: "El teléfono suena. Contesta la llamada ahora.",
        options: ["Thank you for calling TechConnect. My name is Carlos. How may I help you today?", "Hello? Yes, customer service. What do you want?", "TechConnect, Carlos speaking. What is your problem?"],
        correct: "Thank you for calling TechConnect. My name is Carlos. How may I help you today?",
        explanation: "Saludo profesional: nombre de empresa + tu nombre + oferta de ayuda. 'How may I help you?' es más formal que 'What do you want?'" },
      { id:'t2', speaker:'Customer (John)', vg:'male',
        context: 'El cliente contesta muy molesto.',
        prompt: "Finally! I have been on hold for 20 minutes! I have a charge on my bill that I did not authorize!",
        promptEs: "¡Por fin! ¡Llevo 20 minutos en espera! ¡Tengo un cargo que no autoricé!",
        options: ["I completely understand your frustration and I sincerely apologize for the wait. I am here to help you resolve this right away. Could I have your account number?", "Sir, please calm down. I am sure there is a simple explanation.", "I am sorry but I was not responsible for the hold time."],
        correct: "I completely understand your frustration and I sincerely apologize for the wait. I am here to help you resolve this right away. Could I have your account number?",
        explanation: "Validas su emoción + te disculpas sin defenderte + ofreces ayuda inmediata. Nunca le digas a un cliente que 'se calme'." },
      { id:'t3', speaker:'Customer (John)', vg:'male',
        context: 'El cliente te da su información.',
        prompt: "My account number is 4471-B. The charge is for 49 dollars and I have no idea what it is for!",
        promptEs: "Mi cuenta es 4471-B. El cargo es de 49 dólares y no sé de qué.",
        options: ["Thank you. Could I also get your last name to verify your account? I want to make sure I am looking at the right account.", "Okay, let me check that. One moment please.", "49 dollars is not that much. Let me see."],
        correct: "Thank you. Could I also get your last name to verify your account? I want to make sure I am looking at the right account.",
        explanation: "Verificar identidad antes de acceder a la cuenta es un procedimiento estándar de seguridad en call centers." },
      { id:'t4', speaker:'Customer (John)', vg:'male',
        context: 'El cliente te da su apellido y espera.',
        prompt: "It is Miller. John Miller. Are you looking at it now?",
        promptEs: "Es Miller. John Miller. ¿Lo estás revisando?",
        options: ["Yes, Mr. Miller. I am pulling up your account right now. Please bear with me for just a moment.", "Yes yes, I am checking. Just wait.", "I need to put you on hold while I look at this. Do not hang up."],
        correct: "Yes, Mr. Miller. I am pulling up your account right now. Please bear with me for just a moment.",
        explanation: "'Bear with me' es la frase profesional para pedir que espere. Usar su nombre crea conexión y personaliza la atención." },
      { id:'t5', speaker:'Customer (John)', vg:'male',
        context: 'Descubres que fue un error de facturación duplicada.',
        prompt: "Well? Did you find it? What is that charge for?",
        promptEs: "¿Lo encontraste? ¿Para qué es ese cargo?",
        options: ["Yes, Mr. Miller. It appears this was an error on our end — a duplicate billing. I am going to reverse it right now and it will be credited within 3 to 5 business days.", "Yes, it looks like something went wrong with the system. These things happen.", "I found it. Are you sure you did not sign up for anything?"],
        correct: "Yes, Mr. Miller. It appears this was an error on our end — a duplicate billing. I am going to reverse it right now and it will be credited within 3 to 5 business days.",
        explanation: "Confirmas el error sin excusas, das plazo específico y usas voz activa para mostrar acción inmediata." },
      { id:'t6', speaker:'Customer (John)', vg:'male',
        context: 'El cliente sigue molesto por el tiempo de espera.',
        prompt: "Fine. But this is unacceptable. I wasted 30 minutes because of your mistake!",
        promptEs: "Bien. Pero esto es inaceptable. ¡Desperdicié 30 minutos por su error!",
        options: ["You are absolutely right, Mr. Miller. On behalf of TechConnect, I sincerely apologize. As a gesture of goodwill, I would like to offer you a 10-dollar credit on your next bill.", "I understand. But these things happen sometimes.", "I agree it should not have happened. We will try to do better."],
        correct: "You are absolutely right, Mr. Miller. On behalf of TechConnect, I sincerely apologize. As a gesture of goodwill, I would like to offer you a 10-dollar credit on your next bill.",
        explanation: "Le das la razón + te disculpas en nombre de la empresa + ofreces compensación proactiva. 'Gesture of goodwill' es estándar en call centers para quejas elevadas." },
      { id:'t7', speaker:'Customer (John)', vg:'male',
        context: 'El cliente acepta y su tono se suaviza.',
        prompt: "Okay. Fine. I appreciate that. So the 49 dollars will come back and I get 10 off next month?",
        promptEs: "Está bien. Lo aprecio. ¿Me regresan los 49 y tengo 10 de descuento el próximo mes?",
        options: ["That is exactly right, Mr. Miller. The 49-dollar reversal will process in 3 to 5 days and the 10-dollar credit will apply automatically. I will also send you a confirmation email. Is there anything else I can help you with?", "Yes, that is correct. Anything else?", "Yes. Check your account in a few days."],
        correct: "That is exactly right, Mr. Miller. The 49-dollar reversal will process in 3 to 5 days and the 10-dollar credit will apply automatically. I will also send you a confirmation email. Is there anything else I can help you with?",
        explanation: "Confirmas los detalles exactos, mencionas el email de confirmación (genera confianza) y terminas con la pregunta estándar de cierre." },
      { id:'t8', speaker:'Customer (John)', vg:'male',
        context: 'El cliente está satisfecho y listo para terminar.',
        prompt: "No, that is all. Thank you for sorting this out.",
        promptEs: "No, eso es todo. Gracias por resolver esto.",
        options: ["You are very welcome, Mr. Miller! I am glad we could resolve this for you. Thank you for your patience and for calling TechConnect. Have a wonderful day!", "No problem. Bye.", "Great. Thanks for calling. Bye bye!"],
        correct: "You are very welcome, Mr. Miller! I am glad we could resolve this for you. Thank you for your patience and for calling TechConnect. Have a wonderful day!",
        explanation: "Agradeces su paciencia, usas su nombre y terminas con un deseo positivo. El cierre profesional es tan importante como la apertura." },
    ]
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function checkQuota() {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  if (!res.ok) throw new Error(`ElevenLabs auth: ${await res.text()}`)
  const d = await res.json()
  const remaining = (d.character_limit || 10000) - (d.character_count || 0)
  console.log(`📊 ElevenLabs: ${d.character_count}/${d.character_limit} chars | ${remaining} disponibles\n`)
  return remaining
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === STORAGE_BUCKET)) {
    await supabase.storage.createBucket(STORAGE_BUCKET, { public: true, allowedMimeTypes: ['audio/mpeg'] })
    console.log(`✅ Bucket '${STORAGE_BUCKET}' creado`)
  }
}

async function generateAudio(text, vg) {
  const voiceId = vg === 'male' ? VOICE_MALE : VOICE_FEMALE
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_API_KEY },
    body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function upload(buffer, path) {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎧 Rich Simulation Updater\n')
  let remaining = await checkQuota()
  if (remaining < 200) { console.error('❌ Cuota insuficiente'); process.exit(1) }
  await ensureBucket()

  let totalGenerated = 0
  let totalChars = 0

  for (const [simId, update] of Object.entries(RICH_UPDATES)) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`🎬 ${simId}: ${update.title}`)

    // Build content with voiceGender mapped to correct field name
    const turns = update.turns.map(t => ({
      id: t.id, speaker: t.speaker, voiceGender: t.vg,
      context: t.context, prompt: t.prompt, promptEs: t.promptEs,
      options: t.options, correct: t.correct, explanation: t.explanation
    }))

    // Fetch current content to check existing audioUrls
    const { data: current, error: fetchErr } = await supabase
      .from('simulations').select('content').eq('id', simId).single()
    if (fetchErr) { console.error(`  ❌ Fetch error: ${fetchErr.message}`); continue }

    // Merge existing audioUrls into new turns
    const existingTurns = current?.content?.turns || []
    for (let i = 0; i < turns.length; i++) {
      const existing = existingTurns[i]
      if (existing?.audioUrl) turns[i].audioUrl = existing.audioUrl
    }

    // Update content first (new turns, no audio yet for new ones)
    const newContent = { ...(current?.content || {}), ...{ scenario: update.turns[0]?.context || '', turns } }
    const { error: updateErr } = await supabase.from('simulations').update({
      title: update.title,
      description: update.description,
      content: newContent
    }).eq('id', simId)
    if (updateErr) { console.error(`  ❌ Update error: ${updateErr.message}`); continue }
    console.log(`  ✅ Content updated (${turns.length} turns)`)

    // Generate audio for turns without audioUrl
    let changed = false
    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i]
      if (turn.audioUrl) { console.log(`  ⏭  Turn ${i+1}: ya tiene audio`); continue }
      const text = turn.prompt
      if (totalChars + text.length > remaining - 100) {
        console.log(`  ⚠️  Turn ${i+1}: cuota casi agotada, saltando`)
        continue
      }
      process.stdout.write(`  🔊 Turn ${i+1} [${turn.voiceGender}]: "${text.substring(0,45)}..." `)
      try {
        const audio = await generateAudio(text, turn.voiceGender)
        const url = await upload(audio, `${simId}/turn-${i}.mp3`)
        turns[i].audioUrl = url
        newContent.turns[i].audioUrl = url
        changed = true
        totalGenerated++
        totalChars += text.length
        console.log(`✅ (${text.length}ch, ${remaining - totalChars} restantes)`)
        await sleep(600)
      } catch (err) {
        console.log(`❌ ${err.message}`)
      }
    }

    if (changed) {
      const { error } = await supabase.from('simulations').update({ content: newContent }).eq('id', simId)
      if (error) console.error(`  ❌ DB audio save: ${error.message}`)
      else console.log(`  💾 Audio URLs saved`)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log('🎉 ¡Completado!')
  console.log(`   ✅ ${totalGenerated} audios generados`)
  console.log(`   📝 ~${totalChars} caracteres usados`)
  console.log(`   📊 ~${remaining - totalChars} chars restantes en ElevenLabs`)
}

main().catch(err => { console.error('\n💥', err.message); process.exit(1) })
