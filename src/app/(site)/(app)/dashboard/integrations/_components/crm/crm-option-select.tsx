"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { CrmOption } from "@dashboard/types";
import { CRM_DEFAULT_OPTION } from "../../_lib/crm-providers";

interface CrmOptionSelectProps {
  id: string;
  label: string;
  options: CrmOption[];
  value: number | null | undefined;
  disabled: boolean;
  onChange: (value: number | null) => void;
}

const DEFAULT_LABEL = "За замовчуванням CRM";

export const CrmOptionSelect = ({
  id,
  label,
  options,
  value,
  disabled,
  onChange,
}: CrmOptionSelectProps) => {
  const selected = value === null || value === undefined ? CRM_DEFAULT_OPTION : String(value);

  const renderLabel = (key: string | null): string =>
    options.find((option) => String(option.id) === key)?.title ?? DEFAULT_LABEL;

  const handleChange = (next: string | null): void => {
    if (!next) return;
    onChange(next === CRM_DEFAULT_OPTION ? null : Number(next));
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={selected} disabled={disabled} onValueChange={handleChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{renderLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CRM_DEFAULT_OPTION}>{DEFAULT_LABEL}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={String(option.id)}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
