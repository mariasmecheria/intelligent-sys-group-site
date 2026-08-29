import styles from './AboutUs.module.css';

export default function AboutUs({ text }: { text?: string }) {
  if (!text) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>About Us</h2>

      <p className={styles.text}>{text}</p>
    </section>
  );
}