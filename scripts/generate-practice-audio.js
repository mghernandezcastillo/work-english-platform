/**
 * generate-practice-audio.js
 * Generates ElevenLabs TTS audio for "Ahora habla tú" scenarios,
 * uploads to Supabase Storage, updates lesson records.
 * 
 * Run locally: node scripts/generate-practice-audio.js
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env manually (no dotenv dependency)
function loadEnv() {
  try {
    const env = readFileSync(resolve(__dirname, '..', '.env'), 'utf8')
    for (const line of env.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {}
}
loadEnv()

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// ElevenLabs keys to try in order
const ELEVEN_KEYS = [
  'c7aa6549fed01b2b674d8c9a6c658c5965de617c18c2fe0c784a259dc5a72705',
  'e3b29b520ee2c1a65d5544b3f7ec1312e4b96ff4314c3393ff9d575b1207bb1f',
  '8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9',
]

if (!SERVICE_KEY) { console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env'); process.exit(1) }

const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL' // Sarah - Professional
const MODEL_ID = 'eleven_turbo_v2_5'
const BUCKET = 'lesson-audios'

const supaHeaders = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

function cleanText(text) {
  return text
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/(OPENING|VERIFICATION|PROBLEM|HOLD|SOLUTION|CLOSING|Step \d+ - \w+):\s*/gi, '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

let currentKeyIdx = 0

async function generateAudio(text) {
  const cleaned = cleanText(text)
  const body = JSON.stringify({
    text: cleaned,
    model_id: MODEL_ID,
    voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
  })

  // Try each key
  for (let attempt = 0; attempt < ELEVEN_KEYS.length; attempt++) {
    const key = ELEVEN_KEYS[currentKeyIdx]
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body,
    })

    if (res.ok) {
      return Buffer.from(await res.arrayBuffer())
    }

    const errText = await res.text()
    if (res.status === 401 || res.status === 429) {
      console.log(`    ⚠ Key ${currentKeyIdx + 1} blocked/exhausted, trying next...`)
      currentKeyIdx = (currentKeyIdx + 1) % ELEVEN_KEYS.length
      continue
    }
    throw new Error(`ElevenLabs ${res.status}: ${errText}`)
  }
  throw new Error('All ElevenLabs API keys exhausted')
}

async function uploadToStorage(filePath, audioBuffer) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'audio/mpeg',
      'x-upsert': 'true',
    },
    body: audioBuffer,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Upload ${res.status}: ${err}`)
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`
}

async function fetchLessons() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lessons?select=id,title,content&order=id`,
    { headers: supaHeaders }
  )
  const all = await res.json()
  return all.filter(l => l.content?.practice?.scenarios?.length > 0)
}

async function updateLesson(id, content) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lessons?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...supaHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ content }),
  })
  if (!res.ok) throw new Error(`DB update ${res.status}: ${await res.text()}`)
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('🎙️  Generating practice audio for "Ahora habla tú"...\n')

  const lessons = await fetchLessons()
  console.log(`📚 ${lessons.length} lessons with practice scenarios\n`)

  let generated = 0, skipped = 0, errors = 0

  for (const lesson of lessons) {
    const scenarios = lesson.content.practice.scenarios
    console.log(`\n── ${lesson.id}: ${lesson.title} (${scenarios.length} scenarios) ──`)

    let updated = false

    for (let i = 0; i < scenarios.length; i++) {
      const s = scenarios[i]

      // Skip if already has NEW audio (practice/ path prefix)
      if (s.audioUrl && s.audioUrl.includes('/practice/')) {
        console.log(`  ✓ #${i + 1}: already has ElevenLabs audio`)
        skipped++
        continue
      }

      if (!s.phrase || s.phrase.length < 10) {
        console.log(`  ⚠ #${i + 1}: phrase too short, skipping`)
        skipped++
        continue
      }

      console.log(`  🎙️ #${i + 1}: "${s.phrase.slice(0, 50)}..." (${s.phrase.length} chars)`)

      try {
        const buf = await generateAudio(s.phrase)
        const path = `practice/${lesson.id}/scenario-${i + 1}.mp3`
        const url = await uploadToStorage(path, buf)

        scenarios[i].audioUrl = url
        updated = true
        generated++

        console.log(`  ✅ ${(buf.length / 1024).toFixed(1)} KB → ${path}`)
        await sleep(800) // Rate limit
      } catch (err) {
        console.error(`  ❌ ${err.message}`)
        errors++
        if (err.message.includes('All ElevenLabs API keys exhausted')) {
          console.error('\n🛑 All keys exhausted. Saving progress...')
          if (updated) {
            await updateLesson(lesson.id, lesson.content)
            console.log(`  💾 Saved ${lesson.id}`)
          }
          console.log(`\n📊 Progress: ${generated} generated, ${skipped} skipped, ${errors} errors`)
          process.exit(1)
        }
      }
    }

    if (updated) {
      await updateLesson(lesson.id, lesson.content)
      console.log(`  💾 Saved to DB`)
    }
  }

  console.log(`\n\n🏁 DONE!`)
  console.log(`   ✅ Generated: ${generated}`)
  console.log(`   ⏭️  Skipped:   ${skipped}`)
  console.log(`   ❌ Errors:    ${errors}`)
  console.log(`   📦 Total:     ${generated + skipped + errors}`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
