import { createHash, timingSafeEqual } from "node:crypto";

const BEARER_PREFIX = "Bearer ";

const digest = (value: string): Uint8Array =>
  new TextEncoder().encode(createHash("sha256").update(value).digest("hex"));

export const isAuthorizedRequest = (request: Request): boolean => {
  const secret = process.env.BLOG_REVALIDATE_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header?.startsWith(BEARER_PREFIX)) return false;

  return timingSafeEqual(digest(header.slice(BEARER_PREFIX.length)), digest(secret));
};
