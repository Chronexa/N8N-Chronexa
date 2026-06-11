'use client';

import styles from './calculators.module.css';

/** One labelled slider row: label + live value + range input (+ optional hint). */
export default function SliderField({
  label,
  displayValue,
  value,
  min,
  max,
  step,
  hint,
  ariaLabel,
  onChange,
  onEngage,
}: {
  label: string;
  displayValue: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  ariaLabel?: string;
  onChange: (value: number) => void;
  onEngage: () => void;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldTop}>
        <span className={styles.fieldLabel}>{label}</span>
        <span className={styles.fieldValue}>{displayValue}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        className={styles.range}
        aria-label={ariaLabel ?? label}
        onInput={onEngage}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </label>
  );
}
