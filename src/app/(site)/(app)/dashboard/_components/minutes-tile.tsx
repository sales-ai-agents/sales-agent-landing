import Link from "next/link";
import { Clock } from "lucide-react";
import { VoiceWave } from "@/components/dashboard";
import { Card } from "@/components/ui";
import { formatNumber, formatUsd } from "@/lib/utils";
import type { BalanceResponse, StatsResponse } from "@dashboard/types";
const WAVE_BARS = 36;
interface MinutesTileProps {
  stats: StatsResponse;
  balance: BalanceResponse | undefined;
}
export const MinutesTile = ({ stats, balance }: MinutesTileProps) => {
  const usedFraction = stats.minutes_limit > 0 ? stats.minutes_used / stats.minutes_limit : 0;
  const isExhausted = stats.minutes_left <= 0;
  const runway =
    stats.minutes_runway_days === null ? "—" : `~${Math.round(stats.minutes_runway_days)} днів`;
  return (
    <Card className="from-card to-primary/50 flex flex-col gap-2 bg-linear-to-br p-6">
      <div className="flex items-center gap-2">
        <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-xl">
          <Clock className="size-5" aria-hidden="true" />
        </span>
        <span className="caption text-muted-foreground">Використання хвилин</span>
      </div>
      <div className="font-heading text-4xl tabular-nums">
        {formatNumber(Math.round(stats.minutes_used))}{" "}
        <small className="text-muted-foreground text-base">
          / {formatNumber(stats.minutes_limit)} хв
        </small>
      </div>
      <VoiceWave fraction={usedFraction} bars={WAVE_BARS} />
      <span className="text-muted-foreground text-sm">
        Залишилось {formatNumber(Math.round(stats.minutes_left))} хв{stats.trial ? " у Trial" : ""}
        <br />
        {isExhausted && balance
          ? `Далі ${formatUsd(balance.minute_price_usd)} за хвилину з рахунку`
          : `Вистачить ще на ${runway}`}
      </span>
      <Link className="text-primary text-sm font-medium hover:underline" href="/dashboard/balance">
        Поповнити рахунок →
      </Link>
    </Card>
  );
};
