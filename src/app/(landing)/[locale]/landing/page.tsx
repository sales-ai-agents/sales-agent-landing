import { notFound } from "next/navigation";
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
import { getLandingCopy } from "@/components/landing/copy";
import { buildLandingGraph } from "@/components/landing/structured-data";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-static";

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getLandingCopy(locale);

  return (
    <>
      <LandingNav />
      <main id="top">
        <HeroSection copy={copy.hero} />
        <DemoSection copy={copy.demo} />
        <NumbersSection copy={copy.numbers} />
        <ScenariosSection copy={copy.scenarios} />
        <BuilderSection copy={copy.builder} />
        <DashboardSection copy={copy.dashboard} />
        <IntegrationsSection copy={copy.integrations} />
        <VideoSection copy={copy.video} />
        <PricingSection copy={copy.pricing} />
        <SecuritySection copy={copy.security} />
        <BlogSection locale={locale} copy={copy.blogTeaser} cardCopy={copy.client.blog} />
        <FaqSection copy={copy.faq} />
        <FinalCtaSection copy={copy.finalCta} />
      </main>
      <LandingFooter locale={locale} />
      <LandingMotion />
      <JsonLd data={buildLandingGraph(locale)} />
    </>
  );
}
