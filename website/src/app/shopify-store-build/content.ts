/**
 * Copy for the Shopify landing pages (/shopify-store-build = US/EU, /shopify-store-build-india).
 * Positioning (decided 2026-09-25): a Shopify store REDESIGN offer. CTA was "Contact Us" (2026-09-28); on 2026-10-01 Ankit
 * moved it to a FREE STORE AUDIT (phone follow-up, no Calendly) to lift form fills. Plain, standard agency language; scope in clearly labelled services; no prices and
 * no invented results (proof = three stores we built, live on the page). Market-specific payment
 * and shipping names live in markets.ts. No "world's leading"-style superlatives (ASA/CAP).
 */

const V = (f: string) => `/videos/shopify-landing/${f}`;
const P = (f: string) => `/images/shopify-landing/${f}`;

export const QUOTE = {
  text: 'Most agencies design your store and walk away. We stay focused on one thing — making it sell.',
  attribution: 'Tushar, Co-founder, Chronexa',
};

/* ── Hero ────────────────────────────────────────────────────────────────── */

export type AngleId = 'outgrown' | 'traffic' | 'grew' | 'leak' | 'proof' | 'd2c';

/** One hero per Meta ad concept, chosen by ?angle= on the ad link (default 'outgrown'; the India page defaults to 'd2c',
 * which matches its only live ad, C1 "Shopify Stores for D2C Brands").
 * Each headline is exactly 3 lines (Flagship.module.css) so swapping it can't shift the layout. */
export const ANGLES: Record<AngleId, { lines: [string, string]; em: string; lead: string }> = {
  d2c: {
    lines: ['Shopify stores', 'built for'],
    em: 'D2C brands.',
    lead: 'Send us your store link. We review it and call you with a free audit: what to fix, and a fixed price to fix it. Designed and built by the team behind LUMIQ, VITALEDGE and Loom & Little.',
  },
  outgrown: {
    lines: ['Your Shopify store', 'has outgrown'],
    em: 'its design.',
    lead: 'We redesign Shopify stores for growing brands. A custom design made with you, plus the Google search, photos, videos and systems your store needs to sell more.',
  },
  traffic: {
    lines: ['Getting traffic.', 'Not enough'],
    em: 'orders?',
    lead: 'We redesign Shopify stores so more visitors buy: clearer product pages, a faster checkout and Google search that brings the right people in.',
  },
  grew: {
    lines: ['Your brand grew.', 'Did your'],
    em: 'store?',
    lead: 'We redesign Shopify stores so they match the brand you are now: custom design, photos and videos, Google search and automation, all by one team.',
  },
  // Meta test batch 2 (2026-09-30): B1 commercial leakage, B4 proof / real work.
  leak: {
    lines: ['Ads got the click.', 'Did your store'],
    em: 'earn the order?',
    lead: 'We find where your Shopify store loses buyers after the click, on the product page, in the cart or at checkout, and fix it.',
  },
  proof: {
    lines: ['Three brands.', 'Three stores.'],
    em: 'None look alike.',
    lead: 'LUMIQ, VITALEDGE and Loom & Little: stores we designed and built, each around its brand and how its customers shop. See them live below.',
  },
};

/** Scope in one line under the hero. */
export const HERO_SCOPE = ['Store design', 'Google search', 'Photos & video', 'Payments & shipping', 'Automation'];

/* ── What we do ──────────────────────────────────────────────────────────── */

export type Service = { id: string; title: string; outcome: string; points: string[] };

/** The six services. `payments` and `shipping` are filled from the market (markets.ts). */
export function services(m: { payments: string; shipping: string }): Service[] {
  return [
    {
      id: 'design', title: 'Custom store design',
      outcome: 'A store that looks like your brand, not a template.',
      points: ['We design the whole store with you: homepage, collections, product pages, cart', 'Built around your brand, your products and how your customers shop', 'Mobile-first, fast, and easy for your team to edit', 'You review and approve every page before we build it'],
    },
    {
      id: 'brand', title: 'Brand & creative',
      outcome: 'One brand across your store, packaging and ads.',
      points: ['Visual identity: colours, type, photography style', 'Product photography and lifestyle imagery', 'Campaign videos and product films for your store and social', 'Packaging and label design that matches the store'],
    },
    {
      id: 'seo', title: 'SEO & AI search',
      outcome: 'Organic traffic that turns into revenue.',
      points: ['Technical SEO across the whole store: speed, structure, schema', 'Product, collection and content pages written to rank', 'Ready for Google, ChatGPT and AI search answers', 'Your existing rankings protected during the redesign'],
    },
    {
      id: 'checkout', title: 'Conversion & checkout',
      outcome: 'More of your visitors become customers.',
      points: ['Product pages that answer every question before it’s asked', 'A faster cart and checkout with fewer steps', `Payments set up: ${m.payments}`, 'Reviews, trust signals and upsells where they help'],
    },
    {
      id: 'ops', title: 'Shipping & operations',
      outcome: 'Orders go out without the manual work.',
      points: [`Shipping and logistics connected: ${m.shipping}`, 'Inventory, returns and order management set up properly', 'Email and SMS: welcome, abandoned cart, post-purchase', 'Analytics and tracking, so you know what’s selling'],
    },
    {
      id: 'automation', title: 'Automation',
      outcome: 'Scale the brand without hiring a bigger team.',
      points: ['Order and delivery updates sent automatically', 'Abandoned-cart and win-back follow-ups on autopilot', 'Daily sales and stock reports in your inbox', 'Orders, customers and payments synced to the tools you use'],
    },
  ];
}

/* ── Proof: three stores we built ────────────────────────────────────────── */

/** The three stores, live and password-free: exact static copies of the Shopify storefronts
 * (tools/store-mirror in the Ecommerce repo), with a demo bag and checkout switched off.
 * Embeddable — the landing page frames them and gets shopping events via postMessage. */
export const LIVE_STORES = [
  { id: 'lumiq', name: 'LUMIQ', category: 'Men’s skincare', url: 'https://lumiq-demo.vercel.app', posterDesktop: P('live-lumiq-desktop.jpg'), posterMobile: P('live-lumiq-mobile.jpg'), line: 'Quiet, clinical and campaign-grade. Shopping by concern and ingredient, a routine finder and campaign film.', tags: ['28 products', 'Ingredient library', 'Routine finder'] },
  { id: 'vitaledge', name: 'VITALEDGE', category: 'Performance supplements', url: 'https://vitaledge-demo.vercel.app', posterDesktop: P('live-vitaledge-desktop.jpg'), posterMobile: P('live-vitaledge-mobile.jpg'), line: 'Loud, athletic and proof-first. Lab-tested claims up front and shopping by goal, built for people who read the label.', tags: ['Shop by mission', 'Proof-led product pages', 'Bold brand system'] },
  { id: 'loom', name: 'Loom & Little', category: 'Kidswear', url: 'https://loom-and-little-demo.vercel.app', posterDesktop: P('live-loom-desktop.jpg'), posterMobile: P('live-loom-mobile.jpg'), line: 'Warm, playful and made for gifting. Shopping by age, a size finder and bundles for new parents.', tags: ['Shop by age', 'Gift bundles', '46 pages'] },
] as const;

/** Campaign films we produced for each brand — the same files each store uses. */
export const FILMS = [
  {
    brand: 'LUMIQ', category: 'Men’s skincare', tone: 'Quiet, clinical',
    main: { src: 'https://cdn.shopify.com/videos/c/vp/70ed284bf5834846ae7ebd9744abeee0/70ed284bf5834846ae7ebd9744abeee0.SD-480p-0.9Mbps-95419255.mp4', poster: 'https://cdn.shopify.com/s/files/1/0790/9939/6196/files/lumiq-immersive-20260924-gym-campaign.jpg?v=1790245865&width=900', label: 'LUMIQ campaign film: skincare after a gym session' },
    side: [
      { src: 'https://cdn.shopify.com/videos/c/vp/7dc6c4b991ad455d80dec4bf6148237e/7dc6c4b991ad455d80dec4bf6148237e.SD-480p-0.9Mbps-95419179.mp4', poster: 'https://cdn.shopify.com/s/files/1/0790/9939/6196/files/lumiq-immersive-20260924-cleanse-ritual.jpg?v=1790245810&width=540', label: 'LUMIQ product film: face wash lathering' },
      { src: 'https://cdn.shopify.com/videos/c/vp/9c848ec8f515497b89180292ef82e48a/9c848ec8f515497b89180292ef82e48a.SD-480p-0.9Mbps-95421085.mp4', poster: V('mask-tutorial.jpg'), label: 'LUMIQ product film: clay mask' },
    ],
  },
  {
    brand: 'VITALEDGE', category: 'Performance supplements', tone: 'Bold, athletic',
    main: { src: V('ve-fight.mp4'), poster: V('ve-fight.jpg'), label: 'VITALEDGE campaign film: a boxer training' },
    side: [
      { src: V('ve-creatine.mp4'), poster: V('ve-creatine.jpg'), label: 'VITALEDGE product film: creatine tub' },
      { src: V('ve-endurance.mp4'), poster: V('ve-endurance.jpg'), label: 'VITALEDGE campaign film: a runner at dawn' },
    ],
  },
  {
    brand: 'Loom & Little', category: 'Kidswear', tone: 'Warm, playful',
    main: { src: V('loom-colour.mp4'), poster: V('loom-colour.jpg'), label: 'Loom & Little campaign film: a toddler running through colour' },
    side: [
      { src: V('loom-product.mp4'), poster: V('loom-product.jpg'), label: 'Loom & Little product film: organic cotton up close' },
      { src: V('loom-fabric.mp4'), poster: V('loom-fabric.jpg'), label: 'Loom & Little campaign film: fabric playground' },
    ],
  },
] as const;

/** Client-approved website copy drafts. Keep these grounded in the documented work:
 * no performance claims, invented metrics or outcomes we cannot verify. */
export const TESTIMONIALS = [
  {
    id: 'lumiq',
    name: 'Louis Dupont',
    brand: 'LUMIQ',
    category: 'French men’s skincare',
    quote: 'We wanted LUMIQ to feel clinical without becoming cold. The team carried that balance through everything — the packaging, the product pages, even how ingredients are explained.',
    image: P('live-lumiq-mobile.jpg'),
  },
  {
    id: 'magic',
    name: 'Rajesh',
    brand: 'Magic Store',
    category: 'Magic & novelty retail',
    quote: 'I was very particular about the details — Hindi, the category names, the cart, all of it. They kept working through the list until the store felt like ours, not someone else’s template.',
  },
  {
    id: 'pilates',
    name: 'Sneha',
    brand: 'Pilates Store',
    category: 'Home Pilates',
    quote: 'They understood that we weren’t just selling Pilates equipment. It is a complete home system, and the store finally explains it that way.',
  },
  {
    id: 'vitaledge',
    name: 'Anubhav Singh',
    brand: 'VITALEDGE',
    category: 'Performance supplements',
    quote: 'The Shopify work was properly thought through. People can shop by goal, the proof is easy to find, and the whole thing still feels clear rather than overloaded.',
    image: P('live-vitaledge-mobile.jpg'),
  },
  {
    id: 'loom',
    name: 'Meera & Rohan Singhania',
    brand: 'Loom & Little',
    category: 'Kidswear',
    quote: 'Loom & Little needed to be playful without becoming messy. They got the warmth right and made things like shopping by age and finding the right size much easier.',
    image: P('live-loom-mobile.jpg'),
  },
  {
    id: 'coffee',
    name: 'Agastya Sheron',
    brand: 'Coffee Shop',
    category: 'Coffee & café',
    quote: 'Fast, clear, and easy to work with. We gave them the direction for the coffee shop and they just got on with it.',
  },
] as const;

/** Chaptered LUMIQ tour — every clip is cut from Ankit's own hand-driven sessions on the live store
 * (desktop + phone, 2026-09-24): taps, menus, cart and Shopify checkout included. */
export const TOUR = [
  { id: 'home', tab: 'Homepage', frame: 'laptop' as const, src: V('real-home-desktop.mp4'), poster: V('real-home-desktop.jpg'), aspect: '2938 / 1600', path: '/', title: 'A homepage that sells the routine, not one product.', why: 'A product rail, shop by concern, a routine picker and four moments of the day. Every section moves people toward a fuller basket.', tags: ['Product rail', 'Shop by concern', 'Routine picker'] },
  { id: 'concerns', tab: 'Shop by concern', frame: 'phone' as const, src: V('real-concern-mobile.mp4'), poster: V('real-concern-mobile.jpg'), path: '/', title: 'Shoppers start with a problem, not a product name.', why: 'Concern tiles and a one-tap routine picker turn “what should I buy?” into three products that belong together.', tags: ['Shop by concern', 'Routine builder', 'Mobile-first'] },
  { id: 'menu', tab: 'Navigation', frame: 'phone' as const, src: V('real-menu-mobile.mp4'), poster: V('real-menu-mobile.jpg'), path: '/', title: 'A menu that sells, even on a phone.', why: 'Image-led menus let people browse by product, concern or ingredient, whichever way they think.', tags: ['Image menu', 'Shop by concern', 'Thumb-sized targets'] },
  { id: 'pdp', tab: 'Product page', frame: 'phone' as const, src: V('real-pdp-mobile.mp4'), poster: V('real-pdp-mobile.jpg'), path: '/products/niacinamide-10-zinc-serum', title: 'Every question answered before it’s asked.', why: 'Outcome first, then ingredients, how to use and what to pair it with, plus a buy button that stays in reach.', tags: ['Sticky add to cart', 'Ingredient breakdown', 'Complete the routine'] },
  { id: 'ingredients', tab: 'Ingredient pages', frame: 'laptop' as const, src: V('real-ingredients-desktop.mp4'), poster: V('real-ingredients-desktop.jpg'), aspect: '2938 / 1600', path: '/pages/ingredients', title: 'Content that ranks and builds trust.', why: 'Every key ingredient gets its own page, linked both ways to the products that use it. Good for shoppers, good for search.', tags: ['SEO pages', 'Custom content model', 'Cross-linking'] },
  { id: 'checkout', tab: 'Cart → checkout', frame: 'phone' as const, src: V('real-checkout-mobile.mp4'), poster: V('real-checkout-mobile.jpg'), path: '/checkout', title: 'From tap to checkout, no friction.', why: 'A real session: add to bag, the cart updates, straight into Shopify’s checkout. The part of the store where money actually changes hands.', tags: ['Cart drawer', 'Upsells', 'Shopify checkout'] },
];

/* ── How it works ────────────────────────────────────────────────────────── */

export const PROCESS = [
  { n: '01', title: 'Talk to us', body: 'Tell us about your brand, your store and where you want to take it. We map out what the redesign needs to cover.' },
  { n: '02', title: 'Design with you', body: 'We work through your brand, your customers and the look you want, then design every page. You approve each one before we build.' },
  { n: '03', title: 'Build & launch', body: 'We build the store on your Shopify account, move your products and content across, and set up payments, shipping, SEO and tracking.' },
  { n: '04', title: 'Grow', body: 'After launch we stay on for support, and can keep running your SEO, creative and automation as the brand scales.' },
] as const;

/* ── FAQ ─────────────────────────────────────────────────────────────────── */

export const FAQS = [
  { q: 'How much does a redesign cost?', a: 'Every store is different, so we don’t publish a fixed price. After our first call we send you a written scope and a fixed quote. You’ll know exactly what you’re paying for before any work starts.' },
  { q: 'Do you use templates?', a: 'No generic look. Every layout, section and visual is designed for your brand, on Shopify’s own modern theme framework, so the store stays fast and your team can edit it without us.' },
  { q: 'Are these real stores?', a: 'Yes. LUMIQ, VITALEDGE and Loom & Little are real Shopify stores our team designed and built. The versions on this page are exact copies of those storefronts, hosted so you can browse them without a password. Everything works except checkout, which is switched off. LUMIQ is our own flagship brand, built end to end to show what we do: identity, packaging, photography, film and the store.' },
  { q: 'Will I lose my products, customers or search rankings?', a: 'No. Your products, customers, orders and content stay on your Shopify account or move across with the redesign. We keep your URLs or redirect them properly, so the rankings you’ve earned carry over.' },
  { q: 'Can you create videos and photography for my brand?', a: 'Yes. We produce campaign films, product videos and photography, like the films on this page, using AI-assisted production where it fits and real shoots when they’re needed.' },
  { q: 'What happens after launch?', a: 'We support you after launch while your team settles in. If you want, we keep running SEO, creative and automation month to month, so the store keeps improving.' },
  { q: 'Do I own the store and everything in it?', a: 'Yes, completely. The store, domain, designs and content sit on your own Shopify account, not ours.' },
  { q: 'What costs are separate?', a: 'Your Shopify subscription, any paid apps your store needs (always agreed with you first), and your ad spend. We quote everything else up front.' },
  { q: 'Do you guarantee sales?', a: 'No one honestly can. We build the store, the brand and the systems to give your products the best chance to sell. Results also depend on your products, pricing and traffic.' },
];
