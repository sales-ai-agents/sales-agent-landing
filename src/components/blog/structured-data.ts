import { getLandingCopy } from "@/components/landing/copy";
import { getPosts } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";
import type { Locale } from "@/lib/i18n/config";
import { blogUrl, homeUrl, postUrl } from "@/lib/i18n/paths";
import { isoDate } from "@/lib/seo";
import { SITE_OG_IMAGE, SITE_ORGANIZATION_ID, SITE_URL, SITE_WEBSITE_ID } from "@/lib/site";
import {
  buildBreadcrumbNode,
  buildGraph,
  buildOrganizationNode,
  buildWebsiteNode,
} from "@/lib/structured-data";

const OG_IMAGE_URL = `${SITE_URL}${SITE_OG_IMAGE}`;

const countWords = (post: BlogPost): number =>
  post.blocks
    .flatMap((block) => {
      if (block.type === "list") return block.items;
      if (block.type === "dialog") return block.lines.map((line) => line.text);
      return [block.text];
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

export const buildPostGraph = (locale: Locale, post: BlogPost): object => {
  const copy = getLandingCopy(locale);
  const url = postUrl(locale, post.slug);
  const blogPageUrl = blogUrl(locale);
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  return buildGraph([
    buildOrganizationNode(copy.seo.organizationDescription),
    buildWebsiteNode(locale),
    {
      "@type": "WebPage",
      "@id": pageId,
      url,
      name: post.title,
      description: post.excerpt,
      inLanguage: locale,
      isPartOf: { "@id": SITE_WEBSITE_ID },
      breadcrumb: { "@id": breadcrumbId },
      primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE_URL },
    },
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      url,
      mainEntityOfPage: { "@id": pageId },
      image: OG_IMAGE_URL,
      datePublished: isoDate(post.publishedAt),
      dateModified: isoDate(post.updatedAt),
      author: { "@id": SITE_ORGANIZATION_ID },
      publisher: { "@id": SITE_ORGANIZATION_ID },
      inLanguage: locale,
      articleSection: post.category,
      wordCount: countWords(post),
      timeRequired: `PT${post.readMinutes}M`,
      isPartOf: { "@type": "Blog", "@id": `${blogPageUrl}#blog`, name: copy.blog.name },
    },
    buildBreadcrumbNode(breadcrumbId, [
      { name: copy.seo.breadcrumbHome, url: homeUrl(locale) },
      { name: copy.blog.index.heading, url: blogPageUrl },
      { name: post.title, url },
    ]),
  ]);
};

export const buildBlogIndexGraph = (locale: Locale): object => {
  const copy = getLandingCopy(locale);
  const url = blogUrl(locale);
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  return buildGraph([
    buildOrganizationNode(copy.seo.organizationDescription),
    buildWebsiteNode(locale),
    {
      "@type": "CollectionPage",
      "@id": pageId,
      url,
      name: copy.blog.index.title,
      description: copy.blog.index.schemaDescription,
      inLanguage: locale,
      isPartOf: { "@id": SITE_WEBSITE_ID },
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": `${url}#blog` },
    },
    {
      "@type": "Blog",
      "@id": `${url}#blog`,
      url,
      name: copy.blog.name,
      inLanguage: locale,
      publisher: { "@id": SITE_ORGANIZATION_ID },
      blogPost: getPosts(locale).map((post) => ({
        "@type": "BlogPosting",
        "@id": `${postUrl(locale, post.slug)}#article`,
        headline: post.title,
        url: postUrl(locale, post.slug),
        datePublished: isoDate(post.publishedAt),
      })),
    },
    buildBreadcrumbNode(breadcrumbId, [
      { name: copy.seo.breadcrumbHome, url: homeUrl(locale) },
      { name: copy.blog.index.heading, url },
    ]),
  ]);
};
