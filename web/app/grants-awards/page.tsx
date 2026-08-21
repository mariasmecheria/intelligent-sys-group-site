import Link from 'next/link';
import { getGrants } from '@/lib/grants';
import { getAwardedPublications, labelFor } from '@/lib/publications';
import styles from './page.module.css';

export default async function GrantsAwardsPage() {
  const [grants, awardedPublications] = await Promise.all([getGrants(), getAwardedPublications()]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Recognition</p>
        <h1 className={styles.heading}>Grants &amp; Awards</h1>
        <p className={styles.intro}>Funded projects and recognised publications.</p>
      </header>

      <div className={styles.container}>
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Grants</h2>

          {grants.length === 0 ? (
            <p className={styles.empty}>No grants listed yet.</p>
          ) : (
            <ul className={styles.grantList}>
              {grants.map((grant) => (
                <li key={grant.id} className={styles.grantEntry}>
                  <h3 className={styles.grantTitle}>{grant.acronym}</h3>

                  {grant.roleLabel && (
                    <p className={styles.grantRole}>
                      {grant.roleLink.length > 0 ? (
                        <a
                          href={grant.roleLink[0].href}
                          target={grant.roleLink[0].external ? '_blank' : undefined}
                          rel={grant.roleLink[0].external ? 'noopener noreferrer' : undefined}
                        >
                          {grant.roleLabel}
                        </a>
                      ) : (
                        grant.roleLabel
                      )}
                    </p>
                  )}

                  {grant.description && <p className={styles.grantDescription}>{grant.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Awarded publications</h2>

          {awardedPublications.length === 0 ? (
            <p className={styles.empty}>No awarded publications yet.</p>
          ) : (
            <ol className={styles.pubList}>
              {awardedPublications
                .sort((a, b) => b.year - a.year)
                .map((pub) => (
                  <li key={pub.id} className={styles.pubEntry}>
                    <Link href={`/publications/${pub.slug}`} className={styles.pubTitle}>
                      {pub.title}
                    </Link>
                    <p className={styles.pubMeta}>
                      <span>{labelFor(pub.publicationType)}</span>
                      <span>{pub.year}</span>
                    </p>
                  </li>
                ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}