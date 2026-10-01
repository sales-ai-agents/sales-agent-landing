import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui";
import type { CallLog, Agent } from "@dashboard/types";
import { getOutcomeDisplay } from "@/app/(app)/_lib/call-outcome";
import { formatDuration, formatTime, maskPhone } from "@/lib/utils";

export interface RecentCallRowProps {
  call: CallLog;
  agents: Agent[];
}

export const RecentCallRow = ({ call, agents }: RecentCallRowProps) => {
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatTime(call.created_at);
  const { label, badgeClass, icon } = getOutcomeDisplay(call);

  return (
    <TableRow>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">
        {maskPhone(call.phone)}
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{agentName}</TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{duration}</TableCell>
      <TableCell className="px-4 py-2.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-sm ${badgeClass}`}
        >
          <span>{icon}</span>
          {label}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{time}</TableCell>
      <TableCell className="px-2 py-2.5">
        <Link href={`/dashboard/call-logs/${call.id}`}>
          <ChevronRight className="text-muted-foreground h-4 w-4" />
        </Link>
      </TableCell>
    </TableRow>
  );
};
