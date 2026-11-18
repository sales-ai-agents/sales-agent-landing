import type { MetadataRoute } from "next";
import { CLAUDE_PAGE_UPDATED_AT } from "@/content/blog/claude";
import { getLatestUpdate, getPostLocales, getPosts } from "@/content/blog/posts";
import type { BlogPostSummary } from "@/content/blog/types";
import { LEGAL_PAGE_LIST } from "@/lib/constants";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { blogUrl, claudeUrl, homeUrl, languageAlternates, postUrl } from "@/lib/i18n/paths";
import { LANDING_UPDATED_AT, SITE_URL } from "@/lib/site";

type SitemapEntry = MetadataRoute.Sitemap[number];
type PostsByLocale = Readonly<Record<Locale, readonly BlogPostSummary[]>>;

const localizedEntries = (
  urlFor: (locale: Locale) => string,
  entry: (locale: Locale) => Omit<SitemapEntry, "url" | "alternates">
): MetadataRoute.Sitemap =>
  LOCALES.map((locale) => ({
    url: urlFor(locale),
    ...entry(locale),
    alternates: { languages: languageAlternates(urlFor) },
  }));

const loadPostsByLocale = async (): Promise<PostsByLocale> => {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => [locale, await getPosts(locale)] as const)
  );
  return Object.fromEntries(entries) as PostsByLocale;
};

const buildPostRoutes = (postsByLocale: PostsByLocale): MetadataRoute.Sitemap =>
  LOCALES.flatMap((locale) =>
    postsByLocale[locale].map((post) => ({
      url: postUrl(locale, post.slug),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: languageAlternates(
          (candidate) => postUrl(candidate, post.slug),
          getPostLocales(post.slug)
        ),
      },
    }))
  );

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = await loadPostsByLocale();

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

  const blogIndexRoutes = localizedEntries(blogUrl, (locale) => ({
    lastModified: getLatestUpdate(postsByLocale[locale]),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const claudeRoutes = localizedEntries(claudeUrl, () => ({
    lastModified: new Date(CLAUDE_PAGE_UPDATED_AT),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...homeRoutes,
    ...blogIndexRoutes,
    ...buildPostRoutes(postsByLocale),
    ...claudeRoutes,
    ...legalRoutes,
  ];
}
