import XTimeline from '@/components/XTimeline';
import styles from './page.module.css';


const X_HANDLE = 'AdrianGroza10';

export default function NewsEventsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Stay updated</p>
        <h1 className={styles.heading}>News &amp; Events</h1>
        <p className={styles.intro}>
          We&rsquo;re building out this page. In the meantime, follow our latest updates on X.
        </p>
        <a
          href={`https://twitter.com/${X_HANDLE}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fallbackLink}
        >
          @{X_HANDLE} on X ↗
        </a>
      </header>

      <div className={styles.container}>
        <XTimeline handle={X_HANDLE} />
      </div>
    </main>
  );
}