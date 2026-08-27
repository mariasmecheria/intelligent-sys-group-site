export type NavItem = {
  href: string;
  label: string;
  external: boolean;
};

export type Header = {
  title: string;
  icon?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  navItems: NavItem[];
};

function getApiBase(): string {
  return process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}

function getMediaBase(): string {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
}


function resolveMediaUrl(media: any): string | undefined {
  if (!media?.url) return undefined;
  return media.url.startsWith('http') ? media.url : `${getMediaBase()}${media.url}`;
}

export async function getHeader(): Promise<Header> {
  const base =
      getApiBase();

  const res = await fetch(
    `${base}/api/global?populate[header][populate]=*`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch global header: ${res.status}`);
  }

  const json = await res.json();
  const header = json.data?.header;

  if (!header) {
    throw new Error('Header configuration not found');
  }

  return {
    title: header.title,
    icon: header.icon
      ? {
         url: resolveMediaUrl(header.icon) as string,
          alternativeText: header.icon.alternativeText,
          width: header.icon.width,
          height: header.icon.height,
        }
      : undefined,
    navItems: header.navItems ?? [],
  };
}