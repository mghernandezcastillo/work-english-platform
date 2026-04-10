#!/usr/bin/env node
/**
 * ElevenLabs Sentence-Level Audio Generator
 * Generates individual MP3s for each sentence in multi-sentence practice scenarios.
 * Stores URLs in scenario.sentenceAudioUrls = [url1, url2, url3]
 *
 * Usage:
 *   $env:ELEVENLABS_API_KEY="sk_..."
 *   node scripts/generate-sentence-audio.js
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''

// Voice: Sarah — clear, professional, American English
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'
const STORAGE_BUCKET = 'lesson-audios'

if (!ELEVENLABS_API_KEY) { console.error('❌ Set ELEVENLABS_API_KEY'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

/**
 * Splits a long phrase into individual sentences.
 * Protects decimal numbers (e.g. "3.5 million") from being split.
 */
function splitSentences(text) {
  if (!text) return []
  const safe = text.replace(/(\d)\.(\d)/g, '$1\u00B7$2')
  const parts = safe.match(/[^.!?]*[.!?]+/g)
  if (!parts || parts.length <= 1) return [text.trim()]
  return parts.map(s => s.replace(/\u00B7/g, '.').trim()).filter(Boolean)
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
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
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
    .upload(storagePath, buffer, { contentType: 'audio/mpeg', upsert: true })
  if (error) throw new Error(`Upload error: ${error.message}`)
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  console.log('🎧 Sentence-Level Audio Generator\n')

  // Check quota
  const quotaRes = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
    headers: { 'xi-api-key': ELEVENLABS_API_KEY }
  })
  if (!quotaRes.ok) { console.error('❌ Auth failed'); process.exit(1) }
  const quota = await quotaRes.json()
  const remaining = (quota.character_limit || 10000) - (quota.character_count || 0)
  console.log(`📊 ElevenLabs: ${remaining} chars available\n`)

  // Fetch lessons
  const { data: lessons, error } = await supabase
    .from('lessons').select('id, title, content').order('id')
  if (error) throw new Error(`Fetch: ${error.message}`)

  // Collect all sentence generation jobs
  const jobs = []
  for (const lesson of lessons) {
    const scenarios = lesson.content?.practice?.scenarios || []
    for (let si = 0; si < scenarios.length; si++) {
      const sc = scenarios[si]
      if (!sc.phrase) continue
      const sentences = splitSentences(sc.phrase)
      if (sentences.length <= 1) continue // single sentence — use existing audioUrl

      // Check if sentenceAudioUrls already exist and are complete
      if (sc.sentenceAudioUrls && sc.sentenceAudioUrls.length === sentences.length &&
          sc.sentenceAudioUrls.every(u => u)) {
        console.log(`  ⏭ ${lesson.id} sc${si}: already has ${sentences.length} sentence audios`)
        continue
      }

      // Build jobs for missing sentences
      const existing = sc.sentenceAudioUrls || []
      for (let fi = 0; fi < sentences.length; fi++) {
        if (existing[fi]) continue // already generated
        jobs.push({
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          scenarioIdx: si,
          sentenceIdx: fi,
          text: sentences[fi],
          chars: sentences[fi].length,
          totalSentences: sentences.length,
        })
      }
    }
  }

  // Sort by char count (shortest first) to maximize coverage with limited quota
  jobs.sort((a, b) => a.chars - b.chars)

  console.log(`\n📋 ${jobs.length} sentences need audio`)
  const totalChars = jobs.reduce((s, j) => s + j.chars, 0)
  console.log(`📝 Total: ${totalChars} chars needed, ${remaining} available`)
  console.log(`${remaining >= totalChars ? '✅ Enough quota!' : `⚠️ Will generate ~${Math.floor(remaining / (totalChars / jobs.length))} of ${jobs.length}`}\n`)

  const stats = { generated: 0, chars: 0, errors: 0 }
  // Track generated URLs per lesson/scenario
  const updates = {} // { lessonId: { scenarioIdx: { sentenceIdx: url } } }

  for (const job of jobs) {
    if (stats.chars + job.chars > remaining - 50) {
      console.log(`\n⚠️ Quota almost exhausted (${remaining - stats.chars} left), stopping...`)
      break
    }

    try {
      process.stdout.write(`  🔊 ${job.lessonId} sc${job.scenarioIdx} s${job.sentenceIdx}: "${job.text.substring(0, 50)}..." (${job.chars}ch) `)
      const audio = await generateAudio(job.text)
      const path = `practice/${job.lessonId}/scenario-${job.scenarioIdx}-sent-${job.sentenceIdx}.mp3`
      const url = await uploadAudio(audio, path)

      // Track
      if (!updates[job.lessonId]) updates[job.lessonId] = {}
      if (!updates[job.lessonId][job.scenarioIdx]) updates[job.lessonId][job.scenarioIdx] = {}
      updates[job.lessonId][job.scenarioIdx][job.sentenceIdx] = url

      stats.generated++
      stats.chars += job.chars
      console.log('✅')
      await sleep(400) // rate limit
    } catch (err) {
      console.log(`❌ ${err.message}`)
      stats.errors++
      if (err.message.includes('429')) {
        console.log('  ⏳ Rate limited, waiting 10s...')
        await sleep(10000)
      }
    }
  }

  // Apply updates to DB
  console.log('\n💾 Updating database...')
  for (const lessonId of Object.keys(updates)) {
    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson) continue
    const content = lesson.content
    const scenarios = content?.practice?.scenarios || []

    for (const [siStr, sentMap] of Object.entries(updates[lessonId])) {
      const si = parseInt(siStr)
      const sc = scenarios[si]
      if (!sc) continue
      const sentences = splitSentences(sc.phrase)

      // Merge with existing
      const existing = sc.sentenceAudioUrls || new Array(sentences.length).fill(null)
      while (existing.length < sentences.length) existing.push(null)
      for (const [fiStr, url] of Object.entries(sentMap)) {
        existing[parseInt(fiStr)] = url
      }
      content.practice.scenarios[si].sentenceAudioUrls = existing
    }

    const { error: dbErr } = await supabase
      .from('lessons').update({ content }).eq('id', lessonId)
    if (dbErr) console.error(`  ❌ ${lessonId}: ${dbErr.message}`)
    else console.log(`  ✅ ${lessonId} updated`)
  }

  console.log(`\n${'═'.repeat(50)}`)
  console.log(`🎉 Done!`)
  console.log(`   ✅ ${stats.generated} sentence audios generated`)
  console.log(`   📝 ~${stats.chars} chars used`)
  console.log(`   ❌ ${stats.errors} errors`)
  console.log(`   📊 ~${remaining - stats.chars} chars remaining`)
}

main().catch(err => { console.error('\n💥 Fatal:', err.message); process.exit(1) })
