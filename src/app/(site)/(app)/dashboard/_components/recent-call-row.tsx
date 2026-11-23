"use client";

import { useRouter } from "next/navigation";

import { ArrowRight } from "lucide-react";
import { VoiceWave } from "@/components/dashboard";
import { CallResultCell } from "@/components/dashboard/call-result-cell";
import { TableCell, TableRow } from "@/components/ui";
import { formatDuration, formatRelativeTime, maskPhone } from "@/lib/utils";
import type { CallLog, Agent } from "@dashboard/types";

const WAVE_BARS = 14;
const LONG_CALL_SEC = 330;

export interface RecentCallRowProps {
  call: CallLog;
  agents: Agent[];
}

export const RecentCallRow = ({ call, agents }: RecentCallRowProps) => {
  const router = useRouter();
  const agentName = agents.find((agent) => agent.id === call.agent_id)?.name ?? "—";
  const durationSec = call.duration_sec ?? 0;

  const navigate = (): void => router.push(`/dashboard/call-logs/${call.id}`);

  return (
    <TableRow
      className="cursor-pointer"
      tabIndex={0}
      role="link"
      aria-label={`Деталі дзвінка ${maskPhone(call.phone)}`}
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        navigate();
      }}
    >
      <TableCell className="font-mono font-medium tabular-nums">{maskPhone(call.phone)}</TableCell>
      <TableCell>{agentName}</TableCell>
      <TableCell className="font-mono tabular-nums">
        <span className="flex items-center gap-3">
          <VoiceWave
            fraction={Math.min(1, durationSec / LONG_CALL_SEC)}
            bars={WAVE_BARS}
            className="h-5 w-20"
          />
          {durationSec ? formatDuration(durationSec) : "—"}
        </span>
      </TableCell>
      <TableCell>
        <CallResultCell call={call} />
      </TableCell>
      <TableCell className="text-muted-foreground font-mono tabular-nums">
        {formatRelativeTime(call.created_at)}
      </TableCell>
      <TableCell>
        <ArrowRight className="text-muted-foreground size-4" aria-hidden="true" />
      </TableCell>
    </TableRow>
  );
};
