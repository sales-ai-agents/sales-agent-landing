import {
  Blocks,
  Bot,
  Check,
  Clock,
  FileSpreadsheet,
  Headset,
  Link2,
  Minus,
  Phone,
  ScrollText,
  Wallet,
  Webhook,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPlanComparisonRows } from "@dashboard/billing";
import type { PlanComparisonIcon, PlanComparisonValue } from "@dashboard/billing";
import type { BillingPlan } from "@dashboard/types";

interface PlanComparisonProps {
  currentPlan: BillingPlan | undefined;
  newPlan: BillingPlan;
  isSamePlan: boolean;
}

type ValueTone = "current" | "next";

const ROW_ICONS: Record<PlanComparisonIcon, LucideIcon> = {
  minutes: Clock,
  agents: Bot,
  phoneNumbers: Phone,
  startingBalance: Wallet,
  callLog: ScrollText,
  csvCampaigns: FileSpreadsheet,
  webhooks: Webhook,
  integrations: Blocks,
  support: Headset,
  businessProcess: Link2,
};

interface ComparisonValueProps {
  value: PlanComparisonValue;
  tone: ValueTone;
}

const ComparisonValue = ({ value, tone }: ComparisonValueProps) => {
  const isNext = tone === "next";
  const iconClassName = cn("h-4 w-4", isNext ? "text-primary" : "text-muted-foreground");

  if (value.included !== undefined) {
    return value.included ? (
      <Check className={iconClassName} />
    ) : (
      <Minus className="text-muted-foreground h-4 w-4" />
    );
  }

  if (!value.text) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  return (
    <span className={cn("text-sm", isNext ? "text-primary font-medium" : "text-muted-foreground")}>
      {value.text}
    </span>
  );
};

export const PlanComparison = ({ currentPlan, newPlan, isSamePlan }: PlanComparisonProps) => {
  const showCurrent = !!currentPlan && !isSamePlan;
  const rows = getPlanComparisonRows(currentPlan, newPlan);

  return (
    <div className="border-border overflow-hidden rounded-xl border">
      {rows.map((row, index) => {
        const Icon = ROW_ICONS[row.icon];
        const isLast = index === rows.length - 1;

        return (
          <div
            key={row.key}
            className={cn(
              "grid items-center gap-x-4 px-4 py-3",
              showCurrent ? "grid-cols-[1fr_auto_auto]" : "grid-cols-[1fr_auto]",
              !isLast && "border-b"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
              <span className="text-sm">{row.label}</span>
            </div>

            {showCurrent && (
              <div className="flex justify-end sm:min-w-28">
                <ComparisonValue value={row.current} tone="current" />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 sm:min-w-28">
              <ComparisonValue value={row.next} tone="next" />
              {showCurrent && row.diff && (
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                  {row.diff}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
