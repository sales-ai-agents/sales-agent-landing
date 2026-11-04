import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { termsOfUse } from "@marketing/legal";

export const metadata: Metadata = {
  title: termsOfUse.metaTitle,
  description: termsOfUse.metaDescription,
  alternates: { canonical: termsOfUse.slug },
  openGraph: {
    title: termsOfUse.metaTitle,
    description: termsOfUse.metaDescription,
    type: "article",
    url: termsOfUse.slug,
  },
};

export default function TermsOfUsePage() {
  return <LegalDocumentView document={termsOfUse} />;
}
