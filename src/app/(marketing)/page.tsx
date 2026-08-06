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
import { FAQ_ENTRIES, FAQ_ENTRIES_RU, ONBOARDING_STEPS } from "@/lib/marketing-data";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Calls4U | ШІ-агент для бізнесу — автоматизація дзвінків клієнтам",
  description:
    "Calls4U — голосовий ШІ-агент, який автоматизує рутинні дзвінки: підтверджує записи, нагадує про візити, уточнює замовлення, кваліфікує ліди та фіксує результат у CRM. Економить до 70% часу менеджера. Запуск за 1 день без програмістів.",
  openGraph: {
    title: "Calls4U | ШІ-агент для бізнесу — телефонує клієнтам за вас",
    description:
      "Голосовий AI-агент підтверджує записи, нагадує про візити, уточнює замовлення і передає результат у CRM. Економить до 70% часу. Запуск за 1 день.",
    type: "website",
    url: "https://www.calls4u.ai",
    locale: "uk_UA",
    siteName: "Calls4U",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calls4U | ШІ-агент для бізнесу",
    description:
      "Автоматизуйте рутинні дзвінки клієнтам: підтвердження записів, нагадування, замовлення. Без розробника, запуск за 1 день.",
  },
  alternates: {
    canonical: "https://www.calls4u.ai",
  },
  other: {
    "description:ru":
      "Calls4U — голосовой ИИ-агент для автоматизации звонков клиентам. Подтверждает записи, напоминает о визитах, уточняет заказы и передаёт результат в CRM. Запуск за 1 день.",
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
            name: "Calls4U",
            url: "https://www.calls4u.ai",
            description:
              "Голосовий ШІ-агент, який автоматизує рутинні дзвінки клієнтам: підтвердження записів, нагадування, уточнення замовлень, кваліфікація лідів та інтеграція з CRM.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            inLanguage: ["uk", "ru"],
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
          __html: JSON.stringify(buildFaqPageSchema([...FAQ_ENTRIES, ...FAQ_ENTRIES_RU])).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
    </>
  );
}
