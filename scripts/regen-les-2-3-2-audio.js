#!/usr/bin/env node
/**
 * Regenerate audio for les-2-3-2 scenario 0 (Thank-you email).
 * The phrase was corrected — this forces new ElevenLabs audio generation
 * and updates sentenceAudioUrls + sets explicit sentences[] in DB.
 *
 * Usage:
 *   $env:ELEVENLABS_API_KEY="sk_..."
 *   node scripts/regen-les-2-3-2-audio.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah — professional American English
const STORAGE_BUCKET = 'lesson-audios'
const LESSON_ID = 'les-2-3-2'

if (!ELEVENLABS_API_KEY) { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Explicit sentences for Scenario 0 ───────────────────────────────────────
// These are the 4 sentences shown in the UI practice screen.
const SCENARIO_0_SENTENCES = [
  "Hi Mr. Pérez, Thank you for the time today discussing the Bilingual Support Agent role.",
  "I particularly enjoyed our conversation about how the team handles peak season volume.",
  "My experience managing high-volume calls at Teleperformance has prepared me well for those exact challenges.",
  "I look forward to the next steps.",
]

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

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

async function uploadAudio(buffer, storagePath) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload: ${error.message}`)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  console.log(`🔧 Regenerating ${LESSON_ID} scenario 0 audios\n`)

  // Check quota
  const qRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  if (!qRes.ok) { console.error('❌ ElevenLabs auth failed'); process.exit(1) }
  const q = await qRes.json()
  const remaining = (q.character_limit || 10000) - (q.character_count || 0)
  const needed = SCENARIO_0_SENTENCES.reduce((s, t) => s + t.length, 0)
  console.log(`📊 Quota: ${remaining} chars available | Need: ${needed} chars\n`)
  if (remaining < needed) { console.error('❌ Not enough quota'); process.exit(1) }

  // Generate audios for each sentence
  const urls = []
  for (let i = 0; i < SCENARIO_0_SENTENCES.length; i++) {
    const text = SCENARIO_0_SENTENCES[i]
    process.stdout.write(`  🔊 Sentence ${i}: "${text.substring(0, 60)}..." (${text.length}ch) `)
    const audio = await generateAudio(text)
    const path = `practice/${LESSON_ID}/scenario-0-sent-${i}.mp3`
    const url = await uploadAudio(audio, path)
    urls.push(url)
    console.log('✅')
    await sleep(400)
  }

  // Fetch lesson and apply update
  const { data: lesson, error: fetchErr } = await supabase
    .from('lessons').select('id, content').eq('id', LESSON_ID).single()
  if (fetchErr || !lesson) { console.error('❌ Lesson not found'); process.exit(1) }

  const content = lesson.content
  const sc = content.practice.scenarios[0]

  // Set explicit sentences array (overrides splitSentences()) + new audio URLs
  sc.sentences = SCENARIO_0_SENTENCES
  sc.sentenceAudioUrls = urls

  const { error: dbErr } = await supabase
    .from('lessons').update({ content }).eq('id', LESSON_ID)
  if (dbErr) { console.error(`❌ DB update: ${dbErr.message}`); process.exit(1) }

  console.log('\n✅ Database updated!')
  console.log(`   sentences: [${SCENARIO_0_SENTENCES.length} sentences]`)
  console.log(`   sentenceAudioUrls: [${urls.length} URLs]`)
  console.log(`   ~${needed} chars used`)
  urls.forEach((u, i) => console.log(`   [${i}] ${u}`))
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
