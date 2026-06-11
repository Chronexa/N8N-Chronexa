'use client';

import styles from './calculators.module.css';
import type { Currency } from './format';

export default function CurrencyToggle({
  currency,
  onSwitch,
}: {
  currency: Currency;
  onSwitch: (c: Currency) => void;
}) {
  return (
    <div className={styles.currencyRow} role="group" aria-label="Currency">
      <button type="button" className={styles.currencyBtn} data-active={currency === 'USD'} onClick={() => onSwitch('USD')}>
        $ USD
      </button>
      <button type="button" className={styles.currencyBtn} data-active={currency === 'INR'} onClick={() => onSwitch('INR')}>
        ₹ INR
      </button>
    </div>
  );
}
