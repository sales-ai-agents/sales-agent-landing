"use client";

import { Info } from "lucide-react";

import type { UseQueryResult } from "@tanstack/react-query";

import { Button, Progress, Separator } from "@/components/ui";
import { formatDateShort, formatNumber } from "@/lib/utils";
import type { BillingPlan, StatsResponse } from "@dashboard/types";

interface PlanOverviewSectionProps {
  currentPlan?: BillingPlan;
  isTrial: boolean;
  daysLeft: number | null;
  expiresAt: string | null;
  planMinutes: number;
  bonusMinutes: number;
  statsQuery: UseQueryResult<StatsResponse>;
  onChangePlan: () => void;
  onTopUp: () => void;
}

const LOW_MINUTES_THRESHOLD = 0.1;

export const PlanOverviewSection = ({
  currentPlan,
  isTrial,
  daysLeft,
  expiresAt,
  planMinutes,
  bonusMinutes,
  statsQuery,
  onChangePlan,
  onTopUp,
}: PlanOverviewSectionProps) => {
  const stats = statsQuery.data;
  const minutesUsed = stats?.minutes_used ?? 0;
  const minutesLimit = stats?.minutes_limit ?? planMinutes;
  const minutesLeft = stats?.minutes_left ?? 0;
  const usagePercent = minutesLimit > 0 ? Math.min((minutesUsed / minutesLimit) * 100, 100) : 0;
  const avgCallCost = stats?.avg_call_usd != null ? stats.avg_call_usd.toFixed(2) : null;

  return (
    <section className="border-border bg-background rounded-2xl border p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1.4fr_auto_1fr] lg:items-start">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">Ваш тариф</p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-3xl font-bold tracking-wide uppercase">
              {currentPlan?.title ?? (isTrial ? "TRIAL" : "—")}
            </p>
            {isTrial && daysLeft != null && daysLeft >= 0 && (
              <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600 dark:bg-orange-950/60 dark:text-orange-300">
                {daysLeft} {pluralizeDays(daysLeft)} залишилось
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {isTrial
              ? "Безкоштовний період"
              : expiresAt
                ? `Діє до ${formatDateShort(expiresAt)} · ${formatNumber(planMinutes)} хв/міс`
                : `${formatNumber(planMinutes)} хвилин на місяць`}
          </p>
          <button
            type="button"
            className="text-primary cursor-pointer self-start text-sm font-medium hover:underline"
            onClick={onChangePlan}
          >
            Змінити тариф
          </button>
        </div>

        <Separator orientation="vertical" className="hidden lg:block" />

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">Використані хвилини</p>
          {statsQuery.isLoading ? (
            <UsageSkeleton />
          ) : statsQuery.isError ? (
            <InlineError onRetry={() => statsQuery.refetch()} />
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formatNumber(minutesUsed)}</span>
                <span className="text-muted-foreground text-lg">
                  / {formatNumber(minutesLimit)} хв
                </span>
              </div>
              <Progress value={usagePercent} className="h-2" />
              {bonusMinutes > 0 && (
                <p className="text-muted-foreground text-xs">
                  + {formatNumber(bonusMinutes)} докуплених хвилин (не згоряють)
                </p>
              )}
              <div className="mt-4 flex flex-col items-start gap-3 rounded-md bg-blue-50 px-3 py-3 sm:flex-row sm:items-center">
                <Info className="text-primary h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="text-muted-foreground text-xs">
                  Після вичерпання ліміту хвилин агенти зупинять дзвінки. Щоб продовжити роботу без
                  перерв — докупіть хвилини.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary shrink-0 bg-transparent"
                  onClick={onTopUp}
                >
                  Докупити хвилини
                </Button>
              </div>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="hidden lg:block" />

        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">Середня вартість дзвінка</p>
          {statsQuery.isLoading ? (
            <UsageSkeleton compact />
          ) : statsQuery.isError ? (
            <InlineError onRetry={() => statsQuery.refetch()} />
          ) : (
            <>
              <p className="text-3xl">{avgCallCost !== null ? `${avgCallCost}$` : "—"}</p>
              <p className="text-muted-foreground text-xs">
                {stats?.total_calls
                  ? `за останні ${stats.period_days ?? 7} днів`
                  : "Ще немає дзвінків"}
              </p>
            </>
          )}
        </div>
      </div>

      {isMinutesLow(statsQuery, minutesUsed, minutesLeft, minutesLimit) && (
        <div className="border-primary/20 bg-primary/5 mt-5 flex flex-col gap-3 rounded-lg border px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Ліміт хвилин майже вичерпано. Докупіть хвилини, щоб уникнути перерви в дзвінках.
          </p>
          <Button variant="outline" size="sm" className="shrink-0" onClick={onTopUp}>
            Докупити хвилини
          </Button>
        </div>
      )}
    </section>
  );
};

const pluralizeDays = (days: number): string => {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дні";
  return "днів";
};

const isMinutesLow = (
  statsQuery: UseQueryResult<StatsResponse>,
  used: number,
  left: number,
  limit: number
): boolean => statsQuery.isSuccess && used > 0 && limit > 0 && left < limit * LOW_MINUTES_THRESHOLD;

const UsageSkeleton = ({ compact = false }: { compact?: boolean }) => (
  <div className="mt-2 space-y-2">
    <div className="bg-muted h-8 w-32 animate-pulse rounded" />
    {!compact && <div className="bg-muted h-2 w-full animate-pulse rounded" />}
    <div className="bg-muted h-3 w-40 animate-pulse rounded" />
  </div>
);

const InlineError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="border-destructive/20 bg-destructive/5 mt-2 rounded-lg border p-2.5">
    <p className="text-destructive text-xs font-medium">Не вдалося завантажити</p>
    <button
      type="button"
      onClick={onRetry}
      className="text-primary cursor-pointer text-xs hover:underline"
    >
      Спробувати знову
    </button>
  </div>
);
