"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Receipt, AlertTriangle } from "lucide-react";

import { Button, Badge, Progress } from "@/components/ui";
import { PageError, PageLoading, ChangePlanDialog } from "@/components/dashboard";
import { useBillingPlans, useBillingHistory, useStats } from "@dashboard/hooks";
import { formatNumber, formatDateLong, formatDateShort } from "@/lib/utils";
import { PlanCard } from "./_components/plan-card";
import { PaymentStatusLabel } from "./_components/payment-status-label";
import { getDefaultUpgradePlan } from "./_lib/utils";

const BillingPage = () => {
  const { data: stats } = useStats();
  const { data: historyData } = useBillingHistory();
  const { data: billing, isLoading, isError, refetch } = useBillingPlans();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);

  if (isLoading) return <PageLoading />;
  if (isError || !billing) return <PageError onRetry={() => refetch()} />;

  const currentPlanData = billing.plans.find((p) => p.key === billing.current);
  const payments = historyData?.payments ?? [];
  const isTrial = billing.current === "trial";

  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? billing.minutes;
  const usagePercent = minutesLimit > 0 ? (minutesUsed / minutesLimit) * 100 : 0;

  const openUpgradeDialog = () => {
    if (!billing) return;
    setSelectedPlanKey(getDefaultUpgradePlan(billing.plans, billing.current));
  };

  return (
    <div className="space-y-6">
      {isTrial && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
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
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Ваш тариф</p>
            <p className="mt-1 text-3xl font-bold uppercase">
              {currentPlanData?.title ?? (isTrial ? "TRIAL" : billing.current)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {isTrial
                ? "Безкоштовний період"
                : `${currentPlanData?.minutes ?? billing.minutes} хвилин на місяць`}
            </p>
            <button onClick={openUpgradeDialog} className="text-primary mt-2 text-sm font-medium">
              Змінити тариф
            </button>
          </div>

          <div className="flex-1 md:max-w-sm">
            <p className="text-muted-foreground text-xs">Використані хвилини</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{minutesUsed}</span>
              <span className="text-muted-foreground text-lg">
                / {formatNumber(minutesLimit)} хв
              </span>
            </div>
            <Progress value={usagePercent} className="mt-2 h-2" />
            <p className="text-muted-foreground mt-1 text-xs">
              {minutesUsed > 0
                ? `Залишилось на ${Math.round((stats?.minutes_left ?? 0) / (minutesUsed / (stats?.period_days ?? 7) || 1))} днів при поточному темпі`
                : "Дані з'являться після першого дзвінка"}
            </p>
          </div>

          <div className="text-right">
            <Badge variant="success">Активний</Badge>
            {billing.expires_at && (
              <p className="text-muted-foreground mt-1 text-xs">
                Діє до {formatDateLong(billing.expires_at)}
              </p>
            )}
          </div>
        </div>

        {minutesUsed > 0 && (stats?.minutes_left ?? 0) < minutesLimit * 0.1 && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
            <p className="text-sm text-amber-800">
              Після вичерпання ліміту хвилин агенти зупинять дзвінки. Щоб продовжити роботу без
              перерв - докупіть хвилини.
            </p>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm">
                Докупити хвилини
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="border-border bg-background rounded-2xl border p-5">
          <p className="text-muted-foreground text-sm">Використання за місяць</p>
          <p className="mt-2 text-2xl font-bold">
            {minutesUsed}{" "}
            <span className="text-muted-foreground text-base font-normal">
              / {formatNumber(minutesLimit)} хв
            </span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">Використано хвилин розмов</p>
        </div>
        <div className="border-border bg-background rounded-2xl border p-5">
          <p className="text-muted-foreground text-sm">Середня вартість дзвінка</p>
          <p className="mt-2 text-2xl font-bold">
            {stats?.total_calls && currentPlanData
              ? `$${(currentPlanData.price_uah / 41 / stats.total_calls).toFixed(2)}`
              : "—"}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {stats?.total_calls ? `за останні ${stats.period_days} днів` : "Ще немає дзвінків"}
          </p>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-5">
        <h2 className="mb-4 text-base font-semibold">Спосіб оплати</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="border-border bg-muted flex h-10 w-14 items-center justify-center rounded-lg border">
              <CreditCard className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {payments.length > 0 ? "Картка додана" : "Спосіб оплати не додано"}
              </p>
              <p className="text-muted-foreground text-xs">
                {payments.length > 0
                  ? "Оплата через monobank"
                  : "Додайте спосіб оплати для підписки на платний план"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={openUpgradeDialog}>
            {payments.length > 0 ? "Змінити картку" : "Додати карту"}
          </Button>
        </div>
      </div>

      <div className="border-border bg-background rounded-2xl border p-5">
        <h2 className="mb-4 text-base font-semibold">Історія платежів</h2>
        {payments.length === 0 ? (
          <div className="py-8 text-center">
            <Receipt className="text-muted-foreground mx-auto h-10 w-10" />
            <p className="mt-2 text-sm font-semibold">Платежів ще немає</p>
            <p className="text-muted-foreground text-xs">
              Тут відображатиметься історія ваших платежів та інвойсів
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium">Дата</th>
                  <th className="px-3 py-2 text-left font-medium">Опис</th>
                  <th className="px-3 py-2 text-left font-medium">Сума</th>
                  <th className="px-3 py-2 text-left font-medium">Спосіб оплати</th>
                  <th className="px-3 py-2 text-left font-medium">Інвойс</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="border-b last:border-0">
                    <td className="text-muted-foreground px-3 py-2.5">
                      {formatDateShort(payment.created_at)}
                    </td>
                    <td className="px-3 py-2.5">Тариф {payment.plan}</td>
                    <td className="px-3 py-2.5 font-medium">
                      ${(payment.amount_uah / 41).toFixed(2)}
                    </td>
                    <td className="text-muted-foreground px-3 py-2.5">monobank</td>
                    <td className="px-3 py-2.5">
                      <PaymentStatusLabel status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold">Тарифні плани</h2>
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
