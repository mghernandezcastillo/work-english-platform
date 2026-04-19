#!/usr/bin/env node
/**
 * Fix les-3-1-1 phrase 1:
 * Was: "Thank you for calling TechConnect Solutions. My name is Carlos. ..." (duplicate of phrase 0)
 * Now: "Could I please have your account number or the name on the account?"
 * (matches the Spanish translation that was already correct)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const STORAGE_BUCKET = 'lesson-audios'
const LESSON_ID = 'les-3-1-1'

const API_KEYS = [
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
  '8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9',
  'e3b29b520ee2c1a65d5544b3f7ec1312e4b96ff4314c3393ff9d575b1207bb1f',
  'c7aa6549fed01b2b674d8c9a6c658c5965de617c18c2fe0c784a259dc5a72705',
]

const NEW_PHRASE = {
  en: 'Could I please have your account number or the name on the account?',
  es: '¿Podría darme su número de cuenta o el nombre en la cuenta?'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function findWorkingKey() {
  for (const key of API_KEYS) {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } })
    if (!res.ok) continue
    const q = await res.json()
    const remaining = (q.character_limit || 10000) - (q.character_count || 0)
    if (remaining > 50) { console.log(`✅ Key ${key.substring(0,12)}... — ${remaining} chars`); return key }
  }
  return null
}

async function generateAudio(text, key) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': key },
    body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  console.log(`🔧 Fixing phrase 1 of ${LESSON_ID}\n`)
  const key = await findWorkingKey()
  if (!key) { console.error('❌ No key with quota'); process.exit(1) }

  const { data: lesson, error } = await supabase.from('lessons').select('id, content').eq('id', LESSON_ID).single()
  if (error) { console.error('❌ Fetch:', error.message); process.exit(1) }

  const content = lesson.content
  console.log(`Old phrase 1 EN: "${content.phrases.phrases[1].en}"`)
  console.log(`New phrase 1 EN: "${NEW_PHRASE.en}"\n`)

  // Generate audio
  process.stdout.write(`🔊 Generating audio... `)
  const audio = await generateAudio(NEW_PHRASE.en, key)
  const { error: upErr } = await supabase.storage.from(STORAGE_BUCKET)
    .upload(`${LESSON_ID}/phrase-1.mp3`, audio, { contentType: 'audio/mpeg', upsert: true })
  if (upErr) throw new Error(`Upload: ${upErr.message}`)
  const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(`${LESSON_ID}/phrase-1.mp3`)
  console.log(`✅`)

  // Update content
  content.phrases.phrases[1] = { ...NEW_PHRASE, audioUrl: urlData.publicUrl }

  const { error: dbErr } = await supabase.from('lessons').update({ content }).eq('id', LESSON_ID)
  if (dbErr) { console.error(`❌ DB:`, dbErr.message); process.exit(1) }

  console.log(`\n✅ Done! phrase-1.mp3 updated`)
  console.log(`   ${urlData.publicUrl}`)
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
