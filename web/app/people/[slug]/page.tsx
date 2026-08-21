import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getTeamMemberBySlug } from '@/lib/team';
import { labelFor } from '@/lib/publications';

import styles from './page.module.css';

const DOMAIN_LABELS: Record<string, string> = {
  'scholar.google.com': 'Google Scholar',
  'webofscience.com': 'Web of Science',
  'scopus.com': 'Scopus',
  'linkedin.com': 'LinkedIn',
  'ieeexplore.ieee.org': 'IEEE Xplore',
  'orcid.org': 'ORCID',
  'researchgate.net': 'ResearchGate',
  'dblp.org': 'DBLP',
};

function labelForLink(href: string, label?: string): string {
  if (label) return label;

  try {
    const host = new URL(href).hostname.replace(/^www\./, '');

    for (const [domain, name] of Object.entries(DOMAIN_LABELS)) {
      if (host.includes(domain)) return name;
    }

    return host;
  } catch {
    return href;
  }
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = await getTeamMemberBySlug(slug);

  if (!person) {
    notFound();
  }

  const publicationsByYear = [...person.publications].sort(
    (a, b) => b.year - a.year
  );

  return (
    <main className={styles.page}>
      <div className={styles.banner}>
        <div className={styles.bannerOverlay} />
      </div>

      <div className={styles.container}>
        <Link href="/people" className={styles.backLink}>
          ← All people
        </Link>

        <section className={styles.profileHeader}>
          <div className={styles.profileHero}>
            <div className={styles.photoWrap}>
              {person.photo ? (
                <img
                  src={person.photo.url}
                  alt={person.photo.alternativeText || person.fullName}
                  className={styles.photo}
                />
              ) : (
                <div className={styles.photoFallback} aria-hidden="true">
                  {person.fullName?.[0] ?? '?'}
                </div>
              )}
              </div>

          <div className={styles.identity}>
            <h1 className={styles.name}>{person.fullName}</h1>

              {person.title && (
                <p className={styles.title}>{person.title}</p>
              )}

              {person.teams.length > 0 && (
                <div className={styles.teamTags}>
                  {person.teams.map((team) => (
                    <span key={team.id} className={styles.teamTag}>
                      {team.name}
                    </span>
                 ))}
                </div>
              )}
          </div>
          </div>
        </section>

        {person.pageLinks.length > 0 && (
          <div className={styles.externalLinks}>
            {person.pageLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={styles.externalLink}
              >
                <span>{labelForLink(link.href, link.label)}</span>
                <span className={styles.externalArrow}>↗</span>
              </a>
            ))}
          </div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            Publications
            <span className={styles.count}>
              {person.publications.length}
            </span>
          </h2>

          {publicationsByYear.length === 0 ? (
            <p className={styles.empty}>
              No publications linked yet.
            </p>
          ) : (
            <ol className={styles.pubList}>
              {publicationsByYear.map((pub) => (
                <li key={pub.id} className={styles.pubEntry}>
                  {pub.referenceCode && (
                    <span className={styles.pubCode}>
                      {pub.referenceCode}
                    </span>
                  )}

                  <div>
                    <Link
                      href={`/publications/${pub.slug}`}
                      className={styles.pubTitle}
                    >
                      {pub.title}
                    </Link>

                    <p className={styles.pubMeta}>
                      <span>{labelFor(pub.publicationType)}</span>
                      <span>{pub.year}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}