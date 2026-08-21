"use client";

import { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PageError, PageEmpty } from "@/components/dashboard/page-states";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import { AddContactDialog } from "@/components/dashboard/add-contact-dialog";
import { UploadCsvDialog } from "@/components/dashboard/upload-csv-dialog";
import { useContacts, useCreateContact, useDeleteContact } from "@dashboard/hooks/use-contacts";
import { ApiError } from "@/lib/api-client";
import { resolveErrorMessage } from "@/lib/error-messages";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "@/lib/schemas";
import type { Contact } from "@dashboard/types";

const PAGE_SIZE = 8;
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
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(resolveErrorMessage(error.code));
        } else {
          toast.error("Щось пішло не так.");
        }
      },
    });
  };

  const handleDeleteContact = useCallback(
    (id: number) => {
      deleteContact.mutate(id, {
        onSuccess: () => {
          toast.success("Контакт видалено");
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(resolveErrorMessage(error.code));
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
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
        meta: { className: "hidden md:table-cell" },
      }),
      columnHelper.accessor("note", {
        header: "Нотатка",
        cell: (info) => (
          <span className="text-muted-foreground line-clamp-1 max-w-xs">{info.getValue()}</span>
        ),
        meta: { className: "hidden lg:table-cell" },
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
          <div className="flex justify-end gap-1">
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

  if (isLoading) return <TableSkeleton />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;
  if (!contacts.length)
    return (
      <PageEmpty
        icon={Users}
        title="Контактів ще немає"
        description="Додайте перший контакт, щоб почати"
        action={
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Додати контакт
          </Button>
        }
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Контакти</h1>
          <p className="text-muted-foreground">{contacts.length} всього контактів</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Завантажити CSV
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Додати контакт
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          aria-label="Пошук контактів"
          placeholder="Пошук за ім'ям або телефоном..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="pl-9"
        />
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
                  <tr key={row.id} className="hover:bg-muted/20 border-b last:border-0">
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

      {showAddDialog && (
        <AddContactDialog onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
      )}
      {showUploadDialog && <UploadCsvDialog onClose={() => setShowUploadDialog(false)} />}
    </div>
  );
}
