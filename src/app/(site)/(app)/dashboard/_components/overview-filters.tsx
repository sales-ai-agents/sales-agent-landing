"use client";

import { FilterSelect } from "@/components/dashboard";
import { useAgents, useNumbers } from "@dashboard/hooks";

export const PERIOD_OPTIONS = [
  { value: 7, label: "7 днів" },
  { value: 30, label: "30 днів" },
  { value: 90, label: "90 днів" },
] as const;

export interface OverviewFilterState {
  days: number;
  agentId: number;
  numberId: number;
}

interface OverviewFiltersProps {
  value: OverviewFilterState;
  onChange: (value: OverviewFilterState) => void;
}

export const OverviewFilters = ({ value, onChange }: OverviewFiltersProps) => {
  const { data: agents = [] } = useAgents();
  const { data: numbers = [] } = useNumbers();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSelect
        label="Період"
        value={value.days}
        options={[...PERIOD_OPTIONS]}
        onChange={(days) => onChange({ ...value, days })}
      />
      <FilterSelect
        label="Агент"
        allLabel="Усі агенти"
        value={value.agentId}
        options={agents.map((agent) => ({ value: agent.id, label: agent.name }))}
        onChange={(agentId) => onChange({ ...value, agentId })}
      />
      <FilterSelect
        label="Номер"
        allLabel="Усі номери"
        value={value.numberId}
        options={numbers.map((number) => ({ value: number.id, label: number.phone }))}
        onChange={(numberId) => onChange({ ...value, numberId })}
      />
    </div>
  );
};
