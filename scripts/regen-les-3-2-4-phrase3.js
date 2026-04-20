#!/usr/bin/env node
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
const PHRASE_INDEX = 3

const API_KEYS = [
  process.env.ELEVENLABS_API_KEY,
  process.env.VITE_ELEVENLABS_API_KEY,
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
].filter(Boolean)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
let activeKey = null

async function findWorkingKey() {
  for (const key of API_KEYS) {
    const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': key } })
    if (!res.ok) { console.log(`  ⏭ ${key.substring(0,12)}... invalid`); continue }
    const q = await res.json()
    const remaining = (q.character_limit || 10000) - (q.character_count || 0)
    console.log(`  ✅ ${key.substring(0,12)}... — ${remaining} chars`)
    if (remaining > 50) { activeKey = key; return }
    console.log(`  ⏭ insufficient quota`)
  }
}

async function main() {
  console.log('🔑 Finding ElevenLabs key...')
  await findWorkingKey()
  if (!activeKey) { console.error('❌ No working key'); process.exit(1) }

  const { data: lesson } = await supabase.from('lessons').select('content').eq('id', LESSON_ID).single()
  const text = lesson.content.phrases.phrases[PHRASE_INDEX].en
  console.log(`\n📝 "${text}"`)
  console.log('🔊 Generating...')

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': activeKey },
    body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  })
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`)
  const audio = Buffer.from(await res.arrayBuffer())

  const storagePath = `${LESSON_ID}/phrase-${PHRASE_INDEX}.mp3`
  console.log(`📤 Uploading to ${storagePath}...`)
  const { error: upErr } = await supabase.storage.from('lesson-audios').upload(storagePath, audio, { contentType: 'audio/mpeg', upsert: true })
  if (upErr) throw new Error(upErr.message)

  const { data: urlData } = supabase.storage.from('lesson-audios').getPublicUrl(storagePath)
  lesson.content.phrases.phrases[PHRASE_INDEX].audioUrl = urlData.publicUrl

  const { error: dbErr } = await supabase.from('lessons').update({ content: lesson.content }).eq('id', LESSON_ID)
  if (dbErr) throw new Error(dbErr.message)

  console.log(`\n✅ Done! → ${urlData.publicUrl}`)
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
