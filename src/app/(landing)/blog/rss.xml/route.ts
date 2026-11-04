import { BLOG_BASE_PATH, BLOG_POSTS, getPostPath } from "@/content/blog/posts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (value: string): string => new Date(value).toUTCString();

export function GET(): Response {
  const items = BLOG_POSTS.map((post) => {
    const url = `${SITE_URL}${getPostPath(post)}`;
    return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${toRfc822(post.publishedAt)}</pubDate><category>${escapeXml(post.category)}</category><description>${escapeXml(post.excerpt)}</description></item>`;
  }).join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Блог ${SITE_NAME}</title><link>${SITE_URL}${BLOG_BASE_PATH}</link><description>Гайди, розрахунки і поради про автоматизацію дзвінків та ШІ-агентів.</description><language>uk</language><atom:link href="${SITE_URL}${BLOG_BASE_PATH}/rss.xml" rel="self" type="application/rss+xml"/><lastBuildDate>${toRfc822(BLOG_POSTS[0].updatedAt)}</lastBuildDate>${items}</channel></rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
