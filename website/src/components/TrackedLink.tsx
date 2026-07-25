'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { track } from '../lib/analytics';

/**
 * A link that fires an Amplitude event on click.
 *
 * Exists so a whole homepage section doesn't have to become a client component
 * just to record one click — same leaf-client pattern as `BookButton` and
 * `CalcCtaButton`. The sections stay server-rendered; only this ships as JS.
 */
export default function TrackedLink({
  href,
  event,
  props,
  className,
  reveal,
  children,
}: {
  href: string;
  event: string;
  props?: Record<string, unknown>;
  className?: string;
  /** Stagger index for the site-wide `data-reveal` scroll animation. */
  reveal?: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(event, props)}
      {...(reveal === undefined
        ? {}
        : { 'data-reveal': true, style: { '--reveal-i': reveal } as CSSProperties })}
    >
      {children}
    </Link>
  );
}
