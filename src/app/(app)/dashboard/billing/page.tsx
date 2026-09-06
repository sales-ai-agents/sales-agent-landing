"use client";

import { useCallback, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { ChangePlanDialog, PageError, PageLoading } from "@/components/dashboard";
import { Button, Progress } from "@/components/ui";
import { formatDateShort, formatNumber } from "@/lib/utils";
import { useBillingHistory, useBillingPlans, usePaymentMethod, useStats } from "@dashboard/hooks";
import type { BillingPeriod } from "@dashboard/types";

import { BillingCycleSelector } from "./_components/billing-cycle-selector";
import { PaymentHistorySection } from "./_components/payment-history-section";
import { PaymentMethodSection } from "./_components/payment-method-section";
import { PlanCard } from "./_components/plan-card";
import { getDefaultUpgradePlan } from "./_lib/utils";

const BillingPage = () => {
  const statsQuery = useStats();
  const billingQuery = useBillingPlans();
  const historyQuery = useBillingHistory();
  const paymentMethodQuery = usePaymentMethod();
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [cycle, setCycle] = useState<BillingPeriod>("month");
  const billing = billingQuery.data;
  const stats = statsQuery.data;

  const openPlanDialog = useCallback(
    (planKey?: string) => {
      if (!billing) return;

      if (planKey) {
        setSelectedPlanKey(planKey);
        return;
      }

      const defaultPlanKey =
        billing.current === "trial"
          ? getDefaultUpgradePlan(billing.plans, billing.current)
          : billing.current;
      setSelectedPlanKey(defaultPlanKey);
    },
    [billing]
  );

  if (billingQuery.isLoading) return <PageLoading />;
  if (billingQuery.isError || !billing) {
    return (
      <PageError message="Не вдалося завантажити тарифи" onRetry={() => billingQuery.refetch()} />
    );
  }

  const currentPlan = billing.plans.find((plan) => plan.key === billing.current);
  const upgradePlanKey = getDefaultUpgradePlan(billing.plans, billing.current);
  const isTrial = billing.current === "trial";
  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? billing.minutes;
  const minutesLeft = stats?.minutes_left ?? 0;
  const usagePercent = minutesLimit > 0 ? Math.min((minutesUsed / minutesLimit) * 100, 100) : 0;
  const daysLeft =
    minutesUsed > 0
      ? Math.round(minutesLeft / (minutesUsed / (stats?.period_days ?? 7) || 1))
      : null;
  const avgCallCost = stats?.avg_call_usd != null ? stats.avg_call_usd.toFixed(2) : null;
  const isMinutesLimitLow =
    statsQuery.isSuccess && minutesUsed > 0 && minutesLeft < minutesLimit * 0.1;

  return (
    <div className="space-y-6">
      {isTrial && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-500 bg-red-500/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-500">
              Оберіть тариф, щоб не втратити доступ після завершення безкоштовного періоду Trial
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary px-8"
            onClick={() => openPlanDialog()}
          >
            Обрати тариф
          </Button>
        </div>
      )}

      <h1 className="text-2xl font-bold">Тариф / оплата</h1>

      <section className="border-border bg-background rounded-2xl border p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">Ваш тариф</p>
            <p className="mt-2 text-3xl font-bold tracking-wide uppercase">
              {currentPlan?.title ?? (isTrial ? "TRIAL" : billing.current)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {isTrial
                ? "Безкоштовний період"
                : billing.expires_at
                  ? `Діє до ${formatDateShort(billing.expires_at)} · ${formatNumber(currentPlan?.minutes ?? billing.minutes)} хв/міс`
                  : `${formatNumber(currentPlan?.minutes ?? billing.minutes)} хвилин на місяць`}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {!isTrial && currentPlan && (
                <Button
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => openPlanDialog(currentPlan.key)}
                >
                  {cycle === "year" && currentPlan.year ? "Оплатити на рік" : "Продовжити тариф"}
                </Button>
              )}
              {(isTrial || upgradePlanKey) && (
                <button
                  type="button"
                  className="text-primary cursor-pointer text-xs font-medium hover:underline"
                  onClick={() => {
                    if (isTrial) openPlanDialog();
                    else if (upgradePlanKey) openPlanDialog(upgradePlanKey);
                  }}
                >
                  {isTrial ? "Обрати тариф" : "Перейти на вищий тариф"}
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Використані хвилини</p>
            {statsQuery.isLoading ? (
              <div className="mt-2 space-y-2">
                <div className="bg-muted h-8 w-32 animate-pulse rounded" />
                <div className="bg-muted h-2 w-full animate-pulse rounded" />
                <div className="bg-muted h-3 w-40 animate-pulse rounded" />
              </div>
            ) : statsQuery.isError ? (
              <div className="border-destructive/20 bg-destructive/5 mt-2 rounded-lg border p-2.5">
                <p className="text-destructive text-xs font-medium">Не вдалося завантажити</p>
                <button
                  type="button"
                  onClick={() => statsQuery.refetch()}
                  className="text-primary mt-1 cursor-pointer text-xs hover:underline"
                >
                  Спробувати знову
                </button>
              </div>
            ) : (
              <>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatNumber(minutesUsed)}</span>
                  <span className="text-muted-foreground text-lg">
                    / {formatNumber(minutesLimit)} хв
                  </span>
                </div>
                <Progress value={usagePercent} className="mt-2 h-2" />
                <p className="text-muted-foreground mt-1 text-xs">
                  {daysLeft !== null
                    ? `Залишилось на ${daysLeft} днів при поточному темпі`
                    : "Дані з'являться після першого дзвінка"}
                </p>
              </>
            )}
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Середня вартість дзвінка</p>
            {statsQuery.isLoading ? (
              <div className="mt-2 space-y-2">
                <div className="bg-muted h-8 w-24 animate-pulse rounded" />
                <div className="bg-muted h-3 w-32 animate-pulse rounded" />
              </div>
            ) : statsQuery.isError ? (
              <div className="border-destructive/20 bg-destructive/5 mt-2 rounded-lg border p-2.5">
                <p className="text-destructive text-xs font-medium">Не вдалося завантажити</p>
                <button
                  type="button"
                  onClick={() => statsQuery.refetch()}
                  className="text-primary mt-1 cursor-pointer text-xs hover:underline"
                >
                  Спробувати знову
                </button>
              </div>
            ) : (
              <>
                <p className="mt-1 text-3xl font-bold">
                  {avgCallCost !== null ? `$${avgCallCost}` : "—"}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {stats?.total_calls
                    ? `за останні ${stats.period_days ?? 7} днів`
                    : "Ще немає дзвінків"}
                </p>
              </>
            )}
          </div>
        </div>

        {isMinutesLimitLow && (
          <div className="border-primary/20 bg-primary/5 mt-5 flex flex-col gap-3 rounded-lg border px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {upgradePlanKey
                ? "Після вичерпання ліміту агенти зупинять дзвінки. Перейдіть на тариф із більшою кількістю хвилин, щоб уникнути перерви."
                : "Використано майже весь ліміт хвилин за максимальним тарифом."}
            </p>
            {upgradePlanKey && (
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => openPlanDialog(upgradePlanKey)}
              >
                Змінити тариф
              </Button>
            )}
          </div>
        )}
      </section>

      <BillingCycleSelector
        cycle={cycle}
        currentPlan={currentPlan}
        isTrial={isTrial}
        onChange={setCycle}
      />
      <PaymentMethodSection
        data={paymentMethodQuery.data}
        isLoading={paymentMethodQuery.isLoading}
        isError={paymentMethodQuery.isError}
        isTrial={isTrial}
        onRetry={() => paymentMethodQuery.refetch()}
        onSelectPlan={() => openPlanDialog()}
      />
      <PaymentHistorySection
        payments={historyQuery.data?.payments}
        isLoading={historyQuery.isLoading}
        isError={historyQuery.isError}
        onRetry={() => historyQuery.refetch()}
      />

      <section>
        <h2 className="mb-4 text-lg font-semibold">Тарифні плани</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {billing.plans.map((plan) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              cycle={cycle}
              isCurrent={plan.key === billing.current}
              onSelect={() => setSelectedPlanKey(plan.key)}
            />
          ))}
        </div>
      </section>

      {selectedPlanKey && (
        <ChangePlanDialog
          plans={billing.plans}
          currentPlanKey={billing.current}
          selectedPlanKey={selectedPlanKey}
          initialCycle={cycle}
          onClose={() => setSelectedPlanKey(null)}
        />
      )}
    </div>
  );
};

export default BillingPage;
