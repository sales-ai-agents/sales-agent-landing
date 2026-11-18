import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, X_DEFAULT_HREFLANG, type Locale } from "./config";

export const BLOG_BASE_PATH = "/blog";

export const CLAUDE_PAGE_SLUG = "claude";

const ROOT_PATH = "/";

export const localePrefix = (locale: Locale): string =>
  locale === DEFAULT_LOCALE ? "" : `/${locale}`;

export const localizedPath = (locale: Locale, path: string): string => {
  const suffix = path === ROOT_PATH ? "" : path;
  return `${localePrefix(locale)}${suffix}` || ROOT_PATH;
};

export const localizedUrl = (locale: Locale, path: string): string => {
  const localized = localizedPath(locale, path);
  return localized === ROOT_PATH ? SITE_URL : `${SITE_URL}${localized}`;
};

export const homePath = (locale: Locale): string => localizedPath(locale, ROOT_PATH);

export const homeUrl = (locale: Locale): string => localizedUrl(locale, ROOT_PATH);

export const blogPath = (locale: Locale): string => localizedPath(locale, BLOG_BASE_PATH);

export const blogUrl = (locale: Locale): string => localizedUrl(locale, BLOG_BASE_PATH);

export const postPath = (locale: Locale, slug: string): string =>
  localizedPath(locale, `${BLOG_BASE_PATH}/${slug}`);

export const postUrl = (locale: Locale, slug: string): string =>
  localizedUrl(locale, `${BLOG_BASE_PATH}/${slug}`);

export const claudePath = (locale: Locale): string => postPath(locale, CLAUDE_PAGE_SLUG);

export const claudeUrl = (locale: Locale): string => postUrl(locale, CLAUDE_PAGE_SLUG);

export const rssPath = (locale: Locale): string => `${blogPath(locale)}/rss.xml`;

export const languageAlternates = (
  urlFor: (locale: Locale) => string,
  locales: readonly Locale[] = LOCALES
): Record<string, string> => ({
  ...Object.fromEntries(locales.map((locale) => [LOCALE_META[locale].hreflang, urlFor(locale)])),
  [X_DEFAULT_HREFLANG]: urlFor(DEFAULT_LOCALE),
});
