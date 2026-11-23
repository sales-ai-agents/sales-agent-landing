"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { formatNumber, formatUsd } from "@/lib/utils";
import { useBalance, useStats } from "@dashboard/hooks";
import { ProgressRing } from "./progress-ring";
import { TopUpDialog } from "./top-up-dialog";

const FULL_PERCENT = 100;

export const BalancePill = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { data: balance } = useBalance();
  const { data: stats } = useStats();
  const leftPercent =
    stats && stats.minutes_limit > 0
      ? (stats.minutes_left / stats.minutes_limit) * FULL_PERCENT
      : 0;
  return (
    <>
      <div className="bg-card flex items-center gap-1 rounded-full p-1 pr-1.5 shadow-xs">
        <Link
          href="/dashboard/balance"
          aria-label="Рахунок і хвилини"
          title="Хвилини тарифу"
          className="hover:bg-muted flex items-center gap-2.5 rounded-full py-0.5 pr-3 pl-1 transition-colors"
        >
          <span className="relative grid size-9 place-items-center">
            <ProgressRing percent={leftPercent} className="absolute inset-0 size-9" />
            <Clock className="text-primary size-4" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight tabular-nums">
            <b className="text-sm">{balance ? formatUsd(balance.balance_usd) : "—"}</b>
            <span className="text-muted-foreground text-xs">
              {stats ? `${formatNumber(Math.round(stats.minutes_left))} хв` : "—"}
            </span>
          </span>
        </Link>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          aria-label="Поповнити рахунок"
          onClick={() => setIsTopUpOpen(true)}
        >
          <Plus aria-hidden="true" />
          <span className="hidden sm:inline">Поповнити</span>
        </Button>
      </div>
      {isTopUpOpen && <TopUpDialog onClose={() => setIsTopUpOpen(false)} />}
    </>
  );
};
