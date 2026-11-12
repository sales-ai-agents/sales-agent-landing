import { LegalDocumentView } from "@/components/legal/legal-document";
import { refundPolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(refundPolicy);

export default function RefundPolicyPage() {
  return <LegalDocumentView document={refundPolicy} />;
}
