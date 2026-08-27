"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  Plus,
  Search,
  Upload,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/dashboard/page-states";
import { AddContactDialog } from "@/components/dashboard/add-contact-dialog";
import { UploadCsvDialog } from "@/components/dashboard/upload-csv-dialog";
import { useContacts, useCreateContact, useDeleteContact } from "@dashboard/hooks/use-contacts";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage } from "@/lib/error-messages";
import { cn, formatNumber, getPageIndex } from "@/lib/utils";
import type { ContactFormData } from "@/lib/schemas";
import type { Contact } from "@dashboard/types";

const PAGE_SIZE = 12;
const columnHelper = createColumnHelper<Contact>();

export default function ContactsPage() {
  const { data: contacts = [], isLoading, error, refetch } = useContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleAddContact = (data: ContactFormData): void => {
    createContact.mutate(data, {
      onSuccess: () => {
        toast.success("Контакт додано");
        setShowAddDialog(false);
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(resolveErrorMessage(err.code));
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  };

  const handleDeleteContact = useCallback(
    (id: number) => {
      deleteContact.mutate(id, {
        onSuccess: () => toast.success("Контакт видалено"),
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(resolveErrorMessage(err.code));
          } else {
            toast.error("Щось пішло не так.");
          }
        },
      });
    },
    [deleteContact]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <button
            className="flex cursor-pointer items-center gap-1 font-medium"
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
      columnHelper.accessor("email", {
        header: "Пошта",
        cell: (info) => <span className="text-muted-foreground">{info.getValue() || "—"}</span>,
        meta: { className: "hidden md:table-cell" },
      }),
      columnHelper.accessor("created_at", {
        header: ({ column }) => (
          <button
            className="flex cursor-pointer items-center gap-1 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Додано
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-muted-foreground">
            {new Date(info.getValue()).toLocaleDateString("uk-UA")}
          </span>
        ),
        meta: { className: "hidden sm:table-cell" },
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
              onClick={() => handleDeleteContact(row.original.id)}
              aria-label="Видалити контакт"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ),
      }),
    ],
    [handleDeleteContact]
  );

  const table = useReactTable({
    data: contacts,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  if (isLoading) return <PageLoading />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  if (!contacts.length) {
    return (
      <div className="flex h-full">
        <EmptyState
          onImport={() => setShowUploadDialog(true)}
          onAdd={() => setShowAddDialog(true)}
        />
        {showAddDialog && (
          <AddContactDialog onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
        )}
        {showUploadDialog && <UploadCsvDialog onClose={() => setShowUploadDialog(false)} />}
      </div>
    );
  }

  const totalContacts = contacts.length;
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const startRow = currentPage * PAGE_SIZE + 1;
  const endRow = Math.min((currentPage + 1) * PAGE_SIZE, totalContacts);

  return (
    <div className="space-y-6">
      <PageHeader onImport={() => setShowUploadDialog(true)} onAdd={() => setShowAddDialog(true)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          icon={<Users className="text-primary h-6 w-6" />}
          iconBg="bg-primary/10"
          title="Усього контактів"
          value={formatNumber(totalContacts)}
          subtitle="Вся ваша база контактів"
        />
        <KpiCard
          icon={<Phone className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
          title="Оброблено цього місяця"
          value="842 / 1 247"
          subtitle="від загальної бази"
        />
        <KpiCard
          icon={<BarChart3 className="text-primary h-6 w-6" />}
          iconBg="bg-primary/10"
          title="Конверсія в цільову дію"
          value="34,2%%"
          subtitle="Цільові дії / Всі дзвінки"
        />
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          aria-label="Пошук контактів"
          placeholder="Пошук контактів за ім'ям або телефоном..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="border-border bg-background overflow-hidden rounded-xl border">
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Показано {startRow}-{endRow} з {formatNumber(totalContacts)} контактів
        </p>
        <div className="flex items-center gap-1">
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
          {Array.from({ length: Math.min(pageCount, 5) }).map((_, i) => {
            const pageIndex = getPageIndex(currentPage, pageCount, i);
            return (
              <Button
                key={pageIndex}
                variant={pageIndex === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            );
          })}
          {pageCount > 5 && (
            <>
              <span className="text-muted-foreground px-1 text-sm">…</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.setPageIndex(pageCount - 1)}
              >
                {pageCount}
              </Button>
            </>
          )}
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

      {showAddDialog && (
        <AddContactDialog onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
      )}
      {showUploadDialog && <UploadCsvDialog onClose={() => setShowUploadDialog(false)} />}
    </div>
  );
}

function PageHeader({ onImport, onAdd }: { onImport: () => void; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Контакти</h1>
        <p className="text-muted-foreground text-sm">
          Керуйте базою контактів для дзвінків ШІ-агента
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="px-6" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Імпорт CSV
        </Button>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Додати контакт
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onImport, onAdd }: { onImport: () => void; onAdd: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Users className="text-primary h-12 w-12" />
      <h2 className="mt-4 text-lg font-bold">Контактів ще немає</h2>
      <p className="text-muted-foreground mt-1 text-sm">Додайте перший контакт, щоб почати</p>
      <div className="mt-4 flex gap-3">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Імпорт CSV
        </Button>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Додати контакт
        </Button>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="border-border bg-background flex items-center gap-4 rounded-2xl border p-5">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-muted-foreground text-xs">{title}</p>
        <p className="my-1 text-2xl font-semibold">{value}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
    </div>
  );
}
