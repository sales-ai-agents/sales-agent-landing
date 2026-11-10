import type { CallOutcome } from "@dashboard/types";

export interface OutcomeConfig {
  label: string;
  variant: "success" | "warning" | "secondary" | "destructive";
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
  "не з'єдналось": { label: "Не з'єдналось", variant: "secondary" },
};

const DEFAULT_CONFIG: OutcomeConfig = { label: "Немає", variant: "secondary" };

export const getOutcomeConfig = (outcome: CallOutcome | null): OutcomeConfig => {
  if (!outcome) return DEFAULT_CONFIG;
  return OUTCOME_MAP[outcome] ?? { ...DEFAULT_CONFIG, label: outcome };
};
