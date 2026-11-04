import type { MetadataRoute } from "next";
import { BLOG_BASE_PATH, BLOG_POSTS, getPostPath } from "@/content/blog/posts";
import { LEGAL_PAGE_LIST } from "@/lib/constants";
import { LANDING_IS_PUBLIC, LANDING_URL, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const latestPostUpdate = new Date(
    Math.max(...BLOG_POSTS.map((post) => new Date(post.updatedAt).getTime()))
  );

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_PAGE_LIST.map((page) => ({
    url: `${SITE_URL}${page.href}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}${getPostPath(post)}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const landingRoutes: MetadataRoute.Sitemap = LANDING_IS_PUBLIC
    ? [{ url: LANDING_URL, lastModified, changeFrequency: "weekly", priority: 1 }]
    : [];

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...landingRoutes,
    {
      url: `${SITE_URL}${BLOG_BASE_PATH}`,
      lastModified: latestPostUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogRoutes,
    ...legalRoutes,
  ];
}
