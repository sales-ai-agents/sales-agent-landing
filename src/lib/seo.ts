import type { Metadata } from "next";
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

export const OG_IMAGE = {
  url: SITE_OG_IMAGE,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Calls4U — голосовий ШІ-агент для дзвінків",
} as const;

export const OG_LOCALES = {
  locale: "uk_UA",
  alternateLocale: ["ru_RU", "en_US"],
};

export const isoDate = (value: string): string => new Date(value).toISOString();
