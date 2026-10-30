"use client";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { AgentNumber } from "@dashboard/types";

interface NumberSelectProps {
  id: string;
  numbers: AgentNumber[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

const PLACEHOLDER = "Оберіть номер";
const DEFAULT_LABEL = "Ваш номер";

const resolvePhoneLabel = (numbers: AgentNumber[], value: string | null): string => {
  const match = numbers.find((number) => String(number.id) === value);
  return match?.phone ?? PLACEHOLDER;
};

export const NumberSelect = ({
  id,
  numbers,
  value,
  onValueChange,
  label = DEFAULT_LABEL,
}: NumberSelectProps) => {
  const handleValueChange = (next: string | null): void => onValueChange(next ?? "");

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue>{(selected) => resolvePhoneLabel(numbers, selected)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {numbers.map((number) => (
            <SelectItem key={number.id} value={String(number.id)}>
              {number.phone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
