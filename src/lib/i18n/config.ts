export const LOCALES = ["uk", "ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uk";

export const X_DEFAULT_HREFLANG = "x-default";

interface LocaleMeta {
  readonly hreflang: string;
  readonly ogLocale: string;
  readonly intl: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  uk: { hreflang: "uk", ogLocale: "uk_UA", intl: "uk-UA" },
  ru: { hreflang: "ru", ogLocale: "ru_RU", intl: "ru-RU" },
  en: { hreflang: "en", ogLocale: "en_US", intl: "en-GB" },
};

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

export const NON_DEFAULT_LOCALES: readonly Locale[] = LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE
);
