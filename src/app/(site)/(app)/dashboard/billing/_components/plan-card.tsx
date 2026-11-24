import { Bot, ChartColumn, Check, Clock, Phone, type LucideIcon } from "lucide-react";
import { VoiceWave } from "@/components/dashboard";
import { Badge, Button, Card } from "@/components/ui";
import { cn, formatNumber, formatUsd } from "@/lib/utils";
import { getPlanFeatures } from "@dashboard/billing";
import type { BillingPlan } from "@dashboard/types";

interface PlanCardProps {
  plan: BillingPlan;
  isCurrent: boolean;
  cycle?: "month" | "year";
  maxMinutes: number;
  onSelect: () => void;
}

const PLAN_ICONS: Record<string, LucideIcon> = {
  trial: Clock,
  start: Phone,
  pro: ChartColumn,
  pro_plus: Bot,
};

const WAVE_BARS = 30;
const MONTHS_IN_YEAR = 12;

const resolveWaveFraction = (minutes: number, maxMinutes: number): number => {
  if (minutes <= 1 || maxMinutes <= 1) return 0;
  return Math.log10(minutes) / Math.log10(maxMinutes);
};

interface PlanActionProps {
  isPro: boolean;
  isCurrent: boolean;
  isComingSoon: boolean;
  onSelect: () => void;
}

const PlanAction = ({ isPro, isCurrent, isComingSoon, onSelect }: PlanActionProps) => {
  if (isComingSoon || isCurrent) {
    return (
      <Button variant="outline" disabled>
        {isComingSoon ? "Незабаром" : "Поточний тариф"}
      </Button>
    );
  }
  return (
    <Button variant={isPro ? "default" : "outline"} onClick={onSelect}>
      {isPro ? "Перейти на PRO" : "Обрати"}
    </Button>
  );
};

export const PlanCard = ({
  plan,
  isCurrent,
  cycle = "month",
  maxMinutes,
  onSelect,
}: PlanCardProps) => {
  const isComingSoon = plan.coming_soon === true;
  const isAnnual = cycle === "year" && !!plan.year && !isComingSoon;
  const displayPriceUsd = isAnnual ? plan.year!.price_usd : plan.price_usd;
  const features = getPlanFeatures(plan);
  const Icon = PLAN_ICONS[plan.key] ?? ChartColumn;

  return (
    <Card className={cn("flex flex-1 flex-col gap-4 p-6", isCurrent && "ring-primary ring-2")}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="bg-primary/10 text-primary grid size-10 place-items-center rounded-full">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <b className="font-heading flex-1 text-xl">{plan.title}</b>
        {isCurrent && <Badge variant="secondary">Поточний</Badge>}
        {isComingSoon && <Badge variant="muted">Незабаром</Badge>}
        {isAnnual && plan.year && plan.year.months_free > 0 && (
          <Badge variant="success">Економія {plan.year.months_free} міс</Badge>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <b className="font-heading text-4xl tabular-nums">${formatNumber(displayPriceUsd)}</b>
        <span className="text-muted-foreground">{isAnnual ? "/ рік" : "/ місяць"}</span>
      </div>
      {isAnnual && plan.year && (
        <p className="text-muted-foreground text-xs">
          {formatUsd(displayPriceUsd / MONTHS_IN_YEAR)} / міс
          {plan.year.saving_usd > 0 ? ` · економія ${formatUsd(plan.year.saving_usd)}` : ""}
        </p>
      )}
      {cycle === "year" && !plan.year && !isComingSoon && (
        <p className="text-muted-foreground text-xs">Річний період недоступний для цього тарифу</p>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Хвилини розмов</span>
          <b className="tabular-nums">{formatNumber(plan.minutes)} хв</b>
        </div>
        <VoiceWave fraction={resolveWaveFraction(plan.minutes, maxMinutes)} bars={WAVE_BARS} />
      </div>
      <PlanAction
        isPro={plan.key === "pro"}
        isCurrent={isCurrent}
        isComingSoon={isComingSoon}
        onSelect={onSelect}
      />
      <ul className="flex flex-col gap-2 text-sm">
        {features.map((feature, index) => (
          <li key={feature} className={cn("flex items-start gap-2", index === 0 && "font-medium")}>
            <Check
              className="text-primary bg-primary/20 mt-0.5 size-4 shrink-0 rounded-full p-1"
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
};
