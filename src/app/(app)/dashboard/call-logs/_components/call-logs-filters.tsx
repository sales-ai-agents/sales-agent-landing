"use client";

import type { DateRange } from "react-day-picker";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { Agent, CallStatusFilter } from "@dashboard/types";
import { DateRangePicker } from "./date-range-picker";
import React from "react";

const STATUS_OPTIONS: { value: CallStatusFilter; label: string }[] = [
  { value: "success", label: "Успішні" },
  { value: "failed", label: "Неуспішні" },
  { value: "attention", label: "Потребує уваги" },
];

interface CallLogsFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  status: CallStatusFilter | undefined;
  onStatusChange: (status: CallStatusFilter | undefined) => void;
  agentId: number | undefined;
  onAgentChange: (agentId: number | undefined) => void;
  agents: Agent[];
  phoneInput: string;
  onPhoneInputChange: (value: string) => void;
  onPhoneSubmit: () => void;
}

export function CallLogsFilters({
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  agentId,
  onAgentChange,
  agents,
  phoneInput,
  onPhoneInputChange,
  onPhoneSubmit,
}: CallLogsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <FilterField label="Діапазон дат">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </FilterField>

      <FilterField label="Статус">
        <Select
          value={status ?? "all"}
          onValueChange={(val) =>
            onStatusChange(val === "all" ? undefined : (val as CallStatusFilter))
          }
        >
          <SelectTrigger className="h-6! w-auto border-none p-0">
            <SelectValue>
              {status ? STATUS_OPTIONS.find((o) => o.value === status)?.label : "Усі статуси"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Агент">
        <Select
          value={agentId ? String(agentId) : "all"}
          onValueChange={(val) => onAgentChange(val === "all" ? undefined : Number(val))}
        >
          <SelectTrigger className="h-6! w-auto border-none p-0">
            <SelectValue>
              {agentId
                ? (agents.find((a) => a.id === agentId)?.name ?? "Усі агенти")
                : "Усі агенти"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі агенти</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={String(agent.id)}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Номер телефону">
        <input
          type="text"
          value={phoneInput}
          onChange={(e) => onPhoneInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onPhoneSubmit()}
          onBlur={onPhoneSubmit}
          placeholder="Введіть номер телефону"
          className="placeholder:text-muted-foreground h-6 w-full bg-transparent text-sm"
          aria-label="Пошук за номером телефону"
        />
      </FilterField>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border flex min-w-60 flex-col gap-1 rounded-lg border bg-white p-3">
      <span className="text-muted-foreground text-xs font-medium">{label}</span>
      {children}
    </div>
  );
}
