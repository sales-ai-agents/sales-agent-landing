import { LayoutDashboard, Bot, Users, PhoneCall, Settings, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Огляд" },
  { href: "/dashboard/agents", icon: Bot, label: "Агенти" },
  { href: "/dashboard/contacts", icon: Users, label: "Контакти" },
  { href: "/dashboard/call-logs", icon: PhoneCall, label: "Дзвінки" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Тарифи і Оплата" },
  { href: "/dashboard/settings", icon: Settings, label: "Налаштування" },
] as const satisfies readonly NavItem[];
