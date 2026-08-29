import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
    icon: 'walk';
  };
  attributes: {
    email: Schema.Attribute.String;
    footerLinks: Schema.Attribute.Component<'shared.quick-link', true>;
    partners: Schema.Attribute.Component<'shared.partner', true>;
    phone: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
    icon: 'alien';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    displayName: 'Hero';
    icon: 'seed';
  };
  attributes: {
    coverImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedBibliographyBreakdown extends Struct.ComponentSchema {
  collectionName: 'components_shared_bibliography_breakdowns';
  info: {
    displayName: 'BibliographyBreakdown';
    icon: 'book';
  };
  attributes: {
    citation: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedContentBreakdown extends Struct.ComponentSchema {
  collectionName: 'components_shared_content_breakdowns';
  info: {
    displayName: 'ContentBreakdown';
    icon: 'eye';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    external: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String;
  };
}

export interface SharedPartner extends Struct.ComponentSchema {
  collectionName: 'components_shared_partners';
  info: {
    displayName: 'Partner';
    icon: 'heart';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
  };
}

export interface SharedQuickLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_quick_links';
  info: {
    displayName: 'QuickLink';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.String;
    external: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedService extends Struct.ComponentSchema {
  collectionName: 'components_shared_services';
  info: {
    displayName: 'Service';
    icon: 'shoppingCart';
  };
  attributes: {
    audience: Schema.Attribute.String;
    description: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.hero': LayoutHero;
      'shared.bibliography-breakdown': SharedBibliographyBreakdown;
      'shared.content-breakdown': SharedContentBreakdown;
      'shared.link': SharedLink;
      'shared.partner': SharedPartner;
      'shared.quick-link': SharedQuickLink;
      'shared.service': SharedService;
    }
  }
}
