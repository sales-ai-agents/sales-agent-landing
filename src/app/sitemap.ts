import type { MetadataRoute } from "next";
import { getLatestUpdate, getPostBySlug, getPostSlugs } from "@/content/blog/posts";
import { LEGAL_PAGE_LIST } from "@/lib/constants";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { blogUrl, homeUrl, languageAlternates, postUrl } from "@/lib/i18n/paths";
import { LANDING_UPDATED_AT, SITE_URL } from "@/lib/site";

type SitemapEntry = MetadataRoute.Sitemap[number];

const localizedEntries = (
  urlFor: (locale: Locale) => string,
  entry: (locale: Locale) => Omit<SitemapEntry, "url" | "alternates">
): MetadataRoute.Sitemap =>
  LOCALES.map((locale) => ({
    url: urlFor(locale),
    ...entry(locale),
    alternates: { languages: languageAlternates(urlFor) },
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  const legalRoutes: MetadataRoute.Sitemap = LEGAL_PAGE_LIST.map((page) => ({
    url: `${SITE_URL}${page.href}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const homeRoutes = localizedEntries(homeUrl, () => ({
    lastModified: new Date(LANDING_UPDATED_AT),
    changeFrequency: "weekly",
    priority: 1,
  }));

  const blogIndexRoutes = localizedEntries(blogUrl, () => ({
    lastModified: getLatestUpdate(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes = getPostSlugs().flatMap((slug) =>
    localizedEntries(
      (locale) => postUrl(locale, slug),
      (locale) => ({
        lastModified: new Date(getPostBySlug(locale, slug)?.updatedAt ?? LANDING_UPDATED_AT),
        changeFrequency: "monthly",
        priority: 0.7,
      })
    )
  );

  return [...homeRoutes, ...blogIndexRoutes, ...postRoutes, ...legalRoutes];
}
