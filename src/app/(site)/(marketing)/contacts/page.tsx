import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { contactsDocument } from "@marketing/legal";

export const metadata: Metadata = {
  title: contactsDocument.metaTitle,
  description: contactsDocument.metaDescription,
  alternates: { canonical: contactsDocument.slug },
  openGraph: {
    title: contactsDocument.metaTitle,
    description: contactsDocument.metaDescription,
    type: "article",
    url: contactsDocument.slug,
  },
};

export default function ContactsPage() {
  return <LegalDocumentView document={contactsDocument} />;
}
