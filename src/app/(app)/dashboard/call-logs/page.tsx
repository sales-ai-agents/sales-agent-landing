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
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CallLogDetailDrawer } from "@/components/dashboard/call-log-detail-drawer";
import { useCallLogs } from "@/hooks/use-call-logs";
import type { CallLog, CallStatus } from "@/types";

const STATUS_CONFIG: Record<
  CallStatus,
  { label: string; variant: "success" | "warning" | "secondary" | "destructive" }
> = {
  completed: { label: "Completed", variant: "success" },
  missed: { label: "Missed", variant: "warning" },
  transferred: { label: "Transferred", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

const PAGE_SIZE = 8;
const columnHelper = createColumnHelper<CallLog>();

export default function CallLogsPage() {
  const { data: callLogs = [] } = useCallLogs();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  const filteredData = useMemo((): CallLog[] => {
    if (statusFilter === "all") return callLogs;
    return callLogs.filter((log: CallLog) => log.status === statusFilter);
  }, [statusFilter, callLogs]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("customerName", {
        header: "Customer",
        cell: (info) => (
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-muted-foreground text-xs">{info.row.original.phone}</div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const config = STATUS_CONFIG[info.getValue()];
          return <Badge variant={config.variant}>{config.label}</Badge>;
        },
      }),
      columnHelper.accessor("summary", {
        header: "AI Summary",
        cell: (info) => (
          <p className="text-muted-foreground line-clamp-1 max-w-xs">{info.getValue()}</p>
        ),
        meta: { className: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("agentName", {
        header: "Agent",
        cell: (info) => <span className="text-muted-foreground text-xs">{info.getValue()}</span>,
        meta: { className: "hidden md:table-cell" },
      }),
      columnHelper.accessor("duration", {
        header: "Audio",
        cell: (info) => {
          const value = info.getValue();
          if (value === "—") return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <button className="text-primary hover:text-primary/80 inline-flex items-center gap-1">
              <Play className="h-3 w-3" />
              <span className="text-xs">{value}</span>
            </button>
          );
        },
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <div className="text-muted-foreground text-xs">
            <div>{info.getValue()}</div>
            <div>{info.row.original.time}</div>
          </div>
        ),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Call Logs</h1>
        <p className="text-muted-foreground">{callLogs.length} total calls</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All ({callLogs.length})
        </Button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <Button
            key={key}
            variant={statusFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(key)}
          >
            {config.label} ({callLogs.filter((log: CallLog) => log.status === key).length})
          </Button>
        ))}
      </div>

      {/* Table */}
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
                          className={`p-3 text-left font-medium ${meta?.className ?? ""}`}
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
                    className="hover:bg-muted/20 cursor-pointer border-b last:border-0"
                    onClick={() => setSelectedLog(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                      return (
                        <td key={cell.id} className={`p-3 ${meta?.className ?? ""}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t p-3">
            <p className="text-muted-foreground text-sm">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Drawer */}
      {selectedLog && (
        <CallLogDetailDrawer callLog={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
}
