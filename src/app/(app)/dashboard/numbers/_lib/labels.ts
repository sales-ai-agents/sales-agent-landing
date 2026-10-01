import type { NumberDirection, NumberSource, NumberStatus } from "@dashboard/types";

export const DIRECTION_LABELS: Record<NumberDirection, string> = {
  inbound: "Вхідні",
  outbound: "Вихідні",
  both: "Обидва",
};

interface SourceBadge {
  label: string;
  className: string;
}

const READY_SOURCE_BADGES: Record<NumberSource, SourceBadge> = {
  sip: { label: "АТС", className: "bg-success/10 text-success" },
  forward: { label: "Переадресація", className: "bg-warning/10 text-warning" },
  assigned: { label: "Включено в тариф", className: "text-muted-foreground" },
};

const STATUS_BADGES: Partial<Record<NumberStatus, SourceBadge>> = {
  verification_required: { label: "Не налаштовано", className: "bg-warning/10 text-warning" },
  disabled: { label: "Вимкнено", className: "bg-muted text-muted-foreground" },
};

export const resolveDisplayBadge = (source: NumberSource, status: NumberStatus): SourceBadge => {
  return STATUS_BADGES[status] ?? READY_SOURCE_BADGES[source];
};

export const formatDailyCap = (dailyCap: number): string | null =>
  dailyCap > 0 ? `${dailyCap} дзвінків/день` : null;
