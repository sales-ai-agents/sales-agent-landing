import { LegalDocumentView } from "@/components/legal/legal-document";
import { refundPolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(refundPolicy);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function RefundPolicyPage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={refundPolicy} locale={lang} />;
}
