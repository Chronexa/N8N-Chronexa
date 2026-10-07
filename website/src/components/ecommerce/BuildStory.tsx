import VideoFrame from '../../app/shopify-store-build/VideoFrame';
import { FILMS } from '../../app/shopify-store-build/content';
import { AUDIT_FINDINGS, AUDIT_SCORES, BENCHMARK, CHAPTERS, type Chapter } from '../../lib/ecommerce-story';
import s from './ecommerce.module.css';

/**
 * "How we built LUMIQ, decision by decision." One chapter per decision: what we saw, what we did,
 * why it matters, next to the real footage or artefact. Chapters scroll normally (no tabs), so the
 * whole story is in the DOM for search and for readers who skim.
 */

function Media({ c }: { c: Chapter }) {
  const m = c.media;
  if (m.type === 'audit') {
    return (
      <div className={s.artefact}>
        <p className={s.artefactHead}>FIRST AUDIT OF OUR OWN LUMIQ STORE · 22 SEPT 2026</p>
        <ul className={s.scores}>
          {AUDIT_SCORES.map((x) => (
            <li key={x.area}>
              <span>{x.area}</span>
              <i style={{ ['--w' as string]: `${x.score * 10}%` }} aria-hidden="true" />
              <b>{x.score}/10</b>
            </li>
          ))}
        </ul>
        <p className={s.artefactSub}>What we found</p>
        <ul className={s.found}>{AUDIT_FINDINGS.map((f) => <li key={f}>{f}</li>)}</ul>
      </div>
    );
  }
  if (m.type === 'benchmark') {
    return (
      <div className={s.artefact}>
        <p className={s.artefactHead}>FIVE MECHANISMS WE KEPT</p>
        <ol className={s.mech}>{BENCHMARK.map((b, i) => <li key={b.h}><span>{String(i + 1).padStart(2, '0')}</span><div><b>{b.h}</b><p>{b.p}</p></div></li>)}</ol>
      </div>
    );
  }
  if (m.type === 'films') {
    const f = FILMS[0];
    return (
      <div className={s.films}>
        <VideoFrame id="eco-film-main" src={f.main.src} poster={f.main.poster} label={f.main.label} className={s.filmMain} />
        <div className={s.filmSide}>
          {f.side.map((x) => <VideoFrame key={x.src} id="eco-film-side" src={x.src} poster={x.poster} label={x.label} className={s.filmSmall} />)}
        </div>
      </div>
    );
  }
  return (
    <VideoFrame
      id={`eco-${c.id}`} frame={m.frame} src={m.src} poster={m.poster} label={m.label}
      aspect={m.aspect} address={m.address}
    />
  );
}

export default function BuildStory() {
  return (
    <ol className={s.story}>
      {CHAPTERS.map((c, i) => (
        <li key={c.id} className={`${s.chapter} ${i % 2 ? s.flip : ''}`} id={`story-${c.id}`}>
          <div className={`${s.chapterMedia} ${c.media.type === 'video' && c.media.frame === 'phone' ? s.phoneMedia : ''}`}>
            <Media c={c} />
          </div>
          <div className={s.chapterText}>
            <p className={s.chapterNo}><span>{String(i + 1).padStart(2, '0')}</span>{c.tab}</p>
            <h3>{c.title}</h3>
            <dl>
              <div><dt>What we saw</dt><dd>{c.saw}</dd></div>
              <div><dt>What we did</dt><dd>{c.did}</dd></div>
              <div className={s.why}><dt>Why it matters</dt><dd>{c.why}</dd></div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
