'use client';

import { useRef } from 'react';
import type { Service } from '@/lib/homepage';
import styles from './ServicesCarousel.module.css';

export default function ServicesCarousel({ services }: { services: Service[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (services.length === 0) return null;

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' });
  }

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Services</h2>
        <div className={styles.controls}>
          <button type="button" className={styles.navButton} onClick={() => scrollByAmount(-1)} aria-label="Previous">
            ←
          </button>
          <button type="button" className={styles.navButton} onClick={() => scrollByAmount(1)} aria-label="Next">
            →
          </button>
        </div>
      </div>

      <div className={styles.scroller} ref={scrollerRef}>
        {services.map((service) => (
          <div key={service.id} className={styles.card}>
            <span className={styles.audience}>{service.audience}</span>
            <p className={styles.description}>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}