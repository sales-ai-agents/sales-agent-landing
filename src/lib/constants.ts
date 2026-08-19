import { LayoutDashboard, Bot, Users, PhoneCall, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Дашборд" },
  { href: "/dashboard/agents", icon: Bot, label: "Агенти" },
  { href: "/dashboard/contacts", icon: Users, label: "Контакти" },
  { href: "/dashboard/call-logs", icon: PhoneCall, label: "Журнал дзвінків" },
  { href: "/dashboard/settings", icon: Settings, label: "Налаштування" },
] as const satisfies readonly NavItem[];
