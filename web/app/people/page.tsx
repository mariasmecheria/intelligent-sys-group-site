import { getTeamMembers } from '@/lib/team';
import PeopleExplorer from '@/components/PeopleExplorer';
import styles from './page.module.css';

export default async function PeoplePage() {
  const members = await getTeamMembers();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>The group</p>
        <h1 className={styles.heading}>People</h1>
        <p className={styles.intro}>Researchers, students, and collaborators behind the group&rsquo;s work.</p>
      </header>

      <PeopleExplorer members={members} />
    </main>
  );
}