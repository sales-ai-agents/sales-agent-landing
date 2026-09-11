import { Check } from "lucide-react";

import { Button } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import { getPlanFeatures } from "@dashboard/billing";
import type { BillingPlan } from "@dashboard/types";

interface PlanCardProps {
  plan: BillingPlan;
  isCurrent: boolean;
  cycle?: "month" | "year";
  onSelect: () => void;
}

export const PlanCard = ({ plan, isCurrent, cycle = "month", onSelect }: PlanCardProps) => {
  const features = getPlanFeatures(plan);
  const isPro = plan.key === "pro";
  const isAnnual = cycle === "year" && !!plan.year;

  const displayPriceUsd = isAnnual ? plan.year!.price_usd : plan.price_usd;
  const displayPriceUah = isAnnual ? plan.year!.price_uah : plan.price_uah;

  return (
    <div
      className={cn(
        "border-border relative flex flex-col rounded-2xl border p-6",
        isCurrent ? "shadow-primary/30 bg-transparent shadow-sm" : "bg-background"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold tracking-wide uppercase">{plan.title}</h3>
        {isCurrent && (
          <span className="bg-primary rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
            Поточний
          </span>
        )}
        {isAnnual && plan.year && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
            {plan.year.months_free > 0
              ? `-${plan.year.months_free} міс`
              : plan.year.saving_usd > 0
                ? `-${plan.year.saving_usd}$`
                : "Річний"}
          </span>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold">${displayPriceUsd}</span>
          <span className="text-muted-foreground text-lg">{isAnnual ? " / рік" : " / місяць"}</span>
        </div>
        {cycle === "year" && !plan.year && (
          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
            Річний період недоступний для цього тарифу (оплата помісячно)
          </p>
        )}
        {isAnnual && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            ${(displayPriceUsd / 12).toFixed(1)} / міс
            {plan.year!.saving_usd > 0 ? ` · економія $${plan.year!.saving_usd}` : ""}
          </p>
        )}
        {displayPriceUah != null && (
          <p className="text-muted-foreground mt-1 text-xs">
            ≈ {formatNumber(displayPriceUah)} грн
            {plan.usd_rate ? ` (${plan.usd_rate.toFixed(2)} ₴/$)` : ""}
          </p>
        )}
      </div>

      <ul className="mt-5 flex-1 space-y-1.5 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {isCurrent ? (
          <Button
            size="lg"
            variant="ghost"
            className="pointer-events-none w-full rounded-full"
            onClick={onSelect}
          >
            <Check className="h-3.5 w-3.5 text-green-600" />
            Поточний тариф
          </Button>
        ) : isPro ? (
          <Button size="lg" className="w-full rounded-full" onClick={onSelect}>
            Перейти на PRO
          </Button>
        ) : (
          <Button size="lg" variant="outline" className="w-full rounded-full" onClick={onSelect}>
            Обрати
          </Button>
        )}
      </div>
    </div>
  );
};
