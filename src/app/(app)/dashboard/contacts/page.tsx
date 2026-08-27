"use client";

import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, Users, Phone, BarChart3 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageError, PageLoading } from "@/components/dashboard/page-states";
import { AddContactDialog } from "@/components/dashboard/add-contact-dialog";
import { UploadCsvDialog } from "@/components/dashboard/upload-csv-dialog";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "@dashboard/hooks/use-contacts";
import { handleMutationError } from "@/lib/handle-mutation-error";
import { cn, formatNumber, getPageIndex } from "@/lib/utils";
import type { ContactFormData } from "@/lib/schemas";
import { buildColumns } from "./_lib/columns";
import { ContactsPageHeader } from "./_components/contacts-page-header";
import { ContactsEmptyState } from "./_components/contacts-empty-state";
import { ContactsKpiCard } from "./_components/contacts-kpi-card";

const PAGE_SIZE = 12;

export default function ContactsPage() {
  const { data, isLoading, error, refetch } = useContacts();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();

  const contacts = data?.contacts ?? [];
  const contactStats = data?.stats;

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleAddContact = (formData: ContactFormData): void => {
    createContact.mutate(formData, {
      onSuccess: () => {
        toast.success("Контакт додано");
        setShowAddDialog(false);
      },
      onError: (err) => handleMutationError(err),
    });
  };

  const handleDeleteContact = useCallback(
    (id: number) => {
      deleteContact.mutate(id, {
        onSuccess: () => toast.success("Контакт видалено"),
        onError: (err) => handleMutationError(err),
      });
    },
    [deleteContact]
  );

  const handleToggleDoNotCall = useCallback(
    (id: number, current: boolean) => {
      updateContact.mutate(
        { id, do_not_call: !current },
        { onError: (err) => handleMutationError(err) }
      );
    },
    [updateContact]
  );

  const columns = useMemo(
    () => buildColumns(handleDeleteContact, handleToggleDoNotCall),
    [handleDeleteContact, handleToggleDoNotCall]
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
        <ContactsEmptyState
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

  const totalContacts = contactStats?.total_contacts ?? contacts.length;
  const processedThisMonth = contactStats?.processed_this_month ?? 0;
  const conversionPct = contactStats?.conversion_pct;
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const startRow = currentPage * PAGE_SIZE + 1;
  const endRow = Math.min((currentPage + 1) * PAGE_SIZE, contacts.length);

  const processedSubtitle =
    totalContacts > 0
      ? `${((processedThisMonth / totalContacts) * 100).toFixed(1)}% від загальної бази`
      : "від загальної бази";

  const conversionValue =
    conversionPct !== null && conversionPct !== undefined
      ? `${conversionPct.toFixed(1).replace(".", ",")}%`
      : "—";

  return (
    <div className="space-y-6">
      <ContactsPageHeader
        onImport={() => setShowUploadDialog(true)}
        onAdd={() => setShowAddDialog(true)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContactsKpiCard
          icon={<Users className="text-primary h-6 w-6" />}
          iconBg="bg-primary/10"
          title="Усього контактів"
          value={formatNumber(totalContacts)}
          subtitle="Вся ваша база контактів"
        />
        <ContactsKpiCard
          icon={<Phone className="h-6 w-6 text-green-600" />}
          iconBg="bg-green-100"
          title="Оброблено цього місяця"
          value={`${formatNumber(processedThisMonth)} / ${formatNumber(totalContacts)}`}
          subtitle={processedSubtitle}
        />
        <ContactsKpiCard
          icon={<BarChart3 className="text-primary h-6 w-6" />}
          iconBg="bg-primary/10"
          title="Конверсія в цільову дію"
          value={conversionValue}
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
          Показано {startRow}-{endRow} з {formatNumber(contacts.length)} контактів
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
