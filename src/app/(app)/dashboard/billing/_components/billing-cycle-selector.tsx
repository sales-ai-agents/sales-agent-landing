import type { ReactNode } from "react";

import { cn, formatNumber } from "@/lib/utils";
import type { BillingPeriod, BillingPlan } from "@dashboard/types";

interface BillingCycleSelectorProps {
  cycle: BillingPeriod;
  currentPlan?: BillingPlan;
  isTrial: boolean;
  onChange: (cycle: BillingPeriod) => void;
}

export const BillingCycleSelector = ({
  cycle,
  currentPlan,
  isTrial,
  onChange,
}: BillingCycleSelectorProps) => {
  const annualPlan = currentPlan?.year;

  return (
    <section className="border-border bg-background rounded-2xl border p-6">
      <h2 className="text-muted-foreground text-sm font-medium">Оплата тарифу</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          aria-pressed={cycle === "month"}
          onClick={() => onChange("month")}
          className={cn(
            "cursor-pointer rounded-md border p-4 text-left transition-colors",
            cycle === "month"
              ? "border-primary bg-primary/5 ring-primary ring-1"
              : "border-border hover:border-primary/40"
          )}
        >
          <CycleLabel selected={cycle === "month"}>Оплата на місяць</CycleLabel>
          {currentPlan && (
            <>
              <p className="mt-2 text-xl leading-none font-bold">
                ${currentPlan.price_usd}{" "}
                <span className="text-muted-foreground text-lg font-normal">/ місяць</span>
              </p>
              {currentPlan.price_uah != null && (
                <p className="text-muted-foreground mt-1 text-xs">
                  ≈ {formatNumber(currentPlan.price_uah)} грн
                  {currentPlan.usd_rate ? ` (${currentPlan.usd_rate.toFixed(2)} ₴/$)` : ""}
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">Разова оплата за один місяць</p>
            </>
          )}
        </button>

        <button
          type="button"
          aria-pressed={cycle === "year"}
          onClick={() => onChange("year")}
          className={cn(
            "cursor-pointer rounded-md border p-4 text-left transition-colors",
            cycle === "year"
              ? "border-primary bg-primary/5 ring-primary ring-1"
              : "border-border hover:border-primary/40"
          )}
        >
          <CycleLabel selected={cycle === "year"}>
            Оплата на рік
            {annualPlan && annualPlan.months_free > 0 && (
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                Економія {annualPlan.months_free} міс.
              </span>
            )}
            {annualPlan && annualPlan.months_free === 0 && annualPlan.saving_usd > 0 && (
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                Економія ${annualPlan.saving_usd}
              </span>
            )}
          </CycleLabel>

          {annualPlan ? (
            <>
              <p className="mt-2 text-xl leading-none font-bold">
                ${annualPlan.price_usd}{" "}
                <span className="text-muted-foreground text-lg font-normal">/ рік</span>
              </p>
              {annualPlan.price_uah != null && (
                <p className="text-muted-foreground mt-1 text-xs">
                  ≈ {formatNumber(annualPlan.price_uah)} грн/рік (~$
                  {(annualPlan.price_usd / 12).toFixed(1)}/міс)
                </p>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                {annualPlan.saving_usd > 0
                  ? `Економія $${annualPlan.saving_usd} проти 12 місячних оплат`
                  : "Разова оплата за один рік"}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground mt-2 text-xs">
              {isTrial
                ? "Оберіть річний варіант у каталозі тарифів нижче"
                : "Річна оплата наразі недоступна для цього тарифу"}
            </p>
          )}
        </button>
      </div>
    </section>
  );
};

const CycleLabel = ({ selected, children }: { selected: boolean; children: ReactNode }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span
      aria-hidden="true"
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-full border-2",
        selected ? "border-primary" : "border-muted-foreground"
      )}
    >
      {selected && <span className="bg-primary h-2 w-2 rounded-full" />}
    </span>
    <span className="text-sm font-medium">{children}</span>
  </div>
);
