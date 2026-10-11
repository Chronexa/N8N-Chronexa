/**
 * The Chronexa art library (2026-10-11). Every film and painting the site uses, in one place, so
 * pages pick art by name and the same piece always carries the same description.
 *
 * Sources: films are cut from "Chronexa web videos/" (our own footage). Paintings are Ankit's own
 * generated images, or Chronexa originals made from the moodboard ideas in "pinterest art/"
 * (scripts/gen-site-art.mjs). The pins themselves are other artists' work and are never published.
 * Art direction: bright, surreal, one impossible element in a believable world. Never stock, never
 * literal offices or documents.
 */

export type ArtPiece =
  | { kind: 'video'; src: string; poster: string; alt: string; ratio: 'wide' }
  | { kind: 'image'; src: string; alt: string; ratio: 'tall' | 'wide' };

const film = (name: string, alt: string): ArtPiece => ({
  kind: 'video', src: `/videos/vision/${name}.mp4`, poster: `/videos/vision/${name}.jpg`, alt, ratio: 'wide',
});
const paint = (path: string, alt: string, ratio: 'tall' | 'wide' = 'tall'): ArtPiece => ({ kind: 'image', src: path, alt, ratio });

export const ART = {
  // Films (16:9 loops, ~8s)
  'human-machine': film('brand-human-machine', 'A robot kneels in a field at sunrise, tending young plants by hand'),
  'galaxy-meditation': film('galaxy-meditation', 'A figure made of starlight sits cross-legged in a wildflower meadow as butterflies drift past'),
  'galaxy-reach': film('galaxy-reach', 'A figure made of starlight raises a hand to the butterflies in a summer meadow'),
  'painted-thoughts': film('painted-thoughts', 'A painted man sits by a river at sunset while his thoughts swirl into the sky as books and birds'),
  'knight-poppies': film('knight-poppies', 'A knight in armour rests among red poppies beneath a castle at sunset'),
  'sunflower-sun': film('sunflower-sun', 'A painted sun bursts with golden rays over a field of sunflowers and blue butterflies'),
  'cloud-tram': film('cloud-tram', 'A pink vintage tram glides across a sea of clouds at dusk'),
  'spiral-sky': film('strategy-decision-field', 'A man in a suit stands in a flower meadow beneath a vast spiral in the sky'),
  'astronaut-drift': film('about-astronaut', 'An astronaut drifts between towering clouds under a sky full of stars'),
  'desert-explorer': film('agent-exploration', 'An astronaut explores a desert planet beneath a ringed giant'),
  'golden-train': film('migration-train', 'A red train crosses a hill of golden flowers under a single white cloud'),
  'commerce-room': film('commerce-spatial', 'A woman sits in a giant phone inside a pastel room of floating products'),

  // Paintings (portrait unless marked wide)
  'astronaut-clouds': paint('/images/art/astronaut-clouds.webp', 'An astronaut floats weightless between soft white clouds in a starry sky'),
  'chrome-face': paint('/images/art/chrome-face.webp', 'A face, half human and half polished chrome, floats above the clouds'),
  'light-rings': paint('/images/art/light-rings.webp', 'A man stands in a flower field as rings of light sweep around the sky'),
  'painted-mind': paint('/images/art/painted-mind.webp', 'A painted man sits by a river while scenes from his memory swirl above his head'),
  'reader-daisies': paint('/images/art/reader-daisies.webp', 'A man lies among daisies reading a small book that covers his face'),
  'glitter-figure': paint('/images/art/glitter-figure.webp', 'A figure made of glittering light kneels in a wildflower meadow'),
  'wired-head': paint('/images/art/wired-head.webp', 'A faceted blue head with eyes closed, hundreds of coloured cables rising from it'),
  'glass-bloom': paint('/images/art/glass-bloom.webp', 'A figure of clear glass seen from behind, a flowering tree growing inside it'),
  'light-door': paint('/images/art/light-door.webp', 'A doorway of white light stands in a river running through a marigold field'),
  'ocean-city': paint('/images/art/ocean-city.webp', 'A man looks up from a city street to an ocean sky where whale sharks swim'),
  'crt-head': paint('/images/art/crt-head.webp', 'A woman whose eyes are replaced by a cream vintage monitor glowing green'),
  'frame-walk': paint('/images/art/frame-walk.webp', 'A woman in a red cape strides out of a giant white frame on a yellow stage'),
  'pink-smoke': paint('/images/art/pink-smoke.webp', 'A dancer leaps through billowing clouds of pink smoke'),
  'retro-desk': paint('/images/art/retro-desk.webp', 'Hands type on a vintage computer as planets, books and an astronaut spill from its screen'),
  'pigeon-rush': paint('/images/art/pigeon-rush.webp', 'A skateboarder races down a sunny street through a burst of pigeons'),
  'phone-portal': paint('/images/art/phone-portal.webp', 'A woman in green steps out of a giant glowing phone into a mint room'),
  'phone-products': paint('/images/art/phone-products.webp', 'A shirt, sneakers and sunglasses burst out of a glass phone on a yellow stage'),

  // Service worlds (3:2, generated 2026-10-11)
  doorways: paint('/images/service-art/strategy-doorways.webp', 'Glowing doorways stand across a golden meadow, one brighter than the rest', 'wide'),
  'paper-birds': paint('/images/service-art/workflow-paper-birds.webp', 'A ribbon of paper birds carries seeds of light across a sunflower field', 'wide'),
  'starlight-apprentice': paint('/images/service-art/agent-starlight-apprentice.webp', 'A figure of starlight carries fruit beside a gardener who guides it', 'wide'),
  'floating-islands': paint('/images/service-art/integration-floating-islands.webp', 'Floating islands joined by golden threads of light above the clouds', 'wide'),
  watermill: paint('/images/service-art/workflow-watermill.webp', 'A watermill sends a steady line of paper lanterns downstream', 'wide'),
  'blooming-horn': paint('/images/service-art/voice-blooming-horn.webp', 'A giant gramophone horn blooms from a meadow, releasing butterflies', 'wide'),

  // Earlier vision paintings (3:2)
  'knowledge-constellation': paint('/images/vision/knowledge-constellation.webp', 'An archivist studies a constellation of connected knowledge', 'wide'),
  'human-machine-studio': paint('/images/vision/human-machine-studio.webp', 'Engineers build alongside an abstract sculpture of machine intelligence', 'wide'),
  'software-threshold': paint('/images/vision/software-threshold.webp', 'A builder steps from tangled complexity into a clear, coherent space', 'wide'),
} satisfies Record<string, ArtPiece>;

export type ArtName = keyof typeof ART;

/** Art for the long-tail SEO pages, chosen by what the page is about (first rule that matches wins). */
const TOPIC_ART: [RegExp, ArtName][] = [
  [/knowledge|rag-/, 'knowledge-constellation'],
  [/law|legal|relativity|imanage|contract|matter/, 'glass-bloom'],
  [/k1|ocr|pitch-deck|document/, 'reader-daisies'],
  [/cpa|tax|bookkeeping|safesend|karbon/, 'glitter-figure'],
  [/term-sheet|portfolio|affinity|vc-|venture/, 'floating-islands'],
  [/ria-|advisor|finance|regulatory/, 'ocean-city'],
  [/pharma|life-science/, 'starlight-apprentice'],
  [/agentic|ml-|data-science/, 'wired-head'],
  [/cyber|security/, 'knight-poppies'],
  [/hr-|people/, 'galaxy-meditation'],
  [/operations|ops/, 'watermill'],
];

export function topicArt(slug: string): ArtName {
  return TOPIC_ART.find(([re]) => re.test(slug))?.[1] ?? 'light-rings';
}
