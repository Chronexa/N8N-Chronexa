'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ChatWidget.module.css';
import { openBooking, trackBookCta } from '../lib/cal';
import { track, identifyByEmail } from '../lib/analytics';

type Turn = { role: 'user' | 'assistant'; text: string };
type Option = { id: string; label: string };

const OTHER: Option = { id: 'other', label: 'Something else' };

const FOCUS_AREAS: Option[] = [
  { id: 'acquisition', label: 'Getting more customers' },
  { id: 'onboarding', label: 'Onboarding customers' },
  { id: 'cx', label: 'Customer support' },
  { id: 'ops', label: 'Day-to-day ops' },
  { id: 'finance', label: 'Finance & reporting' },
];

const TEAM_SIZES: Option[] = [
  { id: 'solo', label: 'Just me / 2-5' },
  { id: 'mid', label: '6-20' },
  { id: 'large', label: '20+' },
];

const ANKIT_AVATAR = '/images/team-ankit.png';
const GREETING = "Hey, I'm Ankit. What's the biggest time-sink in your business right now?";

type Step = 'focus' | 'bottleneck-text' | 'team-size' | 'contact' | 'submitting' | 'done' | 'error';

/**
 * Fully static, scripted lead-qualification flow — no AI/LLM, no external
 * webhook. Asks by business function (not industry) so any visitor is
 * welcome regardless of vertical. One row per lead — the free-text
 * bottleneck, focus area, and team size all fold into a single "What to
 * automate" summary rather than separate rows, since Baserow's row quota
 * is limited. Submits straight to /api/contact (same endpoint the site's
 * contact form uses, which also mirrors to Google Sheets), tagged
 * source=chatbot:<focus-area>.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [step, setStep] = useState<Step>('focus');
  const [focusArea, setFocusArea] = useState<Option | null>(null);
  const [bottleneck, setBottleneck] = useState('');
  const [teamSize, setTeamSize] = useState<Option | null>(null);
  const [freeText, setFreeText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const freeTextRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [turns, step]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (step === 'contact') nameRef.current?.focus();
    if (step === 'bottleneck-text') freeTextRef.current?.focus();
  }, [step]);

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (next) {
        track('chat_widget_open');
        if (turns.length === 0) setTurns([{ role: 'assistant', text: GREETING }]);
      } else {
        track('chat_widget_close');
      }
      return next;
    });
  }

  function say(role: Turn['role'], text: string) {
    setTurns((t) => [...t, { role, text }]);
  }

  function pickFocus(opt: Option) {
    say('user', opt.label);
    track('chat_step_focus', { value: opt.id });
    if (opt.id !== 'other') setFocusArea(opt);
    say('assistant', opt.id === 'other' ? "Tell me what's on your mind." : 'Got it — walk me through what that looks like day to day.');
    setStep('bottleneck-text');
  }

  function submitFreeText(e: React.FormEvent) {
    e.preventDefault();
    const text = freeText.trim();
    if (!text) return;
    say('user', text);
    setBottleneck(text);
    setFreeText('');
    track('chat_step_bottleneck');
    say('assistant', 'How big is the team dealing with this?');
    setStep('team-size');
  }

  function pickTeamSize(opt: Option) {
    say('user', opt.label);
    track('chat_step_team_size', { value: opt.id });
    setTeamSize(opt);
    say('assistant', "Cool — drop your name and email and I'll take a look myself.");
    setStep('contact');
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    const em = email.trim();
    if (!n || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
      setFormError('Name and a valid email, please.');
      return;
    }
    setFormError('');
    say('user', `${n} — ${em}`);
    setStep('submitting');
    track('chat_message_sent');

    const usecase = [
      focusArea ? `Focus area: ${focusArea.label}` : null,
      bottleneck ? `What's happening: ${bottleneck}` : null,
      teamSize ? `Team size: ${teamSize.label}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: n,
          email: em,
          company: '',
          usecase,
          source: `chatbot:${focusArea?.id ?? 'other'}`,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      identifyByEmail(em);
      say('assistant', `Thanks, ${n.split(' ')[0]}! I'll get back to you at ${em} soon — or grab a time on my calendar if you'd rather talk today.`);
      setStep('done');
    } catch {
      say('assistant', "Hmm, that didn't go through on my end. Book a call instead and I'll pick it up there.");
      setStep('error');
    }
  }

  function reset() {
    setTurns([{ role: 'assistant', text: GREETING }]);
    setStep('focus');
    setFocusArea(null);
    setBottleneck('');
    setTeamSize(null);
    setFreeText('');
    setName('');
    setEmail('');
    setFormError('');
  }

  const flowInProgress = step !== 'done';

  return (
    <div className={styles.wrap} ref={panelRef}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat with Ankit">
          <div className={styles.header}>
            <div className={styles.headerIdentity}>
              <span className={styles.headerAvatarWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.headerAvatar} src={ANKIT_AVATAR} alt="Ankit Dhiman" />
                <span className={styles.onlineDot} aria-hidden="true" />
              </span>
              <span className={styles.headerText}>
                <span className={styles.headerName}>Ankit Dhiman</span>
                <span className={styles.headerStatus}>Co-founder · usually replies within a few hours</span>
              </span>
            </div>
            <button type="button" className={styles.headerClose} onClick={toggle} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className={styles.messages} ref={listRef}>
            {turns.map((t, i) =>
              t.role === 'assistant' ? (
                <div key={i} className={styles.msgRow}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.msgAvatar} src={ANKIT_AVATAR} alt="" aria-hidden="true" />
                  <div className={styles.bubbleBot}>{t.text}</div>
                </div>
              ) : (
                <div key={i} className={styles.bubbleUser}>
                  {t.text}
                </div>
              )
            )}
            {step === 'submitting' && (
              <div className={styles.msgRow}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.msgAvatar} src={ANKIT_AVATAR} alt="" aria-hidden="true" />
                <div className={styles.bubbleBot}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
          </div>

          {step === 'focus' && (
            <div className={styles.quickReplies}>
              {FOCUS_AREAS.map((opt) => (
                <button key={opt.id} type="button" className={styles.chip} onClick={() => pickFocus(opt)}>
                  {opt.label}
                </button>
              ))}
              <button type="button" className={styles.chip} onClick={() => pickFocus(OTHER)}>
                {OTHER.label}
              </button>
            </div>
          )}

          {step === 'bottleneck-text' && (
            <form className={styles.inputRow} onSubmit={submitFreeText}>
              <input
                ref={freeTextRef}
                type="text"
                className={styles.input}
                placeholder="e.g. re-typing data into 3 tools every week"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn} disabled={!freeText.trim()} aria-label="Send">
                <SendIcon />
              </button>
            </form>
          )}

          {step === 'team-size' && (
            <div className={styles.quickReplies}>
              {TEAM_SIZES.map((opt) => (
                <button key={opt.id} type="button" className={styles.chip} onClick={() => pickTeamSize(opt)}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step === 'contact' && (
            <form className={styles.contactForm} onSubmit={submitContact}>
              <div className={styles.contactFormRow}>
                <input
                  ref={nameRef}
                  type="text"
                  className={styles.input}
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  className={styles.input}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn} aria-label="Send">
                  <SendIcon />
                </button>
              </div>
              {formError && <p className={styles.errorText}>{formError}</p>}
            </form>
          )}

          {(step === 'done' || step === 'error') && (
            <div className={styles.doneActions}>
              <button
                type="button"
                className={styles.bookFallback}
                onClick={() => {
                  trackBookCta('chat_widget_done');
                  openBooking({ name, email });
                }}
              >
                Book a free strategy call →
              </button>
              <button type="button" className={styles.skipLink} onClick={reset}>
                Start over
              </button>
            </div>
          )}

          {flowInProgress && step !== 'submitting' && (
            <button
              type="button"
              className={styles.skipLink}
              onClick={() => {
                trackBookCta('chat_widget_skip');
                openBooking();
              }}
            >
              Skip the chat, book directly →
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with Ankit'}
      >
        {open ? (
          '×'
        ) : (
          <span className={styles.fabAvatarWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.fabAvatar} src={ANKIT_AVATAR} alt="" aria-hidden="true" />
            <span className={styles.onlineDot} aria-hidden="true" />
          </span>
        )}
        {!open && <span className={styles.fabLabel}>Chat with Ankit</span>}
      </button>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
