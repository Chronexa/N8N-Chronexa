// Generate on-brand images via Gemini ("Nano Banana" = gemini-2.5-flash-image).
// Key is read from the repo-root .env (never hardcoded). Usage:
//   node scripts/gen-images.mjs            → generate the STYLE SAMPLES below
// Output: public/images/gen/<name>.png  (raw; optimise separately with sips)
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

// --- read API keys from .env files (no hardcoding) -------------------------
function readEnv(name) {
  for (const p of [resolve(ROOT, '../.env'), resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) {
    try {
      const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return null;
}
const PROVIDER = process.argv.includes('--openai') ? 'openai' : 'gemini';
const GEMINI_KEY = readEnv('GEMINI_API_KEY');
const OPENAI_KEY = readEnv('OPENAI_API_KEY');

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// House palette baked into every prompt for cohesion.
const PALETTE =
  'Strict color palette: warm off-white paper (#FBFAF7), deep charcoal ink (#1A1A17), and a single forest-green accent (#2F6B3A). ' +
  'No other colors. No text, letters, numbers, logos, watermarks, or UI. No people, no robots, no brains, no glowing neon, no sci-fi clichés. ' +
  '16:9 wide composition, generous negative space, soft natural lighting, premium editorial art-direction, subtle grain. Tasteful and restrained.';

// One concept rendered in three candidate house styles.
const CONCEPT = 'theme: automating a CPA firm\'s tax-season document workflow — order emerging from paperwork';
const SAMPLES = [
  { name: 'style-A-abstract-geometric',
    prompt: `Abstract geometric editorial composition. Overlapping translucent paper planes and clean intersecting lines suggesting structured data flow and order. ${CONCEPT}. ${PALETTE}` },
  { name: 'style-B-material-macro',
    prompt: `Fine-art macro still-life. Layered sheets of cream paper and soft folded forms catching gentle directional light, shallow depth of field, museum-quality, expensive and tactile. ${CONCEPT}. ${PALETTE}` },
  { name: 'style-C-line-isometric',
    prompt: `Minimal editorial line illustration, fine monochrome linework on paper with one forest-green accent, light isometric depth, abstract interconnected nodes and channels suggesting an automated pipeline. ${CONCEPT}. ${PALETTE}` },
];

const outDir = resolve(ROOT, 'public/images/gen');
mkdirSync(outDir, { recursive: true });

async function genGemini({ name, prompt }) {
  if (!GEMINI_KEY) { console.error('GEMINI_API_KEY not found — stopping.'); return false; }
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });
  if (!res.ok) { console.error(`✗ ${name}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`); return false; }
  const data = await res.json();
  const img = (data?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
  if (!img) { console.error(`✗ ${name}: no image ${JSON.stringify(data).slice(0, 300)}`); return false; }
  writeFileSync(resolve(outDir, `${name}.png`), Buffer.from(img.inlineData.data, 'base64'));
  console.log(`✓ ${name} (gemini)`);
  return true;
}

async function genOpenAI({ name, prompt }) {
  if (!OPENAI_KEY) { console.error('OPENAI_API_KEY not found — stopping.'); return false; }
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1, quality: 'high' }),
  });
  if (!res.ok) { console.error(`✗ ${name}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`); return false; }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) { console.error(`✗ ${name}: no image ${JSON.stringify(data).slice(0, 200)}`); return false; }
  writeFileSync(resolve(outDir, `${name}.png`), Buffer.from(b64, 'base64'));
  console.log(`✓ ${name} (openai)`);
  return true;
}

const gen = PROVIDER === 'openai' ? genOpenAI : genGemini;

for (const s of SAMPLES) {
  // sequential to stay polite to the API
  // eslint-disable-next-line no-await-in-loop
  await gen(s);
}
