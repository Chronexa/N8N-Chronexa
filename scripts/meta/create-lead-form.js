#!/usr/bin/env node
/**
 * Create a replacement Shopify lead form that fixes two compliance problems in the
 * live one (form 2246541482798628):
 *
 *  1. No WhatsApp consent. Meta's policy (Feb 2026) requires an affirmative opt-in
 *     that names WhatsApp before a business may message someone there. Without it,
 *     messaging leads risks the number being restricted or banned.
 *  2. The privacy policy link pointed at a Shopify sales page, not a privacy policy.
 *
 * The consent checkbox is deliberately OPTIONAL, not required. Forcing it would make
 * the enquiry conditional on accepting marketing contact, which is poor practice and
 * depresses completion. Instead the nudge workflow reads the answer and only messages
 * people who ticked it.
 *
 * Meta lead forms are immutable once created, so "fixing" a form always means making
 * a new one and swapping it into the ad.
 *
 * Usage: node scripts/meta/create-lead-form.js
 */
const { loadEnv, setEnv, appSecretProof } = require('./lib');

const CONSENT_KEY = 'whatsapp_consent';

// Mirrors the questions on the live form so nothing is lost in the swap.
const QUESTIONS = [
  { type: 'CUSTOM', key: 'do_you_have_an_existing_e-commerce_store?',
    label: 'Do you have an existing e-commerce store?',
    options: [{ key: 'yes', value: 'Yes' }, { key: 'no', value: 'No' }] },
  { type: 'CUSTOM', key: 'what_products_are_you_looking_to_sell_on_shopify',
    label: 'What products are you looking to sell on Shopify' },
  { type: 'FULL_NAME' },
  { type: 'PHONE' },
  { type: 'EMAIL' },
  { type: 'COMPANY_NAME' },
  { type: 'WEBSITE' },
];

(async () => {
  const env = loadEnv();
  const token = env.META_PAGE_TOKEN;
  const proof = appSecretProof(token, env.META_APP_SECRET);
  const V = env.META_API_VERSION || 'v23.0';

  const body = {
    name: `Lead Form Shopify — consent v2 (${new Date().toISOString().slice(0, 10)})`,
    locale: 'en_US',
    questions: JSON.stringify(QUESTIONS),
    privacy_policy: JSON.stringify({
      url: 'https://chronexa.io/privacy',
      link_text: "Chronexa's Privacy Policy",
    }),
    // The opt-in itself. Naming WhatsApp explicitly is the part Meta's policy requires.
    custom_disclaimer: JSON.stringify({
      title: 'How we will contact you',
      body: { text: 'We will use the number you give us to follow up on this enquiry.' },
      checkboxes: [{
        key: CONSENT_KEY,
        text: 'I agree to receive messages from Chronexa on WhatsApp about my enquiry. I can reply STOP at any time.',
        is_required: false,
      }],
    }),
    follow_up_action_url: 'https://chronexa.io/privacy',
  };

  const url = `https://graph.facebook.com/${V}/${env.META_PAGE_ID}/leadgen_forms`
    + `?access_token=${encodeURIComponent(token)}&appsecret_proof=${proof}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) {
    console.error('FAILED:', json.error.error_user_msg || json.error.message);
    process.exit(1);
  }
  setEnv('META_LEAD_FORM_ID_V2', json.id);
  setEnv('META_CONSENT_FIELD_KEY', CONSENT_KEY);
  console.log('created lead form id =', json.id);
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
