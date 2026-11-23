"use client";

import { useCallback, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { ChangePlanDialog, PageError, PageHead, PageLoading } from "@/components/dashboard";
import { Alert, AlertDescription, Button } from "@/components/ui";
import { DEFAULT_AUTO_RENEW } from "@dashboard/billing";
import {
  useBalance,
  useBillingHistory,
  useBillingPlans,
  usePaymentMethod,
  useStats,
} from "@dashboard/hooks";
import type { AutoRenewState, BillingPeriod } from "@dashboard/types";

import { BillingCycleSelector } from "./_components/billing-cycle-selector";
import { PaymentHistorySection } from "./_components/payment-history-section";
import { PaymentMethodSection } from "./_components/payment-method-section";
import { PlanOverviewSection } from "./_components/plan-overview-section";
import { SubscriptionSection } from "./_components/subscription-section";
import { PlanCard } from "./_components/plan-card";
import { getDefaultUpgradePlan } from "./_lib/utils";

const scrollToPlans = () => {
  document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
};

const BillingPage = () => {
  const statsQuery = useStats();
  const billingQuery = useBillingPlans();
  const historyQuery = useBillingHistory();
  const paymentMethodQuery = usePaymentMethod();
  const { data: balance } = useBalance();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [cycle, setCycle] = useState<BillingPeriod>("month");

  const billing = billingQuery.data;
  const stats = statsQuery.data;

  const openPlanDialog = useCallback(
    (planKey?: string) => {
      if (!billing) return;
      const key =
        planKey ?? getDefaultUpgradePlan(billing.plans, billing.current) ?? billing.current;
      setSelectedPlanKey(key);
    },
    [billing]
  );

  if (billingQuery.isLoading) return <PageLoading message="Завантажуємо тарифи..." />;
  if (billingQuery.isError || !billing) {
    return (
      <PageError message="Не вдалося завантажити тарифи" onRetry={() => billingQuery.refetch()} />
    );
  }

  const currentPlan = billing.plans.find((plan) => plan.key === billing.current);
  const upgradePlanKey = getDefaultUpgradePlan(billing.plans, billing.current);
  const isTrial = billing.current === "trial";
  const maxPlanMinutes = Math.max(...billing.plans.map((plan) => plan.minutes));

  const autoRenew: AutoRenewState = {
    auto_renew: billing.auto_renew ?? DEFAULT_AUTO_RENEW.auto_renew,
    auto_charge: billing.auto_charge ?? DEFAULT_AUTO_RENEW.auto_charge,
    next_charge_at: billing.next_charge_at ?? DEFAULT_AUTO_RENEW.next_charge_at,
    auto_renew_period: billing.auto_renew_period ?? DEFAULT_AUTO_RENEW.auto_renew_period,
    auto_renew_consent_at:
      billing.auto_renew_consent_at ?? DEFAULT_AUTO_RENEW.auto_renew_consent_at,
  };

  return (
    <div className="flex flex-col gap-6">
      {isTrial && (
        <Alert variant="warning" className="flex items-center gap-3">
          <TriangleAlert aria-hidden="true" />
          <AlertDescription className="text-foreground">
            Додайте спосіб оплати, щоб не втратити доступ після завершення Trial
          </AlertDescription>
          <Button size="sm" onClick={scrollToPlans}>
            Обрати тариф
          </Button>
        </Alert>
      )}

      <PageHead word="оплата" title="Тариф / оплата" tone="b" />

      <PlanOverviewSection
        currentPlan={currentPlan}
        isTrial={isTrial}
        daysLeft={billing.days_left}
        expiresAt={billing.expires_at}
        planMinutes={currentPlan?.minutes ?? billing.minutes}
        bonusMinutes={billing.bonus_minutes ?? 0}
        minutesUsed={stats?.minutes_used ?? 0}
        minutesLimit={stats?.minutes_limit ?? currentPlan?.minutes ?? billing.minutes}
        minutesLeft={stats?.minutes_left ?? 0}
        avgCallUsd={stats?.avg_call_usd ?? null}
        totalCalls={stats?.total_calls ?? 0}
        periodDays={stats?.period_days ?? 7}
        isStatsLoading={statsQuery.isLoading}
        isStatsError={statsQuery.isError}
        onRetryStats={() => statsQuery.refetch()}
        onChangePlan={() => openPlanDialog(upgradePlanKey ?? undefined)}
        minutePriceUsd={balance?.minute_price_usd}
      />

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

      {!isTrial && <SubscriptionSection autoRenew={autoRenew} expiresAt={billing.expires_at} />}

      <PaymentHistorySection
        payments={historyQuery.data?.payments}
        isLoading={historyQuery.isLoading}
        isError={historyQuery.isError}
        onRetry={() => historyQuery.refetch()}
      />

      <h2 id="plans" className="font-heading px-1 pt-2 text-3xl">
        Тарифні плани
      </h2>
      <div className="flex flex-wrap gap-4">
        {billing.plans.map((plan) => (
          <PlanCard
            key={plan.key}
            plan={plan}
            cycle={cycle}
            maxMinutes={maxPlanMinutes}
            isCurrent={plan.key === billing.current}
            onSelect={() => setSelectedPlanKey(plan.key)}
          />
        ))}
      </div>
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
