export type GrantLink = {
  href: string;
  label?: string;
  external: boolean;
};

export type Grant = {
  id: number;
  acronym: string;
  roleLabel: string;
  roleLink?: GrantLink;
  description?: string;
};

// URL to fetch data FROM — inside the Docker network, use STRAPI_INTERNAL_URL.
function getApiBase(): string {
  return process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

// roleLink used to be a repeatable component (array); it's now a single
// component (plain object). Handle both shapes safely so this never
// crashes regardless of which one Strapi actually returns.
function normalizeLink(raw: any): GrantLink | undefined {
  if (!raw) return undefined;
  const item = Array.isArray(raw) ? raw[0] : raw;
  if (!item?.href) return undefined;
  return { href: item.href, label: item.label, external: item.external };
}

export async function getGrants(): Promise<Grant[]> {
  const res = await fetch(`${getApiBase()}/api/grants?populate=roleLink&pagination[pageSize]=100`, {
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
    roleLink: normalizeLink(entry.roleLink),
    description: entry.description,
  }));
}