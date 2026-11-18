import { createHash, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { BLOG_TAG_PATTERN } from "@/content/blog/remote/cache-tags";

const BEARER_PREFIX = "Bearer ";

const payloadSchema = z.object({
  tags: z.array(z.string().regex(BLOG_TAG_PATTERN)).min(1),
});

const digest = (value: string): Uint8Array =>
  new TextEncoder().encode(createHash("sha256").update(value).digest("hex"));

const isAuthorized = (request: Request): boolean => {
  const secret = process.env.BLOG_REVALIDATE_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header?.startsWith(BEARER_PREFIX)) return false;

  return timingSafeEqual(digest(header.slice(BEARER_PREFIX.length)), digest(secret));
};

const readPayload = async (request: Request): Promise<z.infer<typeof payloadSchema> | null> => {
  try {
    const parsed = payloadSchema.safeParse(await request.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) return Response.json({ ok: false }, { status: 403 });

  const payload = await readPayload(request);
  if (!payload) return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  payload.tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  return Response.json({ ok: true, tags: payload.tags });
}
