import type { Metadata } from 'next';
import { CAMPAIGN_PAGES, campaignUrl, type CampaignPage } from '../../../lib/campaigns';
import styles from './campaigns.module.css';

/**
 * Private index of every landing page we run. Not linked from anywhere on the site and
 * never indexed — bookmark the URL. Add new pages to src/lib/campaigns.ts, not here.
 */
export const metadata: Metadata = {
  title: 'Landing Page Index (internal)',
  robots: { index: false, follow: false, nocache: true },
};

const GROUPS: { key: CampaignPage['traffic']; heading: string; blurb: string }[] = [
  {
    key: 'organic',
    heading: 'Pages that chase Google',
    blurb:
      'These are in the site menu and in the sitemap. They are meant to rank. Each one owns a different search topic so they do not compete with each other.',
  },
  {
    key: 'paid',
    heading: 'Ad landing pages on chronexa.io',
    blurb:
      'People only reach these by clicking an ad. Hidden from the menu and from Google on purpose, so they never steal search traffic from the pages above.',
  },
  {
    key: 'external',
    heading: 'Ad landing pages hosted elsewhere',
    blurb:
      'Built in a different project, so they will never appear anywhere on chronexa.io. Listed here so everything is in one place.',
  },
];

function Row({ c }: { c: CampaignPage }) {
  const url = campaignUrl(c);
  return (
    <li className={styles.row}>
      <div className={styles.rowHead}>
        <a href={url} className={styles.rowName} target="_blank" rel="noopener noreferrer">
          {c.name} <span aria-hidden="true">→</span>
        </a>
        <span className={styles.tags}>
          <span className={c.indexed ? styles.tagOn : styles.tagOff}>
            {c.indexed ? 'In Google' : 'Hidden from Google'}
          </span>
          <span className={c.inNav ? styles.tagOn : styles.tagOff}>
            {c.inNav ? 'In the menu' : 'Not in the menu'}
          </span>
        </span>
      </div>
      <p className={styles.url}>{url}</p>
      <p className={styles.purpose}>{c.purpose}</p>
      {c.notes ? <p className={styles.notes}>{c.notes}</p> : null}
      <p className={styles.meta}>Live since {c.launched}</p>
    </li>
  );
}

export default function InternalCampaignsPage() {
  return (
    <section className="section-light">
      <div className="container">
        <p className="eyebrow">Internal — not linked, not indexed</p>
        <h1 className={styles.h1}>Every landing page we run</h1>
        <p className={styles.lede}>
          One list of every page built for a launch or an ad campaign, wherever it is hosted.
          To add a new one, add an entry to <code className={styles.code}>src/lib/campaigns.ts</code>{' '}
          — the instructions at the top of that file say what else each type needs.
        </p>

        {GROUPS.map((g) => {
          const rows = CAMPAIGN_PAGES.filter((c) => c.traffic === g.key);
          if (!rows.length) return null;
          return (
            <div key={g.key} className={styles.group}>
              <h2 className={styles.h2}>{g.heading}</h2>
              <p className={styles.groupBlurb}>{g.blurb}</p>
              <ul className={styles.list}>
                {rows.map((c) => (
                  <Row key={c.path} c={c} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
