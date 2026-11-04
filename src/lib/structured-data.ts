import { LOCALES, type Locale } from "@/lib/i18n/config";
import {
  BRAND_ALTERNATE_NAMES,
  SITE_CONTACT,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_ORGANIZATION_ID,
  SITE_URL,
  SITE_WEBSITE_ID,
} from "@/lib/site";

export interface BreadcrumbItem {
  readonly name: string;
  readonly url: string;
}

const LOGO_ID = `${SITE_URL}/#logo`;
const SUPPORT_LANGUAGES = ["uk", "ru"] as const;

export const buildGraph = (nodes: readonly object[]): object => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const buildOrganizationNode = (description: string): object => ({
  "@type": "Organization",
  "@id": SITE_ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  url: SITE_URL,
  logo: { "@type": "ImageObject", "@id": LOGO_ID, url: SITE_LOGO_URL, caption: SITE_NAME },
  image: { "@id": LOGO_ID },
  description,
  email: SITE_CONTACT.email,
  telephone: SITE_CONTACT.phone,
  sameAs: [SITE_CONTACT.telegram],
  knowsLanguage: LOCALES,
  areaServed: { "@type": "Country", name: "Ukraine" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      availableLanguage: SUPPORT_LANGUAGES,
    },
  ],
});

export const buildWebsiteNode = (locale: Locale): object => ({
  "@type": "WebSite",
  "@id": SITE_WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  inLanguage: locale,
  publisher: { "@id": SITE_ORGANIZATION_ID },
});

export const buildBreadcrumbNode = (id: string, items: readonly BreadcrumbItem[]): object => ({
  "@type": "BreadcrumbList",
  "@id": id,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
