'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { track } from '../../lib/analytics';
import s from './immersive.module.css';

type ScenarioId = 'dental' | 'salon' | 'sales';
type Status = 'idle' | 'connecting' | 'live' | 'ended' | 'error';
type Line = { role: 'agent' | 'user'; content: string };

const SCENARIOS: { id: ScenarioId; short: string; business: string; role: string; prompt: string }[] = [
  { id: 'dental', short: 'Dental', business: 'Bright Smile Dental', role: 'AI receptionist', prompt: 'Try: “I need a cleaning tomorrow afternoon.”' },
  { id: 'salon', short: 'Salon', business: 'Luxe Studio', role: 'AI booking agent', prompt: 'Try: “Can I book balayage with Sofia?”' },
  { id: 'sales', short: 'Home services', business: 'ProFlow Heating & Air', role: 'AI inbound sales', prompt: 'Try: “My AC stopped cooling.”' },
];

const DEMO_DETAILS: Record<ScenarioId, { location: string; outcome: string; context: string[] }> = {
  dental: { location: 'Austin, TX', outcome: 'Appointment + intake', context: ['Practice FAQs', 'Open appointments', 'Emergency routing'] },
  salon: { location: 'Miami, FL', outcome: 'Booking + deposit', context: ['Service menu', 'Stylist skills', 'Live availability'] },
  sales: { location: 'Phoenix, AZ', outcome: 'Qualified service visit', context: ['Service area', 'Urgency rules', 'Dispatch windows'] },
};

const INTRO = [
  'Hi, I’m Ava — a voice agent built by Chronexa.',
  'Ask me to book a cleaning, move an appointment, or check insurance.',
  'I’ll use the calendar, update the CRM, send the confirmation, and hand over when a human should decide.',
];

const ACTIONS = [
  { key: 'intent', label: 'Intent understood', ready: (lines: Line[]) => lines.some((x) => x.role === 'user') },
  { key: 'knowledge', label: 'Knowledge checked', ready: (lines: Line[]) => lines.length >= 2 },
  { key: 'calendar', label: 'Calendar queried', ready: (lines: Line[]) => lines.some((x) => /tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|appointment|slot|book/i.test(x.content)) },
  { key: 'record', label: 'CRM record prepared', ready: (lines: Line[]) => lines.some((x) => /booked|confirmed|scheduled|name/i.test(x.content)) },
];

export default function ImmersiveVoiceHero() {
  const [scenario, setScenario] = useState<ScenarioId>('dental');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [lines, setLines] = useState<Line[]>([]);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [introVisual, setIntroVisual] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const client = useRef<RetellWebClient | null>(null);

  const current = SCENARIOS.find((x) => x.id === scenario)!;
  const details = DEMO_DETAILS[scenario];
  const live = status === 'live' || status === 'connecting';
  const mm = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  useEffect(() => () => { client.current?.stopCall(); audio.current?.pause(); }, []);
  useEffect(() => {
    if (status !== 'live') return;
    const timer = window.setInterval(() => setSeconds((x) => x + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);
  useEffect(() => {
    if (!introVisual) return;
    const timer = window.setInterval(() => setIntroStep((x) => (x + 1) % INTRO.length), 4300);
    return () => window.clearInterval(timer);
  }, [introVisual]);

  async function playIntro() {
    if (!audio.current) return;
    if (introPlaying) {
      audio.current.pause();
      setIntroPlaying(false);
      setIntroVisual(false);
      return;
    }
    client.current?.stopCall();
    setStatus('idle');
    setLines([]);
    audio.current.currentTime = 0;
      setIntroStep(0);
      setIntroVisual(true);
    try {
      await audio.current.play();
      setIntroPlaying(true);
      track('voice_hero_preview_play');
    } catch {
      setError('Your browser blocked audio. Tap “Hear Ava” again.');
    }
  }

  async function startLive() {
    audio.current?.pause();
    setIntroPlaying(false);
    setIntroVisual(false);
    setError('');
    setLines([]);
    setSeconds(0);
    setStatus('connecting');
    track('voice_demo_start', { scenario, placement: 'hero' });
    try {
      const response = await fetch('/api/voice-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The demo line is busy.');
      const next = new RetellWebClient();
      client.current = next;
      next.on('call_started', () => setStatus('live'));
      next.on('agent_start_talking', () => setAgentSpeaking(true));
      next.on('agent_stop_talking', () => setAgentSpeaking(false));
      next.on('update', (update: { transcript?: Line[] }) => {
        if (update.transcript) setLines(update.transcript.filter((line) => line.content?.trim()));
      });
      next.on('call_ended', () => {
        setStatus('ended');
        setAgentSpeaking(false);
        track('voice_demo_end', { scenario, placement: 'hero' });
      });
      next.on('error', () => {
        setStatus('error');
        setError('The call dropped. Check microphone access and try again.');
        next.stopCall();
      });
      await next.startCall({ accessToken: data.accessToken, callId: data.callId, transport: data.transport, url: data.url, iceServers: data.iceServers });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : '';
      setStatus('error');
      setError(/permission|NotAllowed/i.test(message) ? 'Allow microphone access, then try again.' : message || 'Couldn’t connect. Try again.');
    }
  }

  function endLive() {
    client.current?.stopCall();
    setStatus('ended');
    setAgentSpeaking(false);
  }

  const visibleLines = lines.slice(-3);
  const speaking = introVisual || (status === 'live' && agentSpeaking);

  return (
    <section className={s.hero} aria-labelledby="voice-title">
      <audio ref={audio} src="/audio/ava-intro.mp3" preload="auto" onEnded={() => { setIntroPlaying(false); setIntroVisual(false); }} />
      <Image className={s.portrait} src="/images/voice-v3/ava-hero.webp" alt="Ava, a fictional Chronexa AI voice agent" fill priority sizes="100vw" />
      <div className={s.scrim} />
      <div className={s.grain} aria-hidden="true" />

      <div className={s.copy}>
        <p className={s.eyebrow}><span /> CHRONEXA VOICE SYSTEMS</p>
        <h1 id="voice-title">Meet the agent<br />behind your<br /><em>next booking.</em></h1>
        <p>Natural conversation in front. Your calendar, CRM, payments and workflows behind it.</p>
      </div>

      <div className={s.identity}>
        <div className={`${s.avatarPulse} ${speaking ? s.speaking : ''}`}><span>A</span><i /><i /><i /></div>
        <div><strong>Ava</strong><span>{live ? current.role : 'Chronexa AI receptionist'}</span></div>
        <b><i /> {status === 'live' ? `LIVE · ${mm}` : introVisual ? 'SPEAKING' : 'READY'}</b>
      </div>

      <div className={s.console}>
        <div className={s.consoleBar}>
          <div><i /><i /><i /><span>Chronexa Voice Lab</span></div>
          <p><b /> LIVE AGENT SANDBOX</p>
        </div>
        <div className={s.scenarioTabs} role="radiogroup" aria-label="Choose a demo business">
          {SCENARIOS.map((item) => (
            <button key={item.id} type="button" role="radio" aria-checked={scenario === item.id} disabled={live}
              onClick={() => { setScenario(item.id); setLines([]); setStatus('idle'); }}>
              <small>{item.short}</small><span>{item.business}</span>
            </button>
          ))}
        </div>
        <div className={s.demoStage}>
          <div className={s.agentVisual}>
            <div className={`${s.voiceOrb} ${speaking ? s.voiceOrbSpeaking : ''}`} aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><span>A</span>
            </div>
            <div className={s.agentMeta}><strong>{scenario === 'salon' ? 'Mia' : scenario === 'sales' ? 'Max' : 'Ava'}</strong><span>{current.role}</span><small>{details.location} · Multilingual</small></div>
            <div className={s.signalRow}><span>Latency tuned</span><span>Interruptible</span><span>Human handoff</span></div>
          </div>

          <div className={s.conversation}>
            <div className={s.conversationHead}><span>{status === 'live' ? `LIVE CALL · ${mm}` : 'INTERACTIVE PREVIEW'}</span><b>{status === 'connecting' ? 'CONNECTING' : status === 'live' ? 'LISTENING' : introVisual ? 'AGENT SPEAKING' : 'READY'}</b></div>
            <div className={s.liveCaption} aria-live="polite">
              <small>{live ? (agentSpeaking ? 'AGENT' : 'CALLER') : 'AGENT'}</small>
              <p>{live ? (visibleLines.at(-1)?.content || 'Connecting to the live agent…') : INTRO[introStep]}</p>
            </div>
            {visibleLines.length > 0
              ? <div className={s.transcript}>{visibleLines.map((line, index) => <p key={index} data-role={line.role}><b>{line.role === 'agent' ? 'Agent' : 'You'}</b>{line.content}</p>)}</div>
              : <div className={s.tryThis}><small>TRY A REAL TASK</small><p>{current.prompt}</p></div>}
            <div className={s.controls}>
              <button type="button" className={s.listen} onClick={playIntro} disabled={live} aria-label={introPlaying ? 'Pause agent introduction' : 'Hear agent introduction'}>
                <span aria-hidden="true">{introPlaying ? 'Ⅱ' : '▶'}</span>{introPlaying ? 'Pause preview' : 'Hear the voice'}
              </button>
              {live
                ? <button type="button" className={s.liveButton} onClick={endLive}><span>■</span> End live call</button>
                : <button type="button" className={s.liveButton} onClick={startLive}><span>●</span> Talk to the agent</button>}
            </div>
          </div>

          <div className={s.actions}>
            <div className={s.actionHead}><small>AGENT WORKSPACE</small><span>{lines.length ? 'RUNNING' : 'STANDBY'}</span></div>
            <div className={s.knowledge}><small>GROUNDED ON</small>{details.context.map((item) => <span key={item}>{item}<i>✓</i></span>)}</div>
            <div className={s.actionList}>{ACTIONS.map((action) => {
              const done = action.ready(lines);
              return <span key={action.key} data-done={done}><i>{done ? '✓' : ''}</i>{action.label}</span>;
            })}</div>
            <div className={s.outcome}><small>TARGET OUTCOME</small><strong>{details.outcome}</strong><span>Designed by Chronexa</span></div>
          </div>
        </div>
        {error && <p className={s.error}>{error}</p>}
      </div>

      <p className={s.disclosure}>Fictional demo business and AI persona. Live conversation uses your microphone and ends after three minutes.</p>
    </section>
  );
}
