import sitemap from "@/app/sitemap";
import { submitToIndexNow } from "@/lib/indexnow";
import { isAuthorizedRequest } from "@/lib/internal-auth";

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorizedRequest(request)) return Response.json({ ok: false }, { status: 403 });

  const urls = (await sitemap()).map((entry) => entry.url);
  const submitted = await submitToIndexNow(urls);

  return Response.json({ ok: true, submitted, urls: urls.length });
}
