#!/usr/bin/env node
/**
 * Fix all critical Route 3 scenarios: regroup into 3-4 logical blocks
 * Uses multiple ElevenLabs API keys to maximize quota.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const STORAGE_BUCKET = 'lesson-audios'

// All 5 API keys — rotate when quota runs out
const API_KEYS = [
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',   // Englishforworkapp
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',   // imperiumintro
  '8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9',   // mghernandezcastillo
  'e3b29b520ee2c1a65d5544b3f7ec1312e4b96ff4314c3393ff9d575b1207bb1f',   // michercasmoto
  'c7aa6549fed01b2b674d8c9a6c658c5965de617c18c2fe0c784a259dc5a72705',   // marcela
]

let currentKeyIdx = 0
function getKey() { return API_KEYS[currentKeyIdx] }
function rotateKey() {
  currentKeyIdx++
  if (currentKeyIdx >= API_KEYS.length) {
    console.log('❌ All API keys exhausted!')
    return false
  }
  console.log(`  🔄 Rotating to API key #${currentKeyIdx + 1}...`)
  return true
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ═══════════════════════════════════════════════════════════════════
// MANUAL GROUPINGS — each scenario broken into 3-4 logical blocks
// ═══════════════════════════════════════════════════════════════════

const FIXES = [
  {
    lessonId: 'les-3-1-1',
    scenarioIdx: 0,
    sentences: [
      "Thank you for calling TechConnect Solutions. My name is María. How can I help you today?",
      "Could I please have your account number or the name on the account?",
      "Thank you, Mr. Johnson. Give me just a moment while I pull up your account.",
    ],
    translations: [
      "Gracias por llamar a TechConnect Solutions. Mi nombre es María. ¿En qué puedo ayudarle hoy?",
      "¿Podría darme su número de cuenta o el nombre en la cuenta?",
      "Gracias, Sr. Johnson. Un momento mientras reviso su cuenta.",
    ],
  },
  {
    lessonId: 'les-3-1-2',
    scenarioIdx: 0,
    sentences: [
      "I completely understand your frustration, Mr. Johnson. Let me make sure I have this right — you were charged twice for your monthly subscription on March 5th. Is that correct?",
      "Thank you for confirming that. I sincerely apologize for the inconvenience.",
      "I am going to look into this right now.",
    ],
    translations: [
      "Comprendo completamente su frustración, Sr. Johnson. Permítame asegurarme — le cobraron dos veces su suscripción mensual el 5 de marzo. ¿Es correcto?",
      "Gracias por confirmar. Me disculpo sinceramente por el inconveniente.",
      "Voy a revisar esto ahora mismo.",
    ],
  },
  {
    lessonId: 'les-3-1-3',
    scenarioIdx: 0,
    sentences: [
      "For security purposes, I need to verify your identity. Could you please confirm the email address on your account?",
      "Thank you. I will need to place you on a brief hold while I look into that — about 2-3 minutes. Is that okay?",
      "Thank you for your patience! I am back. Here is what I found: your refund of $45.99 has been processed and should appear in 3-5 business days. Your reference number is TC-4829.",
      "Is there anything else I can help you with?",
    ],
    translations: [
      "Por seguridad, necesito verificar su identidad. ¿Podría confirmar el correo electrónico en su cuenta?",
      "Gracias. Necesitaré ponerle en espera breve mientras reviso eso — unos 2-3 minutos. ¿Está bien?",
      "¡Gracias por su paciencia! Ya estoy de vuelta. Esto es lo que encontré: su reembolso de $45.99 ha sido procesado y debería aparecer en 3-5 días hábiles. Su número de referencia es TC-4829.",
      "¿Hay algo más en lo que pueda ayudarle?",
    ],
  },
  {
    lessonId: 'les-3-1-4',
    scenarioIdx: 0,
    sentences: [
      "Thank you for calling TechConnect Solutions. My name is María. How can I help you today? For security, could you confirm the email address on your account?",
      "I understand. Let me make sure I have this right — you were charged $45.99 twice on March 5th. Is that correct? I need to look into this. May I place you on hold for about 2-3 minutes?",
      "Thank you for your patience. Here is what I found: the duplicate charge has been reversed. Your refund of $45.99 will appear in 3-5 business days. Your reference number is TC-4829.",
      "Is there anything else I can help you with today? Thank you for calling. Have a great day!",
    ],
    translations: [
      "Gracias por llamar a TechConnect Solutions. Mi nombre es María. ¿En qué puedo ayudarle hoy? Por seguridad, ¿podría confirmar el correo en su cuenta?",
      "Entiendo. Permítame asegurarme — le cobraron $45.99 dos veces el 5 de marzo. ¿Es correcto? Necesito revisar esto. ¿Puedo ponerle en espera unos 2-3 minutos?",
      "Gracias por su paciencia. Esto es lo que encontré: el cargo duplicado ha sido revertido. Su reembolso de $45.99 aparecerá en 3-5 días hábiles. Su número de referencia es TC-4829.",
      "¿Hay algo más en lo que pueda ayudarle hoy? Gracias por llamar. ¡Que tenga un buen día!",
    ],
  },
  {
    lessonId: 'les-3-2-1',
    scenarioIdx: 0,
    sentences: [
      "Could you describe the issue in as much detail as possible?",
      "I understand. Just to confirm — you placed an order on February 20th and it still has not arrived. Is that correct?",
      "Thank you for the details. This sounds like a shipping issue. I am going to check the tracking status for you right now.",
    ],
    translations: [
      "¿Podría describir el problema con el mayor detalle posible?",
      "Entiendo. Solo para confirmar — usted hizo un pedido el 20 de febrero y aún no ha llegado. ¿Es correcto?",
      "Gracias por los detalles. Esto suena como un problema de envío. Voy a revisar el estado de rastreo para usted ahora mismo.",
    ],
  },
  {
    lessonId: 'les-3-2-2',
    scenarioIdx: 0,
    sentences: [
      "Here is what I am going to guide you through. It is just 3 steps. First, go to Settings and select Account. Could you let me know when you have done that?",
      "Perfect! Now click on Billing and then View Transactions.",
      "Great, you are almost there! Last step: select the charge from March 5th and click Request Refund. Does that make sense?",
    ],
    translations: [
      "Esto es lo que voy a guiarle. Son solo 3 pasos. Primero, vaya a Configuración y seleccione Cuenta. ¿Podría avisarme cuando haya hecho eso?",
      "¡Perfecto! Ahora haga clic en Facturación y luego en Ver Transacciones.",
      "¡Excelente, casi terminamos! Último paso: seleccione el cargo del 5 de marzo y haga clic en Solicitar Reembolso. ¿Tiene sentido?",
    ],
  },
  {
    lessonId: 'les-3-2-3',
    scenarioIdx: 0,
    sentences: [
      "I hear you, and I completely understand your frustration. This should not have happened and I sincerely apologize.",
      "Let me tell you exactly what I am going to do for you right now.",
      "I am going to process a full refund of $45.99 right now. You will see it back in your account within 3-5 business days. Is that acceptable?",
    ],
    translations: [
      "Le escucho, y entiendo completamente su frustración. Esto no debería haber pasado y me disculpo sinceramente.",
      "Permítame decirle exactamente lo que voy a hacer por usted ahora mismo.",
      "Voy a procesar un reembolso completo de $45.99 ahora mismo. Lo verá de vuelta en su cuenta en 3-5 días hábiles. ¿Es aceptable?",
    ],
  },
  {
    lessonId: 'les-3-2-4',
    scenarioIdx: 0,
    sentences: [
      "Before we end the call, let me summarize what we resolved today. We identified a duplicate charge of $45.99 from March 5th and processed a full refund. You should see it within 3-5 business days.",
      "Your case number is TC-4829 — please keep this for reference. If you experience any further issues, please call us back and reference this number. María handled your case today.",
      "Is there anything else I can help you with? Thank you for calling TechConnect Solutions and for your patience today. Have a great day, Mr. Johnson!",
    ],
    translations: [
      "Antes de terminar, permítame resumir lo que resolvimos hoy. Identificamos un cargo duplicado de $45.99 del 5 de marzo y procesamos un reembolso completo. Debería verlo en 3-5 días hábiles.",
      "Su número de caso es TC-4829 — consérvelo como referencia. Si experimenta algún problema adicional, llame de nuevo y haga referencia a este número. María manejó su caso hoy.",
      "¿Hay algo más en lo que pueda ayudarle? Gracias por llamar a TechConnect Solutions y por su paciencia hoy. ¡Que tenga un excelente día, Sr. Johnson!",
    ],
  },
  {
    lessonId: 'les-3-3-2',
    scenarioIdx: 0,
    sentences: [
      "Mr. Johnson, I completely understand. I am going to connect you with our billing supervisor right now. Before I transfer you, I am going to brief them on your case so you will not need to repeat yourself. Estimated wait is about 3 minutes. Thank you for your patience.",
      "Sarah, transferring Mr. Johnson — premium account. Issue: triple charge on monthly subscription. What I did: processed one refund but system blocked the other two.",
      "Status: customer is understandably frustrated but cooperative. They are waiting.",
    ],
    translations: [
      "Sr. Johnson, entiendo completamente. Voy a conectarle con nuestro supervisor de facturación ahora. Antes de transferirle, voy a informarle sobre su caso para que no necesite repetirse. La espera estimada es de unos 3 minutos. Gracias por su paciencia.",
      "Sarah, transfiriendo al Sr. Johnson — cuenta premium. Problema: cargo triple en la suscripción mensual. Lo que hice: procesé un reembolso pero el sistema bloqueó los otros dos.",
      "Estado: el cliente está comprensiblemente frustrado pero cooperativo. Están esperando.",
    ],
  },
  {
    lessonId: 'les-3-3-3',
    scenarioIdx: 0,
    sentences: [
      "Yesterday: I handled 42 calls and worked on 8 billing escalations. My CSAT was 94%.",
      "I had one notable situation — a VIP client with a triple charge that I escalated to Sarah. Today: I am planning to follow up on that case and clear my ticket backlog.",
      "Blockers: I have no blockers. That is it for me!",
    ],
    translations: [
      "Ayer: manejé 42 llamadas y trabajé en 8 escalaciones de facturación. Mi CSAT fue 94%.",
      "Tuve una situación notable — un cliente VIP con un cargo triple que escalé a Sarah. Hoy: planeo hacer seguimiento a ese caso y limpiar mis tickets pendientes.",
      "Bloqueadores: No tengo bloqueadores. ¡Eso es todo!",
    ],
  },
  {
    lessonId: 'les-3-3-4',
    scenarioIdx: 0,
    sentences: [
      "Good morning! My update: Yesterday I handled 38 calls and resolved 12 billing tickets. My CSAT was 92% and my average handle time was 4.5 minutes.",
      "I had one escalation — a shipping delay for a premium customer. Today I am planning to follow up on that case and focus on reducing my handle time.",
      "No blockers. That is all from me. Thanks!",
    ],
    translations: [
      "¡Buenos días! Mi actualización: Ayer manejé 38 llamadas y resolví 12 tickets de facturación. Mi CSAT fue 92% y mi tiempo promedio de manejo fue 4.5 minutos.",
      "Tuve una escalación — un retraso de envío de un cliente premium. Hoy planeo hacer seguimiento a ese caso y enfocarme en reducir mi tiempo de manejo.",
      "Sin bloqueadores. ¡Eso es todo! Gracias.",
    ],
  },
]

async function generateAudio(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': getKey(),
    },
    body: JSON.stringify({
      text: text.replace(/['']/g, "'"),
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    if (res.status === 401 || err.includes('quota') || err.includes('limit')) {
      throw new Error(`QUOTA_EXHAUSTED: ${res.status}`)
    }
    throw new Error(`ElevenLabs ${res.status}: ${err}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

async function uploadAudio(buffer, storagePath) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  console.log('🔧 Fixing 11 critical Route 3 scenarios\n')
  console.log(`📋 Total jobs: ${FIXES.reduce((s, f) => s + f.sentences.length, 0)} audio clips\n`)

  const stats = { generated: 0, chars: 0, errors: 0, lessons: 0 }

  for (const fix of FIXES) {
    console.log(`\n── ${fix.lessonId} sc${fix.scenarioIdx} (${fix.sentences.length} groups) ──`)

    // Fetch current lesson
    const { data: lesson } = await supabase
      .from('lessons').select('id, content').eq('id', fix.lessonId).single()
    if (!lesson) { console.log('  ❌ Lesson not found!'); continue }

    const urls = []
    let failed = false

    for (let i = 0; i < fix.sentences.length; i++) {
      const text = fix.sentences[i]
      process.stdout.write(`  🔊 ${i + 1}/${fix.sentences.length}: "${text.substring(0, 55)}..." (${text.length}ch) `)

      try {
        const audio = await generateAudio(text)
        const path = `practice/${fix.lessonId}/scenario-${fix.scenarioIdx}-sent-${i}.mp3`
        const url = await uploadAudio(audio, path)
        urls.push(url)
        stats.generated++
        stats.chars += text.length
        console.log('✅')
        await sleep(350)
      } catch (err) {
        if (err.message.includes('QUOTA_EXHAUSTED')) {
          console.log('⚠️ Quota exhausted')
          if (!rotateKey()) { failed = true; break }
          i-- // retry with new key
        } else if (err.message.includes('429')) {
          console.log('⏳ Rate limited')
          await sleep(10000)
          i-- // retry
        } else {
          console.log(`❌ ${err.message}`)
          stats.errors++
          urls.push(null) // placeholder
        }
      }
    }

    if (failed) { console.log('  ⛔ Stopping — no more API keys'); break }
    if (urls.length !== fix.sentences.length) { console.log('  ⚠️ Incomplete — skipping DB update'); continue }

    // Update DB
    const content = lesson.content
    const sc = content.practice.scenarios[fix.scenarioIdx]
    sc.sentences = fix.sentences
    sc.sentenceTranslations = fix.translations
    sc.sentenceAudioUrls = urls

    const { error } = await supabase
      .from('lessons').update({ content }).eq('id', fix.lessonId)
    if (error) {
      console.log(`  ❌ DB error: ${error.message}`)
    } else {
      console.log(`  ✅ ${fix.lessonId} updated → ${fix.sentences.length} groups`)
      stats.lessons++
    }
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`🎉 Done!`)
  console.log(`   ✅ ${stats.generated} audios generated`)
  console.log(`   📝 ~${stats.chars} chars used`)
  console.log(`   📚 ${stats.lessons} lessons updated`)
  console.log(`   ❌ ${stats.errors} errors`)
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
