"use client";

import { useState } from "react";
import Link from "next/link";

import { Plus } from "lucide-react";
import { PageError, PageHead, PageLoading, TopUpDialog } from "@/components/dashboard";
import { Button, Card } from "@/components/ui";
import { useBalance, useBillingPlans, useStats } from "@dashboard/hooks";
import { formatUsd } from "@/lib/utils";
import { BalanceHero } from "./_components/balance-hero";
import { LedgerList } from "./_components/ledger-list";
import { PlanMinutesCard } from "./_components/plan-minutes-card";
import { SpendOptions } from "./_components/spend-options";

const BalancePage = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const balanceQuery = useBalance();
  const { data: stats } = useStats();
  const { data: plans } = useBillingPlans();

  if (balanceQuery.isLoading) return <PageLoading message="Завантажуємо баланс..." />;
  if (balanceQuery.error) {
    return <PageError message={balanceQuery.error.message} onRetry={balanceQuery.refetch} />;
  }
  if (!balanceQuery.data) return null;

  const balance = balanceQuery.data;
  const extraMinutes = Math.max(0, Math.floor(balance.balance_usd / balance.minute_price_usd));
  const extraNumbers = Math.max(
    0,
    Math.floor(balance.balance_usd / balance.extra_number_price_usd)
  );
  const minutesLeftFraction =
    stats && stats.minutes_limit > 0 ? stats.minutes_left / stats.minutes_limit : 0;
  const runway =
    stats?.minutes_runway_days == null ? "—" : `~${Math.round(stats.minutes_runway_days)} днів`;

  const planBonuses = (plans?.plans ?? [])
    .filter((plan) => !plan.coming_soon && plan.balance_usd)
    .map((plan) => `${formatUsd(plan.balance_usd ?? 0)} (${plan.title})`);
  const planBonusHint =
    planBonuses.length > 0
      ? `Платні тарифи при кожній оплаті доповнюють рахунок до ${planBonuses.join(" або ")}.`
      : "Платні тарифи при кожній оплаті доповнюють рахунок.";

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="баланс"
        title="Баланс"
        description="Рахунок у доларах для хвилин і номерів, та хвилини вашого тарифу"
        tone="b"
        actions={
          <Button onClick={() => setIsTopUpOpen(true)}>
            <Plus aria-hidden="true" />
            Поповнити рахунок
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <BalanceHero
          balanceUsd={balance.balance_usd}
          extraMinutes={extraMinutes}
          extraNumbers={extraNumbers}
          extraNumberPriceUsd={balance.extra_number_price_usd}
          onTopUp={() => setIsTopUpOpen(true)}
        />
        <PlanMinutesCard
          minutesLeft={stats ? stats.minutes_left : null}
          minutesLimit={stats ? stats.minutes_limit : null}
          fraction={minutesLeftFraction}
          minutePriceUsd={balance.minute_price_usd}
          runway={runway}
        />
      </div>
      <h2 className="font-heading px-1 pt-2 text-2xl">На що витратити рахунок</h2>
      <SpendOptions
        minutePriceUsd={balance.minute_price_usd}
        extraNumberPriceUsd={balance.extra_number_price_usd}
        alertBelowUsd={balance.alert_below_usd}
        alertOptionsUsd={balance.alert_options_usd}
      />
      <Card className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <b className="font-heading text-lg">Бонус від тарифу</b>
          <Link
            className="text-primary text-sm font-medium hover:underline"
            href="/dashboard/billing"
          >
            Тарифи →
          </Link>
        </div>
        <p className="text-muted-foreground text-sm">
          {balance.plan_balance_usd > 0
            ? `При кожній оплаті тарифу рахунок доповнюється до ${formatUsd(balance.plan_balance_usd)}. Бонус не додається до наявної суми: рахунок лише поповнюється до цієї межі, якщо там менше.`
            : planBonusHint}
        </p>
      </Card>
      <LedgerList ledger={balance.ledger} />
      {isTopUpOpen && <TopUpDialog onClose={() => setIsTopUpOpen(false)} />}
    </div>
  );
};

export default BalancePage;
