import type { Publication, PublicationLink } from '@/lib/publications';
import type { TeamMember } from '@/lib/team';

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

export type Service = {
  id: number;
  audience: string;
  description: string;
};

export type SelectedPublication = {
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

export type Homepage = {
  hero: Hero;
  aboutUsText?: string;
  quickLinks: QuickLink[];
  selectedPublications: SelectedPublication[];
  services: Service[];
};

// URL to fetch data FROM — inside the Docker network, use STRAPI_INTERNAL_URL.
function getApiBase(): string {
  return process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

// URL to prefix media (image) src attributes with — this ends up in HTML
// sent to the BROWSER, so it must NEVER be the internal Docker hostname
// (http://strapi:1337) — only NEXT_PUBLIC_STRAPI_URL is browser-reachable.
function getMediaBase(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

function resolveMediaUrl(media: any): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${getMediaBase()}${media.url}`;
}

export async function getHomepage(): Promise<Homepage> {
  const res = await fetch(
    `${getApiBase()}/api/homepage?populate[hero][populate]=*&populate[quickLinks][populate]=image&populate[services][populate]=*&populate[selectedPublications][populate]=team_members`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch homepage: ${res.status}`);
  }

  const json = await res.json();
  const hero = json.data?.hero;
  const quickLinks = json.data?.quickLinks ?? [];
  const services = json.data?.services ?? [];
  const selectedPublications = json.data?.selectedPublications ?? [];

  return {
    hero: {
      coverImageUrl: resolveMediaUrl(hero?.coverImage),
      iconUrl: resolveMediaUrl(hero?.icon),
    },
    aboutUsText: json.data?.aboutUsText,
    quickLinks: quickLinks.map((link: any) => ({
      id: link.id,
      title: link.title,
      description: link.description,
      href: link.href,
      external: link.external,
      imageUrl: resolveMediaUrl(link.image),
    })),
    selectedPublications: selectedPublications.map((pub: any) => ({
      id: pub.id,
      title: pub.title,
      slug: pub.slug,
      year: pub.year,
      publicationType: pub.publicationType,
      referenceCode: pub.referenceCode,
      team_members: (pub.team_members ?? []).map((m: any) => ({
        id: m.id,
        fullName: m.fullName,
        slug: m.slug,
      })),
    })),
    services: services.map((s: any) => ({
      id: s.id,
      audience: s.audience,
      description: s.description,
    })),
  };
}