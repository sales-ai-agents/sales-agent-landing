import {
  buildBreadcrumbNode,
  buildGraph,
  buildOrganizationNode,
  buildWebsiteNode,
} from "@/lib/structured-data";
import {
  LANDING_URL,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_ORGANIZATION_ID,
  SITE_URL,
  SITE_WEBSITE_ID,
} from "@/lib/site";
import { FAQ_ITEMS, PRICING_PLANS } from "@/components/landing/content";
import { ONBOARDING_STEPS } from "@/components/landing/data";

const WEBPAGE_ID = `${LANDING_URL}#webpage`;
const SOFTWARE_ID = `${LANDING_URL}#software`;
const FAQ_ID = `${LANDING_URL}#faq`;
const HOWTO_ID = `${LANDING_URL}#howto`;
const BREADCRUMB_ID = `${LANDING_URL}#breadcrumb`;
const CURRENCY_SYMBOL = "$";
const SIGN_UP_URL = `${SITE_URL}/sign-up`;

const PAGE_TITLE = "Calls4U — голосовий ШІ-агент: дзвінки клієнтам, записи, CRM";
const PAGE_DESCRIPTION =
  "Голосовий ШІ-агент, який автоматизує рутинні дзвінки клієнтам: підтвердження записів, нагадування, уточнення замовлень, кваліфікація лідів та інтеграція з CRM.";

const FEATURES = [
  "Підтвердження записів",
  "Нагадування про візити",
  "Уточнення замовлень",
  "Кваліфікація лідів",
  "Інтеграція з CRM, Google Sheets, CSV та webhooks",
  "Конструктор агента без коду",
  "Передача дзвінка менеджеру",
  "Журнал дзвінків із записом розмови",
];

const buildOffers = (): object[] =>
  PRICING_PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    description: plan.features.join("; "),
    price: plan.price.replace(CURRENCY_SYMBOL, ""),
    priceCurrency: "USD",
    url: SIGN_UP_URL,
    availability: "https://schema.org/InStock",
  }));

const buildWebPageNode = (): object => ({
  "@type": "WebPage",
  "@id": WEBPAGE_ID,
  url: LANDING_URL,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  inLanguage: "uk",
  isPartOf: { "@id": SITE_WEBSITE_ID },
  about: { "@id": SOFTWARE_ID },
  breadcrumb: { "@id": BREADCRUMB_ID },
  primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${SITE_OG_IMAGE}` },
});

const buildSoftwareNode = (): object => ({
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_ID,
  name: SITE_NAME,
  url: LANDING_URL,
  description: PAGE_DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: "uk",
  featureList: FEATURES,
  publisher: { "@id": SITE_ORGANIZATION_ID },
  offers: buildOffers(),
});

const buildFaqNode = (): object => ({
  "@type": "FAQPage",
  "@id": FAQ_ID,
  isPartOf: { "@id": WEBPAGE_ID },
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

const buildHowToNode = (): object => ({
  "@type": "HowTo",
  "@id": HOWTO_ID,
  name: "Як запустити ШІ-агента для дзвінків за 4 кроки",
  totalTime: "P1D",
  step: ONBOARDING_STEPS.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.description,
  })),
});

export const LANDING_GRAPH = buildGraph([
  buildOrganizationNode(),
  buildWebsiteNode(),
  buildWebPageNode(),
  buildSoftwareNode(),
  buildFaqNode(),
  buildHowToNode(),
  buildBreadcrumbNode(BREADCRUMB_ID, [{ name: "Головна", url: LANDING_URL }]),
]);
