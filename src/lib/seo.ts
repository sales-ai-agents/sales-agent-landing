import type { Metadata } from "next";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { LANDING_IS_PUBLIC, SITE_OG_IMAGE } from "@/lib/site";

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

const HIDDEN_ROBOTS: NonNullable<Metadata["robots"]> = { index: false, follow: false };

export const LANDING_ROBOTS = LANDING_IS_PUBLIC ? INDEXABLE_ROBOTS : HIDDEN_ROBOTS;

export const buildOgImage = (alt: string) =>
  ({
    url: SITE_OG_IMAGE,
    width: 1200,
    height: 630,
    type: "image/jpeg",
    alt,
  }) as const;

export const buildOgLocales = (locale: Locale) => ({
  locale: LOCALE_META[locale].ogLocale,
  alternateLocale: LOCALES.filter((candidate) => candidate !== locale).map(
    (candidate) => LOCALE_META[candidate].ogLocale
  ),
});

export const isoDate = (value: string): string => new Date(value).toISOString();
