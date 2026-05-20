/**
 * Inject 5 blog pipeline seed records into Baserow table 975683.
 * Fields: Title, Target Keyword, Persona, Thesis, Status = idea_generated.
 * All other fields left empty (not sent).
 */
require('dotenv').config({ path: '.env' });
const https = require('https');

const BASEROW_KEY = process.env.BASEROW_API_KEY;
const TABLE_ID = '975683';

function baserowPost(body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const opts = {
      hostname: 'api.baserow.io',
      path: '/api/database/rows/table/' + TABLE_ID + '/?user_field_names=true',
      method: 'POST',
      headers: {
        'Authorization': 'Token ' + BASEROW_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    };
    let data = '';
    const req = https.request(opts, res => {
      res.on('data', d => data += d);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { resolve({ raw: data.substring(0, 300) }); } });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function baserowGet(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.baserow.io',
      path,
      method: 'GET',
      headers: { 'Authorization': 'Token ' + BASEROW_KEY }
    };
    let data = '';
    const req = https.request(opts, res => {
      res.on('data', d => data += d);
      res.on('end', () => { resolve(JSON.parse(data)); });
    });
    req.on('error', reject);
    req.end();
  });
}

const records = [
  {
    Title: 'n8n Automation for Dubai SMEs: Replace Manual Ops in 30 Days',
    'Target Keyword': 'n8n automation dubai',
    Persona: 'sme_operations',
    Thesis: 'Dubai SMEs are losing 15–20 hours per week to manual operations — invoice chasing, client follow-ups, data entry across disconnected tools. n8n gives Dubai-based small businesses a self-hosted, cost-effective automation layer that replaces Zapier and connects their CRM, accounting (Zoho/Xero), WhatsApp Business, and government portals without expensive enterprise software. This post walks through 5 real automation workflows any Dubai SME can deploy in 30 days.',
    Status: 'idea_generated'
  },
  {
    Title: 'Client Onboarding Automation for UAE Wealth Managers',
    'Target Keyword': 'client onboarding automation uae',
    Persona: 'wealth_management',
    Thesis: 'UAE wealth managers face a dual pressure: ADGM and DFSA compliance requirements demand rigorous KYC/AML documentation, while HNW clients expect a frictionless digital onboarding experience. Manual onboarding takes 5–12 days and costs firms AED 3,000–8,000 per client in staff time. This post shows how UAE-based RIAs and family offices can automate the full onboarding workflow — from DocuSign to CRM to compliance checklist — cutting time to 48 hours and cost by 60%.',
    Status: 'idea_generated'
  },
  {
    Title: 'How GCC Family Offices Are Using AI Agents to Cut Ops Costs by 40%',
    'Target Keyword': 'ai agents gcc family office',
    Persona: 'family_office',
    Thesis: 'GCC family offices managing $50M–$500M AUM are running lean teams of 3–8 people against complex multi-asset, multi-jurisdiction portfolios. AI agents — autonomous workflows that monitor portfolios, generate reports, flag compliance issues, and draft investment memos — are letting these offices punch above their weight without expanding headcount. This post covers 4 real AI agent use cases adopted by GCC family offices in 2025–2026, with measurable cost and time impact.',
    Status: 'idea_generated'
  },
  {
    Title: 'Saudi Arabia VAT Compliance Automation: n8n Workflows for KSA Finance Teams',
    'Target Keyword': 'vat compliance automation saudi arabia',
    Persona: 'finance_ops',
    Thesis: 'ZATCA\'s e-invoicing Phase 2 (Fatoorah) mandates real-time invoice integration with the Saudi tax authority — non-compliance carries fines up to SAR 50,000 per invoice. Most mid-size KSA companies are still manually reconciling VAT across ERP systems, Excel, and the ZATCA portal. This post shows how n8n can automate the full VAT compliance stack: invoice generation, ZATCA API submission, reconciliation, and audit trail — reducing compliance risk and saving finance teams 20+ hours per month.',
    Status: 'idea_generated'
  },
  {
    Title: 'Automate Your Dubai Freezone Company\'s Back Office with n8n',
    'Target Keyword': 'freezone back office automation dubai',
    Persona: 'startup_ops',
    Thesis: 'Dubai freezone companies — DMCC, DIFC, JAFZA — are fast-moving but back-office heavy: visa tracking, trade licence renewals, multi-currency invoicing, and mandatory audit submissions create a constant admin burden for lean founding teams. n8n can connect the freezone portals, accounting software (Xero/QuickBooks), and communication tools into automated workflows that handle 80% of routine back-office tasks without a dedicated ops hire. This post is a practical guide for freezone founders ready to automate.',
    Status: 'idea_generated'
  }
];

async function run() {
  console.log('Inserting', records.length, 'records into Baserow table', TABLE_ID, '...\n');

  const inserted = [];
  for (const record of records) {
    const result = await baserowPost(record);
    if (result.id) {
      inserted.push({ id: result.id, title: result.Title, keyword: result['Target Keyword'] });
      console.log('✓ ID', result.id, '|', result['Target Keyword']);
    } else {
      console.error('✗ FAILED:', JSON.stringify(result).substring(0, 200));
    }
  }

  console.log('\n=== INSERT SUMMARY ===');
  inserted.forEach(r => console.log('  ID', r.id, '— "' + r.title.substring(0, 60) + '"'));

  // Count current idea_generated records
  const count = await baserowGet(
    '/api/database/rows/table/' + TABLE_ID + '/?user_field_names=true&filter__Status__equal=idea_generated&size=1'
  );
  console.log('\nTotal idea_generated records in table:', count.count);
}

run().catch(console.error);
