import type { MetadataRoute } from "next";

import { LEGAL_PAGE_LIST } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.calls4u.ai";
  const lastModified = new Date();

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_PAGE_LIST.map((page) => ({
    url: `${baseUrl}${page.href}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...legalRoutes,
  ];
}
