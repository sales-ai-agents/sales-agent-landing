import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { privacyPolicy } from "@marketing/legal";

export const metadata: Metadata = {
  title: privacyPolicy.metaTitle,
  description: privacyPolicy.metaDescription,
  alternates: { canonical: privacyPolicy.slug },
  openGraph: {
    title: privacyPolicy.metaTitle,
    description: privacyPolicy.metaDescription,
    type: "article",
    url: privacyPolicy.slug,
  },
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentView document={privacyPolicy} />;
}
