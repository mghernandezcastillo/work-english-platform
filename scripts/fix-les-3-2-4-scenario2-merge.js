#!/usr/bin/env node
/**
 * Merge sentences 0+1 of scenario 2 in les-3-2-4.
 * "Perfect." joins "I have processed the replacement shipment." → one sentence.
 * Regenerates the 3 resulting sentence audios.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

try {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '')
  }
} catch {}

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const LESSON_ID = 'les-3-2-4'
const SCENARIO_INDEX = 2

const API_KEYS = [
  process.env.ELEVENLABS_API_KEY,
  process.env.VITE_ELEVENLABS_API_KEY,
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
].filter(Boolean)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
let activeKey = null

// New merged sentences (3 instead of 4)
const NEW_SENTENCES = [
  'Perfect. I have processed the replacement shipment.',
  'You will receive a tracking number within 24 hours.',
  'I also added a note to your account so if you call back, any agent can see what we discussed today.',
]
const NEW_TRANSLATIONS = [
  'Perfecto. He procesado el envío de reemplazo.',
  'Recibirá un número de seguimiento en 24 horas.',
  'También agregué una nota a su cuenta para que si llama de nuevo, cualquier agente pueda ver lo que discutimos hoy.',
]

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function findWorkingKey() {
  for (const key of API_KEYS) {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } })
    if (!res.ok) { console.log(`  ⏭ ${key.substring(0,12)}... invalid`); continue }
    const q = await res.json()
    const remaining = (q.character_limit || 10000) - (q.character_count || 0)
    console.log(`  ✅ ${key.substring(0,12)}... — ${remaining} chars`)
    if (remaining > 200) { activeKey = key; return }
    console.log(`  ⏭ insufficient quota`)
  }
}

async function generateAudio(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': activeKey },
    body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  console.log('🔑 Finding ElevenLabs key...')
  await findWorkingKey()
  if (!activeKey) { console.error('❌ No working key'); process.exit(1) }

  const { data: lesson } = await supabase.from('lessons').select('content').eq('id', LESSON_ID).single()
  const content = lesson.content
  const sc = content.practice.scenarios[SCENARIO_INDEX]

  // Update phrase (joined)
  sc.phrase = NEW_SENTENCES.join(' ')
  sc.translation = NEW_TRANSLATIONS.join(' ')
  sc.sentences = NEW_SENTENCES
  sc.sentenceTranslations = NEW_TRANSLATIONS
  sc.sentenceAudioUrls = []

  console.log(`\n📋 New sentences:`)
  NEW_SENTENCES.forEach((s, i) => console.log(`  ${i}: ${s}`))

  // Generate & upload each sentence audio
  for (let i = 0; i < NEW_SENTENCES.length; i++) {
    const text = NEW_SENTENCES[i]
    process.stdout.write(`\n🔊 [${i}] "${text.substring(0, 60)}"... `)
    const audio = await generateAudio(text)
    const storagePath = `practice/${LESSON_ID}/scenario-${SCENARIO_INDEX}-sent-${i}.mp3`
    const { error: upErr } = await supabase.storage
      .from('lesson-audios')
      .upload(storagePath, audio, { contentType: 'audio/mpeg', upsert: true })
    if (upErr) throw new Error(`Upload: ${upErr.message}`)
    const { data: urlData } = supabase.storage.from('lesson-audios').getPublicUrl(storagePath)
    sc.sentenceAudioUrls.push(urlData.publicUrl)
    console.log('✅')
    await sleep(400)
  }

  const { error: dbErr } = await supabase.from('lessons').update({ content }).eq('id', LESSON_ID)
  if (dbErr) throw new Error(dbErr.message)

  console.log('\n✅ Done! Scenario updated with 3 merged sentences.')
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
