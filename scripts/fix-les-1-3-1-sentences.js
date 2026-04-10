#!/usr/bin/env node
/**
 * Fix les-1-3-1 scenario 1: regroup 5 sentences → 3 grouped sentences
 * Generates 3 new ElevenLabs audios and updates the DB with a `sentences` override array.
 *
 * The `sentences` field in the scenario overrides splitSentences() when present.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const STORAGE_BUCKET = 'lesson-audios'

if (!ELEVENLABS_API_KEY) { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// The 3 grouped sentences for scenario 1
const GROUPED_SENTENCES = [
  "Good morning! My name is Carlos and I am the new customer service agent.",
  "Nice to meet you. I just joined the team this week.",
  "I look forward to working with all of you.",
]

const GROUPED_TRANSLATIONS = [
  "¡Buenos días! Me llamo Carlos y soy el nuevo agente de servicio al cliente.",
  "Mucho gusto. Me uní al equipo esta semana.",
  "Espero con entusiasmo trabajar con todos ustedes.",
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
  console.log('🔧 Fixing les-1-3-1 scenario 1: 5 sentences → 3 grouped\n')

  // Check quota
  const qRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  const q = await qRes.json()
  const remaining = (q.character_limit || 10000) - (q.character_count || 0)
  const needed = GROUPED_SENTENCES.reduce((s, t) => s + t.length, 0)
  console.log(`📊 Quota: ${remaining} chars | Need: ${needed} chars\n`)
  if (remaining < needed) { console.error('❌ Not enough quota'); process.exit(1) }

  // Generate 3 audios
  const urls = []
  for (let i = 0; i < GROUPED_SENTENCES.length; i++) {
    const text = GROUPED_SENTENCES[i]
    process.stdout.write(`  🔊 Sentence ${i}: "${text.substring(0, 60)}..." (${text.length}ch) `)
    const audio = await generateAudio(text)
    const path = `practice/les-1-3-1/scenario-0-sent-${i}.mp3`
    const url = await uploadAudio(audio, path)
    urls.push(url)
    console.log('✅')
    await sleep(400)
  }

  // Fetch lesson and update
  const { data: lesson } = await supabase
    .from('lessons').select('id, content').eq('id', 'les-1-3-1').single()
  if (!lesson) { console.error('❌ Lesson not found'); process.exit(1) }

  const content = lesson.content
  const sc = content.practice.scenarios[0]
  
  // Add explicit sentences + translations arrays AND update sentenceAudioUrls
  sc.sentences = GROUPED_SENTENCES
  sc.sentenceTranslations = GROUPED_TRANSLATIONS
  sc.sentenceAudioUrls = urls

  const { error } = await supabase
    .from('lessons').update({ content }).eq('id', 'les-1-3-1')
  if (error) { console.error(`❌ DB update: ${error.message}`); process.exit(1) }

  console.log('\n✅ Database updated!')
  console.log(`   sentences: [${GROUPED_SENTENCES.length} groups]`)
  console.log(`   sentenceAudioUrls: [${urls.length} URLs]`)
  console.log(`   ~${needed} chars used`)
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
