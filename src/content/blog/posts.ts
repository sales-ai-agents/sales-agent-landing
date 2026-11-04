import type { BlogPost } from "@/content/blog/types";
import { scenariosPost } from "@/content/blog/posts/scenarios";
import { missedCallsPost } from "@/content/blog/posts/missed-calls";
import { agentVsAdminPost } from "@/content/blog/posts/agent-vs-admin";
import { crmInADayPost } from "@/content/blog/posts/crm-in-a-day";
import { mythsPost } from "@/content/blog/posts/myths";
import { scriptTipsPost } from "@/content/blog/posts/script-tips";

export const BLOG_POSTS: readonly BlogPost[] = [
  scenariosPost,
  missedCallsPost,
  agentVsAdminPost,
  crmInADayPost,
  mythsPost,
  scriptTipsPost,
];

export const BLOG_BASE_PATH = "/blog";

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const getPostPath = (post: BlogPost): string => `${BLOG_BASE_PATH}/${post.slug}`;

export const getRelatedPosts = (post: BlogPost, limit: number): BlogPost[] =>
  BLOG_POSTS.filter((candidate) => candidate.slug !== post.slug).slice(0, limit);

export const formatReadTime = (post: BlogPost): string => `${post.readMinutes} хв`;

const DATE_FORMATTER = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatPostDate = (value: string): string => DATE_FORMATTER.format(new Date(value));
