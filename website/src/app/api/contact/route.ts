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
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Name and a valid email are required.' }, { status: 422 });
  }

  const company = String(data.company || '').trim();
  const companySize = String(data.companySize || '').trim();
  const comments = String(data.comments || '').trim();
  const usecaseRaw = String(data.usecase || '').trim();
  // When a caller sends companySize/comments instead of a pre-built usecase
  // string (e.g. the startup hero form), compose one here so Baserow's
  // existing free-text "What to automate" column keeps working unchanged.
  const usecase = usecaseRaw || (companySize || comments
    ? `Company size: ${companySize || 'n/a'} | Comments: ${comments || 'n/a'}`
    : '');
  const source = String(data.source || 'website');
  const submittedAt = new Date().toISOString();
  // Structured calculator payload (inputs/results) — forwarded to the webhook
  // fan-out only, so the breakdown-email workflow gets machine-readable data.
  // Baserow/Sheets schemas stay untouched.
  const meta = data.meta && typeof data.meta === 'object' && !Array.isArray(data.meta)
    ? (data.meta as Record<string, unknown>)
    : undefined;

  // --- Baserow (Website Leads table) — best-effort -------------------------
  const baseHost = process.env.BASEROW_HOST || 'https://api.baserow.io';
  const tableId = process.env.BASEROW_LEADS_TABLE_ID;
  const baserowToken = process.env.BASEROW_LEADS_TOKEN || process.env.BASEROW_API_KEY;
  if (tableId && baserowToken) {
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
  } else {
    console.warn('[contact] Baserow not configured — lead not stored:', email);
  }

  // --- Google Sheets (quick-access mirror + dedicated per-vertical sheets) --
  // Both destinations share one OAuth token exchange; each append is its own
  // independent try/catch so one failing never blocks the other.
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
  if ((sheetId || startupSheetId || n8nSheetId) && gClientId && gSecret && gRefresh) {
    try {
      const tokRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ client_id: gClientId, client_secret: gSecret, refresh_token: gRefresh, grant_type: 'refresh_token' }),
      });
      const tok = await tokRes.json();
      if (tok.access_token) {
        if (sheetId) {
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
        }
        // Dedicated sheet for the startup-vertical hero form only — richer,
        // structured columns (company size + comments kept separate, not
        // folded into one free-text field like the generic mirror above).
        if (startupSheetId && source === 'startup-hero-form') {
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
        }
        // Dedicated sheet for the n8n Meta-ads landing page only.
        if (n8nSheetId && source === 'n8n-startup-landing') {
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
        }
      } else {
        console.error('[contact] Google token refresh failed:', JSON.stringify(tok).slice(0, 200));
      }
    } catch (e) {
      console.error('[contact] Sheets token exchange error:', e);
    }
  }

  // --- Meta Conversions API ------------------------------------------------
  // Reports the lead to Meta server-side. The browser pixel misses most of these
  // (only one page fires an fbq Lead event, and iOS blocks a large share of what
  // does fire), which leaves Meta optimising on a fraction of real enquiries.
  // Best-effort: never allowed to fail the submission.
  try {
    const hdrs = req.headers;
    const cookieHeader = hdrs.get('cookie') || '';
    const cookieValue = (key: string) => {
      const m = cookieHeader.match(new RegExp('(?:^|;\\s*)' + key + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : undefined;
    };
    await sendLeadEvent({
      email,
      name,
      phone: String(data.phone || '').trim() || undefined,
      sourceUrl: hdrs.get('referer') || undefined,
      fbp: cookieValue('_fbp'),
      fbc: cookieValue('_fbc'),
      // The first entry of x-forwarded-for is the real client on Vercel.
      clientIp: (hdrs.get('x-forwarded-for') || '').split(',')[0].trim() || undefined,
      userAgent: hdrs.get('user-agent') || undefined,
      eventId: `lead-${source}-${submittedAt}`,
    });
  } catch (e) {
    console.error('[contact] Meta CAPI error:', e);
  }

  // --- Optional mirror to an n8n / external webhook ------------------------
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, company, usecase, source, submittedAt,
          ...(companySize ? { companySize } : {}),
          ...(comments ? { comments } : {}),
          ...(meta ? { meta } : {}),
        }),
      });
    } catch (e) {
      console.error('[contact] webhook mirror failed:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
