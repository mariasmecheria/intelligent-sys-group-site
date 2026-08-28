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
              {grants.map((grant) => {
                const link = grant.roleLink;
                const body = (
                  <>
                    <div className={styles.grantMain}>
                      <div className={styles.grantTitleRow}>
                        <h3 className={styles.grantTitle}>{grant.acronym}</h3>
                        <p className={styles.grantRole}>{grant.roleLabel}</p>
                      </div>
                      {link && <span className={styles.grantArrow}>↗</span>}
                    </div>
                    {grant.description && <p className={styles.grantDescription}>{grant.description}</p>}
                  </>
                );

                return (
                  <li key={grant.id} className={styles.grantEntry}>
                    {link ? (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className={styles.grantLink}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={styles.grantStatic}>{body}</div>
                    )}
                  </li>
                );
              })}
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