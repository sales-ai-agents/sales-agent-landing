"use client";

import { useState, useCallback } from "react";
import { AlertTriangle, Download, CreditCard, LucideHistory } from "lucide-react";

import { Button, Progress } from "@/components/ui";
import { PageError, PageLoading, ChangePlanDialog } from "@/components/dashboard";
import { useBillingPlans, useBillingHistory, useStats } from "@dashboard/hooks";
import { cn, formatNumber, formatDateShort } from "@/lib/utils";
import { PlanCard } from "./_components/plan-card";
import { getDefaultUpgradePlan } from "./_lib/utils";

type BillingCycle = "monthly" | "annual";

const ANNUAL_DISCOUNT = 0.17; // ~2 months free = ~17% off

const BillingPage = () => {
  const { data: stats } = useStats();
  const { data: historyData } = useBillingHistory();
  const { data: billing, isLoading, isError, refetch } = useBillingPlans();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [showAllPayments, setShowAllPayments] = useState(false);

  const openUpgradeDialog = useCallback(() => {
    if (!billing) return;
    setSelectedPlanKey(getDefaultUpgradePlan(billing.plans, billing.current));
  }, [billing]);

  if (isLoading) return <PageLoading />;
  if (isError || !billing)
    return <PageError message="Не вдалося завантажити тарифи" onRetry={() => refetch()} />;

  const currentPlanData = billing.plans.find((p) => p.key === billing.current);
  const payments = historyData?.payments ?? [];
  const isTrial = billing.current === "trial";

  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? billing.minutes;
  const usagePercent = minutesLimit > 0 ? Math.min((minutesUsed / minutesLimit) * 100, 100) : 0;

  const daysLeft =
    minutesUsed > 0
      ? Math.round((stats?.minutes_left ?? 0) / (minutesUsed / (stats?.period_days ?? 7) || 1))
      : null;

  const avgCallCost =
    stats?.total_calls && currentPlanData
      ? (currentPlanData.price_usd / 41 / stats.total_calls).toFixed(2)
      : null;

  const visiblePayments = showAllPayments ? payments : payments.slice(0, 3);

  return (
    <div className="space-y-6">
      {isTrial && (
        <div className="flex items-center justify-between rounded-xl border border-red-500 bg-red-500/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-500">
              Додайте спосіб оплати, щоб не втратити доступ після завершення Trial
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary px-8"
            onClick={openUpgradeDialog}
          >
            Додати спосіб оплати
          </Button>
        </div>
      )}

      <h1 className="text-2xl font-bold">Тариф / оплата</h1>

      <div className="border-border bg-background rounded-2xl border p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground text-sm">Ваш тариф</p>
            <p className="mt-2 text-3xl font-bold tracking-wide uppercase">
              {currentPlanData?.title ?? (isTrial ? "TRIAL" : billing.current)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {isTrial
                ? "Безкоштовний період"
                : `${formatNumber(currentPlanData?.minutes ?? billing.minutes)} хвилин на місяць`}
            </p>
            <button
              onClick={openUpgradeDialog}
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              Змінити тариф
            </button>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Використані хвилини</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formatNumber(minutesUsed)}</span>
              <span className="text-muted-foreground text-lg">
                {" "}
                / {formatNumber(minutesLimit)} хв
              </span>
            </div>
            <Progress value={usagePercent} className="mt-2 h-2" />
            <p className="text-muted-foreground mt-1 text-xs">
              {daysLeft !== null
                ? `Залишилось на ${daysLeft} днів при поточному темпі`
                : "Дані з'являться після першого дзвінка"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Середня вартість дзвінка</p>
            <p className="mt-1 text-3xl font-bold">{avgCallCost ? `${avgCallCost}$` : "—"}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {stats?.total_calls
                ? `за останні ${stats.period_days ?? 7} днів`
                : "Ще немає дзвінків"}
            </p>
          </div>
        </div>

        {minutesUsed > 0 && (stats?.minutes_left ?? 0) < minutesLimit * 0.1 && (
          <div className="border-primary/20 bg-primary/5 mt-5 flex items-center justify-between rounded-lg border px-4 py-2.5">
            <p className="text-sm text-blue-800">
              Після вичерпання ліміту хвилин агенти зупинять дзвінки. Щоб продовжити роботу без
              перерв — докупіть хвилини.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={openUpgradeDialog}
              className="ml-4 shrink-0"
            >
              Докупити хвилини
            </Button>
          </div>
        )}
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <p className="text-muted-foreground text-sm font-medium">Оплата тарифу</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => setCycle("monthly")}
            className={cn(
              "rounded-md border p-4 text-left transition-colors",
              cycle === "monthly"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border-2",
                  cycle === "monthly" ? "border-primary" : "border-muted-foreground"
                )}
              >
                {cycle === "monthly" && <div className="bg-primary h-2 w-2 rounded-full" />}
              </div>
              <span className="text-sm font-medium">Щомісячна оплата</span>
            </div>
            {currentPlanData && (
              <>
                <p className="mt-2 text-xl leading-none font-bold">
                  ${currentPlanData.price_usd}{" "}
                  <span className="text-muted-foreground text-lg font-normal">/ місяць</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  ${currentPlanData.price_usd} <span>щомісяця, без зобов&apos;язань</span>
                </p>
              </>
            )}
          </button>

          <button
            onClick={() => setCycle("annual")}
            className={cn(
              "rounded-md border p-4 text-left transition-colors",
              cycle === "annual"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border-2",
                  cycle === "annual" ? "border-primary" : "border-muted-foreground"
                )}
              >
                {cycle === "annual" && <div className="bg-primary h-2 w-2 rounded-full" />}
              </div>
              <span className="text-sm font-medium">Річна оплата</span>
              <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Економія 2 місяці
              </span>
            </div>
            {currentPlanData && (
              <>
                <p className="mt-2 text-xl leading-none font-bold">
                  ${currentPlanData.price_usd * 12}{" "}
                  <span className="text-muted-foreground text-lg font-normal">/ рік</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  ${(currentPlanData.price_usd * (1 - ANNUAL_DISCOUNT)).toFixed(1)} / місяць при
                  річній оплаті (${currentPlanData.price_usd * 10} раз на рік)
                </p>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <p className="text-muted-foreground mb-4 text-sm font-medium">Спосіб оплати</p>
        <div className="border-border flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-4">
            {payments.length > 0 ? (
              <div className="bg-primary/10 flex items-center justify-center rounded-lg px-6 py-2">
                <CreditCard />
              </div>
            ) : (
              <div className="bg-muted flex items-center justify-center rounded-lg px-6 py-2">
                <CreditCard />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {payments.length > 0 ? "Visa **** 4242" : "Спосіб оплати не додано"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {payments.length > 0
                  ? "Дійсна до 12/27"
                  : "Додайте спосіб оплати для підписки на платний план"}
              </p>
            </div>
          </div>
          <Button variant="outline" className="px-6" size="lg" onClick={openUpgradeDialog}>
            {payments.length > 0 ? "Змінити картку" : "Додати карту"}
          </Button>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <p className="text-muted-foreground mb-4 text-sm font-medium">Історія платежів</p>
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <LucideHistory className="h-10 w-10" />
            <p className="text-sm font-semibold">Платежів ще немає</p>
            <p className="text-muted-foreground text-xs">
              Тут відображатиметься історія ваших платежів та інвойсів
            </p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground px-3 py-2 text-left text-sm font-medium">
                    Дата
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-sm font-medium">
                    Опис
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-sm font-medium">
                    Сума
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-sm font-medium">
                    Спосіб оплати
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-sm font-medium">
                    Інвойс
                  </th>
                </tr>
              </thead>
              <tbody>
                {visiblePayments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-0">
                    <td className="px-3 py-2.5">{formatDateShort(payment.created_at)}</td>
                    <td className="px-3 py-2.5">
                      Тариф {payment.plan} -{" "}
                      {new Date(payment.created_at).toLocaleString("uk-UA", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2.5 font-medium">
                      ${(payment.amount_uah / 41).toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 flex h-5 w-8 items-center justify-center rounded">
                          <CreditCard />
                        </div>
                        <span className="text-muted-foreground text-xs">**** 4242</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary text-xs">
                          INV-{payment.id.toString().padStart(4, "0")}
                        </span>
                        <button
                          className="text-primary hover:text-primary/80 transition-colors"
                          aria-label="Завантажити інвойс"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length > 3 && (
              <div className="mt-3 text-center">
                <button
                  className="text-primary text-sm hover:underline"
                  onClick={() => setShowAllPayments((v) => !v)}
                >
                  {showAllPayments ? "Приховати" : "Показати більше"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Тарифні плани</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {billing.plans.map((plan) => (
            <PlanCard
              key={plan.key}
              plan={plan}
              isCurrent={plan.key === billing.current}
              onSelect={() => setSelectedPlanKey(plan.key)}
            />
          ))}
        </div>
      </div>

      {selectedPlanKey && (
        <ChangePlanDialog
          plans={billing.plans}
          currentPlanKey={billing.current}
          selectedPlanKey={selectedPlanKey}
          onClose={() => setSelectedPlanKey(null)}
        />
      )}
    </div>
  );
};

export default BillingPage;
