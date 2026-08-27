import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicationBySlug, labelFor } from '@/lib/publications';
import PublicationLinks from '@/components/PublicationLinks';
import styles from './page.module.css';

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);

  if (!pub) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/publications" className={styles.backLink}>
          ← All publications
        </Link>

        <div className={styles.headerRow}>
          {pub.referenceCode && <span className={styles.code}>{pub.referenceCode}</span>}
          <span className={styles.typeTag}>{labelFor(pub.publicationType)}</span>
          <span className={styles.year}>{pub.year}</span>
          {pub.awarded && <span className={styles.awardedBadge}>Awarded</span>}
        </div>

        <h1 className={styles.title}>{pub.title}</h1>

        {pub.team_members.length > 0 && (
          <p className={styles.authors}>
            {pub.team_members.map((member, i) => (
              <span key={member.id}>
                <Link href={`/people/${member.slug}`} className={styles.authorLink}>
                  {member.fullName}
                </Link>
                {i < pub.team_members.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        )}

        <PublicationLinks bibtex={pub.bibtexRaw} doi={pub.doi} links={pub.links} />
        
        {pub.abstract && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Abstract</h2>
            <p className={styles.body}>{pub.abstract}</p>
          </section>
        )}
        {pub.fullCitation && (
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Full citation</h2>
            <p className={styles.body}>{pub.fullCitation}</p>
          </section>
        )}


      </div>
    </main>
  );
}