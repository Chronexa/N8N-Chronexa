// One illustration for /ai-consultant (2026-10-08), via the shared cost-capped generator.
import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { generateImage } from '../../scripts/lib/image-gen.mjs';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const file = resolve(ROOT, 'public/images/growth/ai-consultant.webp');
if (existsSync(file)) { console.log('skip'); process.exit(0); }
const STYLE = 'Isometric technical line illustration, thin precise vector linework on a warm off-white background #F7F7EE. Deep forest green #173A2D lines with ONE accent: soft lime #DBFA80 used sparingly as fills and highlights. Absolutely NO text, NO letters, NO numbers, NO logos, NO watermarks, NO faces, no robots, no brains, no neon, no sci-fi. Generous negative space, calm, premium editorial B2B illustration. Wide 3:2 composition.';
const scene = 'a consultant desk with an open notebook and a laptop on the left, a single clear path of stepping stones leading to a small finished working machine on the right, a magnifying glass over a floor plan of a small business with highlighted rooms, showing an advisor who inspects first and then builds one thing that works';
const { buf, provider, estCost } = await generateImage(`${STYLE} Scene: ${scene}.`, { aspect: 'landscape', quality: 'medium' });
writeFileSync(file, await sharp(buf).resize(1200, 800, { fit: 'cover' }).webp({ quality: 82 }).toBuffer());
console.log('ok', provider, estCost);
