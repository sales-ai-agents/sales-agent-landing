"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";

import {
  Badge,
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { getOutcomeConfig } from "@/app/(app)/_lib/call-outcome";
import { formatDuration, formatSlaMinutes, formatDateShort, formatTime, cn } from "@/lib/utils";
import type { CallLog, Agent, SlaState } from "@dashboard/types";
import { resolveAgentName } from "../_lib/utils";

const columnHelper = createColumnHelper<CallLog>();

interface TableProps {
  data: CallLog[];
  agents: Agent[];
  pageCount: number;
  slaMinutes?: number;
}

const SlaIndicator = ({
  state,
  minutesLeft,
}: {
  state: SlaState | null;
  minutesLeft: number | null;
}) => {
  if (!state) return null;

  switch (state) {
    case "breached": {
      const overdue = minutesLeft !== null ? formatSlaMinutes(minutesLeft) : "0 хв";
      return <span className="text-destructive text-xs font-medium">⊘ Прострочено {overdue}</span>;
    }
    case "ok": {
      const left = minutesLeft !== null ? formatSlaMinutes(minutesLeft) : "0 хв";
      return <span className="text-warning text-xs font-medium">⊘ Залишилось {left}</span>;
    }
    case "handled":
      return null;
    default:
      return null;
  }
};

interface CallCardProps {
  call: CallLog;
  agents: Agent[];
  showSla: boolean;
}

const CallCard = ({ call, agents, showSla }: CallCardProps) => {
  const config = getOutcomeConfig(call.outcome);
  const agentName = resolveAgentName(call.agent_id, agents);
  const minutes = call.duration_sec ? `${(call.duration_sec / 60).toFixed(1)} хв` : "—";

  return (
    <Link
      href={`/dashboard/call-logs/${call.id}`}
      className="border-border hover:bg-muted/30 block border-b p-4 transition-colors last:border-0"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{call.phone}</p>
          <p className="text-muted-foreground truncate text-xs">{agentName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant={config.variant} className="w-fit">
            ● {config.label}
          </Badge>
          {showSla && <SlaIndicator state={call.sla_state} minutesLeft={call.sla_minutes_left} />}
        </div>
      </div>
      <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span>
          {formatDateShort(call.created_at)} {formatTime(call.created_at)}
        </span>
        <span>Тривалість: {call.duration_sec ? formatDuration(call.duration_sec) : "—"}</span>
        <span>Витрачено: {minutes}</span>
      </div>
    </Link>
  );
};

export const Table = ({ data, agents, pageCount, slaMinutes }: TableProps) => {
  const router = useRouter();
  const showSla = slaMinutes !== undefined ? slaMinutes > 0 : true;

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor("created_at", {
        header: "Дата і час",
        cell: (info) => {
          const value = info.getValue();
          return (
            <div className="text-sm">
              <div>{formatDateShort(value)}</div>
              <div className="text-muted-foreground text-xs">{formatTime(value)}</div>
            </div>
          );
        },
      }),
      columnHelper.accessor("phone", {
        header: "Номер телефону",
        cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "agent",
        header: "Агент",
        cell: ({ row }) => {
          const name = resolveAgentName(row.original.agent_id, agents);
          return <span className="text-muted-foreground text-sm">{name}</span>;
        },
      }),
      columnHelper.accessor("outcome", {
        header: showSla ? "Статус / SLA" : "Статус",
        cell: ({ row }) => {
          const config = getOutcomeConfig(row.original.outcome);
          return (
            <div className="flex flex-col gap-0.5">
              <Badge variant={config.variant} className="w-fit">
                ● {config.label}
              </Badge>
              {showSla && (
                <SlaIndicator
                  state={row.original.sla_state}
                  minutesLeft={row.original.sla_minutes_left}
                />
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("duration_sec", {
        header: "Тривалість",
        cell: (info) => {
          const sec = info.getValue();
          return <span className="text-sm">{sec ? formatDuration(sec) : "—"}</span>;
        },
      }),
      columnHelper.display({
        id: "minutes",
        header: "Витрачено хв",
        cell: ({ row }) => {
          const sec = row.original.duration_sec;
          if (!sec) return <span className="text-muted-foreground text-sm">—</span>;
          return <span className="text-sm">{(sec / 60).toFixed(1)} хв</span>;
        },
        meta: { className: "hidden lg:table-cell" },
      }),
    ];

    cols.push(
      columnHelper.display({
        id: "actions",
        header: "",
        cell: () => <ChevronRight className="text-muted-foreground size-4" />,
      })
    );

    return cols;
  }, [agents, showSla]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className="sm:hidden">
        {data.length === 0 ? (
          <p className="text-muted-foreground px-4 py-12 text-center text-sm">
            Нічого не знайдено за обраними фільтрами
          </p>
        ) : (
          data.map((call) => (
            <CallCard key={call.id} call={call} agents={agents} showSla={showSla} />
          ))
        )}
      </div>
      <div className="hidden sm:block">
        <UiTable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as { className?: string } | undefined;
                  return (
                    <TableHead key={header.id} className={cn("px-4", meta?.className)}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground px-4 py-12 text-center"
                >
                  Нічого не знайдено за обраними фільтрами
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => {
                const navigate = (): void => {
                  router.push(`/dashboard/call-logs/${row.original.id}`);
                };

                return (
                  <TableRow
                    key={row.id}
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
                    aria-label={`Деталі дзвінка ${row.original.phone}`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                      return (
                        <TableCell key={cell.id} className={cn("px-4 py-3", meta?.className)}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </UiTable>
      </div>
    </div>
  );
};
