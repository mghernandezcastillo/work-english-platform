#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mtobgwfknefjlpoxznqx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
)
const KEYS = [
  'sk_2f6a3ebe6c10b29aca1945218e23662393748f2854919baf',
  'sk_1fb6825b549db314deb6ec7db9eb76173cfb4e36919460b4',
  '8f7220dd635680066a130e2a110917239e98549f810c8ea132ed46d76925e5b9',
]
const VOICE = 'EXAVITQu4vr4xnSDxMaL'
const LESSON = 'les-3-1-1'

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function findKey() {
  for (const k of KEYS) {
    const r = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': k } })
    if (!r.ok) continue
    const q = await r.json()
    const rem = (q.character_limit || 10000) - (q.character_count || 0)
    if (rem > 100) { console.log('Key ok:', k.substring(0, 12), '| remaining:', rem); return k }
  }
  return null
}

async function main() {
  const key = await findKey()
  if (!key) { console.error('No key with quota'); process.exit(1) }

  const { data: lesson } = await supabase.from('lessons').select('content').eq('id', LESSON).single()
  const phrases = lesson.content.phrases.phrases
  // phrase-1 already done with v2 — skip it; redo 0, 2, 3, 4, 5
  const toRegen = [0, 2, 3, 4, 5]

  for (const i of toRegen) {
    const text = phrases[i].en
    process.stdout.write('  phrase-' + i + ': "' + text.substring(0, 50) + '" ')
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOICE, {
      method: 'POST',
      headers: { 'Accept': 'audio/mpeg', 'Content-Type': 'application/json', 'xi-api-key': key },
      body: JSON.stringify({ text, model_id: 'eleven_turbo_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } })
    })
    if (!r.ok) { console.log('ERR', await r.text()); continue }
    const buf = Buffer.from(await r.arrayBuffer())
    const path = LESSON + '/phrase-' + i + '-v2.mp3'
    const { error: upErr } = await supabase.storage.from('lesson-audios').upload(path, buf, { contentType: 'audio/mpeg', upsert: true })
    if (upErr) { console.log('upload err:', upErr.message); continue }
    const { data } = supabase.storage.from('lesson-audios').getPublicUrl(path)
    phrases[i].audioUrl = data.publicUrl
    console.log('ok')
    await sleep(400)
  }

  const { error } = await supabase.from('lessons').update({ content: lesson.content }).eq('id', LESSON)
  if (error) { console.error('db:', error.message); process.exit(1) }
  console.log('All done!')
}

main().catch(e => { console.error(e.message); process.exit(1) })
