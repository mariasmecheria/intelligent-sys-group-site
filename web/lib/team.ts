export type TeamMemberPhoto = {
  url: string;
  alternativeText?: string;
};

export type TeamMember = {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  slug: string;
  title?: string;
  photo?: TeamMemberPhoto;
  publicationsCount: number;
};

/**
 * Returns the name to use for alphabetical sorting: `lastName` if set,
 * otherwise falls back to the last word of `fullName` as a heuristic.
 * `fullName` itself stays untouched — it's still what displays everywhere
 * on the frontend and what Strapi's relation pickers show.
 */
export function sortKeyFor(member: TeamMember): string {
  if (member.lastName) return member.lastName;
  const parts = member.fullName?.trim().split(/\s+/) ?? [];
  return parts[parts.length - 1] ?? member.fullName ?? '';
}

export type TeamMemberPublication = {
  id: number;
  title: string;
  slug: string;
  year: number;
  publicationType: string;
  referenceCode?: string;
  doi?: string;
};

export type PageLink = {
  href: string;
  label?: string;
  external: boolean;
};

export type TeamMemberDetail = TeamMember & {
  teams: { id: number; name: string }[];
  publications: TeamMemberPublication[];
  pageLinks: PageLink[];
};

function resolvePhoto(base: string, photo: any): TeamMemberPhoto | undefined {
  if (!photo?.url) return undefined;
  return {
    url: photo.url.startsWith('http') ? photo.url : `${base}${photo.url}`,
    alternativeText: photo.alternativeText,
  };
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/team-members?populate=photo,publications&pagination[pageSize]=200`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch team members: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((entry: any) => ({
    id: entry.id,
    fullName: entry.fullName,
    firstName: entry.firstName,
    lastName: entry.lastName,
    slug: entry.slug,
    title: entry.title,
    photo: resolvePhoto(base, entry.photo),
    publicationsCount: (entry.publications ?? []).length,
  }));
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMemberDetail | null> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/team-members?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=teams,publications,pageLinks,photo`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch team member: ${res.status}`);
  }

  const json = await res.json();
  const entry = json.data?.[0];
  if (!entry) return null;

  return {
    id: entry.id,
    fullName: entry.fullName,
    firstName: entry.firstName,
    lastName: entry.lastName,
    slug: entry.slug,
    title: entry.title,
    photo: resolvePhoto(base, entry.photo),
    publicationsCount: (entry.publications ?? []).length,
    teams: (entry.teams ?? []).map((t: any) => ({ id: t.id, name: t.name })),
    publications: (entry.publications ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      year: p.year,
      publicationType: p.publicationType,
      referenceCode: p.referenceCode,
      doi: p.doi,
    })),
    pageLinks: (entry.pageLinks ?? []).map((l: any) => ({
      href: l.href,
      label: l.label,
      external: l.external,
    })),
  };
}