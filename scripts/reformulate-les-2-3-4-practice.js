#!/usr/bin/env node
/**
 * Reformula los escenarios de práctica de les-2-3-4
 * Reemplaza el timeline no-pronunciable y los escenarios poco orales
 * por 3 situaciones conversacionales reales.
 * Solo toca content.practice.scenarios de esa lección.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah — professional American English
const LESSON_ID = 'les-2-3-4'
const BUCKET = 'lesson-audios'

if (!SUPABASE_SERVICE_KEY) { console.error('❌ Set SUPABASE_SERVICE_KEY'); process.exit(1) }
if (!ELEVENLABS_API_KEY)   { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── New conversational practice scenarios ─────────────────────────────────────
// All 3 are genuinely spoken — natural oral responses to interview-process questions.
const NEW_SCENARIOS = [
  {
    prompt: 'After the interview, what did you do next?',
    context: 'Describiendo tu seguimiento post-entrevista',
    sentences: [
      'I sent a thank-you email the same day.',
      'I kept it brief — I thanked them for their time and mentioned one specific thing I appreciated about the team.',
      'Then I marked my calendar for day seven, just in case I needed to follow up.',
    ],
    sentenceTranslations: [
      'Envié un email de agradecimiento el mismo día.',
      'Lo mantuve breve — les agradecí su tiempo y mencioné algo específico que aprecié del equipo.',
      'Luego marqué mi calendario para el día siete, por si necesitaba hacer seguimiento.',
    ],
  },
  {
    prompt: 'How did you handle receiving the offer?',
    context: 'Respondiendo a una oferta de trabajo',
    sentences: [
      'I asked for a couple of days to review the details.',
      'Once I was ready, I sent a formal acceptance email.',
      'I confirmed the start date and asked about the onboarding process.',
    ],
    sentenceTranslations: [
      'Pedí un par de días para revisar los detalles.',
      'Cuando estuve listo, envié un email formal de aceptación.',
      'Confirmé la fecha de inicio y pregunté sobre el proceso de incorporación.',
    ],
  },
  {
    prompt: 'Have you ever had to decline a job offer? How did you do it?',
    context: 'Declinando una oferta con profesionalismo',
    sentences: [
      'Yes, I have — and I always do it by email, never by ghosting.',
      'I thank them sincerely for the opportunity and explain briefly that I have decided to go in a different direction.',
      'I always try to leave the door open — the professional world is small.',
    ],
    sentenceTranslations: [
      'Sí — y siempre lo hago por email, nunca con silencio.',
      'Les agradezco sinceramente la oportunidad y explico brevemente que he decidido tomar otro camino.',
      'Siempre intento dejar la puerta abierta — el mundo profesional es pequeño.',
    ],
  },
]

// ── ElevenLabs TTS ────────────────────────────────────────────────────────────
async function generateAudio(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
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

async function upload(buffer, path) {
  const { error } = await sb.storage.from(BUCKET).upload(path, buffer, {
    contentType: 'audio/mpeg',
    upsert: true,
  })
  if (error) throw new Error(`Upload ${path}: ${error.message}`)
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📖 Reformulando práctica de ${LESSON_ID}...\n`)

  // 1. Fetch current lesson
  const { data: lesson, error: fetchErr } = await sb
    .from('lessons').select('content').eq('id', LESSON_ID).single()
  if (fetchErr) throw new Error(`Fetch: ${fetchErr.message}`)

  const content = lesson.content

  // 2. Generate audio for every sentence in every new scenario
  const builtScenarios = []

  for (let si = 0; si < NEW_SCENARIOS.length; si++) {
    const sc = NEW_SCENARIOS[si]
    console.log(`\n🎙 Escenario ${si + 1}: "${sc.prompt}"`)

    const sentenceAudioUrls = []

    for (let wi = 0; wi < sc.sentences.length; wi++) {
      const text = sc.sentences[wi]
      process.stdout.write(`  Frase ${wi + 1}: "${text.substring(0, 50)}..." `)
      try {
        const audio = await generateAudio(text)
        const path = `practice/${LESSON_ID}/new-scenario-${si}-sent-${wi}.mp3`
        const url = await upload(audio, path)
        sentenceAudioUrls.push(url)
        console.log('✅')
        await sleep(600)
      } catch (err) {
        console.log(`❌ ${err.message}`)
        sentenceAudioUrls.push(null)
      }
    }

    // Build full phrase from sentences (for scoring fallback)
    const phrase = sc.sentences.join(' ')
    const translation = sc.sentenceTranslations.join(' ')

    builtScenarios.push({
      prompt: sc.prompt,
      context: sc.context,
      phrase,
      translation,
      sentences: sc.sentences,
      sentenceTranslations: sc.sentenceTranslations,
      sentenceAudioUrls: sentenceAudioUrls.filter(Boolean),
    })
  }

  // 3. Replace only content.practice.scenarios
  content.practice = { scenarios: builtScenarios }

  const { error: updateErr } = await sb
    .from('lessons').update({ content }).eq('id', LESSON_ID)
  if (updateErr) throw new Error(`Update DB: ${updateErr.message}`)

  console.log('\n✅ DB actualizado')
  console.log('🎉 Listo — solo se tocó content.practice.scenarios de les-2-3-4')
}

main().catch(err => {
  console.error('\n💥', err.message)
  process.exit(1)
})
