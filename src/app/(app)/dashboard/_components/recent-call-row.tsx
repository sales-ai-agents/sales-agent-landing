import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { CallLog, Agent } from "@dashboard/types";
import { getOutcomeDisplay } from "@/app/(app)/_lib/call-outcome-display";
import { formatDuration, formatTime, maskPhone } from "@/lib/utils";

export interface RecentCallRowProps {
  call: CallLog;
  agents: Agent[];
}

export function RecentCallRow({ call, agents }: RecentCallRowProps) {
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatTime(call.created_at);
  const { label, badgeClass, icon } = getOutcomeDisplay(call);

  return (
    <tr className="hover:bg-muted/30 border-b last:border-0">
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{maskPhone(call.phone)}</td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{agentName}</td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{duration}</td>
      <td className="px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-sm ${badgeClass}`}
        >
          <span>{icon}</span>
          {label}
        </span>
      </td>
      <td className="text-muted-foreground px-4 py-2.5 text-sm">{time}</td>
      <td className="px-2 py-2.5">
        <Link href={`/dashboard/call-logs/${call.id}`}>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}
