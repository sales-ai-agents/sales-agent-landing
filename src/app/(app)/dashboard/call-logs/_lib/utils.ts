import { format } from "date-fns";
import type { Agent, CrmSyncState } from "@dashboard/types";

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

export interface CrmStatusDisplay {
  label: string;
  color: string;
  dot?: string;
}

export const formatCrmStatus = (
  crmState?: CrmSyncState | null,
  crmSynced?: boolean | null
): CrmStatusDisplay => {
  if (crmState) {
    switch (crmState) {
      case "synced":
        return { label: "Синхронізовано", color: "text-green-600", dot: "bg-green-500" };
      case "failed":
        return { label: "Не синхронізовано", color: "text-red-500", dot: "bg-red-500" };
      case "pending":
        return { label: "Очікується", color: "text-orange-500", dot: "bg-orange-400" };
      case "not_configured":
      default:
        return { label: "—", color: "text-muted-foreground" };
    }
  }

  if (crmSynced === true) {
    return { label: "Синхронізовано", color: "text-green-600", dot: "bg-green-500" };
  }
  if (crmSynced === false) {
    return { label: "Не синхронізовано", color: "text-red-500", dot: "bg-red-500" };
  }

  return { label: "—", color: "text-muted-foreground" };
};
