"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  DEFAULT_LOCALE,
  LOCALE_LABEL,
  UI_LOCALES,
  type Locale,
  type UiLocale,
} from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
}

const toUiLocale = (locale: Locale): UiLocale =>
  (UI_LOCALES as readonly string[]).includes(locale) ? (locale as UiLocale) : DEFAULT_LOCALE;

const buildPath = (pathname: string, from: Locale, to: UiLocale): string => {
  const fromPrefix = from === DEFAULT_LOCALE ? "" : `/${from}`;
  const stripped =
    fromPrefix && pathname.startsWith(fromPrefix)
      ? pathname.slice(fromPrefix.length) || "/"
      : pathname;
  if (to === DEFAULT_LOCALE) return stripped;
  return `/${to}${stripped === "/" ? "" : stripped}`;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const active = toUiLocale(locale);

  const handleSwitch = (target: UiLocale): void => {
    if (target === active) return;
    router.push(buildPath(pathname, locale, target));
  };

  return (
    <div className="nav-lang" role="group" aria-label="Language">
      {UI_LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          lang={loc}
          aria-current={loc === active ? "true" : undefined}
          onClick={() => handleSwitch(loc)}
        >
          {LOCALE_LABEL[loc]}
        </button>
      ))}
    </div>
  );
}
