import type { Metadata } from "next";
import { getLandingCopy } from "@/components/landing/copy";
import type { Locale } from "@/lib/i18n/config";
import { homePath, homeUrl, languageAlternates } from "@/lib/i18n/paths";
import { buildOgImage, buildOgLocales, INDEXABLE_ROBOTS } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const buildLandingMetadata = (locale: Locale): Metadata => {
  const { seo } = getLandingCopy(locale);
  const url = homeUrl(locale);
  const image = buildOgImage(seo.ogImageAlt);

  return {
    title: { absolute: seo.title },
    description: seo.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "business",
    alternates: {
      canonical: homePath(locale),
      languages: languageAlternates(homeUrl),
    },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "website",
      title: seo.title,
      description: seo.socialDescription,
      url,
      siteName: SITE_NAME,
      images: [image],
      ...buildOgLocales(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.socialDescription,
      images: [image.url],
    },
  };
};
