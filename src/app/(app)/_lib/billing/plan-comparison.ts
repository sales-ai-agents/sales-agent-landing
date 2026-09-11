import { formatNumber } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

import { formatIntegrations, formatSupport, getPlanCapabilities } from "./plan-capabilities";
import type { PlanCapabilities } from "./plan-capabilities";

export type PlanComparisonIcon =
  | "minutes"
  | "agents"
  | "phoneNumbers"
  | "startingBalance"
  | "callLog"
  | "csvCampaigns"
  | "webhooks"
  | "integrations"
  | "support"
  | "businessProcess";

export interface PlanComparisonValue {
  text?: string;
  included?: boolean;
}

export interface PlanComparisonRow {
  key: string;
  icon: PlanComparisonIcon;
  label: string;
  current: PlanComparisonValue;
  next: PlanComparisonValue;
  diff?: string;
}

const formatMinutes = (minutes: number): string => `${formatNumber(minutes)} хв`;

const formatAgents = (agents: number): string => (agents === 0 ? "Необмежено" : `До ${agents}`);

const formatPhoneNumbers = (count: number): string =>
  `${count} ${count === 1 ? "номер" : "номери"}`;

const formatBalance = (balanceUsd: number | null): string =>
  balanceUsd === null ? "—" : `$${balanceUsd}`;

interface ComparisonContext {
  hasCurrent: boolean;
  current: PlanCapabilities;
  next: PlanCapabilities;
}

type CapabilityText = (capabilities: PlanCapabilities) => string;
type CapabilityFlag = (capabilities: PlanCapabilities) => boolean;

const textRow = (
  context: ComparisonContext,
  icon: PlanComparisonIcon,
  label: string,
  select: CapabilityText
): PlanComparisonRow => ({
  key: icon,
  icon,
  label,
  current: { text: context.hasCurrent ? select(context.current) : undefined },
  next: { text: select(context.next) },
});

const flagRow = (
  context: ComparisonContext,
  icon: PlanComparisonIcon,
  label: string,
  select: CapabilityFlag
): PlanComparisonRow => ({
  key: icon,
  icon,
  label,
  current: { included: context.hasCurrent ? select(context.current) : undefined },
  next: { included: select(context.next) },
});

export const getPlanComparisonRows = (
  currentPlan: BillingPlan | undefined,
  nextPlan: BillingPlan
): PlanComparisonRow[] => {
  const context: ComparisonContext = {
    hasCurrent: !!currentPlan,
    current: getPlanCapabilities(currentPlan),
    next: getPlanCapabilities(nextPlan),
  };
  const minutesDiff = currentPlan ? nextPlan.minutes - currentPlan.minutes : 0;

  return [
    {
      key: "minutes",
      icon: "minutes",
      label: "Хвилин розмов",
      current: { text: currentPlan && formatMinutes(currentPlan.minutes) },
      next: { text: formatMinutes(nextPlan.minutes) },
      diff: minutesDiff > 0 ? `+${formatMinutes(minutesDiff)}` : undefined,
    },
    {
      key: "agents",
      icon: "agents",
      label: "ШІ-агенти",
      current: { text: currentPlan && formatAgents(currentPlan.agents) },
      next: { text: formatAgents(nextPlan.agents) },
    },
    textRow(context, "phoneNumbers", "Телефонні номери", (c) => formatPhoneNumbers(c.phoneNumbers)),
    textRow(context, "startingBalance", "Стартовий баланс на дзвінки", (c) =>
      formatBalance(c.startingBalanceUsd)
    ),
    flagRow(context, "callLog", "Журнал дзвінків", (c) => c.callLog),
    flagRow(context, "csvCampaigns", "CSV-кампанії", (c) => c.csvCampaigns),
    flagRow(context, "webhooks", "Webhooks", (c) => c.webhooks),
    textRow(context, "integrations", "Інтеграції", (c) => formatIntegrations(c.integrations)),
    textRow(context, "support", "Пріоритетна підтримка", (c) => formatSupport(c.support)),
    flagRow(context, "businessProcess", "Підключення до бізнес-процесів", (c) => c.businessProcess),
  ];
};
