import { NextResponse } from 'next/server';

/**
 * Lead capture endpoint. Forwards submissions to the n8n webhook in
 * CONTACT_WEBHOOK_URL (server-only env). If the var isn't set yet, the request
 * still succeeds (so the UI works) but is logged as un-forwarded — no silent
 * data loss, and it goes live the moment you paste the n8n webhook URL.
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

  const lead = {
    name,
    email,
    company: String(data.company || '').trim() || undefined,
    usecase: String(data.usecase || '').trim() || undefined,
    source: String(data.source || 'website'),
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (e) {
      console.error('[contact] webhook forward failed:', e);
      return NextResponse.json({ ok: false, error: 'Could not submit right now. Please email us.' }, { status: 502 });
    }
  } else {
    console.warn('[contact] CONTACT_WEBHOOK_URL not set — lead accepted but not forwarded:', lead.email);
  }

  return NextResponse.json({ ok: true });
}
