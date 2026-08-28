import { Check } from "lucide-react";

import { Button } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
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
  const priceUsd = Math.round(plan.price_uah / 44);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        isCurrent ? "bg-primary/5 border-primary/30" : "border-border bg-background"
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold tracking-wide uppercase">{plan.title}</h3>
        {isCurrent && (
          <span className="bg-primary rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
            Поточний
          </span>
        )}
      </div>

      <div className="mt-3">
        <span className="text-[35px] leading-none font-bold">${priceUsd}</span>
        <span className="text-muted-foreground text-lg"> / місяць</span>
      </div>

      <ul className="mt-5 flex-1 space-y-1.5 text-sm">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent ? (
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="h-4 w-4" />
            Поточний тариф
          </div>
        ) : isPro ? (
          <Button className="w-full rounded-full" onClick={onSelect}>
            Перейти на PRO
          </Button>
        ) : (
          <Button variant="outline" className="w-full rounded-full" onClick={onSelect}>
            Обрати
          </Button>
        )}
      </div>
    </div>
  );
};
