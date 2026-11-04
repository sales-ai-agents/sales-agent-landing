"use client";

import Image from "next/image";

import { Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AgentNumber, NumberStatus } from "@dashboard/types";

interface NumberPickerProps {
  numbers: AgentNumber[];
  value: number;
  onChange: (value: number) => void;
  showCallerId?: boolean;
}

const resolveCallerIdCaption = (callerId: boolean): string =>
  callerId ? "Клієнти бачитимуть цей номер" : "Клієнти бачитимуть номер Calls4U";

interface StatusBadge {
  label: string;
  className: string;
}

const STATUS_BADGES: Record<NumberStatus, StatusBadge> = {
  ready: { label: "Готовий", className: "bg-success/15 text-success" },
  verification_required: {
    label: "Потрібна перевірка",
    className: "bg-muted text-muted-foreground",
  },
  disabled: { label: "Вимкнено", className: "bg-muted text-muted-foreground" },
};

const resolveBadge = (number: AgentNumber): StatusBadge => {
  if (number.caller_id) return { label: "Основний", className: "bg-success/15 text-success" };
  return STATUS_BADGES[number.status] ?? STATUS_BADGES.disabled;
};

export const NumberPicker = ({ numbers, value, onChange, showCallerId }: NumberPickerProps) => {
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
            <div className="min-w-0">
              <span className="text-sm font-medium">{number.phone}</span>
              {showCallerId && (
                <p className="text-muted-foreground text-xs">
                  {resolveCallerIdCaption(number.caller_id)}
                </p>
              )}
            </div>
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
