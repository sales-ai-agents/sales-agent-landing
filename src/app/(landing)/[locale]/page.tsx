import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogSection } from "@/components/landing/blog-section";
import { BuilderSection } from "@/components/landing/builder-section";
import { getLandingCopy } from "@/components/landing/copy";
import { DashboardSection } from "@/components/landing/dashboard-section";
import { DemoSection } from "@/components/landing/demo-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { IntegrationsSection } from "@/components/landing/integrations-section";
import { JsonLd } from "@/components/landing/json-ld";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { buildLandingMetadata } from "@/components/landing/metadata";
import { LandingMotion } from "@/components/landing/motion/landing-motion";
import { NumbersSection } from "@/components/landing/numbers-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { ScenariosSection } from "@/components/landing/scenarios-section";
import { SecuritySection } from "@/components/landing/security-section";
import { LandingShell } from "@/components/landing/shell";
import { buildLandingGraph } from "@/components/landing/structured-data";
import { VideoSection } from "@/components/landing/video-section";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-static";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildLandingMetadata(locale) : {};
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getLandingCopy(locale);

  return (
    <LandingShell animated>
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
    </LandingShell>
  );
}
