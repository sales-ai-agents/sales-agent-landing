import { EMBEDDED_POSTS } from "@/content/blog/embedded";
import { fetchRemotePost, fetchRemoteSummaries } from "@/content/blog/remote/client";
import type { BlogPost, BlogPostSummary } from "@/content/blog/types";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { CLAUDE_PAGE_SLUG } from "@/lib/i18n/paths";

const EMBEDDED_SLUGS: readonly string[] = EMBEDDED_POSTS[DEFAULT_LOCALE].map((post) => post.slug);

const RESERVED_SLUGS: ReadonlySet<string> = new Set([...EMBEDDED_SLUGS, CLAUDE_PAGE_SLUG]);

const toSummary = (post: BlogPost): BlogPostSummary => ({
  slug: post.slug,
  category: post.category,
  readMinutes: post.readMinutes,
  cover: post.cover,
  title: post.title,
  excerpt: post.excerpt,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
});

const hasRemotePosts = (locale: Locale): boolean => locale === DEFAULT_LOCALE;

const getRemoteSummaries = async (locale: Locale): Promise<BlogPostSummary[]> => {
  if (!hasRemotePosts(locale)) return [];
  const summaries = await fetchRemoteSummaries();
  return summaries.filter((post) => !RESERVED_SLUGS.has(post.slug));
};

export const getEmbeddedSlugs = (): string[] => [...EMBEDDED_SLUGS];

export const getPostLocales = (slug: string): readonly Locale[] =>
  EMBEDDED_SLUGS.includes(slug) ? LOCALES : [DEFAULT_LOCALE];

export const getPosts = async (locale: Locale): Promise<readonly BlogPostSummary[]> => {
  const remote = await getRemoteSummaries(locale);
  return [...remote, ...EMBEDDED_POSTS[locale].map(toSummary)];
};

export const getPostBySlug = async (
  locale: Locale,
  slug: string
): Promise<BlogPost | undefined> => {
  const embedded = EMBEDDED_POSTS[locale].find((post) => post.slug === slug);
  if (embedded) return embedded;
  if (!hasRemotePosts(locale) || RESERVED_SLUGS.has(slug)) return undefined;
  return fetchRemotePost(slug);
};

export const getPostsWithBlocks = async (locale: Locale): Promise<readonly BlogPost[]> => {
  const remote = await getRemoteSummaries(locale);
  const loaded = await Promise.allSettled(remote.map((post) => fetchRemotePost(post.slug)));
  const remotePosts = loaded.flatMap((result) =>
    result.status === "fulfilled" && result.value ? [result.value] : []
  );
  return [...remotePosts, ...EMBEDDED_POSTS[locale]];
};

export const getRelatedPosts = (
  posts: readonly BlogPostSummary[],
  post: BlogPostSummary,
  limit: number
): BlogPostSummary[] => {
  const others = posts.filter((candidate) => candidate.slug !== post.slug);
  const sameCategory = others.filter((candidate) => candidate.category === post.category);
  const otherCategories = others.filter((candidate) => candidate.category !== post.category);
  return [...sameCategory, ...otherCategories].slice(0, limit);
};

export const getLatestUpdate = (posts: readonly BlogPostSummary[]): Date =>
  new Date(Math.max(...posts.map((post) => new Date(post.updatedAt).getTime())));

export const formatPostDate = (locale: Locale, value: string): string =>
  new Intl.DateTimeFormat(LOCALE_META[locale].intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
