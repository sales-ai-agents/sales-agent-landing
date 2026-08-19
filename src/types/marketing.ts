import type React from "react";
import type { LucideIcon } from "lucide-react";

export interface DemoCard {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly scenario: string;
  readonly result: string;
  readonly resultBold: string;
  readonly src: string;
}

export interface ScenarioDetail {
  readonly label: string;
  readonly value: string;
}

export interface Scenario {
  readonly title: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly details: readonly [ScenarioDetail, ScenarioDetail, ScenarioDetail];
}

export interface IndustryCard {
  readonly title: string;
  readonly task: string;
  readonly agentDoes: string;
  readonly status: string;
  readonly imageSrc: string;
}

export interface OnboardingStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface Integration {
  readonly title: string;
  readonly description: React.ReactNode;
}

export interface TrustItem {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface FaqEntry {
  readonly question: string;
  readonly answer: string | React.ReactNode;
  readonly textAnswer?: string;
}

export interface FooterLink {
  readonly href: string;
  readonly label: string;
}

export type BadgeVariant = "success" | "secondary" | "warning";

export interface MockCallLogRow {
  readonly id: string;
  readonly customer: string;
  readonly time: string;
  readonly status: string;
  readonly statusVariant: BadgeVariant;
  readonly summary: string;
  readonly duration: string;
  readonly crm: string;
}

export interface CalculatorInputs {
  readonly callsPerDay: number;
  readonly avgDuration: number;
  readonly hourlyRate: number;
}

export interface IconBadge {
  readonly icon: LucideIcon;
  readonly label: string;
}

export interface NavLink {
  readonly href: string;
  readonly label: string;
}
