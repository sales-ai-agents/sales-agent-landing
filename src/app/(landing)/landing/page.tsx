import { JsonLd } from "@/components/landing/json-ld";
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
import { LANDING_GRAPH } from "@/components/landing/structured-data";

export const dynamic = "force-static";

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
      <JsonLd data={LANDING_GRAPH} />
    </>
  );
}
