import type { Footer as FooterData } from '@/lib/global';
import styles from './Footer.module.css';

export default function Footer({ footer }: { footer: FooterData }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {footer.partners.length > 0 && (
  <div className={styles.partners}>
    {footer.partners.map((partner) => (
      <div key={partner.id} className={styles.partner}>
        {partner.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={partner.logoUrl}
            alt={partner.name}
            className={styles.partnerLogo}
          />
        )}

        <span className={styles.partnerName}>
          {partner.name}
        </span>
      </div>
    ))}
  </div>
)}

        <div className={styles.bottomRow}>
          <div className={styles.contact}>
            {footer.phone && (
              <a href={`tel:${footer.phone.replace(/[^+\d]/g, '')}`} className={styles.contactLink}>
                {footer.phone}
              </a>
            )}
            {footer.email && (
              <a href={`mailto:${footer.email}`} className={styles.contactLink}>
                {footer.email}
              </a>
            )}
          </div>

          {footer.footerLinks.length > 0 && (
            <div className={styles.links}>
              {footer.footerLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={styles.footerLink}
                >
                  {link.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={link.imageUrl} alt="" className={styles.linkIcon} />
                  )}
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}