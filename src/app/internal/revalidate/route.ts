import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";

import { BLOG_CACHE_TAG, BLOG_TAG_PATTERN } from "@/content/blog/remote/cache-tags";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { blogUrl, homeUrl, postUrl } from "@/lib/i18n/paths";
import { submitToIndexNow } from "@/lib/indexnow";
import { isAuthorizedRequest } from "@/lib/internal-auth";

const POST_TAG_PREFIX = `${BLOG_CACHE_TAG}:`;

const payloadSchema = z.object({
  tags: z.array(z.string().regex(BLOG_TAG_PATTERN)).min(1),
});

type Payload = z.infer<typeof payloadSchema>;

const readPayload = async (request: Request): Promise<Payload | null> => {
  try {
    const parsed = payloadSchema.safeParse(await request.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

const collectIndexNowUrls = (tags: readonly string[]): string[] => {
  const postUrls = tags
    .filter((tag) => tag.startsWith(POST_TAG_PREFIX))
    .map((tag) => postUrl(DEFAULT_LOCALE, tag.slice(POST_TAG_PREFIX.length)));

  return [...new Set([blogUrl(DEFAULT_LOCALE), homeUrl(DEFAULT_LOCALE), ...postUrls])];
};

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorizedRequest(request)) return Response.json({ ok: false }, { status: 403 });

  const payload = await readPayload(request);
  if (!payload) return Response.json({ ok: false, error: "invalid_payload" }, { status: 400 });

  payload.tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  after(() => submitToIndexNow(collectIndexNowUrls(payload.tags)));

  return Response.json({ ok: true, tags: payload.tags });
}
