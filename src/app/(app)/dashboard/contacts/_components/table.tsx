"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { ArrowUpDown, Trash2 } from "lucide-react";

import { Button, Switch } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Contact } from "@dashboard/types";
import { getTagColor, formatConsentLabel, formatLastCallResult } from "../_lib/utils";

const columnHelper = createColumnHelper<Contact>();

const PAGE_SIZE = 12;

interface TableProps {
  data: Contact[];
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onDelete: (id: number) => void;
  onToggleDoNotCall: (id: number, current: boolean) => void;
}

export const Table = ({
  data,
  globalFilter,
  onGlobalFilterChange,
  sorting,
  onSortingChange,
  onDelete,
  onToggleDoNotCall,
}: TableProps) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Ім&apos;я
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("phone", {
        header: "Телефон",
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("tags", {
        header: "Теги",
        cell: (info) => {
          const tags = info.getValue() ?? [];
          if (tags.length === 0) return <span className="text-muted-foreground">—</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => {
                const color = getTagColor(tag);
                return (
                  <span
                    key={tag}
                    className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-normal",
                      color.bg,
                      color.text
                    )}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor("consent", {
        header: "Згода",
        cell: (info) => {
          const value = info.getValue();
          if (value === "") return <span className="text-muted-foreground">—</span>;
          const { label, color, dot } = formatConsentLabel(value);
          return (
            <span className={cn("inline-flex items-center gap-1.5 text-xs", color)}>
              <span className={cn("inline-block h-1.5 w-1.5 rounded-full", dot)} />
              {label}
            </span>
          );
        },
        enableSorting: false,
        meta: { className: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("last_call_at", {
        header: "Остання дія",
        cell: (info) => {
          const date = info.getValue();
          const result = info.row.original.last_call_result;
          if (!date) return <span className="text-muted-foreground">—</span>;
          const formatted = new Date(date).toLocaleDateString("uk-UA");
          const resultLabel = formatLastCallResult(result);
          return (
            <div className="text-xs leading-relaxed">
              <p>{formatted}</p>
              {resultLabel && <p className="text-muted-foreground">{resultLabel}</p>}
            </div>
          );
        },
        meta: { className: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("do_not_call", {
        header: "Не дзвонити",
        cell: (info) => (
          <Switch
            checked={info.getValue()}
            onCheckedChange={() => onToggleDoNotCall(info.row.original.id, info.getValue())}
            aria-label="Не дзвонити"
          />
        ),
        enableSorting: false,
        meta: { className: "hidden md:table-cell" },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="sr-only">Дії</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600"
              onClick={() => onDelete(row.original.id)}
              aria-label="Видалити контакт"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ),
      }),
    ],
    [onDelete, onToggleDoNotCall]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  return (
    <>
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-muted-foreground px-4 py-12 text-center"
                >
                  Нічого не знайдено
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
    </>
  );
};
