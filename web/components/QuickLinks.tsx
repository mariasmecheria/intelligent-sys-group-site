import Link from 'next/link';
import type { QuickLink } from '@/lib/homepage';
import styles from './QuickLinks.module.css';

export default function QuickLinks({ links }: { links: QuickLink[] }) {
  if (links.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={styles.card}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            <div className={styles.imageWrap}>
              {link.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={link.imageUrl} alt="" className={styles.image} />
              ) : (
                <div className={styles.imageFallback} aria-hidden="true">
                  {link.title?.[0] ?? '?'}
                </div>
              )}
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.title}>{link.title}</h2>
              {link.description && <p className={styles.description}>{link.description}</p>}
              <span className={styles.cta}>Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}