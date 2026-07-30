'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import ScrollDepth from '../../components/ScrollDepth';
import LogoChip from '../../components/LogoChip';
import { openBooking, trackBookCta } from '../../lib/cal';
import { track, identifyByEmail } from '../../lib/analytics';
import { site } from '../../lib/site';
import styles from './N8nStartupPage.module.css';

/* ─── Inline SVG icons (enterprise feel, no emojis) ──────────────────── */
const IconBolt = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const IconTrendUp = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
);

/* ─── Tool definitions ─────────────────────────────────────────────────── */
type Tool = { file: string; name: string };

const HERO_TOOLS: Tool[] = [
  { file: 'hubspot.png', name: 'HubSpot' },
  { file: 'slack.png', name: 'Slack' },
  { file: 'notion.svg', name: 'Notion' },
  { file: 'gmail.svg', name: 'Gmail' },
  { file: 'openai.svg', name: 'OpenAI' },
  { file: 'claude.svg', name: 'Claude' },
  { file: 'n8n.svg', name: 'n8n' },
  { file: 'whatsapp.svg', name: 'WhatsApp' },
];

/* ─── Workflow template data (inspired by n8n.io/workflows) ──────────── */
type WorkflowTemplate = {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: Tool[];
  nodeCount: number;
};

const CATEGORIES = ['All', 'Lead Gen', 'Content', 'WhatsApp', 'Reporting', 'Research'] as const;

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'outbound-enrichment',
    title: 'LinkedIn Lead Enrichment & CRM Sync',
    description: 'Automatically scrape LinkedIn profiles, enrich with Apollo data, score against your ICP, and sync qualified leads into HubSpot with personalised notes.',
    category: 'Lead Gen',
    tools: [
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'apollo.png', name: 'Apollo' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    nodeCount: 12,
  },
  {
    id: 'cold-outreach',
    title: 'AI-Personalised Cold Email Sequences',
    description: 'Research each prospect with Perplexity, write hyper-personalised opening lines with Claude, and send multi-step sequences via Instantly — overnight.',
    category: 'Lead Gen',
    tools: [
      { file: 'perplexity.svg', name: 'Perplexity' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'instantly.png', name: 'Instantly' },
      { file: 'slack.png', name: 'Slack' },
    ],
    nodeCount: 18,
  },
  {
    id: 'content-pipeline',
    title: 'SEO Blog Content Production Pipeline',
    description: 'From a Notion content brief to a fully drafted, SEO-optimised blog post with AI-generated visuals — reviewed, approved, and auto-published.',
    category: 'Content',
    tools: [
      { file: 'notion.svg', name: 'Notion' },
      { file: 'openai.svg', name: 'GPT-4' },
      { file: 'gemini.svg', name: 'Gemini' },
    ],
    nodeCount: 22,
  },
  {
    id: 'social-scheduling',
    title: 'Social Media Auto-Post & Scheduling',
    description: 'Generate platform-specific social copy from one brief, create carousels and reels thumbnails, and schedule across LinkedIn, Instagram, and X.',
    category: 'Content',
    tools: [
      { file: 'openai.svg', name: 'GPT-4' },
      { file: 'linkedin.png', name: 'LinkedIn' },
      { file: 'instagram.svg', name: 'Instagram' },
    ],
    nodeCount: 15,
  },
  {
    id: 'whatsapp-qualifier',
    title: 'WhatsApp Lead Qualifier & Booker',
    description: 'An intelligent WhatsApp agent that qualifies inbound leads, answers FAQs from your knowledge base, and books meetings directly into your calendar.',
    category: 'WhatsApp',
    tools: [
      { file: 'whatsapp.svg', name: 'WhatsApp' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'hubspot.png', name: 'HubSpot' },
    ],
    nodeCount: 14,
  },
  {
    id: 'whatsapp-support',
    title: 'WhatsApp Customer Support Agent',
    description: 'RAG-powered support agent that resolves 60% of WhatsApp queries automatically using your docs, escalating only complex issues to your team in Slack.',
    category: 'WhatsApp',
    tools: [
      { file: 'whatsapp.svg', name: 'WhatsApp' },
      { file: 'openai.svg', name: 'GPT-4' },
      { file: 'slack.png', name: 'Slack' },
    ],
    nodeCount: 16,
  },
  {
    id: 'slack-reporting',
    title: 'Daily Business Intelligence to Slack',
    description: 'Aggregates pipeline data from HubSpot, product metrics from Jira, and revenue from Stripe — delivers a summarised morning brief to your Slack channel.',
    category: 'Reporting',
    tools: [
      { file: 'hubspot.png', name: 'HubSpot' },
      { file: 'jira.svg', name: 'Jira' },
      { file: 'stripe.png', name: 'Stripe' },
      { file: 'slack.png', name: 'Slack' },
    ],
    nodeCount: 20,
  },
  {
    id: 'gmail-tracker',
    title: 'Gmail + Sheets Deal Tracker',
    description: 'Automatically extract deal-related emails, parse key terms and amounts, and update a live Google Sheet with deal status and next actions.',
    category: 'Reporting',
    tools: [
      { file: 'gmail.svg', name: 'Gmail' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'gdrive.svg', name: 'Google Sheets' },
    ],
    nodeCount: 10,
  },
  {
    id: 'competitor-intel',
    title: 'Automated Competitor Research Agent',
    description: 'Monitors competitor websites, pricing pages, and social feeds daily. Summarises changes and delivers a weekly competitive intelligence report.',
    category: 'Research',
    tools: [
      { file: 'perplexity.svg', name: 'Perplexity' },
      { file: 'claude.svg', name: 'Claude' },
      { file: 'notion.svg', name: 'Notion' },
      { file: 'slack.png', name: 'Slack' },
    ],
    nodeCount: 24,
  },
];

/* ─── Tool Cloud — the full orchestration layer ──────────────────────── */
const TOOL_CLOUD: Tool[] = [
  { file: 'hubspot.png', name: 'HubSpot' },
  { file: 'slack.png', name: 'Slack' },
  { file: 'notion.svg', name: 'Notion' },
  { file: 'gmail.svg', name: 'Gmail' },
  { file: 'openai.svg', name: 'OpenAI' },
  { file: 'claude.svg', name: 'Claude' },
  { file: 'gemini.svg', name: 'Gemini' },
  { file: 'perplexity.svg', name: 'Perplexity' },
  { file: 'whatsapp.svg', name: 'WhatsApp' },
  { file: 'linkedin.png', name: 'LinkedIn' },
  { file: 'instagram.svg', name: 'Instagram' },
  { file: 'apollo.png', name: 'Apollo' },
  { file: 'stripe.png', name: 'Stripe' },
  { file: 'jira.svg', name: 'Jira' },
  { file: 'airtable.svg', name: 'Airtable' },
  { file: 'gdrive.svg', name: 'Google Drive' },
  { file: 'github.svg', name: 'GitHub' },
  { file: 'instantly.png', name: 'Instantly' },
  { file: 'intercom.png', name: 'Intercom' },
  { file: 'n8n.svg', name: 'n8n' },
  { file: 'twilio.png', name: 'Twilio' },
  { file: 'zendesk.png', name: 'Zendesk' },
  { file: 'freshdesk.png', name: 'Freshdesk' },
  { file: 'excel.svg', name: 'Excel' },
  { file: 'outlook.png', name: 'Outlook' },
  { file: 'sharepoint.png', name: 'SharePoint' },
  { file: 'clay.png', name: 'Clay' },
  { file: 'smartlead.png', name: 'Smartlead' },
  { file: 'zapier.svg', name: 'Zapier' },
  { file: 'make.svg', name: 'Make' },
];

/* ─── FAQ Data ───────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'How long does it take to go live?',
    a: 'Most automation systems are built, tested, and deployed within 2 to 4 weeks depending on complexity. Simple single-workflow automations can ship in under a week.',
  },
  {
    q: 'Why n8n instead of Zapier or Make?',
    a: 'n8n is open-source and self-hostable — your data never leaves your infrastructure. It handles complex branching logic, AI agent loops, and custom code nodes that Zapier and Make cannot. And there are no per-task fees, so costs stay flat as you scale.',
  },
  {
    q: 'Is our data secure?',
    a: 'Absolutely. We deploy n8n inside your own VPC (Virtual Private Cloud) or a dedicated instance so your data never touches third-party servers. Full SOC 2 alignment available.',
  },
  {
    q: 'What if we already use Zapier?',
    a: 'We audit your existing Zapier workflows, identify the ones bleeding money on per-task pricing, and migrate the high-volume or complex ones to n8n — usually saving 60–80% on automation costs.',
  },
  {
    q: 'Do you offer ongoing support?',
    a: 'Yes. Every engagement includes 30 days of post-launch support. We also offer monthly retainer plans for continuous optimisation, monitoring, and new workflow builds.',
  },
];

/* ─── Lead Form (inline, posts to /api/contact) ──────────────────────── */
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
const FORM_SOURCE = 'n8n-startup-landing';

function LeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const companySize = String(fd.get('companySize') || '').trim();
    const comments = String(fd.get('comments') || '').trim();

    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !company || !companySize) {
      setStatus('error');
      setError('Please fill in your name, business email, company, and company size.');
      return;
    }

    setStatus('submitting');
    identifyByEmail(email);
    track('n8n_startup_lead_submit', { source: FORM_SOURCE });

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, company, companySize, comments, source: FORM_SOURCE }),
    })
      .then((r) => {
        if (r.ok) {
          setStatus('success');
          track('n8n_startup_lead_success', { source: FORM_SOURCE });
          trackBookCta(FORM_SOURCE);
          setTimeout(() => openBooking({ name, email, notes: comments }), 600);
        } else {
          setStatus('error');
          setError('Something went wrong — please try again.');
        }
      })
      .catch(() => {
        setStatus('error');
        setError('Something went wrong — please try again.');
      });
  }

  if (status === 'success') {
    return (
      <div className={styles.leadForm}>
        <p className={styles.successText}>Thanks — opening the calendar in a new tab…</p>
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
          If it didn&apos;t open, book directly here →
        </a>
      </div>
    );
  }

  return (
    <form className={styles.leadForm} onSubmit={onSubmit}>
      <p className={styles.formLabel}>Get your custom automation roadmap</p>
      <input className={styles.formInput} name="name" placeholder="Name" autoComplete="name" required />
      <input className={styles.formInput} name="email" type="email" placeholder="Work email" autoComplete="email" required />
      <div className={styles.formRow}>
        <input className={styles.formInput} name="company" placeholder="Company" autoComplete="organization" required />
        <select className={styles.formSelect} name="companySize" defaultValue="" required>
          <option value="" disabled>Team size</option>
          <option value="1-20">1–20</option>
          <option value="21-50">21–50</option>
          <option value="51-100">51–100</option>
          <option value="101-150">101–150</option>
          <option value="150+">150+</option>
        </select>
      </div>
      <textarea className={styles.formTextarea} name="comments" placeholder="What process eats the most time? (optional)" rows={2} />
      <button className={`btn-primary ${styles.formSubmit}`} type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Get your automation audit'}
      </button>
      {status === 'error' && <p className={styles.errorText}>{error}</p>}
    </form>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function N8nStartupPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="reveal-ready">
      <ScrollDepth pageType="n8n-startup-landing" />
      <Nav />
      <main id="main">

        {/* ═══ 1. HERO + LEAD FORM ═══════════════════════════════════════ */}
        <section className={`section-light ${styles.hero}`}>
          <div className="container">
            <div className={styles.heroGrid}>
              <div className={styles.heroContent}>
                <p className="eyebrow">n8n AI Automation for Startups</p>
                <h1>
                  Scale like a 100-person team.{' '}
                  <span className="accent-phrase">Without hiring one.</span>
                </h1>
                <p className={styles.heroLede}>
                  We build production-grade AI workflows on n8n that automate your lead gen, content,
                  WhatsApp, reporting, and research — self-hosted, zero vendor lock-in, flat pricing.
                </p>
                <div className={styles.heroLogos}>
                  {HERO_TOOLS.map((t) => (
                    <LogoChip key={t.file} file={t.file} name={t.name} showName size="sm" />
                  ))}
                </div>
                <div className={styles.heroActions}>
                  <a href={`tel:${site.phone || '+919876543210'}`} className="btn-outline">
                    <IconPhone /> Call Us
                  </a>
                  <a
                    href={`https://wa.me/${(site.phone || '+919876543210').replace(/[^0-9]/g, '')}`}
                    className="btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconWhatsApp /> WhatsApp
                  </a>
                </div>
              </div>
              <div className={styles.heroFormCol}>
                <LeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. WHY AI AUTOMATION ═══════════════════════════════════════ */}
        <section className="section-muted section-tight" data-reveal>
          <div className="container">
            <p className="eyebrow">Why AI Automation</p>
            <h2>
              Stop scaling headcount.{' '}
              <span className="accent-phrase">Start scaling systems.</span>
            </h2>
            <div className={styles.whyGrid}>
              <div className={`panel ${styles.whyCard}`}>
                <div className={styles.whyIcon}><IconBolt /></div>
                <h4>Execute in seconds, not hours</h4>
                <p>Automated n8n workflows run complex multi-step processes 24/7 — research, write, send, log — while your team sleeps.</p>
              </div>
              <div className={`panel ${styles.whyCard}`}>
                <div className={styles.whyIcon}><IconTarget /></div>
                <h4>Zero manual errors</h4>
                <p>Every data handoff, CRM update, and lead routing step is deterministic. No missed follow-ups, no copy-paste mistakes.</p>
              </div>
              <div className={`panel ${styles.whyCard}`}>
                <div className={styles.whyIcon}><IconTrendUp /></div>
                <h4>Revenue ≠ Headcount</h4>
                <p>Decouple your growth from your payroll. AI systems let you 3× output capacity without a single additional hire.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3. WORKFLOW TEMPLATES (n8n.io/workflows style) ═════════════ */}
        <section className={`section-dark section-major ${styles.templatesSection}`} data-reveal>
          <div className="container">
            <p className="eyebrow">What We Automate</p>
            <h2>
              Production-ready workflows.{' '}
              <span className="accent-phrase">Built for your stack.</span>
            </h2>
            <p className={styles.templatesSub}>
              Inspired by the n8n community&apos;s 11,000+ templates — customised, hardened, and deployed inside your infrastructure.
            </p>

            {/* Category filter tabs */}
            <div className="seg-tabs" role="tablist" aria-label="Filter workflows">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className="seg-tab"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template cards grid */}
            <div className={styles.templateGrid}>
              {filtered.map((tmpl) => (
                <article key={tmpl.id} className={styles.templateCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardLogos}>
                      {tmpl.tools.map((t) => (
                        <LogoChip key={t.file + tmpl.id} file={t.file} name={t.name} size="sm" />
                      ))}
                    </div>
                    <span className={styles.cardBadge}>{tmpl.category}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{tmpl.title}</h3>
                  <p className={styles.cardDesc}>{tmpl.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.nodeCount}>
                      <Image src="/logos/n8n.svg" alt="" width={14} height={14} /> {tmpl.nodeCount} nodes
                    </span>
                    <span className={styles.cardCta}>View workflow →</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 4. TOOL CLOUD ═════════════════════════════════════════════ */}
        <section className="section-light section-tight" data-reveal>
          <div className="container" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Integration Layer</p>
            <h2>
              Hundreds of tools.{' '}
              <span className="accent-phrase">One orchestration layer.</span>
            </h2>
            <p className={styles.toolCloudSub}>
              We connect every tool in your stack through n8n — no middleware tax, no per-task pricing.
            </p>
            <div className={styles.toolCloud}>
              {TOOL_CLOUD.map((t) => (
                <LogoChip key={t.file} file={t.file} name={t.name} showName size="sm" />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 5. ROI / BUSINESS IMPACT ═════════════════════════════════ */}
        <section className={`section-dark section-major ${styles.roiSection}`} data-reveal>
          <div className="container" style={{ textAlign: 'center' }}>
            <p className="eyebrow">Business Impact</p>
            <h2>
              The numbers that{' '}
              <span className="accent-phrase">actually matter.</span>
            </h2>
            <div className={styles.roiGrid}>
              <div className={styles.roiCard}>
                <span className={`display-num ${styles.roiBig}`}>40+</span>
                <span className={styles.roiLabel}>Hours saved per week</span>
                <p className={styles.roiDetail}>Repeatable tasks absorbed by workflows that never call in sick.</p>
              </div>
              <div className={styles.roiCard}>
                <span className={`display-num ${styles.roiBig}`}>3×</span>
                <span className={styles.roiLabel}>Team capacity</span>
                <p className={styles.roiDetail}>Same team, triple the output. That&apos;s 2 hires you don&apos;t make.</p>
              </div>
              <div className={styles.roiCard}>
                <span className={`display-num ${styles.roiBig}`}>60</span>
                <span className={styles.roiLabel}>Days to full ROI</span>
                <p className={styles.roiDetail}>Most automations pay for themselves within the first billing cycle.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 6. WHAT IS AN AI-FIRST STARTUP ═══════════════════════════ */}
        <section className="section-muted section-tight" data-reveal>
          <div className="container">
            <div className={styles.aiFirstGrid}>
              <div>
                <p className="eyebrow">The Shift</p>
                <h2>
                  What is an{' '}
                  <span className="accent-phrase">AI-first startup?</span>
                </h2>
                <p className={styles.aiFirstLede}>
                  Traditional startups solve scaling problems by hiring more people.
                  AI-first startups solve them by building intelligent systems that do the
                  repeatable work — so every human on the team does only high-leverage work.
                </p>
              </div>
              <div className={styles.shiftTable}>
                <div className={`${styles.shiftRow} ${styles.shiftHeader}`}>
                  <span></span>
                  <span>Traditional</span>
                  <span>AI-First</span>
                </div>
                <div className={styles.shiftRow}>
                  <span>Lead follow-up</span>
                  <span>SDR team</span>
                  <span className={styles.shiftGreen}>AI agent + human approval</span>
                </div>
                <div className={styles.shiftRow}>
                  <span>Content</span>
                  <span>Writer + designer</span>
                  <span className={styles.shiftGreen}>AI pipeline + editor review</span>
                </div>
                <div className={styles.shiftRow}>
                  <span>Support</span>
                  <span>3-person team</span>
                  <span className={styles.shiftGreen}>RAG agent + escalation</span>
                </div>
                <div className={styles.shiftRow}>
                  <span>Reporting</span>
                  <span>Manual dashboards</span>
                  <span className={styles.shiftGreen}>Auto-delivered to Slack</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 7. WHY CHRONEXA ═══════════════════════════════════════════ */}
        <section className="section-light" data-reveal>
          <div className="container">
            <p className="eyebrow">Why Chronexa</p>
            <h2>
              Enterprise-grade.{' '}
              <span className="accent-phrase">Founder-speed.</span>
            </h2>
            <div className={styles.whyUsGrid}>
              <div className={`panel ${styles.whyUsCard}`}>
                <h4>Production-Grade Architecture</h4>
                <p>
                  Every workflow ships with exponential-backoff retries, error triggers,
                  data validation gates, and pinned node versions. No toy automations.
                </p>
              </div>
              <div className={`panel ${styles.whyUsCard}`}>
                <h4>Zero Vendor Lock-in</h4>
                <p>
                  Your n8n instance, your VPC, your workflows. We hand over everything.
                  No recurring SaaS fees, no proprietary runtimes.
                </p>
              </div>
              <div className={`panel ${styles.whyUsCard}`}>
                <h4>Deep AI Expertise</h4>
                <p>
                  We don&apos;t just wire APIs. We build specialised AI agents with memory,
                  RAG retrieval, and structured output parsers — production-tested.
                </p>
              </div>
              <div className={`panel ${styles.whyUsCard}`}>
                <h4>30-Day Post-Launch Support</h4>
                <p>
                  Every project includes a month of monitoring, debugging, and iteration
                  after go-live. We don&apos;t deploy and disappear.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 8. FAQ ════════════════════════════════════════════════════ */}
        <section className="section-muted" data-reveal>
          <div className="container">
            <p className="eyebrow">Questions</p>
            <h2>Frequently asked</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className={`panel ${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}
                >
                  <button
                    className={styles.faqQ}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {faq.q}
                    <span className={styles.faqIcon} aria-hidden="true">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className={styles.faqA}>{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 9. FINAL CTA ═════════════════════════════════════════════ */}
        <section className={`section-dark section-major ${styles.finalCta}`} data-reveal>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>
              Ready to automate?{' '}
              <span className="accent-phrase">Let&apos;s talk.</span>
            </h2>
            <p className={styles.ctaLede}>
              Book a free 30-minute automation audit. We&apos;ll map your top 3 workflows
              and show you exactly what they&apos;d look like running on n8n.
            </p>
            <div className={styles.ctaButtons}>
              <a
                href={site.booking}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Book Your Automation Audit
              </a>
              <a
                href={`https://wa.me/${(site.phone || '+919876543210').replace(/[^0-9]/g, '')}`}
                className="btn-outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconWhatsApp /> WhatsApp Us
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
