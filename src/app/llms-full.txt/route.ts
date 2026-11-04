import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { buildLlmsFullTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsFullTxt(DEFAULT_LOCALE), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
