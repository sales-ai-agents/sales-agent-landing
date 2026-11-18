export const BLOG_CACHE_TAG = "blog";

export const BLOG_TAG_PATTERN = /^blog(?::[a-z0-9]+(?:-[a-z0-9]+)*)?$/;

export const postCacheTag = (slug: string): string => `${BLOG_CACHE_TAG}:${slug}`;
