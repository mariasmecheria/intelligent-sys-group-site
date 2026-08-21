'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Header } from '@/lib/global';
import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ header }: { header: Header }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`${styles.header} ${
        scrolled ? styles.headerScrolled : ''
      }`}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          {header.icon && (
            <img
              src={header.icon.url}
              alt={header.icon.alternativeText || ''}
              className={styles.brandIcon}
            />
          )}

          <span>{header.title}</span>
        </Link>

        <nav className={styles.navScroll} aria-label="Primary">
          <ul className={styles.navList}>
            {header.navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${
                      isActive ? styles.navLinkActive : ''
                    }`}
                    target={item.external ? '_blank' : undefined}
                    rel={
                      item.external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}