import type { LandingCopy } from "@/components/landing/copy/types";
import { EN_CLIENT } from "@/components/landing/copy/en/client";
import {
  EN_BLOG_PAGES,
  EN_BLOG_TEASER,
  EN_FAQ,
  EN_FINAL_CTA,
  EN_FOOTER,
  EN_LLMS,
  EN_SEO,
} from "@/components/landing/copy/en/pages";
import {
  EN_DASHBOARD,
  EN_INTEGRATIONS,
  EN_PRICING,
  EN_SECURITY,
  EN_VIDEO,
} from "@/components/landing/copy/en/product";
import {
  EN_BUILDER,
  EN_DEMO,
  EN_HERO,
  EN_NUMBERS,
  EN_SCENARIOS,
} from "@/components/landing/copy/en/sections";

export const EN_COPY: LandingCopy = {
  seo: EN_SEO,
  client: EN_CLIENT,
  footer: EN_FOOTER,
  hero: EN_HERO,
  demo: EN_DEMO,
  numbers: EN_NUMBERS,
  scenarios: EN_SCENARIOS,
  builder: EN_BUILDER,
  dashboard: EN_DASHBOARD,
  integrations: EN_INTEGRATIONS,
  video: EN_VIDEO,
  pricing: EN_PRICING,
  security: EN_SECURITY,
  blogTeaser: EN_BLOG_TEASER,
  faq: EN_FAQ,
  finalCta: EN_FINAL_CTA,
  blog: EN_BLOG_PAGES,
  llms: EN_LLMS,
};
