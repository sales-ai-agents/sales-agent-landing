import type { Weekday } from "@/lib/schemas";

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Нд",
};

// BE not ready: no endpoint binds a contact base to an agent, so these mirror
// the supported integrations and are collected in the UI only.
export const CONTACT_BASE_OPTIONS = [
  { value: "google_sheets", label: "Google Sheets" },
  { value: "csv_xlsx", label: "CSV / XLSX" },
] as const;

export const formatAgentCode = (id: number | string): string =>
  `agent_${String(id).padStart(2, "0")}`;
