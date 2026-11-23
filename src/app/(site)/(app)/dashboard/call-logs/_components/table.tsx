"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent } from "react";
import { ExternalLink } from "lucide-react";
import { VoiceWave } from "@/components/dashboard";
import { CallResultCell } from "@/components/dashboard/call-result-cell";
import {
  Checkbox,
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useAccountTimeZone } from "@/lib/hooks";
import { formatDateShort, formatDuration, formatTime } from "@/lib/utils";
import type { Agent, CallLog } from "@dashboard/types";
import { formatBilledMinutes, resolveAgentName } from "../_lib/utils";
import { CrmSyncBadge } from "./crm-sync-badge";
import { SlaIndicator } from "./sla-indicator";

const WAVE_BARS = 14;
const LONG_CALL_SEC = 330;

interface TableProps {
  data: CallLog[];
  agents: Agent[];
  showSla: boolean;
  showCrm: boolean;
  selectedIds: ReadonlySet<string>;
  onToggleOne: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
}

const stopRowNavigation = (event: MouseEvent | KeyboardEvent): void => event.stopPropagation();

interface CallRowProps {
  call: CallLog;
  agents: Agent[];
  showSla: boolean;
  showCrm: boolean;
  isSelected: boolean;
  timeZone: string | undefined;
  onToggle: (id: string) => void;
}

const CallRow = ({
  call,
  agents,
  showSla,
  showCrm,
  isSelected,
  timeZone,
  onToggle,
}: CallRowProps) => {
  const router = useRouter();
  const navigate = (): void => router.push(`/dashboard/call-logs/${call.id}`);
  const durationSec = call.duration_sec ?? 0;
  return (
    <TableRow
      className="cursor-pointer"
      data-state={isSelected ? "selected" : undefined}
      tabIndex={0}
      role="link"
      aria-label={`Деталі дзвінка ${call.phone}`}
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        navigate();
      }}
    >
      <TableCell onClick={stopRowNavigation} onKeyDown={stopRowNavigation}>
        <Checkbox
          aria-label="Обрати дзвінок"
          checked={isSelected}
          onCheckedChange={() => onToggle(call.id)}
        />
      </TableCell>
      <TableCell className="tabular-nums">
        <div className="font-medium">{formatDateShort(call.created_at, timeZone)}</div>
        <div className="text-muted-foreground text-xs">{formatTime(call.created_at, timeZone)}</div>
      </TableCell>
      <TableCell className="tabular-nums">{call.phone}</TableCell>
      <TableCell className="max-w-44 truncate">{resolveAgentName(call.agent_id, agents)}</TableCell>
      <TableCell>
        <CallResultCell call={call} />
      </TableCell>
      {showSla && (
        <TableCell>
          <SlaIndicator state={call.sla_state} minutesLeft={call.sla_minutes_left} />
        </TableCell>
      )}
      <TableCell className="tabular-nums">
        <span className="flex items-center gap-2">
          <VoiceWave
            fraction={Math.min(1, durationSec / LONG_CALL_SEC)}
            bars={WAVE_BARS}
            className="h-5 w-16 flex-none"
          />
          {durationSec ? formatDuration(durationSec) : "—"}
        </span>
      </TableCell>
      <TableCell className="tabular-nums">{formatBilledMinutes(call.billed_sec)}</TableCell>
      {showCrm && (
        <TableCell>
          <CrmSyncBadge state={call.crm_sync_state} />
        </TableCell>
      )}
      <TableCell>
        <ExternalLink className="text-muted-foreground size-4" aria-hidden="true" />
      </TableCell>
    </TableRow>
  );
};

export const Table = ({
  data,
  agents,
  showSla,
  showCrm,
  selectedIds,
  onToggleOne,
  onToggleAll,
}: TableProps) => {
  const timeZone = useAccountTimeZone();
  const pageIds = data.map((call) => call.id);
  const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const columnCount = 8 + Number(showSla) + Number(showCrm);
  return (
    <UiTable className="min-w-245">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Обрати всі дзвінки на сторінці"
              checked={isAllSelected}
              onCheckedChange={() => onToggleAll(pageIds)}
            />
          </TableHead>
          <TableHead>Дата і час</TableHead>
          <TableHead>Номер телефону</TableHead>
          <TableHead>Агент</TableHead>
          <TableHead>Результат</TableHead>
          {showSla && <TableHead>SLA</TableHead>}
          <TableHead>Тривалість</TableHead>
          <TableHead>Витрачено хв</TableHead>
          {showCrm && <TableHead>CRM</TableHead>}
          <TableHead>Дії</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 && (
          <TableRow>
            <TableCell colSpan={columnCount} className="text-muted-foreground py-12 text-center">
              Нічого не знайдено за обраними фільтрами
            </TableCell>
          </TableRow>
        )}
        {data.map((call) => (
          <CallRow
            key={call.id}
            call={call}
            agents={agents}
            showSla={showSla}
            showCrm={showCrm}
            isSelected={selectedIds.has(call.id)}
            timeZone={timeZone}
            onToggle={onToggleOne}
          />
        ))}
      </TableBody>
    </UiTable>
  );
};
