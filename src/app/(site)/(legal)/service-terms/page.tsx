import { LegalDocumentView } from "@/components/legal/legal-document";
import { serviceTerms } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(serviceTerms);

export default function ServiceTermsPage() {
  return <LegalDocumentView document={serviceTerms} />;
}
