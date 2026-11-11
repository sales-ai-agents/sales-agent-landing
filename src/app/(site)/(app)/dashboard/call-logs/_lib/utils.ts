import { format } from "date-fns";
import type { Agent } from "@dashboard/types";

export const toDateString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const resolveAgentName = (agentId: number | null, agents: Agent[]): string => {
  if (!agentId) return "—";

  return agents.find((a) => a.id === agentId)?.name ?? "—";
};
