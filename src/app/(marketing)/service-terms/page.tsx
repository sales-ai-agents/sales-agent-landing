import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { serviceTerms } from "@marketing/legal";

export const metadata: Metadata = {
  title: serviceTerms.metaTitle,
  description: serviceTerms.metaDescription,
  alternates: { canonical: serviceTerms.slug },
  openGraph: {
    title: serviceTerms.metaTitle,
    description: serviceTerms.metaDescription,
    type: "article",
    url: serviceTerms.slug,
  },
};

export default function ServiceTermsPage() {
  return <LegalDocumentView document={serviceTerms} />;
}
