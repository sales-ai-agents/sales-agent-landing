"use client";

import type { DateRange } from "react-day-picker";

import {
  Card,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { Agent } from "@dashboard/types";
import { DateRangePicker } from "./date-range-picker";

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

const ALL_AGENTS = "all";
const ALL_AGENTS_LABEL = "Усі агенти";

export const Filters = ({
  dateRange,
  onDateRangeChange,
  agentId,
  onAgentChange,
  agents,
  phoneInput,
  onPhoneInputChange,
  onPhoneSubmit,
}: FiltersProps) => (
  <Card className="p-6">
    <div className="grid gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Label>Діапазон дат</Label>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Агент</Label>
        <Select
          value={agentId ? String(agentId) : ALL_AGENTS}
          onValueChange={(value) => onAgentChange(value === ALL_AGENTS ? undefined : Number(value))}
        >
          <SelectTrigger className="w-full" aria-label="Агент">
            <SelectValue>
              {agentId
                ? (agents.find((agent) => agent.id === agentId)?.name ?? ALL_AGENTS_LABEL)
                : ALL_AGENTS_LABEL}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_AGENTS}>{ALL_AGENTS_LABEL}</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={String(agent.id)}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="calls-phone">Номер телефону</Label>
        <Input
          id="calls-phone"
          type="tel"
          inputMode="tel"
          placeholder="Введіть номер телефону"
          value={phoneInput}
          onChange={(event) => onPhoneInputChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && onPhoneSubmit()}
          onBlur={onPhoneSubmit}
        />
      </div>
    </div>
  </Card>
);
