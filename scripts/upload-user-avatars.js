import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  'https://mtobgwfknefjlpoxznqx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10b2Jnd2ZrbmVmamxwb3h6bnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDcyMTM5NCwiZXhwIjoyMDkwMjk3Mzk0fQ.VLZEvsAWPPzSHQ6PELBuFFUeaj8rtGPZ6ZWUJNoQolQ'
)

const files = {
  'avatars/user-female.png': 'C:/Users/mgher/.gemini/antigravity/brain/53ee04e5-e8c7-4729-b759-bffdc7d8be06/avatar_user_female_1775852435288.png',
  'avatars/user-male.png': 'C:/Users/mgher/.gemini/antigravity/brain/53ee04e5-e8c7-4729-b759-bffdc7d8be06/avatar_user_male_1775852448509.png',
}

for (const [path, local] of Object.entries(files)) {
  const buf = fs.readFileSync(local)
  const { error } = await supabase.storage.from('images').upload(path, buf, { contentType: 'image/png', upsert: true })
  if (error) console.log(`❌ ${path}: ${error.message}`)
  else {
    const { data } = supabase.storage.from('images').getPublicUrl(path)
    console.log(`✅ ${path} → ${data.publicUrl}`)
  }
}
