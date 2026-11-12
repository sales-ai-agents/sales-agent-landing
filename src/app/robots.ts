import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = ["/dashboard/", "/api/"];
const AUTH_PATHS = [
  "/sign-in/",
  "/sign-up/",
  "/forgot-password/",
  "/email-confirm/",
  "/email-confirmed/",
  "/auth/",
];

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: [...PRIVATE_PATHS, ...AUTH_PATHS] },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
