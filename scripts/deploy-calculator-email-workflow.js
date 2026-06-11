/**
 * Deploys the "Calculator Breakdown Emails" workflow to n8n.
 *
 * One workflow serves ALL website calculators: chronexa.io/api/contact mirrors
 * every lead to CONTACT_WEBHOOK_URL; this workflow filters to known calculator
 * source tags, renders the visitor's own inputs/results (from `meta`) into a
 * branded breakdown email, and sends it via the existing Gmail credential.
 * Unknown sources produce no email (Code node returns []), so ordinary contact
 * leads pass through harmlessly.
 *
 * Usage: node scripts/deploy-calculator-email-workflow.js
 */
require('dotenv').config({ path: __dirname + '/../.env', quiet: true });

const url = process.env.N8N_API_URL;
const apiKey = process.env.N8N_API_KEY;
if (!url || !apiKey) {
  console.error('N8N_API_URL / N8N_API_KEY missing from .env — aborting.');
  process.exit(1);
}

const WORKFLOW_NAME = 'Calculator Breakdown Emails';
const GMAIL_CREDENTIAL = { id: 'nxOI4IM5ms6uacu7', name: 'founder@mail.chronexa Gmail account' };
const ERROR_WORKFLOW = 'MKBhIfmRNZtPDJg0';

// ---------------------------------------------------------------------------
// Code-node source: builds {email, subject, html} per calculator, or [] to skip.
// ---------------------------------------------------------------------------
const jsCode = `
const lead = $input.first().json.body || {};
const SITE = 'https://chronexa.io';
const BOOK = 'https://cal.com/chronexa/30min';
const GREEN = '#67B035';
const INK = '#1A1A17';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const meta = lead.meta || {};
const inputs = meta.inputs || {};
const results = meta.results || {};
const cur = meta.currency === 'INR' ? '₹' : '$';
const firstName = esc((lead.name || '').trim().split(/\\s+/)[0] || 'there');

function row(label, value) {
  return '<tr><td style="padding:6px 14px 6px 0;color:#6B6862;font-size:14px;">' + esc(label) + '</td>' +
         '<td style="padding:6px 0;color:' + INK + ';font-size:14px;font-weight:600;text-align:right;">' + esc(value) + '</td></tr>';
}

function link(label, href) {
  return '<p style="margin:6px 0;"><a href="' + href + '" style="color:#2F6B3A;font-weight:600;">' + esc(label) + ' →</a></p>';
}

const templates = {
  'billing-leakage-calculator': () => ({
    subject: 'Your billing-leakage breakdown: ' + (results.leakageFmt || 'your estimate') + '/yr — and the fix',
    headline: results.leakageFmt || '—',
    headlineLabel: 'estimated revenue leaking from your firm annually',
    rows: [
      row('Fee-earning lawyers', inputs.lawyers),
      row('Average billable rate', cur + Number(inputs.rate || 0).toLocaleString() + '/hr'),
      row('Billable hours per lawyer per day', inputs.hoursPerDay + ' h'),
      row('Conservatively recoverable per year', results.recoverableFmt || '—'),
      row('Hours lost per lawyer per week', (results.hoursLostPerLawyerPerWeek || '—') + ' h'),
    ].join(''),
    formula: 'potential = lawyers × rate × hours/day × 250 days\\nleakage = potential × 26% (industry benchmark)\\nrecoverable = leakage × 50% (conservative)',
    fixIntro: 'Billing capture is one of four operational gaps between the AI your firm already owns and the workflows where revenue is made. The fix, in order:',
    links: [
      link('Automated time capture — the workflow that closes this leak', SITE + '/law-firm-automated-time-capture'),
      link('The Four Operational Intelligence Gaps framework', SITE + '/ai-engines/legal-regulatory-engine'),
      link('Re-run the calculator with different assumptions', SITE + '/law-firm-billing-leakage-calculator'),
    ].join(''),
  }),
  'cpa-capacity-calculator': () => ({
    subject: 'Your tax-season capacity breakdown: ' + (results.capacityRevenueFmt || 'your estimate') + ' — without hiring',
    headline: results.capacityRevenueFmt || '—',
    headlineLabel: 'added capacity revenue your current team could produce next season',
    rows: [
      row('Preparers on staff', inputs.preparers),
      row('Returns filed per season', Number(inputs.returnsPerSeason || 0).toLocaleString()),
      row('Average prep hours per return', inputs.prepHoursPerReturn + ' h'),
      row('Average fee per return', cur + Number(inputs.feePerReturn || 0).toLocaleString()),
      row('Returns added (conservative 30%)', '+' + (results.addedReturns || '—')),
      row('Staff prep hours freed per season', Number(results.hoursFreed || 0).toLocaleString() + ' h'),
    ].join(''),
    formula: 'hours freed = returns × prep hours × 40% (published benchmark)\\nadded returns = returns × 30% (conservative; benchmark is 3×)\\ncapacity revenue = added returns × average fee',
    fixIntro: 'The 40% comes from automating intake, classification, extraction and return pre-fill on the tax software you already run:',
    links: [
      link('CPA tax document automation — the service', SITE + '/cpa-tax-document-automation'),
      link('The CPA & Tax Engine — watch the pipeline run', SITE + '/ai-engines/cpa-tax-engine'),
      link('Built on UltraTax, CCH Axcess, Drake, Lacerte, ProConnect', SITE + '/tax-software-ai-integration'),
    ].join(''),
  }),
  'document-processing-cost-calculator': () => ({
    subject: 'Your document-processing cost: ' + (results.annualCostFmt || 'your estimate') + '/yr — and the 40–60% fix',
    headline: results.annualCostFmt || '—',
    headlineLabel: 'what manual document handling costs you annually',
    rows: [
      row('Documents handled per month', Number(inputs.docsPerMonth || 0).toLocaleString()),
      row('Handling minutes per document', inputs.minutesPerDoc + ' min'),
      row('Loaded hourly staff cost', cur + Number(inputs.hourlyCost || 0).toLocaleString() + '/hr'),
      row('Annual saving at the 50% midpoint', results.savingsMidFmt || '—'),
      row('Staff hours freed per month', Number(results.hoursFreedMonthly || 0).toLocaleString() + ' h'),
    ].join(''),
    formula: 'annual cost = docs/month × 12 × minutes/doc ÷ 60 × hourly cost\\nsavings = annual cost × 40–60% (midpoint 50%)',
    fixIntro: 'The 40–60% comes from automated intake, field extraction with per-field confidence scoring, and system write-back — humans review only flagged items:',
    links: [
      link('Document processing automation — the service', SITE + '/document-processing-automation'),
      link('The Document Intelligence Engine — the 14-days-to-4-hours pipeline', SITE + '/ai-engines/document-intelligence-engine'),
      link('Invoice & AP automation for finance teams', SITE + '/finance-automation'),
    ].join(''),
  }),
};

const build = templates[lead.source];
if (!build || !lead.email) { return []; }
const t = build();

const html =
  '<div style="background:#F3F1EA;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">' +
  '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid rgba(26,24,20,0.12);">' +
  '<div style="background:#0E0F0D;padding:18px 28px;"><span style="color:#FBFAF7;font-size:18px;font-weight:700;">Chronexa</span></div>' +
  '<div style="padding:28px;">' +
  '<p style="color:' + INK + ';font-size:15px;margin:0 0 18px;">Hi ' + firstName + ' — here is the breakdown you ran on chronexa.io, with the methodology and the fix.</p>' +
  '<p style="margin:0;color:#6B6862;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">' + esc(t.headlineLabel) + '</p>' +
  '<p style="margin:4px 0 18px;color:' + GREEN + ';font-size:40px;font-weight:700;line-height:1.05;">' + esc(t.headline) + '</p>' +
  '<table style="width:100%;border-collapse:collapse;margin-bottom:18px;">' + t.rows + '</table>' +
  '<p style="margin:0 0 6px;color:#6B6862;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">The math, in the open</p>' +
  '<pre style="background:#F3F1EA;border-radius:8px;padding:14px;font-size:12.5px;line-height:1.7;color:' + INK + ';white-space:pre-wrap;margin:0 0 18px;">' + t.formula + '</pre>' +
  '<p style="color:' + INK + ';font-size:14.5px;line-height:1.6;margin:0 0 10px;">' + esc(t.fixIntro) + '</p>' +
  t.links +
  '<a href="' + BOOK + '" style="display:inline-block;margin-top:20px;background:' + GREEN + ';color:#fff;font-weight:600;font-size:15px;padding:12px 22px;border-radius:8px;text-decoration:none;">Book a free 30-minute audit</a>' +
  '<p style="color:#6B6862;font-size:13px;line-height:1.6;margin:22px 0 0;">These numbers are benchmark estimates — the audit maps your real ones. Reply to this email and it lands directly with me.</p>' +
  '<p style="color:' + INK + ';font-size:14px;margin:16px 0 0;">Ankit Dhiman<br/><span style="color:#6B6862;font-size:13px;">Founder, Chronexa · chronexa.io</span></p>' +
  '</div>' +
  '<div style="padding:14px 28px;border-top:1px solid rgba(26,24,20,0.12);"><p style="margin:0;color:#9aa19a;font-size:11.5px;">You received this because you requested your breakdown on chronexa.io.</p></div>' +
  '</div></div>';

return [{ json: { email: lead.email, subject: t.subject, html } }];
`;

// ---------------------------------------------------------------------------
const workflow = {
  name: WORKFLOW_NAME,
  nodes: [
    {
      id: 'calc-webhook-0001',
      name: 'Calculator Lead Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [0, 0],
      parameters: {
        httpMethod: 'POST',
        path: 'calculator-breakdown',
        responseMode: 'onReceived',
        options: {},
      },
    },
    {
      id: 'calc-build-0002',
      name: 'Build Breakdown Email',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [260, 0],
      parameters: { mode: 'runOnceForAllItems', jsCode },
    },
    {
      id: 'calc-send-0003',
      name: 'Send Breakdown',
      type: 'n8n-nodes-base.gmail',
      typeVersion: 2.1,
      position: [520, 0],
      parameters: {
        sendTo: '={{ $json.email }}',
        subject: '={{ $json.subject }}',
        emailType: 'html',
        message: '={{ $json.html }}',
        options: { bccList: 'team@chronexa.io', senderName: 'Ankit from Chronexa', appendAttribution: false },
      },
      credentials: { gmailOAuth2: GMAIL_CREDENTIAL },
      retryOnFail: true,
      maxTries: 3,
      waitBetweenTries: 2000,
    },
  ],
  connections: {
    'Calculator Lead Webhook': { main: [[{ node: 'Build Breakdown Email', type: 'main', index: 0 }]] },
    'Build Breakdown Email': { main: [[{ node: 'Send Breakdown', type: 'main', index: 0 }]] },
  },
  settings: {
    executionOrder: 'v1',
    errorWorkflow: ERROR_WORKFLOW,
  },
};

async function api(method, pathname, body) {
  const res = await fetch(`${url}${pathname}`, {
    method,
    headers: { 'X-N8N-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${pathname} → ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function main() {
  // Idempotent: update if a workflow with this name already exists.
  const { data: existing } = await api('GET', '/workflows?limit=100');
  const found = existing.find((w) => w.name === WORKFLOW_NAME);

  let id;
  if (found) {
    id = found.id;
    await api('PUT', `/workflows/${id}`, workflow); // four-key whitelist body
    console.log(`updated workflow ${id}`);
  } else {
    const created = await api('POST', '/workflows', workflow);
    id = created.id;
    console.log(`created workflow ${id}`);
  }

  await api('POST', `/workflows/${id}/activate`);
  console.log(`activated. Production webhook: ${url.replace('/api/v1', '')}/webhook/calculator-breakdown`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
