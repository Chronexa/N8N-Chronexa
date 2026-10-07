'use client';

import { useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { track } from '../../lib/analytics';
import BookButton from '../BookButton';
import s from './voice.module.css';

/**
 * Live, in-browser call with a Chronexa-built voice agent (Retell + ElevenLabs voices).
 * The token comes from /api/voice-demo, so no key reaches the browser. "Behind the call"
 * steps are inferred from the live transcript and are labelled as simulated: in a client
 * deployment the same moments are real calendar, CRM and SMS writes.
 */

type ScenarioId = 'dental' | 'salon' | 'sales';
const SCENARIOS: { id: ScenarioId; agent: string; biz: string; role: string; voice: string; tries: string[] }[] = [
  { id: 'dental', agent: 'Ava', biz: 'Bright Smile Dental', role: 'Receptionist', voice: 'Ava · American English',
    tries: ['“I need a cleaning tomorrow afternoon.”', '“Do you take Delta Dental?”', '“My tooth is swollen, can I come today?”', 'Switch to Spanish halfway through.'] },
  { id: 'salon', agent: 'Mia', biz: 'Luxe Studio Salon', role: 'Booking agent', voice: 'Mia · British English',
    tries: ['“Can I get balayage with Sofia on Saturday?”', '“How much is a men’s cut?”', '“I need to move my appointment.”', 'Ask in Hindi or Portuguese.'] },
  { id: 'sales', agent: 'Max', biz: 'ProFlow Heating & Air', role: 'Inbound sales', voice: 'Max · American English',
    tries: ['“My AC stopped cooling.”', '“I want a quote for a new system.”', '“Do you do financing?”', 'Use a strong local accent.'] },
];

type Line = { role: 'agent' | 'user'; content: string };
type Status = 'idle' | 'connecting' | 'live' | 'ended' | 'error';

const STEPS = [
  { k: 'answered', label: 'Answered in under a second', test: (t: Line[]) => t.some((l) => l.role === 'agent') },
  { k: 'intent', label: 'Understood what the caller wants', test: (t: Line[]) => t.filter((l) => l.role === 'user').length >= 1 },
  // Only after the caller has spoken, and only when the agent offers a real time (not "how can I help you today?").
  { k: 'calendar', label: 'Checked live availability', test: (t: Line[]) => { const first = t.findIndex((l) => l.role === 'user'); return first >= 0 && t.slice(first).some((l) => l.role === 'agent' && /\b\d{1,2}(:\d{2})?\s?(am|pm|a\.m\.|p\.m\.)/i.test(l.content)); } },
  { k: 'booked', label: 'Booked and confirmed the slot', test: (t: Line[]) => { const first = t.findIndex((l) => l.role === 'user'); return first >= 0 && t.slice(first).some((l) => l.role === 'agent' && /(booked|confirmed|you’re all set|you're all set|reserved|scheduled)/i.test(l.content)); } },
  { k: 'crm', label: 'Text confirmation + CRM record', test: (t: Line[], ended: boolean) => ended && t.some((l) => l.role === 'agent' && /(booked|confirmed|scheduled|reserved)/i.test(l.content)) },
];

export default function VoiceDemo() {
  const [scenario, setScenario] = useState<ScenarioId>('dental');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [agentTalking, setAgentTalking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const client = useRef<RetellWebClient | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => () => { client.current?.stopCall(); }, []);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [lines]);
  useEffect(() => {
    if (status !== 'live') return;
    const t = setInterval(() => setSeconds((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const current = SCENARIOS.find((x) => x.id === scenario)!;

  async function start() {
    setError(''); setLines([]); setSeconds(0); setStatus('connecting');
    track('voice_demo_start', { scenario });
    try {
      const r = await fetch('/api/voice-demo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scenario }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'The demo line is busy.');
      const c = new RetellWebClient();
      client.current = c;
      c.on('call_started', () => setStatus('live'));
      c.on('agent_start_talking', () => setAgentTalking(true));
      c.on('agent_stop_talking', () => setAgentTalking(false));
      c.on('update', (u: { transcript?: Line[] }) => { if (u?.transcript) setLines(u.transcript.filter((l) => l.content?.trim())); });
      c.on('call_ended', () => { setStatus('ended'); setAgentTalking(false); track('voice_demo_end', { scenario }); });
      c.on('error', () => { setStatus('error'); setError('The call dropped. Check your microphone and try again.'); c.stopCall(); });
      await c.startCall({ accessToken: j.accessToken, callId: j.callId, transport: j.transport, url: j.url, iceServers: j.iceServers });
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      setStatus('error');
      setError(/permission|NotAllowed/i.test(msg) ? 'Your browser blocked the microphone. Allow it and try again.' : msg || 'Something went wrong. Try again.');
    }
  }

  function stop() { client.current?.stopCall(); setStatus('ended'); setAgentTalking(false); }

  const live = status === 'live' || status === 'connecting';
  const mm = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className={s.demo}>
      <div className={s.bar} aria-hidden="true"><i /><i /><i /><span>live demo · talks in your browser · 3-minute limit</span></div>
      <div className={s.demoBody}>
        <div className={s.scenarios} role="radiogroup" aria-label="Choose a business">
          {SCENARIOS.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={scenario === x.id} disabled={live}
              className={s.scenario} onClick={() => { setScenario(x.id); setStatus('idle'); setLines([]); }}>
              <small>{x.role}</small><b>{x.biz}</b><span>{x.voice}</span>
            </button>
          ))}
          <div className={s.tries}>
            <p>Things to try</p>
            <ul>{current.tries.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>

        <div className={s.call}>
          <div className={s.callHead}>
            <div className={`${s.orb} ${agentTalking ? s.talking : ''} ${status === 'live' ? s.on : ''}`} aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <div>
              <p className={s.callBiz}>{current.biz}</p>
              <p className={s.callState}>
                {status === 'idle' && 'Ready when you are'}
                {status === 'connecting' && 'Connecting…'}
                {status === 'live' && <>{agentTalking ? 'Agent speaking' : 'Listening'} · {mm}</>}
                {status === 'ended' && 'Call ended'}
                {status === 'error' && 'Couldn’t connect'}
              </p>
            </div>
            {live
              ? <button type="button" className={s.hang} onClick={stop}>End call</button>
              : <button type="button" className={s.talk} onClick={start}>{status === 'ended' ? 'Call again' : 'Talk to the agent'}</button>}
          </div>

          <div className={s.transcript} ref={scroller} aria-live="polite">
            {lines.length === 0 && status !== 'ended' && (
              <p className={s.empty}>{status === 'idle' || status === 'error' ? 'Click “Talk to the agent”, allow your microphone, and speak normally. The transcript appears here as you talk.' : 'Saying hello…'}</p>
            )}
            {lines.map((l, i) => (
              <p key={i} className={l.role === 'agent' ? s.agentLine : s.userLine}><b>{l.role === 'agent' ? `${current.agent} · AI` : 'You'}</b>{l.content}</p>
            ))}
          </div>
          {error && <p className={s.error}>{error}</p>}
          {status === 'ended' && (
            <div className={s.after}>
              <p><strong>That was a demo business.</strong> Yours would answer on your phone number, in your words, connected to your calendar and CRM.</p>
              <BookButton location="voice-demo-after" className={s.afterCta}>Build one for my business →</BookButton>
            </div>
          )}
        </div>

        <div className={s.behind}>
          <p className={s.behindHead}>Behind the call</p>
          <ol>
            {STEPS.map((st) => {
              const done = st.test(lines, status === 'ended');
              return <li key={st.k} className={done ? s.done : ''}><span aria-hidden="true">{done ? '✓' : ''}</span>{st.label}</li>;
            })}
          </ol>
          <p className={s.behindNote}>Simulated here. In your deployment these are real writes to your calendar, CRM and SMS, and a person gets the summary.</p>
        </div>
      </div>
    </div>
  );
}
