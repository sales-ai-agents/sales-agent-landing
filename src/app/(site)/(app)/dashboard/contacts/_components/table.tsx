"use client";

import { Pencil, Search, Trash2 } from "lucide-react";
import { TagBadge } from "@/components/dashboard";
import {
  Badge,
  Button,
  Switch,
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { formatDateShort } from "@/lib/utils";
import type { Contact } from "@dashboard/types";
import { formatConsentLabel, formatLastCallResult } from "../_lib/utils";

interface TableProps {
  data: Contact[];
  search: string;
  onDelete: (id: number) => void;
  onEditTags: (contact: Contact) => void;
  onToggleDoNotCall: (id: number, current: boolean) => void;
  onToggleConsent: (id: number, current: Contact["consent"]) => void;
}

const COLUMN_COUNT = 7;

const normalize = (value: string): string => value.toLowerCase().replace(/\s/g, "");

const matchesSearch = (contact: Contact, search: string): boolean => {
  const query = normalize(search);
  if (!query) return true;
  return normalize(contact.name).includes(query) || normalize(contact.phone).includes(query);
};

const EmptyRow = () => (
  <TableRow>
    <TableCell colSpan={COLUMN_COUNT}>
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-10">
        <span className="bg-muted grid size-12 place-items-center rounded-full">
          <Search className="size-5" aria-hidden="true" />
        </span>
        <b className="text-foreground">Нічого не знайдено</b>
      </div>
    </TableCell>
  </TableRow>
);

interface ContactRowProps {
  contact: Contact;
  onDelete: (id: number) => void;
  onEditTags: (contact: Contact) => void;
  onToggleDoNotCall: (id: number, current: boolean) => void;
  onToggleConsent: (id: number, current: Contact["consent"]) => void;
}

const ConsentCell = ({
  contact,
  onToggleConsent,
}: Pick<ContactRowProps, "contact" | "onToggleConsent">) => {
  if (contact.consent === "") return <span className="text-muted-foreground">—</span>;
  const consent = formatConsentLabel(contact.consent);
  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        className="cursor-pointer rounded-full"
        onClick={() => onToggleConsent(contact.id, contact.consent)}
        aria-label="Змінити згоду на дзвінки"
      >
        <Badge variant={contact.consent === "granted" ? "success" : "warning"} dot>
          {consent.label}
        </Badge>
      </button>
      {contact.consent_at && (
        <span className="text-muted-foreground text-xs">
          {formatDateShort(contact.consent_at)}
          {contact.consent_source ? ` · ${contact.consent_source}` : ""}
        </span>
      )}
    </div>
  );
};

const LastActionCell = ({ contact }: { contact: Contact }) => {
  if (!contact.last_call_at) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-col">
      <b>{formatLastCallResult(contact.last_call_result) || "—"}</b>
      <span className="text-muted-foreground text-xs">{formatDateShort(contact.last_call_at)}</span>
    </div>
  );
};

const ContactRow = ({
  contact,
  onDelete,
  onEditTags,
  onToggleDoNotCall,
  onToggleConsent,
}: ContactRowProps) => (
  <TableRow>
    <TableCell className="font-medium">{contact.name || "—"}</TableCell>
    <TableCell className="tabular-nums">{contact.phone}</TableCell>
    <TableCell>
      <div className="flex flex-wrap items-center gap-1">
        {(contact.tags ?? []).map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onEditTags(contact)}
          aria-label="Редагувати теги"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </div>
    </TableCell>
    <TableCell>
      <ConsentCell contact={contact} onToggleConsent={onToggleConsent} />
    </TableCell>
    <TableCell>
      <LastActionCell contact={contact} />
    </TableCell>
    <TableCell>
      <Switch
        checked={contact.do_not_call}
        onCheckedChange={() => onToggleDoNotCall(contact.id, contact.do_not_call)}
        aria-label={`Не дзвонити ${contact.name || contact.phone}`}
      />
    </TableCell>
    <TableCell>
      <Button
        type="button"
        variant="destructive"
        size="icon-xs"
        onClick={() => onDelete(contact.id)}
        aria-label="Видалити контакт"
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </TableCell>
  </TableRow>
);

export const Table = ({ data, search, ...handlers }: TableProps) => {
  const rows = data.filter((contact) => matchesSearch(contact, search));
  return (
    <UiTable>
      <TableHeader>
        <TableRow>
          <TableHead>Ім&apos;я</TableHead>
          <TableHead>Телефон</TableHead>
          <TableHead>Теги</TableHead>
          <TableHead>Згода</TableHead>
          <TableHead>Остання дія</TableHead>
          <TableHead>Не дзвонити</TableHead>
          <TableHead>
            <span className="sr-only">Дії</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && <EmptyRow />}
        {rows.map((contact) => (
          <ContactRow key={contact.id} contact={contact} {...handlers} />
        ))}
      </TableBody>
    </UiTable>
  );
};
