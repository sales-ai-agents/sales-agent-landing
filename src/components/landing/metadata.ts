import type { Metadata } from "next";
import { LANDING_ROBOTS, OG_IMAGE, OG_LOCALES } from "@/lib/seo";
import { BRAND_ALTERNATE_NAMES, LANDING_PATH, LANDING_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Calls4U — голосовий ШІ-агент: дзвінки клієнтам, записи, CRM";
const DESCRIPTION =
  "Calls4U — голосовий ШІ-агент, який підтверджує записи, нагадує про візити, уточнює замовлення й передає результат у CRM. Тестовий дзвінок за 20 секунд, запуск за 1 день.";
const SOCIAL_DESCRIPTION =
  "ШІ-агент телефонує клієнтам за вас: записи, нагадування, замовлення, ліди. Результат — у CRM. Запуск за 1 день, без програмістів.";

const KEYWORDS = [
  "Calls4U",
  ...BRAND_ALTERNATE_NAMES,
  "ШІ-агент для дзвінків",
  "голосовий ШІ-агент",
  "автоматизація дзвінків",
  "автообдзвін клієнтів",
  "підтвердження запису по телефону",
  "ИИ-агент для звонков",
  "голосовой ИИ-агент",
  "автоматизация звонков",
  "AI voice agent",
  "AI calling agent",
  "outbound call automation",
  "voice AI for business",
];

export const LANDING_METADATA: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  alternates: {
    canonical: LANDING_PATH,
    languages: { "uk-UA": LANDING_URL, "x-default": LANDING_URL },
  },
  robots: LANDING_ROBOTS,
  openGraph: {
    type: "website",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    url: LANDING_URL,
    siteName: SITE_NAME,
    images: [OG_IMAGE],
    ...OG_LOCALES,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};
