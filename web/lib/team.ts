export type TeamMember = {
  id: number;
  fullName: string;
  slug: string;
  title?: string;
  photo?: {
    url: string;
    alternativeText?:string;
  }
  publicationsCount: number;
};

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

export async function getTeamMembers(): Promise<TeamMember[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/team-members?populate=*&pagination[pageSize]=200`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch team members: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((entry: any) => ({
    id: entry.id,
    fullName: entry.fullName,
    slug: entry.slug,
    title: entry.title,
    photo: entry.photo
      ? {
          url: entry.photo.url.startsWith('http') 
            ? entry.photo.url
            : `${base}${entry.photo.url}`,
          alternativeText: entry.photo.alternativeText,
      }
      : undefined,
    publicationsCount: (entry.publications ?? []).length,
  }));
}

export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMemberDetail | null> {
  const base =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'http://localhost:1337';

  const url =
    `${base}/api/team-members` +
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[photo]=true` +
    `&populate[teams]=true` +
    `&populate[publications]=true` +
    `&populate[pageLinks]=true`;

  console.log('Fetching team member:', url);

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Strapi error:', res.status, errorText);

    throw new Error(
      `Failed to fetch team member: ${res.status} ${errorText}`
    );
  }

  const json = await res.json();
  const entry = json.data?.[0];

  if (!entry) return null;

  return {
    id: entry.id,
    fullName: entry.fullName,
    slug: entry.slug,
    title: entry.title,

    photo: entry.photo
      ? {
          url: entry.photo.url.startsWith('http')
            ? entry.photo.url
            : `${base}${entry.photo.url}`,
          alternativeText: entry.photo.alternativeText,
        }
      : undefined,

    teams: (entry.teams ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
    })),

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