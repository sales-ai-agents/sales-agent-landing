import type { ReactNode } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
import { cn, pluralizeMonths } from "@/lib/utils";
import type { BillingPeriod, BillingPlan } from "@dashboard/types";

interface BillingCycleSelectorProps {
  cycle: BillingPeriod;
  currentPlan?: BillingPlan;
  isTrial: boolean;
  onChange: (cycle: BillingPeriod) => void;
}

const MONTHS_IN_YEAR = 12;

interface CycleOptionProps {
  value: BillingPeriod;
  selected: boolean;
  title: ReactNode;
  children: ReactNode;
}

const CycleOption = ({ value, selected, title, children }: CycleOptionProps) => (
  <label
    className={cn(
      "border-border hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
      selected && "border-primary bg-primary/5"
    )}
  >
    <RadioGroupItem value={value} className="mt-1" />
    <span className="flex flex-col gap-1">
      <b className="flex flex-wrap items-center gap-2 font-medium">{title}</b>
      {children}
    </span>
  </label>
);

export const BillingCycleSelector = ({
  cycle,
  currentPlan,
  isTrial,
  onChange,
}: BillingCycleSelectorProps) => {
  const annualPlan = currentPlan?.year;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Оплата тарифу</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={cycle}
          onValueChange={(value) => onChange(value as BillingPeriod)}
          aria-label="Період оплати"
          className="md:grid-cols-2"
        >
          <CycleOption value="month" selected={cycle === "month"} title="Щомісячна оплата">
            {currentPlan && (
              <>
                <span className="font-heading text-lg tabular-nums">
                  ${currentPlan.price_usd} / місяць
                </span>
                <small className="text-muted-foreground">
                  ${currentPlan.price_usd} щомісяця, без зобов&apos;язань
                </small>
              </>
            )}
          </CycleOption>
          <CycleOption
            value="year"
            selected={cycle === "year"}
            title={
              <>
                Річна оплата
                {annualPlan && annualPlan.months_free > 0 && (
                  <Badge variant="success">
                    Економія {annualPlan.months_free} {pluralizeMonths(annualPlan.months_free)}
                  </Badge>
                )}
              </>
            }
          >
            {annualPlan ? (
              <>
                <span className="font-heading text-lg tabular-nums">
                  ${annualPlan.price_usd} / рік
                </span>
                <small className="text-muted-foreground">
                  ${(annualPlan.price_usd / MONTHS_IN_YEAR).toFixed(1)} / місяць при річній оплаті
                </small>
              </>
            ) : (
              <small className="text-muted-foreground">
                {isTrial
                  ? "Оберіть річний варіант у каталозі тарифів нижче"
                  : "Річна оплата наразі недоступна для цього тарифу"}
              </small>
            )}
          </CycleOption>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
