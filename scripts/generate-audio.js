#!/usr/bin/env node
/**
 * ElevenLabs Audio Generator for English for Work Platform
 * Generates MP3s for all lesson phrases and uploads to Supabase Storage.
 * 
 * Usage:
 *   $env:ELEVENLABS_API_KEY="sk_..."
 *   $env:SUPABASE_SERVICE_KEY="eyJ..."
 *   node scripts/generate-audio.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''

// Voice: Sarah — clear, professional, American English (free plan compatible)
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const STORAGE_BUCKET = 'lesson-audios'

if (!ELEVENLABS_API_KEY) { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }
if (!SUPABASE_SERVICE_KEY) { console.error('❌ Set SUPABASE_SERVICE_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function ensureBucket() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets()
  if (listErr) throw new Error(`List buckets error: ${listErr.message}`)
  
  const exists = buckets?.some(b => b.name === STORAGE_BUCKET)
  if (!exists) {
    const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, { 
      public: true,
      allowedMimeTypes: ['audio/mpeg'],
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    })
    if (error) throw new Error(`Create bucket error: ${error.message}`)
    console.log(`✅ Bucket '${STORAGE_BUCKET}' creado`)
  } else {
    console.log(`✅ Bucket '${STORAGE_BUCKET}' encontrado`)
  }
}

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
      model_id: 'eleven_turbo_v2', // faster + cheaper chars
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`ElevenLabs ${res.status}: ${err}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

async function uploadAudio(buffer, storagePath) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    })
  if (error) throw new Error(`Upload error: ${error.message}`)
  
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function processLesson(lesson, stats) {
  const content = lesson.content || {}
  let changed = false
  const lessonId = lesson.id

  console.log(`\n📖 ${lesson.title} (${lessonId})`)

  // ── PHRASES ──
  const phrases = content.phrases?.phrases || []
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i]
    if (!phrase.en) continue
    if (phrase.audioUrl) { console.log(`  ⏭ Phrase ${i+1}: ya tiene audio`); continue }

    try {
      process.stdout.write(`  🔊 Phrase ${i+1}: "${phrase.en.substring(0,45)}..." `)
      const audio = await generateAudio(phrase.en)
      const url = await uploadAudio(audio, `${lessonId}/phrase-${i}.mp3`)
      content.phrases.phrases[i].audioUrl = url
      changed = true
      stats.generated++
      stats.chars += phrase.en.length
      console.log(`✅`)
      await sleep(500)
    } catch (err) {
      console.log(`❌ ${err.message}`)
      stats.errors++
    }
  }

  // ── PRACTICE SCENARIOS ──
  const scenarios = content.practice?.scenarios || []
  for (let i = 0; i < scenarios.length; i++) {
    const sc = scenarios[i]
    if (!sc.phrase) continue
    if (sc.audioUrl) { console.log(`  ⏭ Practice ${i+1}: ya tiene audio`); continue }

    // Only short practice phrases (< 300 chars) to save quota
    if (sc.phrase.length > 300) {
      console.log(`  ⏭ Practice ${i+1}: demasiado larga (${sc.phrase.length} chars), Web Speech fallback`)
      continue
    }

    try {
      process.stdout.write(`  🔊 Practice ${i+1}: "${sc.phrase.substring(0,45)}..." `)
      const audio = await generateAudio(sc.phrase)
      const url = await uploadAudio(audio, `${lessonId}/practice-${i}.mp3`)
      content.practice.scenarios[i].audioUrl = url
      changed = true
      stats.generated++
      stats.chars += sc.phrase.length
      console.log(`✅`)
      await sleep(500)
    } catch (err) {
      console.log(`❌ ${err.message}`)
      stats.errors++
    }
  }

  // Update DB if anything changed
  if (changed) {
    const { error } = await supabase
      .from('lessons')
      .update({ content })
      .eq('id', lessonId)
    if (error) console.error(`  ❌ DB error: ${error.message}`)
    else process.stdout.write(`  💾 DB actualizado\n`)
  }
}

async function main() {
  console.log('🎧 English for Work — Audio Generator\n')
  console.log(`📡 ElevenLabs key: ${ELEVENLABS_API_KEY.substring(0, 10)}...`)
  
  // Check ElevenLabs quota first
  const quotaRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  if (!quotaRes.ok) {
    console.error(`❌ ElevenLabs auth failed: ${await quotaRes.text()}`)
    process.exit(1)
  }
  const quota = await quotaRes.json()
  const used = quota.character_count || 0
  const limit = quota.character_limit || 10000
  const remaining = limit - used
  console.log(`📊 ElevenLabs: ${used}/${limit} chars usados, ${remaining} disponibles\n`)

  if (remaining < 100) {
    console.error('❌ Cuota insuficiente')
    process.exit(1)
  }

  await ensureBucket()

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, content')
    .order('id')
  
  if (error) throw new Error(`Fetch lessons: ${error.message}`)
  console.log(`\n📚 ${lessons.length} lecciones encontradas\n`)

  const stats = { generated: 0, chars: 0, errors: 0 }

  for (const lesson of lessons) {
    // Stop if running low on quota
    if (stats.chars > remaining - 200) {
      console.log('\n⚠️ Cuota casi agotada, deteniendo...')
      break
    }
    await processLesson(lesson, stats)
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`🎉 Completado!`)
  console.log(`   ✅ ${stats.generated} audios generados`)
  console.log(`   📝 ~${stats.chars} caracteres usados`)
  console.log(`   ❌ ${stats.errors} errores`)
  console.log(`   📊 ElevenLabs: ~${remaining - stats.chars} chars restantes`)
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err.message)
  process.exit(1)
})
