import type { AgentNumber, NumberDirection, NumberStatus } from "@dashboard/types";

export const DIRECTION_LABELS: Record<NumberDirection, string> = {
  inbound: "Вхідні",
  outbound: "Вихідні",
  both: "Обидва",
};

export const STATUS_LABELS: Record<NumberStatus, string> = {
  ready: "Працює",
  verification_required: "Очікує першого дзвінка",
  disabled: "Вимкнено",
};

export const resolveNumberTypeLabel = (number: AgentNumber): string => {
  switch (number.source) {
    case "assigned":
      return "Номер Calls4U";
    case "sip":
      return "Ваша АТС";
    case "forward":
      return "Переадресація з вашого номера";
    default:
      return "";
  }
};

interface CallerIdBadge {
  label: string;
  className: string;
  hint?: string;
}

const CALLER_ID_VISIBLE: CallerIdBadge = {
  label: "Видно при дзвінках агента",
  className: "bg-success/10 text-success",
};

const CALLER_ID_INBOUND_ONLY: CallerIdBadge = {
  label: "Лише вхідні",
  className: "bg-muted text-muted-foreground",
  hint: "Коли агент дзвонить, людина бачить номер Calls4U, а не цей: оператор не пропускає номер, який не належить Calls4U.",
};

export const resolveCallerIdBadge = (callerId: boolean): CallerIdBadge =>
  callerId ? CALLER_ID_VISIBLE : CALLER_ID_INBOUND_ONLY;

export const formatDailyCap = (dailyCap: number): string | null =>
  dailyCap > 0 ? `${dailyCap} дзвінків/день` : null;
