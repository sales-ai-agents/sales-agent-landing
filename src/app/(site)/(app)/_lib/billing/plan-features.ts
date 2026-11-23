import { formatNumber } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

import { formatPlanNumbers } from "./plan-numbers";

type Feature = string | null;

const formatMinutesFeature = (plan: BillingPlan): string =>
  `${formatNumber(plan.minutes)} хвилин AI-агента`;

const formatAgentsFeature = (plan: BillingPlan, singular: string): string =>
  plan.agents === 0 ? "Необмежено ШІ-агентів" : singular;

const formatPlanBalance = ({ balance_usd }: BillingPlan): Feature =>
  balance_usd ? `Рахунок поповнюється до $${balance_usd} при кожній оплаті` : null;

const buildFeatures = (plan: BillingPlan): Feature[] => {
  const numbers = formatPlanNumbers(plan);
  const balance = formatPlanBalance(plan);

  switch (plan.key) {
    case "start":
      return [
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `${plan.agents} ШІ-агент`),
        numbers,
        balance,
        "Журнал дзвінків",
        "Перегляд результатів розмов",
        "Базове налаштування сценарію",
      ];
    case "pro":
      return [
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        numbers,
        balance,
        "Усі доступні інтеграції",
        "Пріоритетна підтримка",
      ];
    default:
      return [
        `${formatNumber(plan.minutes)} хв розмов`,
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        numbers,
      ];
  }
};

export const getPlanFeatures = (plan: BillingPlan): string[] =>
  buildFeatures(plan).filter((feature): feature is string => feature !== null);
