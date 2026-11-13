import type { NavId } from "@/components/landing/copy/client-types";
import type { FooterDocumentId } from "@/components/landing/copy/types";
import { BLOG_BASE_PATH, localizedPath } from "@/lib/i18n/paths";
import type { Locale } from "@/lib/i18n/config";

export const SIGN_UP_URL = "/sign-up";
export const SIGN_IN_URL = "/sign-in";
export const CONTACT_PHONE_HREF = "tel:+380914810542";
export const CONTACT_PHONE_LABEL = "+380 (91) 481 05 42";
export const CONTACT_EMAIL = "salesagentswork@gmail.com";
export const VIDEO_ID = "_DNyhjh_eIo";
export const VIDEO_UPLOADED_AT = "2026-10-30T06:42:46Z";
export const VIDEO_DURATION = "PT8M8S";

export type Speaker = "agent" | "client";

export interface NavItem {
  readonly id: NavId;
  readonly href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "demo", href: "#demo" },
  { id: "scenarios", href: "#scenarios" },
  { id: "control", href: "#control" },
  { id: "pricing", href: "#pricing" },
  { id: "blog", href: BLOG_BASE_PATH },
  { id: "faq", href: "#faq" },
] as const;

export const resolveNavHref = (item: NavItem, basePath: string, locale: Locale): string =>
  item.href.startsWith("#") ? `${basePath}${item.href}` : localizedPath(locale, item.href);

export interface FooterDocument {
  readonly id: FooterDocumentId;
  readonly href: string;
}

export const FOOTER_DOCUMENTS: readonly FooterDocument[] = [
  { id: "offer", href: "/offer" },
  { id: "serviceTerms", href: "/service-terms" },
  { id: "refundPolicy", href: "/refund-policy" },
  { id: "privacyPolicy", href: "/privacy-policy" },
  { id: "cookiePolicy", href: "/cookie-policy" },
  { id: "termsOfUse", href: "/terms-of-use" },
] as const;
