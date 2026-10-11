// Chronexa-original art for the sitewide art pass (2026-10-11).
// Each prompt is our own take on one idea from Ankit's moodboard in "Chronexa web videos/pinterest art".
// The pins themselves are other artists' work (logos, signatures, QR codes), so they are never published.
// OpenAI gpt-image-1-mini medium only (~$0.015/image). One key per run; skips files that already exist.
//   node scripts/gen-site-art.mjs <key> [<key> ...]
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { generateImage, skipIfExists } from '../../scripts/lib/image-gen.mjs';

const OUT = resolve(import.meta.dirname, '../public/images/art');

const STYLE = `Style: contemporary surreal fine-art editorial image, cinematic, high detail, rich saturated colour, soft natural light, one impossible element made believable, poster-like composition.
Constraints: no text, no letters, no numbers, no logos, no brand marks, no watermark, no signature, no app interface.`;

const ART = {
  'wired-head': `A sculpted head made of faceted blue low-poly panels, eyes calmly closed, floating against pure black. Hundreds of smooth cables in orange, cream, lilac and gold rise from the top of the head and flow upward out of frame like hair. Clean, graphic, slightly comic-book shading.`,
  'glass-bloom': `Back view of a standing figure wearing a fully transparent glass suit, and inside the glass a blossoming garden of pink and white flowering branches and green leaves grows. Soft lavender-to-peach gradient background, warm golden rim light on the glass edges.`,
  'light-door': `A tall free-standing rectangular doorway made of pure white light stands in a calm river that runs through an endless field of orange marigolds at blue hour. Through the doorway is a bright daytime sky with soft clouds. The light reflects as a long shimmering path on the water.`,
  'ocean-city': `Looking up from a busy city street at dusk between tall skyscrapers: the sky above is a deep blue ocean where whale sharks and shoals of silver fish swim slowly overhead. A man in a dark coat stands in the foreground seen from behind, gazing up in wonder. Warm shop lights below, cool water light above.`,
  'crt-head': `Studio portrait of a young woman whose eyes and forehead are replaced by a cream-coloured vintage CRT monitor glowing soft green, coiled white cables wrapping to her ears like a headset. Pale powder-blue background, white knit collar, clean minimalist product-photography lighting.`,
  'frame-walk': `A woman in a long flowing red hooded cape and cream trousers walks mid-stride out of a giant empty white square picture frame, the cape billowing behind her. Saturated mustard-yellow studio backdrop and floor, crisp long shadow, fashion editorial.`,
  'pink-smoke': `A dancer in an oversized white sweatshirt and loose cargo trousers leaps mid-air, knees drawn up, wrapped in billowing clouds of pink and white smoke. Soft blush-pink studio backdrop, high-fashion editorial lighting.`,
  'retro-desk': `Surreal vintage collage on a dark navy desk: two hands type on a beige 1980s desktop computer, and out of its screen spill a glowing wireframe grid landscape, ringed planets, a small floating astronaut, a brass telescope and old open books. Halftone retro magazine print texture.`,
  'pigeon-rush': `Dramatic fisheye low angle: a young person in a red jacket rides a skateboard fast down a sunny old European street, a burst of pigeons exploding into flight all around, orange traffic cones, bright blue sky, joyful motion blur.`,
  'phone-portal': `A giant smartphone stands upright in a bright mint-green room. A young woman in a green tracksuit and white sneakers steps out of its glowing blank screen onto the floor, mid-stride. Instant photos and small crystals float in the air around her, soft pastel studio light. The screen shows only soft light, no interface.`,
  'phone-products': `A transparent glass smartphone floats on a glossy mustard-yellow surface. Out of its screen burst a yellow check shirt, white sneakers, cream sunglasses and small blank product boxes, with glossy yellow spheres floating around. Playful premium 3D product render, soft shadows.`,
};

const keys = process.argv.slice(2);
if (!keys.length || keys.some((k) => !ART[k])) throw new Error(`Usage: node scripts/gen-site-art.mjs <${Object.keys(ART).join('|')}> ...`);
await mkdir(OUT, { recursive: true });
let total = 0;
for (const key of keys) {
  const destination = resolve(OUT, `${key}.webp`);
  if (skipIfExists(destination)) { console.log(`${key}: exists, skipped`); continue; }
  const { buf, provider, estCost } = await generateImage(`${ART[key]}\n${STYLE}`, { aspect: 'portrait', quality: 'medium', providers: ['openai'] });
  await writeFile(destination, await sharp(buf).resize({ width: 1000 }).webp({ quality: 80 }).toBuffer());
  total += estCost;
  console.log(`${key}: ${provider} ~$${estCost} -> ${destination}`);
}
console.log(`total ~$${total.toFixed(3)}`);
