"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui";
import type { CallLog, Agent } from "@dashboard/types";
import { CallResultCell } from "@/components/dashboard/call-result-cell";
import { formatDuration, formatRelativeTime, maskPhone } from "@/lib/utils";

export interface RecentCallRowProps {
  call: CallLog;
  agents: Agent[];
}

export const RecentCallRow = ({ call, agents }: RecentCallRowProps) => {
  const router = useRouter();
  const agentName = agents.find((a) => a.id === call.agent_id)?.name ?? "—";
  const duration = call.duration_sec ? formatDuration(call.duration_sec) : "—";
  const time = formatRelativeTime(call.created_at);

  const navigate = (): void => {
    router.push(`/dashboard/call-logs/${call.id}`);
  };

  return (
    <TableRow
      className="cursor-pointer"
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label={`Деталі дзвінка ${maskPhone(call.phone)}`}
    >
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">
        {maskPhone(call.phone)}
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{agentName}</TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{duration}</TableCell>
      <TableCell className="px-4 py-2.5">
        <CallResultCell call={call} />
      </TableCell>
      <TableCell className="text-muted-foreground px-4 py-2.5 text-sm">{time}</TableCell>
      <TableCell className="px-2 py-2.5">
        <ChevronRight className="text-muted-foreground h-4 w-4" />
      </TableCell>
    </TableRow>
  );
};
