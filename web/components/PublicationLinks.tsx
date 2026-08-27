'use client';

import { useState } from 'react';
import type { PublicationLink } from '@/lib/publications';
import styles from './PublicationLinks.module.css';

// --- Icons ---
// Simple, minimal inline SVGs so no icon library dependency is needed yet.
// Swap the <svg> markup inside each function for a real icon set later —
// the surrounding button markup/behavior doesn't need to change.

function BibtexIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h11l5 5v11H4z" strokeLinejoin="round" />
      <path d="M15 4v5h5" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h9l5 5v15H6z" strokeLinejoin="round" />
      <path d="M15 2v5h5" strokeLinejoin="round" />
      <path d="M9 13v5M9 13h1.5a1.5 1.5 0 0 1 0 3H9M13.5 13v5M13.5 13c1 0 2 .5 2 2.5s-1 2.5-2 2.5" strokeLinecap="round" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" strokeLinecap="round" />
    </svg>
  );
}

function iconForLink(label?: string) {
  switch (label?.toLowerCase()) {
    case 'pdf':
      return <PdfIcon />;
    case 'website':
      return <WebsiteIcon />;
    default:
      return <LinkIcon />;
  }
}

function textForLink(label?: string) {
  switch (label?.toLowerCase()) {
    case 'pdf':
      return 'PDF';
    case 'website':
      return 'Website';
    default:
      return label || 'Link';
  }
}

function BibtexButton({ bibtex }: { bibtex: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore, the text is still selectable in the modal
    }
  }

  return (
    <>
      <button type="button" className={styles.pill} onClick={() => setOpen(true)}>
        <BibtexIcon />
        BibTeX
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>BibTeX</span>
              <button type="button" className={styles.closeButton} onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>
            <pre className={styles.bibtexBlock}>{bibtex}</pre>
            <button type="button" className={styles.copyButton} onClick={handleCopy}>
              {copied ? 'Copied ✓' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function PublicationLinks({
  bibtex,
  doi,
  links,
}: {
  bibtex?: string;
  doi?: string;
  links: PublicationLink[];
}) {
  if (!bibtex && !doi && links.length === 0) return null;

  return (
    <div className={styles.row}>
      {bibtex && <BibtexButton bibtex={bibtex} />}

      {doi && (
        <a
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.pill}
        >
          <WebsiteIcon />
          DOI
        </a>
      )}

      {links.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          className={styles.pill}
        >
          {iconForLink(link.label)}
          {textForLink(link.label)}
        </a>
      ))}
    </div>
  );
}