"use client";

import { useState, useCallback, useMemo } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Search, Users, Phone, BarChart3, Upload, Plus, Download } from "lucide-react";
import { toast } from "sonner";

import { Button, Input } from "@/components/ui";
import {
  PageError,
  PageLoading,
  AddContactDialog,
  ImportContactsDialog,
  PageEmpty,
} from "@/components/dashboard";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
} from "@dashboard/hooks";
import { handleMutationError } from "@/lib/mutation-error";
import { formatNumber, cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api-config";
import type { ContactFormData } from "@/lib/schemas";
import { Table } from "./_components/table";
import { KpiCard } from "./_components/kpi-card";

const ContactsPage = () => {
  const { data, isLoading, error, refetch } = useContacts();

  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();

  const contacts = useMemo(() => {
    return data?.contacts ?? [];
  }, [data?.contacts]);

  const contactStats = data?.stats;

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const contact of contacts) {
      for (const tag of contact.tags ?? []) {
        counts[tag] = (counts[tag] ?? 0) + 1;
      }
    }
    return counts;
  }, [contacts]);

  const allTags = useMemo(() => Object.keys(tagCounts).sort(), [tagCounts]);

  const filteredContacts = useMemo(() => {
    if (!activeTag) return contacts;
    return contacts.filter((c) => c.tags?.includes(activeTag));
  }, [contacts, activeTag]);

  // The export-preview design (row selection, duplicate/invalid counts) needs a backend
  // endpoint that returns those stats and a per-row breakdown. The current API only exposes
  // GET /app/contacts/export, which streams a CSV directly. Until a preview endpoint exists,
  // export stays a direct download of the current search results.
  const handleExport = useCallback(() => {
    const exportUrl = apiUrl.contactsExport(globalFilter || undefined);
    window.open(exportUrl, "_blank");
  }, [globalFilter]);

  const handleAddContact = useCallback(
    (formData: ContactFormData) => {
      createContact.mutate(formData, {
        onSuccess: () => {
          toast.success("Контакт додано");
          setShowAddDialog(false);
        },
        onError: (err) => handleMutationError(err),
      });
    },
    [createContact]
  );

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
                Імпорт контактів
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
            {showUploadDialog && (
              <ImportContactsDialog onClose={() => setShowUploadDialog(false)} />
            )}
          </>
        }
      />
    );
  }

  const totalContacts = contactStats?.total_contacts ?? contacts.length;
  const processedThisMonth = contactStats?.processed_this_month ?? 0;
  const conversionPct = contactStats?.conversion_pct;

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
          <Button variant="outline" className="px-6" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Експорт CSV
          </Button>
          <Button variant="outline" className="px-6" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Імпорт контактів
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

      <div className="border-border flex flex-wrap gap-2 rounded-lg border bg-white px-4 py-2">
        <Button
          onClick={() => setActiveTag(null)}
          variant="outline"
          className={cn(
            "items-center gap-1.5 border px-3 py-1.5 text-xs",
            !activeTag
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground"
          )}
        >
          Усі контакти <span className="font-semibold">{contacts.length}</span>
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant="outline"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={cn(
              "items-center gap-1.5 text-xs",
              activeTag === tag
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground"
            )}
          >
            {tag} <span className="font-semibold">{tagCounts[tag]}</span>
          </Button>
        ))}
      </div>

      <div className="border-border bg-background overflow-hidden rounded-xl border">
        <Table
          data={filteredContacts}
          pageSize={filteredContacts.length}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          sorting={sorting}
          onSortingChange={setSorting}
          onDelete={handleDeleteContact}
          onToggleDoNotCall={handleToggleDoNotCall}
        />
      </div>

      {showAddDialog && (
        <AddContactDialog onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
      )}
      {showUploadDialog && <ImportContactsDialog onClose={() => setShowUploadDialog(false)} />}
    </div>
  );
};

export default ContactsPage;
