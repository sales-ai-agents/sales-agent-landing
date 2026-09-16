"use client";

import { useCallback, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { ChangePlanDialog, PageError, PageLoading } from "@/components/dashboard";
import { Button } from "@/components/ui";
import { useBillingHistory, useBillingPlans, usePaymentMethod, useStats } from "@dashboard/hooks";
import type { AutoRenewState, BillingPeriod } from "@dashboard/types";

import { BillingCycleSelector } from "./_components/billing-cycle-selector";
import { PaymentHistorySection } from "./_components/payment-history-section";
import { PaymentMethodSection } from "./_components/payment-method-section";
import { PlanOverviewSection } from "./_components/plan-overview-section";
import { SubscriptionSection } from "./_components/subscription-section";
import { PlanCard } from "./_components/plan-card";
import { TopUpDialog } from "./_components/top-up-dialog";
import { getDefaultUpgradePlan } from "./_lib/utils";

const DEFAULT_AUTO_RENEW: AutoRenewState = {
  auto_renew: false,
  auto_charge: false,
  next_charge_at: null,
  auto_renew_period: "month",
};

const BillingPage = () => {
  const statsQuery = useStats();
  const billingQuery = useBillingPlans();
  const historyQuery = useBillingHistory();
  const paymentMethodQuery = usePaymentMethod();
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [cycle, setCycle] = useState<BillingPeriod>("month");
  const billing = billingQuery.data;

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
  const autoRenew: AutoRenewState = {
    auto_renew: billing.auto_renew ?? DEFAULT_AUTO_RENEW.auto_renew,
    auto_charge: billing.auto_charge ?? DEFAULT_AUTO_RENEW.auto_charge,
    next_charge_at: billing.next_charge_at ?? DEFAULT_AUTO_RENEW.next_charge_at,
    auto_renew_period: billing.auto_renew_period ?? DEFAULT_AUTO_RENEW.auto_renew_period,
  };

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
            nativeButton={false}
            render={<a href="#plans" />}
          >
            Обрати тариф
          </Button>
        </div>
      )}

      <h1 className="text-2xl font-bold">Тариф / оплата</h1>

      <PlanOverviewSection
        currentPlan={currentPlan}
        isTrial={isTrial}
        daysLeft={billing.days_left}
        expiresAt={billing.expires_at}
        planMinutes={currentPlan?.minutes ?? billing.minutes}
        bonusMinutes={billing.bonus_minutes ?? 0}
        statsQuery={statsQuery}
        onChangePlan={() => {
          if (isTrial) openPlanDialog();
          else openPlanDialog(upgradePlanKey ?? billing.current);
        }}
        onTopUp={() => setIsTopUpOpen(true)}
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

      <section id="plans" className="scroll-mt-4">
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

      {isTopUpOpen && (
        <TopUpDialog packs={billing.packs ?? []} onClose={() => setIsTopUpOpen(false)} />
      )}
    </div>
  );
};

export default BillingPage;
