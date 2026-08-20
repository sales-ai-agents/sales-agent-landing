"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Play, ChevronLeft, ChevronRight, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageError, PageEmpty } from "@/components/dashboard/page-states";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import { CallLogDetailDrawer } from "@/components/dashboard/call-log-detail-drawer";
import { useCallLogs } from "@dashboard/hooks/use-call-logs";
import { getOutcomeConfig, getOutcomeEntries } from "./_lib/utils";
import { formatDuration, cn } from "@/lib/utils";
import type { CallLog } from "@dashboard/types";

const PAGE_SIZE = 8;
const columnHelper = createColumnHelper<CallLog>();

export default function CallLogsPage() {
  const { data, isLoading, error, refetch } = useCallLogs();
  const callLogs = useMemo(() => data?.calls ?? [], [data?.calls]);
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<string | null>(null);

  const filteredData = useMemo((): CallLog[] => {
    if (outcomeFilter === "all") return callLogs;
    return callLogs.filter((log: CallLog) => log.outcome === outcomeFilter);
  }, [outcomeFilter, callLogs]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("company_name", {
        header: "Компанія",
        cell: (info) => (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-muted-foreground text-xs">{info.row.original.phone}</div>
          </div>
        ),
      }),
      columnHelper.accessor("outcome", {
        header: "Результат",
        cell: (info) => {
          const config = getOutcomeConfig(info.getValue());
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      }),
      columnHelper.accessor("analysis_text", {
        header: "AI Підсумок",
        cell: (info) => (
          <p className="text-muted-foreground line-clamp-1 max-w-xs">{info.getValue()}</p>
        ),
        meta: { className: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("niche", {
        header: "Ніша",
        cell: (info) => <span className="text-muted-foreground text-xs">{info.getValue()}</span>,
        meta: { className: "hidden md:table-cell" },
      }),
      columnHelper.accessor("duration_sec", {
        header: "Тривалість",
        cell: (info) => {
          const value = info.getValue();
          const formatted = formatDuration(value);
          if (formatted === "—") return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <button className="text-primary hover:text-primary/80 inline-flex cursor-pointer items-center gap-1">
              <Play className="h-3 w-3" />
              <span className="text-xs">{formatted}</span>
            </button>
          );
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Дата",
        cell: (info) => {
          const dt = new Date(info.getValue());
          return (
            <div className="text-muted-foreground text-xs">
              <div>{dt.toLocaleDateString("uk-UA")}</div>
              <div>{dt.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          );
        },
        meta: { className: "hidden sm:table-cell" },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  if (isLoading) return <TableSkeleton rows={8} />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!callLogs.length)
    return (
      <PageEmpty
        icon={Phone}
        title="Дзвінків ще немає"
        description="Тут з'являться ваші дзвінки після першого виклику"
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Журнал дзвінків</h1>
        <p className="text-muted-foreground">{callLogs.length} всього дзвінків</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={outcomeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setOutcomeFilter("all")}
        >
          Усі ({callLogs.length})
        </Button>
        {getOutcomeEntries().map(([key, config]) => (
          <Button
            key={key}
            variant={outcomeFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setOutcomeFilter(key)}
          >
            {config.label} ({callLogs.filter((log: CallLog) => log.outcome === key).length})
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="bg-muted/50 border-b">
                    {headerGroup.headers.map((header) => {
                      const meta = header.column.columnDef.meta as
                        { className?: string } | undefined;
                      return (
                        <th
                          key={header.id}
                          className={cn("p-3 text-left font-medium", meta?.className)}
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/20 focus-visible:ring-ring cursor-pointer border-b last:border-0 focus-visible:ring-2 focus-visible:outline-none"
                    tabIndex={0}
                    onClick={() => setSelectedLog(row.original.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedLog(row.original.id);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                      return (
                        <td key={cell.id} className={cn("p-3", meta?.className)}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t p-3">
            <p className="text-muted-foreground text-sm">
              Сторінка {table.getState().pagination.pageIndex + 1} з {table.getPageCount()}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Попередня сторінка"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Наступна сторінка"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedLog && (
        <CallLogDetailDrawer callId={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}
