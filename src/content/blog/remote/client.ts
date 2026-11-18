import "server-only";

import { PHASE_PRODUCTION_BUILD } from "next/constants";

import type { BlogPost, BlogPostSummary } from "@/content/blog/types";

import { BLOG_CACHE_TAG, postCacheTag } from "./cache-tags";
import { parsePost, parseSummary } from "./mapper";
import { listSchema, postResponseSchema, type RemoteList } from "./schema";
import { isValidSlug } from "./slug";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "https://api.calls4u.ai"}/webhook`;
const REVALIDATE_SECONDS = 600;
const REQUEST_TIMEOUT_MS = 5000;
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

const request = (path: string, tags: string[]): Promise<Response> =>
  fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

const fetchPage = async (offset: number): Promise<RemoteList> => {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
  const response = await request(`/blog/posts?${query}`, [BLOG_CACHE_TAG]);
  if (!response.ok) throw new Error(`Blog list responded with ${response.status}`);
  return listSchema.parse(await response.json());
};

const collectSummaries = async (): Promise<BlogPostSummary[]> => {
  const summaries: BlogPostSummary[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { items, total } = await fetchPage(page * PAGE_SIZE);
    summaries.push(...items.flatMap((item) => parseSummary(item) ?? []));
    if (items.length === 0 || (page + 1) * PAGE_SIZE >= total) break;
  }

  return summaries;
};

const shouldFailFast = (): boolean =>
  process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD;

export const fetchRemoteSummaries = async (): Promise<BlogPostSummary[]> => {
  try {
    return await collectSummaries();
  } catch (error) {
    if (shouldFailFast()) throw error;
    console.error("Blog API is unavailable, serving embedded posts only", error);
    return [];
  }
};

export const fetchRemotePost = async (slug: string): Promise<BlogPost | undefined> => {
  if (!isValidSlug(slug)) return undefined;

  const response = await request(`/blog/posts/${slug}`, [BLOG_CACHE_TAG, postCacheTag(slug)]);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Blog post "${slug}" responded with ${response.status}`);

  const { post } = postResponseSchema.parse(await response.json());
  return parsePost(post) ?? undefined;
};
