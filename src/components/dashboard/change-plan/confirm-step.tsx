import type { ReactNode } from "react";
import { ArrowRight, Lock } from "lucide-react";

import { Badge, Button, DialogDescription, DialogTitle } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import type { BillingPeriod, BillingPlan } from "@dashboard/types";

import { PlanComparison } from "./plan-comparison";

interface ConfirmStepProps {
  currentPlan: BillingPlan | undefined;
  newPlan: BillingPlan;
  isSamePlan: boolean;
  cycle: BillingPeriod;
  onCycleChange: (cycle: BillingPeriod) => void;
  isProcessing: boolean;
  onCancel: () => void;
  onPay: () => void;
}

export const ConfirmStep = ({
  currentPlan,
  newPlan,
  isSamePlan,
  cycle,
  onCycleChange,
  isProcessing,
  onCancel,
  onPay,
}: ConfirmStepProps) => {
  const annualPlan = cycle === "year" ? newPlan.year : undefined;
  const isAnnual = annualPlan !== undefined;
  const payPriceUsd = annualPlan?.price_usd ?? newPlan.price_usd;
  const payPriceUah = annualPlan?.price_uah ?? newPlan.price_uah;

  return (
    <div className="space-y-6">
      <ConfirmHeader plan={newPlan} isSamePlan={isSamePlan} isAnnual={isAnnual} />

      {newPlan.year && <CycleSelector plan={newPlan} cycle={cycle} onCycleChange={onCycleChange} />}

      {isSamePlan ? (
        <SamePlanSummary plan={newPlan} isAnnual={isAnnual} priceUsd={payPriceUsd} />
      ) : (
        <PlanSwitchSummary
          currentPlan={currentPlan}
          newPlan={newPlan}
          isAnnual={isAnnual}
          priceUsd={payPriceUsd}
        />
      )}

      <PlanComparison currentPlan={currentPlan} newPlan={newPlan} isSamePlan={isSamePlan} />

      <PriceSummary
        plan={newPlan}
        isAnnual={isAnnual}
        priceUsd={payPriceUsd}
        priceUah={payPriceUah}
      />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="px-8">
          Скасувати
        </Button>
        <Button onClick={onPay} disabled={isProcessing} className="px-8">
          {isProcessing ? "Формування рахунку..." : "Сформувати рахунок"}
        </Button>
      </div>

      <SecureNote label="Безпечна оплата через WayForPay" />
    </div>
  );
};

interface ConfirmHeaderProps {
  plan: BillingPlan;
  isSamePlan: boolean;
  isAnnual: boolean;
}

const ConfirmHeader = ({ plan, isSamePlan, isAnnual }: ConfirmHeaderProps) => {
  const renewLabel = isAnnual
    ? `Оплатити тариф ${plan.title} на 1 рік`
    : `Продовжити тариф ${plan.title}`;

  return (
    <div>
      <DialogTitle className="text-xl font-bold">
        {isSamePlan ? renewLabel : `Змінити тариф на ${plan.title}`}
      </DialogTitle>
      <DialogDescription className="mt-1">
        {isSamePlan
          ? "Створення рахунку для вашого поточного тарифу. Перевірте деталі перед переходом до оплати."
          : `Ви обрали тариф ${plan.title}. Перевірте деталі перед формуванням рахунку.`}
      </DialogDescription>
    </div>
  );
};

interface CycleSelectorProps {
  plan: BillingPlan;
  cycle: BillingPeriod;
  onCycleChange: (cycle: BillingPeriod) => void;
}

const CycleSelector = ({ plan, cycle, onCycleChange }: CycleSelectorProps) => {
  const year = plan.year;
  if (!year) return null;

  const tabClassName = (period: BillingPeriod) =>
    cn(
      "flex-1 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
      cycle === period
        ? "bg-background text-foreground shadow-xs"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="bg-muted/50 border-border flex flex-col rounded-lg border p-1 sm:flex-row">
      <button
        type="button"
        onClick={() => onCycleChange("month")}
        className={tabClassName("month")}
      >
        Оплата щомісяця (${plan.price_usd}/міс)
      </button>
      <button
        type="button"
        onClick={() => onCycleChange("year")}
        className={cn(tabClassName("year"), "flex items-center justify-center gap-1.5")}
      >
        <span>Оплата на рік (${year.price_usd}/рік)</span>
        {year.months_free > 0 && <SavingBadge>-{year.months_free} міс</SavingBadge>}
        {year.months_free === 0 && year.saving_usd > 0 && (
          <SavingBadge>-${year.saving_usd}</SavingBadge>
        )}
      </button>
    </div>
  );
};

const SavingBadge = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
    {children}
  </span>
);

interface SamePlanSummaryProps {
  plan: BillingPlan;
  isAnnual: boolean;
  priceUsd: number;
}

const SamePlanSummary = ({ plan, isAnnual, priceUsd }: SamePlanSummaryProps) => (
  <div className="border-primary bg-primary/5 rounded-xl border p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground text-xs">Ваш тариф</p>
        <p className="text-primary mt-1 text-2xl font-bold uppercase">{plan.title}</p>
      </div>
      <div className="text-right">
        <Badge variant="outline" className="bg-primary text-primary-foreground px-4">
          {isAnnual ? "Річна оплата" : "Щомісячна оплата"}
        </Badge>
        <p className="text-muted-foreground mt-1 text-sm">
          ${priceUsd} / {isAnnual ? "рік" : "місяць"}
        </p>
      </div>
    </div>
  </div>
);

interface PlanSwitchSummaryProps {
  currentPlan: BillingPlan | undefined;
  newPlan: BillingPlan;
  isAnnual: boolean;
  priceUsd: number;
}

const PlanSwitchSummary = ({
  currentPlan,
  newPlan,
  isAnnual,
  priceUsd,
}: PlanSwitchSummaryProps) => (
  <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
    <div className="border-border flex-1 rounded-xl border p-4">
      <p className="text-muted-foreground text-xs">Ваш поточний тариф</p>
      <p className="mt-1 text-2xl font-bold uppercase">{currentPlan?.title ?? "TRIAL"}</p>
      <p className="text-muted-foreground mt-1 text-sm">${currentPlan?.price_usd ?? 0} / місяць</p>
      <Badge variant="outline" className="bg-primary/10 text-primary mt-4 border-white px-5">
        Поточний
      </Badge>
    </div>

    <ArrowRight className="text-muted-foreground hidden h-5 w-5 shrink-0 sm:block" />

    <div className="border-primary flex-1 rounded-xl border p-4">
      <p className="text-muted-foreground text-xs">Новий тариф</p>
      <p className="text-primary mt-1 text-2xl font-bold uppercase">{newPlan.title}</p>
      <p className="text-muted-foreground mt-1 text-sm">
        ${priceUsd} / {isAnnual ? "рік" : "місяць"}
      </p>
      <Badge variant="outline" className="bg-primary text-primary-foreground mt-4 px-5">
        Новий
      </Badge>
    </div>
  </div>
);

interface PriceSummaryProps {
  plan: BillingPlan;
  isAnnual: boolean;
  priceUsd: number;
  priceUah: number | null;
}

const PriceSummary = ({ plan, isAnnual, priceUsd, priceUah }: PriceSummaryProps) => (
  <div className="border-border bg-primary/5 rounded-xl border px-4 py-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-muted-foreground text-xs">Орієнтовна сума</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold">${priceUsd}</span>
          {priceUah != null && (
            <span className="text-muted-foreground text-sm">(≈ {formatNumber(priceUah)} грн)</span>
          )}
        </div>
        {plan.usd_rate && (
          <p className="text-muted-foreground mt-0.5 text-xs">
            Попередній курс НБУ {plan.usd_rate.toFixed(2)} ₴/$
          </p>
        )}
      </div>
      <p className="text-muted-foreground max-w-xs text-xs sm:text-right">
        Точна сума в гривнях розраховується сервером за курсом НБУ на момент створення рахунку.
        <br />
        {isAnnual ? "Період: 1 рік." : "Період: 1 місяць."}
      </p>
    </div>
  </div>
);

export const SecureNote = ({ label }: { label: string }) => (
  <div className="text-muted-foreground flex items-center justify-center gap-1.5">
    <Lock className="h-3 w-3" />
    <span className="text-xs">{label}</span>
  </div>
);
