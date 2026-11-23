import { CLAUDE_CONNECTOR_URL, LEGAL_PAGES } from "@/lib/constants";
import { SITE_CONTACT, SITE_URL } from "@/lib/site";

import type { RichLink } from "./types";

export const CONNECTOR_URL = CLAUDE_CONNECTOR_URL;

export const SIGN_UP_LINK: RichLink = { label: "calls4u.ai", href: SITE_URL };

export const SUPPORT_EMAIL_LINK: RichLink = {
  label: SITE_CONTACT.email,
  href: `mailto:${SITE_CONTACT.email}`,
};

export const SUPPORT_TELEGRAM_LINK: RichLink = {
  label: "@bovsanka",
  href: "https://t.me/bovsanka",
};

export const PRIVACY_POLICY_HREF = LEGAL_PAGES.privacyPolicy.href;
