import { Check } from "lucide-react";

import { Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

interface PlanCardProps {
  plan: BillingPlan;
  isCurrent: boolean;
  onSelect: () => void;
}

const getPlanFeatures = (plan: BillingPlan): string[] => {
  if (plan.minutes >= 3000) {
    return [
      `${formatNumber(plan.minutes)} хв розмов`,
      "Усі доступні інтеграції",
      "Усе з тарифу Business",
      "Пріоритетна підтримка",
      "Підключення до бізнес-процесів",
    ];
  }
  if (plan.minutes >= 1000) {
    return [
      `${formatNumber(plan.minutes)} хв розмов`,
      `До ${plan.agents} ШІ-агентів`,
      "Усе з тарифу Start",
      "CSV-кампанії",
      "Webhooks",
      "Кілька сценаріїв дзвінків",
    ];
  }
  return [
    `${plan.minutes} хв розмов`,
    `${plan.agents} ШІ-агент`,
    "Журнал дзвінків",
    "Перегляд результатів розмов",
    "Базове налаштування сценарію",
  ];
};

export const PlanCard = ({ plan, isCurrent, onSelect }: PlanCardProps) => {
  const features = getPlanFeatures(plan);
  const isPro = plan.minutes >= 3000;

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        isCurrent ? "border-primary" : "border-border"
      }`}
    >
      <h3 className="text-xl font-bold uppercase">{plan.title}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">${Math.round(plan.price_uah / 45)}</span>
        <span className="text-muted-foreground text-sm"> / місяць</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="text-primary h-4 w-4 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {isCurrent ? (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            Поточний тариф
          </div>
        ) : isPro ? (
          <Button className="w-full" onClick={onSelect}>
            Перейти на PRO
          </Button>
        ) : (
          <Button variant="outline" className="w-full" onClick={onSelect}>
            Обрати
          </Button>
        )}
      </div>
    </div>
  );
};
