import { getContact } from '@/lib/contact';
import styles from './page.module.css';

export default async function ContactPage() {
  const contact = await getContact();

  const officeAddressQuery = [contact.officeRoom, contact.officeStreet, contact.officeCity]
    .filter(Boolean)
    .join(', ');

  const mapSrc = officeAddressQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(officeAddressQuery)}&output=embed`
    : null;

  const telHref = contact.phone ? `tel:${contact.phone.replace(/[^+\d]/g, '')}` : undefined;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Get in touch</p>
        <h1 className={styles.heading}>Contact</h1>
      </header>

      <div className={styles.container}>
        <div className={styles.columns}>
          <section className={styles.block}>
            <h2 className={styles.blockHeading}>Postal address</h2>
            <address className={styles.address}>
              {contact.contactName && <span>{contact.contactName}</span>}
              {contact.department && <span>{contact.department}</span>}
              {contact.university && <span>{contact.university}</span>}
              {contact.postalStreet && <span>{contact.postalStreet}</span>}
              {contact.postalCity && <span>{contact.postalCity}</span>}
              {contact.postalCode && <span>{contact.postalCode}</span>}
            </address>

            {contact.email && (
              <a href={`mailto:${contact.email}`} className={styles.link}>
                {contact.email}
              </a>
            )}

            {contact.vCardUrl && (
              <a
                href={contact.vCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.vcardLink}
              >
                Contact vCard ↗
              </a>
            )}
          </section>

          <section className={styles.block}>
            <h2 className={styles.blockHeading}>Office address</h2>
            <address className={styles.address}>
              {contact.officeRoom && <span>{contact.officeRoom}</span>}
              {contact.officeStreet && <span>{contact.officeStreet}</span>}
              {contact.officeCity && <span>{contact.officeCity}</span>}
            </address>

            {contact.phone && (
              <a href={telHref} className={styles.link}>
                Tel: {contact.phone}
              </a>
            )}
          </section>
        </div>

        {mapSrc && (
          <div className={styles.mapWrap}>
            <iframe
              src={mapSrc}
              className={styles.map}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office location"
            />
          </div>
        )}
      </div>
    </main>
  );
}