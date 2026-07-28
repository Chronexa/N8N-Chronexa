/**
 * Body-optimization batch 2 — wealth/RIA (2026-07-25).
 * why-advisor-client-transfer-paperwork-gets-rejected audited CLEAN (FINRA-sourced) — untouched.
 * The other four get surgical fixes:
 *  - remove unattributed invented math from the RIA onboarding post ($37.5K/week, 94v62% retention, 8.2h labor math)
 *  - buyer-words opening instead of stat-dump on that post
 *  - strip the shared junk tail everywhere: wrong-title byline, plaintext "Related Articles"
 *    (stale titles; the site renders related posts automatically), generic "Ready to transform" CTA
 *  - demote the in-body H1 in the build-vs-buy guide to H2
 *  - append a method CTA paragraph (service link + Cal.com) where the tail was removed
 *  - author → Abhishek (CA/SEBI-RIA E-E-A-T on wealth content)
 *
 * Run: FIX=1 node scripts/body-batch2-wealth-2026-07.mjs
 */
import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const FIX = process.env.FIX === '1';
const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const span = (k, text, marks = []) => ({ _key: k, _type: 'span', marks, text });
const ctaBlock = (keyBase, lead, linkText, href, tail) => ({
  _key: `${keyBase}-cta`,
  _type: 'block',
  style: 'normal',
  markDefs: [
    { _key: `${keyBase}-l1`, _type: 'link', href },
    { _key: `${keyBase}-l2`, _type: 'link', href: 'https://cal.com/chronexa/30min' },
  ],
  children: [
    span(`${keyBase}-s1`, lead),
    span(`${keyBase}-s2`, linkText, [`${keyBase}-l1`]),
    span(`${keyBase}-s3`, tail),
    span(`${keyBase}-s4`, 'book a free 30-minute strategy call', [`${keyBase}-l2`]),
    span(`${keyBase}-s5`, '.'),
  ],
});

const AUTHOR = { _ref: 'author-abhishek-walia', _type: 'reference' };
const OPS = [
  {
    id: 'post-client-onboarding-automation-ria-custom-workflows',
    unsetKeys: [
      '7371bf0a5d85', '78d4e03f6343', 'ab06f6f03443', 'b0026c4be22d', '14da572713cb', // invented math
      'e5ad46b5a89d', '485f0f1111bb', // empty h3 + wrong byline
      '11dcd5c0e545', '1ef70d37f961', '1b97f61863ad', 'a376e4454ad7', // stale related-articles plaintext
      '72064d99c02a', '49188d50c3db', '39d3b397fe2d', // old CTA trio
      'd8253f0e323d', 'ca3af5025c92', // generic template CTA
    ],
    set: {
      author: AUTHOR,
      updatedAt: '2026-07-25',
      'body[_key=="47407f964174"].children': [
        span('rw-ria-intro', 'Ask the operations lead at any growing RIA what onboarding a new household actually involves and you will hear the same sequence: account paperwork arriving as email attachments, KYC results sitting in a compliance inbox, suitability tracked on a spreadsheet, ACAT transfers initiated by hand once account numbers finally confirm, and the CRM updated whenever someone remembers. Every step works; none of it connects. RIA client onboarding automation exists to close those gaps — and the firms that have closed them onboard in days while everyone else takes weeks.'),
      ],
    },
    appendCta: ctaBlock(
      'b2ria',
      'If onboarding is where your firm leaks the most time, start with the system it feeds: our work on ',
      'RIA & advisor CRM automation',
      '/ria-crm-automation',
      ' covers the full path from signed agreement to funded account. To pressure-test it against your custodian stack, ',
    ),
  },
  {
    id: 'post-off-the-shelf-ai-vs-custom-workflows-ria-build-vs-buy-guide',
    unsetKeys: [
      '20ce8d652a32', // null block
      '68a71b888fe0', 'faaf10f50eed', // empty h3 + wrong byline
      '16e1ff12f8aa', '8c605dc53da4', 'db0f115a7c21', '83fa18a256f9', // stale related-articles
      'bb960219a696', 'f25a213f17bb', // generic template CTA (keeps its own good RIA CTA above)
    ],
    set: {
      author: AUTHOR,
      updatedAt: '2026-07-25',
      'body[_key=="d24dbd24186a"].style': 'h2', // in-body H1 → H2
    },
  },
  {
    id: 'post-best-ai-agent-platforms-wealth-management-uae',
    unsetKeys: ['274ee7b6c83a', '8c48eefbbd9e', 'c5c5e85039a2', '8c1382237275', '00f51a3ca6c8', '22a1dada06ca', '02662c7f26e1', '5666caaf2325'],
    set: { author: AUTHOR, updatedAt: '2026-07-25' },
    appendCta: ctaBlock(
      'b2uaew',
      'If your firm operates under SCA, DFSA or FSRA rules and wants AI that respects them by design, see how we build for the region at our ',
      'AI automation practice for Dubai & the UAE',
      '/ai-automation-agency-dubai',
      ', or ',
    ),
  },
  {
    id: 'post-client-onboarding-automation-uae-wealth-managers',
    unsetKeys: ['c24c1fd96f93', '5c48c793400c', 'a4fa8af8dc6f', 'c64d32c82daa', 'e4ea194bbc57', 'f2f8e2608615', 'c91bdc895ca2', '4f6ed883f0a3'],
    set: { author: AUTHOR, updatedAt: '2026-07-25' },
    appendCta: ctaBlock(
      'b2uaeo',
      'Onboarding is where DIFC and ADGM firms feel manual work first — and where automation shows fastest. Our ',
      'UAE automation practice',
      '/ai-automation-agency-dubai',
      ' covers the regulatory context in depth; to map it to your custodians and KYC stack, ',
    ),
  },
];

for (const op of OPS) {
  console.log(`\n=== ${op.id}`);
  console.log(`  unset ${op.unsetKeys.length} blocks | set ${Object.keys(op.set).length} fields | CTA: ${op.appendCta ? 'yes' : 'no'}`);
  if (FIX) {
    const unsetPaths = op.unsetKeys.map(k => `body[_key=="${k}"]`);
    let patch = c.patch(op.id).unset(unsetPaths).set(op.set);
    await patch.commit();
    if (op.appendCta) {
      const has = await c.fetch(`*[_id==$id][0]{"has": count(body[_key==$k]) > 0}`, { id: op.id, k: op.appendCta._key });
      if (!has.has) await c.patch(op.id).insert('after', 'body[-1]', [op.appendCta]).commit();
    }
    console.log('  ✓ patched');
  }
}
console.log(FIX ? '\nDONE — batch 2 applied. (ACAT post untouched — clean.)' : '\nDRY RUN — FIX=1 to apply.');
