import { z } from "zod";

const speakerSchema = z.enum(["agent", "client"]);

const coverSchema = z.object({
  variant: z.enum(["econ", "five", "vs", "myth", "script", "photo"]),
  label: z.string(),
  big: z.string().optional(),
  caption: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  bubbles: z.array(z.object({ role: speakerSchema, text: z.string() })).optional(),
});

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lead"), text: z.string() }),
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("ul"), items: z.array(z.string()) }),
  z.object({ type: z.literal("quote"), text: z.string() }),
  z.object({ type: z.literal("formula"), text: z.string() }),
  z.object({ type: z.literal("note"), text: z.string() }),
  z.object({
    type: z.literal("dialog"),
    messages: z.array(z.object({ role: speakerSchema, text: z.string() })),
  }),
]);

export const summarySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  category_label: z.string().min(1),
  cover: coverSchema,
  reading_minutes: z.number(),
  published_at: z.string().nullable(),
  updated_at: z.string(),
});

export const detailSchema = summarySchema.extend({
  keywords: z.array(z.string()).default([]),
  blocks: z.array(z.unknown()),
});

export const listSchema = z.object({
  items: z.array(z.unknown()),
  total: z.number(),
});

export const postResponseSchema = z.object({ post: z.unknown() });

export type RemoteBlock = z.infer<typeof blockSchema>;
export type RemoteSummary = z.infer<typeof summarySchema>;
export type RemoteList = z.infer<typeof listSchema>;
export type RemoteDetail = z.infer<typeof detailSchema>;
