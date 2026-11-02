import { JsonLd } from "@/components/marketing/json-ld";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { DemoSection } from "@/components/landing/demo-section";
import { NumbersSection } from "@/components/landing/numbers-section";
import { ScenariosSection } from "@/components/landing/scenarios-section";
import { BuilderSection } from "@/components/landing/builder-section";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { VideoSection } from "@/components/landing/video-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SecuritySection } from "@/components/landing/security-section";
import { BlogSection } from "@/components/landing/blog-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingMotion } from "@/components/landing/motion/landing-motion";
import { FAQ_ITEMS, PRICING_PLANS } from "@/components/landing/content";

export const dynamic = "force-static";

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Calls4U",
  url: "https://www.calls4u.ai/landing",
  description:
    "Голосовий ШІ-агент, який автоматизує рутинні дзвінки клієнтам: підтвердження записів, нагадування, уточнення замовлень, кваліфікація лідів та інтеграція з CRM.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: ["uk"],
  offers: PRICING_PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: plan.price.replace("$", ""),
    priceCurrency: "USD",
  })),
} as const;

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
} as const;

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main id="top">
        <HeroSection />
        <DemoSection />
        <NumbersSection />
        <ScenariosSection />
        <BuilderSection />
        <DashboardSection />
        <IntegrationsSection />
        <VideoSection />
        <PricingSection />
        <SecuritySection />
        <BlogSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
      <LandingMotion />
      <JsonLd data={SOFTWARE_SCHEMA} />
      <JsonLd data={FAQ_SCHEMA} />
    </>
  );
}
