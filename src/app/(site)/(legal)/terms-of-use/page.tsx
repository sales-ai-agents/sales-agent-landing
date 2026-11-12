import { LegalDocumentView } from "@/components/legal/legal-document";
import { termsOfUse } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(termsOfUse);

export default function TermsOfUsePage() {
  return <LegalDocumentView document={termsOfUse} />;
}
