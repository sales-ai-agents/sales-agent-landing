import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { cookiePolicy } from "@marketing/legal";

export const metadata: Metadata = {
  title: cookiePolicy.metaTitle,
  description: cookiePolicy.metaDescription,
  alternates: { canonical: cookiePolicy.slug },
  openGraph: {
    title: cookiePolicy.metaTitle,
    description: cookiePolicy.metaDescription,
    type: "article",
    url: cookiePolicy.slug,
  },
};

export default function CookiePolicyPage() {
  return <LegalDocumentView document={cookiePolicy} />;
}
