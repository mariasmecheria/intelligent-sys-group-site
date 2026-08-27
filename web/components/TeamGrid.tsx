import Link from 'next/link';
import type { TeamMember } from '@/lib/team';
import styles from './TeamGrid.module.css';

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return <p className={styles.empty}>No team members listed yet.</p>;
  }

  return (
    <div className={styles.grid}>
      {members.map((member, index) => (
        <Link
          key={member.id}
          href={`/people/${member.slug}`}
          className={styles.card}
          style={
            {
              '--animation-delay': `${index * 50}ms`,
            } as React.CSSProperties
          }
        >
          <div className={styles.photoWrap}>
            {member.photo ? (
              <img
                src={member.photo.url}
                alt={member.photo.alternativeText || member.fullName}
                className={styles.photo}
              />
            ) : (
              <div className={styles.photoFallback} aria-hidden="true">
                {member.fullName?.[0] ?? '?'}
              </div>
            )}
          </div>

          <div className={styles.cardBody}>
            <h2 className={styles.name}>{member.fullName}</h2>

            {member.title && (
              <p className={styles.role}>{member.title}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}