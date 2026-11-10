import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { CallLog, Agent } from "@dashboard/types";
import { CallResultCell } from "@/components/dashboard/call-result-cell";
import { formatDuration, formatRelativeTime, maskPhone } from "@/lib/utils";

export interface RecentCallCardProps {
  call: CallLog;
  agents: Agent[];
}

export const RecentCallCard = ({ call, agents }: RecentCallCardProps) => {
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatRelativeTime(call.created_at);

  return (
    <Link
      href={`/dashboard/call-logs/${call.id}`}
      className="border-border hover:bg-muted/30 block space-y-2 border-b px-4 py-3 transition-colors last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{maskPhone(call.phone)}</p>
          <p className="text-muted-foreground truncate text-xs">{agentName}</p>
        </div>
        <span className="text-muted-foreground shrink-0 text-xs">
          {duration} · {time}
        </span>
        <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
      </div>
      <CallResultCell call={call} />
    </Link>
  );
};
