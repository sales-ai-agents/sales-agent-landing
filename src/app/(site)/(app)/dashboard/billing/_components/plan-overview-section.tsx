"use client";

import Link from "next/link";

import { Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  Progress,
  buttonVariants,
} from "@/components/ui";
import { cn, formatDateShort, formatNumber, formatUsd, pluralizeDays } from "@/lib/utils";
import type { BillingPlan } from "@dashboard/types";

interface PlanOverviewSectionProps {
  currentPlan?: BillingPlan;
  isTrial: boolean;
  daysLeft: number | null;
  expiresAt: string | null;
  planMinutes: number;
  bonusMinutes: number;
  minutesUsed: number;
  minutesLimit: number;
  minutesLeft: number;
  avgCallUsd: number | null;
  totalCalls: number;
  periodDays: number;
  isStatsLoading: boolean;
  isStatsError: boolean;
  onRetryStats: () => void;
  minutePriceUsd?: number;
  autoCharge: boolean;
  onChangePlan: () => void;
}

const PERCENT = 100;

interface PlanNowProps {
  currentPlan?: BillingPlan;
  isTrial: boolean;
  daysLeft: number | null;
  expiresAt: string | null;
  planMinutes: number;
  autoCharge: boolean;
  onChangePlan: () => void;
}

const PlanNow = ({
  currentPlan,
  isTrial,
  daysLeft,
  expiresAt,
  planMinutes,
  autoCharge,
  onChangePlan,
}: PlanNowProps) => (
  <div className="flex flex-col items-start gap-3">
    <span className="caption text-muted-foreground">Ваш тариф</span>
    <div className="flex flex-wrap items-center gap-3">
      <b className="font-heading text-3xl">{currentPlan?.title ?? (isTrial ? "Trial" : "—")}</b>
      {isTrial && daysLeft !== null && (
        <Badge variant="warning">
          {daysLeft} {pluralizeDays(daysLeft)} залишилось
        </Badge>
      )}
    </div>
    <span className="text-muted-foreground">
      {isTrial
        ? "Безкоштовний період"
        : `${currentPlan ? `$${currentPlan.price_usd} / місяць` : `${formatNumber(planMinutes)} хв / міс`}`}
    </span>
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">Активний</Badge>
      {expiresAt && (
        <span className="text-muted-foreground text-sm">
          {isTrial || !autoCharge ? "Активний до" : "Наступне списання"}{" "}
          {formatDateShort(expiresAt)}
        </span>
      )}
    </div>
    <Button variant="link" className="h-auto p-0" onClick={onChangePlan}>
      Змінити тариф →
    </Button>
  </div>
);

export const PlanOverviewSection = ({
  currentPlan,
  isTrial,
  daysLeft,
  expiresAt,
  planMinutes,
  bonusMinutes,
  minutesUsed,
  minutesLimit,
  minutesLeft,
  avgCallUsd,
  totalCalls,
  periodDays,
  isStatsLoading,
  isStatsError,
  onRetryStats,
  minutePriceUsd,
  autoCharge,
  onChangePlan,
}: PlanOverviewSectionProps) => {
  const usagePercent =
    minutesLimit > 0 ? Math.min((minutesUsed / minutesLimit) * PERCENT, PERCENT) : 0;
  const hasDaysLeft = daysLeft != null && daysLeft >= 0;

  return (
    <Card className="grid gap-8 p-8 lg:grid-cols-3">
      <PlanNow
        currentPlan={currentPlan}
        isTrial={isTrial}
        daysLeft={hasDaysLeft ? daysLeft : null}
        expiresAt={expiresAt}
        planMinutes={planMinutes}
        autoCharge={autoCharge}
        onChangePlan={onChangePlan}
      />
      <div className="flex flex-col gap-3">
        <span className="caption text-muted-foreground">Використані хвилини</span>
        {isStatsLoading ? (
          <b className="font-heading text-3xl">…</b>
        ) : isStatsError ? (
          <Button variant="link" className="h-auto justify-start p-0" onClick={onRetryStats}>
            Не вдалося завантажити. Спробувати знову
          </Button>
        ) : (
          <>
            <b className="font-heading text-3xl tabular-nums">
              {formatNumber(Math.round(minutesUsed))}{" "}
              <span className="text-muted-foreground text-lg">
                / {formatNumber(minutesLimit)} хв
              </span>
            </b>
            <Progress value={usagePercent} aria-label="Використано хвилин тарифу" />
            <span className="text-muted-foreground text-sm">
              {minutesUsed > 0
                ? `Залишилось ${formatNumber(Math.round(minutesLeft))} хв`
                : "Ще немає дзвінків"}
              {bonusMinutes > 0 && ` · + ${formatNumber(bonusMinutes)} докуплених хвилин`}
            </span>
            <Alert variant="info" className="mt-1">
              <Info aria-hidden="true" />
              <AlertDescription>
                <p>
                  Коли хвилини тарифу закінчаться, агенти дзвонять далі
                  {minutePriceUsd !== undefined &&
                    `, а кожна хвилина коштує ${formatUsd(minutePriceUsd)} і списується з рахунку`}
                </p>
                <Link
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "mt-2")}
                  href="/dashboard/balance"
                >
                  Перейти до балансу
                </Link>
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <span className="caption text-muted-foreground">Середня вартість дзвінка</span>
        {isStatsLoading ? (
          <b className="font-heading text-3xl">…</b>
        ) : (
          <>
            <b className="font-heading text-3xl tabular-nums">
              {avgCallUsd != null ? formatUsd(avgCallUsd) : "—"}
            </b>
            <span className="text-muted-foreground text-sm">
              {totalCalls > 0
                ? "Розраховано за вашим тарифом"
                : "Дані з'являться після першого дзвінка"}
            </span>
            <span className="text-muted-foreground text-sm">за останні {periodDays} днів</span>
          </>
        )}
      </div>
    </Card>
  );
};
