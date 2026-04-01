#!/usr/bin/env node
/**
 * Enrich 9 basic simulations with 7-turn content + generate ElevenLabs audio.
 * 
 * Usage:
 *   $env:ELEVENLABS_API_KEY="..."
 *   $env:SUPABASE_SERVICE_KEY="eyJ..."
 *   node scripts/enrich-basic-simulations.js
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

// ────────────────────────────────────────────────────────────────────────────
// ENRICHED CONTENT FOR THE 9 BASIC SIMULATIONS
// ────────────────────────────────────────────────────────────────────────────

const ENRICHED = {
  'sim-1-1': {
    title: 'Tu perfil profesional en inglés',
    description: 'Practica cómo presentar tu perfil profesional a un reclutador en una fería de empleo.',
    turns: [
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Estás en una feria de empleo. Una reclutadora se acerca a tu stand.',
        prompt:"Hi there! I am Emily from Global Services. What kind of position are you looking for?",
        promptEs:"¡Hola! Soy Emily de Global Services. ¿Qué tipo de puesto estás buscando?",
        options:["Hi Emily! I am looking for a customer service position where I can use my English and Spanish skills.","Hello. I need a job, any job is fine.","Hi. I am not sure, what do you have?"],
        correct:"Hi Emily! I am looking for a customer service position where I can use my English and Spanish skills.",
        explanation:"Respuesta clara con puesto específico y mención de habilidad bilingüe — lo que todo reclutador quiere escuchar." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily se interesa y quiere saber más.',
        prompt:"That sounds great! Can you walk me through your experience?",
        promptEs:"¡Genial! ¿Puedes contarme sobre tu experiencia?",
        options:["Sure! I have worked in retail for two years where I handled customer inquiries and resolved complaints daily.","I worked at a store. It was okay.","I do not have much experience but I learn fast."],
        correct:"Sure! I have worked in retail for two years where I handled customer inquiries and resolved complaints daily.",
        explanation:"Cuantificas tu experiencia (2 años) y describes lo que hacías con verbos de acción relevantes." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily pregunta por tus habilidades técnicas.',
        prompt:"Do you have any experience with CRM systems or customer databases?",
        promptEs:"¿Tienes experiencia con sistemas CRM o bases de datos de clientes?",
        options:["Yes, I used Salesforce at my previous job to track customer interactions and follow up on cases.","I have used computers before.","No, but I can learn quickly if you train me."],
        correct:"Yes, I used Salesforce at my previous job to track customer interactions and follow up on cases.",
        explanation:"Nombras la herramienta específica y cómo la usabas — demuestra experiencia concreta." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily te pregunta por qué quieres cambiar de empleo.',
        prompt:"Why are you interested in making a career change right now?",
        promptEs:"¿Por qué te interesa un cambio de carrera ahora?",
        options:["I want to grow professionally and work in an international environment where I can develop my bilingual skills.","My current job does not pay well enough.","I got tired of my old job, honestly."],
        correct:"I want to grow professionally and work in an international environment where I can develop my bilingual skills.",
        explanation:"Enfocas la respuesta en crecimiento y aspiraciones, no en quejas sobre tu trabajo anterior." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily te pide que describas tu mayor logro.',
        prompt:"Can you share a professional achievement you are proud of?",
        promptEs:"¿Puedes compartir un logro profesional del que estés orgulloso?",
        options:["I once helped reduce customer wait times by 30 percent by suggesting a new queue system to my manager.","I always arrived on time to work.","I got employee of the month once."],
        correct:"I once helped reduce customer wait times by 30 percent by suggesting a new queue system to my manager.",
        explanation:"Un logro medible con impacto real que demuestra iniciativa y pensamiento orientado a resultados." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily quiere saber tu disponibilidad.',
        prompt:"When would you be available to start if selected?",
        promptEs:"¿Cuándo estarías disponible para empezar si te seleccionan?",
        options:["I could start within two weeks. I just need to give notice at my current position.","I can start right now, today if you want.","I am not sure. It depends on many things."],
        correct:"I could start within two weeks. I just need to give notice at my current position.",
        explanation:"Profesional y responsable: das un plazo razonable y mencionas que cumples con tu empleador actual." },
      { speaker:'Recruiter (Emily)', vg:'female',
        context:'Emily cierra la conversación.',
        prompt:"Thank you! I will pass your information to our hiring team. It was great talking to you.",
        promptEs:"¡Gracias! Pasaré tu información al equipo de contratación. Fue un gusto hablar contigo.",
        options:["Thank you so much, Emily! I really enjoyed our conversation. I look forward to hearing from you.","Okay thanks. Bye.","Great. I hope I get the job."],
        correct:"Thank you so much, Emily! I really enjoyed our conversation. I look forward to hearing from you.",
        explanation:"Usas su nombre, agradeces y expresas entusiasmo — dejas una última impresión positiva." },
    ]
  },
  'sim-1-2': {
    title: 'Negociando tu primer contrato',
    description: 'HR te presenta el contrato. Debes entender las condiciones y hacer preguntas clave.',
    turns: [
      { speaker:'HR (Patricia)', vg:'female',
        context:'Te han seleccionado para el puesto. HR te presenta el contrato.',
        prompt:"Congratulations! We would like to offer you the position. Here is your contract. Shall we go over it together?",
        promptEs:"¡Felicitaciones! Queremos ofrecerte el puesto. Aquí está tu contrato. ¿Lo revisamos juntos?",
        options:["Thank you! Yes, I would like to review it together so I understand everything clearly.","Sure, where do I sign?","Okay, let me read it at home and I will call you."],
        correct:"Thank you! Yes, I would like to review it together so I understand everything clearly.",
        explanation:"Agradeces y pides revisarlo juntos — profesional y asegura que entiendes cada punto." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia explica el salario base.',
        prompt:"Your base salary will be two million pesos per month, with performance bonuses. How does that sound?",
        promptEs:"Tu salario base será dos millones de pesos al mes, con bonos por rendimiento. ¿Qué te parece?",
        options:["That sounds good. Could you tell me more about how the performance bonuses are calculated?","That is not enough. I want more.","Okay, that is fine."],
        correct:"That sounds good. Could you tell me more about how the performance bonuses are calculated?",
        explanation:"Aceptas positivamente y preguntas sobre los bonos — demuestra interés en el rendimiento sin ser agresivo." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia explica los beneficios.',
        prompt:"You will also receive health insurance after 30 days and 15 vacation days per year. Any questions?",
        promptEs:"También recibirás seguro médico después de 30 días y 15 días de vacaciones al año. ¿Preguntas?",
        options:["Thank you. Does the health insurance cover dependents as well?","No questions. Everything sounds great.","I want more vacation days."],
        correct:"Thank you. Does the health insurance cover dependents as well?",
        explanation:"Pregunta relevante y práctica — entender la cobertura de dependientes es importante para tu decisión." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia pregunta si hay algo que quieras negociar.',
        prompt:"Is there anything in the contract you would like to discuss or adjust?",
        promptEs:"¿Hay algo en el contrato que te gustaría discutir o ajustar?",
        options:["I was wondering if there is any flexibility on the start date. Could I begin on the 15th instead of the 1st?","No, everything is perfect. I am happy with everything.","Yes, I want a higher salary and more vacation days."],
        correct:"I was wondering if there is any flexibility on the start date. Could I begin on the 15th instead of the 1st?",
        explanation:"Negocias algo razonable y específico, usando lenguaje suave ('I was wondering if'). No pides todo a la vez." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia acepta tu solicitud.',
        prompt:"That works for us. We will update the start date. Is there anything else before we finalize?",
        promptEs:"Eso funciona para nosotros. Actualizaremos la fecha de inicio. ¿Algo más antes de finalizar?",
        options:["Just to confirm: my start date is the 15th, base salary is two million, and health coverage begins after 30 days. Is that correct?","No, I am good.","I think that is all. Thank you."],
        correct:"Just to confirm: my start date is the 15th, base salary is two million, and health coverage begins after 30 days. Is that correct?",
        explanation:"Confirmar los puntos clave del contrato antes de firmar evita malentendidos y demuestra atención al detalle." },
    ]
  },
  'sim-1-3': {
    title: 'Correo de seguimiento profesional',
    description: 'Practicas cómo responder emails de trabajo: confirmaciones, solicitudes y follow-ups.',
    turns: [
      { speaker:'Manager (David)', vg:'male',
        context:'Tu jefe te envía un email pidiendo un reporte urgente.',
        prompt:"Carlos, I need the Q3 report on my desk by end of day. Can you handle that?",
        promptEs:"Carlos, necesito el reporte del Q3 en mi escritorio antes de que termine el día. ¿Puedes con eso?",
        options:["Absolutely, David. I will have it ready by 4 PM. Should I include the comparison with Q2 as well?","Okay, I will try.","That is too soon. Can I do it tomorrow?"],
        correct:"Absolutely, David. I will have it ready by 4 PM. Should I include the comparison with Q2 as well?",
        explanation:"Confirmas con hora específica y ofreces valor extra — demuestra proactividad y gestión del tiempo." },
      { speaker:'Client (Jennifer)', vg:'female',
        context:'Un cliente te envía un email pidiendo información sobre tu servicio.',
        prompt:"Good morning. I am interested in your premium plan. Could you send me more details and pricing?",
        promptEs:"Buenos días. Me interesa su plan premium. ¿Podría enviarme más detalles y precios?",
        options:["Good morning, Jennifer! Thank you for your interest. I will send you our premium brochure and schedule a quick call to discuss your needs. When works best for you?","Hi. The price is on our website.","Good morning. I will ask my boss and get back to you."],
        correct:"Good morning, Jennifer! Thank you for your interest. I will send you our premium brochure and schedule a quick call to discuss your needs. When works best for you?",
        explanation:"Agradeces, informas que enviarás material, y tomas la iniciativa de agendar — convierte curiosidad en venta." },
      { speaker:'Coworker (Mike)', vg:'male',
        context:'Un compañero te pide ayuda con una presentación.',
        prompt:"Hey Carlos, I am preparing a presentation for Friday. Could you review my slides and give me feedback?",
        promptEs:"Hey Carlos, estoy preparando una presentación para el viernes. ¿Podrías revisar mis diapositivas y darme feedback?",
        options:["Of course, Mike! Send them over and I will review them by tomorrow morning. Happy to help!","Sure, I guess. Send them whenever.","Sorry, I am too busy this week."],
        correct:"Of course, Mike! Send them over and I will review them by tomorrow morning. Happy to help!",
        explanation:"Das un plazo, muestras entusiasmo y construyes relaciones de equipo respondiendo positivamente." },
      { speaker:'HR (Sarah)', vg:'female',
        context:'HR te envía un recordatorio sobre un documento pendiente.',
        prompt:"Hi Carlos, just a reminder that we still need your emergency contact form. Could you submit it by Friday?",
        promptEs:"Hola Carlos, solo un recordatorio de que aún necesitamos tu formulario de contacto de emergencia. ¿Puedes enviarlo antes del viernes?",
        options:["Thank you for the reminder, Sarah. I will submit it by Thursday at the latest. Sorry for the delay!","Oh right, I forgot. I will do it eventually.","Can I do it next week instead?"],
        correct:"Thank you for the reminder, Sarah. I will submit it by Thursday at the latest. Sorry for the delay!",
        explanation:"Agradeces el recordatorio (sin excusas), te comprometes con fecha anterior a la pedida y te disculpas brevemente." },
      { speaker:'Manager (David)', vg:'male',
        context:'Tu jefe te confirma que hiciste bien un proyecto.',
        prompt:"Great job on the Q3 report, Carlos. The client was very impressed. Keep up the good work!",
        promptEs:"Excelente trabajo en el reporte Q3, Carlos. El cliente quedó muy impresionado. ¡Sigue así!",
        options:["Thank you so much, David! I appreciate the feedback. It was a great team effort and I am glad the client is happy.","Thanks.","You are welcome. I always do good work."],
        correct:"Thank you so much, David! I appreciate the feedback. It was a great team effort and I am glad the client is happy.",
        explanation:"Agradeces, mencionas al equipo (humildad) y conectas con la satisfacción del cliente — profesional y empático." },
    ]
  },
  'sim-2-1': {
    title: 'Entrevista telefónica inicial',
    description: 'Un reclutador te llama para una pre-entrevista telefónica de 10 minutos. Debes causar una buena primera impresión.',
    turns: [
      { speaker:'Recruiter (Tom)', vg:'male',
        context:'Recibes una llamada inesperada de un reclutador.',
        prompt:"Hello, is this Carlos? This is Tom from ABC Corp. I am calling about the position you applied for. Do you have a few minutes?",
        promptEs:"¿Hola, habla Carlos? Soy Tom de ABC Corp. Te llamo por la posición a la que aplicaste. ¿Tienes unos minutos?",
        options:["Hello Tom! Yes, this is Carlos. Thank you for calling! I have time right now and I would love to discuss the position.","Yeah, who is this again?","Hi. I am a little busy but go ahead."],
        correct:"Hello Tom! Yes, this is Carlos. Thank you for calling! I have time right now and I would love to discuss the position.",
        explanation:"Confirmas tu nombre, agradeces la llamada y confirmas disponibilidad con entusiasmo — primera impresión perfecta." },
      { speaker:'Recruiter (Tom)', vg:'male',
        context:'Tom quiere saber por qué aplicaste.',
        prompt:"What made you interested in this role at ABC Corp?",
        promptEs:"¿Qué te interesó de este puesto en ABC Corp?",
        options:["I researched your company and I am impressed by your focus on customer experience. I believe my bilingual skills and service background would be a great fit.","I saw the ad online and it looked interesting.","I need a better paying job and this one pays well."],
        correct:"I researched your company and I am impressed by your focus on customer experience. I believe my bilingual skills and service background would be a great fit.",
        explanation:"Demuestras que investigaste la empresa, conectas sus valores con tus habilidades — preparación visible." },
      { speaker:'Recruiter (Tom)', vg:'male',
        context:'Tom pregunta sobre tu nivel de inglés.',
        prompt:"How would you rate your English proficiency? Can you work entirely in English?",
        promptEs:"¿Cómo calificarías tu nivel de inglés? ¿Puedes trabajar completamente en inglés?",
        options:["I would say I am at an advanced level. I can handle meetings, emails, and phone calls in English comfortably. I practice daily to keep improving.","I think it is okay. Sometimes I struggle with complex words.","Very good. I took English classes in school."],
        correct:"I would say I am at an advanced level. I can handle meetings, emails, and phone calls in English comfortably. I practice daily to keep improving.",
        explanation:"Das ejemplos concretos de uso (reuniones, emails, llamadas) y mencionas que practicas activamente — confianza sin arrogancia." },
      { speaker:'Recruiter (Tom)', vg:'male',
        context:'Tom quiere saber tu disponibilidad para entrevista presencial.',
        prompt:"Excellent! We would like to invite you for an in-person interview. What days work best for you next week?",
        promptEs:"¡Excelente! Nos gustaría invitarte a una entrevista presencial. ¿Qué días te funcionan la próxima semana?",
        options:["I am available Tuesday and Thursday afternoon. Would either of those work for you?","Any day is fine. I am always free.","I am not sure. Let me check and call you back."],
        correct:"I am available Tuesday and Thursday afternoon. Would either of those work for you?",
        explanation:"Ofreces dos opciones específicas — profesional, organizado y le facilitas la coordinación." },
      { speaker:'Recruiter (Tom)', vg:'male',
        context:'Tom cierra la llamada.',
        prompt:"Perfect. Let us go with Thursday at 2 PM. I will send you an email with all the details. See you then!",
        promptEs:"Perfecto. Quedamos el jueves a las 2 PM. Te enviaré un email con todos los detalles. ¡Nos vemos!",
        options:["Thank you so much, Tom! Thursday at 2 PM works great. I will be there. Have a wonderful day!","Okay, bye.","Sure. See you Thursday I guess."],
        correct:"Thank you so much, Tom! Thursday at 2 PM works great. I will be there. Have a wonderful day!",
        explanation:"Confirmas la cita repitiendo la fecha/hora, agradeces y cierras con energía positiva." },
    ]
  },
  'sim-2-2': {
    title: 'Preguntas difíciles en entrevista',
    description: 'Tu entrevistador te hace las preguntas más complicadas: vacío laboral, por qué te fuiste, conflictos.',
    turns: [
      { speaker:'Interviewer (Karen)', vg:'female',
        context:'La entrevistadora va directo a preguntas difíciles.',
        prompt:"I see there is a six-month gap in your resume. Can you explain what happened?",
        promptEs:"Veo un vacío de seis meses en tu CV. ¿Puedes explicar qué pasó?",
        options:["Yes, I took that time to complete an English proficiency certification and care for a family member. I used the time productively and I am now ready to commit fully.","I was just taking a break. Everyone needs one sometimes.","I could not find a job during that time."],
        correct:"Yes, I took that time to complete an English proficiency certification and care for a family member. I used the time productively and I am now ready to commit fully.",
        explanation:"Explicas el vacío positivamente con actividades productivas y cierras con compromiso — conviertes una debilidad en fortaleza." },
      { speaker:'Interviewer (Karen)', vg:'female',
        context:'Karen pregunta por qué dejaste tu último empleo.',
        prompt:"Why did you leave your last position?",
        promptEs:"¿Por qué dejaste tu último empleo?",
        options:["I learned a lot there, but I reached a point where there were no more growth opportunities. I am looking for a role where I can continue developing my skills.","My boss was difficult and I did not like the work environment.","They were not paying me enough so I left."],
        correct:"I learned a lot there, but I reached a point where there were no more growth opportunities. I am looking for a role where I can continue developing my skills.",
        explanation:"Hablas positivamente del empleo anterior, enfocas en crecimiento y no en quejas — regla de oro de las entrevistas." },
      { speaker:'Interviewer (Karen)', vg:'female',
        context:'Karen te pregunta sobre un conflicto laboral.',
        prompt:"Tell me about a time you had a disagreement with a coworker. How did you handle it?",
        promptEs:"Cuéntame de una vez que tuviste un desacuerdo con un compañero. ¿Cómo lo manejaste?",
        options:["Once a colleague and I disagreed on a project approach. I suggested we each present our ideas to the team and let the data decide. We combined the best parts of both and the project succeeded.","I usually avoid conflict. I just go along with whatever others want.","I told my boss about it and let them deal with it."],
        correct:"Once a colleague and I disagreed on a project approach. I suggested we each present our ideas to the team and let the data decide. We combined the best parts of both and the project succeeded.",
        explanation:"Método STAR con resultado colaborativo: no evitas el conflicto, lo resuelves de forma constructiva y profesional." },
      { speaker:'Interviewer (Karen)', vg:'female',
        context:'Karen pregunta dónde te ves en 5 años.',
        prompt:"Where do you see yourself in five years?",
        promptEs:"¿Dónde te ves en cinco años?",
        options:["I see myself growing into a team lead or supervisor role within the company, contributing to team development while continuing to improve my bilingual communication skills.","I am not sure. I just take things day by day.","I want to start my own business eventually."],
        correct:"I see myself growing into a team lead or supervisor role within the company, contributing to team development while continuing to improve my bilingual communication skills.",
        explanation:"Tu visión menciona crecimiento DENTRO de la empresa — demuestra lealtad y ambición alineada con sus intereses." },
      { speaker:'Interviewer (Karen)', vg:'female',
        context:'Karen hace la pregunta más difícil.',
        prompt:"Why should we hire you instead of the other candidates?",
        promptEs:"¿Por qué deberíamos contratarte a ti en vez de a los demás candidatos?",
        options:["Because I bring a unique combination of bilingual communication skills, proven customer service results, and a genuine passion for helping people succeed. I am committed to delivering measurable results from day one.","Because I am the best candidate. I am sure of it.","I do not know the other candidates, so I cannot really compare."],
        correct:"Because I bring a unique combination of bilingual communication skills, proven customer service results, and a genuine passion for helping people succeed. I am committed to delivering measurable results from day one.",
        explanation:"Tres diferenciadores concretos + compromiso desde el día 1. No atacas a otros candidatos, vendes tu valor único." },
    ]
  },
  'sim-2-3': {
    title: 'Follow-up después de la entrevista',
    description: 'La entrevista terminó. Ahora debes enviar el email de agradecimiento y manejar la negociación final.',
    turns: [
      { speaker:'Your follow-up', vg:'female',
        context:'Han pasado 24 horas desde tu entrevista. Debes enviar un email de seguimiento.',
        prompt:"It has been 24 hours since your interview. You should send a follow-up email now.",
        promptEs:"Han pasado 24 horas desde tu entrevista. Debes enviar un email de seguimiento.",
        options:["Dear Karen, thank you for the opportunity to interview yesterday. I enjoyed learning about the team and I am even more excited about the role. I look forward to hearing from you.","Hi, just checking if you made a decision yet.","I will just wait for them to contact me. No need to follow up."],
        correct:"Dear Karen, thank you for the opportunity to interview yesterday. I enjoyed learning about the team and I am even more excited about the role. I look forward to hearing from you.",
        explanation:"Email de agradecimiento dentro de 24 horas: agradeces, refuerzas tu interés y cierras profesionalmente. Regla de oro post-entrevista." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'HR te llama con una oferta.',
        prompt:"Hi Carlos! I am happy to share that we would like to extend an offer to you. Would you like to hear the details?",
        promptEs:"¡Hola Carlos! Me alegra informarte que queremos hacerte una oferta. ¿Te gustaría escuchar los detalles?",
        options:["That is wonderful news, Patricia! Yes, I would love to hear all the details. Thank you so much for the opportunity!","Finally! Yes, tell me about it.","Okay, what is the salary?"],
        correct:"That is wonderful news, Patricia! Yes, I would love to hear all the details. Thank you so much for the opportunity!",
        explanation:"Expresas gratitud y entusiasmo genuino antes de ir a detalles — marca el tono correcto para la negociación." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'El salario es más bajo de lo esperado.',
        prompt:"The starting salary is one million eight hundred thousand pesos. Is that in line with your expectations?",
        promptEs:"El salario inicial es de un millón ochocientos mil pesos. ¿Está en línea con tus expectativas?",
        options:["Thank you for the offer. Based on my experience and market research, I was hoping for something closer to two million two hundred. Would there be room for discussion?","That is too low. I cannot accept that.","Okay, I will take it."],
        correct:"Thank you for the offer. Based on my experience and market research, I was hoping for something closer to two million two hundred. Would there be room for discussion?",
        explanation:"Agradeces primero, luego contra-ofertas con cifra específica basada en investigación, y preguntas si hay flexibilidad — negociación profesional." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia ofrece un compromiso.',
        prompt:"I understand. The best we can do is two million to start, with a review after six months. Would that work?",
        promptEs:"Entiendo. Lo mejor que podemos ofrecer es dos millones para empezar, con revisión a los seis meses. ¿Funcionaría?",
        options:["That sounds like a fair compromise. I appreciate your flexibility. I would love to accept the offer with those terms.","I guess I have no choice. Fine.","Can you make it two million one hundred?"],
        correct:"That sounds like a fair compromise. I appreciate your flexibility. I would love to accept the offer with those terms.",
        explanation:"Describes el acuerdo como 'justo' (valoras su esfuerzo), agradeces y aceptas con entusiasmo." },
      { speaker:'HR (Patricia)', vg:'female',
        context:'Patricia cierra el proceso.',
        prompt:"Excellent! Welcome to the team! I will send you the final contract tomorrow. We are excited to have you!",
        promptEs:"¡Excelente! ¡Bienvenido al equipo! Te enviaré el contrato final mañana. ¡Estamos emocionados de tenerte!",
        options:["Thank you so much, Patricia! I am thrilled to join the team. I will look out for the contract and I am ready to start. Have a wonderful day!","Thanks. See you soon.","Great. Finally I got the job."],
        correct:"Thank you so much, Patricia! I am thrilled to join the team. I will look out for the contract and I am ready to start. Have a wonderful day!",
        explanation:"Cierre perfecto: gratitud, entusiasmo ('thrilled'), anticipas el próximo paso (contrato) y deseas un buen día." },
    ]
  },
  'sim-3-1': {
    title: 'Tu primera llamada de servicio',
    description: 'Es tu primer turno en el call center. Recibes una llamada sencilla de un cliente con una pregunta básica.',
    turns: [
      { speaker:'Trainer (Lisa)', vg:'female',
        context:'Tu entrenadora te da instrucciones antes de tu primera llamada.',
        prompt:"Okay Carlos, remember: greet the customer, verify their account, solve their problem, and close the call. Your first one is coming in. Ready?",
        promptEs:"Bien Carlos, recuerda: saluda, verifica la cuenta, resuelve el problema y cierra la llamada. Tu primera llamada está entrando. ¿Listo?",
        options:["Yes, I am ready! Thank you for the coaching, Lisa. I will follow the steps.","I think so. I hope I do not mess up.","Not really, but let us see what happens."],
        correct:"Yes, I am ready! Thank you for the coaching, Lisa. I will follow the steps.",
        explanation:"Confianza y gratitud hacia tu entrenadora — actitud correcta para tu primera llamada real." },
      { speaker:'Customer (Robert)', vg:'male',
        context:'Tu primera llamada entra. Un cliente necesita ayuda con su contraseña.',
        prompt:"Hi, I cannot log in to my account. I forgot my password and the reset link is not working.",
        promptEs:"Hola, no puedo iniciar sesión en mi cuenta. Olvidé mi contraseña y el enlace de reset no funciona.",
        options:["I am sorry to hear that, Robert. I would be happy to help you reset your password right now. Could you verify your email address for me?","Just try again later. The system is probably down.","What is your password? I can look it up."],
        correct:"I am sorry to hear that, Robert. I would be happy to help you reset your password right now. Could you verify your email address for me?",
        explanation:"Empatía + oferta de ayuda inmediata + solicitas verificación de identidad antes de hacer cambios. Procedimiento estándar." },
      { speaker:'Customer (Robert)', vg:'male',
        context:'Robert te da su email y verificas la cuenta.',
        prompt:"Sure, it is robert.smith at gmail dot com. I really need to access my account today.",
        promptEs:"Claro, es robert.smith arroba gmail punto com. Realmente necesito acceder a mi cuenta hoy.",
        options:["Thank you, Robert. I found your account. I am sending a new password reset link to that email right now. You should receive it within 2 minutes.","Okay, let me check. Hold on.","Your email is in the system. Try resetting again."],
        correct:"Thank you, Robert. I found your account. I am sending a new password reset link to that email right now. You should receive it within 2 minutes.",
        explanation:"Confirmas que lo encontraste, describes la acción que tomas y das un tiempo estimado — el cliente sabe exactamente qué esperar." },
      { speaker:'Customer (Robert)', vg:'male',
        context:'Robert confirma que llegó el email.',
        prompt:"I got the email! It worked this time. Thank you for your help!",
        promptEs:"¡Me llegó el email! Funcionó esta vez. ¡Gracias por tu ayuda!",
        options:["You are welcome, Robert! Glad it worked. Is there anything else I can help you with today?","Great. Is that all?","Perfect. Have a nice day."],
        correct:"You are welcome, Robert! Glad it worked. Is there anything else I can help you with today?",
        explanation:"Pregunta estándar de cierre: 'Is there anything else I can help you with?' — nunca cierres sin preguntar." },
      { speaker:'Trainer (Lisa)', vg:'female',
        context:'Después de la llamada, tu entrenadora te da feedback.',
        prompt:"Nice work on your first call! Your tone was good and you followed the process well. How do you feel?",
        promptEs:"¡Buen trabajo en tu primera llamada! Tu tono fue bueno y seguiste el proceso bien. ¿Cómo te sientes?",
        options:["Thank you, Lisa! I feel good about it. I think the verification step is really important and I want to make sure I always do it properly.","It was okay. Pretty easy actually.","I was really nervous but I am glad it is over."],
        correct:"Thank you, Lisa! I feel good about it. I think the verification step is really important and I want to make sure I always do it properly.",
        explanation:"Agradeces, muestras reflexión sobre lo aprendido y señalas un punto específico del proceso — actitud de aprendizaje continuo." },
    ]
  },
  'sim-3-2': {
    title: 'Resuelve un caso difícil',
    description: 'Un cliente VIP tiene un problema complejo. Debes investigar, escalar al supervisor y dar seguimiento.',
    turns: [
      { speaker:'Customer (Diana)', vg:'female',
        context:'Una clienta VIP llama muy preocupada por múltiples cargos en su cuenta.',
        prompt:"I am a platinum member and I see five charges I do not recognize on my last three statements. This is very concerning!",
        promptEs:"Soy miembro platinum y veo cinco cargos que no reconozco en mis últimos tres estados de cuenta. ¡Esto es muy preocupante!",
        options:["I completely understand your concern, Diana. As a valued platinum member, let me personally investigate each of these charges right away. Let me pull up your account.","That is a lot of charges. Let me check.","Please call our fraud department for that issue."],
        correct:"I completely understand your concern, Diana. As a valued platinum member, let me personally investigate each of these charges right away. Let me pull up your account.",
        explanation:"Reconoces su estatus VIP, validas su preocupación y te comprometes personalmente a investigar. Nunca transfieras un cliente VIP sin intentar primero." },
      { speaker:'Customer (Diana)', vg:'female',
        context:'Diana te da detalles. El caso es complejo.',
        prompt:"The charges are from different dates and different amounts. I am worried someone has access to my account!",
        promptEs:"Los cargos son de diferentes fechas y montos. ¡Me preocupa que alguien tenga acceso a mi cuenta!",
        options:["I take this very seriously, Diana. For your protection, I am going to place a temporary hold on your account while I investigate. I will also need to loop in our security team. Is that okay with you?","Do not worry, it is probably just a system error.","I cannot handle fraud cases. Let me transfer you."],
        correct:"I take this very seriously, Diana. For your protection, I am going to place a temporary hold on your account while I investigate. I will also need to loop in our security team. Is that okay with you?",
        explanation:"Acción inmediata de protección (hold), mencionas seguridad y le pides permiso — el cliente se siente escuchado y protegido." },
      { speaker:'Supervisor (Mark)', vg:'male',
        context:'Tu supervisor se une a la llamada para ayudar.',
        prompt:"Carlos, what do we have here? Give me a quick summary of the situation.",
        promptEs:"Carlos, ¿qué tenemos aquí? Dame un resumen rápido de la situación.",
        options:["Sure, Mark. We have a platinum member, Diana, with five unrecognized charges across three statements. I have placed a temporary hold on her account and she is on the line with us.","There is a customer with some charges she does not recognize.","Diana has a problem with her bill. Can you take over?"],
        correct:"Sure, Mark. We have a platinum member, Diana, with five unrecognized charges across three statements. I have placed a temporary hold on her account and she is on the line with us.",
        explanation:"Resumen claro, conciso y completo a tu supervisor: quién (platinum member), qué (5 cargos), qué hiciste (hold) — comunicación efectiva de escalamiento." },
      { speaker:'Customer (Diana)', vg:'female',
        context:'Después de la investigación, confirman que fue un error de facturación.',
        prompt:"So what happened? Are those charges fraudulent?",
        promptEs:"¿Entonces qué pasó? ¿Son cargos fraudulentos?",
        options:["Great news, Diana. After a thorough investigation, we found that these were duplicate system charges, not fraud. We are reversing all five charges immediately and you will see the credits within 48 hours.","It was not fraud, just system errors. We will fix it.","We are still looking into it. I will call you back."],
        correct:"Great news, Diana. After a thorough investigation, we found that these were duplicate system charges, not fraud. We are reversing all five charges immediately and you will see the credits within 48 hours.",
        explanation:"Tranquilizas (no fue fraude), explicas la causa, informas la acción (reversión) y das plazo específico. Comunicación completa y reconfortante." },
      { speaker:'Customer (Diana)', vg:'female',
        context:'Diana agradece pero quiere asegurarse de que no pase otra vez.',
        prompt:"Thank you. But how do I know this will not happen again?",
        promptEs:"Gracias. Pero ¿cómo sé que no volverá a pasar?",
        options:["Excellent question, Diana. I have flagged your account for priority monitoring and our tech team is fixing the billing error. I will also personally follow up with you in one week to confirm everything is resolved.","We will try our best to prevent it.","These things happen sometimes but we fixed it this time."],
        correct:"Excellent question, Diana. I have flagged your account for priority monitoring and our tech team is fixing the billing error. I will also personally follow up with you in one week to confirm everything is resolved.",
        explanation:"Acción preventiva (monitoreo), solución técnica (equipo de tech) y compromiso personal de seguimiento — conviertes una queja en lealtad." },
    ]
  },
  'sim-3-3': {
    title: 'Turno completo en un call center',
    description: 'Simulas un turno completo: apertura, varias llamadas, pausa, y cierre con tu supervisor.',
    turns: [
      { speaker:'Team Lead (Rachel)', vg:'female',
        context:'Inicio de turno. Tu team lead te da el briefing del día.',
        prompt:"Good morning team! Today we expect high call volume due to a billing system update. Stay patient and follow the script. Any questions?",
        promptEs:"¡Buenos días equipo! Hoy esperamos alto volumen de llamadas por una actualización de facturación. Sean pacientes y sigan el script. ¿Preguntas?",
        options:["Thank you, Rachel. If customers ask about the billing update, should we direct them to the FAQ page or explain it ourselves?","No questions. Let us get started.","Great. I hope it is not too crazy today."],
        correct:"Thank you, Rachel. If customers ask about the billing update, should we direct them to the FAQ page or explain it ourselves?",
        explanation:"Pregunta proactiva y práctica que demuestra que piensas en los escenarios que encontrarás — actitud de preparación." },
      { speaker:'Customer (Alex)', vg:'male',
        context:'Primera llamada: cliente confundido por un cambio en su plan.',
        prompt:"Why did my monthly bill go up by 15 dollars? I did not change anything!",
        promptEs:"¿Por qué subió mi factura 15 dólares? ¡Yo no cambié nada!",
        options:["I understand your concern, Alex. Let me review your account to see exactly what changed. Could you give me one moment while I pull up the details?","Prices go up sometimes. There is nothing I can do.","Let me check. What is your account number?"],
        correct:"I understand your concern, Alex. Let me review your account to see exactly what changed. Could you give me one moment while I pull up the details?",
        explanation:"Empatía + acción inmediata + pides un momento sin dejarlo en hold. El cliente se siente atendido." },
      { speaker:'Customer (Sofia)', vg:'female',
        context:'Segunda llamada: clienta quiere cancelar su servicio.',
        prompt:"I want to cancel my subscription. I have been a customer for three years but I am not satisfied anymore.",
        promptEs:"Quiero cancelar mi suscripción. He sido clienta por tres años pero ya no estoy satisfecha.",
        options:["I am sorry to hear that, Sofia. You have been with us for three years and we truly value your loyalty. Before we proceed, could you share what has not been meeting your expectations? I would love to see if we can make things right.","Okay, I will process your cancellation right now.","Are you sure? We have special discounts."],
        correct:"I am sorry to hear that, Sofia. You have been with us for three years and we truly value your loyalty. Before we proceed, could you share what has not been meeting your expectations? I would love to see if we can make things right.",
        explanation:"Reconoces su lealtad (3 años), pides más información antes de cancelar y ofreces solución — retención efectiva sin presionar." },
      { speaker:'Team Lead (Rachel)', vg:'female',
        context:'Es tu pausa. Rachel te revisa las métricas.',
        prompt:"Good job so far, Carlos. Your average handle time is 4 minutes and your satisfaction score is 92 percent. Keep it up!",
        promptEs:"Buen trabajo hasta ahora, Carlos. Tu tiempo promedio es 4 minutos y tu score de satisfacción es 92%. ¡Sigue así!",
        options:["Thank you, Rachel! I am trying to keep my calls efficient while still being thorough. Is there anything you would suggest I improve?","Thanks, I am doing my best.","Nice. I will try to get to 95 percent."],
        correct:"Thank you, Rachel! I am trying to keep my calls efficient while still being thorough. Is there anything you would suggest I improve?",
        explanation:"Agradeces y pides feedback activamente — demuestra deseo de mejorar y humildad profesional." },
      { speaker:'Team Lead (Rachel)', vg:'female',
        context:'Fin de turno. Rachel cierra el día.',
        prompt:"Great shift today! The team handled 247 calls. You personally resolved 31. Your numbers look solid. See you tomorrow!",
        promptEs:"¡Gran turno hoy! El equipo manejó 247 llamadas. Tú resolviste 31 personalmente. Tus números se ven sólidos. ¡Nos vemos mañana!",
        options:["Thank you, Rachel! It was a challenging but productive day. I learned a lot from the billing calls. See you tomorrow!","Thanks. See you.","Great. Glad the day is over."],
        correct:"Thank you, Rachel! It was a challenging but productive day. I learned a lot from the billing calls. See you tomorrow!",
        explanation:"Reconoces el desafío, mencionas aprendizaje específico y cierras con energía positiva. Profesional hasta el final del turno." },
    ]
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

async function checkQuota() {
  const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': ELEVENLABS_API_KEY } })
  if (!res.ok) throw new Error(`ElevenLabs auth: ${await res.text()}`)
  const d = await res.json()
  const remaining = (d.character_limit || 10000) - (d.character_count || 0)
  console.log(`📊 ElevenLabs: ${d.character_count}/${d.character_limit} | ${remaining} disponibles\n`)
  return remaining
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === STORAGE_BUCKET)) {
    await supabase.storage.createBucket(STORAGE_BUCKET, { public: true, allowedMimeTypes: ['audio/mpeg'] })
    console.log(`✅ Bucket '${STORAGE_BUCKET}' created`)
  }
}

async function genAudio(text, vg) {
  const vid = vg === 'male' ? VOICE_MALE : VOICE_FEMALE
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': ELEVENLABS_API_KEY },
    body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function upload(buf, path) {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, buf, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎧 Enrich 9 Basic Simulations\n')
  let remaining = await checkQuota()
  if (remaining < 200) { console.error('❌ Cuota insuficiente'); process.exit(1) }
  await ensureBucket()

  let totalGen = 0, totalChars = 0

  for (const [simId, update] of Object.entries(ENRICHED)) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`🎬 ${simId}: ${update.title}`)

    const turns = update.turns.map((t, i) => ({
      id: `t${i+1}`, speaker: t.speaker, voiceGender: t.vg,
      context: t.context, prompt: t.prompt, promptEs: t.promptEs,
      options: t.options, correct: t.correct, explanation: t.explanation
    }))

    const newContent = { scenario: turns[0]?.context || '', turns }

    // Update content + description + title
    const { error: updErr } = await supabase.from('simulations').update({
      title: update.title, description: update.description, content: newContent
    }).eq('id', simId)
    if (updErr) { console.error(`  ❌ Update: ${updErr.message}`); continue }
    console.log(`  ✅ Content updated (${turns.length} turns)`)

    // Generate audio
    let changed = false
    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i]
      const text = turn.prompt
      if (totalChars + text.length > remaining - 100) {
        console.log(`  ⚠️ Turn ${i+1}: cuota baja, saltando`); continue
      }
      process.stdout.write(`  🔊 Turn ${i+1} [${turn.voiceGender}]: "${text.substring(0,40)}..." `)
      try {
        const audio = await genAudio(text, turn.voiceGender)
        const url = await upload(audio, `${simId}/turn-${i}.mp3`)
        newContent.turns[i].audioUrl = url
        changed = true; totalGen++; totalChars += text.length
        console.log(`✅ (${text.length}ch, ${remaining-totalChars} left)`)
        await sleep(600)
      } catch (err) { console.log(`❌ ${err.message}`) }
    }
    if (changed) {
      const { error } = await supabase.from('simulations').update({ content: newContent }).eq('id', simId)
      if (error) console.error(`  ❌ Save: ${error.message}`)
      else console.log(`  💾 Audio saved to DB`)
    }
  }

  console.log(`\n${'═'.repeat(60)}`)
  console.log(`🎉 Done! ${totalGen} audios | ~${totalChars} chars | ~${remaining-totalChars} left`)
}

main().catch(e => { console.error('💥', e.message); process.exit(1) })
