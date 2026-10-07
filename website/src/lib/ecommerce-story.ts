/**
 * Content for /ecommerce-development (rebuilt 2026-10-07). Every claim about how LUMIQ was built
 * comes from the working documents in ~/Work/Ecommerce/Skincare Store/docs (revamp strategy
 * 2026-09-22, page blueprint 2026-09-23, immersive campaign + films 2026-09-24) and the monorepo
 * standards. Nothing here is a client result: LUMIQ is our own flagship showcase, VITALEDGE and
 * Loom & Little are stores we designed and built, and we publish no sales or conversion numbers.
 */

const V = (f: string) => `/videos/shopify-landing/${f}`;

export type Media =
  | { type: 'video'; src: string; poster: string; frame: 'laptop' | 'phone'; aspect?: string; address?: string; label: string }
  | { type: 'audit' }
  | { type: 'benchmark' }
  | { type: 'films' };

export type Chapter = {
  id: string;
  tab: string;
  title: string;
  saw: string;
  did: string;
  why: string;
  media: Media;
};

export const AUDIT_SCORES: { area: string; score: number }[] = [
  { area: 'Trust and operational credibility', score: 2 },
  { area: 'Catalog strategy', score: 3 },
  { area: 'Collection experience', score: 3 },
  { area: 'Portfolio readiness', score: 3 },
  { area: 'Homepage merchandising', score: 5 },
  { area: 'Mobile UX', score: 5 },
];

export const AUDIT_FINDINGS = [
  '28 of 28 products permanently “on sale”',
  'Testimonials on the homepage, while the review widget said no reviews',
  'AI-generated packaging that changed from image to image, once reading “SPF 0”',
  'A password page and placeholder social links',
];

export const BENCHMARK = [
  { h: 'A sticky buy bar that carries product, variant, price and button', p: 'Not a bare “add to cart” that follows you down the page.' },
  { h: 'Every trust claim as a labelled spec row', p: 'ACTIVE, CONCENTRATION, pH, FOR. Facts a shopper can scan, not paragraphs.' },
  { h: '“Complete your routine” right under the buy button', p: 'Cross-sell where the decision is made, with its own price and variant picker.' },
  { h: 'One hero ingredient at a time', p: 'Named, oversized and explained, instead of a wall of ingredient text.' },
  { h: 'Reviews that carry structured, product-specific questions', p: 'Designed in from the start, switched on only when real reviews exist.' },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 'audit', tab: 'The audit',
    title: 'We audited our own flagship before asking anyone to admire it.',
    saw: 'A store that looked sophisticated and read as unfinished: permanent discounts, testimonials without reviews, packaging that drifted between images.',
    did: 'A clean price ladder, with kit savings that are real arithmetic instead of permanent discounts. No reviews until real ones exist. One locked packaging source. A focused core range up front. A rule: no invented proof, anywhere.',
    why: 'Shoppers decide in seconds whether a brand is real. One fake signal makes the true ones look fake too.',
    media: { type: 'audit' },
  },
  {
    id: 'benchmark', tab: 'The benchmark',
    title: 'We studied the best in the category, then took mechanisms, not looks.',
    saw: 'Rhode Skin earns its conversion with craft: every section answers “why should I buy this?” and backs it with something specific.',
    did: 'We broke their product page into mechanisms and kept the five that suit a men’s clinical brand. We left the rest, including a sustainability diagram we couldn’t honestly match.',
    why: 'Copying a look makes a clone. Borrowing a mechanism, and dropping the ones you can’t back up, makes a better store.',
    media: { type: 'benchmark' },
  },
  {
    id: 'home', tab: 'Homepage',
    title: 'A homepage that sells the routine, not one product.',
    saw: 'Eleven theme sections trying to do everything: long, text-heavy and tiring on a phone.',
    did: 'Rebuilt around one path: concern, then routine, then product, then evidence. A product rail, shop by concern, a routine picker and four moments of the day.',
    why: 'A skincare buyer arrives with a problem, not a product name. Every section now moves them toward a fuller basket.',
    media: { type: 'video', src: V('real-home-desktop.mp4'), poster: V('real-home-desktop.jpg'), frame: 'laptop', aspect: '2938 / 1600', address: 'lumiq-dev.myshopify.com', label: 'A real scroll through the LUMIQ homepage on a laptop' },
  },
  {
    id: 'concern', tab: 'Shop by concern',
    title: 'Shoppers start with a problem, not a product name.',
    saw: 'First-time buyers face 28 products and no way to tell which three belong together.',
    did: 'Concern tiles and a one-tap routine picker turn “what should I buy?” into a short set that works together, designed thumb-first.',
    why: 'A lot of shopping starts on a phone. The decision has to be made with one thumb, in a few seconds.',
    media: { type: 'video', src: V('real-concern-mobile.mp4'), poster: V('real-concern-mobile.jpg'), frame: 'phone', label: 'A real session on the LUMIQ store on a phone: shop by concern' },
  },
  {
    id: 'pdp', tab: 'Product page',
    title: 'Every question answered before it’s asked.',
    saw: 'A solid skeleton, missing the mechanisms that make a product page convert.',
    did: 'Outcome first, then ingredients, how to use and what to pair it with. Spec rows for the facts, a buy bar that stays in reach, and the routine cross-sell under the button.',
    why: 'The product page does the selling. Whatever a shopper might ask, the answer is already on the screen.',
    media: { type: 'video', src: V('real-pdp-mobile.mp4'), poster: V('real-pdp-mobile.jpg'), frame: 'phone', label: 'A real session on a LUMIQ product page on a phone' },
  },
  {
    id: 'ingredients', tab: 'Ingredient pages',
    title: 'Content that ranks and builds trust.',
    saw: 'Thin content pages and no reason for Google or an AI assistant to cite the store.',
    did: 'Every key ingredient gets its own page, linked both ways to the products that use it, on a custom content model your team can extend.',
    why: 'It’s what shoppers want to read before they buy, and exactly what search and AI answers pull from.',
    media: { type: 'video', src: V('real-ingredients-desktop.mp4'), poster: V('real-ingredients-desktop.jpg'), frame: 'laptop', aspect: '2938 / 1600', address: 'lumiq-dev.myshopify.com/pages/ingredients', label: 'A real scroll through the LUMIQ ingredient library' },
  },
  {
    id: 'checkout', tab: 'Cart to checkout',
    title: 'From tap to checkout, with nothing in the way.',
    saw: 'The part of the store where money changes hands is the part most agencies stop thinking about.',
    did: 'A cart drawer that updates instantly, upsells that help rather than nag, then straight into Shopify’s own checkout.',
    why: 'Every extra step between “add to bag” and “pay” is a customer you paid to acquire and then lost.',
    media: { type: 'video', src: V('real-checkout-mobile.mp4'), poster: V('real-checkout-mobile.jpg'), frame: 'phone', label: 'A real session adding to bag and reaching checkout on a phone' },
  },
  {
    id: 'films', tab: 'The films',
    title: 'Film that shows the product, without inventing it.',
    saw: 'AI video can make beautiful footage and quietly change your bottle, your label or your claims.',
    did: 'Our film brief locks the approved packshot, and the model is never asked to invent the bottle. We reviewed 17 source clips for label drift and cut 10 films for the store, excluding any frame that shows outdated packaging. Off-palette colour, an invented tagline, a product we don’t sell and photosensitive flashing were cut or held back.',
    why: 'Wrong packaging on camera is worse than less cinematic footage. We only ship what we’d defend line by line.',
    media: { type: 'films' },
  },
];

export const CAPABILITIES = [
  { n: '01', h: 'Brand & research', p: 'A founder session, your customers, your competitors, your assortment. Positioning and art direction before anything is designed.', items: ['Market and competitor research', 'Brand and art direction', 'Page blueprint'] },
  { n: '02', h: 'UX & design', p: 'Every page designed for your products and your shoppers, mobile first, and approved by you before it is built.', items: ['User journeys', 'Page-by-page design', 'Approval at every step'] },
  { n: '03', h: 'Custom theme build', p: 'Built on Shopify’s own theme framework, with every section designed and coded for your brand. Your team can edit it without us.', items: ['Sections made for you', 'Fast and editable', 'Your Shopify account'] },
  { n: '04', h: 'Photography & film', p: 'Product photography, packaging visuals and campaign films in one consistent look, AI-assisted where it fits and real shoots when needed.', items: ['Product and lifestyle imagery', 'Campaign and product films', 'One look, everywhere'] },
  { n: '05', h: 'SEO & AI search', p: 'Structure, schema and a content model built in, so Google and AI assistants can understand and recommend the store.', items: ['Structured data', 'Collection and content pages', 'Redirects that protect rankings'], href: '/shopify-seo-services', link: 'Shopify SEO services' },
  { n: '06', h: 'Analytics & tracking', p: 'GA4 and Meta tracking set up and tested end to end, with consent handled, so you know what is really selling.', items: ['GA4 and Meta events', 'Consent mode', 'Lead and purchase tracking'] },
  { n: '07', h: 'Email, SMS & WhatsApp', p: 'Welcome, abandoned-cart, post-purchase and win-back journeys, written in your brand’s voice.', items: ['Abandoned cart', 'Post-purchase', 'Win-back'] },
  { n: '08', h: 'Automation & operations', p: 'Stock alerts, order and delivery updates, returns, daily sales reports. The back office runs without a bigger team.', items: ['Inventory and orders', 'Returns and support', 'Daily reporting'], href: '/d2c-ecommerce-automation', link: 'E-commerce automation' },
];

export const STEPS = [
  { n: '01', h: 'Founder session and free store audit', p: 'We sit with you, then walk your store as a shopper would and mark where people hesitate, get lost or give up.', get: 'A ranked fix list, yours to keep.' },
  { n: '02', h: 'Research and blueprint', p: 'Customers, competitors, assortment and the user journey, mapped before any pixel is drawn.', get: 'A page-by-page blueprint and art direction.' },
  { n: '03', h: 'Design, page by page', p: 'Every page designed for your brand. You approve each one before we build it.', get: 'Approved designs for every key page.' },
  { n: '04', h: 'Build, shoot and film', p: 'The theme, the photography and film, the content, the tracking and the automation, built together.', get: 'A working store on your Shopify account.' },
  { n: '05', h: 'Launch gate, then grow', p: 'Nothing goes live until it has passed the gate below. After launch we stay for support, SEO, creative and automation.', get: 'A launch you can trust, and a team behind it.' },
];

export const STUDIO = ['Project lead', 'Creative director', 'UX & conversion', 'Theme developer', 'SEO', 'Analytics', 'Lifecycle marketing', 'Performance', 'QA', 'Accessibility'];

export const GATE = [
  { h: 'Looked at, not just coded', p: 'Every key page is rendered and inspected at 375, 428, 768 and 1440 pixels before we call it done.' },
  { h: 'Theme Check clean', p: 'Shopify’s own theme checker passes with zero errors.' },
  { h: 'Fast by Google’s thresholds', p: 'Built for LCP under 2.5 seconds, INP under 200 ms and CLS under 0.1.' },
  { h: 'Structured data and clean URLs', p: 'Product, offer, organization and breadcrumb schema, correct canonicals, one URL per product.' },
  { h: 'Accessible', p: 'Checked against WCAG 2.2 AA: keyboard focus, contrast and thumb-sized tap targets.' },
  { h: 'Tracking proved', p: 'GA4 and Meta events fired and verified end to end, with consent mode.' },
  { h: 'Video that behaves', p: 'Sound off, plays only in view, has a pause control and respects reduced motion.' },
  { h: 'One honest look', p: 'Consistent imagery, true-to-product colour, and no claim or review we can’t back up.' },
];

export const WONT = [
  'Install a theme, swap the logo and call it a custom build',
  'Invent reviews, testimonials or permanent “sales”',
  'Let AI invent your packaging, label or claims',
  'Promise sales. Nobody honestly can',
  'Publish results we can’t verify',
  'Build on our accounts. The store, domain and content are yours',
];

export const CART_JOURNEY = [
  { t: '1 hour', ch: 'WhatsApp', msg: 'A reminder with the exact items and a one-tap link back to the cart.' },
  { t: '24 hours', ch: 'Email', msg: 'The product story, answers to the common objection, and real reviews once you have them.' },
  { t: '3 days', ch: 'Email or SMS', msg: 'A last nudge, with an offer only if your margin supports one.' },
  { t: 'After purchase', ch: 'WhatsApp + email', msg: 'Order confirmation, delivery updates and how to use the product.' },
];

export const AUTOMATIONS = [
  'Abandoned-cart recovery over WhatsApp, email and SMS',
  'Low-stock and back-in-stock alerts',
  'Order, delivery and return updates sent automatically',
  'Support replies drafted from your own policies',
  'Daily sales, stock and ad-spend report in Slack or email',
  'Lead quality fed back to Meta, so ads learn who buys',
];

export const FAQS = [
  { q: 'Do you use templates?', a: 'We build on Shopify’s own modern theme framework, as every serious Shopify build does, and then design and code each section for your brand. What we don’t do is install a theme, change the logo and ship it. If a paid theme is the right answer for where you are today, we’ll tell you in the audit.' },
  { q: 'How much does a custom Shopify store cost?', a: 'There is no package price. After the free audit we send a written scope and a fixed quote, so you know exactly what you are paying for before work starts. Your Shopify plan, any paid apps and your ad spend are separate. Our cost guide explains what drives the price and typical market ranges.' },
  { q: 'Are the stores on this page real?', a: 'Yes. LUMIQ is our own flagship brand, built end to end to hold ourselves to the standard we sell. VITALEDGE and Loom & Little are stores we designed and built. The versions here are exact copies, hosted so you can browse without a password, with checkout switched off.' },
  { q: 'Who is this for?', a: 'D2C founders building brands meant to sell globally, who care how the brand looks, loads and converts. If you need a quick test store for a first product, a theme and a weekend may be the right call, and we’ll say so.' },
  { q: 'Can you create product photography and video?', a: 'Yes. We produce product and lifestyle imagery, packaging visuals and campaign films, using AI-assisted production where it fits and real shoots where they’re needed, always against the approved product so nothing is misrepresented.' },
  { q: 'Will I lose my rankings if I redesign or migrate?', a: 'No. We map your URLs and redirect them properly, keep what ranks, and check the result before launch. Migration from WooCommerce, Magento and others is part of the work.' },
  { q: 'Do you handle email, SMS and WhatsApp?', a: 'Yes. We build the abandoned-cart, welcome, post-purchase and win-back journeys in your brand’s voice and connect them to your store, so they run on their own.' },
  { q: 'Who owns the store?', a: 'You do. The store, domain, designs, content and every account sit in your name from day one.' },
  { q: 'Do you guarantee sales?', a: 'No, and be wary of anyone who does. We build the store, the brand and the systems to give your products the best chance. Results depend on your product, pricing and traffic too.' },
];
