"use client";

import type { DateRange } from "react-day-picker";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { Agent } from "@dashboard/types";
import { DateRangePicker } from "./date-range-picker";
import { FilterField } from "./filter-field";

interface FiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  agentId: number | undefined;
  onAgentChange: (agentId: number | undefined) => void;
  agents: Agent[];
  phoneInput: string;
  onPhoneInputChange: (value: string) => void;
  onPhoneSubmit: () => void;
}

export const Filters = ({
  dateRange,
  onDateRangeChange,
  agentId,
  onAgentChange,
  agents,
  phoneInput,
  onPhoneInputChange,
  onPhoneSubmit,
}: FiltersProps) => {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <FilterField label="Діапазон дат">
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
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
        <Input
          type="tel"
          inputMode="tel"
          aria-label="Пошук за номером телефону"
          placeholder="Введіть номер телефону"
          value={phoneInput}
          onChange={(e) => onPhoneInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onPhoneSubmit()}
          onBlur={onPhoneSubmit}
          className="h-6 border-none p-0"
        />
      </FilterField>
    </div>
  );
};
