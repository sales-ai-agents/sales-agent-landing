import type { CallOutcome } from "@/types";

interface OutcomeConfig {
  label: string;
  variant: "success" | "warning" | "secondary" | "destructive";
}

const OUTCOME_CONFIG: Record<string, OutcomeConfig> = {
  meeting: { label: "Зустріч", variant: "success" },
  не_відповів: { label: "Не відповів", variant: "warning" },
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

export function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return "—";
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return min > 0 ? `${min}:${String(s).padStart(2, "0")}` : `0:${String(s).padStart(2, "0")}`;
}
