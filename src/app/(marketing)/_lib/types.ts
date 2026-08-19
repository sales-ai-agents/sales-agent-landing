import type React from "react";
import type { LucideIcon } from "lucide-react";

export interface LeadFormParams {
  name: string;
  phone: string;
  niche?: string;
  contact?: string;
  email?: string;
  telegram?: string;
  company?: string;
  message?: string;
  source_page?: string;
}

export interface LeadFormResult {
  id: number;
}

export type RoomStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

export interface WebAgentSession {
  room: string;
  token: string;
  url: string;
  identity: string;
}

export interface StartWebAgentParams {
  instruction: string;
  voice: string;
  agent_name: string;
  preset?: string;
}

export interface UseLiveKitRoomOptions {
  wsUrl: string | null;
  token: string | null;
}

export interface UseLiveKitRoomResult {
  status: RoomStatus;
  errorMessage: string | null;
  disconnect: () => void;
}

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
