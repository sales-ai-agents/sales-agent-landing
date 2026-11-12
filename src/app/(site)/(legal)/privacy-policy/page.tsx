import { LegalDocumentView } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(privacyPolicy);

export default function PrivacyPolicyPage() {
  return <LegalDocumentView document={privacyPolicy} />;
}
