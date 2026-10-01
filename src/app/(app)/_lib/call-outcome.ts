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
  зустріч: { label: "Зустріч", variant: "success" },
  відмова: { label: "Відмова", variant: "destructive" },
  нейтрально: { label: "Нейтрально", variant: "secondary" },
  "не відповів": { label: "Не відповів", variant: "warning" },
  "немає часу": { label: "Немає часу", variant: "warning" },
  "не цікаво": { label: "Не цікаво", variant: "warning" },
  скинув: { label: "Скинув", variant: "warning" },
  передзвонити: { label: "Передзвонити", variant: "secondary" },
  "погано чути": { label: "Погано чути", variant: "warning" },
  "не дійшли до людини": { label: "Не дійшли до людини", variant: "warning" },
};

const DEFAULT_CONFIG: OutcomeConfig = { label: "", variant: "secondary" };

export const getOutcomeConfig = (outcome: CallOutcome | null): OutcomeConfig => {
  if (!outcome) return DEFAULT_CONFIG;
  return OUTCOME_MAP[outcome] ?? { ...DEFAULT_CONFIG, label: outcome };
};

export const getOutcomeDisplay = (call: CallLog): OutcomeDisplay => {
  if (call.meeting_scheduled) {
    return { label: "Ціль досягнута", badgeClass: "bg-success/15/80 text-success", icon: "✓" };
  }

  switch (call.outcome) {
    case "не відповів":
    case "немає часу":
    case "нейтрально":
    case "скинув":
    case "погано чути":
    case "не дійшли до людини":
      return { label: "Без відповіді", badgeClass: "bg-muted text-muted-foreground", icon: "–" };
    case "передзвонити":
      return { label: "Передано", badgeClass: "bg-warning/10 text-warning", icon: "↗" };
    case "відмова":
    case "не цікаво":
      return { label: "Помилка", badgeClass: "bg-destructive/80 text-white", icon: "!" };
    default:
      return {
        label: call.outcome ?? "В процесі",
        badgeClass: "bg-muted text-muted-foreground",
        icon: "–",
      };
  }
};
