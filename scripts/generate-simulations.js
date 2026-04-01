#!/usr/bin/env node
/**
 * Simulation Audio Generator — English for Work
 * 
 * 1. Seeds 3 simulations (1 per route) into Supabase `simulations` table
 * 2. Generates ElevenLabs audio for each turn prompt (speaker turns)
 * 3. Uploads MP3s to Supabase Storage bucket `sim-audios`
 * 4. Updates audioUrl field in each turn
 *
 * Usage:
 *   $env:ELEVENLABS_API_KEY="sk_..."
 *   $env:SUPABASE_SERVICE_KEY="eyJ..."
 *   node scripts/generate-simulations.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ELEVENLABS_API_KEY   = process.env.ELEVENLABS_API_KEY || ''

// Female voice — used for HR/receptionist/trainer (Sarah)
const VOICE_FEMALE = 'EXAVITQu4vr4xnSDxMaL'
// Male voice — used for managers/interviewers (Callum)
const VOICE_MALE   = 'N2lVS1w4EtoT3dr4eOWO'

const STORAGE_BUCKET = 'sim-audios'

if (!ELEVENLABS_API_KEY)   { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }
if (!SUPABASE_SERVICE_KEY) { console.error('❌ Set SUPABASE_SERVICE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── SIMULATION SCRIPTS ──────────────────────────────────────────────────────

const SIMULATIONS = [
  {
    id: 'sim-route-1',
    title: 'Tu primer día en el trabajo',
    description: 'Llegas a una empresa nueva. Debes presentarte, encontrar tu puesto y hablar con tu supervisor.',
    route_id: null, // filled dynamically by route title match
    routeKey: 'Inglés para Conseguir Trabajo',
    sort_order: 1,
    content: {
      scenario: 'Es tu primer día en una empresa de servicios. Llegas a la recepción y necesitas presentarte, encontrar tu puesto y recibir instrucciones de tu supervisor.',
      duration: '5-7 minutos',
      turns: [
        {
          id: 't1',
          speaker: 'Receptionist (Ana)',
          voiceGender: 'female',
          context: 'Llegas a la recepción de la empresa. La recepcionista te saluda.',
          prompt: "Good morning! Welcome. How can I help you today?",
          promptEs: "¡Buenos días! Bienvenido. ¿En qué te puedo ayudar hoy?",
          options: [
            "Hi! I am Carlos Vega. It is my first day. I am here to see HR.",
            "Hello. Yes, I am new here. Where is the office?",
            "Good morning. I want to start working now."
          ],
          correct: "Hi! I am Carlos Vega. It is my first day. I am here to see HR.",
          explanation: "La mejor respuesta da tu nombre completo, menciona que es tu primer día y explica con quién tienes cita — información clave para la recepcionista."
        },
        {
          id: 't2',
          speaker: 'HR Manager (Sarah)',
          voiceGender: 'female',
          context: 'HR te recibe en su oficina.',
          prompt: "Welcome, Carlos! We are so glad to have you. Could you tell me a little about your experience?",
          promptEs: "¡Bienvenido, Carlos! Nos alegra tenerte. ¿Podrías contarnos un poco sobre tu experiencia?",
          options: [
            "Thank you! I have two years of experience in customer service. I am very excited to start here.",
            "Yes, I worked before. It was okay, not very interesting.",
            "I do not have a lot of experience, but I will try my best."
          ],
          correct: "Thank you! I have two years of experience in customer service. I am very excited to start here.",
          explanation: "Esta respuesta es positiva, profesional, menciona experiencia relevante y muestra entusiasmo — exactamente lo que HR quiere escuchar el primer día."
        },
        {
          id: 't3',
          speaker: 'HR Manager (Sarah)',
          voiceGender: 'female',
          context: 'Sarah te explica el horario.',
          prompt: "Your working hours are Monday to Friday, from 8 to 5. Does that work for you?",
          promptEs: "Tu horario es de lunes a viernes, de 8 a 5. ¿Está bien para ti?",
          options: [
            "Yes, that works perfectly for me. Is there a break in between?",
            "Okay. Can I leave early sometimes?",
            "I think so, but I am not sure about Fridays."
          ],
          correct: "Yes, that works perfectly for me. Is there a break in between?",
          explanation: "Confirmas el horario con una respuesta positiva y haces una pregunta lógica y profesional. Evitar pedir excepciones el primer día es importante."
        },
        {
          id: 't4',
          speaker: 'Supervisor (James)',
          voiceGender: 'male',
          context: 'Tu supervisor te lleva a tu puesto de trabajo.',
          prompt: "This is your workstation. You will find everything you need here. Any questions so far?",
          promptEs: "Este es tu puesto de trabajo. Aquí encontrarás todo lo que necesitas. ¿Alguna pregunta hasta ahora?",
          options: [
            "Thank you! Could you show me where the main tools and resources are?",
            "No, everything is fine. I will figure it out.",
            "I have many questions. This is all new to me."
          ],
          correct: "Thank you! Could you show me where the main tools and resources are?",
          explanation: "Agradeces y haces una pregunta específica y práctica. Eso muestra iniciativa e interés sin abrumarte."
        },
        {
          id: 't5',
          speaker: 'Supervisor (James)',
          voiceGender: 'male',
          context: 'James te asigna tu primera tarea.',
          prompt: "For today, I need you to review these reports and send me a summary by 3 PM. Is that clear?",
          promptEs: "Por hoy, necesito que revises estos reportes y me envíes un resumen antes de las 3 PM. ¿Quedó claro?",
          options: [
            "Yes, I understand. Review the reports and send you a summary by 3 PM. I will get started right away.",
            "Okay, I guess I can do that. Where are the reports?",
            "I am not sure I can do that today. It is my first day."
          ],
          correct: "Yes, I understand. Review the reports and send you a summary by 3 PM. I will get started right away.",
          explanation: "Repites la tarea para confirmar comprensión y dices que empiezas de inmediato. Esto genera confianza en tu supervisor desde el primer día."
        },
        {
          id: 't6',
          speaker: 'Coworker (Maria)',
          voiceGender: 'female',
          context: 'Una compañera se acerca en la hora del almuerzo.',
          prompt: "Hey! I am Maria. We usually have lunch together as a team. Would you like to join us?",
          promptEs: "¡Hola! Soy María. Normalmente almorzamos juntos como equipo. ¿Te gustaría acompañarnos?",
          options: [
            "Hi Maria! I am Carlos. I would love to join, thank you so much for the invitation!",
            "Sure. I do not know anyone here anyway.",
            "Maybe next time. I need to keep working."
          ],
          correct: "Hi Maria! I am Carlos. I would love to join, thank you so much for the invitation!",
          explanation: "Te presentas con tu nombre, aceptas con entusiasmo y agradeces. Construir relaciones desde el primer día es clave para integrarte bien."
        },
        {
          id: 't7',
          speaker: 'Supervisor (James)',
          voiceGender: 'male',
          context: 'Al final del día, James te pregunta cómo te fue.',
          prompt: "So, how was your first day? Do you feel comfortable with everything?",
          promptEs: "Entonces, ¿cómo estuvo tu primer día? ¿Te sientes cómodo con todo?",
          options: [
            "It was great, thank you! I feel comfortable so far. I am looking forward to learning more tomorrow.",
            "It was okay. Some things are confusing but I will manage.",
            "Honestly, it was a lot of information. I hope I remember everything."
          ],
          correct: "It was great, thank you! I feel comfortable so far. I am looking forward to learning more tomorrow.",
          explanation: "Respuesta positiva y profesional que demuestra actitud correcta hacia el aprendizaje. Cierra tu primer día con una impresión excelente."
        }
      ]
    }
  },
  {
    id: 'sim-route-2',
    title: 'Entrevista de trabajo bilingüe',
    description: 'Entrevista completa para un puesto de customer service en una empresa internacional.',
    route_id: null,
    routeKey: 'Inglés para Entrevistas',
    sort_order: 1,
    content: {
      scenario: 'Tienes una entrevista para un puesto de Customer Service Representative en una empresa bilingüe. La entrevistadora es la directora de RRHH.',
      duration: '7-9 minutos',
      turns: [
        {
          id: 't1',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'Entras a la sala de entrevista. La entrevistadora te saluda.',
          prompt: "Good afternoon! Please come in and have a seat. Thank you for coming today.",
          promptEs: "¡Buenas tardes! Por favor entra y siéntate. Gracias por venir hoy.",
          options: [
            "Good afternoon! Thank you for the opportunity. I have been looking forward to this interview.",
            "Hi! Yes, glad to be here. Nice office!",
            "Thank you. Sorry if I am a little nervous."
          ],
          correct: "Good afternoon! Thank you for the opportunity. I have been looking forward to this interview.",
          explanation: "Respuesta profesional y positiva que demuestra entusiasmo y respeto. Nunca menciones que estás nervioso (aunque lo estés) en la apertura de una entrevista."
        },
        {
          id: 't2',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora comienza con la pregunta clásica.',
          prompt: "So, tell me about yourself.",
          promptEs: "Entonces, cuéntame sobre ti.",
          options: [
            "Of course! I have two years of experience in customer service. I am organized, results-driven, and I enjoy helping customers solve their problems. I am excited about this role because it combines my communication skills with my passion for English.",
            "Well, I am 28 years old, I live in Bogotá, and I like working with people. I know some English.",
            "I am a hard worker and I really need this job. I can learn anything quickly."
          ],
          correct: "Of course! I have two years of experience in customer service. I am organized, results-driven, and I enjoy helping customers solve their problems. I am excited about this role because it combines my communication skills with my passion for English.",
          explanation: "La respuesta perfecta a 'Tell me about yourself': experiencia relevante, dos cualidades concretas, conección con el puesto. Es concisa, profesional y entusiasta."
        },
        {
          id: 't3',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora hace la pregunta de fortalezas.',
          prompt: "What would you say is your greatest strength?",
          promptEs: "¿Cuál dirías que es tu mayor fortaleza?",
          options: [
            "My greatest strength is my ability to stay calm under pressure. When customers are frustrated, I focus on listening and finding solutions step by step.",
            "I am a very friendly person and I get along with everyone.",
            "I think I am good at many things. It is hard to choose just one."
          ],
          correct: "My greatest strength is my ability to stay calm under pressure. When customers are frustrated, I focus on listening and finding solutions step by step.",
          explanation: "Esta respuesta nombra una fortaleza concreta, relevante para customer service, y la respalda con cómo se aplica en situaciones reales — exactamente lo que el método STAR recomienda."
        },
        {
          id: 't4',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora pregunta sobre debilidades.',
          prompt: "And what is an area you are working to improve?",
          promptEs: "¿Y cuál es un área en la que estás trabajando para mejorar?",
          options: [
            "I am working on delegating tasks more effectively. I tend to want to handle everything myself, so I have been practicing how to trust my team and divide responsibilities.",
            "I have no real weaknesses. I am pretty good at everything I do.",
            "I am really bad at time management. I am always late with things."
          ],
          correct: "I am working on delegating tasks more effectively. I tend to want to handle everything myself, so I have been practicing how to trust my team and divide responsibilities.",
          explanation: "Nombras una debilidad real (perfectamente humana), demuestras auto-conciencia y muestras que ya estás trabajando en ello. Nunca digas que 'no tienes debilidades'."
        },
        {
          id: 't5',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora pregunta sobre experiencia difícil.',
          prompt: "Can you tell me about a time you handled a difficult customer?",
          promptEs: "¿Puedes contarme sobre una vez que manejaste a un cliente difícil?",
          options: [
            "Sure. Once a customer called very upset about a billing error. I listened carefully, apologized for the inconvenience, and escalated the issue to the billing team while keeping the customer informed. They ended the call satisfied.",
            "I have had a few. Some customers are just impossible to deal with, honestly.",
            "I always try to be nice. If a customer is rude, I just stay calm and move on."
          ],
          correct: "Sure. Once a customer called very upset about a billing error. I listened carefully, apologized for the inconvenience, and escalated the issue to the billing team while keeping the customer informed. They ended the call satisfied.",
          explanation: "Respuesta perfecta usando el método STAR: Situación → Tarea → Acción → Resultado. Demuestras manejo de situaciones difíciles con un resultado positivo concreto."
        },
        {
          id: 't6',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora pregunta sobre el salario.',
          prompt: "What are your salary expectations for this position?",
          promptEs: "¿Cuáles son tus expectativas salariales para este puesto?",
          options: [
            "Based on my experience and the responsibilities of this role, I am expecting something in the range of two to two point five million pesos. I am open to discussion depending on the full benefits package.",
            "I want as much as possible. What is the maximum you can offer?",
            "I do not know. Whatever is fair, I guess."
          ],
          correct: "Based on my experience and the responsibilities of this role, I am expecting something in the range of two to two point five million pesos. I am open to discussion depending on the full benefits package.",
          explanation: "Das un rango específico y basado en tu experiencia, y te muestras flexible. Siempre investiga el mercado antes — nunca digas 'lo que sea' ni pidas el máximo sin justificación."
        },
        {
          id: 't7',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora te invita a hacer preguntas.',
          prompt: "Do you have any questions for me?",
          promptEs: "¿Tienes alguna pregunta para mí?",
          options: [
            "Yes! What does a typical day look like in this role, and what are the main success metrics for the first 90 days?",
            "No, I think I have all the information I need. Thank you.",
            "When will I know if I got the job? And how much vacation time do I get?"
          ],
          correct: "Yes! What does a typical day look like in this role, and what are the main success metrics for the first 90 days?",
          explanation: "Preguntar sobre el día a día y los KPIs de éxito muestra que piensas a largo plazo y entiendes cómo se mide el rendimiento. NO preguntes sobre vacaciones en la primera entrevista."
        },
        {
          id: 't8',
          speaker: 'Interviewer (Laura)',
          voiceGender: 'female',
          context: 'La entrevistadora cierra la entrevista.',
          prompt: "Great. We will be in touch within the next few days. Thank you so much for coming in.",
          promptEs: "Perfecto. Nos comunicaremos en los próximos días. Muchas gracias por venir.",
          options: [
            "Thank you so much, Laura. I really enjoyed our conversation and I am very excited about this opportunity. I look forward to hearing from you.",
            "Okay, cool. I will wait for your call then.",
            "Thank you. I hope I did well in the interview."
          ],
          correct: "Thank you so much, Laura. I really enjoyed our conversation and I am very excited about this opportunity. I look forward to hearing from you.",
          explanation: "Cierras usando el nombre de la entrevistadora (crea conexión), expresas entusiasmo y terminas con una frase positiva y profesional. La última impresión es tan importante como la primera."
        }
      ]
    }
  },
  {
    id: 'sim-route-3',
    title: 'Llamada con cliente frustrado',
    description: 'Atiendes a un cliente enojado con un problema de facturación. Debes resolver su caso manteniendo la calma.',
    route_id: null,
    routeKey: 'Inglés para Customer Service',
    sort_order: 1,
    content: {
      scenario: 'Trabajas en el call center de una empresa de telecomunicaciones. Recibes una llamada de un cliente frustrado que tiene un cobro incorrecto en su factura.',
      duration: '6-8 minutos',
      turns: [
        {
          id: 't1',
          speaker: 'Your opening',
          voiceGender: 'female',
          context: 'Suena el teléfono. Debes contestar la llamada profesionalmente.',
          prompt: "Ringing... It is your turn to answer the call.",
          promptEs: "Sonando... Es tu turno de contestar la llamada.",
          options: [
            "Thank you for calling TechConnect. My name is Carlos. How may I help you today?",
            "Hello? Yes, this is customer service. What do you want?",
            "TechConnect, Carlos speaking. What is your problem?"
          ],
          correct: "Thank you for calling TechConnect. My name is Carlos. How may I help you today?",
          explanation: "El saludo profesional estándar tiene tres partes: nombre de la empresa, tu nombre, y oferta de ayuda. 'How may I help you?' es más formal y cálido que 'What do you want?'"
        },
        {
          id: 't2',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente contesta muy molesto.',
          prompt: "Finally! I have been on hold for 20 minutes! I am very unhappy with your service. I have a charge on my bill that I did not authorize!",
          promptEs: "¡Por fin! ¡Llevo 20 minutos en espera! Estoy muy insatisfecho con su servicio. ¡Tengo un cargo en mi factura que no autoricé!",
          options: [
            "I completely understand your frustration, and I sincerely apologize for the wait. I am here to help you resolve this right away. Could I have your account number, please?",
            "Sir, please calm down. I am sure there is a simple explanation for the charge.",
            "I am sorry but I was not responsible for the hold time. Let me check your bill."
          ],
          correct: "I completely understand your frustration, and I sincerely apologize for the wait. I am here to help you resolve this right away. Could I have your account number, please?",
          explanation: "Validas la emoción del cliente, te disculpas sinceramente (sin defenderte), te ofreces a ayudar de inmediato y pides información específica. Nunca le digas a un cliente que 'se calme'."
        },
        {
          id: 't3',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente te da su información.',
          prompt: "My account number is 4471-B. The charge is for 49 dollars and I have no idea what it is for!",
          promptEs: "Mi número de cuenta es 4471-B. El cargo es de 49 dólares y ¡no sé de qué es!",
          options: [
            "Thank you, Mr... could I also get your last name to verify your account? I want to make sure I am looking at the right account.",
            "Okay, let me check that. One moment please.",
            "49 dollars is not that much. Let me see what happened."
          ],
          correct: "Thank you, Mr... could I also get your last name to verify your account? I want to make sure I am looking at the right account.",
          explanation: "Antes de acceder a información de la cuenta, debes verificar la identidad del cliente. Es un procedimiento estándar de seguridad en call centers."
        },
        {
          id: 't4',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente te da su apellido y espera mientras revisas.',
          prompt: "It is Miller. John Miller. Are you looking at it now?",
          promptEs: "Es Miller. John Miller. ¿Lo estás revisando ahora?",
          options: [
            "Yes, Mr. Miller. I am pulling up your account right now. Please bear with me for just a moment.",
            "Yes yes, I am checking. Just wait.",
            "I need to put you on hold while I look at this. Do not hang up."
          ],
          correct: "Yes, Mr. Miller. I am pulling up your account right now. Please bear with me for just a moment.",
          explanation: "'Bear with me' es una frase profesional para pedir que el cliente espere brevemente. Usar el nombre del cliente crea conexión y demuestra atención personalizada."
        },
        {
          id: 't5',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'Después de revisar, descubres que el cargo es un error del sistema. Le informas al cliente.',
          prompt: "Well? Did you find it? What is that charge for?",
          promptEs: "¿Bueno? ¿Lo encontraste? ¿Para qué es ese cargo?",
          options: [
            "Yes, Mr. Miller, I can see the charge. It appears this was an error on our end — a duplicate billing from last month. I am going to reverse it right now and it will be credited to your account within 3 to 5 business days.",
            "Yes, it looks like something went wrong with the system. These things happen sometimes.",
            "I found it. It says it is for a premium service. Are you sure you did not sign up for anything?"
          ],
          correct: "Yes, Mr. Miller, I can see the charge. It appears this was an error on our end — a duplicate billing from last month. I am going to reverse it right now and it will be credited to your account within 3 to 5 business days.",
          explanation: "Confirmas el error sin poner excusas, das un plazo específico de resolución y usas voz activa ('I am going to reverse it') para demostrar que estás tomando acción inmediata."
        },
        {
          id: 't6',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente sigue molesto por el tiempo de espera.',
          prompt: "Fine. But this is unacceptable. I wasted 30 minutes of my day because of your mistake!",
          promptEs: "Bien. Pero esto es inaceptable. ¡Desperdicié 30 minutos de mi día por su error!",
          options: [
            "You are absolutely right, Mr. Miller, and I completely understand your frustration. On behalf of TechConnect, I sincerely apologize for the inconvenience. As a gesture of goodwill, I would like to offer you a 10-dollar credit on your next bill.",
            "I understand. But these things happen sometimes and we are fixing it.",
            "I agree it should not have happened. We will try to do better."
          ],
          correct: "You are absolutely right, Mr. Miller, and I completely understand your frustration. On behalf of TechConnect, I sincerely apologize for the inconvenience. As a gesture of goodwill, I would like to offer you a 10-dollar credit on your next bill.",
          explanation: "Le das la razón, te disculpas en nombre de la empresa y ofreces compensación proactiva. 'Gesture of goodwill' es una frase estándar en call centers para manejar quejas elevadas."
        },
        {
          id: 't7',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente acepta y su tono se suaviza.',
          prompt: "Okay. Fine. I appreciate that. So the 49 dollars will come back and I get 10 off next month?",
          promptEs: "Está bien. Lo aprecio. Entonces, ¿me regresan los 49 dólares y tengo 10 de descuento el próximo mes?",
          options: [
            "That is exactly right, Mr. Miller. The 49-dollar reversal will process in 3 to 5 business days, and the 10-dollar credit will automatically apply to your next billing cycle. I will also send you a confirmation email. Is there anything else I can help you with today?",
            "Yes, that is correct. Anything else?",
            "Yes. Check your account in a few days. Thank you for calling."
          ],
          correct: "That is exactly right, Mr. Miller. The 49-dollar reversal will process in 3 to 5 business days, and the 10-dollar credit will automatically apply to your next billing cycle. I will also send you a confirmation email. Is there anything else I can help you with today?",
          explanation: "Confirmas los detalles exactos, mencionas el email de confirmación (genera confianza) y terminas con la pregunta estándar de cierre de llamada."
        },
        {
          id: 't8',
          speaker: 'Customer (John)',
          voiceGender: 'male',
          context: 'El cliente está satisfecho y listo para cerrar la llamada.',
          prompt: "No, that is all. Thank you for sorting this out.",
          promptEs: "No, eso es todo. Gracias por resolver esto.",
          options: [
            "You are very welcome, Mr. Miller! I am glad we could resolve this for you. Thank you for your patience and for calling TechConnect. Have a wonderful day!",
            "No problem. Bye.",
            "Great. Thanks for calling. Bye bye!"
          ],
          correct: "You are very welcome, Mr. Miller!, I am glad we could resolve this for you. Thank you for your patience and for calling TechConnect. Have a wonderful day!",
          explanation: "El cierre profesional agradece al cliente por su paciencia (incluso si estuvo molesto), usa el nombre y termina con un deseo positivo. Esta frase cierra la llamada de forma memorable y profesional."
        }
      ]
    }
  }
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function checkQuota() {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  if (!res.ok) throw new Error(`ElevenLabs auth: ${await res.text()}`)
  const data = await res.json()
  const used = data.character_count || 0
  const limit = data.character_limit || 10000
  const remaining = limit - used
  console.log(`📊 ElevenLabs: ${used}/${limit} chars usados, ${remaining} disponibles\n`)
  return remaining
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === STORAGE_BUCKET)
  if (!exists) {
    await supabase.storage.createBucket(STORAGE_BUCKET, {
      public: true,
      allowedMimeTypes: ['audio/mpeg'],
      fileSizeLimit: 5 * 1024 * 1024
    })
    console.log(`✅ Bucket '${STORAGE_BUCKET}' creado`)
  }
}

async function generateAudio(text, voiceGender) {
  const voiceId = voiceGender === 'male' ? VOICE_MALE : VOICE_FEMALE
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function uploadAudio(buffer, path) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

async function getRouteId(routeKey) {
  const { data } = await supabase
    .from('routes')
    .select('id, title')
    .ilike('title', `%${routeKey.split(' ').slice(-2).join(' ')}%`)
    .limit(1)
    .single()
  return data?.id || null
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎧 English for Work — Simulation Generator\n')
  console.log(`📡 ElevenLabs key: ${ELEVENLABS_API_KEY.substring(0, 10)}...`)

  let remaining = await checkQuota()

  if (remaining < 200) {
    console.error('❌ Cuota insuficiente (< 200 chars)')
    process.exit(1)
  }

  await ensureBucket()

  // Get route IDs
  console.log('\n🗺  Buscando rutas...')
  const { data: routes } = await supabase.from('routes').select('id, title')
  console.log('Rutas encontradas:', routes?.map(r => `${r.id}: ${r.title}`).join(', '))

  for (const sim of SIMULATIONS) {
    // Find matching route
    const route = routes?.find(r =>
      r.title.toLowerCase().includes(sim.routeKey.split(' ').slice(-2).join(' ').toLowerCase()) ||
      r.title.toLowerCase().includes('callcenter') ||
      (sim.routeKey.includes('Customer') && r.title.toLowerCase().includes('customer'))
    )
    sim.route_id = route?.id || null
    console.log(`\n📎 ${sim.title} → route_id: ${sim.route_id || '⚠️ no encontrada'}`)
  }

  let totalGenerated = 0
  let totalChars = 0

  for (const sim of SIMULATIONS) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`🎬 Procesando: ${sim.title}`)

    // Upsert simulation (without audio URLs yet)
    const contentCopy = JSON.parse(JSON.stringify(sim.content))
    const { data: existing } = await supabase
      .from('simulations').select('id').eq('id', sim.id).maybeSingle()

    if (existing) {
      const { error } = await supabase.from('simulations')
        .update({ title: sim.title, description: sim.description, route_id: sim.route_id, sort_order: sim.sort_order })
        .eq('id', sim.id)
      if (error) console.error(`  ❌ Update error: ${error.message}`)
      else console.log('  ✅ Simulación actualizada en DB')
    } else {
      const { error } = await supabase.from('simulations').insert({
        id: sim.id,
        title: sim.title,
        description: sim.description,
        route_id: sim.route_id,
        sort_order: sim.sort_order,
        content: contentCopy,
      })
      if (error) console.error(`  ❌ Insert error: ${error.message}`)
      else console.log('  ✅ Simulación insertada en DB')
    }

    // Fetch current content (may already have some audioUrls)
    const { data: current } = await supabase
      .from('simulations').select('content').eq('id', sim.id).single()
    const currentContent = current?.content || contentCopy
    let changed = false

    // Generate audio for each turn prompt
    for (let i = 0; i < currentContent.turns.length; i++) {
      const turn = currentContent.turns[i]
      const text = turn.prompt

      if (turn.audioUrl) {
        console.log(`  ⏭  Turn ${i+1}: ya tiene audio`)
        continue
      }

      if (text.length > remaining - totalChars - 100) {
        console.log(`  ⚠️  Turn ${i+1}: cuota insuficiente, saltando`)
        continue
      }

      process.stdout.write(`  🔊 Turn ${i+1} [${turn.voiceGender}]: "${text.substring(0, 50)}..." `)
      try {
        const audio = await generateAudio(text, turn.voiceGender)
        const path = `${sim.id}/turn-${i}.mp3`
        const url = await uploadAudio(audio, path)
        currentContent.turns[i].audioUrl = url
        changed = true
        totalGenerated++
        totalChars += text.length
        remaining -= text.length
        console.log(`✅ (${text.length} chars, ${remaining} restantes)`)
        await sleep(600)
      } catch (err) {
        console.log(`❌ ${err.message}`)
      }
    }

    if (changed) {
      const { error } = await supabase.from('simulations')
        .update({ content: currentContent }).eq('id', sim.id)
      if (error) console.error(`  ❌ DB audio update: ${error.message}`)
      else console.log(`  💾 Audio URLs guardadas en DB`)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log('🎉 ¡Simulaciones completadas!')
  console.log(`   ✅ ${totalGenerated} audios generados`)
  console.log(`   📝 ~${totalChars} caracteres usados`)
  console.log(`   📊 ~${remaining} chars restantes en ElevenLabs`)
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err.message)
  process.exit(1)
})
