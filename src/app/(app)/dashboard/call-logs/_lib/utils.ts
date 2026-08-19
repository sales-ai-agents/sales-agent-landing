import type { CallOutcome } from "@dashboard/types";

interface OutcomeConfig {
  label: string;
  variant: "success" | "warning" | "secondary" | "destructive";
}

const OUTCOME_CONFIG: Record<string, OutcomeConfig> = {
  meeting: { label: "Зустріч", variant: "success" },
  не_відповів: { label: "Не відповів", variant: "warning" },
  не_цікаво: { label: "Не цікаво", variant: "warning" },
  відмова: { label: "Відмова", variant: "destructive" },
  передзвонити: { label: "Передзвонити", variant: "secondary" },
};

const DEFAULT_OUTCOME_CONFIG: OutcomeConfig = { label: "", variant: "secondary" };

export function getOutcomeConfig(outcome: CallOutcome): OutcomeConfig {
  return OUTCOME_CONFIG[outcome] ?? { ...DEFAULT_OUTCOME_CONFIG, label: outcome };
}

export function getOutcomeEntries(): [string, OutcomeConfig][] {
  return Object.entries(OUTCOME_CONFIG);
}
