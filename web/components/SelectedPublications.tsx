import Link from 'next/link';

import type { Publication } from '@/lib/publications';
import { labelFor } from '@/lib/publications';

import styles from './SelectedPublications.module.css';

export default function SelectedPublications({
  publications,
}: {
  publications: Publication[];
}) {
  if (publications.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Selected Publications</h2>

        <Link href="/publications" className={styles.viewAll}>
          View all →
        </Link>
      </div>

      <div className={styles.list}>
        {publications.map((pub) => (
          <Link
            key={pub.id}
            href={`/publications/${pub.slug}`}
            className={styles.link}
          >
            <div className={styles.linkContent}>
              <span className={styles.typeTag}>
                {labelFor(pub.publicationType)} · {pub.year}
              </span>

              <h3 className={styles.title}>{pub.title}</h3>

              {pub.team_members.length > 0 && (
                <p className={styles.authors}>
                  {pub.team_members.map((m) => m.fullName).join(', ')}
                </p>
              )}
            </div>

            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
