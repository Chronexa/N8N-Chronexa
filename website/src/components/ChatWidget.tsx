'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ChatWidget.module.css';
import { site } from '../lib/site';
import { openBooking, trackBookCta } from '../lib/cal';
import { track } from '../lib/analytics';

const WEBHOOK_URL = 'https://n8n.chronexa.io/webhook/92a663b0-be0f-4d71-a16d-f7b6676824d8/chat';
const GREETING = "Hi, I'm Chronexa's AI assistant. What are you looking to automate, or where's the biggest bottleneck in your operation?";

type Message = { role: 'user' | 'assistant'; text: string };

function newSessionId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Real chat widget backed by the "Chronexa Website Chatbot" n8n workflow
 * (Chat Trigger → Claude agent, qualifies visitors, pushes toward booking).
 * Not the earlier quick-actions placeholder — this actually talks to the
 * live AI agent. A "book directly" shortcut stays available for anyone who'd
 * rather skip the conversation.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [errored, setErrored] = useState(false);
  const sessionIdRef = useRef<string>('');
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

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

  function toggle() {
    setOpen((v) => {
      const next = !v;
      if (next) {
        track('chat_widget_open');
        if (!sessionIdRef.current) sessionIdRef.current = newSessionId();
        if (messages.length === 0) setMessages([{ role: 'assistant', text: GREETING }]);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        track('chat_widget_close');
      }
      return next;
    });
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setErrored(false);
    setMessages((m) => [...m, { role: 'user', text }]);
    setSending(true);
    track('chat_message_sent');

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendMessage', sessionId: sessionIdRef.current, chatInput: text }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      const reply = typeof data.output === 'string' ? data.output : "Sorry, I didn't catch that — could you rephrase?";
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setErrored(true);
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: "I'm having trouble connecting right now — book a free call instead and we'll pick it up there." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.wrap} ref={panelRef}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Chat with Chronexa">
          <div className={styles.header}>
            <span className={styles.headerTitle}>Chronexa AI Assistant</span>
            <button type="button" className={styles.headerClose} onClick={toggle} aria-label="Close chat">
              ×
            </button>
          </div>

          <div className={styles.messages} ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.bubbleUser : styles.bubbleBot}>
                {m.text}
              </div>
            ))}
            {sending && (
              <div className={styles.bubbleBot}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
          </div>

          {errored && (
            <button
              type="button"
              className={styles.bookFallback}
              onClick={() => { trackBookCta('chat_widget_error'); openBooking(); }}
            >
              Book a free strategy call →
            </button>
          )}

          <form className={styles.inputRow} onSubmit={send}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button type="submit" className={styles.sendBtn} disabled={sending || !input.trim()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <button
            type="button"
            className={styles.skipLink}
            onClick={() => { trackBookCta('chat_widget_skip'); openBooking(); }}
          >
            Skip the chat, book directly →
          </button>
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Chat with Chronexa'}
      >
        {open ? (
          '×'
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5C4 4.67 4.67 4 5.5 4h13c.83 0 1.5.67 1.5 1.5v10c0 .83-.67 1.5-1.5 1.5H9l-4 3.5V16h-.5C3.67 16 3 15.33 3 14.5v-9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {!open && <span className={styles.fabLabel}>Chat with us</span>}
      </button>
    </div>
  );
}
