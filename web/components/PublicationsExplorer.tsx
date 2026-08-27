'use client';

import { useMemo, useState } from 'react';
import type { PublicationWithCode } from '@/lib/publications';
import { labelFor } from '@/lib/publications';
import PublicationList from './PublicationList';
import styles from './PublicationsExplorer.module.css';

export default function PublicationsExplorer({ publications }: { publications: PublicationWithCode[] }) {
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [awardedOnly, setAwardedOnly] = useState(false);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      const key = pub.publicationType || 'other';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [publications]);

  const years = useMemo(() => {
    const set = new Set(publications.map((p) => p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [publications]);

  const filtered = useMemo(() => {
    let result = publications;

    if (activeType) {
      result = result.filter((p) => (p.publicationType || 'other') === activeType);
    }
    if (activeYear !== null) {
      result = result.filter((p) => p.year === activeYear);
    }
    if (awardedOnly) {
      result = result.filter((p) => p.awarded);
    }

    return result;
  }, [publications, activeType, activeYear, awardedOnly]);

  return (
    <div>
      <div className={styles.filterRow} role="group" aria-label="Filter by publication type">
        <button
          type="button"
          className={`${styles.filterButton} ${activeType === null ? styles.filterButtonActive : ''}`}
          onClick={() => setActiveType(null)}
          aria-pressed={activeType === null}
        >
          All <span className={styles.count}>{publications.length}</span>
        </button>

        {types.map(([type, count]) => (
          <button
            type="button"
            key={type}
            className={`${styles.filterButton} ${activeType === type ? styles.filterButtonActive : ''}`}
            onClick={() => setActiveType(type)}
            aria-pressed={activeType === type}
          >
            {labelFor(type)} <span className={styles.count}>{count}</span>
          </button>
        ))}
      </div>

      <div className={styles.secondaryRow}>
        <select
          value={activeYear ?? 'all'}
          onChange={(e) => setActiveYear(e.target.value === 'all' ? null : Number(e.target.value))}
          className={styles.select}
          aria-label="Filter by year"
        >
          <option value="all">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`${styles.awardedToggle} ${awardedOnly ? styles.awardedToggleActive : ''}`}
          onClick={() => setAwardedOnly((v) => !v)}
          aria-pressed={awardedOnly}
        >
          Awarded only
        </button>
      </div>

      <PublicationList publications={filtered} />
    </div>
  );
}