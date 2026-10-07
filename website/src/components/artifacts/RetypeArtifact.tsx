import styles from './RetypeArtifact.module.css';

/**
 * "This is your Tuesday" — the document on one side, the system on the other,
 * and the digit that got transposed between them.
 *
 * Competitor research (2026-08-17) found the strongest device on any page in this
 * market is not an icon set or an abstract diagram: it is a realistic mock of the
 * work itself, so the buyer watches their own process fail in front of them.
 * Docsumo does it with a mortgage email thread. This is the data-entry equivalent.
 *
 * Deliberately hand-built in HTML and CSS: no image, no animation library, no
 * canvas. It stays crisp at any width, it is readable to a screen reader through
 * the caption and table semantics, and it costs nothing to load.
 *
 * The numbers here are illustrative, not a client's. Per the content doctrine,
 * illustrative material never carries a company name or an attributed source.
 */
export default function RetypeArtifact() {
  return (
    <figure className={styles.wrap}>
      <div className={styles.panes}>
        {/* ── The document that arrived ─────────────────────────────── */}
        <div className={styles.doc} aria-hidden="true">
          <div className={styles.docHead}>
            <span className={styles.docKind}>Supplier invoice</span>
            <span className={styles.docFile}>scan_0412.pdf</span>
          </div>
          <div className={styles.docBody}>
            <div className={styles.docRule} style={{ width: '62%' }} />
            <div className={styles.docRule} style={{ width: '38%' }} />
            <div className={styles.docSpacer} />
            <dl className={styles.docFields}>
              <div><dt>Invoice no.</dt><dd>INV-99417</dd></div>
              <div><dt>Date</dt><dd>04 Aug 2026</dd></div>
              <div className={styles.docHighlight}>
                <dt>Total due</dt><dd>4,182.60</dd>
              </div>
            </dl>
            <div className={styles.docRule} style={{ width: '48%' }} />
            <div className={styles.docRule} style={{ width: '71%' }} />
          </div>
        </div>

        {/* ── The system it gets typed into ─────────────────────────── */}
        <div className={styles.sheet} aria-hidden="true">
          <div className={styles.sheetHead}>
            <span className={styles.sheetKind}>Your accounting system</span>
          </div>
          <div className={styles.sheetGrid}>
            <div className={styles.sheetRow}>
              <span className={styles.sheetCol}>Ref</span>
              <span className={styles.sheetCol}>Date</span>
              <span className={styles.sheetCol}>Amount</span>
            </div>
            <div className={styles.sheetRow}>
              <span>INV-99415</span><span>02 Aug</span><span>1,204.00</span>
            </div>
            <div className={styles.sheetRow}>
              <span>INV-99416</span><span>03 Aug</span><span>880.40</span>
            </div>
            <div className={`${styles.sheetRow} ${styles.sheetActive}`}>
              <span>INV-99417</span><span>04 Aug</span>
              <span className={styles.sheetError}>
                4,128.60
                <span className={styles.caret} />
              </span>
            </div>
          </div>
          <p className={styles.flag}>
            <span className={styles.flagDot} />
            Two digits swapped. Nobody notices until March.
          </p>
        </div>
      </div>

      <figcaption className={styles.caption}>
        Read off one document, typed into another system. A few hundred times a month.
      </figcaption>
    </figure>
  );
}
