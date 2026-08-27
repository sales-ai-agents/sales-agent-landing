"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Play, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getOutcomeConfig } from "../_lib/utils";
import { formatDuration, cn } from "@/lib/utils";
import type { CallLog, Agent } from "@dashboard/types";

const columnHelper = createColumnHelper<CallLog>();

interface CallLogsTableProps {
  data: CallLog[];
  agents: Agent[];
  pageCount: number;
}

export function CallLogsTable({ data, agents, pageCount }: CallLogsTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("created_at", {
        header: "Дата і час",
        cell: (info) => {
          const dt = new Date(info.getValue());
          return (
            <div className="flex items-center gap-2">
              <Play className="text-muted-foreground size-3" />
              <div className="text-sm">
                <div>{dt.toLocaleDateString("uk-UA")}</div>
                <div className="text-muted-foreground text-xs">
                  {dt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                </div>
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
        header: "Статус / SLA",
        cell: (info) => {
          const config = getOutcomeConfig(info.getValue());
          return <Badge variant={config.variant}>● {config.label}</Badge>;
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
      columnHelper.display({
        id: "crm",
        header: "CRM",
        cell: ({ row }) => {
          const synced = !!row.original.analysis_text;
          return synced ? (
            <span className="text-sm font-medium text-green-600">Синхронізовано</span>
          ) : (
            <span className="text-sm font-medium text-orange-500">Не синхронізовано</span>
          );
        },
        meta: { className: "hidden xl:table-cell" },
      }),
      columnHelper.display({
        id: "actions",
        header: "Дії",
        cell: ({ row }) => (
          <Link href={`/dashboard/call-logs/${row.original.id}`}>
            <ExternalLink className="text-muted-foreground hover:text-foreground size-4" />
          </Link>
        ),
      }),
    ],
    [agents]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-muted/50 border-b">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as { className?: string } | undefined;
                return (
                  <th
                    key={header.id}
                    className={cn("px-4 py-3 text-left font-medium", meta?.className)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-muted-foreground px-4 py-12 text-center">
                Нічого не знайдено за обраними фільтрами
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/20 border-b last:border-0">
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                  return (
                    <td key={cell.id} className={cn("px-4 py-3", meta?.className)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function resolveAgentName(agentId: number | null, agents: Agent[]): string {
  if (!agentId) return "—";
  return agents.find((a) => a.id === agentId)?.name ?? "—";
}
