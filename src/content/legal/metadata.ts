import type { Metadata } from "next";
import { DEFAULT_LOCALE, LOCALE_META } from "@/lib/i18n/config";
import { buildOgImage, INDEXABLE_ROBOTS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { LegalDocument } from "./types";

export const buildLegalMetadata = (document: LegalDocument): Metadata => {
  const image = buildOgImage(SITE_NAME);

  return {
    title: document.metaTitle,
    description: document.metaDescription,
    alternates: { canonical: document.slug },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "article",
      title: document.metaTitle,
      description: document.metaDescription,
      url: document.slug,
      siteName: SITE_NAME,
      locale: LOCALE_META[DEFAULT_LOCALE].ogLocale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: document.metaTitle,
      description: document.metaDescription,
      images: [image.url],
    },
  };
};
