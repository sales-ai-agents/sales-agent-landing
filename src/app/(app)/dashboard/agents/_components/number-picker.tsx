"use client";

import Image from "next/image";

import { Label, RadioGroup, RadioGroupItem } from "@/components/ui";
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
  ready: { label: "Готовий", className: "bg-green-100 text-green-700" },
  verification_required: { label: "Потрібна перевірка", className: "bg-gray-100 text-gray-600" },
  disabled: { label: "Вимкнено", className: "bg-gray-100 text-gray-500" },
};

const resolveBadge = (number: AgentNumber): StatusBadge => {
  if (number.is_active) return { label: "Основний", className: "bg-green-100 text-green-700" };
  return STATUS_BADGES[number.status] ?? STATUS_BADGES.disabled;
};

export const NumberPicker = ({ numbers, value, onChange }: NumberPickerProps) => {
  return (
    <RadioGroup
      aria-label="Номер для дзвінків"
      value={String(value)}
      onValueChange={(next) => onChange(Number(next))}
      className="space-y-2"
    >
      {numbers.map((number) => {
        const isSelected = value === number.id;
        const badge = resolveBadge(number);

        return (
          <Label
            key={number.id}
            htmlFor={`number-${number.id}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem id={`number-${number.id}`} value={String(number.id)} />
            <Image src="/image/ua-flag.svg" alt="" width={24} height={16} aria-hidden="true" />
            <span className="text-sm font-medium">{number.phone}</span>
            <span
              className={cn(
                "ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium",
                badge.className
              )}
            >
              {badge.label}
            </span>
          </Label>
        );
      })}
    </RadioGroup>
  );
};
