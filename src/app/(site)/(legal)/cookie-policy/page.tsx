import { LegalDocumentView } from "@/components/legal/legal-document";
import { cookiePolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(cookiePolicy);

export default function CookiePolicyPage() {
  return <LegalDocumentView document={cookiePolicy} />;
}
