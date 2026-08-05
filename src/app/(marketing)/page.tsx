import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero-section";
import { ScenariosSection } from "@/components/marketing/scenarios-section";
import { IndustriesSection } from "@/components/marketing/industries-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { CallLogsSection } from "@/components/marketing/call-logs-section";
import { HandoffSection } from "@/components/marketing/handoff-section";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCtaSection } from "@/components/marketing/final-cta-section";
import {
  DynamicAudioDemoSection as AudioDemoSection,
  DynamicCalculatorSection as CalculatorSection,
  DynamicBuilderSection as BuilderSection,
} from "@/components/marketing/dynamic-sections";
import { buildFaqPageSchema, buildOrganizationSchema, buildHowToSchema } from "@/lib/utils";
import { FAQ_ENTRIES, ONBOARDING_STEPS } from "@/lib/marketing-data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "calls4u — ШІ-агент для автоматизації дзвінків клієнтам | Голосовий AI",
  description:
    "calls4u — голосовий ШІ-агент, який автоматизує рутинні дзвінки: підтверджує записи, нагадує про візити, уточнює замовлення, кваліфікує ліди та фіксує результат у CRM. Запуск за 1 день без програмістів.",
  openGraph: {
    title: "calls4u — ШІ-агент, який телефонує клієнтам за вас",
    description:
      "Голосовий AI-агент підтверджує записи, нагадує про візити, уточнює замовлення і фіксує результат у CRM. Економить до 70% часу менеджера. Запуск за 1 день.",
    type: "website",
    url: "https://www.calls4u.ai",
    locale: "uk_UA",
    siteName: "calls4u",
  },
  twitter: {
    card: "summary_large_image",
    title: "calls4u — Голосовий ШІ-агент для бізнесу в Україні",
    description:
      "Автоматизуйте рутинні дзвінки клієнтам: підтвердження, нагадування, замовлення. Без розробника, запуск за 1 день.",
  },
  alternates: {
    canonical: "https://www.calls4u.ai",
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "calls4u",
            url: "https://www.calls4u.ai",
            description:
              "Голосовий ШІ-агент, який автоматизує рутинні дзвінки клієнтам: підтвердження записів, нагадування, уточнення замовлень, кваліфікація лідів та інтеграція з CRM.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            inLanguage: "uk",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "UAH",
              description: "Безкоштовний тест з 50 дзвінків",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "47",
              bestRating: "5",
            },
            featureList: [
              "Підтвердження записів",
              "Нагадування про візити",
              "Уточнення замовлень",
              "Кваліфікація лідів",
              "Інтеграція з CRM",
              "Конструктор без коду",
              "Передача дзвінка менеджеру",
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildOrganizationSchema()).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildHowToSchema(ONBOARDING_STEPS)).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqPageSchema(FAQ_ENTRIES)).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
