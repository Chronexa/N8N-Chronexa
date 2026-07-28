// Covers for the 4 new CPA-cluster posts (2026-07-25) — house style C line-isometric.
// FLUX (BFL) first since OpenAI billing is capped; idempotent (skips posts that have a hero).
//   node scripts/gen-cpa-covers-2026-07.mjs
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
function readEnv(name) {
  for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env'), resolve(ROOT, '../.env')]) {
    try {
      const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${name}\\s*=\\s*(.+)\\s*$`, 'm'));
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    } catch {}
  }
  return null;
}
const FLUX_KEY = readEnv('FLUX_API_KEY');
const client = createClient({
  projectId: readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: readEnv('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  apiVersion: '2024-01-01',
  token: readEnv('SANITY_API_WRITE_TOKEN'),
  useCdn: false,
});

const STYLE =
  'Minimal editorial line illustration. Fine monochrome charcoal (#1A1A17) linework on warm off-white paper (#FBFAF7), ' +
  'with a SINGLE forest-green (#2F6B3A) accent element. Light isometric depth, generous negative space, thin consistent strokes. ' +
  'CRITICAL: render absolutely NO words, letters, numbers, labels or symbols anywhere — every document, page or surface must be blank ' +
  'or show only abstract horizontal line-marks, never real text. No logos, watermarks, UI, or people. No glowing neon, no robots, no brains. ' +
  'Premium, restrained, editorial. 16:9 wide.';

const COVERS = [
  {
    id: 'post-tax-document-collection-automation-cpa-firms',
    motif: 'blank tax documents flowing from many small mailboxes into one organised tray through connected collection nodes, with a single green checkmark tray as the accent',
    alt: 'Line illustration of documents flowing from mailboxes into an organised tray through automated collection nodes',
  },
  {
    id: 'post-tax-workpaper-preparation-automation',
    motif: 'a neatly assembling isometric binder of blank worksheets, pages flying into indexed order through processing nodes, one green tabbed page as the accent',
    alt: 'Line illustration of a workpaper binder assembling itself from pages routed through processing nodes',
  },
  {
    id: 'post-ai-automation-company-for-cpa-firms',
    motif: 'a magnifying glass examining a row of abstract vendor building facades, one facade highlighted with a green shield as the accent',
    alt: 'Line illustration of a magnifying glass evaluating a row of vendor buildings, one marked with a shield',
  },
  {
    id: 'post-safesend-automation-for-cpa-firms',
    motif: 'sealed blank envelopes travelling along a connected delivery pipeline toward signature quills, with one green sealed envelope as the accent',
    alt: 'Line illustration of envelopes moving along an automated delivery pipeline toward signing stations',
  },
];

async function genFlux(prompt) {
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
      return Buffer.from(await img.arrayBuffer());
    }
    if (!['Pending', 'Queued', 'Processing', 'Request Moderated'].includes(data.status)) throw new Error(`BFL status ${data.status}`);
  }
  throw new Error('BFL timed out');
}

for (const cvr of COVERS) {
  const doc = await client.fetch(`*[_id == $id][0]{ _id, "hasHero": defined(hero.asset) }`, { id: cvr.id });
  if (!doc) { console.log(`! not found: ${cvr.id}`); continue; }
  if (doc.hasHero) { console.log(`- skip (has hero): ${cvr.id}`); continue; }
  const buf = await genFlux(`${cvr.motif}. ${STYLE}`);
  const asset = await client.assets.upload('image', buf, { filename: `${cvr.id}.png`, contentType: 'image/png' });
  await client.patch(cvr.id).set({ hero: { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: cvr.alt } }).commit();
  console.log(`✓ ${cvr.id} (${Math.round(buf.length / 1024)}KB)`);
}
console.log('Done.');
