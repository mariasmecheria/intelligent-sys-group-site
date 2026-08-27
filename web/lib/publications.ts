export type TeamMember = {
  id: number;
  fullName: string;
  slug: string;
};

export type PublicationLink = {
  href: string;
  label?: string;
  external: boolean;
};

export type Publication = {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  fullCitation?: string;
  publicationType: string;
  year: number;
  awarded: boolean;
  doi?: string;
  referenceCode?: string;
  bibtexRaw?: string;
  links: PublicationLink[];
  team_members: TeamMember[];
};

export type PublicationWithCode = Publication & { code: string };

const TYPE_PREFIX: Record<string, string> = {
  journal: 'J',
  conference: 'C',
  bookEditorial: 'E',
  bookChapter: 'B',
  thesis: 'T',
};

const TYPE_LABEL: Record<string, string> = {
  journal: 'Journals',
  conference: 'Conference Proceedings',
  bookEditorial: 'Books& Editorials',
  bookChapter: 'Book chapters',
  thesis: 'Theses',
};

// Order types appear in within a shared year group, and matches the order
// used for filter pills. Keeping this in sync with TYPE_PREFIX/TYPE_LABEL
// ensures switching filters never reorders items — filtering only ever
// removes rows from this fixed order, it never rearranges what's left.
const TYPE_ORDER = ['journal', 'conference', 'bookChapter', 'bookEditorial', 'thesis'];

function prefixFor(type: string): string {
  return TYPE_PREFIX[type] ?? type?.[0]?.toUpperCase() ?? 'X';
}

export function labelFor(type: string): string {
  return TYPE_LABEL[type] ?? type;
}

function typeRank(type: string): number {
  const idx = TYPE_ORDER.indexOf(type);
  return idx === -1 ? TYPE_ORDER.length : idx;
}

export function assignReferenceCodes(publications: Publication[]): PublicationWithCode[] {
  const byType = new Map<string, Publication[]>();

  for (const pub of publications) {
    if (pub.referenceCode) continue;
    const key = pub.publicationType || 'other';
    if (!byType.has(key)) byType.set(key, []);
    byType.get(key)!.push(pub);
  }

  const codeById = new Map<number, string>();

  for (const [type, pubs] of byType.entries()) {
    const sortedAsc = [...pubs].sort((a, b) => a.year - b.year || a.id - b.id);
    sortedAsc.forEach((pub, index) => {
      codeById.set(pub.id, `${prefixFor(type)}${index + 1}`);
    });
  }

  return publications.map((pub) => ({
    ...pub,
    code: pub.referenceCode || codeById.get(pub.id) || '',
  }));
}

/**
 * Groups publications by year (newest year first). Within each year, sorted
 * by type first (per TYPE_ORDER), then by reference code descending within
 * that type — so J23 appears before J22, etc. Sorting by type first means
 * filtering to a single type never changes the relative order of what's
 * left; it only removes rows.
 */
export function groupByYear(publications: PublicationWithCode[]) {
  const groups = new Map<number, PublicationWithCode[]>();

  for (const pub of publications) {
    if (!groups.has(pub.year)) groups.set(pub.year, []);
    groups.get(pub.year)!.push(pub);
  }

  const codeNumber = (code: string) => parseInt(code.replace(/\D/g, ''), 10) || 0;

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, pubs]) => ({
      year,
      publications: pubs.sort((a, b) => {
        const typeDiff = typeRank(a.publicationType) - typeRank(b.publicationType);
        if (typeDiff !== 0) return typeDiff;
        return codeNumber(b.code) - codeNumber(a.code);
      }),
    }));
}

function mapEntry(entry: any): Publication {
  return {
    id: entry.id,
    title: entry.title,
    slug: entry.slug,
    abstract: entry.abstract,
    fullCitation: entry.fullCitation,
    publicationType: entry.publicationType,
    year: entry.year,
    awarded: entry.awarded,
    doi: entry.doi,
    referenceCode: entry.referenceCode,
    bibtexRaw: entry.bibtexRaw,
    links: (entry.links ?? []).map((l: any) => ({
      href: l.href,
      label: l.label,
      external: l.external,
    })),
    team_members: (entry.team_members ?? []).map((a: any) => ({
      id: a.id,
      fullName: a.fullName,
      slug: a.slug,
    })),
  };
}

export async function getPublications(): Promise<Publication[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/publications?populate=team_members,links&pagination[pageSize]=200`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch publications: ${res.status}`);
  }

  const json = await res.json();
  return json.data.map(mapEntry);
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/publications?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=team_members,links`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch publication: ${res.status}`);
  }

  const json = await res.json();
  const entry = json.data?.[0];
  return entry ? mapEntry(entry) : null;
}

export async function getAwardedPublications(): Promise<Publication[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/publications?filters[awarded][$eq]=true&populate=team_members,links&pagination[pageSize]=200`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch awarded publications: ${res.status}`);
  }

  const json = await res.json();
  return json.data.map(mapEntry);
}