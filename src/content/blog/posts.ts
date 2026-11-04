import type { BlogPost } from "@/content/blog/types";
import { agentVsAdminPost as agentVsAdminUk } from "@/content/blog/uk/agent-vs-admin";
import { crmInADayPost as crmInADayUk } from "@/content/blog/uk/crm-in-a-day";
import { missedCallsPost as missedCallsUk } from "@/content/blog/uk/missed-calls";
import { mythsPost as mythsUk } from "@/content/blog/uk/myths";
import { scenariosPost as scenariosUk } from "@/content/blog/uk/scenarios";
import { scriptTipsPost as scriptTipsUk } from "@/content/blog/uk/script-tips";
import { agentVsAdminPost as agentVsAdminRu } from "@/content/blog/ru/agent-vs-admin";
import { crmInADayPost as crmInADayRu } from "@/content/blog/ru/crm-in-a-day";
import { missedCallsPost as missedCallsRu } from "@/content/blog/ru/missed-calls";
import { mythsPost as mythsRu } from "@/content/blog/ru/myths";
import { scenariosPost as scenariosRu } from "@/content/blog/ru/scenarios";
import { scriptTipsPost as scriptTipsRu } from "@/content/blog/ru/script-tips";
import { agentVsAdminPost as agentVsAdminEn } from "@/content/blog/en/agent-vs-admin";
import { crmInADayPost as crmInADayEn } from "@/content/blog/en/crm-in-a-day";
import { missedCallsPost as missedCallsEn } from "@/content/blog/en/missed-calls";
import { mythsPost as mythsEn } from "@/content/blog/en/myths";
import { scenariosPost as scenariosEn } from "@/content/blog/en/scenarios";
import { scriptTipsPost as scriptTipsEn } from "@/content/blog/en/script-tips";
import { LOCALE_META, type Locale } from "@/lib/i18n/config";

const POSTS: Readonly<Record<Locale, readonly BlogPost[]>> = {
  uk: [scenariosUk, missedCallsUk, agentVsAdminUk, crmInADayUk, mythsUk, scriptTipsUk],
  ru: [scenariosRu, missedCallsRu, agentVsAdminRu, crmInADayRu, mythsRu, scriptTipsRu],
  en: [scenariosEn, missedCallsEn, agentVsAdminEn, crmInADayEn, mythsEn, scriptTipsEn],
};

export const getPosts = (locale: Locale): readonly BlogPost[] => POSTS[locale];

export const getPostSlugs = (): string[] => POSTS.uk.map((post) => post.slug);

export const getPostBySlug = (locale: Locale, slug: string): BlogPost | undefined =>
  POSTS[locale].find((post) => post.slug === slug);

export const getRelatedPosts = (locale: Locale, post: BlogPost, limit: number): BlogPost[] =>
  POSTS[locale].filter((candidate) => candidate.slug !== post.slug).slice(0, limit);

export const getLatestUpdate = (): Date =>
  new Date(Math.max(...POSTS.uk.map((post) => new Date(post.updatedAt).getTime())));

export const formatPostDate = (locale: Locale, value: string): string =>
  new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
