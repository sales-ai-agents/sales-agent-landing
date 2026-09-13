import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { refundPolicy } from "@marketing/legal";

export const metadata: Metadata = {
  title: refundPolicy.metaTitle,
  description: refundPolicy.metaDescription,
  alternates: { canonical: refundPolicy.slug },
  openGraph: {
    title: refundPolicy.metaTitle,
    description: refundPolicy.metaDescription,
    type: "article",
    url: refundPolicy.slug,
  },
};

export default function RefundPolicyPage() {
  return <LegalDocumentView document={refundPolicy} />;
}
