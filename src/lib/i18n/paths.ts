import { LANDING_IS_PUBLIC, LANDING_PATH, SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, X_DEFAULT_HREFLANG, type Locale } from "./config";

export const BLOG_BASE_PATH = "/blog";

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

export const landingPath = (locale: Locale): string => localizedPath(locale, LANDING_PATH);

export const landingUrl = (locale: Locale): string => localizedUrl(locale, LANDING_PATH);

export const blogPath = (locale: Locale): string => localizedPath(locale, BLOG_BASE_PATH);

export const blogUrl = (locale: Locale): string => localizedUrl(locale, BLOG_BASE_PATH);

export const postPath = (locale: Locale, slug: string): string =>
  localizedPath(locale, `${BLOG_BASE_PATH}/${slug}`);

export const postUrl = (locale: Locale, slug: string): string =>
  localizedUrl(locale, `${BLOG_BASE_PATH}/${slug}`);

export const rssPath = (locale: Locale): string => `${blogPath(locale)}/rss.xml`;

export const homeUrl = (locale: Locale): string =>
  LANDING_IS_PUBLIC || locale !== DEFAULT_LOCALE ? landingUrl(locale) : SITE_URL;

export const languageAlternates = (urlFor: (locale: Locale) => string): Record<string, string> => ({
  ...Object.fromEntries(LOCALES.map((locale) => [LOCALE_META[locale].hreflang, urlFor(locale)])),
  [X_DEFAULT_HREFLANG]: urlFor(DEFAULT_LOCALE),
});
