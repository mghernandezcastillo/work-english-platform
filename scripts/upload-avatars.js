#!/usr/bin/env node
/**
 * Upload all 10 avatar images to Supabase storage and update the simulations
 * to reference them via a character_avatars mapping.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = 'https://mtobgwfknefjlpoxznqx.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const AVATAR_DIR = 'C:/Users/mgher/.gemini/antigravity/brain/53ee04e5-e8c7-4729-b759-bffdc7d8be06'

// Map of character names to their avatar files
const AVATARS = {
  patricia: 'avatar_patricia_1775851479129.png',
  emily: 'avatar_emily_1775851617240.png',
  david: 'avatar_david_1775851502317.png',
  ana: 'avatar_ana_1775851517988.png',
  karen: 'avatar_karen_1775851530424.png',
  tom: 'avatar_tom_1775851547908.png',
  laura: 'avatar_laura_1775851561113.png',
  lisa: 'avatar_lisa_1775851573360.png',
  diana: 'avatar_diana_1775851583197.png',
  rachel: 'avatar_rachel_1775851593179.png',
}

async function main() {
  console.log('📸 Uploading 10 character avatars to Supabase...\n')
  
  const avatarUrls = {}
  
  for (const [name, file] of Object.entries(AVATARS)) {
    const filePath = path.join(AVATAR_DIR, file)
    const buffer = fs.readFileSync(filePath)
    const storagePath = `avatars/${name}.png`
    
    const { error } = await supabase.storage
      .from('images')
      .upload(storagePath, buffer, { contentType: 'image/png', upsert: true })
    
    if (error) {
      console.log(`  ❌ ${name}: ${error.message}`)
      continue
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(storagePath)
    avatarUrls[name] = data.publicUrl
    console.log(`  ✅ ${name} → ${data.publicUrl}`)
  }
  
  console.log(`\n📝 Avatar URLs:`)
  console.log(JSON.stringify(avatarUrls, null, 2))
  
  console.log('\n✅ Done! Use these URLs in the code.')
}

main().catch(err => { console.error('💥', err.message); process.exit(1) })
