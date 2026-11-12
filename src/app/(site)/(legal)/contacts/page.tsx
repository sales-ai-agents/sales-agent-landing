import { LegalDocumentView } from "@/components/legal/legal-document";
import { contactsDocument } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(contactsDocument);

export default function ContactsPage() {
  return <LegalDocumentView document={contactsDocument} />;
}
