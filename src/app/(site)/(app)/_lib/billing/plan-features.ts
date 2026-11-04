import { formatNumber } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

import { getPlanCapabilities } from "./plan-capabilities";
import type { PlanCapabilities } from "./plan-capabilities";

const formatMinutesFeature = (plan: BillingPlan): string =>
  `${formatNumber(plan.minutes)} хвилин AI-агента`;

const formatAgentsFeature = (plan: BillingPlan, singular: string): string =>
  plan.agents === 0 ? "Необмежено ШІ-агентів" : singular;

const formatPhoneFeature = ({ phoneNumbers }: PlanCapabilities): string =>
  phoneNumbers === 1 ? "1 телефонний номер" : `До ${phoneNumbers} телефонних номерів`;

const formatBalanceFeature = ({ startingBalanceUsd }: PlanCapabilities): string =>
  `$${startingBalanceUsd} стартового балансу на дзвінки`;

const buildFeatures = (plan: BillingPlan): string[] => {
  const capabilities = getPlanCapabilities(plan);

  switch (plan.key) {
    case "start":
      return [
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `${plan.agents} ШІ-агент`),
        formatPhoneFeature(capabilities),
        formatBalanceFeature(capabilities),
        "Журнал дзвінків",
        "Перегляд результатів розмов",
        "Базове налаштування сценарію",
      ];
    case "business":
      return [
        "Все з тарифу Start",
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        formatPhoneFeature(capabilities),
        formatBalanceFeature(capabilities),
        "CSV-кампанії",
        "Webhooks",
        "Кілька сценаріїв дзвінків",
      ];
    case "pro":
      return [
        "Все з тарифу Business",
        formatMinutesFeature(plan),
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
        formatPhoneFeature(capabilities),
        formatBalanceFeature(capabilities),
        "Усі доступні інтеграції",
        "Пріоритетна підтримка",
        "Підключення до бізнес-процесів",
      ];
    default:
      return [
        `${formatNumber(plan.minutes)} хв розмов`,
        formatAgentsFeature(plan, `До ${plan.agents} ШІ-агентів`),
      ];
  }
};

export const getPlanFeatures = (plan: BillingPlan): string[] => buildFeatures(plan);
