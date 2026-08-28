/**
 * Meta Instant Forms were each built by hand in Ads Manager, so the same question
 * carries a different field key on every form ("what's_your_current_team_size?" on
 * the August form, "how_many_employees_does_your_business_have?" on the July one).
 * Exporting them raw would produce a sheet with 19 sparse columns.
 *
 * This maps every observed variant onto one canonical column set, so the sheet has
 * a stable shape no matter which form a lead came through. Unknown keys are not
 * dropped — they land in `extra` so a new question never silently disappears.
 */

const FIELD_MAP = {
  full_name: 'name',
  phone_number: 'phone',
  phone: 'phone',
  email: 'email',
  company_name: 'company',
  website: 'website',

  'which_best_describes_your_business?': 'business_type',
  'what_type_of_business_do_you_run?': 'business_type',
  'are_you:': 'business_type',

  "what's_your_current_team_size?": 'team_size',
  'how_many_employees_does_your_business_have?': 'team_size',
  'how_many_people_are_in_your_practice?': 'team_size',

  'which_area_would_you_like_to_automate_first?': 'automate_area',
  'which_area_do_you_want_to_automate?': 'automate_area',

  "what's_your_biggest_operational_challenge_right_now?": 'biggest_challenge',
  "what's_your_biggest_challenge?": 'biggest_challenge',

  'what_is_your_approximate_budget?': 'budget',
  'when_are_you_planning_to_implement_automation?': 'timeline',
  'what_are_you_looking_for?': 'looking_for',
  'do_you_already_sell_products?': 'sells_online',
  'do_you_already_sell_products_online?': 'sells_online',
  'do_you_have_an_existing_e-commerce_store?': 'sells_online',

  // The Shopify forms ask about products rather than "what do you want to automate",
  // so without this every Shopify lead's alert read "Wants help with: Not stated".
  'what_products_are_you_looking_to_sell_on_shopify': 'looking_for',
  'what_products_are_you_looking_to_sell_on_shopify?': 'looking_for',
};

/** Column order for every tab in the workbook. Keep in sync with rowFor(). */
const COLUMNS = [
  'received_ist', 'name', 'phone', 'email', 'company', 'website',
  'business_type', 'team_size', 'automate_area', 'biggest_challenge',
  'budget', 'timeline', 'looking_for', 'sells_online',
  'campaign', 'adset', 'ad', 'platform', 'form_name', 'lead_id', 'extra',
];

/** Meta returns Indian mobiles variously as "+919876543210", "p:+91...", "9876543210". */
function normalisePhone(raw) {
  if (!raw) return '';
  let v = String(raw).replace(/^p:/i, '').replace(/[^\d+]/g, '');
  if (!v.startsWith('+')) {
    if (v.length === 10) v = '+91' + v;
    else if (v.length > 10) v = '+' + v;
  }
  return v;
}

const IST = 'Asia/Kolkata';
function toIst(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  // "2026-08-17 11:29" — sortable, and the timezone the team actually calls in.
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d).reduce((a, x) => (a[x.type] = x.value, a), {});
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

/** Turn one raw Graph lead object into a flat canonical record. */
function normaliseLead(lead, formName = '') {
  const rec = { received_ist: toIst(lead.created_time), lead_id: lead.id || '', form_name: formName };
  const extra = [];
  for (const f of lead.field_data || []) {
    const value = (f.values || []).join(', ').trim();
    if (!value) continue;
    const key = FIELD_MAP[f.name];
    if (key) rec[key] = key === 'phone' ? normalisePhone(value) : value;
    else extra.push(`${f.name}: ${value}`);
  }
  rec.extra = extra.join(' | ');
  rec.campaign = lead.campaign_name || '';
  rec.adset = lead.adset_name || '';
  rec.ad = lead.ad_name || '';
  rec.platform = lead.platform === 'ig' ? 'Instagram' : lead.platform === 'fb' ? 'Facebook' : (lead.platform || '');
  return rec;
}

const rowFor = (rec) => COLUMNS.map((c) => rec[c] ?? '');

/** Google Sheets tab titles cannot contain : \ / ? * [ ] and cap at 100 chars. */
const safeTabName = (name) => (name || 'Unknown').replace(/[:\\/?*[\]]/g, '-').slice(0, 90).trim() || 'Unknown';

module.exports = { FIELD_MAP, COLUMNS, normaliseLead, normalisePhone, toIst, rowFor, safeTabName };
