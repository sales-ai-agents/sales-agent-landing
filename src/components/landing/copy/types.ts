import type { StrokeIconName } from "@/components/landing/icons";
import type { ClientCopy } from "@/components/landing/copy/client-types";

export type HeadingPart = string | { readonly em: string };

export type HeadingLine = readonly HeadingPart[];

export type Heading = readonly HeadingLine[];

export interface SectionIntro {
  readonly meta: string;
  readonly metaRight?: string;
  readonly heading: Heading;
  readonly lead: string;
}

export interface SeoCopy {
  readonly title: string;
  readonly description: string;
  readonly socialDescription: string;
  readonly ogImageAlt: string;
  readonly organizationDescription: string;
  readonly pageDescription: string;
  readonly features: readonly string[];
  readonly howToName: string;
  readonly breadcrumbHome: string;
}

export interface HeroCopy {
  readonly srTitle: string;
  readonly titleLines: readonly [string, string, string];
  readonly metaLeft: string;
  readonly metaCenter: string;
  readonly metaLive: string;
  readonly leadStrong: string;
  readonly leadRest: string;
  readonly signUp: string;
  readonly listenDemo: string;
  readonly chips: readonly { readonly icon: StrokeIconName; readonly label: string }[];
}

export interface DemoSectionCopy extends SectionIntro {
  readonly metaRight: string;
}

export interface StatCardCopy {
  readonly value: string;
  readonly count?: number;
  readonly unit?: string;
  readonly description: string;
}

export interface NumbersCopy {
  readonly meta: string;
  readonly metaRight: string;
  readonly stats: readonly StatCardCopy[];
}

export type ScenarioTone = "white" | "blue" | "ink" | "soft";

export interface ScenarioCardCopy {
  readonly number: string;
  readonly audience: string;
  readonly title: string;
  readonly askLabel: string;
  readonly ask: string;
  readonly bubble: string;
  readonly result: string;
  readonly tone: ScenarioTone;
}

export interface ScenariosCopy extends SectionIntro {
  readonly ctaText: string;
  readonly ctaButton: string;
  readonly cards: readonly ScenarioCardCopy[];
}

export interface OnboardingStepCopy {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface BuilderSectionCopy extends SectionIntro {
  readonly metaRight: string;
  readonly steps: readonly OnboardingStepCopy[];
  readonly builderTitle: string;
  readonly builderAccent: string;
  readonly checklist: readonly string[];
  readonly signUp: string;
}

export interface DashboardRow {
  readonly initial: string;
  readonly name: string;
  readonly task: string;
  readonly rate: number;
}

export type CallTone = "g" | "y" | "r" | "b";

export interface DashboardCall {
  readonly client: string;
  readonly agent: string;
  readonly duration: string;
  readonly tone: CallTone;
  readonly status: string;
  readonly time: string;
}

export interface DashboardStatCopy {
  readonly label: string;
  readonly note: string;
  readonly trend: string;
  readonly unit?: string;
}

export interface DashboardCopy extends SectionIntro {
  readonly metaRight: string;
  readonly menuLabel: string;
  readonly sidebar: readonly { readonly icon: StrokeIconName; readonly label: string }[];
  readonly planLabel: string;
  readonly planName: string;
  readonly planLink: string;
  readonly headTitle: string;
  readonly headSubtitle: string;
  readonly demoChip: string;
  readonly range: string;
  readonly newAgent: string;
  readonly usage: { readonly label: string; readonly total: string; readonly note: string };
  readonly totalCalls: DashboardStatCopy;
  readonly savedTime: DashboardStatCopy;
  readonly goals: DashboardStatCopy;
  readonly chart: {
    readonly title: string;
    readonly legend: readonly [string, string, string];
    readonly ariaLabel: string;
    readonly days: readonly string[];
  };
  readonly agentsPanel: {
    readonly title: string;
    readonly all: string;
    readonly button: string;
    readonly rows: readonly DashboardRow[];
  };
  readonly callsTable: {
    readonly title: string;
    readonly all: string;
    readonly headers: readonly string[];
    readonly rows: readonly DashboardCall[];
  };
}

export interface IntegrationCopy {
  readonly title: string;
  readonly description: string;
}

export interface IntegrationsCopy extends SectionIntro {
  readonly metaRight: string;
  readonly items: readonly IntegrationCopy[];
}

export interface VideoSectionCopy extends SectionIntro {
  readonly metaRight: string;
}

export type PlanCtaTone = "ghost" | "white" | "blue";

export type PlanVariant = "trial" | "featured";

export interface PricingPlanCopy {
  readonly id: string;
  readonly tagline: string;
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly subtitle: string;
  readonly features: readonly string[];
  readonly highlightedFeatures?: readonly number[];
  readonly ctaLabel: string;
  readonly ctaTone: PlanCtaTone;
  readonly variant?: PlanVariant;
  readonly badge?: string;
}

export interface PricingCopy extends SectionIntro {
  readonly metaRight: string;
  readonly plans: readonly PricingPlanCopy[];
  readonly note: string;
}

export type SecurityIcon = "lock" | "pause" | "users" | "shieldCheck";

export type TrustIcon = "shield" | "lock" | "globe";

export interface SecurityCardCopy {
  readonly icon: SecurityIcon;
  readonly title: string;
  readonly description: string;
}

export interface TrustBadgeCopy {
  readonly icon: TrustIcon;
  readonly label: string;
}

export interface SecurityCopy extends SectionIntro {
  readonly metaRight: string;
  readonly cards: readonly SecurityCardCopy[];
  readonly badges: readonly TrustBadgeCopy[];
}

export interface BlogTeaserCopy extends SectionIntro {
  readonly metaRight: string;
  readonly allPosts: string;
}

export interface FaqItemCopy {
  readonly question: string;
  readonly answer: string;
}

export interface FaqCardCopy {
  readonly kicker: string;
  readonly title: string;
  readonly action: string;
}

export interface FaqCopy extends SectionIntro {
  readonly card: FaqCardCopy;
  readonly items: readonly FaqItemCopy[];
}

export interface FinalCtaCopy extends SectionIntro {
  readonly demoWithManager: string;
}

export type FooterDocumentId =
  "offer" | "serviceTerms" | "refundPolicy" | "privacyPolicy" | "cookiePolicy" | "termsOfUse";

export interface FooterCopy {
  readonly about: string;
  readonly navTitle: string;
  readonly documentsTitle: string;
  readonly documentsNote: string;
  readonly contactsTitle: string;
  readonly leaveRequest: string;
  readonly rights: string;
  readonly tagline: string;
  readonly documents: Readonly<Record<FooterDocumentId, string>>;
}

export interface BlogIndexCopy {
  readonly title: string;
  readonly description: string;
  readonly schemaDescription: string;
  readonly metaLeft: string;
  readonly metaRight: string;
  readonly heading: string;
  readonly introTitle: string;
  readonly introAccent: string;
  readonly introTail: string;
  readonly introLead: string;
  readonly ctaKicker: string;
  readonly ctaTitle: string;
  readonly ctaAccent: string;
  readonly ctaText: string;
  readonly ctaButton: string;
}

export interface BlogArticleCopy {
  readonly crumbsLabel: string;
  readonly team: string;
  readonly bottomCtaKicker: string;
  readonly bottomCtaTitle: string;
  readonly bottomCtaText: string;
  readonly sideCtaKicker: string;
  readonly sideCtaTitle: string;
  readonly sideCtaText: string;
  readonly ctaButton: string;
  readonly sideCtaButton: string;
  readonly related: string;
  readonly allArticles: string;
}

export interface BlogPagesCopy {
  readonly name: string;
  readonly titleTemplate: string;
  readonly rssDescription: string;
  readonly index: BlogIndexCopy;
  readonly article: BlogArticleCopy;
}

export interface LlmsCopy {
  readonly languageName: string;
  readonly summary: string;
  readonly fullTitle: string;
  readonly pricing: string;
  readonly faq: string;
  readonly blog: string;
  readonly category: string;
  readonly published: string;
  readonly updated: string;
}

export interface LandingCopy {
  readonly seo: SeoCopy;
  readonly client: ClientCopy;
  readonly footer: FooterCopy;
  readonly hero: HeroCopy;
  readonly demo: DemoSectionCopy;
  readonly numbers: NumbersCopy;
  readonly scenarios: ScenariosCopy;
  readonly builder: BuilderSectionCopy;
  readonly dashboard: DashboardCopy;
  readonly integrations: IntegrationsCopy;
  readonly video: VideoSectionCopy;
  readonly pricing: PricingCopy;
  readonly security: SecurityCopy;
  readonly blogTeaser: BlogTeaserCopy;
  readonly faq: FaqCopy;
  readonly finalCta: FinalCtaCopy;
  readonly blog: BlogPagesCopy;
  readonly llms: LlmsCopy;
}
