import { LegalDocumentView } from "@/components/legal/legal-document";
import { privacyPolicy } from "@/content/legal";
import { buildLegalMetadata } from "@/content/legal/metadata";

export const metadata = buildLegalMetadata(privacyPolicy);

interface Props {
  searchParams: Promise<{ lang?: string }>;
}

export default async function PrivacyPolicyPage({ searchParams }: Props) {
  const { lang } = await searchParams;
  return <LegalDocumentView document={privacyPolicy} locale={lang} />;
}
