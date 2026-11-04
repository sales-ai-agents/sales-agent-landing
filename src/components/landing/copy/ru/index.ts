import type { LandingCopy } from "@/components/landing/copy/types";
import { RU_CLIENT } from "@/components/landing/copy/ru/client";
import {
  RU_BLOG_PAGES,
  RU_BLOG_TEASER,
  RU_FAQ,
  RU_FINAL_CTA,
  RU_FOOTER,
  RU_LLMS,
  RU_SEO,
} from "@/components/landing/copy/ru/pages";
import {
  RU_DASHBOARD,
  RU_INTEGRATIONS,
  RU_PRICING,
  RU_SECURITY,
  RU_VIDEO,
} from "@/components/landing/copy/ru/product";
import {
  RU_BUILDER,
  RU_DEMO,
  RU_HERO,
  RU_NUMBERS,
  RU_SCENARIOS,
} from "@/components/landing/copy/ru/sections";

export const RU_COPY: LandingCopy = {
  seo: RU_SEO,
  client: RU_CLIENT,
  footer: RU_FOOTER,
  hero: RU_HERO,
  demo: RU_DEMO,
  numbers: RU_NUMBERS,
  scenarios: RU_SCENARIOS,
  builder: RU_BUILDER,
  dashboard: RU_DASHBOARD,
  integrations: RU_INTEGRATIONS,
  video: RU_VIDEO,
  pricing: RU_PRICING,
  security: RU_SECURITY,
  blogTeaser: RU_BLOG_TEASER,
  faq: RU_FAQ,
  finalCta: RU_FINAL_CTA,
  blog: RU_BLOG_PAGES,
  llms: RU_LLMS,
};
