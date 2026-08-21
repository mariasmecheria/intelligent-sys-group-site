import { getPublications, assignReferenceCodes } from '@/lib/publications';
import PublicationsExplorer from '@/components/PublicationsExplorer';
import styles from './page.module.css';

export default async function PublicationsPage() {
  const publications = await getPublications();
  const withCodes = assignReferenceCodes(publications);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Research output</p>
        <h1 className={styles.heading}>Publications</h1>
        <p className={styles.intro}>
          A chronological record of the group&rsquo;s published work, indexed by type and year.
        </p>
      </header>

      <PublicationsExplorer publications={withCodes} />
    </main>
  );
}