import { Circle } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ACTION_REQUIRED_LABEL } from "@dashboard/call-result";
import { getOutcomeConfig } from "@dashboard/call-outcome";
import type { CallLog } from "@dashboard/types";
import { CallResultIcon } from "./call-result-icon";

interface CallResultCellProps {
  call: CallLog;
}

const IN_PROGRESS_LABEL = "Йде розмова...";
const UNSEEN_LABEL = "Не переглянуто";

export const CallResultCell = ({ call }: CallResultCellProps) => {
  const { result } = call;

  if (!result) {
    return call.ended_at === null ? <InProgress /> : <OutcomeBadge outcome={call.outcome} />;
  }

  const isUnseenAction = result.action_required && call.result_seen === false;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <CallResultIcon type={result.type} />
      <div className="min-w-0 space-y-0.5">
        <p
          className={cn("truncate text-sm", isUnseenAction && "font-semibold")}
          title={result.title}
        >
          {result.title}
        </p>
        {result.action_required && <Badge variant="warning">{ACTION_REQUIRED_LABEL}</Badge>}
      </div>
      {isUnseenAction && (
        <span className="bg-primary ml-auto h-2 w-2 shrink-0 rounded-full">
          <span className="sr-only">{UNSEEN_LABEL}</span>
        </span>
      )}
    </div>
  );
};

const InProgress = () => (
  <div className="text-muted-foreground flex items-center gap-3 text-sm">
    <span className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
      <Circle className="h-3 w-3" aria-hidden="true" />
    </span>
    {IN_PROGRESS_LABEL}
  </div>
);

const OutcomeBadge = ({ outcome }: { outcome: CallLog["outcome"] }) => {
  const { label, variant } = getOutcomeConfig(outcome);

  return (
    <Badge variant={variant} className="w-fit">
      ● {label}
    </Badge>
  );
};
