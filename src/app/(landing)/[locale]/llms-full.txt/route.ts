import { notFound } from "next/navigation";
import { isLocale, NON_DEFAULT_LOCALES } from "@/lib/i18n/config";
import { buildLlmsFullTxt } from "@/lib/llms";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { locale: string }[] {
  return NON_DEFAULT_LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
): Promise<Response> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return new Response(buildLlmsFullTxt(locale), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
