export type GrantLink = {
  href?: string;
  label: string;
  external?: boolean;
};

export type Grant = {
  id: number;
  acronym?: string;
  roleLabel: string;
  roleLink?: GrantLink[];
  description: string;
};

export async function getGrants(): Promise<Grant[]> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(`${base}/api/grants?populate=roleLink&pagination[pageSize]=100`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch grants: ${res.status}`);
  }

  const json = await res.json();

  return json.data.map((entry: any) => ({
    id: entry.id,
    acronym: entry.acronym,
    roleLabel: entry.roleLabel,
    roleLink: (entry.roleLink ?? []).map((l: any) => ({
      href: l.href,
      label: l.label,
      external: l.external,
    })),
    description: entry.description,
  }));
}