import { BLOG_BASE_PATH, BLOG_POSTS, getPostPath } from "@/content/blog/posts";
import type { BlogPost } from "@/content/blog/types";
import { isoDate } from "@/lib/seo";
import {
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_ORGANIZATION_ID,
  SITE_URL,
  SITE_WEBSITE_ID,
} from "@/lib/site";
import {
  buildBreadcrumbNode,
  buildGraph,
  buildOrganizationNode,
  buildWebsiteNode,
} from "@/lib/structured-data";

export const BLOG_URL = `${SITE_URL}${BLOG_BASE_PATH}`;

const OG_IMAGE_URL = `${SITE_URL}${SITE_OG_IMAGE}`;
const HOME_BREADCRUMB = { name: "Головна", url: SITE_URL };
const BLOG_BREADCRUMB = { name: "Блог", url: BLOG_URL };

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

export const buildPostGraph = (post: BlogPost): object => {
  const url = `${SITE_URL}${getPostPath(post)}`;
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  return buildGraph([
    buildOrganizationNode(),
    buildWebsiteNode(),
    {
      "@type": "WebPage",
      "@id": pageId,
      url,
      name: post.title,
      description: post.excerpt,
      inLanguage: "uk",
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
      inLanguage: "uk",
      articleSection: post.category,
      wordCount: countWords(post),
      timeRequired: `PT${post.readMinutes}M`,
      isPartOf: { "@type": "Blog", "@id": `${BLOG_URL}#blog`, name: `Блог ${SITE_NAME}` },
    },
    buildBreadcrumbNode(breadcrumbId, [
      HOME_BREADCRUMB,
      BLOG_BREADCRUMB,
      { name: post.title, url },
    ]),
  ]);
};

export const buildBlogIndexGraph = (): object => {
  const pageId = `${BLOG_URL}#webpage`;
  const breadcrumbId = `${BLOG_URL}#breadcrumb`;

  return buildGraph([
    buildOrganizationNode(),
    buildWebsiteNode(),
    {
      "@type": "CollectionPage",
      "@id": pageId,
      url: BLOG_URL,
      name: `Блог ${SITE_NAME} — дзвінки, продажі та ШІ`,
      description:
        "Гайди, розрахунки і практичні поради про автоматизацію дзвінків, голосових ШІ-агентів і продажі по телефону.",
      inLanguage: "uk",
      isPartOf: { "@id": SITE_WEBSITE_ID },
      breadcrumb: { "@id": breadcrumbId },
      mainEntity: { "@id": `${BLOG_URL}#blog` },
    },
    {
      "@type": "Blog",
      "@id": `${BLOG_URL}#blog`,
      url: BLOG_URL,
      name: `Блог ${SITE_NAME}`,
      inLanguage: "uk",
      publisher: { "@id": SITE_ORGANIZATION_ID },
      blogPost: BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_URL}${getPostPath(post)}#article`,
        headline: post.title,
        url: `${SITE_URL}${getPostPath(post)}`,
        datePublished: isoDate(post.publishedAt),
      })),
    },
    buildBreadcrumbNode(breadcrumbId, [HOME_BREADCRUMB, BLOG_BREADCRUMB]),
  ]);
};
