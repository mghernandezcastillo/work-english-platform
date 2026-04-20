#!/usr/bin/env node
/**
 * Regen scenario 2 audios for les-3-2-4 with TIMESTAMPED filenames
 * to bust Supabase CDN cache.
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
const TS = Date.now() // unique suffix to bust CDN cache

const SENTENCES = [
  'Perfect. I have processed the replacement shipment.',
  'You will receive a tracking number within 24 hours.',
  'I also added a note to your account so if you call back, any agent can see what we discussed today.',
]
const TRANSLATIONS = [
  'Perfecto. He procesado el envío de reemplazo.',
  'Recibirá un número de seguimiento en 24 horas.',
  'También agregué una nota a su cuenta para que si llama de nuevo, cualquier agente pueda ver lo que discutimos hoy.',
]

const API_KEYS = [
  process.env.ELEVENLABS_API_KEY,
  process.env.VITE_ELEVENLABS_API_KEY,
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
].filter(Boolean)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
let activeKey = null

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function findWorkingKey() {
  for (const key of API_KEYS) {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } })
    if (!res.ok) continue
    const q = await res.json()
    const rem = (q.character_limit || 10000) - (q.character_count || 0)
    console.log(`  ✅ ${key.substring(0,12)}... — ${rem} chars`)
    if (rem > 200) { activeKey = key; return }
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
  console.log('🔑 Finding key...')
  await findWorkingKey()
  if (!activeKey) { console.error('❌ No working key'); process.exit(1) }

  const { data: lesson } = await supabase.from('lessons').select('content').eq('id', LESSON_ID).single()
  const content = lesson.content
  const sc = content.practice.scenarios[SCENARIO_INDEX]

  sc.phrase = SENTENCES.join(' ')
  sc.translation = TRANSLATIONS.join(' ')
  sc.sentences = SENTENCES
  sc.sentenceTranslations = TRANSLATIONS
  sc.sentenceAudioUrls = []

  for (let i = 0; i < SENTENCES.length; i++) {
    const text = SENTENCES[i]
    process.stdout.write(`🔊 [${i}] "${text.substring(0, 55)}"... `)
    const audio = await generateAudio(text)
    // New unique filename to bust CDN cache
    const storagePath = `practice/${LESSON_ID}/sc2-s${i}-${TS}.mp3`
    const { error: upErr } = await supabase.storage
      .from('lesson-audios')
      .upload(storagePath, audio, { contentType: 'audio/mpeg', upsert: false })
    if (upErr) throw new Error(`Upload: ${upErr.message}`)
    const { data: urlData } = supabase.storage.from('lesson-audios').getPublicUrl(storagePath)
    sc.sentenceAudioUrls.push(urlData.publicUrl)
    console.log('✅')
    await sleep(400)
  }

  // Bump _v to bust lesson cache
  content._v = TS.toString()

  const { error: dbErr } = await supabase.from('lessons').update({ content }).eq('id', LESSON_ID)
  if (dbErr) throw new Error(dbErr.message)

  console.log('\n✅ Done! Audio URLs:')
  sc.sentenceAudioUrls.forEach((u, i) => console.log(` ${i}: ${u.split('/').pop()}`))
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
