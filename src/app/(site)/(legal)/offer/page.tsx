import { LegalDocumentView } from "@/components/legal/legal-document";
import { offer } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(offer);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function OfferPage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={offer} locale={lang} />;
}
