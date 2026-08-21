import Link from 'next/link';
import type { PublicationWithCode } from '@/lib/publications';
import { groupByYear, labelFor } from '@/lib/publications';
import styles from './PublicationList.module.css';

export default function PublicationList({ publications }: { publications: PublicationWithCode[] }) {
  const groups = groupByYear(publications);

  if (groups.length === 0) {
    return <p className={styles.empty}>No publications recorded yet.</p>;
  }

  return (
    <div className={styles.ledger}>
      {groups.map(({ year, publications: pubs }) => (
        <section key={year} className={styles.yearSection} aria-labelledby={`year-${year}`}>
          <h2 id={`year-${year}`} className={styles.yearHeading}>
            {year}
            <span className={styles.yearCount}>
              {pubs.length} {pubs.length === 1 ? 'entry' : 'entries'}
            </span>
          </h2>

          <ol className={styles.entryList}>
            {pubs.map((pub) => (
              <li key={pub.id} className={styles.entry}>
                <span className={styles.code} aria-hidden="true">
                  {pub.code}
                </span>

                <div className={styles.entryBody}>
                  <h3 className={styles.title}>
                    <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                    {pub.awarded && (
                      <span className={styles.awardedBadge} title="Awarded publication">
                        Awarded
                      </span>
                    )}
                  </h3>

                  <p className={styles.meta}>
                    <span className={styles.typeTag}>{labelFor(pub.publicationType)}</span>

                    {pub.team_members.length > 0 && (
                      <span className={styles.authors}>
                        {pub.team_members.map((member, i) => (
                          <span key={member.id}>
                            <Link href={`/people/${member.slug}`} className={styles.authorLink}>
                              {member.fullName}
                            </Link>
                            {i < pub.team_members.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    )}

                    {pub.doi && (
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.doiLink}
                      >
                        doi:{pub.doi}
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}