"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";

export interface FilterOption {
  value: number;
  label: string;
}

interface FilterSelectProps {
  label: string;
  allLabel?: string;
  value: number;
  options: FilterOption[];
  onChange: (value: number) => void;
}

const ALL_VALUE = "all";

export const FilterSelect = ({ label, allLabel, value, options, onChange }: FilterSelectProps) => {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? allLabel;

  return (
    <Select
      value={allLabel && value === 0 ? ALL_VALUE : String(value)}
      onValueChange={(next) => onChange(next === ALL_VALUE ? 0 : Number(next))}
    >
      <SelectTrigger aria-label={label} data-variant="pill" className="min-w-40">
        <SelectValue>{selectedLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
