import { LegalDocumentView } from "@/components/legal/legal-document";
import { cookiePolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(cookiePolicy);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function CookiePolicyPage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={cookiePolicy} locale={lang} />;
}
