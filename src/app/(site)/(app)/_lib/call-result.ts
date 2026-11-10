import {
  Ban,
  CalendarDays,
  CircleX,
  FileText,
  Phone,
  PhoneMissed,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { CallResultType } from "@dashboard/types";

export interface CallResultVisual {
  label: string;
  icon: LucideIcon;
  className: string;
}

export const CALL_RESULT_VISUALS: Record<CallResultType, CallResultVisual> = {
  booking: { label: "Запис", icon: CalendarDays, className: "bg-primary/10 text-primary" },
  payment: { label: "Оплата", icon: Wallet, className: "bg-success/15 text-success" },
  callback: { label: "Передзвонити", icon: Phone, className: "bg-warning/15 text-warning" },
  request: { label: "Заявка", icon: FileText, className: "bg-success/15 text-success" },
  refusal: { label: "Відмова", icon: CircleX, className: "bg-muted text-muted-foreground" },
  do_not_call: { label: "Не дзвонити", icon: Ban, className: "bg-muted text-muted-foreground" },
  needs_attention: {
    label: "Потребує уваги",
    icon: TriangleAlert,
    className: "bg-warning/15 text-warning",
  },
  not_reached: {
    label: "Не відповіли",
    icon: PhoneMissed,
    className: "bg-muted text-muted-foreground",
  },
};

export const ACTION_REQUIRED_LABEL = "Потрібна дія";
