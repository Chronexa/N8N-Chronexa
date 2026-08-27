#!/usr/bin/env node
/**
 * Create the "new_lead_alert" WhatsApp template.
 *
 * WhatsApp will not let a business message a person out of the blue — outside a
 * 24-hour reply window every message must use a template Meta has pre-approved.
 * Our alert fires at any hour, so it has to be a template. Category UTILITY,
 * because this is an operational notification to our own staff, not marketing.
 *
 * Templates live per WhatsApp Business Account, so this creates it on every WABA
 * we might send from (the sandbox test number today, the real Chronexa number
 * once it is registered) — the workflow then does not change when we switch.
 *
 * Usage: node scripts/meta/create-wa-template.js
 */
const { loadEnv, appSecretProof } = require('./lib');

const WABAS = [
  // The live account: +91 62303 35489, registered on the Cloud API 2026-08-21.
  { id: '1048752737749493', label: 'Chronexa (+91 62303 35489) — LIVE' },
  { id: '1734957230960369', label: 'Test WABA (sandbox number)' },
];

const TEMPLATE = {
  name: 'new_lead_alert',
  language: 'en',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      // Enough fixed text that Meta does not reject it as "variables only".
      text:
        'New lead just came in from the {{1}} campaign.\n\n'
        + 'Name: {{2}}\n'
        + 'Phone: {{3}}\n'
        + 'Business: {{4}}\n'
        + 'Wants help with: {{5}}\n\n'
        + 'The full record is in the Meta Leads sheet. Please call them back as soon as you can.',
      example: {
        body_text: [[
          'IN | AI Automation | Lead Gen',
          'Rahul Sharma',
          '+91 98765 43210',
          'Manufacturing, 2-5 employees',
          'Lead management and WhatsApp follow-ups',
        ]],
      },
    },
  ],
};

(async () => {
  const env = loadEnv();
  const token = env.META_ACCESS_TOKEN;
  const proof = appSecretProof(token, env.META_APP_SECRET);

  for (const waba of WABAS) {
    const url = `https://graph.facebook.com/v23.0/${waba.id}/message_templates`
      + `?access_token=${encodeURIComponent(token)}&appsecret_proof=${proof}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEMPLATE),
    });
    const json = await res.json();
    if (json.error) {
      // A template that already exists is not a failure worth stopping for.
      console.log(`${waba.label}: ${json.error.error_user_msg || json.error.message}`);
    } else {
      console.log(`${waba.label}: created id=${json.id} status=${json.status} category=${json.category}`);
    }
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
