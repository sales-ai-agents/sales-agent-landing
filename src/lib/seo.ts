import type { Metadata } from "next";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { SITE_OG_IMAGE } from "@/lib/site";

export const INDEXABLE_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = { index: false, follow: false };

export const buildOgImage = (alt: string) =>
  ({
    url: SITE_OG_IMAGE,
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt,
  }) as const;

export const buildOgLocales = (locale: Locale, available: readonly Locale[] = LOCALES) => ({
  locale: LOCALE_META[locale].ogLocale,
  alternateLocale: available
    .filter((candidate) => candidate !== locale)
    .map((candidate) => LOCALE_META[candidate].ogLocale),
});

const META_TITLE_MAX_LENGTH = 70;
const TITLE_SEPARATOR = " | ";
const ELLIPSIS = "…";

const truncateAtWord = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) return value;
  const limit = maxLength - ELLIPSIS.length;
  const lastSpace = value.lastIndexOf(" ", limit);
  return `${value.slice(0, lastSpace > 0 ? lastSpace : limit).trimEnd()}${ELLIPSIS}`;
};

export const fitTitle = (title: string, brand: string): string => {
  const branded = `${title}${TITLE_SEPARATOR}${brand}`;
  return branded.length <= META_TITLE_MAX_LENGTH
    ? branded
    : truncateAtWord(title, META_TITLE_MAX_LENGTH);
};

export const isoDate = (value: string): string => new Date(value).toISOString();
