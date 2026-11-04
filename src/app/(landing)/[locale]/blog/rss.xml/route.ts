import { notFound } from "next/navigation";
import { getLandingCopy } from "@/components/landing/copy";
import { getPosts } from "@/content/blog/posts";
import { isLocale, LOCALES } from "@/lib/i18n/config";
import { blogUrl, postUrl, rssPath } from "@/lib/i18n/paths";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { locale: string }[] {
  return LOCALES.map((locale) => ({ locale }));
}

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const toRfc822 = (value: string): string => new Date(value).toUTCString();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
): Promise<Response> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { blog } = getLandingCopy(locale);
  const posts = getPosts(locale);

  const items = posts
    .map((post) => {
      const url = postUrl(locale, post.slug);
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${toRfc822(post.publishedAt)}</pubDate><category>${escapeXml(post.category)}</category><description>${escapeXml(post.excerpt)}</description></item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(blog.name)}</title><link>${blogUrl(locale)}</link><description>${escapeXml(blog.rssDescription)}</description><language>${locale}</language><atom:link href="${SITE_URL}${rssPath(locale)}" rel="self" type="application/rss+xml"/><lastBuildDate>${toRfc822(posts[0].updatedAt)}</lastBuildDate>${items}</channel></rss>`;

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
