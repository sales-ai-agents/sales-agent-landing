"use client";

import Image from "next/image";

import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AgentNumber, NumberStatus } from "@dashboard/types";

interface NumberPickerProps {
  numbers: AgentNumber[];
  value: number;
  onChange: (value: number) => void;
}

interface StatusBadge {
  label: string;
  className: string;
}

const STATUS_BADGES: Record<NumberStatus, StatusBadge> = {
  ready: { label: "Готовий", className: "bg-green-100 text-green-600" },
  verification_required: {
    label: "Потрібна перевірка",
    className: "bg-gray-300 text-muted-foreground",
  },
  disabled: { label: "Вимкнено", className: "bg-gray-300 text-muted-foreground" },
};

const resolveBadge = (number: AgentNumber): StatusBadge => {
  if (number.is_active) return { label: "Основний", className: "bg-green-100 text-green-600" };
  return STATUS_BADGES[number.status] ?? STATUS_BADGES.disabled;
};

export const NumberPicker = ({ numbers, value, onChange }: NumberPickerProps) => {
  return (
    <div role="radiogroup" aria-label="Номер для дзвінків" className="space-y-2.5">
      {numbers.map((number) => {
        const isSelected = value === number.id;
        const badge = resolveBadge(number);

        return (
          <label
            key={number.id}
            className={cn(
              "border-input flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition-colors",
              isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
            )}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => checked && onChange(number.id)}
              aria-label={number.phone}
            />
            <Image src="/image/ua-flag.svg" alt="" width={24} height={16} aria-hidden="true" />
            <span className="text-sm font-medium">{number.phone}</span>
            <span
              className={cn(
                "ml-auto rounded-md px-2.5 py-0.5 text-xs font-medium",
                badge.className
              )}
            >
              {badge.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};
