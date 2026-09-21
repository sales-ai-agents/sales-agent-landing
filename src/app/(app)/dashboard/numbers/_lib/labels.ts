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
  sip: { label: "АТС", className: "bg-[#15a326]/10 text-[#15a326]" },
  forward: { label: "Переадресація", className: "bg-[#ff680a]/10 text-[#ff680a]" },
  assigned: { label: "Включено в тариф", className: "text-muted-foreground" },
};

const STATUS_BADGES: Partial<Record<NumberStatus, SourceBadge>> = {
  verification_required: { label: "Не налаштовано", className: "bg-[#ff680a]/10 text-[#ff680a]" },
  disabled: { label: "Вимкнено", className: "bg-muted text-muted-foreground" },
};

export const resolveDisplayBadge = (source: NumberSource, status: NumberStatus): SourceBadge => {
  return STATUS_BADGES[status] ?? READY_SOURCE_BADGES[source];
};

export const formatDailyCap = (dailyCap: number): string | null =>
  dailyCap > 0 ? `${dailyCap} дзвінків/день` : null;
