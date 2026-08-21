export type TeamMember = {
  id: number;
  fullName: string;
  slug: string;
};

export type Publication = {
  id: number;
  title: string;
  slug: string;
  abstract?: string;
  fullCitation?: string;
  publicationType: string; // e.g. "journal" | "conference" | "book" | "thesis"
  year: number;
  awarded: boolean;
  doi?: string;
  referenceCode?: string;
  team_members: TeamMember[];
};

export type PublicationWithCode = Publication & { code: string };

const TYPE_PREFIX: Record<string, string> = {
  journal: 'J',
  conference: 'C',
  bookChapter: 'B',
  editorial: 'E',
  thesis: 'T',
};

const TYPE_LABEL: Record<string, string> = {
  journal: 'Journal',
  conference: 'Conference',
  bookChapter: 'Book Chapter',
  editorial: 'Editorial',
  thesis: 'Thesis',
};

function prefixFor(type: string): string {
  return TYPE_PREFIX[type?.toLowerCase()] ?? type?.[0]?.toUpperCase() ?? 'X';
}

export function labelFor(type: string): string {
  return TYPE_LABEL[type?.toLowerCase()] ?? type;
}

/**
 * Assigns a reference code per publication. If the entry has a manually set
 * `referenceCode` in Strapi, that's used as-is (for cases where auto
 * ordering doesn't match the intended sequence). Otherwise it's generated
 * automatically: oldest entry of a given type is 1, incrementing forward in
 * time, e.g. J1 (2004) ... J23 (2023).
 */
export function assignReferenceCodes(publications: Publication[]): PublicationWithCode[] {
  const byType = new Map<string, Publication[]>();

  for (const pub of publications) {
    if (pub.referenceCode) continue; // manually pinned, skip auto-numbering
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

/** Groups publications by year, sorted newest year first. Within each year, sorted by reference code descending. */
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
      publications: pubs.sort((a, b) => codeNumber(b.code) - codeNumber(a.code)),
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
    team_members: (entry.team_members ?? []).map((a: any) => ({
      id: a.id,
      fullName: a.fullName,
      slug: a.slug,
    })),
  };
}

export async function getPublications(): Promise<Publication[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/publications?populate=team_members&pagination[pageSize]=250`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch publications: ${res.status}`);
  }

  const json = await res.json();
  return json.data.map(mapEntry);
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/publications?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=team_members`,
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
    `${base}/api/publications?filters[awarded][$eq]=true&populate=team_members&pagination[pageSize]=200`,
    { cache: 'no-store' }
  );
 
  if (!res.ok) {
    throw new Error(`Failed to fetch awarded publications: ${res.status}`);
  }
 
  const json = await res.json();
  return json.data.map(mapEntry);
}