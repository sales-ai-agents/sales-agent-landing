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
const SUPPORTED_LANGUAGES = ["uk", "ru"] as const;

export const buildGraph = (nodes: readonly object[]): object => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const buildOrganizationNode = (): object => ({
  "@type": "Organization",
  "@id": SITE_ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  url: SITE_URL,
  logo: { "@type": "ImageObject", "@id": LOGO_ID, url: SITE_LOGO_URL, caption: SITE_NAME },
  image: { "@id": LOGO_ID },
  description:
    "Calls4U — платформа голосових ШІ-агентів, які телефонують клієнтам за бізнес: підтверджують записи, нагадують про візити, уточнюють замовлення й передають результат у CRM.",
  email: SITE_CONTACT.email,
  telephone: SITE_CONTACT.phone,
  sameAs: [SITE_CONTACT.telegram],
  knowsLanguage: SUPPORTED_LANGUAGES,
  areaServed: { "@type": "Country", name: "Ukraine" },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE_CONTACT.email,
      telephone: SITE_CONTACT.phone,
      availableLanguage: SUPPORTED_LANGUAGES,
    },
  ],
});

export const buildWebsiteNode = (): object => ({
  "@type": "WebSite",
  "@id": SITE_WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATE_NAMES,
  inLanguage: "uk",
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
