"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

import { Download, Plus, Search, Upload, Users } from "lucide-react";
import {
  PageError,
  PageLoading,
  PageHead,
  PageEmpty,
  FilterSelect,
  AddContactDialog,
  ImportContactsDialog,
  ExportContactsDialog,
} from "@/components/dashboard";
import { Button, Card, Input } from "@/components/ui";
import {
  useContactBases,
  useContacts,
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
  useDeleteContactTag,
} from "@dashboard/hooks";
import { CONTACT_ERROR_MESSAGES } from "@/lib/error-messages";
import { handleMutationError } from "@/lib/mutation-error";
import { formatNumber } from "@/lib/utils";
import type { ContactFormData } from "@/lib/schemas";
import type { ConsentStatus, Contact } from "@dashboard/types";
import { ContactStats } from "./_components/contact-stats";
import { Table } from "./_components/table";
import { CreateTagDialog } from "./_components/create-tag-dialog";
import { EditTagsDialog } from "./_components/edit-tags-dialog";
import { TagFilterBar } from "./_components/tag-filter-bar";

const NO_BASE = 0;

const ContactsPage = () => {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [baseId, setBaseId] = useState(NO_BASE);
  const { data, isLoading, error, refetch } = useContacts({
    tag: activeTag ?? undefined,
    baseId: baseId === NO_BASE ? undefined : baseId,
  });
  const { data: bases = [] } = useContactBases();

  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();
  const deleteTag = useDeleteContactTag();

  const contacts = useMemo(() => data?.contacts ?? [], [data?.contacts]);
  const serverTags = useMemo(() => data?.tags ?? [], [data?.tags]);
  const contactStats = data?.stats;

  const [globalFilter, setGlobalFilter] = useState("");
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const persistedTagNames = useMemo(() => serverTags.map(({ tag }) => tag), [serverTags]);
  const pendingDraftTags = useMemo(
    () => draftTags.filter((tag) => !persistedTagNames.includes(tag)),
    [draftTags, persistedTagNames]
  );
  const tagOptions = useMemo(
    () => [...persistedTagNames, ...pendingDraftTags],
    [persistedTagNames, pendingDraftTags]
  );

  const handleAddContact = useCallback(
    (formData: ContactFormData, tags: string[]) => {
      createContact.mutate(tags.length > 0 ? { ...formData, tags } : formData, {
        onSuccess: () => {
          toast.success("Контакт додано");
          setShowAddDialog(false);
        },
        onError: (err) => handleMutationError(err, CONTACT_ERROR_MESSAGES),
      });
    },
    [createContact]
  );

  const handleDeleteContact = useCallback(
    (id: number) => {
      deleteContact.mutate(id, {
        onSuccess: () => toast.success("Контакт видалено"),
        onError: (err) => handleMutationError(err, CONTACT_ERROR_MESSAGES),
      });
    },
    [deleteContact]
  );

  const handleToggleDoNotCall = useCallback(
    (id: number, current: boolean) => {
      updateContact.mutate(
        { id, do_not_call: !current },
        { onError: (err) => handleMutationError(err, CONTACT_ERROR_MESSAGES) }
      );
    },
    [updateContact]
  );

  const handleToggleConsent = useCallback(
    (id: number, current: ConsentStatus) => {
      const next: ConsentStatus = current === "granted" ? "" : "granted";
      updateContact.mutate(
        { id, consent: next },
        {
          onSuccess: () => toast.success(next === "granted" ? "Згоду отримано" : "Згоду знято"),
          onError: (err) => handleMutationError(err, CONTACT_ERROR_MESSAGES),
        }
      );
    },
    [updateContact]
  );

  const handleSaveTags = useCallback(
    (tags: string[]) => {
      if (!editingContact) return;
      updateContact.mutate(
        { id: editingContact.id, tags },
        {
          onSuccess: () => {
            toast.success("Теги оновлено");
            setEditingContact(null);
          },
          onError: (err) => handleMutationError(err, CONTACT_ERROR_MESSAGES),
        }
      );
    },
    [editingContact, updateContact]
  );

  const handleCreateTag = useCallback((tag: string) => {
    setDraftTags((current) => (current.includes(tag) ? current : [...current, tag]));
  }, []);

  const handleDeleteTag = useCallback(
    (tag: string) => {
      deleteTag.mutate(tag, {
        onSuccess: () => {
          toast.success(`Тег «${tag}» видалено`);
          if (activeTag === tag) setActiveTag(null);
        },
        onError: (err) => handleMutationError(err),
      });
    },
    [deleteTag, activeTag]
  );

  if (isLoading) return <PageLoading message="Завантажуємо контакти..." />;
  if (error) return <PageError message={error.message} onRetry={refetch} />;

  const totalContacts = contactStats?.total_contacts ?? 0;
  const isEmptyAccount = totalContacts === 0 && !activeTag && baseId === NO_BASE;

  const emptyActions = (
    <>
      <Button type="button" variant="outline" onClick={() => setShowUploadDialog(true)}>
        <Upload aria-hidden="true" />
        Імпорт контактів
      </Button>
      <Button type="button" onClick={() => setShowAddDialog(true)}>
        <Plus aria-hidden="true" />
        Додати контакт
      </Button>
    </>
  );

  const actions = (
    <>
      <Button type="button" variant="outline" onClick={() => setShowExportDialog(true)}>
        <Download aria-hidden="true" />
        Експорт CSV
      </Button>
      {emptyActions}
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        word="контакти"
        title="Контакти"
        description="Керуйте базою контактів для дзвінків ШІ-агента"
        actions={isEmptyAccount ? undefined : actions}
      />

      {isEmptyAccount ? (
        <PageEmpty
          icon={Users}
          title="Контактів ще немає"
          description={<p>Додайте перший контакт, щоб почати</p>}
          action={emptyActions}
        />
      ) : (
        <>
          <ContactStats
            total={totalContacts}
            processedThisMonth={contactStats?.processed_this_month ?? 0}
            conversionPct={contactStats?.conversion_pct}
          />
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-64 flex-1">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                type="search"
                className="pl-10"
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Пошук контактів за ім'ям або телефоном..."
                aria-label="Пошук контактів"
              />
            </div>
            {bases.length > 0 && (
              <FilterSelect
                label="База контактів"
                allLabel="Усі бази"
                value={baseId}
                options={bases.map((base) => ({
                  value: base.id,
                  label: `${base.title} (${formatNumber(base.contacts)})`,
                }))}
                onChange={setBaseId}
              />
            )}
          </div>

          <TagFilterBar
            totalContacts={totalContacts}
            tags={serverTags}
            draftTags={pendingDraftTags}
            activeTag={activeTag}
            onSelect={setActiveTag}
            onCreate={() => setShowTagDialog(true)}
            onDelete={handleDeleteTag}
          />

          <Card className="overflow-hidden p-0">
            <Table
              data={contacts}
              search={globalFilter}
              onDelete={handleDeleteContact}
              onEditTags={setEditingContact}
              onToggleDoNotCall={handleToggleDoNotCall}
              onToggleConsent={handleToggleConsent}
            />
            <p className="text-muted-foreground px-4 py-3 text-sm">
              Показано {contacts.length} з {formatNumber(totalContacts)} контактів
            </p>
          </Card>
        </>
      )}

      {showAddDialog && (
        <AddContactDialog
          tagOptions={tagOptions}
          onSubmit={handleAddContact}
          onClose={() => setShowAddDialog(false)}
        />
      )}
      {showTagDialog && (
        <CreateTagDialog
          existingTags={tagOptions}
          onCreated={handleCreateTag}
          onClose={() => setShowTagDialog(false)}
        />
      )}
      {editingContact && (
        <EditTagsDialog
          contact={editingContact}
          tagOptions={tagOptions}
          isSaving={updateContact.isPending}
          onSave={handleSaveTags}
          onClose={() => setEditingContact(null)}
        />
      )}
      {showUploadDialog && <ImportContactsDialog onClose={() => setShowUploadDialog(false)} />}
      {showExportDialog && (
        <ExportContactsDialog
          search={globalFilter || undefined}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  );
};

export default ContactsPage;
