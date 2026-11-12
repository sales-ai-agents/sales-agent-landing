import { LegalDocumentView } from "@/components/legal/legal-document";
import { offer } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(offer);

export default function OfferPage() {
  return <LegalDocumentView document={offer} />;
}
