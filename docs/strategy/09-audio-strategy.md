# Audio Strategy — English for Work

> Source: `00-master-prd.md` Section 10

---

## Audio types

| Type | Speakers | Use case | Count | Priority |
|---|---|---|---|---|
| Phrase audio | 1 speaker | Each key phrase in isolation | ~252 | HIGH |
| Mini-example audio | 1-2 speakers | Short dialogues in lessons | ~36 | HIGH |
| Simulation audio | 2-3 speakers | Full multi-turn scenarios | ~60 clips | CRITICAL |
| **Total** | — | — | **~300+ clips** | **~103 min** |

---

## Voice specifications

| Attribute | Spec |
|---|---|
| **Accent** | Neutral American English |
| **Tone** | Natural, professional, approachable — NOT robotic |
| **Quality** | Studio-grade AI voice (ElevenLabs recommended) |
| **Format** | MP3, 128kbps (mobile-optimized) |
| **Sample rate** | 44.1kHz |
| **Channels** | Mono (save bandwidth) |

---

## Speaker roles

| Role ID | Voice profile | Used for | ElevenLabs voice suggestion |
|---|---|---|---|
| `speaker-pro-male` | Mid-range, calm, clear | Managers, interviewers, supervisors | "Adam" or "Daniel" |
| `speaker-pro-female` | Warm, articulate, confident | HR reps, trainers, customer service leads | "Rachel" or "Sarah" |
| `speaker-customer-male` | Varied, natural pace, casual | Customer callers | "Charlie" or custom |
| `speaker-customer-female` | Varied, natural pace | Customer callers | "Emily" or custom |

---

## File naming convention

```
{route}-{module}-{lesson}-{type}-{index}.mp3

Examples:
r1-m1-l1-phrase-01.mp3      ← Route 1, Module 1, Lesson 1, Phrase 1
r1-m1-l1-phrase-02.mp3      ← Route 1, Module 1, Lesson 1, Phrase 2
r1-m1-l1-example-01a.mp3    ← Route 1, Module 1, Lesson 1, Example speaker A
r1-m1-l1-example-01b.mp3    ← Route 1, Module 1, Lesson 1, Example speaker B
r1-m1-sim-turn-01.mp3       ← Route 1, Module 1, Simulation, Turn 1
r1-m1-sim-turn-02.mp3       ← Route 1, Module 1, Simulation, Turn 2
```

---

## Production pipeline

### Step 1: Script preparation
- Extract all English text that needs audio from content JSON
- Tag each with speaker role and type
- Output: `audio-scripts.csv` with columns: `id, text, speaker, type, route, module, lesson`

### Step 2: Batch generation
- Use ElevenLabs API or web interface
- Generate all clips for one speaker at a time (consistency)
- Settings: stability ~0.5, similarity ~0.75, style ~0.3

### Step 3: Quality review
- Listen to every clip
- Flag unnatural pronunciation, pacing, or tone
- Re-generate flagged clips with adjusted settings

### Step 4: Post-processing
- Normalize volume levels (target: -16 LUFS)
- Trim silence (max 200ms at start/end)
- Convert to MP3 128kbps mono
- Verify file size (target: < 100KB per phrase, < 500KB per example)

### Step 5: Upload to Supabase Storage
- Upload to `audio` bucket
- Organize in folders: `audio/{route}/{module}/`
- Update content JSON with file URLs
- Test playback on mobile

---

## Storage estimates

| Content type | Clips | Avg size | Total size |
|---|---|---|---|
| Phrases (~5 sec each) | 252 | ~40KB | ~10MB |
| Examples (~30 sec each) | 36 | ~240KB | ~9MB |
| Simulations (~5 min total each) | 60 | ~400KB | ~24MB |
| **Total** | **~348** | — | **~43MB** |

---

## ElevenLabs setup

### Account requirements
- Plan: Starter ($5/mo) or Creator ($22/mo)
- Starter: ~30 min audio/month — sufficient for initial batch with careful planning
- Creator: ~100 min audio/month — comfortable for full production

### API usage (for batch generation)
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
Headers: xi-api-key: {API_KEY}
Body: {
  "text": "I have 3 years of experience in customer service.",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.75,
    "style": 0.3
  }
}
```

---

## Audio in the app

### Audio player component specs
- Inline, compact design
- Play/pause toggle
- Progress bar (scrubable on mobile)
- Speed control: 0.75x / 1x / 1.25x
- Current time / duration display
- Preload: metadata only (save bandwidth)
- Autoplay: never (user-initiated only)

### Audio loading strategy
- Lazy load audio files (don't load until user reaches that section)
- Cache played audio in service worker (PWA offline support)
- Preload next phrase audio when user views current phrase
- Show loading spinner while audio loads
