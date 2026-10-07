import RoiCalculator from './RoiCalculator';
import { logoFor } from './logos';
import type { Visual } from '../../lib/growth-extras';
import v from './visuals.module.css';

function Logo({ name, size = 26 }: { name: string; size?: number }) {
  const src = logoFor(name);
  return src
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={src} alt={name} width={size} height={size} className={v.logo} />
    : <span className={v.mono} style={{ width: size, height: size }}>{name.slice(0, 2)}</span>;
}

function Frame({ title, children, foot }: { title: string; children: React.ReactNode; foot?: string }) {
  return (
    <div className={v.frame}>
      <div className={v.bar}><i /><i /><i /><span>{title}</span></div>
      <div className={v.body}>{children}</div>
      {foot && <p className={v.foot}>{foot}</p>}
    </div>
  );
}

export default function HeroVisual({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case 'roi':
      return <RoiCalculator />;
    case 'list':
      return (
        <Frame title={visual.title} foot={visual.foot}>
          {visual.rows.map((r, i) => (
            <div key={r.k} className={v.row} style={{ animationDelay: `${i * 0.12}s` }}>
              <span className={v.num}>{String(i + 1).padStart(2, '0')}</span><b>{r.k}</b>{r.v && <em className={v.pill}>{r.v}</em>}
            </div>
          ))}
        </Frame>
      );
    case 'timeline':
      return (
        <Frame title={visual.title} foot={visual.foot}>
          {visual.days.map((d, i) => (
            <div key={d.d} className={`${v.day} ${d.done ? v.dayDone : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
              <span>{d.d}</span><b>{d.t}</b><i aria-hidden="true">{d.done ? '✓' : ''}</i>
            </div>
          ))}
        </Frame>
      );
    case 'board':
      return (
        <Frame title={visual.title}>
          <div className={v.board}>
            <div><h4>Before</h4>{visual.before.map(t => <p key={t} className={v.before}>{t}</p>)}</div>
            <div><h4>With Chronexa</h4>{visual.after.map((t, i) => <p key={t} className={v.after} style={{ animationDelay: `${0.3 + i * 0.12}s` }}>{t}</p>)}</div>
          </div>
        </Frame>
      );
    case 'bars':
      return (
        <Frame title={visual.title} foot={visual.foot}>
          {visual.rows.map((r, i) => (
            <div key={r.k} className={v.barRow}>
              <div><b>{r.k}</b><span>{r.label}</span></div>
              <div className={v.track}><i style={{ width: `${Math.max(r.v, 2)}%`, animationDelay: `${i * 0.12}s` }} /></div>
            </div>
          ))}
        </Frame>
      );
    case 'chat':
      return (
        <Frame title={visual.title}>
          <div className={v.chat}>
            <p className={v.q}>{visual.q}</p>
            <ul className={v.steps}>{visual.steps.map((s, i) => <li key={s} style={{ animationDelay: `${0.2 + i * 0.25}s` }}>{s}</li>)}</ul>
            <p className={v.a}>{visual.a}</p>
            <div className={v.sources}>{visual.sources.map(s => <span key={s}>{s}</span>)}</div>
          </div>
        </Frame>
      );
    case 'hub':
      return (
        <Frame title={visual.title} foot={visual.foot}>
          <div className={v.hub}>
            <div className={v.core}>{visual.center}</div>
            {visual.tools.map((t, i) => {
              const a = (i / visual.tools.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <div key={t} className={v.node} style={{ left: `${50 + 38 * Math.cos(a)}%`, top: `${50 + 38 * Math.sin(a)}%` }}>
                  <Logo name={t} size={28} /><span>{t}</span>
                </div>
              );
            })}
            <svg className={v.spokes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {visual.tools.map((t, i) => {
                const a = (i / visual.tools.length) * Math.PI * 2 - Math.PI / 2;
                return <line key={t} x1="50" y1="50" x2={50 + 38 * Math.cos(a)} y2={50 + 38 * Math.sin(a)} />;
              })}
            </svg>
          </div>
        </Frame>
      );
    case 'slack':
      return (
        <div className={v.slack}>
          <div className={v.slackTop}><Logo name="Slack" size={18} /><b>{visual.channel}</b></div>
          <div className={v.slackMsg}>
            <span className={v.avatar}>C</span>
            <div>
              <p className={v.slackHead}><b>Chronexa Briefing</b><span className={v.app}>APP</span><time>{visual.time}</time></p>
              <p className={v.slackIntro}>Good morning. Here is what changed overnight and what needs you today.</p>
              {visual.lines.map((l, i) => <p key={l.k} className={v.slackLine} style={{ animationDelay: `${0.2 + i * 0.15}s` }}><b>{l.k}</b> {l.t}</p>)}
            </div>
          </div>
        </div>
      );
    case 'inbox':
      return (
        <Frame title="INBOX · SORTED BEFORE YOU OPENED IT">
          {visual.rows.map((r, i) => (
            <div key={r.from} className={v.mail} style={{ animationDelay: `${i * 0.12}s` }}>
              <div><b>{r.from}</b><span>{r.s}</span></div>
              <em className={`${v.tag} ${v[r.tone]}`}>{r.tag}</em>
            </div>
          ))}
        </Frame>
      );
    case 'migrate':
      return (
        <Frame title="MIGRATION PLAN">
          <div className={v.migrate}>
            <div>{visual.from.map(t => <p key={t}><Logo name={t} size={22} />{t}</p>)}</div>
            <span aria-hidden="true">→</span>
            <div>{visual.to.map(t => <p key={t} className={v.to}><Logo name={t} size={22} />{t}</p>)}</div>
          </div>
          {visual.steps.map((s, i) => <div key={s.k} className={v.row}><span className={v.num}>{String(i + 1).padStart(2, '0')}</span><b>{s.k}</b><em className={v.pill}>{s.v}</em></div>)}
        </Frame>
      );
    case 'ladder':
      return (
        <Frame title="THREE LEVELS OF AUTOMATION">
          <div className={v.ladder}>
            {visual.levels.map((l, i) => (
              <div key={l.k} style={{ marginLeft: `${i * 9}%`, animationDelay: `${i * 0.2}s` }} className={i === visual.levels.length - 1 ? v.top : ''}>
                <span>LEVEL {i + 1}</span><b>{l.k}</b><p>{l.d}</p><em>{l.v}</em>
              </div>
            ))}
          </div>
        </Frame>
      );
  }
}

export { Logo };
