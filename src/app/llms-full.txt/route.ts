import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { buildLlmsFullTxt } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return new Response(await buildLlmsFullTxt(DEFAULT_LOCALE), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
