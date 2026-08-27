#!/usr/bin/env node
/**
 * Create the "daily_ads_report" WhatsApp template — one message each morning to the
 * founders with yesterday's ad numbers.
 *
 * Kept factual and free of any call to action so Meta classifies it UTILITY rather
 * than MARKETING; marketing templates cost more and are rate-limited per recipient,
 * which would be a silly constraint on an internal report.
 *
 * Usage: node scripts/meta/create-report-template.js
 */
const { loadEnv, appSecretProof } = require('./lib');

const TEMPLATE = {
  name: 'daily_ads_report',
  language: 'en',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text:
        'Chronexa ads report for {{1}}.\n\n'
        + 'Spend: {{2}}\n'
        + 'Leads: {{3}}\n'
        + 'Cost per lead: {{4}}\n\n'
        + 'Best performing campaign: {{5}}\n\n'
        + 'Yesterday against the previous day: {{6}}\n\n'
        + 'Full lead list is in the Meta Leads sheet.',
      example: {
        body_text: [[
          '25 August 2026', 'Rs 400', '3', 'Rs 133',
          'Shopify Leads Campaign', 'spend up 4%, leads down 1',
        ]],
      },
    },
  ],
};

(async () => {
  const env = loadEnv();
  const token = env.META_ACCESS_TOKEN;
  const proof = appSecretProof(token, env.META_APP_SECRET);
  const url = `https://graph.facebook.com/${env.META_API_VERSION || 'v23.0'}/${env.WA_WABA_ID}/message_templates`
    + `?access_token=${encodeURIComponent(token)}&appsecret_proof=${proof}`;
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(TEMPLATE),
  });
  const json = await res.json();
  if (json.error) console.log('not created:', json.error.error_user_msg || json.error.message);
  else console.log(`created id=${json.id} status=${json.status} category=${json.category}`);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
