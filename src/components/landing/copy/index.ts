import type { Locale } from "@/lib/i18n/config";
import type { ClientCopy } from "@/components/landing/copy/client-types";
import type { LandingCopy } from "@/components/landing/copy/types";
import { EN_COPY } from "@/components/landing/copy/en";
import { RU_COPY } from "@/components/landing/copy/ru";
import { UK_COPY } from "@/components/landing/copy/uk";

const COPY: Readonly<Record<Locale, LandingCopy>> = {
  uk: UK_COPY,
  ru: RU_COPY,
  en: EN_COPY,
};

export const getLandingCopy = (locale: Locale): LandingCopy => COPY[locale];

export const getClientCopy = (locale: Locale): ClientCopy => COPY[locale].client;
