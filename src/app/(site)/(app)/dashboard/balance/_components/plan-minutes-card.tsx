import { VoiceWave } from "@/components/dashboard";
import { Card } from "@/components/ui";
import { formatNumber, formatUsd } from "@/lib/utils";

const WAVE_BARS_HERO = 40;

interface PlanMinutesCardProps {
  minutesLeft: number | null;
  minutesLimit: number | null;
  fraction: number;
  minutePriceUsd: number;
  runway: string;
}

export const PlanMinutesCard = ({
  minutesLeft,
  minutesLimit,
  fraction,
  minutePriceUsd,
  runway,
}: PlanMinutesCardProps) => (
  <Card className="flex flex-col gap-4 p-8">
    <span className="caption text-muted-foreground">Хвилини тарифу</span>
    <div className="flex items-baseline gap-2">
      <b className="font-heading text-6xl tabular-nums">
        {minutesLeft === null ? "—" : formatNumber(Math.round(minutesLeft))}
      </b>
      <span className="text-muted-foreground">
        {minutesLimit === null ? "" : `/ ${formatNumber(minutesLimit)} хв`}
      </span>
    </div>
    <VoiceWave fraction={fraction} bars={WAVE_BARS_HERO} className="h-12" />
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Коли закінчаться</span>
        <b className="tabular-nums">{formatUsd(minutePriceUsd)} / хв з рахунку</b>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground">Вистачить ще на</span>
        <b>{runway}</b>
      </div>
    </div>
  </Card>
);
