import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { ScenariosSection } from "@/components/marketing/scenarios-section";
import { IndustriesSection } from "@/components/marketing/industries-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { CallLogsSection } from "@/components/marketing/call-logs-section";
import { HandoffSection } from "@/components/marketing/handoff-section";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection, faqs } from "@/components/marketing/faq-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import {
  DynamicAudioDemoSection as AudioDemoSection,
  DynamicCalculatorSection as CalculatorSection,
  DynamicBuilderSection as BuilderSection,
} from "@/components/marketing/dynamic-sections";
import { buildFaqPageSchema } from "@/lib/utils";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VoiceAgent — ШІ-агент для автоматизації дзвінків клієнтам",
  description:
    "Автоматизуйте підтвердження записів, нагадування, уточнення замовлень та кваліфікацію лідів за допомогою голосового ШІ-агента. Без програмістів.",
  openGraph: {
    title: "VoiceAgent — ШІ-агент, який телефонує клієнтам",
    description:
      "Підтверджує записи, нагадує про візити, уточнює замовлення і фіксує результат у CRM. Автоматично.",
    type: "website",
    url: "https://voiceagent.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceAgent — Голосовий ШІ-агент для бізнесу",
    description: "Автоматизуйте рутинні дзвінки клієнтам. Без розробника.",
  },
};

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <AudioDemoSection />
      <ScenariosSection />
      <IndustriesSection />
      <HowItWorksSection />
      <BuilderSection />
      <CallLogsSection />
      <HandoffSection />
      <IntegrationsSection />
      <CalculatorSection />
      <TrustSection />
      <FaqSection />
      <FinalCtaSection />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "VoiceAgent",
            description: "ШІ-агент, який автоматизує рутинні дзвінки клієнтам для малого бізнесу.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "UAH",
              description: "Безкоштовний тест з 50 дзвінків",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqPageSchema(faqs)),
        }}
      />
    </>
  );
}
