export type Hero = {
  coverImageUrl?: string;
  iconUrl?: string;
};

export type QuickLink = {
  id: number;
  title: string;
  description?: string;
  href: string;
  external: boolean;
  imageUrl?: string;
};

export type Homepage = {
  hero: Hero;
  quickLinks: QuickLink[];
};

function resolveMediaUrl(base: string, media: any): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${base}${media.url}`;
}

export async function getHomepage(): Promise<Homepage> {
  const base = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  const res = await fetch(
    `${base}/api/homepage?populate[hero][populate]=*&populate[quickLinks][populate]=image`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch homepage: ${res.status}`);
  }

  const json = await res.json();
  const hero = json.data?.hero;
  const quickLinks = json.data?.quickLinks ?? [];

  return {
    hero: {
      coverImageUrl: resolveMediaUrl(base, hero?.coverImage),
      iconUrl: resolveMediaUrl(base, hero?.icon),
    },
    quickLinks: quickLinks.map((link: any) => ({
      id: link.id,
      title: link.title,
      description: link.description,
      href: link.href,
      external: link.external,
      imageUrl: resolveMediaUrl(base, link.image),
    })),
  };
}