import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const BUCKET = 'lesson-audios'

if (!ELEVENLABS_API_KEY) { console.error('Set ELEVENLABS_API_KEY'); process.exit(1) }
if (!SUPABASE_SERVICE_KEY) { console.error('Set SUPABASE_SERVICE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const TARGETS = [
  { lessonId: 'les-1-2-1', scenarioIdx: 0, storagePath: 'practice/les-1-2-1/scenario-1.mp3' },
  { lessonId: 'les-2-2-3', scenarioIdx: 0, storagePath: 'practice/les-2-2-3/scenario-1.mp3' },
  { lessonId: 'les-2-3-3', scenarioIdx: 0, storagePath: 'practice/les-2-3-3/scenario-1.mp3' },
]

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

async function main() {
  console.log('Re-generating salary scenario audio...\n')

  const qRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  const q = await qRes.json()
  console.log(`Quota: ${q.character_count}/${q.character_limit} used, ${q.character_limit - q.character_count} remaining\n`)

  for (const target of TARGETS) {
    const { data: lesson } = await supabase.from('lessons').select('content').eq('id', target.lessonId).single()
    const phrase = lesson.content.practice.scenarios[target.scenarioIdx].phrase
    console.log(`${target.lessonId}: "${phrase.substring(0, 80)}..."`)
    console.log(`  ${phrase.length} chars`)

    process.stdout.write('  Generating... ')
    const audio = await generateAudio(phrase)
    console.log(`OK ${(audio.length / 1024).toFixed(1)} KB`)

    process.stdout.write('  Uploading... ')
    const { error } = await supabase.storage.from(BUCKET).upload(target.storagePath, audio, { contentType: 'audio/mpeg', upsert: true })
    if (error) console.log(`FAIL ${error.message}`)
    else console.log('OK')

    await new Promise(r => setTimeout(r, 500))
  }
  console.log('\nDone!')
}

main().catch(err => { console.error(err.message); process.exit(1) })
