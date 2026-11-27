import { LegalDocumentView } from "@/components/legal/legal-document";
import { serviceTerms } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(serviceTerms);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function ServiceTermsPage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={serviceTerms} locale={lang} />;
}
