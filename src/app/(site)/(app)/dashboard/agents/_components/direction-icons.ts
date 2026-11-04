import { Phone, ArrowRight, type LucideIcon } from "lucide-react";

import type { CallDirection } from "@/lib/schemas";

export const DIRECTION_ICONS: Record<CallDirection, LucideIcon> = {
  inbound: Phone,
  outbound: ArrowRight,
};
