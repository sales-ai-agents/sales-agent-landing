import type { BlogPost, BlogPostSummary, PostBlock } from "@/content/blog/types";

import {
  blockSchema,
  detailSchema,
  summarySchema,
  type RemoteBlock,
  type RemoteDetail,
  type RemoteSummary,
} from "./schema";

const toPostBlock = (block: RemoteBlock): PostBlock => {
  switch (block.type) {
    case "h2":
      return { type: "heading", text: block.text };
    case "p":
      return { type: "paragraph", text: block.text };
    case "ul":
      return { type: "list", items: block.items };
    case "dialog":
      return {
        type: "dialog",
        lines: block.messages.map((message) => ({ speaker: message.role, text: message.text })),
      };
    default:
      return block;
  }
};

const toPostBlocks = (blocks: readonly unknown[]): PostBlock[] =>
  blocks.flatMap((candidate) => {
    const parsed = blockSchema.safeParse(candidate);
    return parsed.success ? [toPostBlock(parsed.data)] : [];
  });

const toSummaryFields = (remote: RemoteSummary): BlogPostSummary => ({
  slug: remote.slug,
  category: remote.category_label,
  readMinutes: remote.reading_minutes,
  cover: remote.cover,
  title: remote.title,
  excerpt: remote.description,
  publishedAt: remote.published_at ?? remote.updated_at,
  updatedAt: remote.updated_at,
});

const toPost = (remote: RemoteDetail): BlogPost => ({
  ...toSummaryFields(remote),
  keywords: remote.keywords,
  blocks: toPostBlocks(remote.blocks),
});

export const parseSummary = (candidate: unknown): BlogPostSummary | null => {
  const parsed = summarySchema.safeParse(candidate);
  return parsed.success ? toSummaryFields(parsed.data) : null;
};

export const parsePost = (candidate: unknown): BlogPost | null => {
  const parsed = detailSchema.safeParse(candidate);
  return parsed.success ? toPost(parsed.data) : null;
};
