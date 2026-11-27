import { LegalDocumentView } from "@/components/legal/legal-document";
import { termsOfUse } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(termsOfUse);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function TermsOfUsePage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={termsOfUse} locale={lang} />;
}
