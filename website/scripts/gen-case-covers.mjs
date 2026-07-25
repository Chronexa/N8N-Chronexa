// Generate soft-clay 3D cover images for the two 2026-07 case studies
// (scrum-master sprint ops, multi-asset quant research) and attach them as
// `thumb` in Sanity. OpenAI gpt-image-1 first; BFL FLUX fallback if OpenAI
// fails (billing limits have hit before). Keys from .env files, never hardcoded.
//   node scripts/gen-case-covers.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

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
const FLUX_KEY = readEnv('FLUX_API_KEY');
const projectId = readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID');
const dataset = readEnv('NEXT_PUBLIC_SANITY_DATASET') || 'production';
const token = readEnv('SANITY_API_WRITE_TOKEN');
if (!projectId || !token) { console.error('Sanity projectId / write token missing — stop.'); process.exit(1); }

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

const STYLE =
  'Soft matte 3D render, minimal clay-like material, premium and modern. ' +
  'Background: seamless warm off-white studio (#FBFAF7). ' +
  'Palette: cream and warm paper tones with forest-green (#2F6B3A) and warm amber (#C98A1B) accents only. ' +
  'Soft studio lighting, gentle contact shadows, shallow depth, generous negative space around the subject. ' +
  'Absolutely no text, letters, numbers, logos, watermarks, screens, UI, charts, people, faces, hands, or robots. ' +
  'One clean sculptural composition, centered, floating slightly above the ground plane.';

const COVERS = [
  {
    docId: 'caseStudy-ai-scrum-master-sprint-operations-automation-case-study',
    filename: 'case-scrum-master-cover.png',
    alt: 'Soft 3D illustration of a sprint board with tiles moving between columns beside a small clock',
    prompt:
      `A kanban board sculpted from three cream clay columns holding small rounded tiles, one tile caught mid-air moving to the rightmost column, a small forest-green clay clock standing beside the board, and exactly one amber tile among the cream ones. ${STYLE}`,
  },
  {
    docId: 'caseStudy-ai-quant-research-multi-asset-portfolio-automation',
    filename: 'case-quant-research-cover.png',
    alt: 'Soft 3D illustration of three streams of coins and discs converging into one open green ledger book',
    prompt:
      `Three smooth streams of small cream clay coins and rounded discs flowing in gentle arcs from three directions into one open forest-green ledger book at the center, exactly one disc amber, the book resting on a low cream plinth. ${STYLE}`,
  },
];

async function genOpenAI(prompt) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not found');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1536x1024', n: 1, quality: 'high' }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const b64 = (await res.json())?.data?.[0]?.b64_json;
  if (!b64) throw new Error('no image in OpenAI response');
  return Buffer.from(b64, 'base64');
}

async function genFlux(prompt) {
  if (!FLUX_KEY) throw new Error('FLUX_API_KEY not found');
  const start = await fetch('https://api.bfl.ai/v1/flux-pro-1.1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-key': FLUX_KEY },
    body: JSON.stringify({ prompt, width: 1344, height: 896, safety_tolerance: 2 }),
  });
  if (!start.ok) throw new Error(`BFL start ${start.status}: ${(await start.text()).slice(0, 200)}`);
  const { polling_url, id } = await start.json();
  const pollUrl = polling_url || `https://api.bfl.ai/v1/get_result?id=${id}`;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(pollUrl, { headers: { 'x-key': FLUX_KEY } });
    if (!poll.ok) throw new Error(`BFL poll ${poll.status}`);
    const data = await poll.json();
    if (data.status === 'Ready') {
      const img = await fetch(data.result.sample);
      if (!img.ok) throw new Error(`BFL download ${img.status}`);
      return Buffer.from(await img.arrayBuffer());
    }
    if (data.status && !['Pending', 'Queued', 'Processing', 'Request Moderated'].includes(data.status) && data.status !== 'Ready') {
      throw new Error(`BFL status ${data.status}`);
    }
  }
  throw new Error('BFL timed out after 120s');
}

for (const c of COVERS) {
  let buf, source;
  try {
    buf = await genOpenAI(c.prompt);
    source = 'openai';
  } catch (e) {
    console.warn(`OpenAI failed (${e.message}) — falling back to FLUX.`);
    buf = await genFlux(c.prompt);
    source = 'flux';
  }
  writeFileSync(resolve(ROOT, `public/images/gen3d/${c.filename}`), buf); // local reference copy (gitignored dir)
  const asset = await client.assets.upload('image', buf, { filename: c.filename, contentType: 'image/png' });
  await client
    .patch(c.docId)
    .set({ thumb: { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: c.alt } })
    .commit();
  console.log(`✓ ${c.docId} ← ${c.filename} (${source}, ${Math.round(buf.length / 1024)}KB)`);
}
console.log('Done.');
