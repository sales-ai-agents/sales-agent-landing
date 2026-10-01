import { format } from "date-fns";
import type { Agent } from "@dashboard/types";

export const toDateString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const resolveAgentName = (agentId: number | null, agents: Agent[]): string => {
  if (!agentId) return "—";

  return agents.find((a) => a.id === agentId)?.name ?? "—";
};

export const formatTranscriptTime = (index: number, totalSec: number | null): string => {
  if (!totalSec) return "00:00";
  const approxSec = Math.round((index / 10) * 30);
  const m = Math.floor(approxSec / 60);
  const s = approxSec % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
