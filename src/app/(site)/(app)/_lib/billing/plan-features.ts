import { formatNumber } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

import { formatPlanNumbers } from "./plan-numbers";

type Feature = string | null;

const formatMinutesFeature = (plan: BillingPlan): string =>
  `${formatNumber(plan.minutes)} хвилин AI-агента`;

const formatAgentsFeature = (plan: BillingPlan, singular: string): string =>
  plan.agents === 0 ? "Необмежено ШІ-агентів" : singular;

const buildFeatures = (plan: BillingPlan): Feature[] => {
  const numbers = formatPlanNumbers(plan);

  switch (plan.key) {
    case "start":
      return [
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `${plan.agents} ШІ-агент`),
        numbers,
        "Журнал дзвінків",
        "Перегляд результатів розмов",
        "Базове налаштування сценарію",
      ];
    case "business":
      return [
        "Все з тарифу Start",
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        numbers,
        "CSV-кампанії",
        "Webhooks",
        "Кілька сценаріїв дзвінків",
      ];
    case "pro":
      return [
        "Все з тарифу Business",
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        numbers,
        "Усі доступні інтеграції",
        "Пріоритетна підтримка",
        "Підключення до бізнес-процесів",
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
