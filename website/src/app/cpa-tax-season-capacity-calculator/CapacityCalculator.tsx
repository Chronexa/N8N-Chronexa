'use client';

import { useState } from 'react';
import styles from '../../components/calculators/calculators.module.css';
import SliderField from '../../components/calculators/SliderField';
import LeadBox from '../../components/calculators/LeadBox';
import HeroBar from '../../components/calculators/HeroBar';
import { useEngageOnce } from '../../components/calculators/useEngageOnce';
import { fmtMoney } from '../../components/calculators/format';

// ─── Hidden Backend Constants (The "Secret Sauce") ────────────────────────────
const WEEKS_IN_SEASON      = 14;    // Standard tax season length
const TIME_PER_REVIEW      = 0.75;  // 45 min avg partner review per return
const REWORK_PENALTY       = 0.5;   // 30 min lost per rework kickback
const AI_REWORK_RATE       = 0.05;  // AI drops rework rate to 5%
const AVG_FEE_PER_RETURN   = 750;   // $750 default fee (used only if not shown)
const SOURCE = 'cpa-throughput-simulator';

type Currency = 'USD';

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${Math.round(n)}`;
}

export default function CapacityCalculator() {
  const currency: Currency = 'USD';
  const [totalReturns,  setTotalReturns]  = useState(1000);
  const [partners,      setPartners]      = useState(2);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(60);
  const [reworkRate,    setReworkRate]    = useState(30);

  const onEngage = useEngageOnce(SOURCE);

  // ─── Core Math ─────────────────────────────────────────────────────────────
  const partnerTotalHours    = partners * WEEKS_IN_SEASON * hoursPerWeek;
  const reworkFraction       = reworkRate / 100;
  const maxReturnsCurrent    = partnerTotalHours / (TIME_PER_REVIEW + reworkFraction * REWORK_PENALTY);
  const maxReturnsAI         = partnerTotalHours / (TIME_PER_REVIEW + AI_REWORK_RATE * REWORK_PENALTY);

  const hardCap              = Math.round(Math.min(maxReturnsCurrent, totalReturns));
  const unlockedCapacity     = Math.round(maxReturnsAI);
  const missedClients        = Math.max(0, Math.round(maxReturnsAI - maxReturnsCurrent));
  const missedRevenue        = missedClients * AVG_FEE_PER_RETURN;

  const reworkReturns        = Math.round(totalReturns * reworkFraction);
  const reworkHoursWasted    = reworkReturns * REWORK_PENALTY;

  // Is the firm currently over-capacity?
  const overCapacity         = totalReturns > maxReturnsCurrent;

  return (
    <div className={styles.calc}>

      {/* ── LEFT: INPUTS ───────────────────────────────────────────────── */}
      <div className={styles.inputs}>

        <div className={styles.calcIntro}>
          <p className={styles.calcIntroText}>
            Hiring more juniors won&apos;t solve your capacity problem.{' '}
            <strong>The constraint is your partners&apos; time.</strong> If you speed up juniors without fixing the error rate, you just create a larger pile of unreviewed returns on the partner&apos;s desk. Model your true max throughput.
          </p>
        </div>

        <SliderField
          label="Total Tax Returns (1040/1120)"
          displayValue={totalReturns.toLocaleString('en-US')}
          value={totalReturns}
          min={100}
          max={10000}
          step={50}
          hint="Total returns your firm targets per season"
          onChange={setTotalReturns}
          onEngage={onEngage}
        />
        <SliderField
          label="Number of Reviewing Partners"
          displayValue={partners.toString()}
          value={partners}
          min={1}
          max={20}
          step={1}
          hint="Partners who perform final review and sign-off"
          onChange={setPartners}
          onEngage={onEngage}
        />
        <SliderField
          label="Partner Hours / Week During Season"
          displayValue={`${hoursPerWeek} h/wk`}
          value={hoursPerWeek}
          min={40}
          max={80}
          step={5}
          hint={`${WEEKS_IN_SEASON}-week season · Total review capacity: ${Math.round(partnerTotalHours).toLocaleString()} hours`}
          onChange={setHoursPerWeek}
          onEngage={onEngage}
        />
        <SliderField
          label="Current Rework Loop Rate"
          displayValue={`${reworkRate}%`}
          value={reworkRate}
          min={5}
          max={60}
          step={5}
          hint="% of returns kicked back to juniors for errors or missing docs. Each kickback costs the partner ~30 min."
          onChange={setReworkRate}
          onEngage={onEngage}
        />
      </div>

      {/* ── RIGHT: RESULTS ─────────────────────────────────────────────── */}
      <div className={styles.results} aria-live="polite">

        {/* The "Ouch" — the hard capacity cap */}
        <div className={styles.ouchBlock}>
          <p className={styles.resultKicker}>Your Reviewer Bottleneck Hard-Cap</p>
          <p className={styles.resultBig} data-ouch="true">
            {hardCap.toLocaleString('en-US')} returns
          </p>
          <p className={styles.resultBigLabel}>
            {overCapacity
              ? `⚠ You are targeting ${totalReturns.toLocaleString()} returns but your partners can only sign off on ${hardCap.toLocaleString()}. You are operating over capacity.`
              : `Your review process structurally prevents your partners from signing more than ${hardCap.toLocaleString()} returns — regardless of how many juniors you hire.`
            }
          </p>
        </div>

        {/* The "Unlock" — green capacity freed */}
        <div className={styles.subResults}>
          <div className={styles.subResult}>
            <p className={`${styles.subValue} ${styles.resultGreen}`}>
              +{missedClients.toLocaleString('en-US')} returns
            </p>
            <p className={styles.subLabel}>
              Additional returns your existing partners could sign by reducing rework from {reworkRate}% to 5%
            </p>
          </div>
          <div className={styles.subResult}>
            <p className={`${styles.subValue} ${styles.resultGreen}`}>
              {fmt(missedRevenue)}
            </p>
            <p className={styles.subLabel}>
              In uncaptured revenue — without hiring a single new partner
            </p>
          </div>
        </div>

        {/* The "Aha" Insight */}
        <div className={styles.insightStrip}>
          <p className={styles.insightText}>
            <strong>The hidden cost of rework:</strong>{' '}
            {reworkReturns.toLocaleString()} of your returns are kicked back this season, 
            wasting <strong>{Math.round(reworkHoursWasted).toLocaleString()} partner-hours</strong> on re-review.{' '}
            AI eliminates 85% of rework by pre-flagging missing documents, mismatches, and outliers before the return ever reaches the partner.
          </p>
        </div>

        {/* Visual: before vs after capacity */}
        <HeroBar
          label="Partner Review Capacity vs. Demand"
          beforeValue={hardCap}
          beforeLabel={`Current cap: ${hardCap.toLocaleString()}`}
          afterValue={unlockedCapacity}
          afterLabel={`AI unlocked: ${unlockedCapacity.toLocaleString()}`}
        />

        <LeadBox
          source={SOURCE}
          headline="Download the Full Board Report — formatted to show your Partners and CFO"
          sub="A breakdown of exactly where your review bottleneck is occurring, return volume vs. partner capacity curves, and a 12-month rework elimination roadmap."
          successText="Done — your capacity analysis is on its way. Book the workflow audit below to model this against your specific tax software stack."
          buildUsecase={() =>
            `CPA Throughput Simulator: ${totalReturns} returns · ${partners} partners · ${hoursPerWeek}h/wk · ${reworkRate}% rework → cap ${hardCap}, unlocked ${unlockedCapacity}, missed revenue ${fmt(missedRevenue)}`
          }
          buildMeta={() => ({
            calculator: SOURCE,
            currency,
            inputs: { totalReturns, partners, hoursPerWeek, reworkRate },
            results: {
              hardCap,
              unlockedCapacity,
              missedClients,
              missedRevenue: Math.round(missedRevenue),
              reworkHoursWasted: Math.round(reworkHoursWasted),
              overCapacity,
            },
          })}
          resultBand={() => {
            if (missedRevenue > 500_000) return 'critical';
            if (missedRevenue > 100_000) return 'high';
            return 'medium';
          }}
        />
      </div>
    </div>
  );
}
