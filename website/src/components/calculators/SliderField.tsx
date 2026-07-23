'use client';

import { useState, useEffect } from 'react';
import styles from './calculators.module.css';

/** One labelled slider row: label + range input + number input (+ optional hint). */
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
  displayValue?: string; // Optional if we just want to rely on the input
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  ariaLabel?: string;
  onChange: (value: number) => void;
  onEngage: () => void;
}) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync internal state if external value changes
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    onEngage();
    let num = Number(inputValue.replace(/,/g, ''));
    if (isNaN(num)) num = value;
    if (num < min) num = min;
    if (num > max) num = max;
    setInputValue(String(num));
    onChange(num);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <label className={styles.field}>
      <span className={styles.fieldTop}>
        <span className={styles.fieldLabel}>{label}</span>
      </span>
      <div className={styles.inputRow}>
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
        <input
          type="text"
          inputMode="decimal"
          className={styles.numberInput}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-label={`${ariaLabel ?? label} exact value`}
        />
      </div>
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </label>
  );
}
