"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { DEFAULT_NUMBER_ID } from "@/lib/schemas";
import type { AgentNumber } from "@dashboard/types";

interface NumberSelectProps {
  id?: string;
  value: number;
  numbers: AgentNumber[];
  onChange: (value: number) => void;
}

const NUMBER_PLACEHOLDER = "Оберіть номер";
const DEFAULT_NUMBER_LABEL = "Номер за замовчуванням";

export const NumberSelect = ({ id, value, numbers, onChange }: NumberSelectProps) => {
  const renderLabel = (selected: string | null): string =>
    numbers.find((number) => String(number.id) === selected)?.phone ?? DEFAULT_NUMBER_LABEL;

  return (
    <Select value={String(value)} onValueChange={(next) => onChange(Number(next))}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={NUMBER_PLACEHOLDER}>{renderLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={String(DEFAULT_NUMBER_ID)}>{DEFAULT_NUMBER_LABEL}</SelectItem>
        {numbers.map((number) => (
          <SelectItem key={number.id} value={String(number.id)}>
            {number.phone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
