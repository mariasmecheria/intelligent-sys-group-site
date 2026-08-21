'use client';

import { useMemo, useState } from 'react';
import type { PublicationWithCode } from '@/lib/publications';
import { labelFor } from '@/lib/publications';
import PublicationList from './PublicationList';
import styles from './PublicationsExplorer.module.css';

export default function PublicationsExplorer({ publications }: { publications: PublicationWithCode[] }) {
  const [activeType, setActiveType] = useState<string | null>(null);

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const pub of publications) {
      const key = pub.publicationType || 'other';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [publications]);

  const filtered = activeType ? publications.filter((p) => (p.publicationType || 'other') === activeType) : publications;

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

      <PublicationList publications={filtered} />
    </div>
  );
}