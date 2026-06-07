import { NextResponse } from 'next/server';

/**
 * Lead capture endpoint. Every form submit is written to the Baserow "Website
 * Leads" table (system of record + quick-access grid). The visitor is then sent
 * to Cal.com to book (handled client-side), so this is a best-effort record:
 * a Baserow hiccup must never block the booking handoff. Optionally also mirrors
 * to CONTACT_WEBHOOK_URL if set (e.g. an n8n fan-out).
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
  const usecase = String(data.usecase || '').trim();
  const source = String(data.source || 'website');
  const submittedAt = new Date().toISOString();

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

  // --- Optional mirror to an n8n / external webhook ------------------------
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, usecase, source, submittedAt }),
      });
    } catch (e) {
      console.error('[contact] webhook mirror failed:', e);
    }
  }

  return NextResponse.json({ ok: true });
}
