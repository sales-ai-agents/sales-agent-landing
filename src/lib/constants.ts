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

export interface VoiceOption {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

export const VOICE_OPTIONS = [
  { id: "sarah", name: "Sarah", type: "Професійний жіночий" },
  { id: "james", name: "James", type: "Професійний чоловічий" },
  { id: "emma", name: "Emma", type: "Дружній жіночий" },
  { id: "michael", name: "Michael", type: "Дружній чоловічий" },
] as const satisfies readonly VoiceOption[];
