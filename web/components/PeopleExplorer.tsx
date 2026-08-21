'use client';

import { useMemo, useState } from 'react';
import type { TeamMember } from '@/lib/team';
import TeamGrid from './TeamGrid';
import styles from './PeopleExplorer.module.css';

type SortOption = 'name-asc' | 'name-desc' | 'pubs-desc' | 'pubs-asc';

const SORT_LABELS: Record<SortOption, string> = {
  'name-asc': 'Name (A–Z)',
  'name-desc': 'Name (Z–A)',
  'pubs-desc': 'Most publications',
  'pubs-asc': 'Fewest publications',
};

export default function PeopleExplorer({ members }: { members: TeamMember[] }) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [sort, setSort] = useState<SortOption>('name-asc');

  const roles = useMemo(() => {
    const set = new Set(members.map((m) => m.title).filter((t): t is string => Boolean(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filtered = useMemo(() => {
    let result = members;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((m) => m.fullName?.toLowerCase().includes(q));
    }

    if (role !== 'all') {
      result = result.filter((m) => m.title === role);
    }

    const sorted = [...result];
    switch (sort) {
      case 'name-asc':
        sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
      case 'pubs-desc':
        sorted.sort((a, b) => b.publicationsCount - a.publicationsCount);
        break;
      case 'pubs-asc':
        sorted.sort((a, b) => a.publicationsCount - b.publicationsCount);
        break;
    }

    return sorted;
  }, [members, query, role, sort]);

  return (
    <div>
      <div className={styles.controls}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className={styles.search}
          aria-label="Search people by name"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.select}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className={styles.select}
          aria-label="Sort order"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <p className={styles.resultCount}>
        {filtered.length} {filtered.length === 1 ? 'person' : 'people'}
      </p>

      <TeamGrid members={filtered} />
    </div>
  );
}