import type { CallOutcome, CallLog } from "@dashboard/types";

export interface OutcomeConfig {
  label: string;
  variant: "success" | "warning" | "secondary" | "destructive";
}

interface OutcomeDisplay {
  label: string;
  badgeClass: string;
  icon: string;
}

const OUTCOME_MAP: Record<string, OutcomeConfig> = {
  meeting: { label: "Зустріч", variant: "success" },
  не_відповів: { label: "Не відповів", variant: "warning" },
  не_цікаво: { label: "Не цікаво", variant: "warning" },
  відмова: { label: "Відмова", variant: "destructive" },
  передзвонити: { label: "Передзвонити", variant: "secondary" },
};

const DEFAULT_CONFIG: OutcomeConfig = { label: "", variant: "secondary" };

export const getOutcomeConfig = (outcome: CallOutcome | null): OutcomeConfig => {
  if (!outcome) return DEFAULT_CONFIG;
  return OUTCOME_MAP[outcome] ?? { ...DEFAULT_CONFIG, label: outcome };
};

export const getOutcomeDisplay = (call: CallLog): OutcomeDisplay => {
  if (call.meeting_scheduled) {
    return { label: "Ціль досягнута", badgeClass: "bg-green-100/80 text-green-900", icon: "✓" };
  }

  switch (call.outcome) {
    case "не_відповів":
      return { label: "Без відповіді", badgeClass: "bg-gray-100 text-gray-700", icon: "–" };
    case "передзвонити":
      return { label: "Передано", badgeClass: "bg-amber-100/80 text-amber-900", icon: "↗" };
    case "відмова":
    case "не_цікаво":
      return { label: "Помилка", badgeClass: "bg-red-100/80 text-red-900", icon: "!" };
    default:
      return {
        label: call.outcome ?? "В процесі",
        badgeClass: "bg-gray-100 text-gray-700",
        icon: "–",
      };
  }
};
