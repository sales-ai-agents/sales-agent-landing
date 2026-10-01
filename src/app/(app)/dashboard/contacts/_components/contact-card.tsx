import { Trash2 } from "lucide-react";

import { Button, Switch } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Contact } from "@dashboard/types";
import { getTagColor, formatConsentLabel, formatLastCallResult } from "../_lib/utils";

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: number) => void;
  onToggleDoNotCall: (id: number, current: boolean) => void;
}

export const ContactCard = ({ contact, onDelete, onToggleDoNotCall }: ContactCardProps) => {
  const tags = contact.tags ?? [];
  const consent = formatConsentLabel(contact.consent);
  const lastCallDate = contact.last_call_at
    ? new Date(contact.last_call_at).toLocaleDateString("uk-UA")
    : null;
  const lastCallResult = formatLastCallResult(contact.last_call_result);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{contact.name}</p>
          <p className="text-muted-foreground truncate text-sm">{contact.phone}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive h-8 w-8 shrink-0"
          onClick={() => onDelete(contact.id)}
          aria-label="Видалити контакт"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {tags.length > 0 && (
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
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-xs">
          {contact.consent !== "" && (
            <span className={cn("inline-flex items-center gap-1.5", consent.color)}>
              <span className={cn("inline-block h-1.5 w-1.5 rounded-full", consent.dot)} />
              {consent.label}
            </span>
          )}
          {lastCallDate && (
            <p className="text-muted-foreground mt-0.5">
              {lastCallDate}
              {lastCallResult ? ` · ${lastCallResult}` : ""}
            </p>
          )}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs">
          <span className="text-muted-foreground">Не дзвонити</span>
          <Switch
            checked={contact.do_not_call}
            onCheckedChange={() => onToggleDoNotCall(contact.id, contact.do_not_call)}
            aria-label="Не дзвонити"
            className="bg-muted"
          />
        </label>
      </div>
    </div>
  );
};
