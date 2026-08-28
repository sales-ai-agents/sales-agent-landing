"use client";

import { useState, useCallback } from "react";
import { AlertTriangle, Download } from "lucide-react";

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
      ? (currentPlanData.price_uah / 41 / stats.total_calls).toFixed(2)
      : null;

  const visiblePayments = showAllPayments ? payments : payments.slice(0, 3);

  return (
    <div className="space-y-6">
      {isTrial && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              Додайте спосіб оплати, щоб не втратити доступ після завершення Trial
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={openUpgradeDialog}>
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
                <p className="mt-2 text-[25px] leading-none font-bold">
                  ${Math.round(currentPlanData.price_uah / 45)}{" "}
                  <span className="text-muted-foreground text-lg font-normal">/ місяць</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  ${Math.round(currentPlanData.price_uah / 45)} щомісяця, без зобов&apos;язань
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
                <p className="mt-2 text-[25px] leading-none font-bold">
                  ${Math.round((currentPlanData.price_uah / 45) * 12)}{" "}
                  <span className="text-muted-foreground text-lg font-normal">/ рік</span>
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  ${((currentPlanData.price_uah / 45) * (1 - ANNUAL_DISCOUNT)).toFixed(1)} / місяць
                  при річній оплаті (${Math.round((currentPlanData.price_uah / 45) * 10)} раз на
                  рік)
                </p>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <p className="text-muted-foreground mb-4 text-sm font-medium">Спосіб оплати</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {payments.length > 0 ? (
              <div className="bg-primary/10 flex h-10 w-16 items-center justify-center rounded-md">
                <svg viewBox="0 0 48 16" className="h-5 w-10" aria-label="Visa">
                  <text
                    x="0"
                    y="13"
                    fontFamily="Arial"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#1a1f71"
                    letterSpacing="-0.5"
                  >
                    VISA
                  </text>
                </svg>
              </div>
            ) : (
              <div className="border-border bg-muted flex h-10 w-14 items-center justify-center rounded-lg border">
                <svg
                  className="text-muted-foreground h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {payments.length > 0 ? "Visa **** 4242" : "Спосіб оплати не додано"}
              </p>
              <p className="text-muted-foreground text-xs">
                {payments.length > 0
                  ? "Дійсна до 12/27"
                  : "Додайте спосіб оплати для підписки на платний план"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={openUpgradeDialog}>
            {payments.length > 0 ? "Змінити картку" : "Додати карту"}
          </Button>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-6">
        <p className="text-muted-foreground mb-4 text-sm font-medium">Історія платежів</p>
        {payments.length === 0 ? (
          <div className="py-8 text-center">
            <svg
              className="text-muted-foreground mx-auto h-10 w-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
              />
            </svg>
            <p className="mt-2 text-sm font-semibold">Платежів ще немає</p>
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
                          <svg viewBox="0 0 32 11" className="h-3 w-6" aria-label="Visa">
                            <text
                              x="0"
                              y="9"
                              fontFamily="Arial"
                              fontSize="10"
                              fontWeight="bold"
                              fill="#1a1f71"
                            >
                              VISA
                            </text>
                          </svg>
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
