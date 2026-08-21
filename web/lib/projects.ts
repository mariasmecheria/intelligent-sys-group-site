export type ProjectLink = {
  href?: string;
  label: string;
  external?: boolean;
};

export type Project = {
  id: number;
  acronym: string;
  title: string;
  keywords?: string;
  link?: ProjectLink;
};

export async function getProjects(): Promise<Project[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/projects?populate=link&pagination[pageSize]=100`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch projects: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((entry: any) => ({
    id: entry.id,
    acronym: entry.acronym,
    title: entry.title,
    keywords: entry.keywords,
    link: entry.link
      ? {
          href: entry.link.href,
          label: entry.link.label,
          external: entry.link.external,
        }
      : undefined,
  }));
}

/** Splits a comma-separated keywords string into a clean array. */
export function parseKeywords(keywords?: string): string[] {
  if (!keywords) return [];
  return keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}