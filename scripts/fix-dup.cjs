const fs = require('fs');
let c = fs.readFileSync('src/app/pages/SimulationView.jsx', 'utf8');

// 1. Replace the old ROLE_AVATARS + parseSpeaker block with the image-based version
const NEW_BLOCK = `// Character avatar images (3D rendered, stored in Supabase)
const AVATAR_BASE = 'https://mtobgwfknefjlpoxznqx.supabase.co/storage/v1/object/public/images/avatars'
const AVATAR_IMAGES = {
  patricia: \`\${AVATAR_BASE}/patricia.png\`,
  emily: \`\${AVATAR_BASE}/emily.png\`,
  david: \`\${AVATAR_BASE}/david.png\`,
  ana: \`\${AVATAR_BASE}/ana.png\`,
  karen: \`\${AVATAR_BASE}/karen.png\`,
  tom: \`\${AVATAR_BASE}/tom.png\`,
  laura: \`\${AVATAR_BASE}/laura.png\`,
  lisa: \`\${AVATAR_BASE}/lisa.png\`,
  diana: \`\${AVATAR_BASE}/diana.png\`,
  rachel: \`\${AVATAR_BASE}/rachel.png\`,
}

function parseSpeaker(speaker) {
  if (!speaker) return { name: 'Otra persona', role: '', avatarUrl: null }
  const match = speaker.match(/^(.+?)\\s*\\((.+?)\\)$/)
  if (match) {
    const role = match[1].trim()
    const name = match[2].trim()
    const key = name.toLowerCase()
    return { name, role: role.toUpperCase(), avatarUrl: AVATAR_IMAGES[key] || null }
  }
  return { name: speaker, role: '', avatarUrl: null }
}`;

// Find old block start
const oldStart = c.indexOf("// Parse \"Role (Name)\"");
if (oldStart === -1) {
  console.log('Old block marker not found');
  process.exit(1);
}

// Find old block end: look for "export default" which comes after the old parseSpeaker
const exportStart = c.indexOf('export default function SimulationView', oldStart);
if (exportStart === -1) {
  console.log('Could not find export default');
  process.exit(1);
}

// Get everything before the old block, and from export onwards
c = c.substring(0, oldStart) + NEW_BLOCK + '\n\n' + c.substring(exportStart);

// 2. Replace emoji avatar references with image-based ones in the JSX
// In typing bubble: {sp.avatar} -> image
c = c.replace(
  '<div className="sim-avatar-circle">{sp.avatar}</div>',
  '<div className="sim-avatar-circle">{sp.avatarUrl ? <img src={sp.avatarUrl} alt={sp.name} className="sim-avatar-img" /> : <span>🗣️</span>}</div>'
);

// There are two occurrences (typing + prompt card), replace all
c = c.replace(
  '<div className="sim-avatar-circle">{sp.avatar}</div>',
  '<div className="sim-avatar-circle">{sp.avatarUrl ? <img src={sp.avatarUrl} alt={sp.name} className="sim-avatar-img" /> : <span>🗣️</span>}</div>'
);

fs.writeFileSync('src/app/pages/SimulationView.jsx', c);
console.log('✅ Updated SimulationView.jsx with image avatars');
console.log('Lines:', c.split('\n').length);
