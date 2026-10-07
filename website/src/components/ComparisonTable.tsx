import styles from './ComparisonTable.module.css';

const Icon = {
  check: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  ),
  excluded: (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M5 10h10" />
    </svg>
  ),
};

export default function ComparisonTable() {
  const rows = [
    { label: 'System ownership', chronexa: 'You own it', inhouse: 'You own it', freelancer: 'You own it', diy: 'Usually rented' },
    { label: 'First deliverable', chronexa: 'A running workflow', inhouse: 'Internal capability', freelancer: 'A scoped build', diy: 'A configured tool' },
    { label: 'Success test', chronexa: 'Agreed before build', inhouse: 'Team dependent', freelancer: 'Varies by brief', diy: 'You define it' },
    { label: 'Process diagnosis', chronexa: Icon.check, inhouse: 'Depends on team', freelancer: 'Varies', diy: Icon.excluded },
    { label: 'Written handover', chronexa: Icon.check, inhouse: 'Internal knowledge', freelancer: 'Varies', diy: 'Vendor docs' },
    { label: 'Post-launch support', chronexa: '30 days included', inhouse: 'Ongoing team', freelancer: 'Contract dependent', diy: 'Vendor support' },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLabel}></th>
              <th className={styles.thHighlight}>Chronexa</th>
              <th>In-house hire</th>
              <th>Freelancer</th>
              <th>DIY tool</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className={styles.tdLabel}>{row.label}</td>
                <td className={styles.tdHighlight}>
                  {typeof row.chronexa === 'string' ? row.chronexa : <span className={styles.tickIn}>{row.chronexa}</span>}
                </td>
                <td>
                  {typeof row.inhouse === 'string' ? row.inhouse : <span className={styles.tickOut}>{row.inhouse}</span>}
                </td>
                <td>
                  {typeof row.freelancer === 'string' ? row.freelancer : <span className={styles.tickOut}>{row.freelancer}</span>}
                </td>
                <td>
                  {typeof row.diy === 'string' ? row.diy : <span className={styles.tickOut}>{row.diy}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
