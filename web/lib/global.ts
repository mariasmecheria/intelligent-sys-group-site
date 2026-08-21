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

export async function getHeader(): Promise<Header> {
  const base =
    process.env.STRAPI_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'http://localhost:1337';

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
          url: header.icon.url.startsWith('http')
            ? header.icon.url
            : `${base}${header.icon.url}`,
          alternativeText: header.icon.alternativeText,
          width: header.icon.width,
          height: header.icon.height,
        }
      : undefined,
    navItems: header.navItems ?? [],
  };
}