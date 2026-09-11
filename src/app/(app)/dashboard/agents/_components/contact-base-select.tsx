"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { UNSET_CONTACT_BASE_ID } from "@/lib/schemas";
import type { ContactBase } from "@dashboard/types";

const CONTACT_BASE_PLACEHOLDER = "Вибрати базу контактів";

interface ContactBaseSelectProps {
  id?: string;
  value: number;
  bases: ContactBase[];
  onChange: (value: number) => void;
}

export const ContactBaseSelect = ({ id, value, bases, onChange }: ContactBaseSelectProps) => {
  const selectedValue = value === UNSET_CONTACT_BASE_ID ? null : String(value);

  const renderLabel = (selected: string | null): string =>
    bases.find((base) => String(base.id) === selected)?.title ?? CONTACT_BASE_PLACEHOLDER;

  return (
    <Select value={selectedValue} onValueChange={(next) => onChange(Number(next))}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={CONTACT_BASE_PLACEHOLDER}>{renderLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {bases.map((base) => (
          <SelectItem key={base.id} value={String(base.id)}>
            {base.title}
            {base.source !== "all" && (
              <span className="text-muted-foreground"> ({base.contacts})</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
