/**
 * The shared line-icon set (2026-08-19).
 *
 * Until now every icon on the site was inlined by hand inside whichever
 * component needed it — 12 files carried their own copies at three different
 * stroke weights and two grids, which is why nothing looked like one system.
 *
 * House rules, taken from the reference site Ankit chose (ayautomate.services)
 * and adapted to our palette:
 *   • 24×24 grid, 1.5 stroke, round caps and joins, no fills.
 *   • `currentColor` only, so colour is the caller's decision. On cards they
 *     render in --brand-green-ink; nowhere else do they carry colour.
 *   • Geometric and literal. An icon labels a card, it does not decorate one.
 *     If you cannot say in one word what it depicts, it is the wrong icon.
 *   • Never a substitute for the emoji we do not use, and never a bullet.
 */

export type IconName =
  | 'document'
  | 'documents'
  | 'search'
  | 'shield'
  | 'flag'
  | 'flow'
  | 'database'
  | 'clock'
  | 'inbox'
  | 'people'
  | 'lock'
  | 'chart'
  | 'sync'
  | 'plug'
  | 'check'
  | 'arrow';

const PATHS: Record<IconName, React.ReactNode> = {
  document: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>,
  documents: <><path d="M9 3h7l4 4v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M16 3v4h4" /><path d="M5 7v12a2 2 0 0 0 2 2h9" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-3.5-3.5" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z" /><path d="m9.5 12 1.8 1.8 3.4-3.6" /></>,
  flag: <><path d="M6 21V4" /><path d="M6 4h10l-1.8 3.4L16 11H6" /></>,
  flow: <><rect x="3" y="4" width="6" height="5" rx="1" /><rect x="15" y="15" width="6" height="5" rx="1" /><rect x="3" y="15" width="6" height="5" rx="1" /><path d="M9 6.5h4a2 2 0 0 1 2 2v9" /><path d="M9 17.5h3" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></>,
  inbox: <><path d="M4 13h4l1.5 3h5L16 13h4" /><path d="M5.5 5h13l1.5 8v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4l1.5-8Z" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5.5a3 3 0 0 1 0 5.6" /><path d="M17.5 14.5A6 6 0 0 1 21 20" /></>,
  lock: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  chart: <><path d="M4 20h16" /><path d="M7 20v-6M12 20V7M17 20v-9" /></>,
  sync: <><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" /><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" /><path d="M4 20v-4.5h4.5M20 4v4.5h-4.5" /></>,
  plug: <><path d="M9 3v6M15 3v6" /><path d="M6 9h12v2a6 6 0 0 1-6 6 6 6 0 0 1-6-6V9Z" /><path d="M12 17v4" /></>,
  check: <><path d="m4 12.5 5 5 11-11" /></>,
  arrow: <><path d="M4 12h14M13 7l5 5-5 5" /></>,
};

export default function Icon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
