// 3D-style header illustrations (2026-07 request: "highly illustrative,
// 3D-style images" — replacing the rejected line-isometric batch).
// Style: soft matte clay 3D render on the site's warm paper, brand green +
// amber accents. Key is read from repo-root .env. Usage:
//   node scripts/gen-3d.mjs --only=3d-docs     → sample-gate one image
//   node scripts/gen-3d.mjs                    → generate all
// Output: public/images/gen3d/<name>.png (raw; optimise to WebP separately).
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

function readEnv(name) {
  for (const p of [resolve(ROOT, '../.env'), resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) {
    try {
      const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return null;
}
const OPENAI_KEY = readEnv('OPENAI_API_KEY');

const STYLE =
  'Soft matte 3D render, minimal clay-like material, premium and modern. ' +
  'Background: seamless warm off-white studio (#FBFAF7). ' +
  'Palette: cream and warm paper tones with forest-green (#2F6B3A) and warm amber (#C98A1B) accents only. ' +
  'Soft studio lighting, gentle contact shadows, shallow depth, generous negative space around the subject. ' +
  'Absolutely no text, letters, numbers, logos, watermarks, screens, UI, charts, people, faces, hands, or robots. ' +
  'One clean sculptural composition, centered, floating slightly above the ground plane.';

const IMAGES = [
  {
    name: '3d-docs',
    prompt: `A tall messy stack of white paper documents on the left transforming into a neat, perfectly ordered row of green-tabbed folders on the right, with three sheets caught mid-air between them as if being sorted by an invisible hand. One folder tab is amber. ${STYLE}`,
  },
  {
    name: '3d-orchestration',
    prompt: `A central rounded green cube connected by smooth curved cream tubes to five small floating satellite cubes arranged around it, one satellite cube amber, the tubes clearly plugging into sockets on each cube. ${STYLE}`,
  },
  {
    name: '3d-growth',
    prompt: `Four ascending stepped blocks in cream, a small glossy forest-green sphere resting on the top step, and a soft green ribbon arc rising above the steps suggesting compounding growth. One block face has an amber edge. ${STYLE}`,
  },
];

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').replace('--only=', '');
const outDir = resolve(ROOT, 'public/images/gen3d');
mkdirSync(outDir, { recursive: true });

async function gen({ name, prompt }) {
  if (!OPENAI_KEY) { console.error('OPENAI_API_KEY not found — stopping.'); return false; }
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1, quality: 'high' }),
  });
  if (!res.ok) { console.error(`✗ ${name}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`); return false; }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) { console.error(`✗ ${name}: no image`); return false; }
  writeFileSync(resolve(outDir, `${name}.png`), Buffer.from(b64, 'base64'));
  console.log(`✓ ${name}`);
  return true;
}

for (const img of IMAGES) {
  if (only && img.name !== only) continue;
  await gen(img);
}
