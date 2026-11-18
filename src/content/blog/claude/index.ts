import type { Locale } from "@/lib/i18n/config";

import { CLAUDE_PAGE_EN } from "./en";
import { CLAUDE_PAGE_RU } from "./ru";
import type { ClaudePage } from "./types";
import { CLAUDE_PAGE_UK } from "./uk";

export const CLAUDE_PAGE_UPDATED_AT = "2026-11-18";

const CLAUDE_PAGES: Readonly<Record<Locale, ClaudePage>> = {
  uk: CLAUDE_PAGE_UK,
  ru: CLAUDE_PAGE_RU,
  en: CLAUDE_PAGE_EN,
};

export const getClaudePage = (locale: Locale): ClaudePage => CLAUDE_PAGES[locale];
