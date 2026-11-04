import type { LandingCopy } from "@/components/landing/copy/types";
import { UK_CLIENT } from "@/components/landing/copy/uk/client";
import {
  UK_BLOG_PAGES,
  UK_BLOG_TEASER,
  UK_FAQ,
  UK_FINAL_CTA,
  UK_FOOTER,
  UK_LLMS,
  UK_SEO,
} from "@/components/landing/copy/uk/pages";
import {
  UK_DASHBOARD,
  UK_INTEGRATIONS,
  UK_PRICING,
  UK_SECURITY,
  UK_VIDEO,
} from "@/components/landing/copy/uk/product";
import {
  UK_BUILDER,
  UK_DEMO,
  UK_HERO,
  UK_NUMBERS,
  UK_SCENARIOS,
} from "@/components/landing/copy/uk/sections";

export const UK_COPY: LandingCopy = {
  seo: UK_SEO,
  client: UK_CLIENT,
  footer: UK_FOOTER,
  hero: UK_HERO,
  demo: UK_DEMO,
  numbers: UK_NUMBERS,
  scenarios: UK_SCENARIOS,
  builder: UK_BUILDER,
  dashboard: UK_DASHBOARD,
  integrations: UK_INTEGRATIONS,
  video: UK_VIDEO,
  pricing: UK_PRICING,
  security: UK_SECURITY,
  blogTeaser: UK_BLOG_TEASER,
  faq: UK_FAQ,
  finalCta: UK_FINAL_CTA,
  blog: UK_BLOG_PAGES,
  llms: UK_LLMS,
};
