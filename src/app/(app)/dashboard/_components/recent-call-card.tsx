import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { CallLog, Agent } from "@dashboard/types";
import { getOutcomeDisplay } from "@/app/(app)/_lib/call-outcome";
import { formatDuration, formatTime, maskPhone } from "@/lib/utils";

export interface RecentCallCardProps {
  call: CallLog;
  agents: Agent[];
}

export const RecentCallCard = ({ call, agents }: RecentCallCardProps) => {
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatTime(call.created_at);
  const { label, badgeClass, icon } = getOutcomeDisplay(call);

  return (
    <Link
      href={`/dashboard/call-logs/${call.id}`}
      className="border-border hover:bg-muted/30 flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-0"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{maskPhone(call.phone)}</p>
        <p className="text-muted-foreground truncate text-xs">{agentName}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs ${badgeClass}`}
        >
          <span>{icon}</span>
          {label}
        </span>
        <span className="text-muted-foreground text-xs">
          {duration} · {time}
        </span>
      </div>
      <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
    </Link>
  );
};
