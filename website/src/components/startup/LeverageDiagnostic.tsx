'use client';

import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import LeverageLineChart, { RATIO_BELOW_MAX, RATIO_AT_MAX } from './LeverageLineChart';
import layouts from './startup-layouts.module.css';
import styles from './LeverageDiagnostic.module.css';
import { IconSliders, IconTeam, IconBulb } from './icons';

type Zone = 'below' | 'at' | 'above';

function SliderInput({
  label, value, onChange, min, max, step = 1, suffix, hint, tone,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  hint: string;
  tone: 'output' | 'headcount';
}) {
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label}</span>
      <div className={styles.sliderInputRow}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={styles.slider}
          data-tone={tone}
          aria-label={label}
        />
        <span className={styles.numberBox}>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
            aria-label={`${label} — exact value`}
          />
          {suffix && <span className={styles.numberSuffix}>{suffix}</span>}
        </span>
      </div>
      <span className={styles.sliderHint}>{hint}</span>
    </div>
  );
}

function CellHead({ icon, tone, children }: { icon: ReactNode; tone: 'accent' | 'amber'; children: ReactNode }) {
  return (
    <div className={styles.cellHead}>
      <span className={layouts.iconBadge} data-tone={tone} data-soft="true">{icon}</span>
      <h3 className={styles.cellTitle}>{children}</h3>
    </div>
  );
}

function Legend() {
  return (
    <ul className={styles.legend}>
      <li><span className={styles.swatch} data-tone="breakout" /> Output (systems-scaled)</li>
      <li><span className={styles.swatch} data-tone="headcount" /> Headcount</li>
      <li><span className={styles.swatch} data-tone="trap" /> Output (trapped)</li>
    </ul>
  );
}

export default function LeverageDiagnostic() {
  const [outputGrowth, setOutputGrowth] = useState(30); // % output growth over last 2 quarters
  const [headcountGrowth, setHeadcountGrowth] = useState(25); // % headcount growth over same period
  const [teamSize, setTeamSize] = useState(20); // current headcount — feeds only the ₹ Headcount Tax below

  const result = useMemo(() => {
    // Cap ratio to avoid infinity when headcount growth is 0
    if (headcountGrowth <= 0) {
      return { ratio: 5.0, zone: 'above' as Zone, label: 'Systems-Scaled' };
    }
    const ratio = Math.round((outputGrowth / headcountGrowth) * 100) / 100;
    if (ratio < RATIO_BELOW_MAX) return { ratio, zone: 'below' as Zone, label: 'Deep in the 1:1 Trap' };
    if (ratio <= RATIO_AT_MAX) return { ratio, zone: 'at' as Zone, label: 'At the 1:1 Trap boundary' };
    return { ratio, zone: 'above' as Zone, label: 'Above the Line' };
  }, [outputGrowth, headcountGrowth]);

  // Headcount Tax — now computed from the team size the visitor actually
  // enters, not a hardcoded assumption. avgCTCPerHead stays a stated estimate
  // (surfaced honestly below), since a per-role breakdown is out of scope here.
  const avgCTCPerHead = 6.0; // lakhs, blended estimate
  const headcountGrowthAbsolute = Math.round(teamSize * (headcountGrowth / 100));
  const annualHeadcountBurn = headcountGrowthAbsolute * avgCTCPerHead * 1.18; // +18% statutory
  const automatableShare = annualHeadcountBurn * 0.65; // McKinsey 60-70% midpoint

  const goalNote = result.zone === 'above'
    ? 'You’re compounding output faster than cost — keep the next hire reserved for judgment work, not backlog.'
    : 'Stay above the line. Let systems multiply output while headcount grows on purpose, not by default.';

  return (
    <section id="diagnostic" className="section-light reveal-ready">
      <div className="container" data-reveal>
        <p className="eyebrow">The Diagnostic</p>
        <h2 className={layouts.sectionHead} style={{ maxWidth: '24ch' }}>Where do you actually stand?</h2>
        <p className={layouts.sectionLede}>
          Two numbers you already know. Ten seconds of math. A verdict about your company you can&apos;t unsee.
        </p>

        {/* One card, internal dividers only — no gaps, no separate boxes. */}
        <div className={styles.card}>
          <div className={styles.topRow}>
            <div className={styles.growthCol}>
              <CellHead icon={<IconSliders />} tone="accent">Your Growth</CellHead>
              <p className={styles.colSubtitle}>AI systems compound your output. Headcount just adds to your cost.</p>
              <SliderInput
                label="Output growth (last 2 quarters)"
                hint="Revenue, customers served, or your north-star metric"
                value={outputGrowth}
                onChange={setOutputGrowth}
                min={0}
                max={100}
                suffix="%"
                tone="output"
              />
              <SliderInput
                label="Headcount growth (same period)"
                hint="Full-time team size increase, including contractors"
                value={headcountGrowth}
                onChange={setHeadcountGrowth}
                min={0}
                max={100}
                suffix="%"
                tone="headcount"
              />
            </div>

            <div className={styles.taxCol}>
              <CellHead icon={<IconTeam />} tone="amber">Headcount Tax</CellHead>
              <span className={`display-num ${styles.taxValue}`}>₹{automatableShare.toFixed(1)}L</span>
              <p className={styles.taxCaption}>
                Estimated annual cost of work that could be absorbed by a system instead of a hire (McKinsey: 60–70% of routine hours).
              </p>
              <SliderInput
                label="Given a team of"
                hint="Assumes ~₹6L average blended CTC per new hire, +18% statutory costs — adjust for your own numbers."
                value={teamSize}
                onChange={setTeamSize}
                min={5}
                max={150}
                step={5}
                suffix="people"
                tone="headcount"
              />
            </div>
          </div>

          <div className={styles.chartSection}>
            <div className={styles.chartHead}>
              <div>
                <span className={styles.verdictLabel}>Your Leverage Ratio</span>
                <div className={styles.ratioRow}>
                  <span className={`display-num ${styles.ratioValue}`} data-zone={result.zone}>{result.ratio.toFixed(1)}x</span>
                  <span className={styles.verdictBadge} data-zone={result.zone}>{result.label}</span>
                </div>
              </div>
              <Legend />
            </div>
            <LeverageLineChart leverageRatio={result.ratio} />
          </div>

          <div className={styles.footerRow}>
            <p className={styles.goalNote}>
              <span className={layouts.iconBadge} data-tone="accent" data-soft="true"><IconBulb /></span>
              <span><strong>The goal:</strong> {goalNote}</span>
            </p>
            <a href="#method" className="btn-outline">
              See how we&apos;d fix this <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
