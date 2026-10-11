// Surreal hero art for the five primary AI service pages (2026-10-11).
// Art direction = Ankit's references in "Chronexa web videos/pinterest art": bright, dreamlike,
// one impossible element in an otherwise real landscape. Metaphor for the service, never literal
// offices, documents or stock people. OpenAI gpt-image-1-mini only (budget: ~$0.015/image).
//   node scripts/gen-service-art.mjs <key>   (one image per run; skips files that already exist)
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { generateImage, skipIfExists } from '../../scripts/lib/image-gen.mjs';

const OUT = resolve(import.meta.dirname, '../public/images/service-art');

const STYLE = `Style: surreal cinematic fine-art photograph, dreamlike but photoreal, bright natural daylight or golden hour, saturated sky blue, warm gold, soft blossom pinks and fresh greens, luminous atmosphere, a single impossible element in an otherwise believable landscape, poster-like composition with generous calm sky, in the spirit of contemporary surreal digital art.
Composition: wide 3:2 landscape, main subject in the right half, quiet open sky or field on the left for headline text.
Constraints: no text, no letters, no logos, no watermark, no screens, no computers, no documents, no office, no robots with faces, no dark or gloomy scene.`;

const ART = {
  strategy: {
    file: 'strategy-doorways.webp',
    prompt: `A vast wildflower meadow at golden hour. Five tall free-standing glowing doorway frames of white light stand at different distances across the meadow, each opening onto a different sky. One doorway glows brighter and warmer than the rest. A single person in a light linen suit stands small in the foreground, seen from behind, calmly looking toward the bright doorway. Soft clouds, warm low sun.\n${STYLE}`,
  },
  workflow: {
    file: 'workflow-paper-birds.webp',
    prompt: `An endless sunflower field under a clear blue summer sky with a few cumulus clouds. Hundreds of folded white paper birds fly in one smooth, orderly ribbon from a small farmhouse on the left horizon across the sky to a distant hillside village on the right, each carrying a tiny glowing seed of light. A woman in a straw hat stands among the sunflowers watching them pass, relaxed. Everything feels effortless and in motion.\n${STYLE}`,
  },
  agent: {
    file: 'agent-starlight-apprentice.webp',
    prompt: `A blossoming orchard meadow in soft morning light. A tall figure made entirely of deep-blue starry night sky and tiny galaxies (a cosmic silhouette, no face details) carries a woven basket of picked fruit along a garden path, while an older human gardener in work clothes walks beside it and points ahead, guiding. Butterflies drift around them. Calm, trusting partnership between a human and a gentle intelligence.\n${STYLE}`,
  },
  integration: {
    file: 'integration-floating-islands.webp',
    prompt: `A bright blue sky above a sea of soft white clouds. Six small floating grassy islands drift at different heights, each with one distinct small structure: a lighthouse, a windmill, a greenhouse, a library tower, a market stall, a water tower. Thin glowing golden threads of light connect every island to the others, forming one calm network, and tiny people walk across one of the light bridges. Peaceful, orderly, magical.\n${STYLE}`,
  },
  workflowStory: {
    file: 'workflow-watermill.webp',
    prompt: `A sunlit valley of wildflowers with a clear stream. An old stone watermill turns steadily beside the stream, and from it a calm, endless line of small glowing paper lanterns floats downstream toward a distant village, each one the same size, evenly spaced. Soft summer light, a few clouds, peaceful and reliable.\n${STYLE}`,
  },
  voice: {
    file: 'voice-blooming-horn.webp',
    prompt: `A poppy and daisy meadow under a luminous late-afternoon sky. An enormous antique brass gramophone horn rises from the flowers like a giant bloom, and from its mouth a stream of hundreds of colourful butterflies spirals upward into the sky like sound becoming visible. A small figure sits on the grass nearby listening, at peace.\n${STYLE}`,
  },
};

const key = process.argv[2];
const asset = ART[key];
if (!asset) throw new Error(`Usage: node scripts/gen-service-art.mjs <${Object.keys(ART).join('|')}>`);
await mkdir(OUT, { recursive: true });
const destination = resolve(OUT, asset.file);
if (skipIfExists(destination)) process.exit(0);

const { buf, provider, estCost } = await generateImage(asset.prompt, { aspect: 'landscape', quality: 'medium', providers: ['openai'] });
await writeFile(destination, await sharp(buf).resize(1800, 1200, { fit: 'cover' }).webp({ quality: 84 }).toBuffer());
console.log(`${key}: ${provider} ~$${estCost} -> ${destination}`);
