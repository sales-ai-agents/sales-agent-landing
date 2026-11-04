import {
  buildBreadcrumbNode,
  buildGraph,
  buildOrganizationNode,
  buildWebsiteNode,
} from "@/lib/structured-data";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_ORGANIZATION_ID,
  SITE_URL,
  SITE_WEBSITE_ID,
} from "@/lib/site";
import { getLandingCopy } from "@/components/landing/copy";
import type { Locale } from "@/lib/i18n/config";
import { landingUrl } from "@/lib/i18n/paths";

const CURRENCY_SYMBOL = "$";
const SIGN_UP_URL = `${SITE_URL}/sign-up`;

export const buildLandingGraph = (locale: Locale): object => {
  const copy = getLandingCopy(locale);
  const url = landingUrl(locale);
  const webpageId = `${url}#webpage`;
  const softwareId = `${url}#software`;
  const breadcrumbId = `${url}#breadcrumb`;

  const webPage = {
    "@type": "WebPage",
    "@id": webpageId,
    url,
    name: copy.seo.title,
    description: copy.seo.pageDescription,
    inLanguage: locale,
    isPartOf: { "@id": SITE_WEBSITE_ID },
    about: { "@id": softwareId },
    breadcrumb: { "@id": breadcrumbId },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${SITE_OG_IMAGE}` },
  };

  const software = {
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: SITE_NAME,
    url,
    description: copy.seo.pageDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: locale,
    featureList: copy.seo.features,
    publisher: { "@id": SITE_ORGANIZATION_ID },
    offers: copy.pricing.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.features.join("; "),
      price: plan.price.replace(CURRENCY_SYMBOL, ""),
      priceCurrency: "USD",
      url: SIGN_UP_URL,
      availability: "https://schema.org/InStock",
    })),
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": webpageId },
    inLanguage: locale,
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const howTo = {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: copy.seo.howToName,
    inLanguage: locale,
    totalTime: "P1D",
    step: copy.builder.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return buildGraph([
    buildOrganizationNode(copy.seo.organizationDescription),
    buildWebsiteNode(locale),
    webPage,
    software,
    faq,
    howTo,
    buildBreadcrumbNode(breadcrumbId, [{ name: copy.seo.breadcrumbHome, url }]),
  ]);
};
