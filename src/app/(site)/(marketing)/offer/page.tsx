import type { Metadata } from "next";

import { LegalDocumentView } from "@/components/marketing/legal-document";
import { offer } from "@marketing/legal";

export const metadata: Metadata = {
  title: offer.metaTitle,
  description: offer.metaDescription,
  alternates: { canonical: offer.slug },
  openGraph: {
    title: offer.metaTitle,
    description: offer.metaDescription,
    type: "article",
    url: offer.slug,
  },
};

export default function OfferPage() {
  return <LegalDocumentView document={offer} />;
}
