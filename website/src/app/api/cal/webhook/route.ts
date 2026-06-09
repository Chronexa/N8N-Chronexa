/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

// Closes the conversion loop: Cal.com posts booking lifecycle events here, and we
// forward them to Amplitude server-side. Keyed by the attendee's email (user_id),
// so a booking merges into the same Amplitude user that filled the form on-site.
//
// Setup: in Cal.com → Settings → Developer → Webhooks, point the subscriber URL at
//   https://chronexa.io/api/cal/webhook
// subscribe to BOOKING_CREATED / CANCELLED / RESCHEDULED, and put the webhook's
// signing secret in the CAL_WEBHOOK_SECRET env var (Vercel). Until that's set, the
// endpoint accepts unverified payloads (logs a warning) so you can test.

const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
const WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET;

// Cal triggerEvent → our Amplitude event name. Covers the booking lifecycle +
// quality signals (meeting actually happened, no-show). Other enabled triggers
// (payments, forms, recordings, OOO) are intentionally ignored — not part of the
// lead→booking KPI funnel for a free-audit call.
const EVENT_MAP: Record<string, string> = {
  BOOKING_CREATED: 'booking_confirmed',
  BOOKING_REQUESTED: 'booking_requested',   // confirmation-required flow
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_RESCHEDULED: 'booking_rescheduled',
  MEETING_ENDED: 'meeting_completed',        // the call actually happened — strongest qualified signal
  BOOKING_NO_SHOW_UPDATED: 'booking_no_show',
};

function verifySignature(raw: string, sig: string | null): boolean {
  if (!WEBHOOK_SECRET) return true; // not configured yet
  if (!sig) return false;
  const digest = crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get('x-cal-signature-256');

  if (!verifySignature(raw, sig)) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }
  if (!WEBHOOK_SECRET) {
    console.warn('[cal-webhook] CAL_WEBHOOK_SECRET not set — accepting unverified payload');
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const trigger: string = body?.triggerEvent;
  const eventType = EVENT_MAP[trigger];
  if (!eventType) return NextResponse.json({ ok: true, ignored: trigger ?? null });
  if (!AMPLITUDE_KEY) return NextResponse.json({ ok: true, note: 'amplitude key missing' });

  const p = body.payload ?? {};
  const attendee = Array.isArray(p.attendees) ? p.attendees[0] : undefined;
  const email = String(attendee?.email ?? '').toLowerCase();
  const start = p.startTime ? new Date(p.startTime).getTime() : undefined;
  const end = p.endTime ? new Date(p.endTime).getTime() : undefined;
  const durationMin = start && end ? Math.round((end - start) / 60000) : undefined;

  const ampEvent = {
    // Email = the merge key with the on-site (form) identity. No email → key by booking uid.
    user_id: email || undefined,
    device_id: email ? undefined : `cal-${p.uid ?? 'unknown'}`,
    event_type: eventType,
    time: Date.now(),
    event_properties: {
      booking_uid: p.uid,
      event_title: p.title,
      event_type_slug: p.type,
      start_time: p.startTime,
      duration_min: durationMin,
      attendee_timezone: attendee?.timeZone,
      reschedule_uid: p.rescheduleUid,
      cancellation_reason: p.cancellationReason,
      trigger,
    },
    user_properties: email ? { email } : undefined,
  };

  try {
    await fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: AMPLITUDE_KEY, events: [ampEvent] }),
    });
  } catch (e) {
    // Return 200 regardless so Cal doesn't retry-storm; log for debugging.
    console.error('[cal-webhook] amplitude forward failed', e);
  }

  return NextResponse.json({ ok: true, tracked: eventType });
}
