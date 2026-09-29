import { NextResponse } from 'next/server';
import { sendLeadEvent } from '../../../lib/meta-capi';

/**
 * Lead capture endpoint. Every form submit is written to Baserow's "Website
 * Leads" table (system of record + quick-access grid) and mirrored to a Google
 * Sheet. Submissions with `source: 'startup-hero-form'` additionally land in a
 * second, dedicated Google Sheet with richer columns (company size, comments)
 * instead of folding those fields into the generic mirror. Each destination
 * writes independently in its own try/catch, so one failing never blocks
 * another or the client's booking handoff. Optionally also mirrors the full
 * payload to CONTACT_WEBHOOK_URL if set (e.g. an n8n fan-out).
 */
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const source0 = String(data.source || 'website');
  const phone0 = String(data.phone || '').trim();
  // Both the UK and India duplicates of the Shopify landing page (2026-09-24)
  // share this same qualifier/gating logic — only the source string (and
  // therefore the Baserow/Sheets "Source" label) tells them apart.
  const isShopifyLanding = (s: string) => s === 'shopify-store-landing' || s === 'shopify-store-landing-india';
  // Email is required for every source EXCEPT the Shopify landing page, which
  // needs a phone instead. 2026-09-28: the Shopify form dropped email (and every
  // other non-essential field) after Amplitude showed 21 form starts → 5 sends
  // on the 6-required-field version; name + phone + budget is enough to call back.
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const emailOk = isShopifyLanding(source0) ? (!email || validEmail) : validEmail;
  if (!name || !emailOk || (isShopifyLanding(source0) && !phone0)) {
    return NextResponse.json({ ok: false, error: isShopifyLanding(source0) ? 'Name and phone are required.' : 'Name and a valid email are required.' }, { status: 422 });
  }

  const company = String(data.company || '').trim();
  const companySize = String(data.companySize || '').trim();
  const comments = String(data.comments || '').trim();
  const phone = String(data.phone || '').trim();
  const source = String(data.source || 'website');
  const submittedAt = new Date().toISOString();
  // Dedup key shared with the browser pixel's fbq eventID (when the caller sends
  // one) so Meta merges the two into one Lead instead of counting it twice. Falls
  // back to a server-generated id for sources that don't send their own yet.
  const eventId = String(data.eventId || '').trim() || `lead-${source}-${submittedAt}`;

  // --- Shopify e-commerce landing page — structured qualifier fields -------
  // The Meta-ads e-commerce funnel (docs/strategy/meta-ecommerce-ads-playbook.md).
  // A landing page instead of a Meta Instant Form, on purpose: past Instant-Form
  // leads had an 81% no-pickup rate. These fields are the qualifier, and
  // `qualified` is the gate the follow-up SOP and the Meta feedback loop key off.
  const shop = isShopifyLanding(source)
    ? {
        storeUrl: String(data.storeUrl || '').trim(),
        sellsOnline: String(data.sellsOnline || '').trim(), // the lead's own words, e.g. "Instagram DMs", "I already have a store" — optional since the 2026-09-16 single-step form
        sells: String(data.sells || '').trim(), // optional since the 2026-09-16 single-step form
        // monthlyOrders/photosReady: dropped from the form 2026-09-16 — they gated nothing
        // and were the proven cause of the old 2-step form's Step 2 drop-off. Left here,
        // always empty now, so an older client or a different source can still send them.
        monthlyOrders: String(data.monthlyOrders || '').trim(),
        // USD bands (global page, since 2026-09-24; GBP before) or lakh bands (India page) —
        // whichever this source's form sends. Legacy INR bands (under-15k /
        // 15-40k / 40-75k / 75k+ / 25-50k / 50k+) kept accepted below — old
        // paused campaigns/ads can still post them.
        budget: String(data.budget || '').trim(),
        photosReady: String(data.photosReady || '').trim(),
        waConsent: data.waConsent === true || data.waConsent === 'true',
      }
    : null;
  // Initial fit = a budget band that clears the "not a ₹5,000-freelancer" bar for
  // this offer. 2026-09-28: store URL is now OPTIONAL on the form, so it no longer
  // gates `qualified` (it used to auto-fail "no URL") — budget alone decides.
  // Preserve legacy INR bands for anything still using them; human qualification
  // remains the final word in Sheets either way.
  const shopQualified = !!shop
    && ([
      // USD — global (US/EU) page, 2026-09-24
      '3000-6000usd', '6000-12000usd', '12000usd+',
      // GBP — global page before 2026-09-24; kept for any old form still posting them
      '2500-5000gbp', '5000-10000gbp', '10000gbp+',
      // INR bands — India page (2026-09-25; lowest band 'under-20k-inr' excluded)
      '20-50k-inr', '50k-1lakh-inr', '1lakh+-inr',
      // INR lakh bands — India page 2026-09-24 only, kept so nothing silently breaks
      '1-3lakh', '3-7lakh', '7lakh+',
      // INR — legacy, kept so nothing silently breaks
      '15-40k', '40-75k', '75k+', '25-50k', '50k+',
    ].includes(shop.budget));

  const usecaseRaw = String(data.usecase || '').trim();
  // When a caller sends structured fields instead of a pre-built usecase string,
  // compose one here so Baserow's existing free-text "What to automate" column
  // keeps working unchanged.
  const usecase = usecaseRaw
    || (shop
      ? `Shopify lead — ${shopQualified ? 'QUALIFIED' : 'unqualified'} | Store: ${shop.storeUrl || 'none'} `
        + `| Sells: ${shop.sells || 'n/a'} (${shop.sellsOnline || 'n/a'}) | Orders/mo: ${shop.monthlyOrders || 'n/a'} `
        + `| Budget: ${shop.budget || 'n/a'} | Photos: ${shop.photosReady || 'n/a'} | WA consent: ${shop.waConsent ? 'yes' : 'no'}`
      : (companySize || comments
        ? `Company size: ${companySize || 'n/a'} | Comments: ${comments || 'n/a'}`
        : ''));
  // Structured calculator payload (inputs/results) — forwarded to the webhook
  // fan-out only, so the breakdown-email workflow gets machine-readable data.
  // Baserow/Sheets schemas stay untouched.
  const meta = data.meta && typeof data.meta === 'object' && !Array.isArray(data.meta)
    ? (data.meta as Record<string, unknown>)
    : undefined;

  // Meta click cookies — read once here so they can be stored alongside the lead
  // (needed later to attribute the QualifiedLead / BookedCall / Purchase events
  // back to the original ad click) as well as sent with the immediate CAPI Lead.
  const cookieHeader = req.headers.get('cookie') || '';
  const cookieValue = (key: string) => {
    const m = cookieHeader.match(new RegExp('(?:^|;\\s*)' + key + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  };
  const fbp = cookieValue('_fbp');
  const fbc = cookieValue('_fbc');

  // Every destination below is independent of the others (none reads another's
  // result), so they run concurrently via Promise.all instead of one after
  // another — sequential awaits here were adding up to several real seconds
  // of "Sending…" on the client for no reason. Each function still swallows
  // its own errors, so one slow/failing destination never blocks the rest or
  // delays the response beyond the slowest single call.

  // --- Baserow (Website Leads table) — best-effort -------------------------
  async function writeBaserow() {
    const baseHost = process.env.BASEROW_HOST || 'https://api.baserow.io';
    const tableId = process.env.BASEROW_LEADS_TABLE_ID;
    const baserowToken = process.env.BASEROW_LEADS_TOKEN || process.env.BASEROW_API_KEY;
    if (!tableId || !baserowToken) {
      console.warn('[contact] Baserow not configured — lead not stored:', email);
      return;
    }
    try {
      const res = await fetch(`${baseHost}/api/database/rows/table/${tableId}/?user_field_names=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${baserowToken}` },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Company: company,
          'What to automate': usecase,
          Source: source,
          'Submitted At': submittedAt,
        }),
      });
      if (!res.ok) console.error('[contact] Baserow write failed:', res.status, (await res.text()).slice(0, 200));
    } catch (e) {
      console.error('[contact] Baserow write error:', e);
    }
  }

  // --- Google Sheets (quick-access mirror + dedicated per-vertical sheets) --
  // All three destinations share one OAuth token exchange; each append is its
  // own independent try/catch so one failing never blocks the other.
  async function writeSheets() {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const startupSheetId = process.env.STARTUP_LEAD_SHEET_ID;
    const startupSheetTab = process.env.STARTUP_LEAD_SHEET_TAB || 'Leads';
    // Dedicated sheet for the /n8n-ai-automation-startups Meta-ads form. Its form posts
    // source 'n8n-startup-landing' (NOT 'startup-hero-form'), so it needs its own routing
    // rule — the two startup pages feed two different sheets on purpose.
    const n8nSheetId = process.env.N8N_LEAD_SHEET_ID;
    const n8nSheetTab = process.env.N8N_LEAD_SHEET_TAB || 'Sheet1';
    const gClientId = process.env.GSC_CLIENT_ID;
    const gSecret = process.env.GSC_CLIENT_SECRET;
    const gRefresh = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    if (!(sheetId || startupSheetId || n8nSheetId) || !gClientId || !gSecret || !gRefresh) return;
    try {
      const tokRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: gClientId, client_secret: gSecret, refresh_token: gRefresh, grant_type: 'refresh_token' }),
      });
      const tok = await tokRes.json();
      if (!tok.access_token) {
        console.error('[contact] Google token refresh failed:', JSON.stringify(tok).slice(0, 200));
        return;
      }
      const writes: Promise<unknown>[] = [];
      if (sheetId) {
        writes.push((async () => {
          try {
            const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Leads!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
            const res = await fetch(appendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok.access_token}` },
              body: JSON.stringify({ values: [[submittedAt, name, email, company, usecase, source]] }),
            });
            if (!res.ok) console.error('[contact] Sheets append failed:', res.status, (await res.text()).slice(0, 200));
          } catch (e) {
            console.error('[contact] Sheets write error:', e);
          }
        })());
      }
      // Dedicated sheet for the startup-vertical hero form only — richer,
      // structured columns (company size + comments kept separate, not
      // folded into one free-text field like the generic mirror above).
      if (startupSheetId && source === 'startup-hero-form') {
        writes.push((async () => {
          try {
            const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${startupSheetId}/values/${encodeURIComponent(startupSheetTab)}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
            const res = await fetch(appendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok.access_token}` },
              body: JSON.stringify({ values: [[submittedAt, name, email, company, companySize, comments, source]] }),
            });
            if (!res.ok) console.error('[contact] Startup-lead sheet append failed:', res.status, (await res.text()).slice(0, 200));
          } catch (e) {
            console.error('[contact] Startup-lead sheet write error:', e);
          }
        })());
      }
      // Dedicated sheet for the n8n Meta-ads landing page only.
      if (n8nSheetId && source === 'n8n-startup-landing') {
        writes.push((async () => {
          try {
            const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${n8nSheetId}/values/${encodeURIComponent(n8nSheetTab)}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
            const res = await fetch(appendUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok.access_token}` },
              body: JSON.stringify({ values: [[submittedAt, name, email, company, companySize, comments, source]] }),
            });
            if (!res.ok) console.error('[contact] n8n-lead sheet append failed:', res.status, (await res.text()).slice(0, 200));
          } catch (e) {
            console.error('[contact] n8n-lead sheet write error:', e);
          }
        })());
      }
      await Promise.all(writes);
    } catch (e) {
      console.error('[contact] Sheets token exchange error:', e);
    }
  }

  // --- Meta Conversions API ------------------------------------------------
  // Reports the lead to Meta server-side. The browser pixel misses most of these
  // (only one page fires an fbq Lead event, and iOS blocks a large share of what
  // does fire), which leaves Meta optimising on a fraction of real enquiries.
  // Best-effort: never allowed to fail the submission.
  async function sendCapi() {
    try {
      const hdrs = req.headers;
      await sendLeadEvent({
        email,
        name,
        phone: phone || undefined,
        sourceUrl: hdrs.get('referer') || undefined,
        fbp: fbp || undefined,
        fbc: fbc || undefined,
        // The first entry of x-forwarded-for is the real client on Vercel.
        clientIp: (hdrs.get('x-forwarded-for') || '').split(',')[0].trim() || undefined,
        userAgent: hdrs.get('user-agent') || undefined,
        eventId,
        // Source-aware: both Shopify landing forms (UK and India) already send
        // a fully-coded international number (see ShopifyStorePage.tsx's
        // countryCode field), so neither gets a default here. Every other
        // source still sends a bare local number and expects the old
        // assume-India behaviour.
        defaultCountryCode: isShopifyLanding(source) ? undefined : '91',
      });
    } catch (e) {
      console.error('[contact] Meta CAPI error:', e);
    }
  }

  // --- Shopify e-commerce landing page → its own n8n workflow -------------
  // Reuses the existing "Shopify Landing — Lead Capture" workflow (rRtLi2ojJDk0wfY6),
  // which owns the leads Google Sheet, the team alert and (soon) the WhatsApp
  // teardown + the QualifiedLead/BookedCall feedback events to Meta. We send it
  // the full qualifier payload plus our computed `qualified` gate and the Meta
  // click cookies. Best-effort — a failure here never blocks the visitor.
  async function sendShopifyWebhook() {
    if (!shop) return;
    const shopHook = process.env.SHOPIFY_LEAD_WEBHOOK_URL
      || 'https://n8n.chronexa.io/webhook/shopify-landing-lead';
    try {
      await fetch(shopHook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email,
          businessName: company,
          storeUrl: shop.storeUrl,
          sellsOnline: shop.sellsOnline,
          sells: shop.sells,
          monthlyOrders: shop.monthlyOrders,
          budget: shop.budget,
          photosReady: shop.photosReady,
          waConsent: shop.waConsent,
          qualified: shopQualified,
          fbp, fbc,
          pageUrl: String(data.pageUrl || ''),
          submittedAt,
          source: 'Meta Ads — Shopify Landing Page',
        }),
      });
    } catch (e) {
      console.error('[contact] Shopify n8n webhook failed:', e);
    }
  }

  // --- Optional mirror to an n8n / external webhook ------------------------
  async function sendWebhookMirror() {
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) return;
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, company, usecase, source, submittedAt,
          ...(companySize ? { companySize } : {}),
          ...(comments ? { comments } : {}),
          ...(meta ? { meta } : {}),
          ...(shop ? { shop: { ...shop, qualified: shopQualified }, fbp, fbc, pageUrl: String(data.pageUrl || '') } : {}),
        }),
      });
    } catch (e) {
      console.error('[contact] webhook mirror failed:', e);
    }
  }

  await Promise.all([writeBaserow(), writeSheets(), sendCapi(), sendShopifyWebhook(), sendWebhookMirror()]);

  // The Shopify landing page needs the verdict back so it can show the calendar
  // to a qualified lead or a "we'll be in touch" message to everyone else.
  return NextResponse.json(shop ? { ok: true, qualified: shopQualified } : { ok: true });
}
