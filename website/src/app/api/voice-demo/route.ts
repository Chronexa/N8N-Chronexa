import { NextResponse } from 'next/server';
import agents from '../../../lib/voice-demo-agents.json';

/**
 * Issues a one-time Retell web-call token for the live demo on /ai-voice-agent-development.
 * The Retell API key never leaves the server. Agents are capped at 3 minutes per call
 * (scripts/voice-demo-agents.mjs); this route adds a per-visitor limit so the demo
 * can't be farmed. In-memory limits are per serverless instance, which is fine for a demo.
 */
export const runtime = 'nodejs';

const AGENTS = agents as Record<string, { agent_id: string }>;
const WINDOW_MS = 60 * 60 * 1000;
const PER_IP = 6;
const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const key = process.env.RETELL_API_KEY;
  if (!key) return NextResponse.json({ error: 'Demo is not configured.' }, { status: 503 });

  let scenario = '';
  try { scenario = String((await req.json())?.scenario ?? ''); } catch { /* empty body */ }
  const agent = AGENTS[scenario];
  if (!agent) return NextResponse.json({ error: 'Unknown demo.' }, { status: 400 });

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'local';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) {
    return NextResponse.json({ error: 'You’ve tried the demo a few times this hour. Book a call and we’ll build one on your own business.' }, { status: 429 });
  }
  hits.set(ip, [...recent, now]);

  const r = await fetch('https://api.retellai.com/v2/create-web-call', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agent.agent_id, metadata: { source: 'chronexa.io demo', scenario } }),
  });
  if (!r.ok) return NextResponse.json({ error: 'The demo line is busy. Try again in a minute.' }, { status: 502 });
  const j = await r.json();
  return NextResponse.json({
    accessToken: j.access_token, callId: j.call_id, transport: j.transport, url: j.url, iceServers: j.ice_servers,
  });
}
