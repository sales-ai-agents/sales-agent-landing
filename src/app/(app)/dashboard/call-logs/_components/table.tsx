"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";

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
import { formatDuration, formatSlaMinutes, cn } from "@/lib/utils";
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

export const Table = ({ data, agents, pageCount, slaMinutes }: TableProps) => {
  const showSla = slaMinutes !== undefined ? slaMinutes > 0 : true;

  const columns = useMemo(() => {
    const cols = [
      columnHelper.accessor("created_at", {
        header: "Дата і час",
        cell: (info) => {
          const dt = new Date(info.getValue());
          return (
            <div className="text-sm">
              <div>{dt.toLocaleDateString("uk-UA")}</div>
              <div className="text-muted-foreground text-xs">
                {dt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
              </div>
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
        header: "Дії",
        cell: ({ row }) => (
          <Link href={`/dashboard/call-logs/${row.original.id}`}>
            <ExternalLink className="text-muted-foreground hover:text-foreground size-4" />
          </Link>
        ),
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
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                  return (
                    <TableCell key={cell.id} className={cn("px-4 py-3", meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </UiTable>
    </div>
  );
};
