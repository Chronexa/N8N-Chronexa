/**
 * Live-looking demos of systems we have shipped (homepage "Work we've shipped").
 * Pure CSS/SVG loops: no screenshots of client data, no client names. Each demo animates
 * only while its chapter is active (the parent toggles `w.run` on the stage).
 * Styles: work.module.css.
 */
import w from './work.module.css';

function Window({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={w.window}>
      <div className={w.bar}><i /><i /><i /><span>{title}</span></div>
      <div className={w.pane}>{children}</div>
    </div>
  );
}

/* 01 · Report production: data sources tick off, then the report assembles. */
export function ReportDemo() {
  const sources = [['Site photos', '48 analysed'], ['Inspector notes', '12 pages'], ['Component data', '126 items'], ['Financial model', 'Balanced']];
  const rows = [['Roof membrane', 'Fair', '6 yrs'], ['Pool resurfacing', 'Good', '9 yrs'], ['Asphalt paving', 'Poor', '2 yrs'], ['Elevator controls', 'Fair', '5 yrs']];
  return (
    <Window title="report-engine · building report">
      <div className={w.report}>
        <ul className={w.sources}>
          {sources.map(([a, b], i) => (
            <li key={a} style={{ ['--d' as string]: `${i * 0.6}s` }}><b>{a}</b><span>{b}</span><em>✓</em></li>
          ))}
        </ul>
        <div className={w.page}>
          <p className={w.pageHead}>Component analysis <span>Section 4 of 9</span></p>
          <div className={w.lines}><i /><i /><i /></div>
          <table>
            <thead><tr><th>Component</th><th>Condition</th><th>Remaining</th></tr></thead>
            <tbody>
              {rows.map(([c, k, r], i) => (
                <tr key={c} style={{ ['--d' as string]: `${2.6 + i * 0.45}s` }}><td>{c}</td><td data-k={k}>{k}</td><td>{r}</td></tr>
              ))}
            </tbody>
          </table>
          <p className={w.done}>Draft ready for analyst review · 4 min 12 s</p>
        </div>
      </div>
    </Window>
  );
}

/* 02 · Document intelligence: fields light up on the document and land in a table with confidence. */
export function DocDemo() {
  const fields = [['Vendor', 'Halden Supply Co.', 96], ['Invoice no.', 'INV-20931', 99], ['PO match', 'PO-7714 · 3-way ✓', 94], ['Total', '$18,420.00', 61]] as const;
  return (
    <Window title="document-intelligence · invoice">
      <div className={w.doc}>
        <div className={w.paper}>
          <p className={w.paperHead}>INVOICE</p>
          {fields.map(([k], i) => <div key={k} className={w.hl} style={{ ['--d' as string]: `${i * 0.7}s` }}><span>{k}</span><i /></div>)}
          <div className={w.paperLines}><i /><i /><i /><i /></div>
        </div>
        <ul className={w.extract}>
          {fields.map(([k, v, c], i) => (
            <li key={k} style={{ ['--d' as string]: `${0.35 + i * 0.7}s` }} className={c < 80 ? w.flag : undefined}>
              <span>{k}</span><b>{v}</b>
              <em><i style={{ width: `${c}%` }} /></em>
              <small>{c < 80 ? 'Handwritten total · sent to a person' : `${c}% · source linked`}</small>
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

/* 03 · Orchestration: a production n8n-style graph with packets moving along the edges. */
export function FlowDemo() {
  const nodes = [
    { x: 40, y: 120, t: 'Webhook' }, { x: 170, y: 120, t: 'Normalise' }, { x: 300, y: 60, t: 'Claude' },
    { x: 300, y: 180, t: 'Policy check' }, { x: 430, y: 120, t: 'Slack approval' }, { x: 560, y: 70, t: 'CRM' },
    { x: 560, y: 170, t: 'Dead-letter queue' },
  ];
  const edges = ['M70 120 H140', 'M200 120 C240 120 250 60 270 60', 'M200 120 C240 120 250 180 270 180', 'M330 60 C370 60 380 120 400 120', 'M330 180 C370 180 380 120 400 120', 'M460 120 C500 120 510 70 530 70', 'M460 120 C500 120 510 170 530 170'];
  return (
    <Window title="orchestration · lead-to-crm (production)">
      <svg className={w.flow} viewBox="-10 30 640 200" role="img" aria-label="Workflow graph from webhook to CRM with an approval step">
        {edges.map((d) => <path key={d} d={d} className={w.edge} />)}
        {edges.map((d, i) => <path key={`p${d}`} d={d} className={w.packet} style={{ ['--d' as string]: `${(i % 4) * 0.5}s` }} />)}
        {nodes.map((n) => (
          <g key={n.t} transform={`translate(${n.x - 30} ${n.y - 18})`}>
            <rect width="60" height="36" rx="9" className={n.t === 'Slack approval' ? w.nodeHuman : n.t === 'Dead-letter queue' ? w.nodeWarn : w.node} />
            <text x="30" y="56" textAnchor="middle">{n.t}</text>
          </g>
        ))}
      </svg>
      <div className={w.runs}>
        <span><i className={w.ok} />Run 18,204 · success · 3.1 s</span>
        <span><i className={w.ok} />Run 18,205 · approved by a person</span>
        <span><i className={w.warn} />Run 18,206 · retried 2× · recovered</span>
      </div>
    </Window>
  );
}

/* 04 · Marketing engine: five agents hand an article down the line, an editor approves. */
export function MarketingDemo() {
  const agents = [['Strategist', 'Found a gap: 1,300 searches/mo'], ['Researcher', 'Read 14 sources'], ['Writer', 'Drafted 2,100 words'], ['Reviewer', 'Removed 1 unsourced claim'], ['Designer', 'Commissioned the cover']];
  return (
    <Window title="content-engine · this week">
      <ol className={w.agents}>
        {agents.map(([a, b], i) => (
          <li key={a} style={{ ['--d' as string]: `${i * 0.75}s` }}><span>{String(i + 1).padStart(2, '0')}</span><b>{a}</b><em>{b}</em><i>✓</i></li>
        ))}
      </ol>
      <div className={w.publish}>
        <div><small>Waiting for the editor</small><b>How CPA firms survive tax season without hiring</b></div>
        <button type="button" tabIndex={-1}>Approve &amp; publish</button>
      </div>
    </Window>
  );
}

/* 05 · Sales engine: research → personal email → a website built for the prospect. */
export function SalesDemo() {
  return (
    <Window title="sales-engine · prospect 214 of 490">
      <div className={w.sales}>
        <div className={w.prospect}>
          <small>Prospect</small>
          <b>Northfield Staffing Group</b>
          <ul>
            <li style={{ ['--d' as string]: '0.2s' }}>News: opened a Dallas branch last month</li>
            <li style={{ ['--d' as string]: '0.9s' }}>Site: 40 open roles, 6 for recruiters</li>
            <li style={{ ['--d' as string]: '1.6s' }}>Stack: Bullhorn, Outlook, Indeed</li>
          </ul>
        </div>
        <div className={w.mail}>
          <small>Draft · grounded in research</small>
          <p className={w.typing}>Saw the Dallas launch. Six recruiter roles open usually means screening is eating the week…</p>
          <div className={w.site}><i /><span>northfield.preview.chronexa.io</span><em>Built for this prospect</em></div>
          <p className={w.approved}>Approved by a person · queued to send</p>
        </div>
      </div>
    </Window>
  );
}

/* 06 · Voice agent: a call is answered, understood and booked on the live calendar. */
export function VoiceDemo() {
  const lines = [['caller', 'Hi, can I get a cleaning this week?'], ['agent', 'Of course. I have Thursday 10:30 or Friday 2:00.'], ['caller', 'Thursday works.'], ['agent', 'Booked. You’ll get a text confirmation now.']];
  return (
    <Window title="voice-agent · inbound call · 02:14 am">
      <div className={w.voice}>
        <div className={w.wave} aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <i key={i} style={{ ['--d' as string]: `${(i % 7) * 0.12}s` }} />)}</div>
        <ul className={w.transcript}>
          {lines.map(([who, t], i) => <li key={t} data-who={who} style={{ ['--d' as string]: `${0.4 + i * 1.1}s` }}>{t}</li>)}
        </ul>
        <div className={w.slot}><small>Live calendar</small><b>Thu · 10:30 am</b><em>Booked ✓</em></div>
      </div>
    </Window>
  );
}

/* 07 · Data platforms: a regulatory feed classified as it arrives, with a completeness check. */
export function PlatformDemo() {
  const feed = [['Circular', 'Mutual funds · disclosure norms', 'Summary ready'], ['Master direction', 'Intermediaries · KYC', 'Summary ready'], ['Order', 'Enforcement · listed entity', 'Sent to a lawyer']];
  return (
    <Window title="regulatory-intelligence · live index">
      <div className={w.platform}>
        <div className={w.counts}>
          <div><small>Documents indexed</small><b>48,212</b></div>
          <div><small>Regulator’s own count</small><b>48,212</b></div>
          <div><small>Completeness</small><b className={w.okText}>Reconciled ✓</b></div>
        </div>
        <svg viewBox="0 0 400 90" className={w.chart} aria-hidden="true"><path d="M0 80 L40 72 L80 74 L120 60 L160 62 L200 48 L240 50 L280 34 L320 36 L360 20 L400 14" /></svg>
        <ul className={w.feed}>
          {feed.map(([a, b, c], i) => <li key={b} style={{ ['--d' as string]: `${1 + i * 0.8}s` }}><span>{a}</span><b>{b}</b><em data-human={c.startsWith('Sent') || undefined}>{c}</em></li>)}
        </ul>
      </div>
    </Window>
  );
}

/* 08 · Brands & commerce: our own LUMIQ campaign film (real footage). */
export function CommerceDemo({ src, poster }: { src: string; poster: string }) {
  return (
    <div className={w.film}>
      <video src={src} poster={poster} muted loop playsInline autoPlay preload="none" aria-label="LUMIQ campaign film" />
      <p><b>LUMIQ</b><span>Our own skincare brand: strategy, store, photography and film</span></p>
    </div>
  );
}
