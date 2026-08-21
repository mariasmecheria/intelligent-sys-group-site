import type { Hero } from '@/lib/homepage';
import styles from './HeroSection.module.css';

export default function HeroSection({ hero }: { hero: Hero }) {
  return (
    <section className={styles.hero}>
      {hero.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.coverImageUrl} alt="" className={styles.background} />
      )}

      <div className={styles.overlay} />

      {hero.iconUrl && (
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.iconUrl} alt="" className={styles.logo} />
        </div>
      )}
    </section>
  );
}