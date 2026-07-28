import type React from "react";

// --- Agent ---
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  voice: string;
  instructions: string;
  totalCalls: number;
  successRate: number;
  lastActive: string;
  createdAt: string;
}

export type AgentStatus = "active" | "paused";

// --- Contact ---
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateAdded: string;
}

// --- Call Log ---
export interface CallLog {
  id: string;
  customerName: string;
  phone: string;
  status: CallStatus;
  summary: string;
  duration: string;
  date: string;
  time: string;
  agentName: string;
  crmSynced: boolean;
}

export type CallStatus = "completed" | "missed" | "transferred" | "failed";

// --- Marketing Content Types ---

// Audio Demo
export interface DemoCard {
  readonly id: string;
  readonly category: string;
  readonly description: string;
  readonly scenario: string;
  readonly result: string;
  readonly resultBold: string;
  readonly src: string;
}

// Scenarios
export interface ScenarioDetail {
  readonly label: string;
  readonly value: string;
}

export interface Scenario {
  readonly title: string;
  readonly icon?: React.ComponentType<{ className?: string }>;
  readonly details: readonly [ScenarioDetail, ScenarioDetail, ScenarioDetail];
}

// Industries
export interface IndustryCard {
  readonly title: string;
  readonly task: string;
  readonly agentDoes: string;
  readonly status: string;
  readonly imageSrc: string;
}

// How It Works
export interface OnboardingStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

// Integrations
export interface Integration {
  readonly title: string;
  readonly description: React.ReactNode;
}

// Trust
export interface TrustItem {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

// FAQ
export interface FaqEntry {
  readonly question: string;
  readonly answer: string | React.ReactNode;
}

// Footer
export interface FooterLink {
  readonly href: string;
  readonly label: string;
}

export type FooterColumns = Record<string, readonly FooterLink[]>;

// Call Logs (landing preview)
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

// ROI Calculator
export interface CalculatorInputs {
  readonly callsPerDay: number;
  readonly avgDuration: number;
  readonly hourlyRate: number;
}