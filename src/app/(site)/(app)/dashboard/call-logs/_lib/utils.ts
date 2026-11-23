import { format } from "date-fns";

import type { Agent } from "@dashboard/types";

const SECONDS_PER_MINUTE = 60;

export const toDateString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const resolveAgentName = (agentId: number | null, agents: Agent[]): string => {
  if (!agentId) return "—";
  return agents.find((a) => a.id === agentId)?.name ?? "—";
};

export const formatBilledMinutes = (billedSec: number | null): string => {
  if (billedSec === null) return "—";
  return `${(billedSec / SECONDS_PER_MINUTE).toFixed(1)} хв`;
};
