type IconProps = { className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

/** Starting small — used on "every startup starts below the line." */
export function IconSpark({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
    </svg>
  );
}

/** Time pressure — used on "extra work loses to the next urgent thing." */
export function IconClock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

/** Deferred / on hold — used on "the crossing keeps getting deferred." */
export function IconHourglass({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.5 3h11M6.5 21h11M7.5 3c0 4 2.7 6.2 4.5 6.2S16.5 7 16.5 3M7.5 21c0-4 2.7-6.2 4.5-6.2s4.5 2.2 4.5 6.2" />
    </svg>
  );
}

/** Can no longer be ignored — used on "the Headcount Tax." */
export function IconAlert({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v6" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** One measurable diagnosis — used on Method step 1. */
export function IconTarget({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Integrated into your existing stack — used on Method step 2. */
export function IconLink({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9.5 14.5l5-5" />
      <path d="M8 12l-2.4 2.4a3 3 0 0 0 4.24 4.24L12 16.5" />
      <path d="M16 12l2.4-2.4a3 3 0 0 0-4.24-4.24L12 7.5" />
    </svg>
  );
}

/** Adjustable inputs — used on the diagnostic's "Your Growth" panel header. */
export function IconSliders({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 6h14M5 12h14M5 18h14" />
      <circle cx="9" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="10" cy="18" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A team of people — used on the diagnostic's "Headcount Tax" panel header. */
export function IconTeam({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <path d="M15.5 8.8a2.6 2.6 0 1 1 0-5.1" />
      <path d="M15 13.6c2.6.3 4.8 2.4 4.8 5.4" />
    </svg>
  );
}

/** A takeaway / the goal — used on the diagnostic's footer insight line. */
export function IconBulb({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.2 11.1c.5.3.8.9.8 1.5V16h4.8v-.4c0-.6.3-1.2.8-1.5A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

/** Systems compound, headcount doesn't — used on Method step 3. */
export function IconCompound({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 19.5h3.4v-4.4H4.5v4.4Zm5.3 0h3.4V10h-3.4v9.5Zm5.3 0h3.4V6h-3.4v13.5Z" />
      <path d="M13.5 5l3-3 3 3" />
    </svg>
  );
}
