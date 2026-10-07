// SEO cleanup 2026-10-08 (docs/research/seo-forensics-2026-10-06/FIX-PLAN.md, Move 7 + 8).
//   1. Rewrite in-body links that hop through redirects or 404 to their live destination.
//   2. Fold the UAE agency list's "how to choose" section into the surviving agency post.
//   3. Refresh the 11 posts sitting at positions 4-20: query-matched meta, key takeaways drawn
//      only from each post's own text, and a closing line linking the matching buyer page.
//
//   node scripts/seo-cleanup-2026-10-08.mjs            # dry run, prints every change
//   node scripts/seo-cleanup-2026-10-08.mjs --apply    # backs up each doc first, then patches
//
// Idempotent: refresh blocks carry a fixed _key and are skipped when already present.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = (n) => { for (const p of [resolve(ROOT, '.env.local'), resolve(ROOT, '.env')]) { try { const m = readFileSync(p, 'utf8').match(new RegExp(`^\\s*${n}\\s*=\\s*(.+)\\s*$`, 'm')); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); } catch {} } return null; };
const client = createClient({ projectId: env('NEXT_PUBLIC_SANITY_PROJECT_ID'), dataset: env('NEXT_PUBLIC_SANITY_DATASET') || 'production', apiVersion: '2024-01-01', token: env('SANITY_API_WRITE_TOKEN'), useCdn: false });
const APPLY = process.argv.includes('--apply');
const BACKUP = process.env.BACKUP_DIR || resolve(ROOT, 'tmp/seo-backups-2026-10-08');
if (APPLY) mkdirSync(BACKUP, { recursive: true });

/* ---------- 1. link rewrites ---------- */
const PAGE_MAP = {
  '/ai-automation-agency-dubai': '/ai-automation-agency',
  '/n8n-automation-services': '/ai-automation-agency',
  '/us-ai-automation-agency': '/ai-automation-agency',
  '/system-data-integration': '/ai-integration-services',
  '/private-rag-knowledge-systems': '/ai-knowledge-systems',
  '/ai-readiness-assessment': '/ai-strategy-consulting',
  '/sales-revenue-automation': '/ai-sales-outreach-engine',
  '/marketing-automation': '/ai-sales-outreach-engine',
  '/finance-automation': '/document-processing-automation',
  '/secure-ai-deployment': '/legal-ai-automation',
  '/case-studies/ai-automation-tax-workflow-cpa-case-study': '/case-studies/cpa-client-intake-to-engagement-automation',
  '/tools/law-firm-billing-leakage-calculator': '/law-firm-billing-leakage-calculator',
};
// Same map as lib/blog-seo.ts MERGED_POSTS (kept literal: this is a .mjs script).
const MERGED = {
  'blog-top-automation-agencies-uae-dubai': '/blog/top-ai-automation-agencies-b2b-saas-2026',
  'make-vs-n8n-vs-zapier': '/blog/n8n-vs-make-vs-zapier-which-automation-tool-is-best-for-technical-teams',
  'what-is-hyperautomation': '/what-is-ai-automation',
  'what-is-intelligent-automation': '/what-is-ai-automation',
  'what-is-workflow-automation': '/what-is-ai-automation',
  'ai-automation-company-for-cpa-firms': '/cpa-tax-document-automation',
  'tax-document-automation-workflow-cpa-firms': '/cpa-tax-document-automation',
};
function rewriteHref(href) {
  if (!href) return null;
  let u; try { u = new URL(href, 'https://chronexa.io'); } catch { return null; }
  if (!/^(www\.)?chronexa\.io$/.test(u.hostname)) return null;
  const path = u.pathname.replace(/\/$/, '') || '/';
  let dest = PAGE_MAP[path];
  const m = path.match(/^\/blog\/([^/]+)$/);
  if (m && MERGED[m[1]]) dest = MERGED[m[1]];
  return dest ? `${dest}${u.search}${u.hash}` : null;
}

/* ---------- 3. refresh specs ---------- */
const NOW = new Date().toISOString();
const L = (label, href) => ({ label, href });
const REFRESH = {
  'ai-agents-law-firm-operations-use-cases-roi-2025': {
    metaTitle: 'AI Agents for Law Firms: Use Cases, ROI and Compliance',
    metaDescription: 'Six AI agent use cases for US law firms, the ABA compliance architecture that makes them defensible, and a 12-week path from audit to production.',
    keyTakeaways: [
      'Most law firm AI projects stall between pilot and production because of missing governance, not model quality.',
      'Start with operations such as billing recovery, intake and document collection, and keep legal judgment with attorneys.',
      'ABA Model Rules 1.1, 1.6 and 5.1/5.3 (competence, confidentiality, supervision) decide what an acceptable deployment looks like.',
      'The guide walks through six use cases and a 12-week route from audit to production.',
    ],
    close: ['Weighing this for your own firm? See ', L('how we build AI agents', '/ai-agent-development'), ', or read our guide to ', L('AI contract review for law firms', '/blog/ai-contract-review-software-law-firms-roi-compliance'), '.'],
  },
  'ai-contract-review-software-law-firms-roi-compliance': {
    metaTitle: 'AI Contract Review for Law Firms: Costs, ROI and Compliance',
    keyTakeaways: [
      'A general-purpose AI tool gives client contract language no defined data boundary and no audit trail.',
      'The real question is whether the system produces a record you would defend to a client and keeps their contracts inside your control.',
      'Start by costing manual review: it scales with the clause types in your playbook and how many people touch each document.',
      'Vendors quote review-time reductions of roughly 40 to 70 percent on complex agreements; your own number depends on your process and playbook.',
    ],
    close: ['Related: ', L('AI agents for law firm operations', '/blog/ai-agents-law-firm-operations-use-cases-roi-2025'), ', and how we build ', L('knowledge systems that keep your playbook in one place', '/ai-knowledge-systems'), '.'],
  },
  'ai-meeting-prep-financial-advisors': {
    metaTitle: 'Meeting Notes Software for Financial Advisors: Build vs. Buy',
    metaDescription: 'AI notetakers cost $75-120 a seat and keep client conversations in the vendor’s cloud. How a custom meeting-prep pipeline inside Redtail or Wealthbox works.',
    keyTakeaways: [
      'Off-the-shelf meeting-prep tools work when your CRM, custodian and reporting tool match the connectors the vendor built.',
      'Where the transcript is stored is the real decision: the vendor’s cloud or your own stack.',
      'AI-generated notes that relate to advice become part of the firm’s books and records, so they must be retrievable and retained.',
      'The cost of the status quo is mostly meetings that go unprepared, not a measured hours-saved figure.',
    ],
    close: ['Also see ', L('why custom workflows beat CRM templates for RIA onboarding', '/blog/client-onboarding-automation-ria-custom-workflows'), ', or ', L('how we work with companies', '/ai-automation-agency'), '.'],
  },
  'best-ai-agent-platforms-wealth-management-uae': {
    metaTitle: 'Best AI Agent Platforms for Wealth Management in the UAE',
    keyTakeaways: [
      'No AI agent platform ships DIFC- or ADGM-compliant out of the box; data residency, access control and audit trail are configured and contracted.',
      'Microsoft, AWS and Salesforce now host data inside the UAE, so the open question is the workflow, not the infrastructure.',
      'Purpose-built wealth-tech vendors were built for other markets first: ask about UAE hosting before a demo becomes a contract.',
      'The deciding factor is who reviews the agent’s output before it touches a client file, and whether that review is logged.',
    ],
    close: ['If a custom build is on your shortlist, see ', L('how we build AI agents', '/ai-agent-development'), ' and ', L('how we work', '/how-we-work'), '.'],
  },
  'blog-ai-sdr-engine-automation-case-study': {
    metaTitle: 'Document Automation Tools Built for Regulated Industries',
    close: ['Need something built around your own documents and rules? See ', L('document processing automation', '/document-processing-automation'), ' or ', L('how we work with companies', '/ai-automation-agency'), '.'],
  },
  'blog-best-ai-lead-scoring-platforms-b2b-saas': {
    metaTitle: 'AI Lead Scoring Software: 7 Platforms for B2B SaaS (2026)',
    metaDescription: 'Compare 7 AI lead scoring platforms for B2B SaaS teams by accuracy, cost and fit, with a decision matrix for choosing the right one.',
    close: ['If off-the-shelf scoring does not fit your pipeline, see our ', L('AI sales and outreach engine', '/ai-sales-outreach-engine'), ' or ', L('how we work with companies', '/ai-automation-agency'), '.'],
  },
  'client-onboarding-automation-ria-custom-workflows': {
    keyTakeaways: [
      'A CRM’s built-in onboarding module is a task list with reminders; real RIA onboarding is a branching sequence across KYC, suitability, ADV disclosure, ACAT transfer and custodian account opening.',
      'A custom onboarding system sits across Redtail, Wealthbox and the custodian portal instead of replacing them.',
      'Advisors keep every judgment; the system handles the paperwork and coordination.',
      'Done properly, automation makes oversight easier, because every document sent and status check is timestamped.',
    ],
    close: ['Related: ', L('AI meeting prep for financial advisors', '/blog/ai-meeting-prep-financial-advisors'), ', and our ', L('automation for financial services firms', '/financial-services-automation'), '.'],
  },
  'manual-invoice-processing-cost-per-invoice-automation': {
    metaTitle: 'Cost of Manual Invoice Processing: The $16-Per-Invoice Math',
    close: ['Run the numbers for your own volume with the ', L('document processing cost calculator', '/document-processing-cost-calculator'), ', or see ', L('what AI automation costs', '/ai-automation-cost'), '.'],
  },
  'productized-automation-vs-custom-development-the-real-cost-breakdown': {
    metaTitle: 'Productized vs Custom Automation: What Each Really Costs',
    metaDescription: 'What productized automation and custom development each cost, how long they take and where the hidden costs sit, plus a framework for choosing.',
    close: ['For current price ranges and what drives them, see ', L('what AI automation costs', '/ai-automation-cost'), ', or ', L('how we work with companies', '/ai-automation-agency'), '.'],
  },
  'sec-marketing-rule-compliance-automation': {
    metaTitle: 'SEC Marketing Rule Compliance Automation for RIAs',
    metaDescription: 'How large RIAs automate the first pass of Rule 206(4)-1 marketing review and keep the audit trail an SEC examiner will ask for.',
    keyTakeaways: [
      'Rule 206(4)-1 turned advertising review into a standing weekly function: every post, deck and review badge is something to review.',
      'The SEC’s December 16, 2025 risk alert focused on the testimonials and endorsements provisions and the third-party ratings provisions.',
      'This is a volume-and-consistency problem rather than a hard legal one; automation does the first pass before the compliance officer’s queue.',
      'The audit trail is as important as the review itself.',
    ],
    close: ['Related: ', L('RIA client onboarding automation', '/blog/client-onboarding-automation-ria-custom-workflows'), ', and our ', L('automation for financial services firms', '/financial-services-automation'), '.'],
  },
  'tax-workpaper-preparation-automation': {
    metaTitle: 'Automate Tax Workpaper Preparation: What AI Takes Over',
    keyTakeaways: [
      'Most of a business-return workpaper file is mechanical: indexing, tie-outs, leadsheets, and K-1 and 1099 reconciliation.',
      'Automation takes over assembly (intake, indexing, field-level extraction with the source image alongside) while reviewers keep judgment.',
      'It works inside CCH Axcess or UltraTax CS rather than replacing them.',
      'Prove it on twenty returns before trusting it on one.',
    ],
    close: ['See ', L('AI automation for CPA and accounting firms', '/cpa-tax-document-automation'), ' or size the problem first with the ', L('CPA tax season capacity calculator', '/cpa-tax-season-capacity-calculator'), '.'],
  },
};

/* ---------- helpers ---------- */
const text = (b) => (b.children || []).map((c) => c.text).join('');
const rid = () => Math.random().toString(16).slice(2, 14);
function closingBlock(parts, slug) {
  const markDefs = []; const children = [];
  for (const p of parts) {
    if (typeof p === 'string') children.push({ _type: 'span', _key: rid(), text: p, marks: [] });
    else { const k = rid(); markDefs.push({ _type: 'link', _key: k, href: p.href }); children.push({ _type: 'span', _key: rid(), text: p.label, marks: [k] }); }
  }
  return { _type: 'block', _key: `seo1008-${slug.slice(0, 20)}`, style: 'normal', markDefs, children };
}
const faqIndex = (body) => body.findIndex((b) => b._type === 'block' && /^h[23]$/.test(b.style || '') && /^(frequently asked questions|faqs?)\b/i.test(text(b).trim()));
async function save(doc, patch, label) {
  console.log(`  ${APPLY ? 'PATCH' : 'would patch'} ${doc.slug}: ${label}`);
  if (!APPLY) return;
  writeFileSync(resolve(BACKUP, `${doc.slug}.json`), JSON.stringify(doc.full, null, 1));
  await client.patch(doc._id).set(patch).commit();
}

/* ---------- run ---------- */
const posts = await client.fetch(`*[_type=="post" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current, title, metaTitle, metaDescription, keyTakeaways, updatedAt, body }`);
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
let linkEdits = 0;

// 2. UAE section folded into the surviving agency post (done first so step 1 sees the result)
const uae = bySlug['blog-top-automation-agencies-uae-dubai'];
const keeper = bySlug['top-ai-automation-agencies-b2b-saas-2026'];
if (uae && keeper && !keeper.body.some((b) => b._key === 'seo1008-uae-start')) {
  const s = uae.body.findIndex((b) => b.style === 'h2' && /^how to choose an automation agency in uae/i.test(text(b).trim()));
  const e = uae.body.findIndex((b, i) => i > s && b.style === 'h2');
  const slice = uae.body.slice(s, e).map((b, i) => ({ ...b, _key: i === 0 ? 'seo1008-uae-start' : rid(), children: (b.children || []).map((c) => ({ ...c, _key: rid() })) }));
  slice[0].children[0].text = 'Choosing an automation agency in the UAE (Dubai and Abu Dhabi)';
  const fi = faqIndex(keeper.body);
  const at = fi === -1 ? keeper.body.length : fi;
  keeper.body = [...keeper.body.slice(0, at), ...slice, ...keeper.body.slice(at)];
  keeper._patch = { body: keeper.body }; keeper._why = `appended UAE section (${slice.length} blocks) from the merged Dubai list`;
}

for (const p of posts) {
  if (!Array.isArray(p.body) || MERGED[p.slug]) continue; // merged posts now 301; nothing to maintain
  const orig = JSON.stringify(p.body);
  const body = p.body.map((b) => {
    if (b?._type !== 'block' || !b.markDefs?.length) return b;
    let ch = false;
    const markDefs = b.markDefs.map((d) => {
      if (d._type !== 'link') return d;
      const to = rewriteHref(d.href);
      if (!to || to === d.href) return d;
      console.log(`  link  ${d.href}  →  ${to}   [${p.slug}]`);
      ch = true; linkEdits++;
      return { ...d, href: to };
    });
    return ch ? { ...b, markDefs } : b;
  });
  p.body = body;
  if (JSON.stringify(body) !== orig) { p._patch = { ...(p._patch || {}), body }; p._why = [p._why, 'link rewrites'].filter(Boolean).join(' + '); }
}

// 3. refresh
for (const [slug, spec] of Object.entries(REFRESH)) {
  const p = bySlug[slug];
  if (!p) { console.log(`  !! missing ${slug}`); continue; }
  const patch = { ...(p._patch || {}) };
  const notes = [];
  if (spec.metaTitle && spec.metaTitle !== p.metaTitle) { if (spec.metaTitle.length > 62) throw new Error(`metaTitle too long (${spec.metaTitle.length}): ${slug}`); patch.metaTitle = spec.metaTitle; notes.push('metaTitle'); }
  if (spec.metaDescription && spec.metaDescription !== p.metaDescription) { if (spec.metaDescription.length > 160) throw new Error(`metaDescription too long (${spec.metaDescription.length}): ${slug}`); patch.metaDescription = spec.metaDescription; notes.push('metaDescription'); }
  if (spec.keyTakeaways && !(p.keyTakeaways || []).length) { patch.keyTakeaways = spec.keyTakeaways; notes.push('keyTakeaways'); }
  const body = patch.body || p.body;
  if (spec.close && !body.some((b) => b._key === `seo1008-${slug.slice(0, 20)}`)) {
    const fi = faqIndex(body);
    const blk = closingBlock(spec.close, slug);
    patch.body = fi === -1 ? [...body, blk] : [...body.slice(0, fi), blk, ...body.slice(fi)];
    notes.push('closing links');
  }
  if (notes.length) { patch.updatedAt = NOW; p._patch = patch; p._why = [p._why, ...notes].filter(Boolean).join(' + '); }
}

let docs = 0;
for (const p of posts) if (p._patch) { docs++; const { body, ...rest } = p; await save({ _id: p._id, slug: p.slug, full: APPLY ? await client.getDocument(p._id) : null }, p._patch, p._why); }
console.log(`\n${APPLY ? 'Patched' : 'Would patch'} ${docs} posts; ${linkEdits} link rewrites.`);
