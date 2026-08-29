export type NavItem = {
  href: string;
  label: string;
  external: boolean;
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
  if (Array.isArray(media)) {
    media = media[0];
  }

  if (!media?.url) return undefined;

  return media.url.startsWith('http')
    ? media.url
    : `${getMediaBase()}${media.url}`;
}

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


export type Partner = {
  id: number;
  name: string;
  logoUrl?: string;
};

// footerLinks uses the QuickLink component shape (title, description, href,
// external, image) since that's what was already set up in Strapi.
export type FooterLink = {
  id: number;
  title: string;
  description?: string;
  href: string;
  external: boolean;
  imageUrl?: string;
};

export type Footer = {
  partners: Partner[];
  phone?: string;
  email?: string;
  footerLinks: FooterLink[];
};

export async function getFooter(): Promise<Footer> {
  const res = await fetch(
    `${getApiBase()}/api/global?populate[footer][populate][partners][populate]=logo&populate[footer][populate][footerLinks][populate]=image`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch global footer: ${res.status}`);
  }

  const json = await res.json();
  const footer = json.data?.footer;


  if (!footer) {
    return { partners: [], footerLinks: [] };
  }

  return {
    partners: (footer.partners ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      logoUrl: resolveMediaUrl(p.logo),
    })),
    phone: footer.phone,
    email: footer.email,
    footerLinks: (footer.footerLinks ?? []).map((l: any) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      href: l.href,
      external: l.external,
      imageUrl: resolveMediaUrl(l.image),
    })),
  };
}