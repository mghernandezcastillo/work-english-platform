#!/usr/bin/env node
/**
 * Regenerate phrase audios for les-3-1-1 (Frases de apertura y cierre de llamadas).
 * Phrases 0, 1, 4 reference TechConnect Solutions / María / Carlos — the old audio
 * was generated with placeholder text. This forces fresh ElevenLabs generation.
 *
 * Usage:
 *   node scripts/regen-les-3-1-1-phrases.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah — professional American English
const STORAGE_BUCKET = 'lesson-audios'
const LESSON_ID = 'les-3-1-1'

// ElevenLabs API keys from .env (try in order until one works)
const API_KEYS = [
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
  '8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9',
  'e3b29b520ee2c1a65d5544b3f7ec1312e4b96ff4314c3393ff9d575b1207bb1f',
  'c7aa6549fed01b2b674d8c9a6c658c5965de617c18c2fe0c784a259dc5a72705',
]

// Indices of phrases to forcibly regenerate (all 6, since we can't verify which audio is stale)
const PHRASE_INDICES_TO_REGEN = [0, 1, 2, 3, 4, 5]

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
let activeKey = null

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function findWorkingKey() {
  for (const key of API_KEYS) {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
      headers: { 'xi-api-key': key }
    })
    if (!res.ok) { console.log(`  ⏭ Key ${key.substring(0,12)}... invalid`); continue }
    const q = await res.json()
    const remaining = (q.character_limit || 10000) - (q.character_count || 0)
    console.log(`  ✅ Key ${key.substring(0,12)}... — ${remaining} chars remaining`)
    if (remaining > 50) { activeKey = key; return remaining }
    console.log(`  ⏭ Skipping — insufficient quota`)
  }
  return 0
}

async function generateAudio(text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': activeKey,
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

async function uploadAudio(buffer, storagePath) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  console.log(`🔧 Regenerating phrases for ${LESSON_ID}\n`)
  console.log('🔑 Finding working ElevenLabs key...')
  const remaining = await findWorkingKey()
  if (!activeKey) { console.error('❌ No working API key with quota'); process.exit(1) }

  // Fetch lesson
  const { data: lesson, error: fetchErr } = await supabase
    .from('lessons').select('id, content').eq('id', LESSON_ID).single()
  if (fetchErr || !lesson) { console.error('❌ Lesson not found'); process.exit(1) }

  const content = lesson.content
  const phrases = content.phrases.phrases

  console.log(`\n📋 Found ${phrases.length} phrases. Regenerating indices: ${PHRASE_INDICES_TO_REGEN.join(', ')}\n`)

  let totalChars = 0
  let errors = 0

  for (const idx of PHRASE_INDICES_TO_REGEN) {
    const phrase = phrases[idx]
    if (!phrase?.en) { console.log(`  ⏭ Phrase ${idx}: missing`); continue }
    const text = phrase.en
    process.stdout.write(`  🔊 Phrase ${idx}: "${text.substring(0, 60)}" `)
    try {
      const audio = await generateAudio(text)
      const path = `${LESSON_ID}/phrase-${idx}.mp3`
      const url = await uploadAudio(audio, path)
      content.phrases.phrases[idx].audioUrl = url
      totalChars += text.length
      console.log(`✅`)
      await sleep(400)
    } catch (err) {
      console.log(`❌ ${err.message}`)
      errors++
    }
  }

  // Save back to DB
  const { error: dbErr } = await supabase
    .from('lessons').update({ content }).eq('id', LESSON_ID)
  if (dbErr) { console.error(`❌ DB update: ${dbErr.message}`); process.exit(1) }

  console.log(`\n✅ Done! ${PHRASE_INDICES_TO_REGEN.length - errors} audios regenerated, ${errors} errors, ~${totalChars} chars used`)
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
