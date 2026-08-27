#!/usr/bin/env node
/**
 * Create the "lead_ack" WhatsApp template — the message the LEAD receives, within
 * seconds of submitting a form. Distinct from `new_lead_alert`, which goes to us.
 *
 * Deliberately written to stay in the UTILITY category, not MARKETING:
 *  - it refers to the specific action the person just took (their enquiry),
 *  - the tone is neutral and functional, and
 *  - there is no offer, no price, no "book now" and no promotional button.
 * Any of those flips Meta's classifier to MARKETING, which costs more per message
 * and is capped per person. See Meta's template categorization guidance.
 *
 * It also carries an explicit opt-out, which WhatsApp policy expects.
 *
 * NOTE: approval alone does NOT make it legal to send. The lead form must first
 * carry a consent checkbox naming WhatsApp. See docs/RUNBOOK-meta-lead-nudge.md.
 *
 * Usage: node scripts/meta/create-nudge-template.js
 */
const { loadEnv, appSecretProof } = require('./lib');

const TEMPLATE = {
  name: 'lead_ack',
  language: 'en',
  category: 'UTILITY',
  components: [
    {
      type: 'BODY',
      text:
        'Hi {{1}}, this is Chronexa.\n\n'
        + 'We have received your enquiry about {{2}} and someone from our team will call you on this '
        + 'number shortly.\n\n'
        + 'If a different time suits you better, just reply here and tell us when.\n\n'
        + 'Reply STOP if you would rather we did not message you.',
      example: { body_text: [['Rahul', 'a Shopify store build']] },
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
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEMPLATE),
  });
  const json = await res.json();
  if (json.error) {
    console.log('not created:', json.error.error_user_msg || json.error.message);
  } else {
    console.log(`created id=${json.id} status=${json.status} category=${json.category}`);
    if (json.category !== 'UTILITY') {
      console.log('WARNING: Meta classified this as ' + json.category + ', not UTILITY — it will cost more per message.');
    }
  }
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
