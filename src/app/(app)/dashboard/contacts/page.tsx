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
import { Search, Users, Phone, BarChart3, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button, Input } from "@/components/ui";
import {
  PageError,
  PageLoading,
  Pagination,
  AddContactDialog,
  UploadCsvDialog,
  PageEmpty,
} from "@/components/dashboard";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "@dashboard/hooks";
import { handleMutationError } from "@/lib/handle-mutation-error";
import { cn, formatNumber } from "@/lib/utils";
import type { ContactFormData } from "@/lib/schemas";
import { buildColumns } from "./_lib/table";
import { KpiCard } from "./_components/kpi-card";

const PAGE_SIZE = 12;

const ContactsPage = () => {
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

  const handleAddContact = (formData: ContactFormData) => {
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
      <PageEmpty
        icon={Phone}
        title="Контактів ще немає"
        description={
          <>
            <p className="text-muted-foreground mt-1 text-lg">Додайте перший контакт, щоб почати</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Імпорт CSV
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Додати контакт
              </Button>
            </div>
            {showAddDialog && (
              <AddContactDialog
                onSubmit={handleAddContact}
                onClose={() => setShowAddDialog(false)}
              />
            )}
            {showUploadDialog && <UploadCsvDialog onClose={() => setShowUploadDialog(false)} />}
          </>
        }
      />
    );
  }

  const totalContacts = contactStats?.total_contacts ?? contacts.length;
  const processedThisMonth = contactStats?.processed_this_month ?? 0;
  const conversionPct = contactStats?.conversion_pct;
  const currentPage = table.getState().pagination.pageIndex;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Контакти</h1>
          <p className="text-muted-foreground text-sm">
            Керуйте базою контактів для дзвінків ШІ-агента
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="px-6" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Імпорт CSV
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Додати контакт
          </Button>
        </div>
      </div>

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
          value={`${formatNumber(processedThisMonth)} / ${formatNumber(totalContacts)}`}
          subtitle={processedSubtitle}
        />
        <KpiCard
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

      <Pagination
        total={contacts.length}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        onPageChange={(page) => table.setPageIndex(page)}
        itemLabel="контактів"
      />

      {showAddDialog && (
        <AddContactDialog onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
      )}
      {showUploadDialog && <UploadCsvDialog onClose={() => setShowUploadDialog(false)} />}
    </div>
  );
};

export default ContactsPage;
