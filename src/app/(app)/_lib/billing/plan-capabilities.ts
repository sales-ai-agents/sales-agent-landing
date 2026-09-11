import type { BillingPlan } from "@dashboard/types";

const PLAN_TIERS = ["trial", "start", "business", "pro"] as const;

type PlanTier = (typeof PLAN_TIERS)[number];

type IntegrationsLevel = "limited" | "all";
type SupportLevel = "basic" | "priority";

export interface PlanCapabilities {
  phoneNumbers: number;
  startingBalanceUsd: number | null;
  callLog: boolean;
  csvCampaigns: boolean;
  webhooks: boolean;
  integrations: IntegrationsLevel;
  support: SupportLevel;
  businessProcess: boolean;
}

const PLAN_CAPABILITIES: Record<PlanTier, PlanCapabilities> = {
  trial: {
    phoneNumbers: 1,
    startingBalanceUsd: null,
    callLog: true,
    csvCampaigns: false,
    webhooks: false,
    integrations: "limited",
    support: "basic",
    businessProcess: false,
  },
  start: {
    phoneNumbers: 1,
    startingBalanceUsd: 5,
    callLog: true,
    csvCampaigns: false,
    webhooks: false,
    integrations: "limited",
    support: "basic",
    businessProcess: false,
  },
  business: {
    phoneNumbers: 1,
    startingBalanceUsd: 10,
    callLog: true,
    csvCampaigns: true,
    webhooks: true,
    integrations: "limited",
    support: "basic",
    businessProcess: false,
  },
  pro: {
    phoneNumbers: 3,
    startingBalanceUsd: 20,
    callLog: true,
    csvCampaigns: true,
    webhooks: true,
    integrations: "all",
    support: "priority",
    businessProcess: true,
  },
};

const INTEGRATIONS_LABELS: Record<IntegrationsLevel, string> = {
  limited: "Обмежені",
  all: "Усі доступні",
};

const SUPPORT_LABELS: Record<SupportLevel, string> = {
  basic: "Базова",
  priority: "Пріоритетна",
};

const resolvePlanTier = (plan: BillingPlan | undefined): PlanTier => {
  const tier = plan?.key as PlanTier | undefined;

  return tier && PLAN_TIERS.includes(tier) ? tier : "trial";
};

export const getPlanCapabilities = (plan: BillingPlan | undefined): PlanCapabilities =>
  PLAN_CAPABILITIES[resolvePlanTier(plan)];

export const formatIntegrations = (level: IntegrationsLevel): string => INTEGRATIONS_LABELS[level];

export const formatSupport = (level: SupportLevel): string => SUPPORT_LABELS[level];
